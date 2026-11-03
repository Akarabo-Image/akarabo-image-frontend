import { formatDateTime, humanize } from '../util/formatters';
/** Prepares a payment for display. */
export function toPaymentView(payment) {
    return {
        ...payment,
        displayAmount: new Intl.NumberFormat('en-US', {
            maximumFractionDigits: 2,
        }).format(payment.amount),
        displayMethod: humanize(payment.method),
        displayDate: formatDateTime(payment.createdAt),
    };
}
/** Tone used by the status badge. */
export function paymentStatusTone(status) {
    return status === 'COMPLETED' ? 'success' : 'danger';
}
/** Label of the status badge. */
export function paymentStatusLabel(status) {
    return humanize(status);
}
/** Label of the method badge. */
export function paymentMethodLabel(method) {
    return humanize(method);
}
