/** Studio booking API calls. */
import { axiosInstance } from '../util/axiosInstance';
import { cleanQuery } from '../util/apiUrl';
export const bookingService = {
    async list(query = {}) {
        const { data } = await axiosInstance.get('/bookings', {
            params: cleanQuery(query),
        });
        return data;
    },
    async get(id) {
        const { data } = await axiosInstance.get(`/bookings/${id}`);
        return data;
    },
    async create(payload) {
        const { data } = await axiosInstance.post('/bookings', payload);
        return data;
    },
    async update(id, payload) {
        const { data } = await axiosInstance.patch(`/bookings/${id}`, payload);
        return data;
    },
    /** PENDING → CONFIRMED. */
    async confirm(id) {
        const { data } = await axiosInstance.post(`/bookings/${id}/confirm`);
        return data;
    },
    /** CONFIRMED → COMPLETED (the event happened). */
    async complete(id) {
        const { data } = await axiosInstance.post(`/bookings/${id}/complete`);
        return data;
    },
    /** PENDING/CONFIRMED → CANCELLED with a mandatory reason. */
    async cancel(id, reason) {
        const { data } = await axiosInstance.post(`/bookings/${id}/cancel`, { reason });
        return data;
    },
};
