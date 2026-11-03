import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Spinner } from './Spinner';
/** Full-width loading placeholder for list screens. */
export function LoadingBlock({ message = 'Loading…' }) {
    return (_jsxs("div", { className: "ak-loading-block", children: [_jsx(Spinner, { large: true }), _jsx("span", { className: "ak-small", children: message })] }));
}
export default LoadingBlock;
