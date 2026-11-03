/** Authentication API calls. */
import { axiosInstance } from '../util/axiosInstance';
export const authService = {
    /** Exchanges credentials for a 30-day access token. */
    async login(credentials) {
        const { data } = await axiosInstance.post('/auth/login', credentials, { timeout: 90000 });
        return data;
    },
    /** Records the logout in the audit trail — the client discards the token. */
    async logout() {
        const { data } = await axiosInstance.post('/auth/logout');
        return data;
    },
    /** Fresh profile of the signed-in user (role changes show up immediately). */
    async me() {
        const { data } = await axiosInstance.get('/auth/me');
        return data;
    },
};
