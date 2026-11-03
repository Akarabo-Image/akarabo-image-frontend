import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ErrorMessage } from '../components/ErrorMessage';
import { PageHeader } from '../components/PageHeader';
import { axiosInstance } from '../util/axiosInstance';
import { formatMoney } from '../util/formatters';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
export function ClientServices() {
    const queryClient = useQueryClient();
    const [amounts, setAmounts] = useState({});
    const [methods, setMethods] = useState({});
    const report = useQuery({
        queryKey: ['studio-reports', 'client-services'],
        queryFn: async () => (await axiosInstance.get('/studio-reports', { params: { from: '2000-01-01', to: '2099-12-31' } })).data,
        refetchInterval: 15000,
    });
    const refresh = () => {
        void queryClient.invalidateQueries({ queryKey: ['studio-reports'] });
        void queryClient.invalidateQueries({ queryKey: ['payments'] });
    };
    const addPayment = useMutation({
        mutationFn: async ({ id, amount, method }) => (await axiosInstance.post('/payments', { studioServiceId: id, amount, currency: 'RWF', method, notes: 'Recorded from client service page' })).data,
        onSuccess: (_data, variables) => { setAmounts((current) => ({ ...current, [variables.id]: '' })); refresh(); },
    });
    const markServed = useMutation({
        mutationFn: async (id) => (await axiosInstance.patch(`/studio-services/${id}/status`, { status: 'SERVED' })).data,
        onSuccess: refresh,
    });
    return _jsxs(_Fragment, { children: [_jsx(PageHeader, { title: "Client services", subtitle: "Record payments and mark photo delivery complete once editing and full payment are complete." }), (report.error || addPayment.error || markServed.error) && _jsx("div", { className: "ak-mb-4", children: _jsx(ErrorMessage, { error: addPayment.error ?? markServed.error ?? report.error, onRetry: () => void report.refetch() }) }), _jsx("section", { className: "ak-card", children: _jsxs("div", { className: "ak-table-wrap", children: [_jsxs("table", { className: "ak-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Client" }), _jsx("th", { children: "Date" }), _jsx("th", { children: "Agreed" }), _jsx("th", { children: "Paid" }), _jsx("th", { children: "Balance" }), _jsx("th", { children: "Editing" }), _jsx("th", { children: "Delivery" }), _jsx("th", { children: "Payment / action" })] }) }), _jsx("tbody", { children: (report.data?.clients ?? []).map((client) => {
                                        const tasks = (report.data?.photographerTasks ?? []).filter((task) => task.studioServiceId === client.id);
                                        const editingComplete = tasks.every((task) => task.status === 'COMPLETED');
                                        return _jsxs("tr", { children: [_jsx("td", { className: "ak-strong", "data-label": "Client", children: client.customerName }), _jsx("td", { "data-label": "Date", children: client.serviceDate }), _jsx("td", { "data-label": "Agreed", children: formatMoney(client.totalAmount, 'RWF') }), _jsx("td", { "data-label": "Paid", children: formatMoney(client.paidAmount, 'RWF') }), _jsx("td", { "data-label": "Balance", children: formatMoney(client.remainingAmount, 'RWF') }), _jsx("td", { "data-label": "Editing", children: _jsx(Badge, { tone: editingComplete ? 'success' : 'warning', children: editingComplete ? 'Complete' : 'In progress' }) }), _jsx("td", { "data-label": "Delivery", children: _jsx(Badge, { tone: client.serviceStatus === 'SERVED' ? 'success' : 'warning', children: client.serviceStatus === 'SERVED' ? 'Served' : 'Not served' }) }), _jsx("td", { "data-label": "Payment / action", children: client.serviceStatus === 'SERVED' ? _jsx("span", { className: "ak-small ak-subtle", children: "Complete" }) : _jsxs("div", { className: "ak-stack ak-gap-2", children: [client.remainingAmount > 0 && _jsxs("form", { className: "ak-row ak-gap-2 ak-wrap", onSubmit: (event) => { event.preventDefault(); addPayment.mutate({ id: client.id, amount: Number(amounts[client.id] ?? client.remainingAmount), method: methods[client.id] ?? 'CASH' }); }, children: [_jsx("input", { className: "ak-input", "aria-label": `Payment amount for ${client.customerName}`, type: "number", min: "0.01", max: client.remainingAmount, step: "0.01", value: amounts[client.id] ?? String(client.remainingAmount), onChange: (event) => setAmounts({ ...amounts, [client.id]: event.target.value }) }), _jsxs("select", { className: "ak-select", "aria-label": `Payment method for ${client.customerName}`, value: methods[client.id] ?? 'CASH', onChange: (event) => setMethods({ ...methods, [client.id]: event.target.value }), children: [_jsx("option", { value: "CASH", children: "Cash" }), _jsx("option", { value: "MOBILE_MONEY", children: "Mobile money" }), _jsx("option", { value: "CARD", children: "Card" }), _jsx("option", { value: "BANK_TRANSFER", children: "Bank transfer" })] }), _jsx(Button, { size: "sm", type: "submit", loading: addPayment.isPending, children: "Record payment" })] }), _jsx(Button, { size: "sm", disabled: !editingComplete || client.remainingAmount > 0, loading: markServed.isPending, onClick: () => markServed.mutate(client.id), children: !editingComplete ? 'Waiting for editing' : client.remainingAmount > 0 ? 'Awaiting full payment' : 'Mark served' })] }) })] }, client.id);
                                    }) })] }), !report.isLoading && !report.data?.clients.length && _jsx("p", { className: "ak-card__body ak-subtle", children: "No client services found." })] }) })] });
}
export default ClientServices;
