import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '../components/Button';
import { ErrorMessage } from '../components/ErrorMessage';
import { InputField } from '../ui/InputField';
import { TextAreaField } from '../ui/TextAreaField';
import { useCreateCustomer, useUpdateCustomer } from '../hooks/useCustomers';
import { useCreatePayment } from '../hooks/usePayments';
import { errorMessage } from '../components/ErrorMessage';
import { axiosInstance } from '../util/axiosInstance';
import { todayIso } from '../util/formatters';
import { useAuth } from '../context/AuthContext';
/** Registration / edit form for studio customers. */
export function CustomerForm({ customer, initialValues, initialRecordVisit, onSuccess, onCancel, }) {
    const createCustomer = useCreateCustomer();
    const { user } = useAuth();
    const isPhotographer = user?.role === 'PHOTOGRAPHER';
    const updateCustomer = useUpdateCustomer();
    const createPayment = useCreatePayment();
    const queryClient = useQueryClient();
    const isEditing = Boolean(customer);
    const [savedCustomer, setSavedCustomer] = useState(null);
    const [savedStudioServiceId, setSavedStudioServiceId] = useState(null);
    const [visitError, setVisitError] = useState();
    const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting }, } = useForm({
        defaultValues: {
            name: customer?.name ?? initialValues?.name ?? '',
            phone: customer?.phone ?? initialValues?.phone ?? '',
            email: customer?.email ?? initialValues?.email ?? '',
            address: customer?.address ?? initialValues?.address ?? '',
            notes: customer?.notes ?? initialValues?.notes ?? '',
            recordVisit: initialRecordVisit ?? !customer,
            serviceDate: todayIso(),
            totalAmount: isPhotographer ? 0 : undefined,
            needsUrgentService: false,
            initialPaidAmount: 0,
            paymentMethod: 'CASH',
            paymentReference: '',
        },
    });
    // Re-sync the form when the edited customer changes.
    useEffect(() => {
        reset({
            name: customer?.name ?? initialValues?.name ?? '',
            phone: customer?.phone ?? initialValues?.phone ?? '',
            email: customer?.email ?? initialValues?.email ?? '',
            address: customer?.address ?? initialValues?.address ?? '',
            notes: customer?.notes ?? initialValues?.notes ?? '',
            recordVisit: initialRecordVisit ?? !customer,
            serviceDate: todayIso(),
            totalAmount: isPhotographer ? 0 : undefined,
            needsUrgentService: false,
            initialPaidAmount: 0,
            paymentMethod: 'CASH',
            paymentReference: '',
        });
    }, [customer, initialValues, initialRecordVisit, reset]);
    const onSubmit = async (values) => {
        setVisitError(undefined);
        let createdCustomer = savedCustomer;
        const payload = {
            name: values.name.trim(),
            phone: values.phone.trim(),
            email: values.email?.trim() || undefined,
            address: values.address?.trim() || undefined,
            notes: values.notes?.trim() || undefined,
        };
        try {
            const result = customer
                ? await updateCustomer.mutateAsync({ id: customer.id, payload })
                : savedCustomer ?? await createCustomer.mutateAsync(payload);
            if (!customer && !savedCustomer) {
                createdCustomer = result;
                setSavedCustomer(result);
            }
            if (!customer && values.recordVisit) {
                let serviceId = savedStudioServiceId;
                if (!serviceId) {
                    const response = await axiosInstance.post('/studio-services', {
                        customerId: result.id,
                        serviceDate: values.serviceDate,
                        photosTaken: Number(values.photosTaken),
                        softPhotos: Number(values.softPhotos),
                        hardPhotos: Number(values.hardPhotos),
                        totalAmount: isPhotographer ? 0 : Number(values.totalAmount),
                        needsUrgentService: values.needsUrgentService,
                    });
                    serviceId = response.data.id;
                    setSavedStudioServiceId(serviceId);
                }
                if (Number(values.initialPaidAmount) > 0) {
                    await createPayment.mutateAsync({ studioServiceId: serviceId, amount: Number(values.initialPaidAmount), method: values.paymentMethod, reference: values.paymentReference?.trim() || undefined });
                }
                await queryClient.invalidateQueries({ queryKey: ['studio-reports'] });
            }
            onSuccess?.(result);
        }
        catch (error) {
            // The mutation error is rendered below the form.
            if (createdCustomer) {
                setSavedCustomer(createdCustomer);
                setVisitError(error);
            }
        }
    };
    const failure = visitError ?? createCustomer.error ?? updateCustomer.error;
    const recordVisit = watch('recordVisit');
    const agreedAmount = watch('totalAmount');
    const customerLocked = Boolean(savedCustomer);
    return (_jsxs("form", { className: "ak-form ak-form--compact", onSubmit: handleSubmit(onSubmit), noValidate: true, children: [failure && (_jsx("div", { className: "ak-mb-3", children: _jsx(ErrorMessage, { message: errorMessage(failure) }) })), _jsxs("div", { className: "ak-form__grid", children: [_jsx(InputField, { label: "Customer name", placeholder: "Aline Uwase", required: true, disabled: customerLocked, ...register('name', {
                            required: 'Customer name is required.',
                            maxLength: { value: 200, message: 'Name is too long.' },
                        }), error: errors.name?.message }), _jsx(InputField, { label: "Phone number", type: "tel", placeholder: "+250788111222", required: true, disabled: customerLocked, ...register('phone', {
                            required: 'Phone number is required.',
                            maxLength: { value: 30, message: 'Phone number is too long.' },
                        }), error: errors.phone?.message })] }), _jsx(InputField, { label: "Email address", type: "email", placeholder: "aline@example.rw", ...register('email', {
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Enter a valid email address.',
                    },
                }), error: errors.email?.message, disabled: customerLocked }), _jsx(InputField, { label: "Address", placeholder: "KG 11 Ave, Kigali", ...register('address', {
                    maxLength: { value: 300, message: 'Address is too long.' },
                }), error: errors.address?.message, disabled: customerLocked }), _jsx(TextAreaField, { label: "Notes", rows: 4, placeholder: "Preferences, special requests, referral source\u2026", ...register('notes', {
                    maxLength: { value: 1200, message: 'Notes are too long.' },
                }), error: errors.notes?.message, disabled: customerLocked }), !isEditing && (_jsx("section", { className: "ak-card", "aria-labelledby": "visit-details-title", children: _jsxs("div", { className: "ak-card__body", children: [_jsxs("label", { className: "ak-row ak-gap-2 ak-small ak-strong", children: [_jsx("input", { type: "checkbox", ...register('recordVisit') }), "Add today\u2019s studio visit to this customer"] }), recordVisit && (_jsxs("div", { className: "ak-mt-4 ak-stack ak-gap-4", children: [_jsx("h3", { id: "visit-details-title", className: "ak-small ak-strong", children: "Studio visit details" }), _jsxs("div", { className: "ak-form__grid", children: [_jsx(InputField, { label: "Service date", type: "date", required: true, ...register('serviceDate', { required: recordVisit ? 'Service date is required.' : false }), error: errors.serviceDate?.message }), _jsx(InputField, { label: "Photos taken", type: "number", min: "0", required: true, ...register('photosTaken', { required: recordVisit ? 'Photo count is required.' : false, valueAsNumber: true, min: { value: 0, message: 'Enter zero or more.' } }), error: errors.photosTaken?.message }), _jsx(InputField, { label: "Soft photos", type: "number", min: "0", required: true, ...register('softPhotos', { required: recordVisit ? 'Soft photo count is required.' : false, valueAsNumber: true, min: { value: 0, message: 'Enter zero or more.' } }), error: errors.softPhotos?.message }), _jsx(InputField, { label: "Hard photos", type: "number", min: "0", required: true, ...register('hardPhotos', { required: recordVisit ? 'Hard photo count is required.' : false, valueAsNumber: true, min: { value: 0, message: 'Enter zero or more.' } }), error: errors.hardPhotos?.message })] }), !isPhotographer && _jsx(InputField, { label: "Agreed total (RWF)", type: "number", min: "0", step: "0.01", required: true, ...register('totalAmount', { required: recordVisit ? 'Agreed total is required.' : false, valueAsNumber: true, min: { value: 0, message: 'Enter zero or more.' } }), error: errors.totalAmount?.message }), !isPhotographer && _jsxs(_Fragment, { children: [_jsxs("div", { className: "ak-form__grid", children: [_jsx(InputField, { label: "Amount paid now (RWF)", type: "number", min: "0", step: "0.01", ...register('initialPaidAmount', { valueAsNumber: true, min: { value: 0, message: 'Enter zero or more.' }, validate: (value) => !value || Number(value) <= Number(agreedAmount || 0) || 'Payment cannot exceed the agreed total.' }), error: errors.initialPaidAmount?.message }), _jsxs("label", { className: "ak-field", children: [_jsx("span", { className: "ak-field__label", children: "Payment method" }), _jsxs("select", { className: "ak-select", ...register('paymentMethod'), children: [_jsx("option", { value: "CASH", children: "Cash" }), _jsx("option", { value: "MOBILE_MONEY", children: "Mobile money" }), _jsx("option", { value: "CARD", children: "Card" }), _jsx("option", { value: "BANK_TRANSFER", children: "Bank transfer" })] })] })] }), Number(watch('initialPaidAmount')) > 0 && _jsx(InputField, { label: "Payment reference (optional)", ...register('paymentReference', { maxLength: { value: 120, message: 'Reference is too long.' } }), error: errors.paymentReference?.message })] }), _jsxs("label", { className: "ak-row ak-gap-2 ak-small", children: [_jsx("input", { type: "checkbox", ...register('needsUrgentService') }), "Add this customer to the ASAP service queue"] })] })), savedCustomer && _jsx("p", { className: "ak-field__hint ak-mt-3", children: "Customer details are saved. Submit again to retry saving the visit." })] }) })), _jsxs("div", { className: "ak-form__actions", children: [onCancel && (_jsx(Button, { variant: "secondary", onClick: onCancel, disabled: isSubmitting, children: "Cancel" })), _jsx(Button, { type: "submit", loading: isSubmitting, children: isEditing ? 'Save changes' : savedCustomer ? 'Retry visit details' : 'Register customer' })] })] }));
}
export default CustomerForm;
