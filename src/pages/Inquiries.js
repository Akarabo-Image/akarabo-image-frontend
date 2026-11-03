import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { DataTable } from '../components/DataTable';
import { Badge } from '../components/Badge';
import { ErrorMessage } from '../components/ErrorMessage';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../ui/EmptyState';
import { LoadingBlock } from '../ui/LoadingBlock';
import { inquiryService } from '../services/inquiryService';
import { formatDateTime } from '../util/formatters';
/** Full directory of every enquiry submitted through the landing page. */
export function Inquiries() {
    const inquiries = useQuery({
        queryKey: ['client-inquiries'],
        queryFn: inquiryService.list,
        refetchInterval: 15000,
    });
    const rows = inquiries.data ?? [];
    const columns = [
        {
            key: 'client',
            header: 'Client',
            render: (inquiry) => _jsxs("div", { children: [_jsx("strong", { children: inquiry.name }), _jsxs("div", { className: "ak-subtle", children: [inquiry.email, inquiry.phone ? ` · ${inquiry.phone}` : ''] })] }),
        },
        {
            key: 'request',
            header: 'Request',
            render: (inquiry) => _jsxs("div", { children: [_jsx("strong", { children: inquiry.service }), _jsx("div", { className: "ak-subtle", children: inquiry.preferredDate || 'No preferred date' })] }),
        },
        {
            key: 'received',
            header: 'Received',
            render: (inquiry) => formatDateTime(inquiry.createdAt),
        },
        {
            key: 'status',
            header: 'Status',
            render: (inquiry) => _jsx(Badge, { tone: inquiry.isRead ? 'neutral' : 'warning', children: inquiry.isRead ? 'Viewed' : 'New' }),
        },
        {
            key: 'action',
            header: 'Details',
            render: (inquiry) => _jsx(Link, { className: "ak-button ak-button--secondary ak-button--sm", to: `/inquiries/${inquiry.id}`, children: "View enquiry" }),
        },
    ];
    return _jsxs(_Fragment, { children: [_jsx(PageHeader, { title: "Enquiries", subtitle: "All requests submitted through the studio landing page." }), inquiries.isLoading ? _jsx(LoadingBlock, { message: "Loading enquiries\u2026" }) : inquiries.error ? _jsx(ErrorMessage, { error: inquiries.error, onRetry: () => void inquiries.refetch() }) : _jsxs("section", { className: "ak-card", children: [_jsxs("header", { className: "ak-card__header", children: [_jsx("h2", { className: "ak-card__title", children: "Client enquiries" }), _jsxs("span", { className: "ak-subtle", children: [rows.length, " total"] })] }), _jsx("div", { className: "ak-card__body", children: _jsx(DataTable, { columns: columns, rows: rows, rowKey: (inquiry) => inquiry.id, empty: _jsx(EmptyState, { title: "No enquiries yet", description: "Landing page requests will appear here." }) }) })] })] });
}
export default Inquiries;
