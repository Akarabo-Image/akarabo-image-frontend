import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, CalendarIcon, CheckIcon, LocationIcon, MoneyIcon, UsersIcon, } from '../assets';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { ErrorMessage, errorMessage } from '../components/ErrorMessage';
import { PageHeader } from '../components/PageHeader';
import { StatusMessage } from '../components/StatusMessage';
import { BookingForm } from '../forms/BookingForm';
import { LoadingBlock } from '../ui/LoadingBlock';
import { ReasonDialog } from '../ui/ReasonDialog';
import { useAuth } from '../context/AuthContext';
import { useActiveCustomers, useBooking, useBookingActions, useUpdateBooking, } from '../hooks';
import { availableBookingActions, bookingEventDay, bookingStatusLabel, bookingStatusTone, serviceTypeLabel, } from '../mappers/bookingMapper';
import { canManageBookings } from '../util/permissions';
import { formatDateTime, formatMoney } from '../util/formatters';
/** Full view of a single booking with its lifecycle actions. */
export function BookingDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const booking = useBooking(id);
    const customers = useActiveCustomers();
    const actions = useBookingActions();
    const updateBooking = useUpdateBooking();
    const [editing, setEditing] = useState(false);
    const [cancelOpen, setCancelOpen] = useState(false);
    const [notice, setNotice] = useState(undefined);
    const record = booking.data;
    const canManage = canManageBookings(user?.role);
    if (booking.isLoading) {
        return _jsx(LoadingBlock, { message: "Loading booking\u2026" });
    }
    if (booking.error || !record) {
        return (_jsxs(_Fragment, { children: [_jsx(PageHeader, { title: "Booking" }), _jsx(ErrorMessage, { error: booking.error, message: booking.error ? undefined : 'This booking does not exist.', onRetry: () => void booking.refetch() })] }));
    }
    const allowed = availableBookingActions(record.status);
    const customer = customers.data?.data.find((c) => c.id === record.customerId);
    const runAction = async (action, message) => {
        try {
            if (action === 'confirm') {
                await actions.confirm.mutateAsync(record.id);
            }
            else {
                await actions.complete.mutateAsync(record.id);
            }
            setNotice(message);
        }
        catch (error) {
            setNotice(errorMessage(error));
        }
    };
    const handleCancel = async (reason) => {
        try {
            await actions.cancel.mutateAsync({ id: record.id, reason });
            setCancelOpen(false);
            setNotice('Booking cancelled. The reason was kept in the audit trail.');
        }
        catch (error) {
            setNotice(errorMessage(error));
        }
    };
    const handleUpdate = async () => {
        setEditing(false);
        setNotice('Booking updated.');
    };
    return (_jsxs(_Fragment, { children: [_jsx(PageHeader, { title: `${serviceTypeLabel(record.serviceType)} · ${bookingEventDay(record)}`, subtitle: `Created on ${formatDateTime(record.createdAt)}`, crumbs: [
                    { label: 'Bookings', to: '/bookings' },
                    { label: record.venue },
                ], actions: _jsxs(_Fragment, { children: [_jsxs(Link, { to: "/bookings", className: "ak-button ak-button--secondary", children: [_jsx(ArrowLeftIcon, { size: 18 }), "Back"] }), canManage && allowed.canEdit && !editing && (_jsx(Button, { variant: "secondary", onClick: () => setEditing(true), children: "Edit" })), canManage && allowed.canConfirm && (_jsx(Button, { variant: "success", loading: actions.confirm.isPending, icon: _jsx(CheckIcon, { size: 18 }), onClick: () => void runAction('confirm', 'Booking confirmed.'), children: "Confirm" })), canManage && allowed.canComplete && (_jsx(Button, { variant: "success", loading: actions.complete.isPending, icon: _jsx(CheckIcon, { size: 18 }), onClick: () => void runAction('complete', 'Booking completed.'), children: "Mark completed" })), canManage && allowed.canCancel && (_jsx(Button, { variant: "danger", onClick: () => setCancelOpen(true), children: "Cancel booking" }))] }) }), notice && (_jsx("div", { className: "ak-mb-4", children: _jsx(StatusMessage, { tone: "info", children: notice }) })), _jsxs("div", { className: "ak-grid-2", children: [_jsxs("section", { className: "ak-card", children: [_jsxs("div", { className: "ak-card__header", children: [_jsx("h2", { className: "ak-card__title", children: "Details" }), _jsx(Badge, { tone: bookingStatusTone(record.status), children: bookingStatusLabel(record.status) })] }), _jsx("div", { className: "ak-card__body", children: _jsxs("div", { className: "ak-detail-grid", children: [_jsxs("div", { children: [_jsx("p", { className: "ak-detail__label", children: "Event date" }), _jsxs("p", { className: "ak-detail__value", children: [bookingEventDay(record), record.startTime ? ` · ${record.startTime}` : ''] })] }), _jsxs("div", { children: [_jsx("p", { className: "ak-detail__label", children: "Customer" }), _jsx("p", { className: "ak-detail__value", children: customer?.name ?? record.customerId })] }), _jsxs("div", { children: [_jsx("p", { className: "ak-detail__label", children: "Venue" }), _jsx("p", { className: "ak-detail__value", children: record.venue })] }), _jsxs("div", { children: [_jsx("p", { className: "ak-detail__label", children: "Agreed price" }), _jsx("p", { className: "ak-detail__value", children: formatMoney(record.priceAmount, record.priceCurrency) })] }), _jsxs("div", { children: [_jsx("p", { className: "ak-detail__label", children: "Expected guests" }), _jsx("p", { className: "ak-detail__value", children: record.expectedGuests ?? '—' })] }), _jsxs("div", { children: [_jsx("p", { className: "ak-detail__label", children: "Service" }), _jsx("p", { className: "ak-detail__value", children: serviceTypeLabel(record.serviceType) })] }), record.notes && (_jsxs("div", { style: { gridColumn: '1 / -1' }, children: [_jsx("p", { className: "ak-detail__label", children: "Notes" }), _jsx("p", { className: "ak-detail__value", children: record.notes })] })), record.cancellationReason && (_jsxs("div", { style: { gridColumn: '1 / -1' }, children: [_jsx("p", { className: "ak-detail__label", children: "Cancellation reason" }), _jsx("p", { className: "ak-detail__value", children: record.cancellationReason })] }))] }) })] }), _jsxs("section", { className: "ak-card", children: [_jsx("div", { className: "ak-card__header", children: _jsx("h2", { className: "ak-card__title", children: "Timeline" }) }), _jsxs("div", { className: "ak-card__body ak-stack ak-gap-4", children: [_jsxs("div", { className: "ak-row ak-gap-3", children: [_jsx(CalendarIcon, { size: 18 }), _jsxs("div", { children: [_jsx("p", { className: "ak-small ak-strong", children: "Booked" }), _jsx("p", { className: "ak-tiny ak-subtle", children: formatDateTime(record.createdAt) })] })] }), record.confirmedAt && (_jsxs("div", { className: "ak-row ak-gap-3", children: [_jsx(CheckIcon, { size: 18 }), _jsxs("div", { children: [_jsx("p", { className: "ak-small ak-strong", children: "Confirmed" }), _jsx("p", { className: "ak-tiny ak-subtle", children: formatDateTime(record.confirmedAt) })] })] })), record.completedAt && (_jsxs("div", { className: "ak-row ak-gap-3", children: [_jsx(CheckIcon, { size: 18 }), _jsxs("div", { children: [_jsx("p", { className: "ak-small ak-strong", children: "Completed" }), _jsx("p", { className: "ak-tiny ak-subtle", children: formatDateTime(record.completedAt) })] })] })), record.cancelledAt && (_jsxs("div", { className: "ak-row ak-gap-3", children: [_jsx(UsersIcon, { size: 18 }), _jsxs("div", { children: [_jsx("p", { className: "ak-small ak-strong", children: "Cancelled" }), _jsx("p", { className: "ak-tiny ak-subtle", children: formatDateTime(record.cancelledAt) })] })] })), _jsxs("div", { className: "ak-row ak-gap-3", children: [_jsx(LocationIcon, { size: 18 }), _jsxs("div", { children: [_jsx("p", { className: "ak-small ak-strong", children: "Venue" }), _jsx("p", { className: "ak-tiny ak-subtle", children: record.venue })] })] }), _jsxs("div", { className: "ak-row ak-gap-3", children: [_jsx(MoneyIcon, { size: 18 }), _jsxs("div", { children: [_jsx("p", { className: "ak-small ak-strong", children: "Package price" }), _jsx("p", { className: "ak-tiny ak-subtle", children: formatMoney(record.priceAmount, record.priceCurrency) })] })] })] })] })] }), editing && (_jsxs("section", { className: "ak-card ak-mt-5", children: [_jsx("div", { className: "ak-card__header", children: _jsx("h2", { className: "ak-card__title", children: "Edit booking" }) }), _jsxs("div", { className: "ak-card__body", children: [_jsx(BookingForm, { booking: record, customers: (customers.data?.data ?? []).map((c) => ({
                                    id: c.id,
                                    name: c.name,
                                })), onSuccess: () => void handleUpdate(), onCancel: () => setEditing(false) }), updateBooking.error && (_jsx("div", { className: "ak-mt-3", children: _jsx(ErrorMessage, { error: updateBooking.error }) }))] })] })), _jsx(ReasonDialog, { open: cancelOpen, title: "Cancel this booking?", description: "Bookings are never deleted. The booking becomes CANCELLED and the reason below is kept forever.", confirmLabel: "Cancel booking", isSubmitting: actions.cancel.isPending, onCancel: () => setCancelOpen(false), onConfirm: (reason) => void handleCancel(reason) }), _jsx("div", { className: "ak-mt-5", children: _jsxs(Button, { variant: "ghost", onClick: () => navigate('/bookings'), children: [_jsx(ArrowLeftIcon, { size: 18 }), "Back to bookings"] }) })] }));
}
export default BookingDetails;
