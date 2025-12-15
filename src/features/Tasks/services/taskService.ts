// src/features/Tasks/services/taskService.ts
import axios from 'axios';
import { Task, TaskFilters } from '../types/task';

const API_URL = '/api/tasks';

export const getMyTasks = async (): Promise<{ tasks: Task[], count: number }> => {
  const response = await axios.get(`${API_URL}/my-tasks`);
  return response.data.data;
};

export const getAllTasks = async (filters?: TaskFilters): Promise<{ tasks: Task[], count: number }> => {
  const queryParams = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
  }
  
  const response = await axios.get(`${API_URL}?${queryParams}`);
  return response.data.data;
};

export const getTaskById = async (id: string): Promise<Task> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data.data;
};

export const updateTaskStatus = async (id: string, status: string): Promise<Task> => {
  const response = await axios.patch(`${API_URL}/${id}/status`, { status });
  return response.data.data;
};

export const assignTask = async (id: string, assignedTo: string): Promise<Task> => {
  const response = await axios.patch(`${API_URL}/${id}/assign`, { assignedTo });
  return response.data.data;
};