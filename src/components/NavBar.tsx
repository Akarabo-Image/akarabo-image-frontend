import { useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { InboxIcon, MenuIcon } from '../assets';
import { useAuth } from '../context/AuthContext';
import { inquiryService } from '../services/inquiryService';
import { photographerTaskService } from '../services/photographerTaskService';
import type { ClientInquiry } from '../types/inquiry';

export interface NavBarProps { onToggleMenu?: () => void; }

/** Top bar with an in-app inbox for enquiries and photographer assignments. */
export function NavBar({ onToggleMenu }: NavBarProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [inboxOpen, setInboxOpen] = useState(false);
  const [seenCompletions, setSeenCompletions] = useState<string[]>([]);
  const inboxRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const canSeeInquiries = ['OWNER', 'MANAGER', 'CASHIER'].includes(user?.role ?? '');
  const canSeeTasks = user?.role === 'PHOTOGRAPHER';
  const canSeeCompletedTasks = ['OWNER', 'MANAGER', 'CASHIER'].includes(user?.role ?? '');
  const inquiries = useQuery({ queryKey: ['client-inquiries'], queryFn: inquiryService.list, enabled: canSeeInquiries, refetchInterval: 15_000 });
  const tasks = useQuery({ queryKey: ['photographer-tasks', 'mine'], queryFn: photographerTaskService.mine, enabled: canSeeTasks, refetchInterval: 15_000 });
  const completedTasks = useQuery({ queryKey: ['photographer-tasks', 'completed'], queryFn: photographerTaskService.completed, enabled: canSeeCompletedTasks, refetchInterval: 15_000 });
  const unreadInquiries = inquiries.data?.filter((inquiry) => !inquiry.isRead).length ?? 0;
  const unreadTasks = tasks.data?.filter((task) => !task.readAt).length ?? 0;
  const unseenCompletions = completedTasks.data?.filter((task) => !seenCompletions.includes(task.id)) ?? [];
  const inquiryNotifications = [...(inquiries.data ?? [])].sort((a, b) =>
    Number(a.isRead) - Number(b.isRead) ||
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const unreadCount = canSeeTasks
    ? unreadTasks
    : unreadInquiries + (canSeeCompletedTasks ? unseenCompletions.length : 0);

  // Auth loads asynchronously. Read the per-user seen list after identity is
  // known so a refresh does not treat previously viewed task updates as new.
  useEffect(() => {
    if (!user?.id) {
      setSeenCompletions([]);
      return;
    }
    try {
      setSeenCompletions(JSON.parse(localStorage.getItem(`seen-task-completions:${user.id}`) ?? '[]') as string[]);
    } catch {
      setSeenCompletions([]);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!inboxOpen || !canSeeCompletedTasks || !completedTasks.data?.length) return;
    const newIds = completedTasks.data.map((task) => task.id).filter((id) => !seenCompletions.includes(id));
    if (!newIds.length) return;
    const next = [...seenCompletions, ...newIds];
    setSeenCompletions(next);
    if (user?.id) localStorage.setItem(`seen-task-completions:${user.id}`, JSON.stringify(next));
  }, [inboxOpen, canSeeCompletedTasks, completedTasks.data, seenCompletions, user?.id]);

  useEffect(() => {
    if (!inboxOpen) return;
    const onPointerDown = (event: PointerEvent) => { if (!inboxRef.current?.contains(event.target as Node)) setInboxOpen(false); };
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setInboxOpen(false); };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => { document.removeEventListener('pointerdown', onPointerDown); document.removeEventListener('keydown', onKeyDown); };
  }, [inboxOpen]);

  const openInquiry = async (inquiry: ClientInquiry) => {
    if (!inquiry.isRead) {
      try {
        await inquiryService.markRead(inquiry.id);
        await queryClient.invalidateQueries({ queryKey: ['client-inquiries'] });
      } catch {
        // The detail page remains available if marking it read fails.
      }
    }
    setInboxOpen(false);
    navigate(`/inquiries/${inquiry.id}`);
  };

  const openTask = async (id: string, readAt?: string) => {
    if (!readAt) {
      await photographerTaskService.markRead(id);
      await queryClient.invalidateQueries({ queryKey: ['photographer-tasks', 'mine'] });
    }
    setInboxOpen(false);
    navigate('/reports/studio');
  };

  return (
    <header className="ak-topbar">
      <div className="ak-row ak-gap-3">
        <button type="button" className="ak-button ak-button--ghost ak-button--sm ak-sidebar-toggle" onClick={onToggleMenu} aria-label="Toggle navigation"><MenuIcon size={20} /></button>
        <Link to="/" className="ak-topbar__title">Akarabo Image</Link>
      </div>
      <div className="ak-topbar__actions">
        {(canSeeInquiries || canSeeTasks) && <div className="ak-inbox" ref={inboxRef}>
          <button type="button" className="ak-button ak-button--ghost ak-button--sm ak-inbox__toggle" aria-label={`${canSeeTasks ? 'Editing task notifications' : 'Notifications'}${unreadCount ? `, ${unreadCount} unread` : ''}`} aria-expanded={inboxOpen} onClick={() => setInboxOpen((open) => !open)}>
            <InboxIcon size={20} />{unreadCount > 0 && <span className="ak-inbox__count">{unreadCount}</span>}
          </button>
          {inboxOpen && <section className="ak-inbox__panel" aria-label={canSeeTasks ? 'Assigned editing tasks' : 'Notifications'}>
            {canSeeTasks ? <>
              <header className="ak-inbox__header"><strong>Editing assignments</strong><span>{unreadTasks} new</span></header>
              {tasks.isLoading ? <p className="ak-inbox__empty">Loading assignments…</p> : tasks.error ? <p className="ak-inbox__empty">Assignments could not be loaded.</p> : tasks.data?.length ? <ul className="ak-inbox__list">{[...tasks.data].sort((a, b) => Number(Boolean(a.readAt)) - Number(Boolean(b.readAt))).slice(0, 8).map((task) => <li key={task.id}><button type="button" className={task.readAt ? 'ak-inbox__item is-read' : 'ak-inbox__item is-unread'} onClick={() => void openTask(task.id, task.readAt)}><span className="ak-inbox__item-top"><strong>{task.customerName}</strong><span className="ak-inbox__item-meta"><span className="ak-inbox__state">{task.readAt ? 'Seen' : 'New'}</span><time>{task.taskDate}</time></span></span><span className="ak-inbox__service">{task.photosToEdit} photos to edit · {task.status.replace('_', ' ')}</span><span className="ak-inbox__message">{task.notes || 'Open your daily task list to begin editing.'}</span></button></li>)}</ul> : <p className="ak-inbox__empty">No editing tasks assigned yet.</p>}
              <button type="button" className="ak-inbox__empty ak-inbox__link" onClick={() => { setInboxOpen(false); navigate('/reports/studio'); }}>Open all tasks</button>
            </> : <>
              {canSeeCompletedTasks && <div>
                <header className="ak-inbox__header"><strong>Completed editing tasks</strong><span>{unseenCompletions.length} new</span></header>
                {completedTasks.isLoading ? <p className="ak-inbox__empty">Loading task updates…</p> : completedTasks.error ? <p className="ak-inbox__empty">Task updates could not be loaded.</p> : completedTasks.data?.length ? <ul className="ak-inbox__list">{[...completedTasks.data].sort((a, b) => Number(seenCompletions.includes(a.id)) - Number(seenCompletions.includes(b.id))).slice(0, 8).map((task) => { const isRead = seenCompletions.includes(task.id); return <li key={task.id}><button type="button" className={isRead ? 'ak-inbox__item is-read' : 'ak-inbox__item is-unread'} onClick={() => { setInboxOpen(false); navigate('/client-services'); }}><span className="ak-inbox__item-top"><strong>{task.photographerName}</strong><span className="ak-inbox__item-meta"><span className="ak-inbox__state">{isRead ? 'Seen' : 'New'}</span><time>{task.completedAt ? new Date(task.completedAt).toLocaleString() : task.taskDate}</time></span></span><span className="ak-inbox__service">{task.customerName} · {task.editedPhotos ?? 0} photos edited</span><span className="ak-inbox__message">Editing task completed</span></button></li>; })}</ul> : <p className="ak-inbox__empty">No completed editing tasks yet.</p>}
              </div>}
              <header className="ak-inbox__header"><strong>Client enquiries</strong><span>{unreadInquiries} new</span></header>
              {inquiries.isLoading ? <p className="ak-inbox__empty">Loading enquiries…</p> : inquiries.error ? <p className="ak-inbox__empty">Enquiries could not be loaded.</p> : inquiryNotifications.length ? <ul className="ak-inbox__list">{inquiryNotifications.slice(0, 8).map((inquiry) => <li key={inquiry.id}><button type="button" className={inquiry.isRead ? 'ak-inbox__item is-read' : 'ak-inbox__item is-unread'} onClick={() => void openInquiry(inquiry)}><span className="ak-inbox__item-top"><strong>{inquiry.name}</strong><span className="ak-inbox__item-meta"><span className="ak-inbox__state">{inquiry.isRead ? 'Seen' : 'New'}</span><time>{new Date(inquiry.createdAt).toLocaleString()}</time></span></span><span className="ak-inbox__service">{inquiry.service}{inquiry.preferredDate ? ` · ${inquiry.preferredDate}` : ''}</span><span className="ak-inbox__message">{inquiry.message || inquiry.email}</span></button></li>)}</ul> : <p className="ak-inbox__empty">No client enquiries yet.</p>}
            </>}
          </section>}
        </div>}
      </div>
    </header>
  );
}

export default NavBar;

