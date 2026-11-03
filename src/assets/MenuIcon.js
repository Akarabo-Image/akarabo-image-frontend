import { jsx as _jsx } from "react/jsx-runtime";
/** Menu icon — mobile navigation toggle. */
export function MenuIcon({ size = 20, color = 'currentColor', ...props }) {
    return (_jsx("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true", focusable: "false", style: { color }, ...props, children: _jsx("path", { d: "M4 7h16M4 12h16M4 17h16", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round" }) }));
}
export default MenuIcon;
