import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../components/Button';
import { ErrorMessage, errorMessage } from '../components/ErrorMessage';
import { DateField } from '../ui/DateField';
import { InputField } from '../ui/InputField';
import { SelectField } from '../ui/SelectField';
import { TextAreaField } from '../ui/TextAreaField';
import { useCreateBooking, useUpdateBooking } from '../hooks/useBookings';
import { serviceTypeOptions } from '../data/constants';
import { DEFAULT_CURRENCY } from '../data/constants';
import { todayIso } from '../util/formatters';
/** Create / edit form for studio bookings. */
export function BookingForm({ booking, customers, onSuccess, onCancel, }) {
    const createBooking = useCreateBooking();
    const updateBooking = useUpdateBooking();
    const isEditing = Boolean(booking);
    const { register, handleSubmit, reset, formState: { errors, isSubmitting }, } = useForm({
        defaultValues: {
            customerId: booking?.customerId ?? '',
            serviceType: booking?.serviceType ?? 'WEDDING',
            eventDate: booking?.eventDate ?? todayIso(),
            startTime: booking?.startTime ?? '',
            venue: booking?.venue ?? '',
            expectedGuests: booking?.expectedGuests?.toString() ?? '',
            priceAmount: booking?.priceAmount?.toString() ?? '',
            notes: booking?.notes ?? '',
        },
    });
    useEffect(() => {
        reset({
            customerId: booking?.customerId ?? '',
            serviceType: booking?.serviceType ?? 'WEDDING',
            eventDate: booking?.eventDate ?? todayIso(),
            startTime: booking?.startTime ?? '',
            venue: booking?.venue ?? '',
            expectedGuests: booking?.expectedGuests?.toString() ?? '',
            priceAmount: booking?.priceAmount?.toString() ?? '',
            notes: booking?.notes ?? '',
        });
    }, [booking, reset]);
    const onSubmit = async (values) => {
        const priceAmount = Number(values.priceAmount);
        const expectedGuests = values.expectedGuests
            ? Number(values.expectedGuests)
            : undefined;
        const payload = {
            customerId: values.customerId,
            serviceType: values.serviceType,
            eventDate: values.eventDate,
            startTime: values.startTime || undefined,
            venue: values.venue.trim(),
            expectedGuests,
            priceAmount,
            priceCurrency: DEFAULT_CURRENCY,
            notes: values.notes?.trim() || undefined,
        };
        try {
            const result = booking
                ? await updateBooking.mutateAsync({ id: booking.id, payload })
                : await createBooking.mutateAsync(payload);
            onSuccess?.(result);
        }
        catch {
            // Rendered below the form.
        }
    };
    const failure = createBooking.error ?? updateBooking.error;
    return (_jsxs("form", { className: "ak-form ak-form--compact", onSubmit: handleSubmit(onSubmit), noValidate: true, children: [failure && (_jsx("div", { className: "ak-mb-3", children: _jsx(ErrorMessage, { message: errorMessage(failure) }) })), _jsx(SelectField, { label: "Customer", required: true, placeholder: "Choose a customer\u2026", options: customers.map((customer) => ({
                    value: customer.id,
                    label: customer.name,
                })), ...register('customerId', {
                    required: 'Choose the customer this booking is for.',
                }), error: errors.customerId?.message }), _jsxs("div", { className: "ak-form__grid", children: [_jsx(SelectField, { label: "Service type", required: true, options: serviceTypeOptions, ...register('serviceType', {
                            required: 'Choose the service type.',
                        }), error: errors.serviceType?.message }), _jsx(DateField, { label: "Event date", required: true, min: todayIso(), hint: "The day of the event \u2014 today or later.", ...register('eventDate', {
                            required: 'Pick the event date.',
                        }), error: errors.eventDate?.message })] }), _jsxs("div", { className: "ak-form__grid", children: [_jsx(InputField, { label: "Start time", type: "time", ...register('startTime'), error: errors.startTime?.message }), _jsx(InputField, { label: "Expected guests", type: "number", min: 1, step: 1, placeholder: "250", ...register('expectedGuests', {
                            validate: (value) => {
                                if (!value)
                                    return true;
                                const parsed = Number(value);
                                if (Number.isNaN(parsed) || parsed < 1) {
                                    return 'Guest count must be at least 1.';
                                }
                                return true;
                            },
                        }), error: errors.expectedGuests?.message })] }), _jsx(InputField, { label: "Venue", required: true, placeholder: "Kigali Convention Centre", ...register('venue', {
                    required: 'Venue is required.',
                    maxLength: { value: 300, message: 'Venue is too long.' },
                }), error: errors.venue?.message }), _jsx(InputField, { label: `Agreed price (${DEFAULT_CURRENCY})`, type: "number", min: 0.01, step: 0.01, required: true, placeholder: "1200000", hint: "Money owed for the package \u2014 not the amount received.", ...register('priceAmount', {
                    required: 'Enter the agreed price.',
                    validate: (value) => {
                        const parsed = Number(value);
                        if (Number.isNaN(parsed) || parsed <= 0) {
                            return 'Price must be greater than zero.';
                        }
                        return true;
                    },
                }), error: errors.priceAmount?.message }), _jsx(TextAreaField, { label: "Notes", rows: 4, placeholder: "Shot list, dress code, special requests\u2026", ...register('notes', {
                    maxLength: { value: 500, message: 'Notes are too long.' },
                }), error: errors.notes?.message }), _jsxs("div", { className: "ak-form__actions", children: [onCancel && (_jsx(Button, { variant: "secondary", onClick: onCancel, disabled: isSubmitting, children: "Cancel" })), _jsx(Button, { type: "submit", loading: isSubmitting, children: isEditing ? 'Save changes' : 'Create booking' })] })] }));
}
export default BookingForm;
