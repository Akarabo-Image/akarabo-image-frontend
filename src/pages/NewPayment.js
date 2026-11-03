import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '../assets';
import { Button } from '../components/Button';
import { PageHeader } from '../components/PageHeader';
import { StatusMessage } from '../components/StatusMessage';
import { PaymentForm } from '../forms/PaymentForm';
import { LoadingBlock } from '../ui/LoadingBlock';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../hooks';
import { canRecordPayments } from '../util/permissions';
/** Screen that records money received by the studio. */
export function NewPayment() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const bookings = useBookings({ limit: 100 });
    if (!canRecordPayments(user?.role)) {
        return (_jsxs(_Fragment, { children: [_jsx(PageHeader, { title: "Record payment" }), _jsx(StatusMessage, { tone: "warning", children: "Only managers and the owner can manage payments." })] }));
    }
    if (bookings.isLoading) {
        return _jsx(LoadingBlock, { message: "Loading bookings\u2026" });
    }
    return (_jsxs(_Fragment, { children: [_jsx(PageHeader, { title: "Record payment", subtitle: "Log money received by the studio.", crumbs: [{ label: 'Payments', to: '/payments' }, { label: 'New' }], actions: _jsxs(Button, { variant: "secondary", onClick: () => navigate('/payments'), children: [_jsx(ArrowLeftIcon, { size: 18 }), "Cancel"] }) }), _jsx("div", { className: "ak-card ak-finance-form-card", children: _jsx("div", { className: "ak-card__body", children: _jsx(PaymentForm, { bookings: bookings.data?.data ?? [], onSuccess: () => navigate('/payments'), onCancel: () => navigate('/payments') }) }) })] }));
}
export default NewPayment;
