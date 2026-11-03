/** Customer queries and mutations. */
import { useMutation, useQuery, useQueryClient, } from '@tanstack/react-query';
import { customerService } from '../services/customerService';
import { queryKeys } from './queryKeys';
/** Paginated customers matching the given filters. */
export function useCustomers(query = {}, enabled = true) {
    return useQuery({
        queryKey: queryKeys.customers.list(query),
        queryFn: () => customerService.list(query),
        enabled,
    });
}
/** A single customer. */
export function useCustomer(id) {
    return useQuery({
        queryKey: queryKeys.customers.detail(id ?? ''),
        queryFn: () => customerService.get(id),
        enabled: Boolean(id),
    });
}
/**
 * Active customers only — used by the booking form where a deactivated
 * customer can no longer be booked.
 */
export function useActiveCustomers() {
    return useQuery({
        queryKey: queryKeys.customers.list({ isActive: true, limit: 100 }),
        queryFn: () => customerService.list({ isActive: true, limit: 100 }),
    });
}
/** Registers a new customer. */
export function useCreateCustomer() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload) => customerService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
        },
    });
}
/** Updates customer details. */
export function useUpdateCustomer() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }) => customerService.update(id, payload),
        onSuccess: (customer) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
            queryClient.invalidateQueries({
                queryKey: queryKeys.customers.detail(customer.id),
            });
        },
    });
}
/** Activates / deactivates a customer (never deletes the row). */
export function useCustomerStatusActions() {
    const queryClient = useQueryClient();
    const invalidate = (customer) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
        queryClient.invalidateQueries({
            queryKey: queryKeys.customers.detail(customer.id),
        });
        queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
    };
    const deactivate = useMutation({
        mutationFn: (id) => customerService.deactivate(id),
        onSuccess: invalidate,
    });
    const reactivate = useMutation({
        mutationFn: (id) => customerService.reactivate(id),
        onSuccess: invalidate,
    });
    return { deactivate, reactivate };
}
