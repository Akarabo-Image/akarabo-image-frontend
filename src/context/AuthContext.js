import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Session provider.
 *
 * Owns the signed-in user and the access token. Every component reads the
 * session from here (via `useAuth`) instead of touching storage directly.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, } from 'react';
import { authService } from '../services/authService';
import { initializeSessionStorage, tokenStore, userStore } from '../util/auth';
import { clearSession, setAuthFailureHandler, } from '../util/axiosInstance';
import { toAuthUser } from '../mappers/authMapper';
import { pushNotificationService } from '../services/pushNotificationService';
import { ApiError } from '../types/api';
const AuthContext = createContext(undefined);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    /** Restores the persisted session when the app boots. */
    useEffect(() => {
        let cancelled = false;
        const restoreSession = async () => {
            await initializeSessionStorage();
            const [token, storedUser] = await Promise.all([
                tokenStore.get(),
                userStore.get(),
            ]);
            if (!token) {
                setUser(null);
                setIsLoading(false);
                return;
            }
            if (storedUser) {
                setUser(toAuthUser(storedUser));
                // Show the saved dashboard immediately; profile refresh can complete
                // in the background while a sleeping API wakes up.
                setIsLoading(false);
            }
            try {
                const profile = await authService.me();
                if (cancelled)
                    return;
                setUser(profile);
                await userStore.set(profile);
            }
            catch (error) {
                if (cancelled)
                    return;
                // Only an explicit authentication rejection invalidates a stored
                // session. Timeouts, offline startup, and server errors are transient.
                if (error instanceof ApiError && error.isUnauthorized) {
                    await clearSession();
                    setUser(null);
                }
                else if (!storedUser) {
                    setUser(null);
                }
            }
            finally {
                if (!cancelled)
                    setIsLoading(false);
            }
        };
        void restoreSession().catch(() => {
            if (!cancelled)
                setIsLoading(false);
        });
        return () => {
            cancelled = true;
        };
    }, []);
    const handleSessionExpiry = useCallback(() => {
        void clearSession();
        setUser(null);
    }, []);
    // A 401 anywhere in the app ends the session.
    useEffect(() => {
        setAuthFailureHandler((statusCode) => {
            if (statusCode === 401)
                handleSessionExpiry();
        });
        return () => setAuthFailureHandler(null);
    }, [handleSessionExpiry]);
    const login = useCallback(async (credentials) => {
        const result = await authService.login(credentials);
        await tokenStore.set(result.accessToken);
        // Login already returns the sanitized profile. Reuse it instead of making
        // a second sequential network request to GET /auth/me on mobile.
        const profile = toAuthUser(result.user);
        setUser(profile);
        await userStore.set(profile);
        return profile;
    }, []);
    const logout = useCallback(async () => {
        try {
            await authService.logout();
        }
        catch {
            // A failed audit entry must never block the local sign-out.
        }
        finally {
            await pushNotificationService.unregister().catch(() => undefined);
            await clearSession();
            setUser(null);
        }
    }, []);
    const value = useMemo(() => ({
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        login,
        logout,
        setUser,
        handleSessionExpiry,
    }), [user, isLoading, login, logout, handleSessionExpiry]);
    return _jsx(AuthContext.Provider, { value: value, children: children });
}
/** Reads the session. Must be used inside `AuthProvider`. */
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
