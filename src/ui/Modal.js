import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { XIcon } from '../assets';
/** Accessible modal dialog rendered in a portal. */
export function Modal({ open, onClose, title, children, footer }) {
    // Close on Escape.
    useEffect(() => {
        if (!open)
            return;
        const onKeyDown = (event) => {
            if (event.key === 'Escape')
                onClose();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [open, onClose]);
    // Lock the page behind the dialog.
    useEffect(() => {
        if (!open)
            return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previous;
        };
    }, [open]);
    if (!open)
        return null;
    return createPortal(_jsx("div", { className: "ak-modal__backdrop", role: "presentation", onClick: onClose, children: _jsxs("div", { className: "ak-modal", role: "dialog", "aria-modal": "true", "aria-label": title, onClick: (event) => event.stopPropagation(), children: [_jsxs("header", { className: "ak-modal__header", children: [_jsx("h2", { className: "ak-modal__title", children: title }), _jsx("button", { type: "button", className: "ak-button ak-button--ghost ak-button--sm", onClick: onClose, "aria-label": "Close dialog", children: _jsx(XIcon, { size: 18 }) })] }), _jsx("div", { className: "ak-modal__body", children: children }), footer && _jsx("footer", { className: "ak-modal__footer", children: footer })] }) }), document.body);
}
export default Modal;
