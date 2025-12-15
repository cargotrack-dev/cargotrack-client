// src/features/Settings/hooks/useUserSettings.ts
import { useState, useEffect } from 'react';
import { getUserSettings, updateUserSettings } from '../services/settingsService';
import { UserSettings } from '../types';

export const useUserSettings = (userId?: string) => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const data = await getUserSettings(userId);
        setSettings(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch user settings'));
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [userId]);

  const updateSettings = async (updatedSettings: Partial<UserSettings>) => {
    setLoading(true);
    try {
      const data = await updateUserSettings(updatedSettings, userId);
      setSettings(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update user settings'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { settings, loading, error, updateSettings };
};