import { axiosInstance } from '../util/axiosInstance';
export const inquiryService = {
    async create(payload) {
        const { data } = await axiosInstance.post('/inquiries', payload);
        return data;
    },
    async list() {
        const { data } = await axiosInstance.get('/inquiries');
        return data;
    },
    async get(id) {
        const { data } = await axiosInstance.get(`/inquiries/${id}`);
        return data;
    },
    async markRead(id) {
        const { data } = await axiosInstance.patch(`/inquiries/${id}/read`);
        return data;
    },
};
