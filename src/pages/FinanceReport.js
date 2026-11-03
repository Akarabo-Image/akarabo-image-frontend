import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ErrorMessage } from '../components/ErrorMessage';
import { PageHeader } from '../components/PageHeader';
import { StatCard } from '../components/StatCard';
import { useAuth } from '../context/AuthContext';
import { expenseService } from '../services/expenseService';
import { paymentService } from '../services/paymentService';
import { userService } from '../services/userService';
import { formatMoney } from '../util/formatters';
function periodBounds(period, year, month) {
    const from = period === 'year' ? new Date(year, 0, 1) : new Date(year, month, 1);
    const to = period === 'year' ? new Date(year + 1, 0, 1) : new Date(year, month + 1, 1);
    return {
        dateFrom: from.toISOString(),
        dateTo: new Date(to.getTime() - 1).toISOString(),
    };
}
async function listAll(fetchPage) {
    const first = await fetchPage(1);
    const pageCount = Math.ceil(first.meta.total / first.meta.limit);
    const remaining = await Promise.all(Array.from({ length: Math.max(0, pageCount - 1) }, (_, index) => fetchPage(index + 2)));
    return [first.data, ...remaining.map((page) => page.data)].flat();
}
function csvCell(value) {
    return `"${String(value).replace(/"/g, '""')}"`;
}
export function FinanceReport() {
    const { user } = useAuth();
    const [period, setPeriod] = useState('month');
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth());
    const [recorderId, setRecorderId] = useState('');
    const bounds = useMemo(() => periodBounds(period, year, month), [period, year, month]);
    const key = ['finance-report', period, year, month];
    const report = useQuery({
        queryKey: key,
        queryFn: async () => {
            const [payments, expenses] = await Promise.all([
                listAll((page) => paymentService.list({
                    page,
                    limit: 100,
                    dateFrom: bounds.dateFrom,
                    dateTo: bounds.dateTo,
                })),
                listAll((page) => expenseService.list({
                    page,
                    limit: 100,
                    dateFrom: bounds.dateFrom,
                    dateTo: bounds.dateTo,
                })),
            ]);
            return { payments, expenses };
        },
        enabled: user?.role === 'OWNER',
    });
    const cashiers = useQuery({
        queryKey: ['finance-report-cashiers'],
        queryFn: async () => {
            const roles = ['CASHIER', 'MANAGER', 'OWNER'];
            const usersByRole = await Promise.all(roles.map(async (role) => {
                const first = await userService.list({ page: 1, limit: 100, role });
                const pages = await Promise.all(Array.from({
                    length: Math.max(0, Math.ceil(first.meta.total / first.meta.limit) - 1),
                }, (_, index) => userService.list({ page: index + 2, limit: 100, role })));
                return [first.data, ...pages.map((page) => page.data)].flat();
            }));
            return usersByRole.flat();
        },
        enabled: user?.role === 'OWNER',
    });
    const names = useMemo(() => new Map((cashiers.data ?? []).map((cashier) => [
        cashier.id,
        cashier.fullName,
    ])), [cashiers.data]);
    const transactions = useMemo(() => {
        const payments = (report.data?.payments ?? []).map((payment) => ({
            kind: 'received',
            id: payment.id,
            amount: payment.amount,
            currency: payment.currency,
            at: payment.createdAt,
            recorderId: payment.recordedByUserId,
            description: `${payment.method.replace(/_/g, ' ')}${payment.reference ? ` · ${payment.reference}` : ''}`,
            status: payment.status,
        }));
        const expenses = (report.data?.expenses ?? []).map((expense) => ({
            kind: 'spent',
            id: expense.id,
            amount: expense.amount,
            currency: expense.currency,
            at: expense.createdAt,
            recorderId: expense.recordedByUserId,
            description: `${expense.category.replace(/_/g, ' ')} · ${expense.description}`,
            status: expense.status,
        }));
        return [...payments, ...expenses]
            .filter((transaction) => !recorderId || transaction.recorderId === recorderId)
            .sort((left, right) => right.at.localeCompare(left.at));
    }, [report.data, recorderId]);
    const currencyTotals = useMemo(() => {
        const totals = new Map();
        for (const transaction of transactions) {
            const totalsForCurrency = totals.get(transaction.currency) ?? {
                received: 0,
                spent: 0,
            };
            if (transaction.kind === 'received' && transaction.status === 'COMPLETED')
                totalsForCurrency.received += transaction.amount;
            if (transaction.kind === 'spent' && transaction.status === 'RECORDED')
                totalsForCurrency.spent += transaction.amount;
            totals.set(transaction.currency, totalsForCurrency);
        }
        return [...totals.entries()].map(([currency, totalsForCurrency]) => ({
            currency,
            ...totalsForCurrency,
            balance: totalsForCurrency.received - totalsForCurrency.spent,
        }));
    }, [transactions]);
    const reportLabel = period === 'year'
        ? String(year)
        : `${new Intl.DateTimeFormat(undefined, { month: 'long' }).format(new Date(year, month, 1))} ${year}`;
    const downloadReport = () => {
        const rows = [
            [
                'Type',
                'Recorded at',
                'Recorded by',
                'Description',
                'Amount',
                'Currency',
                'Status',
            ],
            ...transactions.map((transaction) => [
                transaction.kind === 'received' ? 'Money received' : 'Expense',
                new Date(transaction.at).toLocaleString(),
                names.get(transaction.recorderId) ?? 'Former or unknown staff',
                transaction.description,
                transaction.amount,
                transaction.currency,
                transaction.status,
            ]),
        ];
        const csv = rows.map((row) => row.map(csvCell).join(',')).join('\r\n');
        const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
        const link = document.createElement('a');
        link.href = url;
        link.download = `akarabo-finance-${period}-${period === 'year' ? year : `${year}-${String(month + 1).padStart(2, '0')}`}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };
    return (_jsxs(_Fragment, { children: [_jsx(PageHeader, { title: "Financial reports", subtitle: "Review money received and expenses by date or cashier, then export a monthly or yearly report.", actions: _jsx("button", { className: "ak-button ak-button--primary", onClick: downloadReport, disabled: report.isLoading || !transactions.length, children: "Download report" }) }), _jsx("section", { className: "ak-card ak-mb-6", children: _jsxs("div", { className: "ak-card__body ak-form--finance ak-row ak-gap-3 ak-wrap", children: [_jsxs("label", { className: "ak-field", children: [_jsx("span", { className: "ak-field__label", children: "Report period" }), _jsxs("select", { className: "ak-select", value: period, onChange: (event) => setPeriod(event.target.value), children: [_jsx("option", { value: "month", children: "Monthly" }), _jsx("option", { value: "year", children: "Yearly" })] })] }), _jsxs("label", { className: "ak-field", children: [_jsx("span", { className: "ak-field__label", children: "Year" }), _jsx("select", { className: "ak-select", value: year, onChange: (event) => setYear(Number(event.target.value)), children: Array.from({ length: 26 }, (_, index) => new Date().getFullYear() - index).map((option) => (_jsx("option", { value: option, children: option }, option))) })] }), period === 'month' && (_jsxs("label", { className: "ak-field", children: [_jsx("span", { className: "ak-field__label", children: "Month" }), _jsx("select", { className: "ak-select", value: month, onChange: (event) => setMonth(Number(event.target.value)), children: Array.from({ length: 12 }, (_, index) => (_jsx("option", { value: index, children: new Intl.DateTimeFormat(undefined, {
                                            month: 'long',
                                        }).format(new Date(year, index, 1)) }, index))) })] })), _jsxs("label", { className: "ak-field", children: [_jsx("span", { className: "ak-field__label", children: "Recorded by" }), _jsxs("select", { className: "ak-select", value: recorderId, onChange: (event) => setRecorderId(event.target.value), children: [_jsx("option", { value: "", children: "All staff" }), cashiers.data?.map((cashier) => (_jsxs("option", { value: cashier.id, children: [cashier.fullName, " \u00B7 ", cashier.role.toLowerCase()] }, cashier.id)))] })] })] }) }), (report.error || cashiers.error) && (_jsx("div", { className: "ak-mb-4", children: _jsx(ErrorMessage, { error: report.error ?? cashiers.error, onRetry: () => {
                        void report.refetch();
                        void cashiers.refetch();
                    } }) })), report.isLoading ? (_jsxs("section", { className: "ak-card ak-card__body", children: ["Loading ", reportLabel, " transactions\u2026"] })) : (_jsxs(_Fragment, { children: [_jsxs("section", { className: "ak-card ak-mb-6", children: [_jsxs("div", { className: "ak-card__header", children: [_jsxs("h2", { className: "ak-card__title", children: ["Transactions \u00B7 ", reportLabel] }), _jsxs("span", { className: "ak-small ak-subtle", children: [transactions.length, " records"] })] }), _jsxs("div", { className: "ak-table-wrap", children: [_jsxs("table", { className: "ak-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Type" }), _jsx("th", { children: "Recorded at" }), _jsx("th", { children: "Recorded by" }), _jsx("th", { children: "Description" }), _jsx("th", { children: "Status" }), _jsx("th", { children: "Amount" })] }) }), _jsx("tbody", { children: transactions.map((transaction) => (_jsxs("tr", { children: [_jsx("td", { "data-label": "Type", children: transaction.kind === 'received'
                                                                ? 'Received'
                                                                : 'Expense' }), _jsx("td", { "data-label": "Recorded at", children: new Date(transaction.at).toLocaleString() }), _jsx("td", { "data-label": "Recorded by", children: names.get(transaction.recorderId) ??
                                                                'Former or unknown staff' }), _jsx("td", { "data-label": "Description", children: transaction.description }), _jsx("td", { "data-label": "Status", children: transaction.status }), _jsxs("td", { className: "ak-strong", "data-label": "Amount", children: [transaction.kind === 'spent' ? '−' : '+', formatMoney(transaction.amount, transaction.currency)] })] }, `${transaction.kind}-${transaction.id}`))) })] }), transactions.length === 0 && (_jsx("p", { className: "ak-card__body ak-subtle", children: "No transactions found for this period and cashier." }))] })] }), _jsxs("section", { "aria-label": "Financial summary", children: [_jsx("h2", { className: "ak-section-title ak-mb-3", children: "Summary" }), currencyTotals.length ? (_jsx("div", { className: "ak-stat-grid", children: currencyTotals.map((totals) => (_jsxs("div", { className: "ak-card ak-card__body ak-stack ak-gap-2", children: [_jsx("span", { className: "ak-small ak-subtle", children: totals.currency }), _jsxs("strong", { className: "ak-strong", children: ["Received: ", formatMoney(totals.received, totals.currency)] }), _jsxs("strong", { className: "ak-strong", children: ["Spent: ", formatMoney(totals.spent, totals.currency)] }), _jsxs("strong", { className: "ak-strong", children: ["Current balance:", ' ', formatMoney(totals.balance, totals.currency)] })] }, totals.currency))) })) : (_jsxs("div", { className: "ak-stat-grid", children: [_jsx(StatCard, { label: "Money received", value: formatMoney(0, 'RWF'), meta: "Completed payments" }), _jsx(StatCard, { label: "Money spent", value: formatMoney(0, 'RWF'), meta: "Recorded expenses" }), _jsx(StatCard, { label: "Current balance", value: formatMoney(0, 'RWF'), meta: "Received minus spent" })] }))] })] }))] }));
}
export default FinanceReport;
