import { axiosInstance } from '../util/axiosInstance';
export const photographerTaskService = {
    async mine() {
        const { data } = await axiosInstance.get('/photographer-tasks/mine');
        return data;
    },
    async completed() {
        const { data } = await axiosInstance.get('/photographer-tasks/completed');
        return data;
    },
    async markRead(id) {
        const { data } = await axiosInstance.patch(`/photographer-tasks/${id}/read`);
        return data;
    },
    async update(id, status, editedPhotos) {
        const { data } = await axiosInstance.patch(`/photographer-tasks/${id}/status`, { status, ...(editedPhotos === undefined ? {} : { editedPhotos }) });
        return data;
    },
};
