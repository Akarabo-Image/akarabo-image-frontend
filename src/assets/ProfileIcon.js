import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** Profile icon. */
export function ProfileIcon({ size = 20, color = 'currentColor', ...props }) {
    return (_jsxs("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true", focusable: "false", style: { color }, ...props, children: [_jsx("circle", { cx: "12", cy: "8", r: "3.8", stroke: "currentColor", strokeWidth: "1.6" }), _jsx("path", { d: "M4.5 20.2a7.5 7.5 0 0 1 15 0", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round" })] }));
}
export default ProfileIcon;
