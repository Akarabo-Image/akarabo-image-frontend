import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { LogoutIcon, Logo, XIcon } from '../../assets';
import { useAuth } from '../../context/AuthContext';
import { useLogout } from '../../hooks/useAuth';
import { roleLabel } from '../../mappers/authMapper';
import { NavGroups } from './NavGroups';
import { visibleNavGroups } from './navLinks';
/** The application sidebar: brand, links and the signed-in staff card. */
export function NavigationMenu({ open = false, onClose }) {
    const { user } = useAuth();
    const logout = useLogout();
    const groups = useMemo(() => visibleNavGroups(user?.role), [user?.role]);
    return (_jsxs("aside", { className: `ak-sidebar${open ? ' ak-sidebar--open' : ''}`, children: [_jsxs("div", { className: "ak-sidebar__brand", children: [_jsx(Link, { to: "/dashboard", onClick: onClose, children: _jsx(Logo, { size: 34 }) }), _jsxs("div", { children: [_jsx("p", { className: "ak-sidebar__brand-name", children: "Akarabo Image" }), _jsx("p", { className: "ak-sidebar__brand-tag", children: "Studio Manager" })] }), _jsx("button", { type: "button", className: "ak-sidebar__close", onClick: onClose, "aria-label": "Close navigation menu", children: _jsx(XIcon, { size: 22 }) })] }), _jsx("nav", { className: "ak-sidebar__nav", "aria-label": "Main navigation", children: _jsx(NavGroups, { groups: groups, onNavigate: onClose }) }), _jsx("div", { className: "ak-sidebar__footer", children: user && (_jsxs("div", { className: "ak-sidebar__account", children: [_jsxs(Link, { to: "/profile", className: "ak-row ak-gap-3 ak-sidebar__account-link", onClick: onClose, children: [_jsx("span", { className: "ak-avatar", children: user.fullName.charAt(0).toUpperCase() }), _jsxs("div", { className: "ak-truncate", children: [_jsx("p", { className: "ak-small ak-strong ak-truncate", style: { color: '#fff' }, children: user.fullName }), _jsx("p", { className: "ak-tiny ak-truncate", children: roleLabel(user.role) })] })] }), _jsxs("button", { type: "button", className: "ak-sidebar__signout", onClick: () => void logout(), children: [_jsx(LogoutIcon, { size: 17 }), _jsx("span", { children: "Sign out" })] })] })) })] }));
}
export default NavigationMenu;
