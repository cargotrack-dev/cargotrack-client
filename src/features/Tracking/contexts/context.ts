// src/contexts/tracking/context.ts
import { createContext } from 'react';
import { TrackingContextType } from './types';

// Create context with default values
export const TrackingContext = createContext<TrackingContextType>({
  shipments: [],
  isLoading: false,
  error: null,
  selectedShipment: null,
  
  // Shipment operations
  loadShipments: async () => {},
  getShipmentById: () => null,
  getShipmentByTrackingNumber: () => null,
  createShipment: async () => {
    throw new Error('Not implemented');
  },
  updateShipment: async () => {
    throw new Error('Not implemented');
  },
  deleteShipment: async () => {},
  fetchShipmentById: async () => {},
  
  // Tracking events
  addTrackingEvent: async () => {
    throw new Error('Not implemented');
  },
  updateShipmentStatus: async () => {
    throw new Error('Not implemented');
  },
  markAsDelivered: async () => {
    throw new Error('Not implemented');
  },
  
  // Location updates
  updateShipmentLocation: async () => {
    throw new Error('Not implemented');
  },
  getShipmentCurrentLocation: () => null,
  
  // Filtering and search
  getShipmentsByStatus: () => [],
  getShipmentsByClient: () => [],
  getShipmentsByVehicle: () => [],
  getShipmentsByDriver: () => []
});