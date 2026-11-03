import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink as RouterNavLink } from 'react-router-dom';
/** A single entry of the sidebar navigation. */
export function NavItem({ link, onNavigate }) {
    const Icon = link.icon;
    return (_jsxs(RouterNavLink, { to: link.to, end: link.end, onClick: onNavigate, className: ({ isActive }) => `ak-nav-item${isActive ? ' ak-nav-item--active' : ''}`, children: [_jsx("span", { className: "ak-nav-item__icon", children: _jsx(Icon, { size: 18 }) }), _jsx("span", { children: link.label })] }));
}
export default NavItem;
