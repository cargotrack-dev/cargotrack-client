// src/features/clients/hooks/useClientPreferences.ts
import { useState, useEffect } from 'react';
import { getClientPreferences, updateClientPreferences } from '../services/clientService';
import { ClientPreferences } from '../types';

export const useClientPreferences = (clientId: string | undefined) => {
  const [preferences, setPreferences] = useState<ClientPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!clientId) {
      setPreferences(null);
      setLoading(false);
      return;
    }

    const fetchPreferences = async () => {
      setLoading(true);
      try {
        const data = await getClientPreferences(clientId);
        setPreferences(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch client preferences'));
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [clientId]);

  const updatePreferences = async (newPreferences: Partial<ClientPreferences>) => {
    if (!clientId) return;
    
    setLoading(true);
    try {
      const updated = await updateClientPreferences(clientId, newPreferences);
      setPreferences(updated);
      setError(null);
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update client preferences'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { preferences, loading, error, updatePreferences };
};