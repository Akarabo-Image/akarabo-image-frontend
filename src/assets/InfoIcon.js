import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** Info icon. */
export function InfoIcon({ size = 20, color = 'currentColor', ...props }) {
    return (_jsxs("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true", focusable: "false", style: { color }, ...props, children: [_jsx("circle", { cx: "12", cy: "12", r: "9", stroke: "currentColor", strokeWidth: "1.6" }), _jsx("path", { d: "M12 11v5.2", stroke: "currentColor", strokeWidth: "1.7", strokeLinecap: "round" }), _jsx("circle", { cx: "12", cy: "8", r: "0.95", fill: "currentColor" })] }));
}
export default InfoIcon;
