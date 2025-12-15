// src/routes/MaintenanceRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MaintenanceProvider } from '@features/Maintenance/contexts/provider'; // Updated import path
import MaintenanceDashboard from '@features/Maintenance/components/MaintenanceDashboard';
import MaintenanceScheduleDetail from '@features/Maintenance/components/MaintenanceScheduleDetail';
import MaintenanceScheduleForm from '@features/Maintenance/components/MaintenanceScheduleForm';
import MaintenanceHistory from '@features/Maintenance/components/MaintenanceHistory';

export const MaintenanceRoutes: React.FC = () => {
  return (
    <MaintenanceProvider>
      <Routes>
        <Route path="/" element={<MaintenanceDashboard />} />
        <Route path="/schedule/:id" element={<MaintenanceScheduleDetail />} />
        <Route path="/schedule/new" element={<MaintenanceScheduleForm />} />
        <Route path="/schedule/edit/:id" element={<MaintenanceScheduleForm />} />
        <Route path="/history" element={<MaintenanceHistory />} />
        <Route path="/history/:vehicleId" element={<MaintenanceHistory />} />
      </Routes>
    </MaintenanceProvider>
  );
};