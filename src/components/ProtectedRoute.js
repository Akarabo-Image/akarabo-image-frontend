import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingBlock } from '../ui/LoadingBlock';
/**
 * Route guard.
 *
 * Unauthenticated visitors are sent to the login page (remembering where they
 * wanted to go); authenticated users without the required role are sent to
 * the dashboard.
 */
export function ProtectedRoute({ children, roles = [] }) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const location = useLocation();
    if (isLoading) {
        return _jsx(LoadingBlock, { message: "Checking your session\u2026" });
    }
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/login", replace: true, state: { from: location.pathname } });
    }
    if (roles.length > 0 && user && !roles.includes(user.role)) {
        return _jsx(Navigate, { to: "/dashboard", replace: true });
    }
    return _jsx(_Fragment, { children: children });
}
export default ProtectedRoute;
