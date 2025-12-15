// src/features/Analytics/hooks/useAnalytics.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { AnalyticsParams } from '../services/analyticsService';

// Define a type for the analytics data
interface AnalyticsData {
  // Add properties based on your actual data structure
  labels?: string[];
  datasets?: Array<{
    label: string;
    data: number[];
    backgroundColor?: string[];
  }>;
  summary?: Record<string, number>;
  timeRange?: {
    start: string;
    end: string;
  };
}

export const useAnalytics = (initialParams: AnalyticsParams = {}) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Use a ref for params to avoid triggering re-renders but still have current values
  const paramsRef = useRef(initialParams);
  
  // Update ref when initialParams change
  useEffect(() => {
    paramsRef.current = initialParams;
  }, [initialParams]);

  // Create fetch function without dependencies
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Use current params from ref
      // const result = await getAnalyticsData(paramsRef.current);
      const result = { /* mock data */ };
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch analytics data'));
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies

  useEffect(() => {
    fetchData();
  }, [fetchData, initialParams]); // Re-run when initialParams change

  return { data, loading, error };
};