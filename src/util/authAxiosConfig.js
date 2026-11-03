import { initializeSessionStorage, tokenStore } from './auth';
/** Returns request config carrying the `Authorization` header, if signed in. */
export async function authConfig() {
    await initializeSessionStorage();
    const token = await tokenStore.get();
    if (!token)
        return {};
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
}
