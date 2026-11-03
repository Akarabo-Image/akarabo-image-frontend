import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon } from '../assets';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { DataTable } from '../components/DataTable';
import { ErrorMessage, errorMessage } from '../components/ErrorMessage';
import { PageHeader } from '../components/PageHeader';
import { Pagination } from '../components/Pagination';
import { StatusMessage } from '../components/StatusMessage';
import { EmptyState } from '../ui/EmptyState';
import { LoadingBlock } from '../ui/LoadingBlock';
import { DateField } from '../ui/DateField';
import { SelectField } from '../ui/SelectField';
import { ReasonDialog } from '../ui/ReasonDialog';
import { useAuth } from '../context/AuthContext';
import { useExpenses, usePaginationControls, usePaginationState, useReverseExpense, } from '../hooks';
import { expenseStatusLabel, expenseStatusTone, toExpenseView, } from '../mappers/expenseMapper';
import { expenseCategoryOptions, expenseStatusOptions } from '../data/constants';
import { canRecordExpenses, canReverseFinance, } from '../util/permissions';
import { formatMoney } from '../util/formatters';
/** Studio spending. */
export function Expenses() {
    const { user } = useAuth();
    const [status, setStatus] = useState('');
    const [category, setCategory] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [reverseTarget, setReverseTarget] = useState(null);
    const [notice, setNotice] = useState(undefined);
    const pagination = usePaginationState();
    const reverseExpense = useReverseExpense();
    const query = useMemo(() => ({
        page: pagination.page,
        limit: pagination.limit,
        ...(status ? { status } : {}),
        ...(category ? { category } : {}),
        ...(dateFrom ? { dateFrom } : {}),
        ...(dateTo ? { dateTo } : {}),
    }), [pagination.page, pagination.limit, status, category, dateFrom, dateTo]);
    const expenses = useExpenses(query);
    const controls = usePaginationControls({
        page: pagination.page,
        limit: pagination.limit,
        total: expenses.data?.meta.total ?? 0,
    });
    const rows = expenses.data?.data ?? [];
    const handleReverse = async (reason) => {
        if (!reverseTarget)
            return;
        try {
            await reverseExpense.mutateAsync({ id: reverseTarget.id, reason });
            setReverseTarget(null);
            setNotice('Expense reversed. The record was kept with its reason.');
        }
        catch (error) {
            setNotice(errorMessage(error));
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx(PageHeader, { title: "Expenses", subtitle: "What the studio spends \u2014 records are reversed, never deleted.", actions: canRecordExpenses(user?.role) && (_jsxs(Link, { to: "/expenses/new", className: "ak-button ak-button--primary", children: [_jsx(PlusIcon, { size: 18 }), "Record expense"] })) }), notice && (_jsx("div", { className: "ak-mb-4", children: _jsx(StatusMessage, { tone: "info", children: notice }) })), _jsxs("div", { className: "ak-card", children: [_jsxs("div", { className: "ak-toolbar", children: [_jsx(SelectField, { "aria-label": "Filter by status", placeholder: "All statuses", options: expenseStatusOptions, value: status, onChange: (event) => {
                                    setStatus(event.target.value);
                                    pagination.reset();
                                } }), _jsx(SelectField, { "aria-label": "Filter by category", placeholder: "All categories", options: expenseCategoryOptions, value: category, onChange: (event) => {
                                    setCategory(event.target.value);
                                    pagination.reset();
                                } }), _jsx(DateField, { "aria-label": "From date", value: dateFrom, onChange: (event) => {
                                    setDateFrom(event.target.value);
                                    pagination.reset();
                                } }), _jsx(DateField, { "aria-label": "To date", value: dateTo, onChange: (event) => {
                                    setDateTo(event.target.value);
                                    pagination.reset();
                                } })] }), expenses.error && (_jsx("div", { className: "ak-mb-4", style: { padding: '0 1.5rem' }, children: _jsx(ErrorMessage, { error: expenses.error, onRetry: () => void expenses.refetch() }) })), expenses.isLoading ? (_jsx(LoadingBlock, { message: "Loading expenses\u2026" })) : (_jsx(DataTable, { rows: rows, rowKey: (expense) => expense.id, empty: _jsx(EmptyState, { title: "No expenses recorded", description: "Record studio spending so the books always add up.", action: canRecordExpenses(user?.role) && (_jsx(Link, { to: "/expenses/new", className: "ak-button ak-button--primary", children: "Record expense" })) }), columns: [
                            {
                                key: 'description',
                                header: 'Description',
                                render: (expense) => {
                                    const view = toExpenseView(expense);
                                    return (_jsxs("span", { className: "ak-stack", children: [_jsx("span", { className: "ak-strong", children: expense.description }), _jsxs("span", { className: "ak-tiny ak-subtle", children: [view.displayCategory, " \u00B7 ", view.displayDate] })] }));
                                },
                            },
                            {
                                key: 'category',
                                header: 'Category',
                                render: (expense) => toExpenseView(expense).displayCategory,
                            },
                            {
                                key: 'amount',
                                header: 'Amount',
                                align: 'right',
                                render: (expense) => formatMoney(expense.amount, expense.currency),
                            },
                            {
                                key: 'status',
                                header: 'Status',
                                render: (expense) => (_jsx(Badge, { tone: expenseStatusTone(expense.status), children: expenseStatusLabel(expense.status) })),
                            },
                            {
                                key: 'actions',
                                header: '',
                                align: 'right',
                                render: (expense) => canReverseFinance(user?.role) &&
                                    expense.status === 'RECORDED' ? (_jsx(Button, { variant: "secondary", size: "sm", onClick: () => setReverseTarget(expense), children: "Reverse" })) : null,
                            },
                        ] })), _jsx(Pagination, { page: pagination.page, limit: pagination.limit, total: controls.total, canGoPrevious: controls.canGoPrevious, canGoNext: controls.canGoNext, onPageChange: pagination.setPage, onLimitChange: pagination.setLimit })] }), _jsx(ReasonDialog, { open: Boolean(reverseTarget), title: "Reverse this expense?", description: "Expenses are never deleted. This record becomes REVERSED and the reason below is kept forever.", confirmLabel: "Reverse expense", isSubmitting: reverseExpense.isPending, onCancel: () => setReverseTarget(null), onConfirm: (reason) => void handleReverse(reason) })] }));
}
export default Expenses;
