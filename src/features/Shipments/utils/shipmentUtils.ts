// src/features/Shipments/utils/shipmentUtils.ts
import { Shipment, ShipmentStatus } from '../types/shipment';

/**
 * Get color for shipment status
 */
export const getStatusColor = (status: ShipmentStatus): string => {
  const colors: Record<string, string> = {
    [ShipmentStatus.PLANNED]: 'gray',
    [ShipmentStatus.DISPATCHED]: 'blue',
    [ShipmentStatus.IN_TRANSIT]: 'amber',
    [ShipmentStatus.COMPLETED]: 'green',
    [ShipmentStatus.CANCELLED]: 'red',
    [ShipmentStatus.DELAYED]: 'orange',
    [ShipmentStatus.INCIDENT]: 'rose'
  };
  
  return colors[status] || 'gray';
};

/**
 * Format shipment ID for display
 */
export const formatShipmentId = (id: string): string => {
  // Assuming the shipment ID follows a pattern like "shipment-1234567890"
  if (id.startsWith('ship-')) {
    return id.replace('ship-', 'SHP-');
  }
  
  // If it's just a string of letters/numbers, format it nicely
  if (/^[a-zA-Z0-9]+$/.test(id)) {
    // Group into chunks of 4 characters
    return id.toUpperCase().match(/.{1,4}/g)?.join('-') || id.toUpperCase();
  }
  
  return id;
};

/**
 * Calculate estimated delivery date based on schedule
 */
export const calculateEstimatedDelivery = (shipment: Shipment): Date | null => {
  if (!shipment.schedule?.plannedStart) {
    return null;
  }
  
  const departureDate = new Date(shipment.schedule.plannedStart);
  
  // If we have a planned end date, use that as the estimated delivery
  if (shipment.schedule.plannedEnd) {
    return new Date(shipment.schedule.plannedEnd);
  }
  
  // If we have tracking with an ETA, use that
  if (shipment.tracking?.currentEta) {
    return new Date(shipment.tracking.currentEta);
  }
  
  // Default to adding 3 days if no other information is available
  const estimatedDelivery = new Date(departureDate);
  estimatedDelivery.setDate(departureDate.getDate() + 3);
  return estimatedDelivery;
};

/**
 * Check if a shipment is delayed
 */
export const isShipmentDelayed = (shipment: Shipment): boolean => {
  if (shipment.status === ShipmentStatus.DELAYED) {
    return true;
  }
  
  if (shipment.status === ShipmentStatus.COMPLETED && shipment.schedule.plannedEnd) {
    const estimatedDelivery = new Date(shipment.schedule.plannedEnd);
    const actualDelivery = shipment.schedule.actualEnd ? new Date(shipment.schedule.actualEnd) : null;
    
    if (actualDelivery && actualDelivery > estimatedDelivery) {
      // Delivered but later than estimated
      return true;
    }
  }
  
  if (shipment.schedule.plannedEnd) {
    const today = new Date();
    const estimatedDelivery = new Date(shipment.schedule.plannedEnd);
    
    if (today > estimatedDelivery && shipment.status !== ShipmentStatus.COMPLETED) {
      // Past estimated delivery date but not delivered yet
      return true;
    }
  }
  
  return false;
};

/**
 * Calculate the progress percentage of a shipment
 */
export const calculateShipmentProgress = (shipment: Shipment): number => {
  switch (shipment.status) {
    case ShipmentStatus.PLANNED:
      return 0;
    case ShipmentStatus.DISPATCHED:
      return 25;
    case ShipmentStatus.IN_TRANSIT:
      // If we have location data, we could calculate more precisely
      return 50;
    case ShipmentStatus.COMPLETED:
      return 100;
    case ShipmentStatus.CANCELLED:
      return 0;
    case ShipmentStatus.DELAYED:
      // If we have location data, we could calculate more precisely
      return 50;
    case ShipmentStatus.INCIDENT:
      // If we have location data, we could calculate more precisely
      return 50;
    default:
      return 0;
  }
};