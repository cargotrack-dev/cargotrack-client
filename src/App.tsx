// src/App.tsx
// ✅ FINAL FIXED - MaintenanceProvider wraps elements, NOT routes

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './features/Auth/contexts/AuthProvider';
import { ToastProvider } from './features/UI/components/ui/toast/ToastProvider';
import { useThemeInit } from './features/Core/hooks/useTheme.ts';
import { MaintenanceProvider } from './features/Maintenance/contexts/provider'; // ✅ Added

// ✅ Public pages
import LandingPage from './pages/LandingPage.tsx';
import RegisterPage from './pages/Register.tsx';

// ✅ Auth pages
import Login from './features/Auth/pages/Login.tsx';
import UnauthorizedPage from './features/Auth/pages/UnauthorizedPage.tsx';

// ✅ Layout
import AppLayout from './features/Core/components/AppLayout.tsx';

// ✅ All protected pages
import Dashboard from './features/Dashboard/pages/Dashboard.tsx';
import ShipmentList from './features/Shipments/pages/ShipmentListPage.tsx';
import ShipmentDetails from './features/Shipments/pages/ShipmentDetailsPage.tsx';
import TruckList from './features/Trucks/pages/TruckList.tsx';
import TruckNew from './features/Trucks/pages/TruckNew.tsx';
import TruckEdit from './features/Trucks/pages/TruckEdit.tsx';
import TruckDetails from './features/Trucks/pages/TruckDetails.tsx';
import CargoList from './features/Cargo/pages/CargoList.tsx';
import InvoiceList from './features/Invoices/pages/InvoiceList.tsx';
import InvoiceGenerator from './features/Invoices/pages/InvoiceGenerator.tsx';
import InvoiceDetails from './features/Invoices/pages/InvoiceDetails.tsx';
import TaskList from './features/Tasks/pages/TaskListPage.tsx';
import TaskDetails from './features/Tasks/pages/TaskDetailPage.tsx';
import TrackingDashboard from './features/Tracking/pages/LiveTracking.tsx';
import DriversList from './features/Drivers/pages/DriversList.tsx';
import DriverDetails from './features/Drivers/pages/DriverDetails.tsx';
import Analytics from './features/Analytics/pages/Dashboard.tsx';
import Settings from './features/Settings/pages/Settings.tsx';
import UserManagement from './features/Admin/pages/UserManagement.tsx';

// ✅ Maintenance routes
import MaintenanceList from './features/Maintenance/pages/MaintenanceList.tsx';
import MaintenanceScheduleForm from './features/Maintenance/components/MaintenanceScheduleForm.tsx'; // ✅ components folder
import MaintenanceScheduler from './features/Maintenance/pages/MaintenanceScheduler.tsx';

// ✅ Clients routes
import ClientDashboard from './features/Clients/pages/ClientDashboard.tsx';
import ClientDetails from './features/Clients/pages/ClientDetails.tsx';
import ClientNew from './features/Clients/pages/ClientNew.tsx';
import ClientEdit from './features/Clients/pages/ClientEdit.tsx';

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
          {/* ✅ PUBLIC ROUTES - No authentication required */}
          {/* ════════════════════════════════════════════════════════════════ */}

          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* ✅ PROTECTED ROUTES - Wrapped with ProtectedRoute + AppLayout */}
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

            {/* ════════════════════════════════════════════════════════════════ */}
            {/* TRUCKS - Full CRUD with maintenance integration */}
            {/* ════════════════════════════════════════════════════════════════ */}
            <Route path="/trucks" element={<TruckList />} />
            <Route path="/trucks/new" element={<TruckNew />} />
            <Route path="/trucks/edit/:id" element={<TruckEdit />} />
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

            {/* Drivers */}
            <Route path="/drivers" element={<DriversList />} />
            <Route path="/drivers/:id" element={<DriverDetails />} />

            {/* Analytics */}
            <Route path="/analytics" element={<Analytics />} />

            {/* ════════════════════════════════════════════════════════════════ */}
            {/* CLIENTS - Full CRUD */}
            {/* ════════════════════════════════════════════════════════════════ */}
            <Route path="/clients" element={<ClientDashboard />} />
            <Route path="/clients/new" element={<ClientNew />} />
            <Route path="/clients/edit/:id" element={<ClientEdit />} />
            <Route path="/clients/:id" element={<ClientDetails />} />

            {/* ════════════════════════════════════════════════════════════════ */}
            {/* MAINTENANCE - Each route wrapped with MaintenanceProvider */}
            {/* ✅ FIXED: No nested Routes, just wrapped elements */}
            {/* ════════════════════════════════════════════════════════════════ */}
            <Route
              path="/maintenance"
              element={
                <MaintenanceProvider>
                  <MaintenanceList />
                </MaintenanceProvider>
              }
            />
            <Route
              path="/maintenance/new"
              element={
                <MaintenanceProvider>
                  <MaintenanceScheduleForm />
                </MaintenanceProvider>
              }
            />
            <Route
              path="/maintenance/dashboard"
              element={
                <MaintenanceProvider>
                  <MaintenanceScheduler />
                </MaintenanceProvider>
              }
            />

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
 * ✨ ROUTE STRUCTURE - FINAL & WORKING:
 * 
 * PUBLIC: / /register /login /unauthorized
 * 
 * PROTECTED (inside ProtectedRoute + AppLayout):
 * /dashboard
 * /shipments /shipments/:id
 * /trucks /trucks/new /trucks/edit/:id /trucks/:id
 * /cargo
 * /invoices /invoices/new /invoices/:id
 * /tasks /tasks/:id
 * /tracking
 * /drivers /drivers/:id
 * /analytics
 * /clients /clients/new /clients/edit/:id /clients/:id
 * /maintenance (with provider) → MaintenanceList
 * /maintenance/new (with provider) → MaintenanceScheduleForm
 * /maintenance/dashboard (with provider) → MaintenanceScheduler
 * /settings
 * /admin
 * 
 * ✅ KEY FIXES:
 * ✅ Import path: components folder (not pages)
 * ✅ MaintenanceProvider wraps elements (not routes)
 * ✅ No nested Routes breaking routing
 * ✅ Simple, clean structure
 * ✅ Routes properly matched by React Router
 */

export default App;