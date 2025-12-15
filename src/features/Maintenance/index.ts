// src/features/Maintenance/index.ts - Fixed version
// Export components - using default exports for components that have them
export { default as MaintenanceCalendar } from './components/MaintenanceCalendar';
export { default as MaintenanceDashboard } from './components/MaintenanceDashboard';
export { default as MaintenanceHistory } from './components/MaintenanceHistory';
export { default as MaintenanceReminders } from './components/MaintenanceReminders';
export { default as MaintenanceScheduleDetail } from './components/MaintenanceScheduleDetail';
export { default as MaintenanceScheduleForm } from './components/MaintenanceScheduleForm';
export { default as MaintenanceScheduleList } from './components/MaintenanceScheduleList';

// Export pages
export { default as MaintenanceListPage } from './pages/MaintenanceList';
export { default as MaintenanceSchedulerPage } from './pages/MaintenanceScheduler';

// Export contexts - only what actually exists
export { MaintenanceProvider } from './contexts/index';

// Export hooks
export { useMaintenance } from './hooks/useMaintenance';
export { useMaintenance as useMaintenanceContext } from './contexts/useMaintenance';

// Export services
export * from './services/mockMaintenanceService';

// Export types
export * from './types/maintenance';

// Export utils
export {
  getStatusColor,
  getPriorityColor,
  isTaskOverdue,
  groupTasksByVehicle,
  getDaysUntil,
  formatMaintenanceDate
} from './utils/maintenanceUtils';