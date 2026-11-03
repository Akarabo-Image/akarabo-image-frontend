import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { Badge } from '../components/Badge';
import { PageHeader } from '../components/PageHeader';
import { StatusMessage } from '../components/StatusMessage';
import { ProfileForm } from '../forms/ProfileForm';
import { LoadingBlock } from '../ui/LoadingBlock';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../hooks';
import { initials, roleLabel, roleTone } from '../mappers/authMapper';
import { canManageUsers } from '../util/permissions';
import { formatDate, formatDateTime } from '../util/formatters';
/** The signed-in user's own account. */
export function Profile() {
    const { user } = useAuth();
    const canEdit = canManageUsers(user?.role);
    // Owners and managers read the authoritative record from the users API;
    // the other roles only ever see what the session carries.
    const account = useUser(canEdit ? user?.id : undefined);
    const record = account.data ?? user;
    if (!record) {
        return _jsx(LoadingBlock, { message: "Loading your profile\u2026" });
    }
    return (_jsxs(_Fragment, { children: [_jsx(PageHeader, { title: "My profile", subtitle: "Your account details and how you sign in to the studio." }), _jsx("div", { className: "ak-card ak-mb-4", children: _jsxs("div", { className: "ak-card__body ak-row ak-gap-4 ak-wrap", children: [_jsx("span", { className: "ak-avatar", style: { width: 56, height: 56, fontSize: 'var(--text-lg)' }, children: initials(record.fullName) }), _jsxs("div", { className: "ak-stack ak-grow", children: [_jsx("span", { className: "ak-strong", style: { fontSize: 'var(--text-lg)' }, children: record.fullName }), _jsx("span", { className: "ak-small ak-muted", children: record.email }), _jsxs("span", { className: "ak-row ak-gap-2 ak-mt-2", children: [_jsx(Badge, { tone: roleTone(record.role), children: roleLabel(record.role) }), _jsx(Badge, { tone: record.isActive ? 'success' : 'neutral', children: record.isActive ? 'Active' : 'Deactivated' })] })] })] }) }), _jsxs("div", { className: "ak-card ak-mb-4", children: [_jsx("div", { className: "ak-card__header", children: _jsx("h2", { className: "ak-card__title", children: "Account details" }) }), _jsx("div", { className: "ak-card__body", children: _jsxs("div", { className: "ak-detail-grid", children: [_jsxs("div", { children: [_jsx("p", { className: "ak-detail__label", children: "Full name" }), _jsx("p", { className: "ak-detail__value", children: record.fullName })] }), _jsxs("div", { children: [_jsx("p", { className: "ak-detail__label", children: "Email address" }), _jsx("p", { className: "ak-detail__value ak-mono", children: record.email })] }), _jsxs("div", { children: [_jsx("p", { className: "ak-detail__label", children: "Phone number" }), _jsx("p", { className: "ak-detail__value", children: record.phone ?? '—' })] }), _jsxs("div", { children: [_jsx("p", { className: "ak-detail__label", children: "Role" }), _jsx("p", { className: "ak-detail__value", children: roleLabel(record.role) })] }), _jsxs("div", { children: [_jsx("p", { className: "ak-detail__label", children: "Last sign-in" }), _jsx("p", { className: "ak-detail__value", children: record.lastLoginAt ? formatDateTime(record.lastLoginAt) : '—' })] }), _jsxs("div", { children: [_jsx("p", { className: "ak-detail__label", children: "Member since" }), _jsx("p", { className: "ak-detail__value", children: formatDate(record.createdAt) })] })] }) })] }), _jsxs("div", { className: "ak-card", children: [_jsx("div", { className: "ak-card__header", children: _jsx("h2", { className: "ak-card__title", children: "Update my details" }) }), _jsx("div", { className: "ak-card__body", children: canEdit ? (_jsx(ProfileForm, { account: record })) : (_jsx(StatusMessage, { tone: "info", children: "Only managers and the owner can change account details. Ask the studio owner to update your contact information \u2014 your bookings and shoots stay unaffected." })) })] }), canEdit && (_jsxs("p", { className: "ak-small ak-muted ak-mt-4", children: ["Need a different role?", ' ', _jsx(Link, { to: "/staff", children: "Manage the staff accounts" }), "."] }))] }));
}
export default Profile;
