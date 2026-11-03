import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckIcon, ErrorIcon, InfoIcon, WarningIcon } from '../assets';
/** Inline success / warning / info banner. */
export function StatusMessage({ tone = 'info', children }) {
    const icon = tone === 'success' ? (_jsx(CheckIcon, { size: 20 })) : tone === 'danger' ? (_jsx(ErrorIcon, { size: 20 })) : tone === 'warning' ? (_jsx(WarningIcon, { size: 20 })) : (_jsx(InfoIcon, { size: 20 }));
    return (_jsxs("div", { className: `ak-alert ak-alert--${tone}`, role: "status", children: [icon, _jsx("div", { className: "ak-grow", children: children })] }));
}
export default StatusMessage;
