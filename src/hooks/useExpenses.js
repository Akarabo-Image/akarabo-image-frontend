/** Expense queries and mutations. */
import { useMutation, useQuery, useQueryClient, } from '@tanstack/react-query';
import { expenseService } from '../services/expenseService';
import { queryKeys } from './queryKeys';
/** Paginated expenses matching the given filters. */
export function useExpenses(query = {}, options = {}) {
    return useQuery({
        queryKey: queryKeys.expenses.list(query),
        queryFn: () => expenseService.list(query),
        enabled: options.enabled ?? true,
    });
}
/** A single expense. */
export function useExpense(id) {
    return useQuery({
        queryKey: queryKeys.expenses.detail(id ?? ''),
        queryFn: () => expenseService.get(id),
        enabled: Boolean(id),
    });
}
/** Registers studio spending. */
export function useCreateExpense() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload) => expenseService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all });
        },
    });
}
/** Reverses an expense with a reason — records are never deleted. */
export function useReverseExpense() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, reason }) => expenseService.reverse(id, reason),
        onSuccess: (expense) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all });
            queryClient.invalidateQueries({
                queryKey: queryKeys.expenses.detail(expense.id),
            });
        },
    });
}
