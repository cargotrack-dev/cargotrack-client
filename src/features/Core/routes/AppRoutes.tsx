// 📁 src/features/Core/routes/AppRoutes.tsx
// ✅ RECONCILED - Combines existing routes with new landing & register pages

import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import DashboardLayout from '../../Dashboard/components/DashboardLayout';
import ProtectedRoute from '../../Auth/components/ProtectedRoute';
import { useThemeInit } from '../hooks/useTheme';

// ✅ NEW PAGES - Landing & Registration
import LandingPage from '../../../pages/LandingPage';
import RegisterPage from '../../../pages/Register';

// Lazy load pages for code splitting
const LoginPage = lazy(() => import('../../Auth/pages/Login'));
const Dashboard = lazy(() => import('../../Dashboard/pages/Dashboard'));
const ShipmentList = lazy(() => import('../../Shipments/pages/ShipmentListPage'));
const ShipmentDetails = lazy(() => import('../../Shipments/pages/ShipmentDetailsPage'));
const InvoiceList = lazy(() => import('../../Invoices/pages/InvoiceList'));
const InvoiceDetails = lazy(() => import('../../Invoices/pages/InvoiceDetails'));
const Analytics = lazy(() => import('../../Analytics/pages/Dashboard'));
const NotFoundPage = lazy(() => import('../pages/NotFound'));
const Tracking = lazy(() => import('../../Tracking/pages/LiveTracking'));
const DriverList = lazy(() => import('../../Drivers/pages/DriversList'));
const DriverDetails = lazy(() => import('../../Drivers/pages/DriverDetails'));
const Maintenance = lazy(() => import('../../Maintenance/pages/MaintenanceList'));
const ClientList = lazy(() => import('../../Clients/pages/ClientDashboard'));
const ClientDetails = lazy(() => import('../../Clients/pages/ClientDetails'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

/**
 * AppRoutes
 * 
 * Main routing configuration with:
 * ✅ Public routes (landing, login, register)
 * ✅ Protected routes with AppLayout
 * ✅ Dashboard routes with DashboardLayout
 * ✅ Error pages (404)
 * ✅ Lazy loading for performance
 * ✅ Theme initialization
 */
export const AppRoutes = () => {
  // Initialize theme on app mount
  useThemeInit();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* ✅ PUBLIC ROUTES - NO AUTHENTICATION REQUIRED */}
        
        {/* Landing page - Home */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Login page */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Registration page */}
        <Route path="/register" element={<RegisterPage />} />

        {/* ✅ PROTECTED ROUTES - REQUIRE AUTHENTICATION */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            
            {/* Invoices section */}
            <Route path="/invoices" element={<InvoiceList />} />
            <Route path="/invoices/:id" element={<InvoiceDetails />} />

            {/* Analytics section */}
            <Route path="/analytics" element={<Analytics />} />

            {/* Tracking section */}
            <Route path="/tracking" element={<Tracking />} />

            {/* Dashboard section with DashboardLayout */}
            <Route element={<DashboardLayout />}>
              
              {/* Dashboard home */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route index element={<Navigate to="/dashboard" replace />} />

              {/* Shipments subsection */}
              <Route path="/dashboard/shipments" element={<ShipmentList />} />
              <Route path="/dashboard/shipments/:id" element={<ShipmentDetails />} />

              <Route path="/dashboard/drivers" element={<DriverList />} />
              <Route path="/dashboard/drivers/:id" element={<DriverDetails />} />

              <Route path="/dashboard/maintenance" element={<Maintenance />} />

              <Route path="/dashboard/clients" element={<ClientList />} />
              <Route path="/dashboard/clients/:id" element={<ClientDetails />} />

              {/* Other dashboard routes - uncomment as features are added */}
              {/* 
              <Route path="/dashboard/trucks" element={<TruckList />} />
              <Route path="/dashboard/trucks/:id" element={<TruckDetails />} />
              
              <Route path="/dashboard/analytics" element={<DashboardAnalytics />} />
              <Route path="/dashboard/reports" element={<Reports />} />
            
              <Route path="/dashboard/invoices" element={<DashboardInvoices />} />
              
              <Route path="/dashboard/documents" element={<Documents />} />
              
              <Route path="/dashboard/admin/users" element={<UserManagement />} />
              <Route path="/dashboard/admin/configuration" element={<Configuration />} />
              <Route path="/dashboard/admin/audit" element={<AuditLogs />} />
              */}

            </Route>

          </Route>
        </Route>

        {/* ✅ 404 NOT FOUND - Catch all unknown routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;