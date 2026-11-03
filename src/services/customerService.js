/** Studio customer API calls. */
import { axiosInstance } from '../util/axiosInstance';
import { cleanQuery } from '../util/apiUrl';
export const customerService = {
    async list(query = {}) {
        const { data } = await axiosInstance.get('/customers', {
            params: cleanQuery(query),
        });
        return data;
    },
    async get(id) {
        const { data } = await axiosInstance.get(`/customers/${id}`);
        return data;
    },
    async create(payload) {
        const { data } = await axiosInstance.post('/customers', payload);
        return data;
    },
    async update(id, payload) {
        const { data } = await axiosInstance.patch(`/customers/${id}`, payload);
        return data;
    },
    /** Deactivates a customer — blocks new bookings, never deletes the row. */
    async deactivate(id) {
        const { data } = await axiosInstance.post(`/customers/${id}/deactivate`);
        return data;
    },
    async reactivate(id) {
        const { data } = await axiosInstance.post(`/customers/${id}/reactivate`);
        return data;
    },
};
