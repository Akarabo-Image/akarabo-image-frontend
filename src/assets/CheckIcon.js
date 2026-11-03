import { jsx as _jsx } from "react/jsx-runtime";
/** Check mark — confirm / success. */
export function CheckIcon({ size = 20, color = 'currentColor', ...props }) {
    return (_jsx("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true", focusable: "false", style: { color }, ...props, children: _jsx("path", { d: "m4.5 12.5 5 5 10-11", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round" }) }));
}
export default CheckIcon;
