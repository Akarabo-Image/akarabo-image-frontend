import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, SearchIcon } from '../assets';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { DataTable } from '../components/DataTable';
import { ErrorMessage, errorMessage } from '../components/ErrorMessage';
import { PageHeader } from '../components/PageHeader';
import { Pagination } from '../components/Pagination';
import { StatusMessage } from '../components/StatusMessage';
import { EmptyState } from '../ui/EmptyState';
import { InputField } from '../ui/InputField';
import { LoadingBlock } from '../ui/LoadingBlock';
import { Modal } from '../ui/Modal';
import { SelectField } from '../ui/SelectField';
import { useAuth } from '../context/AuthContext';
import { usePaginationControls, usePaginationState, useUserStatusActions, useUsers, } from '../hooks';
import { toUserView, userRoleTone, userStatusLabel, userStatusTone, } from '../mappers/userMapper';
import { roleOptions } from '../data/constants';
import { canManageUserAccess, canManageUsers } from '../util/permissions';
/** Staff accounts of the studio — owners and managers only. */
export function Staff() {
    const { user } = useAuth();
    const [search, setSearch] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [role, setRole] = useState('');
    const [isActive, setIsActive] = useState('');
    const [pendingAction, setPendingAction] = useState(undefined);
    const [notice, setNotice] = useState(undefined);
    const pagination = usePaginationState();
    const { activate, deactivate } = useUserStatusActions();
    const query = useMemo(() => ({
        page: pagination.page,
        limit: pagination.limit,
        ...(searchTerm ? { search: searchTerm } : {}),
        ...(role ? { role } : {}),
        ...(isActive ? { isActive: isActive === 'true' } : {}),
    }), [pagination.page, pagination.limit, searchTerm, role, isActive]);
    const staff = useUsers(query);
    const controls = usePaginationControls({
        page: pagination.page,
        limit: pagination.limit,
        total: staff.data?.meta.total ?? 0,
    });
    const rows = staff.data?.data ?? [];
    const handleAccessChange = async () => {
        if (!pendingAction)
            return;
        const { type, user: target } = pendingAction;
        try {
            if (type === 'activate') {
                await activate.mutateAsync(target.id);
                setNotice(`${target.fullName} can sign in again.`);
            }
            else {
                await deactivate.mutateAsync(target.id);
                setNotice(`${target.fullName} can no longer sign in.`);
            }
            setPendingAction(undefined);
        }
        catch (error) {
            setNotice(errorMessage(error));
            setPendingAction(undefined);
        }
    };
    if (!canManageUsers(user?.role)) {
        return (_jsxs(_Fragment, { children: [_jsx(PageHeader, { title: "Staff" }), _jsx(StatusMessage, { tone: "warning", children: "Only managers and the owner can manage staff accounts." })] }));
    }
    return (_jsxs(_Fragment, { children: [_jsx(PageHeader, { title: "Staff", subtitle: "Everyone with access to the studio system.", actions: _jsxs(Link, { to: "/staff/new", className: "ak-button ak-button--primary", children: [_jsx(PlusIcon, { size: 18 }), "New staff account"] }) }), notice && (_jsx("div", { className: "ak-mb-4", children: _jsx(StatusMessage, { tone: "info", children: notice }) })), _jsxs("div", { className: "ak-card", children: [_jsxs("div", { className: "ak-toolbar", children: [_jsxs("form", { className: "ak-toolbar__search ak-row ak-gap-2", onSubmit: (event) => {
                                    event.preventDefault();
                                    setSearchTerm(search.trim());
                                    pagination.reset();
                                }, children: [_jsx(InputField, { "aria-label": "Search staff", placeholder: "Search by name, email or phone\u2026", value: search, onChange: (event) => setSearch(event.target.value) }), _jsx("button", { type: "submit", className: "ak-button ak-button--secondary", children: _jsx(SearchIcon, { size: 18 }) })] }), _jsx(SelectField, { "aria-label": "Filter by role", placeholder: "All roles", options: roleOptions, value: role, onChange: (event) => {
                                    setRole(event.target.value);
                                    pagination.reset();
                                } }), _jsx(SelectField, { "aria-label": "Filter by status", placeholder: "All statuses", options: [
                                    { value: 'true', label: 'Active only' },
                                    { value: 'false', label: 'Deactivated only' },
                                ], value: isActive, onChange: (event) => {
                                    setIsActive(event.target.value);
                                    pagination.reset();
                                } })] }), staff.error && (_jsx("div", { className: "ak-mb-4", style: { padding: '0 1.5rem' }, children: _jsx(ErrorMessage, { error: staff.error, onRetry: () => void staff.refetch() }) })), staff.isLoading ? (_jsx(LoadingBlock, { message: "Loading staff\u2026" })) : (_jsx(DataTable, { rows: rows, rowKey: (member) => member.id, empty: _jsx(EmptyState, { title: "No staff found", description: searchTerm
                                ? 'No staff account matches that search.'
                                : 'Create the first staff account to give someone access.', action: _jsx(Link, { to: "/staff/new", className: "ak-button ak-button--primary", children: "New staff account" }) }), columns: [
                            {
                                key: 'name',
                                header: 'Name',
                                render: (member) => {
                                    const view = toUserView(member);
                                    return (_jsxs("span", { className: "ak-row ak-gap-3", children: [_jsx("span", { className: "ak-avatar", children: view.displayInitials }), _jsxs("span", { className: "ak-stack", children: [_jsx("span", { className: "ak-strong", children: view.displayName }), _jsx("span", { className: "ak-tiny ak-subtle", children: view.displayEmail })] })] }));
                                },
                            },
                            {
                                key: 'role',
                                header: 'Role',
                                render: (member) => (_jsx(Badge, { tone: userRoleTone(member.role), children: toUserView(member).displayRole })),
                            },
                            {
                                key: 'phone',
                                header: 'Phone',
                                render: (member) => toUserView(member).displayPhone,
                            },
                            {
                                key: 'lastLogin',
                                header: 'Last sign-in',
                                render: (member) => toUserView(member).displayLastLogin,
                            },
                            {
                                key: 'status',
                                header: 'Status',
                                render: (member) => (_jsx(Badge, { tone: userStatusTone(member.isActive), children: userStatusLabel(member.isActive) })),
                            },
                            {
                                key: 'actions',
                                header: '',
                                align: 'right',
                                render: (member) => (_jsxs("span", { className: "ak-table__actions", children: [_jsx(Link, { to: `/staff/${member.id}/edit`, className: "ak-button ak-button--secondary ak-button--sm", children: "Edit" }), canManageUserAccess(user?.role) &&
                                            member.id !== user?.id &&
                                            (member.isActive ? (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => setPendingAction({ type: 'deactivate', user: member }), children: "Deactivate" })) : (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => setPendingAction({ type: 'activate', user: member }), children: "Activate" })))] })),
                            },
                        ] })), _jsx(Pagination, { page: pagination.page, limit: pagination.limit, total: controls.total, canGoPrevious: controls.canGoPrevious, canGoNext: controls.canGoNext, onPageChange: pagination.setPage, onLimitChange: pagination.setLimit })] }), _jsx(Modal, { open: Boolean(pendingAction), onClose: () => setPendingAction(undefined), title: pendingAction?.type === 'deactivate'
                    ? 'Deactivate this account?'
                    : 'Restore access to this account?', footer: _jsxs(_Fragment, { children: [_jsx(Button, { variant: "secondary", onClick: () => setPendingAction(undefined), disabled: activate.isPending || deactivate.isPending, children: "Cancel" }), _jsx(Button, { variant: pendingAction?.type === 'deactivate' ? 'danger' : 'primary', loading: activate.isPending || deactivate.isPending, onClick: () => void handleAccessChange(), children: pendingAction?.type === 'deactivate' ? 'Deactivate' : 'Activate' })] }), children: _jsx("p", { className: "ak-small ak-muted", children: pendingAction?.type === 'deactivate'
                        ? `${pendingAction.user.fullName} will no longer be able to sign in. Their bookings and financial history are kept.`
                        : `${pendingAction?.user.fullName ?? 'This account'} will be able to sign in again.` }) })] }));
}
export default Staff;
