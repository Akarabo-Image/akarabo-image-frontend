import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { InboxIcon, MenuIcon } from '../assets';
import { useAuth } from '../context/AuthContext';
import { inquiryService } from '../services/inquiryService';
import { photographerTaskService } from '../services/photographerTaskService';
/** Top bar with an in-app inbox for enquiries and photographer assignments. */
export function NavBar({ onToggleMenu }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [inboxOpen, setInboxOpen] = useState(false);
    const [seenCompletions, setSeenCompletions] = useState([]);
    const inboxRef = useRef(null);
    const queryClient = useQueryClient();
    const canSeeInquiries = ['OWNER', 'MANAGER', 'CASHIER'].includes(user?.role ?? '');
    const canSeeTasks = user?.role === 'PHOTOGRAPHER';
    const canSeeCompletedTasks = ['OWNER', 'MANAGER', 'CASHIER'].includes(user?.role ?? '');
    const inquiries = useQuery({ queryKey: ['client-inquiries'], queryFn: inquiryService.list, enabled: canSeeInquiries, refetchInterval: 15000 });
    const tasks = useQuery({ queryKey: ['photographer-tasks', 'mine'], queryFn: photographerTaskService.mine, enabled: canSeeTasks, refetchInterval: 15000 });
    const completedTasks = useQuery({ queryKey: ['photographer-tasks', 'completed'], queryFn: photographerTaskService.completed, enabled: canSeeCompletedTasks, refetchInterval: 15000 });
    const unreadInquiries = inquiries.data?.filter((inquiry) => !inquiry.isRead).length ?? 0;
    const unreadTasks = tasks.data?.filter((task) => !task.readAt).length ?? 0;
    const unseenCompletions = completedTasks.data?.filter((task) => !seenCompletions.includes(task.id)) ?? [];
    const inquiryNotifications = [...(inquiries.data ?? [])].sort((a, b) => Number(a.isRead) - Number(b.isRead) ||
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
            setSeenCompletions(JSON.parse(localStorage.getItem(`seen-task-completions:${user.id}`) ?? '[]'));
        }
        catch {
            setSeenCompletions([]);
        }
    }, [user?.id]);
    useEffect(() => {
        if (!inboxOpen || !canSeeCompletedTasks || !completedTasks.data?.length)
            return;
        const newIds = completedTasks.data.map((task) => task.id).filter((id) => !seenCompletions.includes(id));
        if (!newIds.length)
            return;
        const next = [...seenCompletions, ...newIds];
        setSeenCompletions(next);
        if (user?.id)
            localStorage.setItem(`seen-task-completions:${user.id}`, JSON.stringify(next));
    }, [inboxOpen, canSeeCompletedTasks, completedTasks.data, seenCompletions, user?.id]);
    useEffect(() => {
        if (!inboxOpen)
            return;
        const onPointerDown = (event) => { if (!inboxRef.current?.contains(event.target))
            setInboxOpen(false); };
        const onKeyDown = (event) => { if (event.key === 'Escape')
            setInboxOpen(false); };
        document.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => { document.removeEventListener('pointerdown', onPointerDown); document.removeEventListener('keydown', onKeyDown); };
    }, [inboxOpen]);
    const openInquiry = async (inquiry) => {
        if (!inquiry.isRead) {
            try {
                await inquiryService.markRead(inquiry.id);
                await queryClient.invalidateQueries({ queryKey: ['client-inquiries'] });
            }
            catch {
                // The detail page remains available if marking it read fails.
            }
        }
        setInboxOpen(false);
        navigate(`/inquiries/${inquiry.id}`);
    };
    const openTask = async (id, readAt) => {
        if (!readAt) {
            await photographerTaskService.markRead(id);
            await queryClient.invalidateQueries({ queryKey: ['photographer-tasks', 'mine'] });
        }
        setInboxOpen(false);
        navigate('/reports/studio');
    };
    return (_jsxs("header", { className: "ak-topbar", children: [_jsxs("div", { className: "ak-row ak-gap-3", children: [_jsx("button", { type: "button", className: "ak-button ak-button--ghost ak-button--sm ak-sidebar-toggle", onClick: onToggleMenu, "aria-label": "Toggle navigation", children: _jsx(MenuIcon, { size: 20 }) }), _jsx(Link, { to: "/", className: "ak-topbar__title", children: "Akarabo Image" })] }), _jsx("div", { className: "ak-topbar__actions", children: (canSeeInquiries || canSeeTasks) && _jsxs("div", { className: "ak-inbox", ref: inboxRef, children: [_jsxs("button", { type: "button", className: "ak-button ak-button--ghost ak-button--sm ak-inbox__toggle", "aria-label": `${canSeeTasks ? 'Editing task notifications' : 'Notifications'}${unreadCount ? `, ${unreadCount} unread` : ''}`, "aria-expanded": inboxOpen, onClick: () => setInboxOpen((open) => !open), children: [_jsx(InboxIcon, { size: 20 }), unreadCount > 0 && _jsx("span", { className: "ak-inbox__count", children: unreadCount })] }), inboxOpen && _jsx("section", { className: "ak-inbox__panel", "aria-label": canSeeTasks ? 'Assigned editing tasks' : 'Notifications', children: canSeeTasks ? _jsxs(_Fragment, { children: [_jsxs("header", { className: "ak-inbox__header", children: [_jsx("strong", { children: "Editing assignments" }), _jsxs("span", { children: [unreadTasks, " new"] })] }), tasks.isLoading ? _jsx("p", { className: "ak-inbox__empty", children: "Loading assignments\u2026" }) : tasks.error ? _jsx("p", { className: "ak-inbox__empty", children: "Assignments could not be loaded." }) : tasks.data?.length ? _jsx("ul", { className: "ak-inbox__list", children: [...tasks.data].sort((a, b) => Number(Boolean(a.readAt)) - Number(Boolean(b.readAt))).slice(0, 8).map((task) => _jsx("li", { children: _jsxs("button", { type: "button", className: task.readAt ? 'ak-inbox__item is-read' : 'ak-inbox__item is-unread', onClick: () => void openTask(task.id, task.readAt), children: [_jsxs("span", { className: "ak-inbox__item-top", children: [_jsx("strong", { children: task.customerName }), _jsxs("span", { className: "ak-inbox__item-meta", children: [_jsx("span", { className: "ak-inbox__state", children: task.readAt ? 'Seen' : 'New' }), _jsx("time", { children: task.taskDate })] })] }), _jsxs("span", { className: "ak-inbox__service", children: [task.photosToEdit, " photos to edit \u00B7 ", task.status.replace('_', ' ')] }), _jsx("span", { className: "ak-inbox__message", children: task.notes || 'Open your daily task list to begin editing.' })] }) }, task.id)) }) : _jsx("p", { className: "ak-inbox__empty", children: "No editing tasks assigned yet." }), _jsx("button", { type: "button", className: "ak-inbox__empty ak-inbox__link", onClick: () => { setInboxOpen(false); navigate('/reports/studio'); }, children: "Open all tasks" })] }) : _jsxs(_Fragment, { children: [canSeeCompletedTasks && _jsxs("div", { children: [_jsxs("header", { className: "ak-inbox__header", children: [_jsx("strong", { children: "Completed editing tasks" }), _jsxs("span", { children: [unseenCompletions.length, " new"] })] }), completedTasks.isLoading ? _jsx("p", { className: "ak-inbox__empty", children: "Loading task updates\u2026" }) : completedTasks.error ? _jsx("p", { className: "ak-inbox__empty", children: "Task updates could not be loaded." }) : completedTasks.data?.length ? _jsx("ul", { className: "ak-inbox__list", children: [...completedTasks.data].sort((a, b) => Number(seenCompletions.includes(a.id)) - Number(seenCompletions.includes(b.id))).slice(0, 8).map((task) => { const isRead = seenCompletions.includes(task.id); return _jsx("li", { children: _jsxs("button", { type: "button", className: isRead ? 'ak-inbox__item is-read' : 'ak-inbox__item is-unread', onClick: () => { setInboxOpen(false); navigate('/client-services'); }, children: [_jsxs("span", { className: "ak-inbox__item-top", children: [_jsx("strong", { children: task.photographerName }), _jsxs("span", { className: "ak-inbox__item-meta", children: [_jsx("span", { className: "ak-inbox__state", children: isRead ? 'Seen' : 'New' }), _jsx("time", { children: task.completedAt ? new Date(task.completedAt).toLocaleString() : task.taskDate })] })] }), _jsxs("span", { className: "ak-inbox__service", children: [task.customerName, " \u00B7 ", task.editedPhotos ?? 0, " photos edited"] }), _jsx("span", { className: "ak-inbox__message", children: "Editing task completed" })] }) }, task.id); }) }) : _jsx("p", { className: "ak-inbox__empty", children: "No completed editing tasks yet." })] }), _jsxs("header", { className: "ak-inbox__header", children: [_jsx("strong", { children: "Client enquiries" }), _jsxs("span", { children: [unreadInquiries, " new"] })] }), inquiries.isLoading ? _jsx("p", { className: "ak-inbox__empty", children: "Loading enquiries\u2026" }) : inquiries.error ? _jsx("p", { className: "ak-inbox__empty", children: "Enquiries could not be loaded." }) : inquiryNotifications.length ? _jsx("ul", { className: "ak-inbox__list", children: inquiryNotifications.slice(0, 8).map((inquiry) => _jsx("li", { children: _jsxs("button", { type: "button", className: inquiry.isRead ? 'ak-inbox__item is-read' : 'ak-inbox__item is-unread', onClick: () => void openInquiry(inquiry), children: [_jsxs("span", { className: "ak-inbox__item-top", children: [_jsx("strong", { children: inquiry.name }), _jsxs("span", { className: "ak-inbox__item-meta", children: [_jsx("span", { className: "ak-inbox__state", children: inquiry.isRead ? 'Seen' : 'New' }), _jsx("time", { children: new Date(inquiry.createdAt).toLocaleString() })] })] }), _jsxs("span", { className: "ak-inbox__service", children: [inquiry.service, inquiry.preferredDate ? ` · ${inquiry.preferredDate}` : ''] }), _jsx("span", { className: "ak-inbox__message", children: inquiry.message || inquiry.email })] }) }, inquiry.id)) }) : _jsx("p", { className: "ak-inbox__empty", children: "No client enquiries yet." })] }) })] }) })] }));
}
export default NavBar;
