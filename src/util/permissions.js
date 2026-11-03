/** Owner and manager administer staff accounts. */
export function canManageUsers(role) {
    return role === 'OWNER' || role === 'MANAGER';
}
/** Only the owner can activate or deactivate a staff account. */
export function canManageUserAccess(role) {
    return role === 'OWNER';
}
/** Manager and owner create customers and bookings. */
export function canManageCustomers(role) {
    return role === 'MANAGER' || role === 'OWNER';
}
/** Cashiers can register customers; customer edits stay with management. */
export function canRegisterCustomers(role) {
    return role === 'CASHIER' || role === 'PHOTOGRAPHER' || canManageCustomers(role);
}
/** Manager and owner create, edit, confirm, complete or cancel bookings. */
export function canManageBookings(role) {
    return role === 'MANAGER' || role === 'OWNER';
}
/** Only the owner and manager can access financial records and actions. */
export function canRecordPayments(role) {
    return role === 'MANAGER' || role === 'OWNER';
}
/** Only the owner and manager can access financial records and actions. */
export function canRecordExpenses(role) {
    return role === 'MANAGER' || role === 'OWNER';
}
/** Reversing a financial record is a manager/owner action. */
export function canReverseFinance(role) {
    return role === 'MANAGER' || role === 'OWNER';
}
/** Every signed-in role may browse customers and bookings. */
export function canViewDirectory(role) {
    return Boolean(role);
}
