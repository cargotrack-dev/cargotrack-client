// src/features/Tasks/hooks/useTaskActions.ts
import { useState } from 'react';
import { updateTaskStatus, assignTask } from '../services/taskService';

export const useTaskActions = (taskId: string, onSuccess?: () => void) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = async (status: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await updateTaskStatus(taskId, status);
      
      if (onSuccess) {
        onSuccess();
      }
      
      return true;
    } catch (err) {
      setError('Failed to update task status');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const assignToUser = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await assignTask(taskId, userId);
      
      if (onSuccess) {
        onSuccess();
      }
      
      return true;
    } catch (err) {
      setError('Failed to assign task');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    updateStatus,
    assignToUser,
    clearError: () => setError(null)
  };
};