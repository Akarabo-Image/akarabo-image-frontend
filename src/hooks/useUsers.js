/** Staff account queries and mutations. */
import { useMutation, useQuery, useQueryClient, } from '@tanstack/react-query';
import { userService } from '../services/userService';
import { queryKeys } from './queryKeys';
/** Paginated staff accounts matching the given filters. */
export function useUsers(query = {}) {
    return useQuery({
        queryKey: queryKeys.users.list(query),
        queryFn: () => userService.list(query),
    });
}
/** A single staff account. */
export function useUser(id) {
    return useQuery({
        queryKey: queryKeys.users.detail(id ?? ''),
        queryFn: () => userService.get(id),
        enabled: Boolean(id),
    });
}
/** Creates a staff account. */
export function useCreateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload) => userService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
        },
    });
}
/** Updates a staff account (role, password, contact details). */
export function useUpdateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }) => userService.update(id, payload),
        onSuccess: (user) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(user.id) });
        },
    });
}
/** Activates / deactivates a staff account. */
export function useUserStatusActions() {
    const queryClient = useQueryClient();
    const invalidate = (user) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
        queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(user.id) });
    };
    const deactivate = useMutation({
        mutationFn: (id) => userService.deactivate(id),
        onSuccess: invalidate,
    });
    const activate = useMutation({
        mutationFn: (id) => userService.activate(id),
        onSuccess: invalidate,
    });
    return { deactivate, activate };
}
