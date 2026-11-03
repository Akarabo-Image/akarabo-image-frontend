import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppLayout } from './layouts/AppLayout';
import { BookingDetails } from './pages/BookingDetails';
import { Bookings } from './pages/Bookings';
import { CustomerDetails } from './pages/CustomerDetails';
import { ClientServices } from './pages/ClientServices';
import { Customers } from './pages/Customers';
import { Dashboard } from './pages/Dashboard';
import { Expenses } from './pages/Expenses';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { NewBooking } from './pages/NewBooking';
import { NewCustomer } from './pages/NewCustomer';
import { NewExpense } from './pages/NewExpense';
import { NewPayment } from './pages/NewPayment';
import { NewStaff } from './pages/NewStaff';
import { InquiryDetails } from './pages/InquiryDetails';
import { Inquiries } from './pages/Inquiries';
import { NotFound } from './pages/NotFound';
import { Payments } from './pages/Payments';
import { Profile } from './pages/Profile';
import { PhotographerTaskAssignment } from './pages/PhotographerTaskAssignment';
import { Staff } from './pages/Staff';
import { StudioReports } from './pages/StudioReports';
import { FinanceReport } from './pages/FinanceReport';
import { useAuth } from './context/AuthContext';
/** Roles that may look at the money. */
const FINANCE_ROLES = ['OWNER', 'MANAGER'];
/** Roles that may administer staff accounts. */
const ADMIN_ROLES = ['OWNER', 'MANAGER'];
/** Route wrapper that enforces the role rules of the backend. */
function Guarded({ roles = [], children }) {
    return _jsx(ProtectedRoute, { roles: roles, children: children });
}
function DashboardHome() {
    const { user } = useAuth();
    return user?.role === 'PHOTOGRAPHER' ? _jsx(Customers, {}) : _jsx(Dashboard, {});
}
/** Root of the routing tree. */
export function App() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Landing, {}) }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsxs(Route, { element: _jsx(ProtectedRoute, { children: _jsx(AppLayout, {}) }), children: [_jsx(Route, { path: "/dashboard", element: _jsx(DashboardHome, {}) }), _jsx(Route, { path: "/reports/studio", element: _jsx(StudioReports, {}) }), _jsx(Route, { path: "/reports/finance", element: _jsx(Guarded, { roles: ['OWNER'], children: _jsx(FinanceReport, {}) }) }), _jsx(Route, { path: "/inquiries", element: _jsx(Guarded, { roles: ['OWNER', 'MANAGER', 'CASHIER'], children: _jsx(Inquiries, {}) }) }), _jsx(Route, { path: "/inquiries/:id", element: _jsx(Guarded, { roles: ['OWNER', 'MANAGER', 'CASHIER'], children: _jsx(InquiryDetails, {}) }) }), _jsx(Route, { path: "/client-services", element: _jsx(Guarded, { roles: ['OWNER', 'MANAGER', 'CASHIER'], children: _jsx(ClientServices, {}) }) }), _jsx(Route, { path: "/tasks/new", element: _jsx(Guarded, { roles: ['OWNER', 'MANAGER', 'CASHIER'], children: _jsx(PhotographerTaskAssignment, {}) }) }), _jsx(Route, { path: "/bookings", element: _jsx(Guarded, { roles: ['OWNER', 'MANAGER', 'CASHIER'], children: _jsx(Bookings, {}) }) }), _jsx(Route, { path: "/bookings/new", element: _jsx(Guarded, { roles: ['OWNER', 'MANAGER'], children: _jsx(NewBooking, {}) }) }), _jsx(Route, { path: "/bookings/:id", element: _jsx(Guarded, { roles: ['OWNER', 'MANAGER', 'CASHIER'], children: _jsx(BookingDetails, {}) }) }), _jsx(Route, { path: "/customers", element: _jsx(Customers, {}) }), _jsx(Route, { path: "/customers/new", element: _jsx(NewCustomer, {}) }), _jsx(Route, { path: "/customers/:id", element: _jsx(Guarded, { roles: ['OWNER', 'MANAGER', 'CASHIER'], children: _jsx(CustomerDetails, {}) }) }), _jsx(Route, { path: "/payments", element: _jsx(Guarded, { roles: FINANCE_ROLES, children: _jsx(Payments, {}) }) }), _jsx(Route, { path: "/payments/new", element: _jsx(Guarded, { roles: FINANCE_ROLES, children: _jsx(NewPayment, {}) }) }), _jsx(Route, { path: "/expenses", element: _jsx(Guarded, { roles: FINANCE_ROLES, children: _jsx(Expenses, {}) }) }), _jsx(Route, { path: "/expenses/new", element: _jsx(Guarded, { roles: FINANCE_ROLES, children: _jsx(NewExpense, {}) }) }), _jsx(Route, { path: "/staff", element: _jsx(Guarded, { roles: ADMIN_ROLES, children: _jsx(Staff, {}) }) }), _jsx(Route, { path: "/staff/new", element: _jsx(Guarded, { roles: ADMIN_ROLES, children: _jsx(NewStaff, {}) }) }), _jsx(Route, { path: "/staff/:id/edit", element: _jsx(Guarded, { roles: ADMIN_ROLES, children: _jsx(NewStaff, {}) }) }), _jsx(Route, { path: "/profile", element: _jsx(Profile, {}) }), _jsx(Route, { path: "*", element: _jsx(NotFound, {}) })] })] }));
}
export default App;
