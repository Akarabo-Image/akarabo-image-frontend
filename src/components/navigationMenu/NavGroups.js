import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { NavItem } from './NavItem';
/** Renders every navigation group, skipping empty ones. */
export function NavGroups({ groups, onNavigate }) {
    return (_jsx(_Fragment, { children: groups.map((group) => (_jsxs("div", { children: [_jsx("p", { className: "ak-sidebar__group-title", children: group.title }), _jsx("ul", { className: "ak-stack ak-gap-1", children: group.links.map((link) => (_jsx("li", { children: _jsx(NavItem, { link: link, onNavigate: onNavigate }) }, link.to))) })] }, group.title))) }));
}
export default NavGroups;
