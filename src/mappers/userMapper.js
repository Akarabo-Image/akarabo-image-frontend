import { formatDateTime, humanize } from '../util/formatters';
import { initials, roleLabel, roleTone } from './authMapper';
/** Prepares a user for display. */
export function toUserView(user) {
    return {
        ...user,
        displayName: user.fullName || 'Unnamed user',
        displayEmail: user.email || '—',
        displayPhone: user.phone || '—',
        displayRole: roleLabel(user.role),
        displayInitials: initials(user.fullName || '?'),
        displayLastLogin: user.lastLoginAt
            ? formatDateTime(user.lastLoginAt)
            : 'Never signed in',
    };
}
/** Tone used by the role badge. */
export function userRoleTone(role) {
    return roleTone(role);
}
/** Tone used by the active/inactive badge. */
export function userStatusTone(isActive) {
    return isActive ? 'success' : 'neutral';
}
/** Label of the active/inactive badge. */
export function userStatusLabel(isActive) {
    return humanize(isActive ? 'Active' : 'Deactivated');
}
