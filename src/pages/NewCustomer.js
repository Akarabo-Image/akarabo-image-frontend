import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '../assets';
import { Button } from '../components/Button';
import { PageHeader } from '../components/PageHeader';
import { CustomerForm } from '../forms/CustomerForm';
import { useAuth } from '../context/AuthContext';
import { canRegisterCustomers } from '../util/permissions';
import { StatusMessage } from '../components/StatusMessage';
/** Screen that registers a new customer. */
export function NewCustomer() {
    const navigate = useNavigate();
    const { user } = useAuth();
    if (!canRegisterCustomers(user?.role)) {
        return (_jsxs(_Fragment, { children: [_jsx(PageHeader, { title: "New customer" }), _jsx(StatusMessage, { tone: "warning", children: "Photographers, cashiers, managers, and the owner can register customers." })] }));
    }
    return (_jsxs(_Fragment, { children: [_jsx(PageHeader, { title: "New customer", subtitle: "Register a person or company the studio books work for.", crumbs: [{ label: 'Customers', to: '/customers' }, { label: 'New' }], actions: _jsxs(Button, { variant: "secondary", onClick: () => navigate('/customers'), children: [_jsx(ArrowLeftIcon, { size: 18 }), "Cancel"] }) }), _jsx("div", { className: "ak-card", children: _jsx("div", { className: "ak-card__body", children: _jsx(CustomerForm, { onSuccess: (customer) => navigate(user?.role === 'PHOTOGRAPHER' ? '/customers' : `/customers/${customer.id}`), onCancel: () => navigate('/customers') }) }) })] }));
}
export default NewCustomer;
