import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '../assets';
import { Button } from '../components/Button';
import { PageHeader } from '../components/PageHeader';
import { StatusMessage } from '../components/StatusMessage';
import { ExpenseForm } from '../forms/ExpenseForm';
import { useAuth } from '../context/AuthContext';
import { canRecordExpenses } from '../util/permissions';
/** Screen that records studio spending. */
export function NewExpense() {
    const navigate = useNavigate();
    const { user } = useAuth();
    if (!canRecordExpenses(user?.role)) {
        return (_jsxs(_Fragment, { children: [_jsx(PageHeader, { title: "Record expense" }), _jsx(StatusMessage, { tone: "warning", children: "Only managers and the owner can manage expenses." })] }));
    }
    return (_jsxs(_Fragment, { children: [_jsx(PageHeader, { title: "Record expense", subtitle: "Log what the studio spent.", crumbs: [{ label: 'Expenses', to: '/expenses' }, { label: 'New' }], actions: _jsxs(Button, { variant: "secondary", onClick: () => navigate('/expenses'), children: [_jsx(ArrowLeftIcon, { size: 18 }), "Cancel"] }) }), _jsx("div", { className: "ak-card ak-finance-form-card", children: _jsx("div", { className: "ak-card__body", children: _jsx(ExpenseForm, { onSuccess: () => navigate('/expenses'), onCancel: () => navigate('/expenses') }) }) })] }));
}
export default NewExpense;
