import { CameraIcon, DashboardIcon, MoneyIcon, ReceiptIcon, CalendarIcon, UsersIcon, InboxIcon, } from '../../assets';
export const navGroups = [
    {
        title: 'Overview',
        links: [
            {
                label: 'Dashboard',
                to: '/dashboard',
                icon: DashboardIcon,
                end: true,
            },
        ],
    },
    {
        title: 'Studio',
        links: [
            {
                label: 'Bookings',
                to: '/bookings',
                icon: CameraIcon,
                roles: ['OWNER', 'MANAGER', 'CASHIER'],
            },
            {
                label: 'Customers',
                to: '/customers',
                icon: UsersIcon,
            },
            { label: 'My tasks', to: '/reports/studio', icon: CalendarIcon, roles: ['OWNER', 'MANAGER', 'CASHIER', 'PHOTOGRAPHER'] },
            { label: 'Client services', to: '/client-services', icon: UsersIcon, roles: ['OWNER', 'MANAGER', 'CASHIER'] },
            { label: 'Enquiries', to: '/inquiries', icon: InboxIcon, roles: ['OWNER', 'MANAGER', 'CASHIER'] },
            { label: 'Assign editing task', to: '/tasks/new', icon: CameraIcon, roles: ['OWNER', 'MANAGER', 'CASHIER'] },
        ],
    },
    {
        title: 'Finance',
        links: [
            {
                label: 'Payments',
                to: '/payments',
                icon: MoneyIcon,
                roles: ['OWNER', 'MANAGER'],
            },
            {
                label: 'Expenses',
                to: '/expenses',
                icon: ReceiptIcon,
                roles: ['OWNER', 'MANAGER'],
            },
            {
                label: 'Reports',
                to: '/reports/finance',
                icon: ReceiptIcon,
                roles: ['OWNER'],
            },
        ],
    },
    {
        title: 'Administration',
        links: [
            {
                label: 'Staff',
                to: '/staff',
                icon: UsersIcon,
                roles: ['OWNER', 'MANAGER'],
            },
        ],
    },
];
/** True when the link may be shown to the given role. */
export function canSeeLink(link, role) {
    if (!link.roles || link.roles.length === 0)
        return true;
    if (!role)
        return false;
    return link.roles.includes(role);
}
/** Filters the groups down to the links the role can see. */
export function visibleNavGroups(role) {
    return navGroups
        .map((group) => ({
        ...group,
        links: group.links.filter((link) => canSeeLink(link, role)),
    }))
        .filter((group) => group.links.length > 0);
}
