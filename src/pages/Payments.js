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
import { usePaginationControls, usePaginationState, usePayments, useReversePayment, } from '../hooks';
import { paymentStatusLabel, paymentStatusTone, toPaymentView, } from '../mappers/paymentMapper';
import { paymentMethodOptions, paymentStatusOptions } from '../data/constants';
import { canRecordPayments, canReverseFinance, } from '../util/permissions';
import { formatMoney } from '../util/formatters';
/** Payments received by the studio. */
export function Payments() {
    const { user } = useAuth();
    const [status, setStatus] = useState('');
    const [method, setMethod] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [reverseTarget, setReverseTarget] = useState(null);
    const [notice, setNotice] = useState(undefined);
    const pagination = usePaginationState();
    const reversePayment = useReversePayment();
    const query = useMemo(() => ({
        page: pagination.page,
        limit: pagination.limit,
        ...(status ? { status } : {}),
        ...(method ? { method } : {}),
        ...(dateFrom ? { dateFrom } : {}),
        ...(dateTo ? { dateTo } : {}),
    }), [pagination.page, pagination.limit, status, method, dateFrom, dateTo]);
    const payments = usePayments(query);
    const controls = usePaginationControls({
        page: pagination.page,
        limit: pagination.limit,
        total: payments.data?.meta.total ?? 0,
    });
    const rows = payments.data?.data ?? [];
    const handleReverse = async (reason) => {
        if (!reverseTarget)
            return;
        try {
            await reversePayment.mutateAsync({ id: reverseTarget.id, reason });
            setReverseTarget(null);
            setNotice('Payment reversed. The record was kept with its reason.');
        }
        catch (error) {
            setNotice(errorMessage(error));
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx(PageHeader, { title: "Payments", subtitle: "Money received by the studio \u2014 records are reversed, never deleted.", actions: canRecordPayments(user?.role) && (_jsxs(Link, { to: "/payments/new", className: "ak-button ak-button--primary", children: [_jsx(PlusIcon, { size: 18 }), "Record payment"] })) }), notice && (_jsx("div", { className: "ak-mb-4", children: _jsx(StatusMessage, { tone: "info", children: notice }) })), _jsxs("div", { className: "ak-card", children: [_jsxs("div", { className: "ak-toolbar", children: [_jsx(SelectField, { "aria-label": "Filter by status", placeholder: "All statuses", options: paymentStatusOptions, value: status, onChange: (event) => {
                                    setStatus(event.target.value);
                                    pagination.reset();
                                } }), _jsx(SelectField, { "aria-label": "Filter by method", placeholder: "All methods", options: paymentMethodOptions, value: method, onChange: (event) => {
                                    setMethod(event.target.value);
                                    pagination.reset();
                                } }), _jsx(DateField, { "aria-label": "From date", value: dateFrom, onChange: (event) => {
                                    setDateFrom(event.target.value);
                                    pagination.reset();
                                } }), _jsx(DateField, { "aria-label": "To date", value: dateTo, onChange: (event) => {
                                    setDateTo(event.target.value);
                                    pagination.reset();
                                } })] }), payments.error && (_jsx("div", { className: "ak-mb-4", style: { padding: '0 1.5rem' }, children: _jsx(ErrorMessage, { error: payments.error, onRetry: () => void payments.refetch() }) })), payments.isLoading ? (_jsx(LoadingBlock, { message: "Loading payments\u2026" })) : (_jsx(DataTable, { rows: rows, rowKey: (payment) => payment.id, empty: _jsx(EmptyState, { title: "No payments recorded", description: "Record the first payment to start tracking the studio's income.", action: canRecordPayments(user?.role) && (_jsx(Link, { to: "/payments/new", className: "ak-button ak-button--primary", children: "Record payment" })) }), columns: [
                            {
                                key: 'amount',
                                header: 'Amount',
                                render: (payment) => {
                                    const view = toPaymentView(payment);
                                    return (_jsxs("span", { className: "ak-stack", children: [_jsx("span", { className: "ak-strong", children: formatMoney(payment.amount, payment.currency) }), _jsx("span", { className: "ak-tiny ak-subtle", children: view.displayDate })] }));
                                },
                            },
                            {
                                key: 'method',
                                header: 'Method',
                                render: (payment) => toPaymentView(payment).displayMethod,
                            },
                            {
                                key: 'reference',
                                header: 'Reference',
                                render: (payment) => payment.reference ?? '—',
                            },
                            {
                                key: 'notes',
                                header: 'Notes',
                                render: (payment) => payment.notes ?? '—',
                            },
                            {
                                key: 'status',
                                header: 'Status',
                                render: (payment) => (_jsx(Badge, { tone: paymentStatusTone(payment.status), children: paymentStatusLabel(payment.status) })),
                            },
                            {
                                key: 'actions',
                                header: '',
                                align: 'right',
                                render: (payment) => canReverseFinance(user?.role) &&
                                    payment.status === 'COMPLETED' ? (_jsx(Button, { variant: "secondary", size: "sm", onClick: () => setReverseTarget(payment), children: "Reverse" })) : null,
                            },
                        ] })), _jsx(Pagination, { page: pagination.page, limit: pagination.limit, total: controls.total, canGoPrevious: controls.canGoPrevious, canGoNext: controls.canGoNext, onPageChange: pagination.setPage, onLimitChange: pagination.setLimit })] }), _jsx(ReasonDialog, { open: Boolean(reverseTarget), title: "Reverse this payment?", description: "Payments are never deleted. This record becomes REVERSED and the reason below is kept forever.", confirmLabel: "Reverse payment", isSubmitting: reversePayment.isPending, onCancel: () => setReverseTarget(null), onConfirm: (reason) => void handleReverse(reason) })] }));
}
export default Payments;
