import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
/** Consistent header used at the top of every screen. */
export function PageHeader({ title, subtitle, actions, crumbs, }) {
    return (_jsxs("header", { className: "ak-page-header", children: [_jsxs("div", { children: [crumbs && crumbs.length > 0 && (_jsx("nav", { className: "ak-breadcrumbs", "aria-label": "Breadcrumb", children: crumbs.map((crumb, index) => (_jsxs("span", { className: "ak-row ak-gap-2", children: [crumb.to ? (_jsx(Link, { to: crumb.to, children: crumb.label })) : (_jsx("span", { children: crumb.label })), index < crumbs.length - 1 && _jsx("span", { "aria-hidden": "true", children: "/" })] }, `${crumb.label}-${index}`))) })), _jsx("h1", { className: "ak-page-header__title", children: title }), subtitle && _jsx("p", { className: "ak-page-header__subtitle", children: subtitle })] }), actions && _jsx("div", { className: "ak-page-header__actions", children: actions })] }));
}
export default PageHeader;
