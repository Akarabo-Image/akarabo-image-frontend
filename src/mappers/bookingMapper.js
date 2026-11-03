import { formatCalendarDay, humanize } from '../util/formatters';
/** Attaches customer information to a raw booking. */
export function toBookingView(booking, customers = []) {
    const customer = customers.find((item) => item.id === booking.customerId);
    return {
        ...booking,
        customerName: customer?.name ?? 'Unknown customer',
        customerPhone: customer?.phone,
    };
}
/** Tone used by the status badge. */
export function bookingStatusTone(status) {
    switch (status) {
        case 'CONFIRMED':
            return 'success';
        case 'COMPLETED':
            return 'info';
        case 'CANCELLED':
            return 'danger';
        case 'PENDING':
        default:
            return 'warning';
    }
}
/** Label of the status badge. */
export function bookingStatusLabel(status) {
    return humanize(status);
}
/** Label of the service type badge. */
export function serviceTypeLabel(serviceType) {
    return humanize(serviceType);
}
/** Formatted event day. */
export function bookingEventDay(booking) {
    return formatCalendarDay(booking.eventDate);
}
/** Actions available for a booking in its current status. */
export function availableBookingActions(status) {
    return {
        canConfirm: status === 'PENDING',
        canComplete: status === 'CONFIRMED',
        canCancel: status === 'PENDING' || status === 'CONFIRMED',
        canEdit: status === 'PENDING' || status === 'CONFIRMED',
    };
}
