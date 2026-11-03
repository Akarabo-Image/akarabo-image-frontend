import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Link, useLocation } from 'react-router-dom';
import { Logo } from '../assets';
import { PageHeader } from '../components/PageHeader';
/** Shown when a route does not exist. */
export function NotFound() {
    const location = useLocation();
    return (_jsxs(_Fragment, { children: [_jsx(PageHeader, { title: "Page not found", subtitle: `We could not find anything at ${location.pathname}.` }), _jsx("div", { className: "ak-card", children: _jsxs("div", { className: "ak-card__body ak-center ak-stack ak-gap-3", children: [_jsx(Logo, { size: 64 }), _jsx("p", { className: "ak-strong", style: { fontSize: 'var(--text-2xl)' }, children: "404" }), _jsx("p", { className: "ak-small ak-muted", children: "The page may have been moved, or the link might be out of date." }), _jsxs("div", { className: "ak-row ak-gap-3 ak-mt-3", children: [_jsx(Link, { to: "/dashboard", className: "ak-button ak-button--primary", children: "Back to dashboard" }), _jsx(Link, { to: "/bookings", className: "ak-button ak-button--secondary", children: "View bookings" })] })] }) })] }));
}
export default NotFound;
