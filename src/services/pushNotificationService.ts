import { axiosInstance } from '../util/axiosInstance';

let registeredToken: string | null = null;

export const pushNotificationService = {
  async register(token: string): Promise<void> {
    await axiosInstance.put('/notifications/device-token', { token });
    registeredToken = token;
  },

  async unregister(): Promise<void> {
    const token = registeredToken;
    if (!token) return;
    try {
      await axiosInstance.delete('/notifications/device-token', { data: { token } });
    } finally {
      registeredToken = null;
    }
  },
};
