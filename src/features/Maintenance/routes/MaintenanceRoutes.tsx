// src/routes/MaintenanceRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MaintenanceProvider } from '../../Maintenance/contexts/provider'; // Updated import path
import MaintenanceDashboard from '../../Maintenance/components/MaintenanceDashboard';
import MaintenanceScheduleDetail from '../../Maintenance/components/MaintenanceScheduleDetail';
import MaintenanceScheduleForm from '../../Maintenance/components/MaintenanceScheduleForm';
import MaintenanceHistory from '../../Maintenance/components/MaintenanceHistory';

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