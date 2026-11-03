import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ErrorIcon, RefreshIcon } from '../assets';
import { Button } from './Button';
export function errorMessage(error) {
    if (!error)
        return 'Something went wrong.';
    if (typeof error === 'string')
        return error;
    if (error instanceof Error)
        return error.message;
    return 'Something went wrong.';
}
export function ErrorMessage({ error, message, onRetry }) {
    const text = message ?? errorMessage(error);
    return (_jsxs("div", { className: "flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-red-800", role: "alert", children: [_jsx("span", { className: "shrink-0", children: _jsx(ErrorIcon, { size: 18 }) }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("p", { className: "text-xs font-medium", children: text }), onRetry && (_jsx("div", { className: "mt-3", children: _jsx(Button, { variant: "secondary", size: "sm", onClick: onRetry, icon: _jsx(RefreshIcon, { size: 16 }), children: "Try again" }) }))] })] }));
}
export default ErrorMessage;
