// src/features/Shipments/hooks/useShipments.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import ShipmentService from '../services/ShipmentService';
import { Shipment } from '../types/shipment';

interface ShipmentFilters {
  status?: string;
  priority?: string;
  clientId?: string;
  dateFrom?: Date | string;
  dateTo?: Date | string;
  [key: string]: string | Date | undefined;
}

export const useShipments = (filters: ShipmentFilters = {}) => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Memoize the filters stringified value to prevent unnecessary re-renders
  useMemo(() => JSON.stringify(filters), [filters]);

  const fetchShipments = useCallback(async () => {
    setLoading(true);
    try {
      // Use the correct method from ShipmentService
      const data = await ShipmentService.getAllShipments();
      
      // Apply filters manually since the service doesn't support filtering directly
      let filteredData = data;
      
      if (Object.keys(filters).length > 0) {
        filteredData = data.filter(shipment => {
          // Check each filter
          for (const [key, value] of Object.entries(filters)) {
            if (value !== undefined && value !== null && value !== '') {
              if (key === 'dateFrom' && shipment.createdAt) {
                const shipmentDate = new Date(shipment.createdAt);
                const fromDate = new Date(value as string | Date);
                if (shipmentDate < fromDate) return false;
              } else if (key === 'dateTo' && shipment.createdAt) {
                const shipmentDate = new Date(shipment.createdAt);
                const toDate = new Date(value as string | Date);
                if (shipmentDate > toDate) return false;
              } else if (shipment[key as keyof Shipment] !== value) {
                return false;
              }
            }
          }
          return true;
        });
      }
      
      setShipments(filteredData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch shipments'));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  return { shipments, loading, error, refetch: fetchShipments };
};

export const useShipment = (id?: string) => {
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchShipment = useCallback(async () => {
    if (!id) {
      setShipment(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Use the correct method from ShipmentService
      const data = await ShipmentService.getShipmentById(id);
      setShipment(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to fetch shipment with ID ${id}`));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchShipment();
  }, [fetchShipment]);

  return { 
    shipment, 
    loading, 
    error, 
    refetch: fetchShipment,
    updateShipment: async (updatedData: Partial<Shipment>) => {
      if (!id || !shipment) return null;
      
      try {
        setLoading(true);
        const updated = await ShipmentService.updateShipment(id, updatedData);
        setShipment(updated);
        return updated;
      } catch (err) {
        setError(err instanceof Error ? err : new Error(`Failed to update shipment with ID ${id}`));
        return null;
      } finally {
        setLoading(false);
      }
    }
  };
};