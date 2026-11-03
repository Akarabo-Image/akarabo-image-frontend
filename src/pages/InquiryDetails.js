import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeftIcon } from '../assets';
import { Button } from '../components/Button';
import { ErrorMessage } from '../components/ErrorMessage';
import { PageHeader } from '../components/PageHeader';
import { CustomerForm } from '../forms/CustomerForm';
import { inquiryService } from '../services/inquiryService';
import { LoadingBlock } from '../ui/LoadingBlock';
import { formatDate } from '../util/formatters';
/** Full client message and customer registration from a landing-page enquiry. */
export function InquiryDetails() {
    const { id = '' } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [registering, setRegistering] = useState(false);
    const readStarted = useRef(undefined);
    const inquiry = useQuery({
        queryKey: ['client-inquiry', id],
        queryFn: () => inquiryService.get(id),
        enabled: Boolean(id),
    });
    const record = inquiry.data;
    useEffect(() => {
        if (!record || record.isRead || readStarted.current === record.id)
            return;
        readStarted.current = record.id;
        void inquiryService.markRead(record.id).then(() => {
            queryClient.setQueryData(['client-inquiry', record.id], { ...record, isRead: true });
            return queryClient.invalidateQueries({ queryKey: ['client-inquiries'] });
        }).catch(() => undefined);
    }, [record, queryClient]);
    const customerValues = useMemo(() => {
        if (!record)
            return undefined;
        const notes = [
            'Website enquiry',
            `Service requested: ${record.service}`,
            record.preferredDate ? `Preferred date: ${record.preferredDate}` : undefined,
            record.message ? `Message: ${record.message}` : undefined,
        ].filter(Boolean).join('\n');
        return {
            name: record.name,
            phone: record.phone ?? '',
            email: record.email,
            notes,
        };
    }, [record]);
    if (inquiry.isLoading)
        return _jsx(LoadingBlock, { message: "Loading client enquiry\u2026" });
    if (inquiry.error || !record) {
        return _jsxs(_Fragment, { children: [_jsx(PageHeader, { title: "Client enquiry" }), _jsx(ErrorMessage, { error: inquiry.error, message: inquiry.error ? undefined : 'This enquiry does not exist.', onRetry: () => void inquiry.refetch() })] });
    }
    return _jsxs(_Fragment, { children: [_jsx(PageHeader, { title: record.name, subtitle: "Landing page enquiry", crumbs: [{ label: 'Enquiries', to: '/inquiries' }, { label: 'Client enquiry' }], actions: _jsxs(Link, { to: "/inquiries", className: "ak-button ak-button--secondary", children: [_jsx(ArrowLeftIcon, { size: 18 }), "Back to enquiries"] }) }), _jsxs("section", { className: "ak-card ak-mb-4", children: [_jsxs("header", { className: "ak-card__header", children: [_jsx("h2", { className: "ak-card__title", children: "Contact and request" }), _jsxs("span", { className: "ak-subtle", children: ["Received ", formatDate(record.createdAt)] })] }), _jsxs("div", { className: "ak-card__body", children: [_jsxs("div", { className: "ak-detail-grid", children: [_jsxs("div", { children: [_jsx("p", { className: "ak-detail__label", children: "Email" }), _jsx("p", { className: "ak-detail__value", children: _jsx("a", { href: `mailto:${record.email}`, children: record.email }) })] }), _jsxs("div", { children: [_jsx("p", { className: "ak-detail__label", children: "Phone" }), _jsx("p", { className: "ak-detail__value", children: record.phone ? _jsx("a", { href: `tel:${record.phone}`, children: record.phone }) : 'Not provided' })] }), _jsxs("div", { children: [_jsx("p", { className: "ak-detail__label", children: "Interested in" }), _jsx("p", { className: "ak-detail__value", children: record.service })] }), _jsxs("div", { children: [_jsx("p", { className: "ak-detail__label", children: "Preferred date" }), _jsx("p", { className: "ak-detail__value", children: record.preferredDate || 'Not specified' })] })] }), _jsx("hr", {}), _jsx("p", { className: "ak-detail__label", children: "Message" }), _jsx("p", { className: "ak-detail__value", style: { whiteSpace: 'pre-wrap' }, children: record.message || 'No message included.' })] })] }), _jsxs("section", { className: "ak-card", children: [_jsxs("header", { className: "ak-card__header", children: [_jsx("h2", { className: "ak-card__title", children: "Client record" }), !registering && _jsx(Button, { onClick: () => setRegistering(true), children: "Register as customer" })] }), registering ? _jsxs("div", { className: "ak-card__body", children: [_jsx("p", { className: "ak-subtle ak-mb-4", children: "Review the contact details and add a phone number if it was not provided. The enquiry details will be saved in the customer notes." }), _jsx(CustomerForm, { initialValues: customerValues, initialRecordVisit: false, onCancel: () => setRegistering(false), onSuccess: (customer) => navigate(`/customers/${customer.id}`) })] }) : _jsx("div", { className: "ak-card__body", children: _jsx("p", { className: "ak-subtle", children: "This enquiry has not been registered as a customer yet." }) })] })] });
}
export default InquiryDetails;
