/** Payment queries and mutations. */
import { useMutation, useQuery, useQueryClient, } from '@tanstack/react-query';
import { paymentService } from '../services/paymentService';
import { queryKeys } from './queryKeys';
/** Paginated payments matching the given filters. */
export function usePayments(query = {}, options = {}) {
    return useQuery({
        queryKey: queryKeys.payments.list(query),
        queryFn: () => paymentService.list(query),
        enabled: options.enabled ?? true,
    });
}
/** A single payment. */
export function usePayment(id) {
    return useQuery({
        queryKey: queryKeys.payments.detail(id ?? ''),
        queryFn: () => paymentService.get(id),
        enabled: Boolean(id),
    });
}
/** Registers money received. */
export function useCreatePayment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload) => paymentService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
            queryClient.invalidateQueries({ queryKey: ['studio-reports'] });
        },
    });
}
/** Reverses a payment with a reason — records are never deleted. */
export function useReversePayment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, reason }) => paymentService.reverse(id, reason),
        onSuccess: (payment) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
            queryClient.invalidateQueries({
                queryKey: queryKeys.payments.detail(payment.id),
            });
        },
    });
}
