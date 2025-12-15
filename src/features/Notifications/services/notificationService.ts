// src/features/Notifications/services/notificationService.ts
import axios from 'axios';
import { Notification } from '../types/notification';

const API_URL = '/api/notifications';

export const getNotifications = async (): Promise<{ notifications: Notification[], count: number }> => {
  const response = await axios.get(API_URL);
  return response.data.data;
};

export const markAsRead = async (id: string): Promise<Notification> => {
  const response = await axios.patch(`${API_URL}/${id}/read`);
  return response.data.data;
};

export const markAllAsRead = async (): Promise<{ success: boolean }> => {
  const response = await axios.patch(`${API_URL}/mark-all-read`);
  return response.data;
};