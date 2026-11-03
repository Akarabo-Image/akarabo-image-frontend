import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon } from '../assets';
import { Badge } from '../components/Badge';
import { DataTable } from '../components/DataTable';
import { ErrorMessage } from '../components/ErrorMessage';
import { PageHeader } from '../components/PageHeader';
import { Pagination } from '../components/Pagination';
import { EmptyState } from '../ui/EmptyState';
import { LoadingBlock } from '../ui/LoadingBlock';
import { SelectField } from '../ui/SelectField';
import { DateField } from '../ui/DateField';
import { useAuth } from '../context/AuthContext';
import { useBookings, useCustomers, usePaginationControls, usePaginationState, } from '../hooks';
import { bookingEventDay, bookingStatusLabel, bookingStatusTone, serviceTypeLabel, toBookingView, } from '../mappers/bookingMapper';
import { bookingStatusOptions, serviceTypeOptions } from '../data/constants';
import { canManageBookings } from '../util/permissions';
import { formatMoney } from '../util/formatters';
/** Booking list with filters, pagination and quick actions. */
export function Bookings() {
    const { user } = useAuth();
    const [status, setStatus] = useState('');
    const [serviceType, setServiceType] = useState('');
    const [eventFrom, setEventFrom] = useState('');
    const [eventTo, setEventTo] = useState('');
    const pagination = usePaginationState();
    const customers = useCustomers({ limit: 100 });
    const query = useMemo(() => ({
        page: pagination.page,
        limit: pagination.limit,
        ...(status ? { status } : {}),
        ...(serviceType ? { serviceType } : {}),
        ...(eventFrom ? { eventFrom } : {}),
        ...(eventTo ? { eventTo } : {}),
    }), [
        pagination.page,
        pagination.limit,
        status,
        serviceType,
        eventFrom,
        eventTo,
    ]);
    const bookings = useBookings(query);
    const controls = usePaginationControls({
        page: pagination.page,
        limit: pagination.limit,
        total: bookings.data?.meta.total ?? 0,
    });
    const rows = bookings.data?.data ?? [];
    return (_jsxs(_Fragment, { children: [_jsx(PageHeader, { title: "Bookings", subtitle: "Every reservation the studio has made \u2014 never deleted, only cancelled.", actions: canManageBookings(user?.role) && (_jsxs(Link, { to: "/bookings/new", className: "ak-button ak-button--primary", children: [_jsx(PlusIcon, { size: 18 }), "New booking"] })) }), _jsxs("div", { className: "ak-card", children: [_jsxs("div", { className: "ak-toolbar", children: [_jsx(SelectField, { "aria-label": "Filter by status", placeholder: "All statuses", options: bookingStatusOptions, value: status, onChange: (event) => {
                                    setStatus(event.target.value);
                                    pagination.reset();
                                } }), _jsx(SelectField, { "aria-label": "Filter by service type", placeholder: "All services", options: serviceTypeOptions, value: serviceType, onChange: (event) => {
                                    setServiceType(event.target.value);
                                    pagination.reset();
                                } }), _jsx(DateField, { "aria-label": "Events from", value: eventFrom, onChange: (event) => {
                                    setEventFrom(event.target.value);
                                    pagination.reset();
                                } }), _jsx(DateField, { "aria-label": "Events to", value: eventTo, onChange: (event) => {
                                    setEventTo(event.target.value);
                                    pagination.reset();
                                } })] }), bookings.error && (_jsx("div", { className: "ak-mb-4", style: { padding: '0 1.5rem' }, children: _jsx(ErrorMessage, { error: bookings.error, onRetry: () => void bookings.refetch() }) })), bookings.isLoading ? (_jsx(LoadingBlock, { message: "Loading bookings\u2026" })) : (_jsx(DataTable, { rows: rows, rowKey: (booking) => booking.id, empty: _jsx(EmptyState, { title: "No bookings match these filters", description: "Try clearing the filters or create a new booking.", action: canManageBookings(user?.role) && (_jsx(Link, { to: "/bookings/new", className: "ak-button ak-button--primary", children: "New booking" })) }), columns: [
                            {
                                key: 'eventDate',
                                header: 'Event date',
                                render: (booking) => (_jsx("span", { className: "ak-strong", children: bookingEventDay(booking) })),
                            },
                            {
                                key: 'customer',
                                header: 'Customer',
                                render: (booking) => {
                                    const view = toBookingView(booking, customers.data?.data ?? []);
                                    return (_jsxs("span", { className: "ak-stack", children: [_jsx("span", { className: "ak-strong", children: view.customerName }), _jsx("span", { className: "ak-tiny ak-subtle", children: view.customerPhone ?? '—' })] }));
                                },
                            },
                            {
                                key: 'serviceType',
                                header: 'Service',
                                render: (booking) => serviceTypeLabel(booking.serviceType),
                            },
                            {
                                key: 'venue',
                                header: 'Venue',
                                render: (booking) => (_jsx("span", { className: "ak-truncate", children: booking.venue })),
                            },
                            {
                                key: 'price',
                                header: 'Price',
                                align: 'right',
                                render: (booking) => formatMoney(booking.priceAmount, booking.priceCurrency),
                            },
                            {
                                key: 'status',
                                header: 'Status',
                                render: (booking) => (_jsx(Badge, { tone: bookingStatusTone(booking.status), children: bookingStatusLabel(booking.status) })),
                            },
                            {
                                key: 'actions',
                                header: '',
                                align: 'right',
                                render: (booking) => (_jsx(Link, { to: `/bookings/${booking.id}`, className: "ak-button ak-button--secondary ak-button--sm", children: "Open" })),
                            },
                        ] })), _jsx(Pagination, { page: pagination.page, limit: pagination.limit, total: controls.total, canGoPrevious: controls.canGoPrevious, canGoNext: controls.canGoNext, onPageChange: pagination.setPage, onLimitChange: pagination.setLimit })] })] }));
}
export default Bookings;
