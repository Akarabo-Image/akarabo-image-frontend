import { humanize, truncate } from '../util/formatters';
/** Prepares a customer for display. */
export function toCustomerView(customer) {
    return {
        ...customer,
        displayName: customer.name || 'Unnamed customer',
        displayPhone: customer.phone || '—',
        displayEmail: customer.email || '—',
        shortAddress: customer.address ? truncate(customer.address, 40) : '—',
    };
}
/** Tone used by the active/inactive badge. */
export function customerStatusTone(isActive) {
    return isActive ? 'success' : 'neutral';
}
/** Label of the active/inactive badge. */
export function customerStatusLabel(isActive) {
    return isActive ? 'Active' : 'Deactivated';
}
/** Human-readable label for a customer type marker. */
export function customerKindLabel(customer) {
    return humanize(customer.isActive ? 'Active' : 'Inactive');
}
