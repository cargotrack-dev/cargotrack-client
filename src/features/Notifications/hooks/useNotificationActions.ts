// src/features/Notifications/hooks/useNotificationActions.ts
import { useState } from 'react';
import { markAsRead } from '../services/notificationService';

export const useNotificationActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markNotificationAsRead = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await markAsRead(id);
      
      return true;
    } catch (err) {
      setError('Failed to mark notification as read');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    markNotificationAsRead,
    clearError: () => setError(null)
  };
};