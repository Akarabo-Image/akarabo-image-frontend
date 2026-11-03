import { axiosInstance } from '../util/axiosInstance';
let registeredToken = null;
export const pushNotificationService = {
    async register(token) {
        await axiosInstance.put('/notifications/device-token', { token });
        registeredToken = token;
    },
    async unregister() {
        const token = registeredToken;
        if (!token)
            return;
        try {
            await axiosInstance.delete('/notifications/device-token', { data: { token } });
        }
        finally {
            registeredToken = null;
        }
    },
};
