/**
 * Static reference data used to build select fields and filter bars.
 *
 * The values mirror the backend enums; the labels are the human-readable
 * versions used across the UI.
 */
import { BOOKING_SERVICE_TYPES, } from '../types/booking';
import { BOOKING_STATUSES } from '../types/booking';
import { EXPENSE_CATEGORIES } from '../types/expense';
import { EXPENSE_STATUSES } from '../types/expense';
import { PAYMENT_METHODS } from '../types/payment';
import { PAYMENT_STATUSES } from '../types/payment';
import { ROLES } from '../types/auth';
/** Turns `MOBILE_MONEY` into `Mobile Money`. */
function label(value) {
    const words = value.toLowerCase().split('_').filter(Boolean);
    const [first = '', ...rest] = words;
    return [first.charAt(0).toUpperCase() + first.slice(1), ...rest].join(' ');
}
function toOptions(values) {
    return values.map((value) => ({ value, label: label(value) }));
}
export const serviceTypeOptions = toOptions(BOOKING_SERVICE_TYPES);
export const bookingStatusOptions = toOptions(BOOKING_STATUSES);
export const paymentMethodOptions = toOptions(PAYMENT_METHODS);
export const paymentStatusOptions = toOptions(PAYMENT_STATUSES);
export const expenseCategoryOptions = toOptions(EXPENSE_CATEGORIES);
export const expenseStatusOptions = toOptions(EXPENSE_STATUSES);
export const roleOptions = toOptions(ROLES);
/** Default page size used by every list screen. */
export const DEFAULT_PAGE_SIZE = 10;
/** Choices offered in the "rows per page" selector. */
export const PAGE_SIZE_OPTIONS = [10, 20, 50];
/** Currency the studio books in by default. */
export const DEFAULT_CURRENCY = 'RWF';
