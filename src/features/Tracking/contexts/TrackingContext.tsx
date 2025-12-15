// src/features/Tracking/contexts/TrackingContext.tsx

import React, { createContext, useState, useCallback, ReactNode } from 'react';

// ✅ FIXED: Import from unified types
import { TrackingData, ShipmentStatus } from '@features/Shipments/types/shipment';

// Import the service from its correct location
import TrackingService from '../services/TrackingService';

// Define the shape of the context
interface TrackingContextType {
  shipments: TrackingData[];
  loadShipments: () => Promise<void>;
  isLoading: boolean;
  error: Error | null;
  getShipmentById: (id: string) => TrackingData | undefined;
  searchShipments: (query: string) => Promise<void>;
  updateShipmentStatus: (shipmentId: string, status: ShipmentStatus, notes: string) => Promise<void>;
  refreshShipments: () => Promise<void>;
}

// Create the context with default values
const TrackingContext = createContext<TrackingContextType>({
  shipments: [],
  loadShipments: async () => {},
  isLoading: false,
  error: null,
  getShipmentById: () => undefined,
  searchShipments: async () => {},
  updateShipmentStatus: async () => {},
  refreshShipments: async () => {},
});

// Create the provider component
export const TrackingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [shipments, setShipments] = useState<TrackingData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load all active shipments
  const loadShipments = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await TrackingService.getActiveShipments();
      setShipments(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load shipments'));
      console.error('Error loading shipments:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get shipment by ID
  const getShipmentById = useCallback((id: string): TrackingData | undefined => {
    return shipments.find(shipment => shipment.shipmentId === id);
  }, [shipments]);

  // Search shipments
  const searchShipments = useCallback(async (query: string) => {
    setIsLoading(true);
    try {
      const data = await TrackingService.searchShipments(query);
      setShipments(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to search shipments'));
      console.error('Error searching shipments:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ FIXED: Proper typing instead of 'any'
  const updateShipmentStatus = useCallback(async (shipmentId: string, status: ShipmentStatus, notes: string) => {
    try {
      const updatedShipment = await TrackingService.updateTrackingStatus(shipmentId, status, notes);
      if (updatedShipment) {
        setShipments(prevShipments => 
          prevShipments.map(shipment => 
            shipment.shipmentId === shipmentId ? updatedShipment : shipment
          )
        );
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update shipment status'));
      console.error('Error updating shipment status:', err);
    }
  }, []);

  // Refresh shipments
  const refreshShipments = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await TrackingService.getActiveShipments();
      setShipments(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to refresh shipments'));
      console.error('Error refreshing shipments:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Context value
  const value = {
    shipments,
    loadShipments,
    isLoading,
    error,
    getShipmentById,
    searchShipments,
    updateShipmentStatus,
    refreshShipments,
  };

  return (
    <TrackingContext.Provider value={value}>
      {children}
    </TrackingContext.Provider>
  );
};

// Export the context as default
export default TrackingContext;