// src/features/Dashboard/hooks/useDashboardConfig.ts
import { useState, useEffect } from 'react';
import { getUserDashboard, saveDashboardConfig } from '../services/dashboardService';
import { DashboardConfig } from '../types';

export const useDashboardConfig = () => {
  const [config, setConfig] = useState<DashboardConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      setLoading(true);
      try {
        const data = await getUserDashboard();
        setConfig(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch dashboard configuration'));
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const updateConfig = async (updates: Partial<DashboardConfig>) => {
    if (!config) return null;
    
    try {
      const updatedConfig = await saveDashboardConfig({
        ...config,
        ...updates,
      });
      setConfig(updatedConfig);
      return updatedConfig;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update dashboard configuration'));
      throw err;
    }
  };

  return { config, loading, error, updateConfig };
};