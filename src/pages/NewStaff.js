import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '../assets';
import { Button } from '../components/Button';
import { ErrorMessage } from '../components/ErrorMessage';
import { PageHeader } from '../components/PageHeader';
import { StatusMessage } from '../components/StatusMessage';
import { UserForm } from '../forms/UserForm';
import { LoadingBlock } from '../ui/LoadingBlock';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../hooks';
import { canManageUsers } from '../util/permissions';
import { ROLES } from '../types/auth';
/**
 * Screen that creates a staff account and the screen that edits one — the
 * route decides which mode the form runs in.
 */
export function NewStaff() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const isEditing = Boolean(id);
    const staffMember = useUser(id);
    // Only the owner may hand out the owner role.
    const availableRoles = useMemo(() => {
        if (user?.role === 'OWNER')
            return ROLES;
        const withoutOwner = ROLES.filter((role) => role !== 'OWNER');
        if (staffMember.data && !withoutOwner.includes(staffMember.data.role)) {
            return [...withoutOwner, staffMember.data.role];
        }
        return withoutOwner;
    }, [user?.role, staffMember.data]);
    if (!canManageUsers(user?.role)) {
        return (_jsxs(_Fragment, { children: [_jsx(PageHeader, { title: "Staff account" }), _jsx(StatusMessage, { tone: "warning", children: "Only managers and the owner can manage staff accounts." })] }));
    }
    if (isEditing && staffMember.isLoading) {
        return _jsx(LoadingBlock, { message: "Loading staff account\u2026" });
    }
    if (isEditing && staffMember.error) {
        return (_jsxs(_Fragment, { children: [_jsx(PageHeader, { title: "Staff account", crumbs: [{ label: 'Staff', to: '/staff' }, { label: 'Edit' }] }), _jsx(ErrorMessage, { error: staffMember.error, onRetry: () => void staffMember.refetch() })] }));
    }
    const edited = staffMember.data;
    return (_jsxs(_Fragment, { children: [_jsx(PageHeader, { title: isEditing ? 'Edit staff account' : 'New staff account', subtitle: isEditing
                    ? 'Update the role, contact details or reset the password.'
                    : 'Give someone access to the studio system.', crumbs: isEditing
                    ? [
                        { label: 'Staff', to: '/staff' },
                        { label: edited?.fullName ?? 'Edit' },
                    ]
                    : [
                        { label: 'Staff', to: '/staff' },
                        { label: 'New' },
                    ], actions: _jsxs(Button, { variant: "secondary", onClick: () => navigate('/staff'), children: [_jsx(ArrowLeftIcon, { size: 18 }), "Back to staff"] }) }), _jsx("div", { className: "ak-card", children: _jsx("div", { className: "ak-card__body", children: _jsx(UserForm, { user: edited, availableRoles: availableRoles, onSuccess: () => navigate('/staff'), onCancel: () => navigate('/staff') }) }) })] }));
}
export default NewStaff;
