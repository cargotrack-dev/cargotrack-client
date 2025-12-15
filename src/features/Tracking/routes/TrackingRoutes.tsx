// src/routes/TrackingRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { TrackingProvider } from '@features/Tracking/contexts/provider'; // Updated import path
import { TrackingDashboard } from '@features/Tracking/components/TrackingDashboard';
import ShipmentDetail from '@features/Shipments/components/ShipmentDetails';

export const TrackingRoutes: React.FC = () => {
  return (
    <TrackingProvider>
      <Routes>
        <Route path="/" element={<TrackingDashboard />} />
        <Route path="/:id" element={<ShipmentDetail />} />
      </Routes>
    </TrackingProvider>
  );
};