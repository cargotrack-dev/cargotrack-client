// src/features/Tracking/utils/trackingUtils.ts
import { ShipmentStatus, StatusUpdate, Location } from '../types/tracking';

/**
 * Get color for shipment status
 */
export const getStatusColor = (status: ShipmentStatus): string => {
  const colors: Record<string, string> = {
    [ShipmentStatus.PENDING]: 'gray',
    [ShipmentStatus.PICKED_UP]: 'blue',
    [ShipmentStatus.IN_TRANSIT]: 'amber',
    [ShipmentStatus.DELIVERED]: 'green',
    [ShipmentStatus.CANCELLED]: 'red',
    [ShipmentStatus.DELAYED]: 'orange',
    [ShipmentStatus.EXCEPTION]: 'rose',
    [ShipmentStatus.ON_HOLD]: 'purple'
  };
  
  return colors[status] || 'gray';
};

/**
 * Format status update for display
 */
export const formatStatusUpdate = (update: StatusUpdate): string => {
  const timestamp = new Date(update.timestamp);
  const date = timestamp.toLocaleDateString();
  const time = timestamp.toLocaleTimeString();
  
  return `${update.status} - ${date} ${time} by ${update.updatedBy}`;
};

/**
 * Calculate if a shipment is delayed based on its current status and estimated delivery
 */
export const isShipmentDelayed = (
  status: ShipmentStatus, 
  estimatedDelivery: string | Date
): boolean => {
  if (status === ShipmentStatus.DELAYED) {
    return true;
  }
  
  const deliveryDate = typeof estimatedDelivery === 'string' 
    ? new Date(estimatedDelivery) 
    : estimatedDelivery;
  
  const today = new Date();
  
  return (
    today > deliveryDate && 
    status !== ShipmentStatus.DELIVERED && 
    status !== ShipmentStatus.CANCELLED
  );
};

/**
 * Format location for display
 */
export const formatLocation = (location?: Location): string => {
  if (!location) {
    return 'Unknown location';
  }
  
  if (location.address) {
    return location.address;
  }
  
  return `Lat: ${location.latitude.toFixed(4)}, Long: ${location.longitude.toFixed(4)}`;
};

/**
 * Calculate time elapsed since a timestamp
 */
export const getTimeElapsed = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  // Convert to appropriate units
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  }
  
  if (diffHours > 0) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  }
  
  if (diffMins > 0) {
    return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  }
  
  return 'Just now';
};

/**
 * Get status label for display
 */
export const getStatusLabel = (status: ShipmentStatus): string => {
  const labels: Record<string, string> = {
    [ShipmentStatus.PENDING]: 'Pending',
    [ShipmentStatus.PICKED_UP]: 'Picked Up',
    [ShipmentStatus.IN_TRANSIT]: 'In Transit',
    [ShipmentStatus.DELIVERED]: 'Delivered',
    [ShipmentStatus.CANCELLED]: 'Cancelled',
    [ShipmentStatus.DELAYED]: 'Delayed',
    [ShipmentStatus.EXCEPTION]: 'Exception',
    [ShipmentStatus.ON_HOLD]: 'On Hold'
  };
  
  return labels[status] || status.toString();
};