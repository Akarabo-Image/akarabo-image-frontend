import { formatDateTime, humanize } from '../util/formatters';
/** Prepares an expense for display. */
export function toExpenseView(expense) {
    return {
        ...expense,
        displayAmount: new Intl.NumberFormat('en-US', {
            maximumFractionDigits: 2,
        }).format(expense.amount),
        displayCategory: humanize(expense.category),
        displayDate: formatDateTime(expense.expenseDate ?? expense.createdAt),
    };
}
/** Tone used by the status badge. */
export function expenseStatusTone(status) {
    return status === 'RECORDED' ? 'info' : 'danger';
}
/** Label of the status badge. */
export function expenseStatusLabel(status) {
    return humanize(status);
}
/** Label of the category badge. */
export function expenseCategoryLabel(category) {
    return humanize(category);
}
