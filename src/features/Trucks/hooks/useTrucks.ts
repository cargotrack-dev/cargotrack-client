import { useState, useEffect, useMemo } from 'react';
import { getTrucks, getTruckById } from '../services/truckService';
import { Truck } from '../types/truck.types';

// Define the filter interface here since it's not exported from the types file
export interface TruckFilter {
  status?: string;
  type?: string;
  available?: boolean;
  locationId?: string;
  driverId?: string;
  [key: string]: string | boolean | undefined;
}

export const useTrucks = (filters: TruckFilter = {}) => {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Memoize the stringified filters to use as a dependency
  const filtersKey = useMemo(() => JSON.stringify(filters), [filters]);

  useEffect(() => {
    const fetchTrucks = async () => {
      setLoading(true);
      try {
        const data = await getTrucks(filters);
        setTrucks(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch trucks'));
      } finally {
        setLoading(false);
      }
    };

    fetchTrucks();
  }, [filters, filtersKey]); // Add filters to dependency array

  return { trucks, loading, error };
};

export const useTruck = (id?: string) => {
  const [truck, setTruck] = useState<Truck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setTruck(null);
      setLoading(false);
      return;
    }

    const fetchTruck = async () => {
      setLoading(true);
      try {
        const data = await getTruckById(id);
        setTruck(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(`Failed to fetch truck with ID ${id}`));
      } finally {
        setLoading(false);
      }
    };

    fetchTruck();
  }, [id]);

  return { truck, loading, error };
};