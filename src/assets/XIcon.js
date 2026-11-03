import { jsx as _jsx } from "react/jsx-runtime";
/** Close icon. */
export function XIcon({ size = 20, color = 'currentColor', ...props }) {
    return (_jsx("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true", focusable: "false", style: { color }, ...props, children: _jsx("path", { d: "m6 6 12 12M18 6 6 18", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round" }) }));
}
export default XIcon;
