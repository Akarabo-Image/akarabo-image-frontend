import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Entry point.
 *
 * The providers are ordered from the outside in: React Query needs no
 * context of its own, the auth provider only needs the query client, and the
 * router needs the session to decide what to render.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from './App';
import { NativePushNotifications } from './components/NativePushNotifications';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './i18n/LanguageContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import './styles/tailwind.css';
import './styles/global.css';
/** Shared query client — every screen reads and writes through it. */
const queryClient = new QueryClient({
    mutationCache: new MutationCache({
        onSuccess: (_data, _variables, _context, mutation) => {
            if (mutation.meta?.toast === false)
                return;
            const message = mutation.meta?.successMessage;
            toast.success(typeof message === 'string' ? message : 'Changes saved successfully.');
        },
        onError: (error, _variables, _context, mutation) => {
            if (mutation.meta?.toast === false)
                return;
            const message = mutation.meta?.errorMessage;
            toast.error(typeof message === 'string' ? message : error instanceof Error ? error.message : 'Something went wrong.');
        },
    }),
    defaultOptions: {
        queries: {
            // One retry is enough — a second attempt only delays the error message.
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 30000,
        },
    },
});
const container = document.getElementById('root');
if (!container) {
    throw new Error('Root element #root was not found in index.html');
}
createRoot(container).render(_jsx(StrictMode, { children: _jsx(QueryClientProvider, { client: queryClient, children: _jsx(AuthProvider, { children: _jsx(LanguageProvider, { children: _jsxs(BrowserRouter, { children: [_jsx(NativePushNotifications, {}), _jsx(App, {}), _jsx(ToastContainer, { position: "top-right", autoClose: 4500, newestOnTop: true, closeOnClick: true, pauseOnHover: true, theme: "light" })] }) }) }) }) }));
