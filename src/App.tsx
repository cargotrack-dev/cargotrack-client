// src/App.tsx - Practical fix using your existing file structure
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/Auth';
import { ToastProvider } from '@features/UI/components/ui/toast/ToastProvider';
import Layout from '@features/Core/components/Layout';
import Dashboard from '@features/Dashboard/components/DashboardLayout';
import TruckList from '@features/Trucks/pages/TruckList';
import TruckDetails from '@features/Trucks/pages/TruckDetails';
import WaybillList from '@features/Waybills/pages/WaybillList';
import WaybillDetails from '@features/Waybills/pages/WaybillDetails';
import CargoList from '@features/Cargo/pages/CargoList';
import MaintenanceList from '@features/Maintenance/pages/MaintenanceList';
import { InvoiceList } from '@features/Invoices/pages/InvoiceList';
import UserList from '@features/Admin/pages/UserList';
import Settings from '@features/Settings/pages/Settings';
import NotFound from '@features/Core/pages/NotFound';
import Login from '@features/Auth/pages/Login';
import UnauthorizedPage from '@features/Auth/pages/UnauthorizedPage';
import { type ReactElement } from 'react';
import { ResourceType, PermissionAction } from '@features/Auth/types/auth';

// Protected route wrapper component
const ProtectedRoute: React.FC<{
  element: ReactElement;
  requiredPermission?: { resource: ResourceType; action: PermissionAction };
}> = ({ element, requiredPermission }) => {
  const { isAuthenticated, isLoading, hasPermission } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission.resource, requiredPermission.action)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return element;
};

function App(): ReactElement {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Protected routes */}
            <Route path="/" element={<ProtectedRoute element={<Layout />} />}>
              <Route index element={<Dashboard />} />

              <Route path="trucks" element={
                <ProtectedRoute
                  element={<TruckList />}
                  requiredPermission={{ resource: ResourceType.VEHICLE, action: PermissionAction.READ }}
                />
              } />

              <Route path="trucks/:id" element={
                <ProtectedRoute
                  element={<TruckDetails />}
                  requiredPermission={{ resource: ResourceType.VEHICLE, action: PermissionAction.READ }}
                />
              } />

              <Route path="waybills" element={
                <ProtectedRoute
                  element={<WaybillList />}
                  requiredPermission={{ resource: ResourceType.DOCUMENT, action: PermissionAction.READ }}
                />
              } />

              <Route path="waybills/:id" element={
                <ProtectedRoute
                  element={<WaybillDetails />}
                  requiredPermission={{ resource: ResourceType.DOCUMENT, action: PermissionAction.READ }}
                />
              } />

              <Route path="cargo" element={
                <ProtectedRoute
                  element={<CargoList />}
                  requiredPermission={{ resource: ResourceType.CARGO, action: PermissionAction.READ }}
                />
              } />

              <Route path="maintenance" element={
                <ProtectedRoute
                  element={<MaintenanceList />}
                  requiredPermission={{ resource: ResourceType.MAINTENANCE, action: PermissionAction.READ }}
                />
              } />

              <Route path="invoices" element={
                <ProtectedRoute
                  element={<InvoiceList />}
                  requiredPermission={{ resource: ResourceType.INVOICE, action: PermissionAction.READ }}
                />
              } />

              <Route path="users" element={
                <ProtectedRoute
                  element={<UserList />}
                  requiredPermission={{ resource: ResourceType.USER, action: PermissionAction.READ }}
                />
              } />

              <Route path="settings" element={
                <ProtectedRoute
                  element={<Settings />}
                  requiredPermission={{ resource: ResourceType.SETTING, action: PermissionAction.READ }}
                />
              } />
            </Route>

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;