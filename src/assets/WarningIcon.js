import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** Warning icon. */
export function WarningIcon({ size = 20, color = 'currentColor', ...props }) {
    return (_jsxs("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true", focusable: "false", style: { color }, ...props, children: [_jsx("path", { d: "M12 3.8 21 19.5H3L12 3.8Z", stroke: "currentColor", strokeWidth: "1.6", strokeLinejoin: "round" }), _jsx("path", { d: "M12 9.5v4.2", stroke: "currentColor", strokeWidth: "1.7", strokeLinecap: "round" }), _jsx("circle", { cx: "12", cy: "16.6", r: "0.9", fill: "currentColor" })] }));
}
export default WarningIcon;
