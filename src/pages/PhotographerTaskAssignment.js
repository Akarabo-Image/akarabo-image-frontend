import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { ErrorMessage } from '../components/ErrorMessage';
import { PageHeader } from '../components/PageHeader';
import { axiosInstance } from '../util/axiosInstance';
import { todayIso } from '../util/formatters';
export function PhotographerTaskAssignment() {
    const queryClient = useQueryClient();
    const [assignment, setAssignment] = useState({ studioServiceId: '', photographerUserId: '', taskDate: todayIso(), photosToEdit: '', notes: '' });
    const bounds = useMemo(() => ({ from: '2000-01-01', to: '2099-12-31' }), []);
    const clients = useQuery({ queryKey: ['studio-reports', 'task-client-picker'], queryFn: async () => (await axiosInstance.get('/studio-reports', { params: bounds })).data.clients });
    const photographers = useQuery({ queryKey: ['photographers'], queryFn: async () => (await axiosInstance.get('/photographers')).data });
    const createTask = useMutation({
        mutationFn: async () => (await axiosInstance.post('/photographer-tasks', { ...assignment, photosToEdit: Number(assignment.photosToEdit) })).data,
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['studio-reports'] });
            void queryClient.invalidateQueries({ queryKey: ['photographer-tasks', 'mine'] });
            setAssignment((current) => ({ ...current, studioServiceId: '', photographerUserId: '', photosToEdit: '', notes: '' }));
        },
    });
    return _jsxs(_Fragment, { children: [_jsx(PageHeader, { title: "Assign editing task", subtitle: "Create an assignment for a photographer. Their in-app inbox updates automatically.", actions: _jsx(Link, { className: "ak-button ak-button--secondary", to: "/reports/studio", children: "View studio report" }) }), (clients.error || photographers.error || createTask.error) && _jsx("div", { className: "ak-mb-4", children: _jsx(ErrorMessage, { error: createTask.error ?? clients.error ?? photographers.error }) }), _jsxs("section", { className: "ak-card", children: [_jsx("div", { className: "ak-card__header", children: _jsx("h2", { className: "ak-card__title", children: "Photographer assignment" }) }), _jsx("div", { className: "ak-card__body", children: _jsxs("form", { className: "ak-form__grid", onSubmit: (event) => { event.preventDefault(); createTask.mutate(); }, children: [_jsxs("label", { className: "ak-field", children: [_jsx("span", { className: "ak-field__label", children: "Client visit" }), _jsxs("select", { className: "ak-select", required: true, value: assignment.studioServiceId, onChange: (event) => setAssignment({ ...assignment, studioServiceId: event.target.value }), children: [_jsx("option", { value: "", children: "Choose an in-progress client" }), (clients.data ?? []).filter((client) => client.serviceStatus !== 'SERVED').map((client) => _jsxs("option", { value: client.id, children: [client.customerName, " \u00B7 ", client.photosTaken, " photos"] }, client.id))] })] }), _jsxs("label", { className: "ak-field", children: [_jsx("span", { className: "ak-field__label", children: "Assign photographer" }), _jsxs("select", { className: "ak-select", required: true, value: assignment.photographerUserId, onChange: (event) => setAssignment({ ...assignment, photographerUserId: event.target.value }), children: [_jsx("option", { value: "", children: "Choose photographer" }), (photographers.data ?? []).map((photographer) => _jsx("option", { value: photographer.id, children: photographer.fullName }, photographer.id))] })] }), _jsxs("label", { className: "ak-field", children: [_jsx("span", { className: "ak-field__label", children: "Work date" }), _jsx("input", { className: "ak-input", type: "date", required: true, value: assignment.taskDate, onChange: (event) => setAssignment({ ...assignment, taskDate: event.target.value }) })] }), _jsxs("label", { className: "ak-field", children: [_jsx("span", { className: "ak-field__label", children: "Photos to edit" }), _jsx("input", { className: "ak-input", type: "number", min: "1", required: true, value: assignment.photosToEdit, onChange: (event) => setAssignment({ ...assignment, photosToEdit: event.target.value }) })] }), _jsxs("label", { className: "ak-field", children: [_jsx("span", { className: "ak-field__label", children: "Task notes" }), _jsx("input", { className: "ak-input", maxLength: 500, value: assignment.notes, onChange: (event) => setAssignment({ ...assignment, notes: event.target.value }) })] }), _jsx(Button, { type: "submit", loading: createTask.isPending, children: "Assign editing task" })] }) })] })] });
}
export default PhotographerTaskAssignment;
