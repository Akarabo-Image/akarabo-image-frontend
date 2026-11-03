/** Staff account (user) API calls. */
import { axiosInstance } from '../util/axiosInstance';
import { cleanQuery } from '../util/apiUrl';
export const userService = {
    async list(query = {}) {
        const { data } = await axiosInstance.get('/users', {
            params: cleanQuery(query),
        });
        return data;
    },
    async get(id) {
        const { data } = await axiosInstance.get(`/users/${id}`);
        return data;
    },
    async create(payload) {
        const { data } = await axiosInstance.post('/users', payload);
        return data;
    },
    async update(id, payload) {
        const { data } = await axiosInstance.patch(`/users/${id}`, payload);
        return data;
    },
    /** Revokes access (soft) — user rows are never deleted. */
    async deactivate(id) {
        const { data } = await axiosInstance.post(`/users/${id}/deactivate`);
        return data;
    },
    /** Restores a deactivated account. */
    async activate(id) {
        const { data } = await axiosInstance.post(`/users/${id}/activate`);
        return data;
    },
};
