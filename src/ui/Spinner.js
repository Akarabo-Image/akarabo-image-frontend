import { jsx as _jsx } from "react/jsx-runtime";
/** Pure-CSS loading indicator. */
export function Spinner({ large, label = 'Loading' }) {
    return (_jsx("span", { className: `ak-spinner${large ? ' ak-spinner--lg' : ''}`, role: "status", "aria-label": label }));
}
export default Spinner;
