import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { PlusIcon, SearchIcon } from '../assets';
import { Badge } from '../components/Badge';
import { DataTable } from '../components/DataTable';
import { ErrorMessage } from '../components/ErrorMessage';
import { PageHeader } from '../components/PageHeader';
import { Pagination } from '../components/Pagination';
import { EmptyState } from '../ui/EmptyState';
import { LoadingBlock } from '../ui/LoadingBlock';
import { InputField } from '../ui/InputField';
import { useAuth } from '../context/AuthContext';
import { useCustomers, usePaginationControls, usePaginationState, } from '../hooks';
import { customerStatusLabel, customerStatusTone, toCustomerView, } from '../mappers/customerMapper';
import { canRegisterCustomers } from '../util/permissions';
import { formatDate } from '../util/formatters';
import { axiosInstance } from '../util/axiosInstance';
/** Customer directory with search, status filter and pagination. */
export function Customers() {
    const { user } = useAuth();
    const isPhotographer = user?.role === 'PHOTOGRAPHER';
    const unfinishedClients = useQuery({
        queryKey: ['studio-services', 'unfinished'],
        queryFn: async () => (await axiosInstance.get('/studio-services/unfinished')).data,
        enabled: isPhotographer,
        refetchInterval: 15000,
    });
    const [search, setSearch] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isActive, setIsActive] = useState('');
    const pagination = usePaginationState();
    const query = useMemo(() => ({
        page: pagination.page,
        limit: pagination.limit,
        ...(searchTerm ? { search: searchTerm } : {}),
        ...(isActive ? { isActive: isActive === 'true' } : {}),
    }), [pagination.page, pagination.limit, searchTerm, isActive]);
    const customers = useCustomers(query, !isPhotographer);
    const controls = usePaginationControls({
        page: pagination.page,
        limit: pagination.limit,
        total: customers.data?.meta.total ?? 0,
    });
    const rows = customers.data?.data ?? [];
    if (isPhotographer) {
        return _jsxs(_Fragment, { children: [_jsx(PageHeader, { title: "Clients in progress", subtitle: "Only clients whose studio service is not complete.", actions: _jsxs(Link, { to: "/customers/new", className: "ak-button ak-button--primary", children: [_jsx(PlusIcon, { size: 18 }), "New client"] }) }), _jsxs("div", { className: "ak-card", children: [unfinishedClients.error && _jsx("div", { className: "ak-card__body", children: _jsx(ErrorMessage, { error: unfinishedClients.error, onRetry: () => void unfinishedClients.refetch() }) }), unfinishedClients.isLoading ? _jsx(LoadingBlock, { message: "Loading clients in progress\u2026" }) : _jsxs("div", { className: "ak-table-wrap", children: [_jsxs("table", { className: "ak-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Client" }), _jsx("th", { children: "Phone" }), _jsx("th", { children: "Service date" }), _jsx("th", { children: "Photos taken" }), _jsx("th", { children: "Status" })] }) }), _jsx("tbody", { children: (unfinishedClients.data ?? []).map((client) => _jsxs("tr", { children: [_jsx("td", { className: "ak-strong", "data-label": "Client", children: client.customerName }), _jsx("td", { "data-label": "Phone", children: client.phoneNumber }), _jsx("td", { "data-label": "Service date", children: client.serviceDate }), _jsx("td", { "data-label": "Photos taken", children: client.photosTaken }), _jsx("td", { "data-label": "Status", children: _jsx(Badge, { tone: "warning", children: "In progress" }) })] }, client.id)) })] }), !unfinishedClients.data?.length && _jsx("p", { className: "ak-card__body ak-subtle", children: "There are no unfinished client services." })] })] })] });
    }
    return (_jsxs(_Fragment, { children: [_jsx(PageHeader, { title: "Customers", subtitle: "People and companies the studio books work for.", actions: canRegisterCustomers(user?.role) && (_jsxs(Link, { to: "/customers/new", className: "ak-button ak-button--primary", children: [_jsx(PlusIcon, { size: 18 }), "New customer"] })) }), _jsxs("div", { className: "ak-card", children: [_jsxs("div", { className: "ak-toolbar", children: [_jsxs("form", { className: "ak-toolbar__search ak-row ak-gap-2", onSubmit: (event) => {
                                    event.preventDefault();
                                    setSearchTerm(search.trim());
                                    pagination.reset();
                                }, children: [_jsx(InputField, { "aria-label": "Search customers", placeholder: "Search by name, phone or email\u2026", value: search, onChange: (event) => setSearch(event.target.value) }), _jsx("button", { type: "submit", className: "ak-button ak-button--secondary", children: _jsx(SearchIcon, { size: 18 }) })] }), _jsxs("select", { className: "ak-select", "aria-label": "Filter by status", value: isActive, onChange: (event) => {
                                    setIsActive(event.target.value);
                                    pagination.reset();
                                }, children: [_jsx("option", { value: "", children: "All customers" }), _jsx("option", { value: "true", children: "Active only" }), _jsx("option", { value: "false", children: "Deactivated only" })] })] }), customers.error && (_jsx("div", { className: "ak-mb-4", style: { padding: '0 1.5rem' }, children: _jsx(ErrorMessage, { error: customers.error, onRetry: () => void customers.refetch() }) })), customers.isLoading ? (_jsx(LoadingBlock, { message: "Loading customers\u2026" })) : (_jsx(DataTable, { rows: rows, rowKey: (customer) => customer.id, empty: _jsx(EmptyState, { title: "No customers found", description: searchTerm
                                ? 'No customer matches that search.'
                                : 'Register the first customer to start booking work.', action: canRegisterCustomers(user?.role) && (_jsx(Link, { to: "/customers/new", className: "ak-button ak-button--primary", children: "New customer" })) }), columns: [
                            {
                                key: 'name',
                                header: 'Name',
                                render: (customer) => {
                                    const view = toCustomerView(customer);
                                    return (_jsxs("span", { className: "ak-stack", children: [_jsx("span", { className: "ak-strong", children: view.displayName }), _jsx("span", { className: "ak-tiny ak-subtle", children: view.displayEmail })] }));
                                },
                            },
                            {
                                key: 'phone',
                                header: 'Phone',
                                render: (customer) => toCustomerView(customer).displayPhone,
                            },
                            {
                                key: 'address',
                                header: 'Address',
                                render: (customer) => toCustomerView(customer).shortAddress,
                            },
                            {
                                key: 'registered',
                                header: 'Registered',
                                render: (customer) => formatDate(customer.createdAt),
                            },
                            {
                                key: 'status',
                                header: 'Status',
                                render: (customer) => (_jsx(Badge, { tone: customerStatusTone(customer.isActive), children: customerStatusLabel(customer.isActive) })),
                            },
                            {
                                key: 'actions',
                                header: '',
                                align: 'right',
                                render: (customer) => (_jsx(Link, { to: `/customers/${customer.id}`, className: "ak-button ak-button--secondary ak-button--sm", children: "Open" })),
                            },
                        ] })), _jsx(Pagination, { page: pagination.page, limit: pagination.limit, total: controls.total, canGoPrevious: controls.canGoPrevious, canGoNext: controls.canGoNext, onPageChange: pagination.setPage, onLimitChange: pagination.setLimit })] })] }));
}
export default Customers;
