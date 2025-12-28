// src/routes/MaintenanceRoutes.tsx
// 🚀 UNIFIED MAINTENANCE FEATURE - Integrated with Your Existing Structure

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MaintenanceProvider } from '../../Maintenance/contexts/provider';

// ==================== EXISTING COMPONENTS ====================
import MaintenanceDashboard from '../../Maintenance/components/MaintenanceDashboard';
import MaintenanceScheduleDetail from '../../Maintenance/components/MaintenanceScheduleDetail';
import MaintenanceScheduleForm from '../../Maintenance/components/MaintenanceScheduleForm';
import MaintenanceHistory from '../../Maintenance/components/MaintenanceHistory';

// ==================== NEW PAGE COMPONENTS ====================
import MaintenanceList from '../../Maintenance/pages/MaintenanceList';
import MaintenanceScheduler from '../../Maintenance/pages/MaintenanceScheduler';

/**
 * 🔧 UNIFIED MAINTENANCE FEATURE ROUTES
 * 
 * Integrates your existing components with 2 new page views
 * ✅ Maintains backward compatibility
 * ✅ Preserves all existing routes
 * ✅ Adds 2 new view options (List & Scheduler)
 * ✅ Uses MaintenanceProvider for shared state
 * 
 * ROUTE STRUCTURE:
 * ─────────────────────────────────────────────────────────────
 * /maintenance                    → MaintenanceDashboard (your existing)
 * /maintenance/list               → MaintenanceList (NEW - alt view)
 * /maintenance/scheduler          → MaintenanceScheduler (NEW - calendar view)
 * /maintenance/schedule/:id       → MaintenanceScheduleDetail (your existing)
 * /maintenance/schedule/new       → MaintenanceScheduleForm (your existing)
 * /maintenance/schedule/edit/:id  → MaintenanceScheduleForm (your existing)
 * /maintenance/history            → MaintenanceHistory (your existing)
 * /maintenance/history/:vehicleId → MaintenanceHistory (your existing)
 * ─────────────────────────────────────────────────────────────
 */

export const MaintenanceRoutes: React.FC = () => {
  return (
    <MaintenanceProvider>
      <Routes>
        {/* ==================== DEFAULT HOME ==================== */}
        {/* Your existing dashboard - default when visiting /maintenance */}
        <Route path="/" element={<MaintenanceDashboard />} />

        {/* ==================== NEW VIEW ALTERNATIVES ==================== */}
        {/* 
          NEW: Alternative list-based dashboard view with search & filters
          Route: /maintenance/list
          Features: Statistics, search, filters, sorting, detail modal
        */}
        <Route path="/list" element={<MaintenanceList />} />

        {/* 
          NEW: Calendar-based scheduler view for monthly planning
          Route: /maintenance/scheduler
          Features: Calendar grid, tabbed filters, events by date, create modal
        */}
        <Route path="/scheduler" element={<MaintenanceScheduler />} />

        {/* ==================== DETAIL/EDIT ROUTES (YOUR EXISTING) ==================== */}
        {/* View maintenance schedule details */}
        <Route path="/schedule/:id" element={<MaintenanceScheduleDetail />} />

        {/* Create new maintenance schedule */}
        <Route path="/schedule/new" element={<MaintenanceScheduleForm />} />

        {/* Edit existing maintenance schedule */}
        <Route path="/schedule/edit/:id" element={<MaintenanceScheduleForm />} />

        {/* ==================== HISTORY ROUTES (YOUR EXISTING) ==================== */}
        {/* View all maintenance history */}
        <Route path="/history" element={<MaintenanceHistory />} />

        {/* View maintenance history for specific vehicle */}
        <Route path="/history/:vehicleId" element={<MaintenanceHistory />} />

        {/* ==================== CATCH-ALL ==================== */}
        {/* Redirect unknown routes to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MaintenanceProvider>
  );
};

export default MaintenanceRoutes;