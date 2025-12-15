// src/features/Tasks/hooks/useTaskList.ts
import { useState, useEffect } from 'react';
import { Task, TaskFilters } from '../types/task';
import { getMyTasks, getAllTasks } from '../services/taskService';

export const useTaskList = (isManager = false, initialFilters = {}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFilters>(initialFilters);
  const [count, setCount] = useState(0);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = isManager 
        ? await getAllTasks(filters)
        : await getMyTasks();
      
      setTasks(result.tasks);
      setCount(result.count);
    } catch (err) {
      setError('Failed to load tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [isManager, JSON.stringify(filters)]);

  const updateFilters = (newFilters: Partial<TaskFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return { 
    tasks, 
    loading, 
    error, 
    count, 
    filters, 
    updateFilters, 
    refreshTasks: fetchTasks 
  };
};