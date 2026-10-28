import { Capacitor } from '@capacitor/core';
import { platformStorage, TOKEN_KEY, USER_KEY } from './platformStorage';

let initialization: Promise<void> | null = null;

/** Resolves after native Preferences have been loaded before API use. */
export function initializeSessionStorage(): Promise<void> {
  initialization ??= (async () => {
    if (!Capacitor.isNativePlatform()) return;

    // Migrate sessions created by earlier Android builds which used WebView
    // localStorage. Preferences becomes the single native source afterward.
    const [nativeToken, nativeUser] = await Promise.all([
      platformStorage.get(TOKEN_KEY),
      platformStorage.get(USER_KEY),
    ]);
    if (!nativeToken) {
      const legacyToken = window.localStorage.getItem(TOKEN_KEY);
      if (legacyToken) await platformStorage.set(TOKEN_KEY, legacyToken);
    }
    if (!nativeUser) {
      const legacyUser = window.localStorage.getItem(USER_KEY);
      if (legacyUser) await platformStorage.set(USER_KEY, legacyUser);
    }
  })();
  return initialization;
}

export const tokenStore = {
  async get(): Promise<string | null> {
    await initializeSessionStorage();
    return platformStorage.get(TOKEN_KEY);
  },
  async set(token: string): Promise<void> {
    await initializeSessionStorage();
    await platformStorage.set(TOKEN_KEY, token);
  },
  async clear(): Promise<void> {
    await initializeSessionStorage();
    await platformStorage.remove(TOKEN_KEY);
  },
};

export const userStore = {
  async get<T>(): Promise<T | null> {
    await initializeSessionStorage();
    const raw = await platformStorage.get(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      await platformStorage.remove(USER_KEY);
      return null;
    }
  },
  async set<T>(user: T): Promise<void> {
    await initializeSessionStorage();
    await platformStorage.set(USER_KEY, JSON.stringify(user));
  },
  async clear(): Promise<void> {
    await initializeSessionStorage();
    await platformStorage.remove(USER_KEY);
  },
};

export async function hasSession(): Promise<boolean> {
  return Boolean(await tokenStore.get());
}
