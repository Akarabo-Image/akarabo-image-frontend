import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../components/Button';
import { ErrorMessage, errorMessage } from '../components/ErrorMessage';
import { InputField } from '../ui/InputField';
import { useUpdateUser } from '../hooks/useUsers';
import { useRefreshProfile } from '../hooks/useAuth';
/**
 * Lets the signed-in user update their own contact details and password.
 *
 * The backend only allows this for managers and the owner, so the screen
 * hides the form for the other roles.
 */
export function ProfileForm({ account, onSuccess }) {
    const updateUser = useUpdateUser();
    const refreshProfile = useRefreshProfile();
    const [serverError, setServerError] = useState(undefined);
    const [saved, setSaved] = useState(false);
    const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm({
        defaultValues: {
            fullName: account.fullName,
            email: account.email,
            phone: account.phone ?? '',
            password: '',
        },
    });
    const onSubmit = async (values) => {
        setServerError(undefined);
        setSaved(false);
        const password = values.password.trim();
        try {
            await updateUser.mutateAsync({
                id: account.id,
                payload: {
                    fullName: values.fullName.trim(),
                    email: values.email.trim(),
                    phone: values.phone.trim() || undefined,
                    ...(password ? { password } : {}),
                },
            });
            // Keep the session (name, email) in sync with the new details.
            await refreshProfile();
            setSaved(true);
            onSuccess?.();
        }
        catch (error) {
            setServerError(errorMessage(error));
        }
    };
    const failure = updateUser.error ?? serverError;
    return (_jsxs("form", { className: "ak-form ak-form--compact", onSubmit: handleSubmit(onSubmit), noValidate: true, children: [failure && (_jsx("div", { className: "ak-mb-3", children: _jsx(ErrorMessage, { message: errorMessage(failure) }) })), saved && !failure && (_jsx("div", { className: "ak-mb-3", children: _jsx("p", { className: "ak-small", style: { color: 'var(--color-success)' }, children: "Your profile has been updated." }) })), _jsx(InputField, { label: "Full name", required: true, placeholder: "Akarabo Manager", ...register('fullName', {
                    required: 'Full name is required.',
                    maxLength: { value: 120, message: 'Name is too long.' },
                }), error: errors.fullName?.message }), _jsxs("div", { className: "ak-form__grid", children: [_jsx(InputField, { label: "Email address", type: "email", required: true, placeholder: "manager@akarabo.rw", ...register('email', {
                            required: 'Email is required.',
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Enter a valid email address.',
                            },
                        }), error: errors.email?.message }), _jsx(InputField, { label: "Phone number", type: "tel", placeholder: "+250788123456", ...register('phone', {
                            pattern: {
                                value: /^\+?[0-9][0-9\s-]{6,19}$/,
                                message: 'Enter a valid phone number.',
                            },
                        }), error: errors.phone?.message })] }), _jsx(InputField, { label: "New password", type: "password", autoComplete: "new-password", placeholder: "Leave blank to keep current", hint: "Fill this in only when you want to change your password.", ...register('password', {
                    minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters.',
                    },
                    maxLength: {
                        value: 72,
                        message: 'Password must be at most 72 characters.',
                    },
                }), error: errors.password?.message }), _jsx("div", { className: "ak-form__actions", children: _jsx(Button, { type: "submit", loading: isSubmitting, children: "Save profile" }) })] }));
}
export default ProfileForm;
