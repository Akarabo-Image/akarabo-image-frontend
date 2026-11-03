import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** Clock icon. */
export function ClockIcon({ size = 20, color = 'currentColor', ...props }) {
    return (_jsxs("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true", focusable: "false", style: { color }, ...props, children: [_jsx("circle", { cx: "12", cy: "12", r: "8.5", stroke: "currentColor", strokeWidth: "1.6" }), _jsx("path", { d: "M12 7v5.3l3.3 2", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round" })] }));
}
export default ClockIcon;
