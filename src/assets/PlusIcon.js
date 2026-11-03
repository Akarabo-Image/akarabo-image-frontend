import { jsx as _jsx } from "react/jsx-runtime";
/** Plus icon — create actions. */
export function PlusIcon({ size = 20, color = 'currentColor', ...props }) {
    return (_jsx("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true", focusable: "false", style: { color }, ...props, children: _jsx("path", { d: "M12 5v14M5 12h14", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round" }) }));
}
export default PlusIcon;
