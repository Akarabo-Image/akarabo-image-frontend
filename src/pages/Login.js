import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Logo } from '../assets';
import { LoginForm } from '../forms/LoginForm';
import { useAuth } from '../context/AuthContext';
export function Login() {
    const { isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state;
    useEffect(() => {
        if (isAuthenticated && !isLoading) {
            navigate(state?.from ?? '/dashboard', { replace: true });
        }
    }, [isAuthenticated, isLoading, navigate, state?.from]);
    if (isAuthenticated) {
        return _jsx(Navigate, { to: state?.from ?? '/dashboard', replace: true });
    }
    return (_jsx("main", { className: "flex min-h-screen items-center justify-center bg-gray-100 p-4 text-gray-800 sm:p-6", children: _jsxs("section", { className: "w-full max-w-xs rounded-2xl bg-white p-6 shadow-xl shadow-gray-200/70 sm:p-8", children: [_jsxs(Link, { to: "/", className: "mb-7 inline-flex items-center gap-2.5 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2", children: [_jsx(Logo, { size: 30 }), _jsx("span", { className: "text-sm font-semibold tracking-tight text-gray-900", children: "Akarabo Studio" })] }), _jsx("h1", { className: "text-xl font-semibold tracking-tight text-gray-900", children: "Welcome Back" }), _jsx("p", { className: "mt-1 text-xs text-gray-500", children: "Please login to your account" }), _jsx(LoginForm, {})] }) }));
}
export default Login;
