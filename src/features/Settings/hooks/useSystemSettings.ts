// src/features/Settings/hooks/useSystemSettings.ts
import { useState, useEffect } from 'react';
import { getSystemSettings, updateSystemSettings } from '../services/settingsService';
import { SystemSettings } from '../types';

export const useSystemSettings = () => {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const data = await getSystemSettings();
        setSettings(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch system settings'));
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const updateSettings = async (updatedSettings: Partial<SystemSettings>) => {
    setLoading(true);
    try {
      const data = await updateSystemSettings(updatedSettings);
      setSettings(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update system settings'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { settings, loading, error, updateSettings };
};