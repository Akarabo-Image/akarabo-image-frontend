/** Booking queries and mutations. */
import { useMutation, useQuery, useQueryClient, } from '@tanstack/react-query';
import { bookingService } from '../services/bookingService';
import { queryKeys } from './queryKeys';
/** Paginated bookings matching the given filters. */
export function useBookings(query = {}) {
    return useQuery({
        queryKey: queryKeys.bookings.list(query),
        queryFn: () => bookingService.list(query),
    });
}
/** A single booking. */
export function useBooking(id) {
    return useQuery({
        queryKey: queryKeys.bookings.detail(id ?? ''),
        queryFn: () => bookingService.get(id),
        enabled: Boolean(id),
    });
}
/** Creates a booking. */
export function useCreateBooking() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload) => bookingService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
        },
    });
}
/** Edits or reschedules a pending/confirmed booking. */
export function useUpdateBooking() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }) => bookingService.update(id, payload),
        onSuccess: (booking) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
            queryClient.invalidateQueries({
                queryKey: queryKeys.bookings.detail(booking.id),
            });
        },
    });
}
/**
 * Lifecycle transitions: confirm, complete and cancel.
 *
 * Cancelling always requires a reason — the backend keeps it forever.
 */
export function useBookingActions() {
    const queryClient = useQueryClient();
    const invalidate = (booking) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
        queryClient.invalidateQueries({
            queryKey: queryKeys.bookings.detail(booking.id),
        });
    };
    const confirm = useMutation({
        mutationFn: (id) => bookingService.confirm(id),
        onSuccess: invalidate,
    });
    const complete = useMutation({
        mutationFn: (id) => bookingService.complete(id),
        onSuccess: invalidate,
    });
    const cancel = useMutation({
        mutationFn: ({ id, reason }) => bookingService.cancel(id, reason),
        onSuccess: invalidate,
    });
    return { confirm, complete, cancel };
}
