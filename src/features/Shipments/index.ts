// src/features/Shipments/index.ts
// Export components
export { default as ShipmentDashboard } from './components/ShipmentDashboard';
export { default as ShipmentDetails } from './components/ShipmentDetails';
export { default as ShipmentForm } from './components/ShipmentForm';
export { default as ShipmentStatusBadge } from './components/ShipmentStatusBadge';
export { default as ShipmentSummaryCard } from './components/ShipmentSummaryCard';
export { default as ShipmentTracking } from './components/ShipmentTracking';
export { ShipmentList } from './components/ShipmentList';
export { ShipmentMap } from './components/ShipmentMap';

// Export pages
export { default as ShipmentListPage } from './pages/ShipmentListPage';
export { default as ShipmentDetailsPage } from './pages/ShipmentDetailsPage';

// Export hooks
export { useShipments, useShipment } from './hooks/useShipments';

// Export services
export * from './services/ShipmentService';

// Export types
export * from './types/shipment';

// Export utils
export {
  getStatusColor,
  formatShipmentId,
  calculateEstimatedDelivery,
  isShipmentDelayed,
  calculateShipmentProgress
} from './utils/shipmentUtils';