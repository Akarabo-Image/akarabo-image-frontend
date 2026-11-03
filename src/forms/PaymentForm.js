import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../components/Button';
import { ErrorMessage, errorMessage } from '../components/ErrorMessage';
import { InputField } from '../ui/InputField';
import { SelectField } from '../ui/SelectField';
import { TextAreaField } from '../ui/TextAreaField';
import { useCreatePayment } from '../hooks/usePayments';
import { paymentMethodOptions, DEFAULT_CURRENCY } from '../data/constants';
/** Form used to record money received by the studio. */
export function PaymentForm({ bookings = [], onSuccess, onCancel, }) {
    const createPayment = useCreatePayment();
    const [serverError, setServerError] = useState();
    const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm({
        defaultValues: {
            bookingId: '',
            amount: '',
            currency: DEFAULT_CURRENCY,
            method: 'MOBILE_MONEY',
            reference: '',
            notes: '',
        },
    });
    const onSubmit = async (values) => {
        setServerError(undefined);
        try {
            await createPayment.mutateAsync({
                bookingId: values.bookingId || undefined,
                amount: Number(values.amount),
                currency: values.currency.trim() || DEFAULT_CURRENCY,
                method: values.method,
                reference: values.reference?.trim() || undefined,
                notes: values.notes?.trim() || undefined,
            });
            onSuccess?.();
        }
        catch (error) {
            setServerError(errorMessage(error));
        }
    };
    const failure = createPayment.error ?? serverError;
    return (_jsxs("form", { className: "ak-form ak-form--compact ak-form--finance", onSubmit: handleSubmit(onSubmit), noValidate: true, children: [failure && (_jsx("div", { className: "ak-mb-3", children: _jsx(ErrorMessage, { message: errorMessage(failure) }) })), _jsx(SelectField, { label: "Booking (optional)", placeholder: "Not linked to a booking", options: bookings.map((booking) => ({
                    value: booking.id,
                    label: `${booking.eventDate} · ${booking.venue}`,
                })), ...register('bookingId'), error: errors.bookingId?.message }), _jsxs("div", { className: "ak-form__grid", children: [_jsx(InputField, { label: "Amount received", type: "number", min: 0.01, step: 0.01, required: true, placeholder: "150000", ...register('amount', {
                            required: 'Enter the amount received.',
                            validate: (value) => {
                                const parsed = Number(value);
                                if (Number.isNaN(parsed) || parsed <= 0) {
                                    return 'Amount must be greater than zero.';
                                }
                                return true;
                            },
                        }), error: errors.amount?.message }), _jsx(InputField, { label: "Currency", required: true, maxLength: 3, ...register('currency', {
                            required: 'Currency is required.',
                            minLength: { value: 3, message: 'Use a 3-letter code (RWF).' },
                            maxLength: { value: 3, message: 'Use a 3-letter code (RWF).' },
                        }), error: errors.currency?.message })] }), _jsx(SelectField, { label: "Payment method", required: true, options: paymentMethodOptions, ...register('method', { required: 'Choose a payment method.' }), error: errors.method?.message }), _jsx(InputField, { label: "Reference", placeholder: "MP240115.1234.A1234", hint: "Receipt or mobile-money transaction id \u2014 must be unique.", ...register('reference', {
                    maxLength: { value: 120, message: 'Reference is too long.' },
                }), error: errors.reference?.message }), _jsx(TextAreaField, { label: "Notes", rows: 3, ...register('notes', {
                    maxLength: { value: 500, message: 'Notes are too long.' },
                }), error: errors.notes?.message }), _jsxs("div", { className: "ak-form__actions", children: [onCancel && (_jsx(Button, { variant: "secondary", onClick: onCancel, disabled: isSubmitting, children: "Cancel" })), _jsx(Button, { type: "submit", loading: isSubmitting, children: "Record payment" })] })] }));
}
export default PaymentForm;
