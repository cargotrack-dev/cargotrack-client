// src/features/Dashboard/index.ts
// Export components
export { default as DashboardLayout } from './components/DashboardLayout';

// Export pages
export { default as DriverDashboard } from './pages/DriverDashboard';
export { default as VehicleDashboard } from './pages/VehicleDashboard';
export { default as InvoiceDashboard } from './pages/InvoiceDashboard';

// Export hooks
export { useDashboardSummary } from './hooks/useDashboardSummary';
export { useDashboardConfig } from './hooks/useDashboardConfig';

// Export services
export {
  getDashboardSummary,
  getUserDashboard,
  saveDashboardConfig,
  getDriverDashboard,
  getVehicleDashboard
} from './services/dashboardService';

// Export types
export type {
  DashboardWidget,
  DashboardConfig,
  DashboardSummary
} from './types';

// Export utils
export {
  calculateWidgetPositions,
  formatSummaryNumber,
  calculatePercentageChange,
  getStatusColor
} from './utils/dashboardUtils';