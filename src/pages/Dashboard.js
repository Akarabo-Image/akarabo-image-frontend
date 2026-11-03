import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CameraIcon, UsersIcon, } from '../assets';
import { Badge } from '../components/Badge';
import { DataTable } from '../components/DataTable';
import { ErrorMessage } from '../components/ErrorMessage';
import { PageHeader } from '../components/PageHeader';
import { StatCard } from '../components/StatCard';
import { EmptyState } from '../ui/EmptyState';
import { LoadingBlock } from '../ui/LoadingBlock';
import { useBookings, useCustomers, } from '../hooks';
import { useAuth } from '../context/AuthContext';
import { bookingEventDay, bookingStatusLabel, bookingStatusTone, serviceTypeLabel, } from '../mappers/bookingMapper';
import { formatMoney } from '../util/formatters';
import { todayIso } from '../util/formatters';
import { canManageBookings } from '../util/permissions';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../util/axiosInstance';
/** Landing screen: the studio at a glance. */
export function Dashboard() {
    const { user } = useAuth();
    const bookings = useBookings({ limit: 100 });
    const customers = useCustomers({ limit: 100 });
    const studioReport = useQuery({
        queryKey: ['studio-reports', todayIso(), todayIso()],
        queryFn: async () => (await axiosInstance.get('/studio-reports', { params: { from: todayIso(), to: todayIso() } })).data,
        enabled: ['OWNER', 'MANAGER', 'CASHIER'].includes(user?.role ?? ''),
        refetchInterval: 15000,
    });
    const stats = useMemo(() => {
        const allBookings = bookings.data?.data ?? [];
        const today = todayIso();
        const upcoming = allBookings.filter((booking) => booking.eventDate >= today && booking.status !== 'CANCELLED');
        const pending = allBookings.filter((b) => b.status === 'PENDING');
        const confirmed = allBookings.filter((b) => b.status === 'CONFIRMED');
        return {
            upcoming: upcoming.length,
            pending: pending.length,
            confirmed: confirmed.length,
            customers: customers.data?.meta.total ?? 0,
            recent: [...allBookings]
                .sort((a, b) => b.eventDate.localeCompare(a.eventDate))
                .slice(0, 6),
        };
    }, [bookings.data, customers.data]);
    const isLoading = bookings.isLoading || customers.isLoading;
    const failure = bookings.error ?? customers.error;
    return (_jsxs(_Fragment, { children: [_jsx(PageHeader, { title: `Welcome back, ${user?.fullName?.split(' ')[0] ?? 'there'}`, subtitle: "Here is what is happening in the studio today.", actions: _jsxs(_Fragment, { children: [_jsx(Link, { to: "/bookings", className: "ak-button ak-button--secondary", children: "View bookings" }), canManageBookings(user?.role) && (_jsx(Link, { to: "/bookings/new", className: "ak-button ak-button--primary", children: "New booking" }))] }) }), failure && (_jsx("div", { className: "ak-mb-4", children: _jsx(ErrorMessage, { error: failure, onRetry: () => {
                        void bookings.refetch();
                        void customers.refetch();
                    } }) })), _jsxs("div", { className: "ak-stat-grid", children: [_jsx(StatCard, { label: "Upcoming bookings", value: stats.upcoming, meta: `${stats.pending} pending · ${stats.confirmed} confirmed`, icon: _jsx(CameraIcon, { size: 20 }) }), _jsx(StatCard, { label: "Customers", value: stats.customers, meta: "Registered in the studio", icon: _jsx(UsersIcon, { size: 20 }) })] }), studioReport.data && (_jsxs("section", { className: "ak-card ak-mb-6", "aria-live": "polite", children: [_jsxs("div", { className: "ak-card__header", children: [_jsx("h2", { className: "ak-card__title", children: "Today\u2019s client activity" }), _jsx(Link, { to: "/reports/studio", className: "ak-small ak-strong", children: "Open daily report" })] }), _jsxs("div", { className: "ak-card__body", children: [_jsxs("p", { className: "ak-small ak-subtle ak-mb-3", children: [studioReport.data.clients.length, " client visits \u00B7 ", studioReport.data.photographerTotals.reduce((sum, entry) => sum + entry.photosEdited, 0), " photos edited"] }), studioReport.data.clients.length > 0 && _jsx("div", { className: "ak-table-wrap", children: _jsxs("table", { className: "ak-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Customer" }), _jsx("th", { children: "Phone" }), _jsx("th", { children: "Paid" }), _jsx("th", { children: "Remaining" }), _jsx("th", { children: "Service" })] }) }), _jsx("tbody", { children: studioReport.data.clients.slice(0, 5).map((client) => _jsxs("tr", { children: [_jsx("td", { className: "ak-strong", "data-label": "Customer", children: client.customerName }), _jsx("td", { "data-label": "Phone", children: client.phoneNumber }), _jsx("td", { "data-label": "Paid", children: formatMoney(client.paidAmount, 'RWF') }), _jsx("td", { "data-label": "Remaining", children: formatMoney(client.remainingAmount, 'RWF') }), _jsx("td", { "data-label": "Service", children: client.serviceStatus === 'SERVED' ? 'Served' : 'In progress' })] }, client.id)) })] }) })] })] })), _jsxs("div", { className: "ak-card", children: [_jsxs("div", { className: "ak-card__header", children: [_jsx("h2", { className: "ak-card__title", children: "Latest bookings" }), _jsx(Link, { to: "/bookings", className: "ak-small ak-strong", children: "View all" })] }), isLoading ? (_jsx(LoadingBlock, { message: "Loading bookings\u2026" })) : (_jsx(DataTable, { rows: stats.recent, rowKey: (booking) => booking.id, empty: _jsx(EmptyState, { title: "No bookings yet", description: "Create the first booking to start filling the studio calendar.", action: _jsx(Link, { to: "/bookings/new", className: "ak-button ak-button--primary", children: "New booking" }) }), columns: [
                            {
                                key: 'eventDate',
                                header: 'Event date',
                                render: (booking) => (_jsx("span", { className: "ak-strong", children: bookingEventDay(booking) })),
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
                                align: 'right',
                                render: (booking) => (_jsx(Badge, { tone: bookingStatusTone(booking.status), children: bookingStatusLabel(booking.status) })),
                            },
                        ] }))] })] }));
}
export default Dashboard;
