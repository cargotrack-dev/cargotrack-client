// src/routes/TrackingRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { TrackingProvider } from '../../Tracking/contexts/provider'; // Updated import path
import { TrackingDashboard } from '../../Tracking/components/TrackingDashboard';
import ShipmentDetail from '../../Shipments/components/ShipmentDetails';

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