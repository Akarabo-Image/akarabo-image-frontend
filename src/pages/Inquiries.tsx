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
import type { ClientInquiry } from '../types/inquiry';

/** Full directory of every enquiry submitted through the landing page. */
export function Inquiries() {
  const inquiries = useQuery({
    queryKey: ['client-inquiries'],
    queryFn: inquiryService.list,
    refetchInterval: 15_000,
  });
  const rows = inquiries.data ?? [];

  const columns = [
    {
      key: 'client',
      header: 'Client',
      render: (inquiry: ClientInquiry) => <div><strong>{inquiry.name}</strong><div className="ak-subtle">{inquiry.email}{inquiry.phone ? ` · ${inquiry.phone}` : ''}</div></div>,
    },
    {
      key: 'request',
      header: 'Request',
      render: (inquiry: ClientInquiry) => <div><strong>{inquiry.service}</strong><div className="ak-subtle">{inquiry.preferredDate || 'No preferred date'}</div></div>,
    },
    {
      key: 'received',
      header: 'Received',
      render: (inquiry: ClientInquiry) => formatDateTime(inquiry.createdAt),
    },
    {
      key: 'status',
      header: 'Status',
      render: (inquiry: ClientInquiry) => <Badge tone={inquiry.isRead ? 'neutral' : 'warning'}>{inquiry.isRead ? 'Viewed' : 'New'}</Badge>,
    },
    {
      key: 'action',
      header: 'Details',
      render: (inquiry: ClientInquiry) => <Link className="ak-button ak-button--secondary ak-button--sm" to={`/inquiries/${inquiry.id}`}>View enquiry</Link>,
    },
  ];

  return <>
    <PageHeader title="Enquiries" subtitle="All requests submitted through the studio landing page." />
    {inquiries.isLoading ? <LoadingBlock message="Loading enquiries…" /> : inquiries.error ? <ErrorMessage error={inquiries.error} onRetry={() => void inquiries.refetch()} /> : <section className="ak-card">
      <header className="ak-card__header"><h2 className="ak-card__title">Client enquiries</h2><span className="ak-subtle">{rows.length} total</span></header>
      <div className="ak-card__body">
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(inquiry) => inquiry.id}
          empty={<EmptyState title="No enquiries yet" description="Landing page requests will appear here." />}
        />
      </div>
    </section>}
  </>;
}

export default Inquiries;
