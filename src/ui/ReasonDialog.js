import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Modal } from './Modal';
import { TextAreaField } from './TextAreaField';
/**
 * Collects the mandatory reason for irreversible-but-recorded actions
 * (cancelling a booking, reversing a payment or an expense).
 *
 * The backend keeps the reason forever, so the dialog never allows an empty
 * value.
 */
export function ReasonDialog({ open, title, description, confirmLabel = 'Confirm', isSubmitting = false, onCancel, onConfirm, }) {
    const [reason, setReason] = useState('');
    const [error, setError] = useState(undefined);
    // Reset the field every time the dialog opens.
    useEffect(() => {
        if (open) {
            setReason('');
            setError(undefined);
        }
    }, [open]);
    const handleConfirm = () => {
        const trimmed = reason.trim();
        if (trimmed.length < 3) {
            setError('Please give a short reason (at least 3 characters).');
            return;
        }
        onConfirm(trimmed);
    };
    return (_jsxs(Modal, { open: open, onClose: onCancel, title: title, footer: _jsxs(_Fragment, { children: [_jsx("button", { type: "button", className: "ak-button ak-button--secondary", onClick: onCancel, disabled: isSubmitting, children: "Cancel" }), _jsx("button", { type: "button", className: "ak-button ak-button--danger", onClick: handleConfirm, disabled: isSubmitting, children: isSubmitting ? 'Working…' : confirmLabel })] }), children: [description && _jsx("p", { className: "ak-small ak-muted ak-mb-3", children: description }), _jsx(TextAreaField, { label: "Reason", required: true, name: "reason", rows: 4, maxLength: 500, value: reason, error: error, onChange: (event) => {
                    setReason(event.target.value);
                    if (error)
                        setError(undefined);
                }, placeholder: "Why is this happening? This note is kept forever." })] }));
}
export default ReasonDialog;
