import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from 'react';
/** Labelled select used by every form in the app. */
export const SelectField = forwardRef(function SelectField({ label, required, hint, error, id, options, placeholder, className, ...props }, ref) {
    const fieldId = id ?? props.name;
    const describedBy = error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined;
    return (_jsxs("div", { className: "ak-field", children: [label && (_jsxs("label", { className: "ak-field__label", htmlFor: fieldId, children: [label, required && _jsx("span", { className: "ak-field__required", children: "*" })] })), _jsxs("select", { id: fieldId, ref: ref, "aria-invalid": Boolean(error), "aria-describedby": describedBy, className: [
                    'ak-select',
                    error ? 'ak-select--error' : '',
                    className ?? '',
                ]
                    .filter(Boolean)
                    .join(' '), ...props, children: [placeholder !== undefined && _jsx("option", { value: "", children: placeholder }), options.map((option) => (_jsx("option", { value: option.value, disabled: option.disabled, children: option.label }, option.value)))] }), error ? (_jsx("span", { className: "ak-field__error", id: `${fieldId}-error`, children: error })) : hint ? (_jsx("span", { className: "ak-field__hint", id: `${fieldId}-hint`, children: hint })) : null] }));
});
export default SelectField;
