import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** Single metric tile used on the dashboard. */
export function StatCard({ label, value, meta, icon }) {
    return (_jsxs("article", { className: "ak-stat", children: [_jsxs("div", { className: "ak-row ak-between ak-items-start", children: [_jsx("p", { className: "ak-stat__label", children: label }), icon && _jsx("span", { className: "ak-subtle", children: icon })] }), _jsx("p", { className: "ak-stat__value", children: value }), meta && _jsx("p", { className: "ak-stat__meta", children: meta })] }));
}
export default StatCard;
