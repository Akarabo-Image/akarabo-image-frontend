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
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [registering, setRegistering] = useState(false);
  const readStarted = useRef<string | undefined>(undefined);
  const inquiry = useQuery({
    queryKey: ['client-inquiry', id],
    queryFn: () => inquiryService.get(id),
    enabled: Boolean(id),
  });
  const record = inquiry.data;

  useEffect(() => {
    if (!record || record.isRead || readStarted.current === record.id) return;
    readStarted.current = record.id;
    void inquiryService.markRead(record.id).then(() => {
      queryClient.setQueryData(['client-inquiry', record.id], { ...record, isRead: true });
      return queryClient.invalidateQueries({ queryKey: ['client-inquiries'] });
    }).catch(() => undefined);
  }, [record, queryClient]);

  const customerValues = useMemo(() => {
    if (!record) return undefined;
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

  if (inquiry.isLoading) return <LoadingBlock message="Loading client enquiry…" />;
  if (inquiry.error || !record) {
    return <>
      <PageHeader title="Client enquiry" />
      <ErrorMessage error={inquiry.error} message={inquiry.error ? undefined : 'This enquiry does not exist.'} onRetry={() => void inquiry.refetch()} />
    </>;
  }

  return <>
    <PageHeader
      title={record.name}
      subtitle="Landing page enquiry"
      crumbs={[{ label: 'Enquiries', to: '/inquiries' }, { label: 'Client enquiry' }]}
      actions={<Link to="/inquiries" className="ak-button ak-button--secondary"><ArrowLeftIcon size={18} />Back to enquiries</Link>}
    />

    <section className="ak-card ak-mb-4">
      <header className="ak-card__header"><h2 className="ak-card__title">Contact and request</h2><span className="ak-subtle">Received {formatDate(record.createdAt)}</span></header>
      <div className="ak-card__body">
        <div className="ak-detail-grid">
          <div><p className="ak-detail__label">Email</p><p className="ak-detail__value"><a href={`mailto:${record.email}`}>{record.email}</a></p></div>
          <div><p className="ak-detail__label">Phone</p><p className="ak-detail__value">{record.phone ? <a href={`tel:${record.phone}`}>{record.phone}</a> : 'Not provided'}</p></div>
          <div><p className="ak-detail__label">Interested in</p><p className="ak-detail__value">{record.service}</p></div>
          <div><p className="ak-detail__label">Preferred date</p><p className="ak-detail__value">{record.preferredDate || 'Not specified'}</p></div>
        </div>
        <hr />
        <p className="ak-detail__label">Message</p>
        <p className="ak-detail__value" style={{ whiteSpace: 'pre-wrap' }}>{record.message || 'No message included.'}</p>
      </div>
    </section>

    <section className="ak-card">
      <header className="ak-card__header"><h2 className="ak-card__title">Client record</h2>{!registering && <Button onClick={() => setRegistering(true)}>Register as customer</Button>}</header>
      {registering ? <div className="ak-card__body">
        <p className="ak-subtle ak-mb-4">Review the contact details and add a phone number if it was not provided. The enquiry details will be saved in the customer notes.</p>
        <CustomerForm
          initialValues={customerValues}
          initialRecordVisit={false}
          onCancel={() => setRegistering(false)}
          onSuccess={(customer) => navigate(`/customers/${customer.id}`)}
        />
      </div> : <div className="ak-card__body"><p className="ak-subtle">This enquiry has not been registered as a customer yet.</p></div>}
    </section>
  </>;
}

export default InquiryDetails;
