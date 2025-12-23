// src/App.tsx
// ✅ OPTIMIZED - Removed redundant AuthProvider (already in main.tsx)

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './features/Auth/contexts/AuthProvider';
import { ToastProvider } from './features/UI/components/ui/toast/ToastProvider';
import { useThemeInit } from './features/Core/hooks/useTheme';

// ✅ Public pages
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/Register';

// ✅ Auth pages
import Login from './features/Auth/pages/Login';
import UnauthorizedPage from './features/Auth/pages/UnauthorizedPage';

// ✅ Layout
import AppLayout from './features/Core/components/AppLayout';

// ✅ All protected pages
import Dashboard from './features/Dashboard/pages/Dashboard';
import ShipmentList from './features/Shipments/pages/ShipmentListPage';
import ShipmentDetails from './features/Shipments/pages/ShipmentDetailsPage';
import TruckList from './features/Trucks/pages/TruckList';
import TruckDetails from './features/Trucks/pages/TruckDetails';
import CargoList from './features/Cargo/pages/CargoList';
import InvoiceList from './features/Invoices/pages/InvoiceList';
import InvoiceGenerator from './features/Invoices/pages/InvoiceGenerator';
import InvoiceDetails from './features/Invoices/pages/InvoiceDetails';
import TaskList from './features/Tasks/pages/TaskListPage';
import TaskDetails from './features/Tasks/pages/TaskDetailPage';
import TrackingDashboard from './features/Tracking/pages/LiveTracking';
import Analytics from './features/Analytics/pages/Dashboard';
import Settings from './features/Settings/pages/Settings';
import UserManagement from './features/Admin/pages/UserManagement';

/**
 * ProtectedRoute Component
 * Checks authentication before allowing access to protected routes
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, hasRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

/**
 * Main App Component
 */
function App() {
  useThemeInit();

  return (
    <ToastProvider>
      <Router>
        <Routes>

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* ✅ PUBLIC ROUTES - No authentication required, always accessible */}
          {/* ════════════════════════════════════════════════════════════════ */}
          
          {/* Landing page - Main entry point */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Registration page */}
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Login page */}
          <Route path="/login" element={<Login />} />
          
          {/* Unauthorized page */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* ✅ PROTECTED ROUTES - All wrapped with ProtectedRoute + AppLayout */}
          {/* ════════════════════════════════════════════════════════════════ */}
          
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Shipments */}
            <Route path="/shipments" element={<ShipmentList />} />
            <Route path="/shipments/:id" element={<ShipmentDetails />} />

            {/* Trucks */}
            <Route path="/trucks" element={<TruckList />} />
            <Route path="/trucks/:id" element={<TruckDetails />} />

            {/* Cargo */}
            <Route path="/cargo" element={<CargoList />} />

            {/* Invoices */}
            <Route path="/invoices" element={<InvoiceList />} />
            <Route path="/invoices/new" element={<InvoiceGenerator />} />
            <Route path="/invoices/:id" element={<InvoiceDetails />} />

            {/* Tasks */}
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/tasks/:id" element={<TaskDetails />} />

            {/* Tracking */}
            <Route path="/tracking" element={<TrackingDashboard />} />

            {/* Analytics */}
            <Route path="/analytics" element={<Analytics />} />

            {/* Settings */}
            <Route path="/settings" element={<Settings />} />

            {/* Admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <UserManagement />
                </ProtectedRoute>
              }
            />

          </Route>

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* ✅ FALLBACK - 404 Not Found */}
          {/* ════════════════════════════════════════════════════════════════ */}
          
          <Route path="/404" element={<div className="p-8">Page not found</div>} />
          <Route path="*" element={<Navigate to="/404" replace />} />

        </Routes>
      </Router>
    </ToastProvider>
  );
}

/**
 * 🎯 Route Structure:
 * 
 * PUBLIC ROUTES (Always accessible):
 * /                    ← Landing page (new users start here)
 * /register            ← Registration form
 * /login               ← Login form
 * /unauthorized        ← Unauthorized access
 * 
 * PROTECTED ROUTES (Require authentication):
 * /dashboard           ← Main dashboard
 * /shipments           ← Shipment management
 * /trucks              ← Vehicle management
 * /cargo               ← Cargo tracking
 * /invoices            ← Invoice management
 * /tasks               ← Task management
 * /tracking            ← Live tracking
 * /analytics           ← Analytics dashboard
 * /settings            ← User settings
 * /admin               ← Admin panel (requires ADMIN role)
 * 
 * 
 * ✨ KEY OPTIMIZATIONS:
 * ✅ AuthProvider removed (moved to main.tsx for cleaner structure)
 * ✅ Only ToastProvider in App.tsx (keeps concerns separate)
 * ✅ No redirect on landing page (/)
 * ✅ Landing page accessible whether authenticated or not
 * ✅ Clean public/protected route separation
 * ✅ Standard nested routing pattern
 * ✅ ProtectedRoute with role-based access control
 * ✅ AppLayout wraps all protected routes
 */

export default App;