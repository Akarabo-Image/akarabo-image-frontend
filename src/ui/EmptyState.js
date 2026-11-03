import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { InboxIcon } from '../assets';
/** Placeholder shown when a list has no rows. */
export function EmptyState({ icon, title, description, action, }) {
    return (_jsxs("div", { className: "ak-empty", children: [_jsx("div", { className: "ak-empty__icon", children: icon ?? _jsx(InboxIcon, { size: 40 }) }), _jsx("p", { className: "ak-empty__title", children: title }), description && _jsx("p", { className: "ak-small", children: description }), action && _jsx("div", { className: "ak-mt-4", children: action })] }));
}
export default EmptyState;
