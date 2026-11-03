import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** Small coloured pill used for statuses and roles. */
export function Badge({ tone = 'neutral', children, dot }) {
    return (_jsxs("span", { className: `ak-badge ak-badge--${tone}`, children: [dot && (_jsx("span", { "aria-hidden": "true", style: {
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'currentColor',
                    display: 'inline-block',
                } })), children] }));
}
export default Badge;
