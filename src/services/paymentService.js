/** Payment (money received) API calls. */
import { axiosInstance } from '../util/axiosInstance';
import { cleanQuery } from '../util/apiUrl';
export const paymentService = {
    async list(query = {}) {
        const { data } = await axiosInstance.get('/payments', {
            params: cleanQuery(query),
        });
        return data;
    },
    async get(id) {
        const { data } = await axiosInstance.get(`/payments/${id}`);
        return data;
    },
    async create(payload) {
        const { data } = await axiosInstance.post('/payments', payload);
        return data;
    },
    /** Reverses a payment with a reason — records are never deleted. */
    async reverse(id, reason) {
        const { data } = await axiosInstance.post(`/payments/${id}/reverse`, { reason });
        return data;
    },
};
