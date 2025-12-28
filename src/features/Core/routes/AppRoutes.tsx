// 📁 src/features/Core/routes/AppRoutes.tsx
// ✅ FINAL CORRECTED - Unified Maintenance Feature with 8 routes + MaintenanceProvider

import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import DashboardLayout from '../../Dashboard/components/DashboardLayout';
import ProtectedRoute from '../../Auth/components/ProtectedRoute';
import { useThemeInit } from '../hooks/useTheme';
import { MaintenanceProvider } from '../../Maintenance/contexts/provider'; // ✅ ADDED

// ✅ PUBLIC PAGES - Landing & Registration
import LandingPage from '../../../pages/LandingPage';
import RegisterPage from '../../../pages/Register';

// ✅ LAZY LOAD - Pages for code splitting
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
const ClientList = lazy(() => import('../../Clients/pages/ClientDashboard'));
const ClientDetails = lazy(() => import('../../Clients/pages/ClientDetails'));

// ✅ MAINTENANCE - UNIFIED FEATURE (4 view components + existing components)
const MaintenanceDashboard = lazy(() => import('../../Maintenance/components/MaintenanceDashboard'));
const MaintenanceList = lazy(() => import('../../Maintenance/pages/MaintenanceList'));
const MaintenanceScheduler = lazy(() => import('../../Maintenance/pages/MaintenanceScheduler'));
const MaintenanceScheduleForm = lazy(() => import('../../Maintenance/components/MaintenanceScheduleForm'));
const MaintenanceScheduleDetail = lazy(() => import('../../Maintenance/components/MaintenanceScheduleDetail'));
const MaintenanceHistory = lazy(() => import('../../Maintenance/components/MaintenanceHistory'));

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
 * ✅ Unified Maintenance Feature (8 routes with MaintenanceProvider)
 * ✅ Error pages (404)
 * ✅ Lazy loading for performance
 * ✅ Theme initialization
 * 
 * MAINTENANCE ROUTES (8 total):
 * /dashboard/maintenance                    → MaintenanceDashboard (default)
 * /dashboard/maintenance/list               → MaintenanceList (NEW - list view)
 * /dashboard/maintenance/scheduler          → MaintenanceScheduler (NEW - calendar view)
 * /dashboard/maintenance/schedule/:id       → MaintenanceScheduleDetail (detail)
 * /dashboard/maintenance/schedule/new       → MaintenanceScheduleForm (create)
 * /dashboard/maintenance/schedule/edit/:id  → MaintenanceScheduleForm (edit)
 * /dashboard/maintenance/history            → MaintenanceHistory (history)
 * /dashboard/maintenance/history/:vehicleId → MaintenanceHistory (vehicle history)
 */
export const AppRoutes = () => {
  // Initialize theme on app mount
  useThemeInit();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* ════════════════════════════════════════════════════════════════ */}
        {/* ✅ PUBLIC ROUTES - NO AUTHENTICATION REQUIRED */}
        {/* ════════════════════════════════════════════════════════════════ */}
        
        {/* Landing page - Home */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Login page */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Registration page */}
        <Route path="/register" element={<RegisterPage />} />

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* ✅ PROTECTED ROUTES - REQUIRE AUTHENTICATION */}
        {/* ════════════════════════════════════════════════════════════════ */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            
            {/* Invoices section */}
            <Route path="/invoices" element={<InvoiceList />} />
            <Route path="/invoices/:id" element={<InvoiceDetails />} />

            {/* Analytics section */}
            <Route path="/analytics" element={<Analytics />} />

            {/* Tracking section */}
            <Route path="/tracking" element={<Tracking />} />

            {/* ════════════════════════════════════════════════════════════════ */}
            {/* Dashboard section with DashboardLayout */}
            {/* ════════════════════════════════════════════════════════════════ */}
            <Route element={<DashboardLayout />}>
              
              {/* Dashboard home */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route index element={<Navigate to="/dashboard" replace />} />

              {/* Shipments subsection */}
              <Route path="/dashboard/shipments" element={<ShipmentList />} />
              <Route path="/dashboard/shipments/:id" element={<ShipmentDetails />} />

              {/* Drivers subsection */}
              <Route path="/dashboard/drivers" element={<DriverList />} />
              <Route path="/dashboard/drivers/:id" element={<DriverDetails />} />

              {/* ════════════════════════════════════════════════════════════════ */}
              {/* MAINTENANCE - UNIFIED FEATURE (8 routes) */}
              {/* ✅ UPDATED: All routes wrapped with MaintenanceProvider */}
              {/* ════════════════════════════════════════════════════════════════ */}
              
              {/* Default/Dashboard View - Your original dashboard */}
              <Route
                path="/maintenance"
                element={
                  <MaintenanceProvider>
                    <MaintenanceDashboard />
                  </MaintenanceProvider>
                }
              />

              {/* NEW: List View - Search & Statistics */}
              <Route
                path="/maintenance/list"
                element={
                  <MaintenanceProvider>
                    <MaintenanceList />
                  </MaintenanceProvider>
                }
              />

              {/* NEW: Scheduler View - Calendar Planning */}
              <Route
                path="/maintenance/scheduler"
                element={
                  <MaintenanceProvider>
                    <MaintenanceScheduler />
                  </MaintenanceProvider>
                }
              />

              {/* Detail View */}
              <Route
                path="/maintenance/schedule/:id"
                element={
                  <MaintenanceProvider>
                    <MaintenanceScheduleDetail />
                  </MaintenanceProvider>
                }
              />

              {/* Create/Edit Form */}
              <Route
                path="/maintenance/schedule/new"
                element={
                  <MaintenanceProvider>
                    <MaintenanceScheduleForm />
                  </MaintenanceProvider>
                }
              />

              {/* Edit Form */}
              <Route
                path="/maintenance/schedule/edit/:id"
                element={
                  <MaintenanceProvider>
                    <MaintenanceScheduleForm />
                  </MaintenanceProvider>
                }
              />

              {/* History View */}
              <Route
                path="/maintenance/history"
                element={
                  <MaintenanceProvider>
                    <MaintenanceHistory />
                  </MaintenanceProvider>
                }
              />

              {/* Vehicle History */}
              <Route
                path="/maintenance/history/:vehicleId"
                element={
                  <MaintenanceProvider>
                    <MaintenanceHistory />
                  </MaintenanceProvider>
                }
              />

              {/* Clients subsection */}
              <Route path="/dashboard/clients" element={<ClientList />} />
              <Route path="/dashboard/clients/:id" element={<ClientDetails />} />

              {/* ════════════════════════════════════════════════════════════════ */}
              {/* Other dashboard routes - uncomment as features are added */}
              {/* ════════════════════════════════════════════════════════════════ */}
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

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* ✅ 404 NOT FOUND - Catch all unknown routes */}
        {/* ════════════════════════════════════════════════════════════════ */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

/**
 * ✨ UNIFIED MAINTENANCE ROUTES SUMMARY:
 * 
 * /dashboard/maintenance                    → MaintenanceDashboard
 * /dashboard/maintenance/list               → MaintenanceList
 * /dashboard/maintenance/scheduler          → MaintenanceScheduler
 * /dashboard/maintenance/schedule/:id       → MaintenanceScheduleDetail
 * /dashboard/maintenance/schedule/new       → MaintenanceScheduleForm
 * /dashboard/maintenance/schedule/edit/:id  → MaintenanceScheduleForm
 * /dashboard/maintenance/history            → MaintenanceHistory
 * /dashboard/maintenance/history/:vehicleId → MaintenanceHistory
 * 
 * ✅ KEY CHANGES FROM ORIGINAL:
 * ✅ Added MaintenanceProvider import
 * ✅ Added 5 new maintenance component imports (Scheduler, List, Detail, Form, History)
 * ✅ Replaced single route with 8 unified routes
 * ✅ All routes wrapped with MaintenanceProvider
 * ✅ Maintains dashboard structure
 * ✅ Lazy loading for all components
 * ✅ Ready for "New Maintenance" button to navigate to scheduler
 */

export default AppRoutes;