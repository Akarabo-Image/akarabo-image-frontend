import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** Money icon — payments received. */
export function MoneyIcon({ size = 20, color = 'currentColor', ...props }) {
    return (_jsxs("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true", focusable: "false", style: { color }, ...props, children: [_jsx("rect", { x: "2.5", y: "6", width: "19", height: "12", rx: "2.5", stroke: "currentColor", strokeWidth: "1.6" }), _jsx("circle", { cx: "12", cy: "12", r: "2.8", stroke: "currentColor", strokeWidth: "1.6" }), _jsx("path", { d: "M6 10v4M18 10v4", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round" })] }));
}
export default MoneyIcon;
