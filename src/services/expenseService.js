/** Expense (studio spending) API calls. */
import { axiosInstance } from '../util/axiosInstance';
import { cleanQuery } from '../util/apiUrl';
export const expenseService = {
    async list(query = {}) {
        const { data } = await axiosInstance.get('/expenses', {
            params: cleanQuery(query),
        });
        return data;
    },
    async get(id) {
        const { data } = await axiosInstance.get(`/expenses/${id}`);
        return data;
    },
    async create(payload) {
        const { data } = await axiosInstance.post('/expenses', payload);
        return data;
    },
    /** Reverses an expense with a reason — records are never deleted. */
    async reverse(id, reason) {
        const { data } = await axiosInstance.post(`/expenses/${id}/reverse`, { reason });
        return data;
    },
};
