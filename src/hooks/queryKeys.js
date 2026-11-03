export const queryKeys = {
    auth: {
        me: ['auth', 'me'],
    },
    bookings: {
        all: ['bookings'],
        list: (query = {}) => ['bookings', 'list', query],
        detail: (id) => ['bookings', 'detail', id],
    },
    customers: {
        all: ['customers'],
        list: (query = {}) => ['customers', 'list', query],
        detail: (id) => ['customers', 'detail', id],
    },
    payments: {
        all: ['payments'],
        list: (query = {}) => ['payments', 'list', query],
        detail: (id) => ['payments', 'detail', id],
    },
    expenses: {
        all: ['expenses'],
        list: (query = {}) => ['expenses', 'list', query],
        detail: (id) => ['expenses', 'detail', id],
    },
    users: {
        all: ['users'],
        list: (query = {}) => ['users', 'list', query],
        detail: (id) => ['users', 'detail', id],
    },
};
