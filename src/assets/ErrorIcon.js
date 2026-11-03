import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** Error icon. */
export function ErrorIcon({ size = 20, color = 'currentColor', ...props }) {
    return (_jsxs("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true", focusable: "false", style: { color }, ...props, children: [_jsx("circle", { cx: "12", cy: "12", r: "9", stroke: "currentColor", strokeWidth: "1.6" }), _jsx("path", { d: "m9 9 6 6M15 9l-6 6", stroke: "currentColor", strokeWidth: "1.7", strokeLinecap: "round" })] }));
}
export default ErrorIcon;
