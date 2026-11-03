import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from 'react';
/** Labelled multi-line input. */
export const TextAreaField = forwardRef(function TextAreaField({ label, required, hint, error, id, className, ...props }, ref) {
    const fieldId = id ?? props.name;
    const describedBy = error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined;
    return (_jsxs("div", { className: "ak-field", children: [label && (_jsxs("label", { className: "ak-field__label", htmlFor: fieldId, children: [label, required && _jsx("span", { className: "ak-field__required", children: "*" })] })), _jsx("textarea", { id: fieldId, ref: ref, "aria-invalid": Boolean(error), "aria-describedby": describedBy, className: [
                    'ak-textarea',
                    error ? 'ak-textarea--error' : '',
                    className ?? '',
                ]
                    .filter(Boolean)
                    .join(' '), ...props }), error ? (_jsx("span", { className: "ak-field__error", id: `${fieldId}-error`, children: error })) : hint ? (_jsx("span", { className: "ak-field__hint", id: `${fieldId}-hint`, children: hint })) : null] }));
});
export default TextAreaField;
