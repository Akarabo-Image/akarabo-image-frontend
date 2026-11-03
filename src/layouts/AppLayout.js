import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { NavBar } from '../components/NavBar';
import { NavigationMenu } from '../components/navigationMenu';
/**
 * The signed-in application shell: sidebar, top bar and the routed screen.
 */
export function AppLayout() {
    const [menuOpen, setMenuOpen] = useState(false);
    return (_jsxs("div", { className: "ak-app", children: [_jsx(NavigationMenu, { open: menuOpen, onClose: () => setMenuOpen(false) }), _jsxs("div", { className: "ak-main", children: [_jsx(NavBar, { onToggleMenu: () => setMenuOpen((open) => !open) }), _jsx("main", { className: "ak-content", children: _jsx(Outlet, {}) })] })] }));
}
export default AppLayout;
