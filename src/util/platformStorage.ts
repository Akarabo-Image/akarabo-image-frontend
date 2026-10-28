
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

const TOKEN_KEY = 'akarabo.accessToken';
const USER_KEY = 'akarabo.user';

const isNative = () => Capacitor.isNativePlatform();

export const platformStorage = {
  async get(key: string): Promise<string | null> {
    if (isNative()) {
      const result = await Preferences.get({ key });
      return result.value;
    }

    return window.localStorage.getItem(key);
  },

  async set(key: string, value: string): Promise<void> {
    if (isNative()) {
      await Preferences.set({ key, value });
      return;
    }

    window.localStorage.setItem(key, value);
  },

  async remove(key: string): Promise<void> {
    if (isNative()) {
      await Preferences.remove({ key });
      return;
    }

    window.localStorage.removeItem(key);
  },
};

export { TOKEN_KEY, USER_KEY };
