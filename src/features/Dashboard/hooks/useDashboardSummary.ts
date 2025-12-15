// src/features/Dashboard/hooks/useDashboardSummary.ts
import { useState, useEffect } from 'react';
import { getDashboardSummary } from '../services/dashboardService';
import { DashboardSummary } from '../types';

export const useDashboardSummary = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const data = await getDashboardSummary();
        setSummary(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch dashboard summary'));
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  return { summary, loading, error };
};