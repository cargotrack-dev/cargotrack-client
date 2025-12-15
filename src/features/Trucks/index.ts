// src/features/Trucks/index.ts
// Export components
export { default as TruckForm } from './components/TruckForm';

// Export pages
export { default as TruckDetailsPage } from './pages/TruckDetails';
export { default as TruckListPage } from './pages/TruckList';
export { default as VehicleDetailsPage } from './pages/VehicleDetails';

// Export hooks
export { useTrucks, useTruck } from './hooks/useTrucks';

// Export services
export {
  getTrucks,
  getTruckById,
  createTruck,
  updateTruck,
  deleteTruck,
  getTruckMaintenanceRecords,
  assignDriverToTruck
} from './services/truckService';

// Export types
export * from './types/truck.types';

// Export utils
export {
  formatLicensePlate,
  calculateTruckAge,
  isDueForMaintenance,
  calculateTotalMaintenanceCost,
  getTruckStatusColor,
  formatOdometer,
  calculateFuelEfficiency
} from './utils/truckUtils';