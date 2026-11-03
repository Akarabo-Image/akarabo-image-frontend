import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../components/Button';
import { ErrorMessage, errorMessage } from '../components/ErrorMessage';
import { DateField } from '../ui/DateField';
import { InputField } from '../ui/InputField';
import { SelectField } from '../ui/SelectField';
import { useCreateExpense } from '../hooks/useExpenses';
import { DEFAULT_CURRENCY, expenseCategoryOptions } from '../data/constants';
import { todayIso } from '../util/formatters';
/** Form used to record studio spending. */
export function ExpenseForm({ onSuccess, onCancel }) {
    const createExpense = useCreateExpense();
    const [serverError, setServerError] = useState();
    const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm({
        defaultValues: {
            category: 'TRANSPORT',
            amount: '',
            currency: DEFAULT_CURRENCY,
            description: '',
            expenseDate: todayIso(),
        },
    });
    const onSubmit = async (values) => {
        setServerError(undefined);
        try {
            await createExpense.mutateAsync({
                category: values.category,
                amount: Number(values.amount),
                currency: values.currency.trim() || DEFAULT_CURRENCY,
                description: values.description.trim(),
                expenseDate: values.expenseDate
                    ? new Date(`${values.expenseDate}T00:00:00`).toISOString()
                    : undefined,
            });
            onSuccess?.();
        }
        catch (error) {
            setServerError(errorMessage(error));
        }
    };
    const failure = createExpense.error ?? serverError;
    return (_jsxs("form", { className: "ak-form ak-form--compact ak-form--finance", onSubmit: handleSubmit(onSubmit), noValidate: true, children: [failure && (_jsx("div", { className: "ak-mb-3", children: _jsx(ErrorMessage, { message: errorMessage(failure) }) })), _jsxs("div", { className: "ak-form__grid", children: [_jsx(SelectField, { label: "Category", required: true, options: expenseCategoryOptions, ...register('category', { required: 'Choose a category.' }), error: errors.category?.message }), _jsx(DateField, { label: "Expense date", required: true, max: todayIso(), ...register('expenseDate', { required: 'Pick the expense date.' }), error: errors.expenseDate?.message })] }), _jsxs("div", { className: "ak-form__grid", children: [_jsx(InputField, { label: "Amount spent", type: "number", min: 0.01, step: 0.01, required: true, placeholder: "20000", ...register('amount', {
                            required: 'Enter the amount spent.',
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
                        }), error: errors.currency?.message })] }), _jsx(InputField, { label: "Description", required: true, placeholder: "Fuel to a wedding shoot in Musanze", ...register('description', {
                    required: 'Describe what the money was spent on.',
                    maxLength: { value: 500, message: 'Description is too long.' },
                }), error: errors.description?.message }), _jsxs("div", { className: "ak-form__actions", children: [onCancel && (_jsx(Button, { variant: "secondary", onClick: onCancel, disabled: isSubmitting, children: "Cancel" })), _jsx(Button, { type: "submit", loading: isSubmitting, children: "Record expense" })] })] }));
}
export default ExpenseForm;
