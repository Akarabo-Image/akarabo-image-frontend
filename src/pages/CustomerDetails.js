import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, MailIcon, PhoneIcon } from '../assets';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { ErrorMessage, errorMessage } from '../components/ErrorMessage';
import { PageHeader } from '../components/PageHeader';
import { StatusMessage } from '../components/StatusMessage';
import { CustomerForm } from '../forms/CustomerForm';
import { LoadingBlock } from '../ui/LoadingBlock';
import { useAuth } from '../context/AuthContext';
import { useBookings, useCustomer, useCustomerStatusActions, } from '../hooks';
import { customerStatusLabel, customerStatusTone, } from '../mappers/customerMapper';
import { canManageCustomers } from '../util/permissions';
import { formatDate, formatMoney } from '../util/formatters';
import { bookingEventDay } from '../mappers/bookingMapper';
/** Full view of a single customer, their bookings and quick actions. */
export function CustomerDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const customer = useCustomer(id);
    const bookings = useBookings({ customerId: id, limit: 50 });
    const statusActions = useCustomerStatusActions();
    const [editing, setEditing] = useState(false);
    const [notice, setNotice] = useState(undefined);
    const record = customer.data;
    const canManage = canManageCustomers(user?.role);
    if (customer.isLoading) {
        return _jsx(LoadingBlock, { message: "Loading customer\u2026" });
    }
    if (customer.error || !record) {
        return (_jsxs(_Fragment, { children: [_jsx(PageHeader, { title: "Customer" }), _jsx(ErrorMessage, { error: customer.error, message: customer.error ? undefined : 'This customer does not exist.', onRetry: () => void customer.refetch() })] }));
    }
    const toggleStatus = async () => {
        try {
            if (record.isActive) {
                await statusActions.deactivate.mutateAsync(record.id);
                setNotice('Customer deactivated. They can no longer be booked.');
            }
            else {
                await statusActions.reactivate.mutateAsync(record.id);
                setNotice('Customer reactivated.');
            }
        }
        catch (error) {
            setNotice(errorMessage(error));
        }
    };
    const customerBookings = bookings.data?.data ?? [];
    const totalValue = customerBookings.reduce((sum, booking) => sum + booking.priceAmount, 0);
    return (_jsxs(_Fragment, { children: [_jsx(PageHeader, { title: record.name, subtitle: `Registered on ${formatDate(record.createdAt)}`, crumbs: [{ label: 'Customers', to: '/customers' }, { label: record.name }], actions: _jsxs(_Fragment, { children: [_jsxs(Link, { to: "/customers", className: "ak-button ak-button--secondary", children: [_jsx(ArrowLeftIcon, { size: 18 }), "Back"] }), canManage && !editing && (_jsxs(_Fragment, { children: [_jsx(Button, { variant: "secondary", onClick: () => setEditing(true), children: "Edit" }), _jsx(Button, { variant: record.isActive ? 'danger' : 'success', loading: statusActions.deactivate.isPending ||
                                        statusActions.reactivate.isPending, onClick: () => void toggleStatus(), children: record.isActive ? 'Deactivate' : 'Reactivate' })] }))] }) }), notice && (_jsx("div", { className: "ak-mb-4", children: _jsx(StatusMessage, { tone: "info", children: notice }) })), _jsxs("div", { className: "ak-grid-2", children: [_jsxs("section", { className: "ak-card", children: [_jsxs("div", { className: "ak-card__header", children: [_jsx("h2", { className: "ak-card__title", children: "Contact" }), _jsx(Badge, { tone: customerStatusTone(record.isActive), children: customerStatusLabel(record.isActive) })] }), _jsx("div", { className: "ak-card__body", children: _jsxs("div", { className: "ak-detail-grid", children: [_jsxs("div", { children: [_jsx("p", { className: "ak-detail__label", children: "Phone" }), _jsxs("p", { className: "ak-detail__value ak-row ak-gap-2", children: [_jsx(PhoneIcon, { size: 16 }), record.phone] })] }), _jsxs("div", { children: [_jsx("p", { className: "ak-detail__label", children: "Email" }), _jsxs("p", { className: "ak-detail__value ak-row ak-gap-2", children: [_jsx(MailIcon, { size: 16 }), record.email ?? '—'] })] }), _jsxs("div", { style: { gridColumn: '1 / -1' }, children: [_jsx("p", { className: "ak-detail__label", children: "Address" }), _jsx("p", { className: "ak-detail__value", children: record.address ?? '—' })] }), record.notes && (_jsxs("div", { style: { gridColumn: '1 / -1' }, children: [_jsx("p", { className: "ak-detail__label", children: "Notes" }), _jsx("p", { className: "ak-detail__value", children: record.notes })] }))] }) })] }), _jsxs("section", { className: "ak-card", children: [_jsxs("div", { className: "ak-card__header", children: [_jsx("h2", { className: "ak-card__title", children: "Booking history" }), _jsxs("span", { className: "ak-small ak-muted", children: [customerBookings.length, " bookings \u00B7", ' ', formatMoney(totalValue, 'RWF')] })] }), _jsx("div", { className: "ak-card__body", children: bookings.isLoading ? (_jsx(LoadingBlock, { message: "Loading bookings\u2026" })) : customerBookings.length === 0 ? (_jsx("p", { className: "ak-muted ak-small", children: "This customer has no bookings yet." })) : (_jsx("ul", { className: "ak-stack ak-gap-3", children: customerBookings.map((booking) => (_jsx("li", { children: _jsxs(Link, { to: `/bookings/${booking.id}`, className: "ak-row ak-between ak-gap-3", children: [_jsxs("span", { className: "ak-stack", children: [_jsx("span", { className: "ak-strong", children: bookingEventDay(booking) }), _jsx("span", { className: "ak-tiny ak-subtle", children: booking.venue })] }), _jsxs("span", { className: "ak-row ak-gap-3", children: [_jsx("span", { className: "ak-small", children: formatMoney(booking.priceAmount, booking.priceCurrency) }), _jsx(Badge, { tone: booking.status === 'CANCELLED'
                                                                ? 'danger'
                                                                : booking.status === 'COMPLETED'
                                                                    ? 'info'
                                                                    : booking.status === 'CONFIRMED'
                                                                        ? 'success'
                                                                        : 'warning', children: booking.status })] })] }) }, booking.id))) })) })] })] }), editing && (_jsxs("section", { className: "ak-card ak-mt-5", children: [_jsx("div", { className: "ak-card__header", children: _jsx("h2", { className: "ak-card__title", children: "Edit customer" }) }), _jsx("div", { className: "ak-card__body", children: _jsx(CustomerForm, { customer: record, onSuccess: () => {
                                setEditing(false);
                                setNotice('Customer updated.');
                            }, onCancel: () => setEditing(false) }) })] })), _jsx("div", { className: "ak-mt-5", children: _jsxs(Button, { variant: "ghost", onClick: () => navigate('/customers'), children: [_jsx(ArrowLeftIcon, { size: 18 }), "Back to customers"] }) })] }));
}
export default CustomerDetails;
