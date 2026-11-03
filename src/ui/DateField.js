import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from 'react';
/**
 * Date input restricted to `yyyy-mm-dd` — the exact format the API expects
 * for calendar days.
 */
export const DateField = forwardRef(function DateField({ label, required, hint, error, id, className, ...props }, ref) {
    const fieldId = id ?? props.name;
    const describedBy = error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined;
    return (_jsxs("div", { className: "ak-field", children: [label && (_jsxs("label", { className: "ak-field__label", htmlFor: fieldId, children: [label, required && _jsx("span", { className: "ak-field__required", children: "*" })] })), _jsx("input", { id: fieldId, ref: ref, type: "date", "aria-invalid": Boolean(error), "aria-describedby": describedBy, className: [
                    'ak-input',
                    error ? 'ak-input--error' : '',
                    className ?? '',
                ]
                    .filter(Boolean)
                    .join(' '), ...props }), error ? (_jsx("span", { className: "ak-field__error", id: `${fieldId}-error`, children: error })) : hint ? (_jsx("span", { className: "ak-field__hint", id: `${fieldId}-hint`, children: hint })) : null] }));
});
export default DateField;
