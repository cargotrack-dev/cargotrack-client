// src/features/Waybills/hooks/useWaybills.ts
import { useState, useEffect, useRef } from 'react';
import { getWaybills, getWaybillById } from '../services/waybillService';
import { Waybill } from '../types/types';

export const useWaybills = (filters = {}) => {
  const [waybills, setWaybills] = useState<Waybill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Use useRef to store the current filters
  const filtersRef = useRef(filters);
  
  // Update ref when filters change
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    const fetchWaybills = async () => {
      setLoading(true);
      try {
        // Use the ref value to get the latest filters
        const data = await getWaybills(filtersRef.current);
        setWaybills(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch waybills'));
      } finally {
        setLoading(false);
      }
    };

    fetchWaybills();
  }, []);  // Empty dependency array since we're using ref

  return { waybills, loading, error };
};

export const useWaybill = (id?: string) => {
  const [waybill, setWaybill] = useState<Waybill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setWaybill(null);
      setLoading(false);
      return;
    }

    const fetchWaybill = async () => {
      setLoading(true);
      try {
        const data = await getWaybillById(id);
        setWaybill(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(`Failed to fetch waybill with ID ${id}`));
      } finally {
        setLoading(false);
      }
    };

    fetchWaybill();
  }, [id]);

  return { waybill, loading, error };
};