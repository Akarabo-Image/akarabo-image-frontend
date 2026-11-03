import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '../assets';
import { Button } from '../components/Button';
import { PageHeader } from '../components/PageHeader';
import { StatusMessage } from '../components/StatusMessage';
import { BookingForm } from '../forms/BookingForm';
import { LoadingBlock } from '../ui/LoadingBlock';
import { useActiveCustomers } from '../hooks';
import { canManageBookings } from '../util/permissions';
import { useAuth } from '../context/AuthContext';
/** Screen that creates a new booking. */
export function NewBooking() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const customers = useActiveCustomers();
    if (!canManageBookings(user?.role)) {
        return (_jsxs(_Fragment, { children: [_jsx(PageHeader, { title: "New booking" }), _jsx(StatusMessage, { tone: "warning", children: "Only managers and the owner can create bookings." })] }));
    }
    if (customers.isLoading) {
        return _jsx(LoadingBlock, { message: "Loading customers\u2026" });
    }
    const activeCustomers = customers.data?.data ?? [];
    return (_jsxs(_Fragment, { children: [_jsx(PageHeader, { title: "New booking", subtitle: "Reserve the studio for a customer.", crumbs: [{ label: 'Bookings', to: '/bookings' }, { label: 'New' }], actions: _jsxs(Button, { variant: "secondary", onClick: () => navigate('/bookings'), children: [_jsx(ArrowLeftIcon, { size: 18 }), "Cancel"] }) }), _jsx("div", { className: "ak-card", children: _jsx("div", { className: "ak-card__body", children: activeCustomers.length === 0 ? (_jsxs(StatusMessage, { tone: "warning", children: ["There is no active customer to book for.", ' ', _jsx(Link, { to: "/customers/new", children: "Register a customer first" }), "."] })) : (_jsx(BookingForm, { customers: activeCustomers.map((customer) => ({
                            id: customer.id,
                            name: customer.name,
                        })), onSuccess: (booking) => navigate(`/bookings/${booking.id}`), onCancel: () => navigate('/bookings') })) }) })] }));
}
export default NewBooking;
