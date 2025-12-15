// src/features/Settings/services/settingsService.ts
import axios from 'axios';
import { UserSettings, SystemSettings } from '../types';

// Create a client
const api = axios.create({
  baseURL: '/api',
});

// User settings
export const getUserSettings = async (userId?: string): Promise<UserSettings> => {
  try {
    const url = userId ? `/users/${userId}/settings` : '/users/me/settings';
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching user settings:', error);
    throw error;
  }
};

export const updateUserSettings = async (settings: Partial<UserSettings>, userId?: string): Promise<UserSettings> => {
  try {
    const url = userId ? `/users/${userId}/settings` : '/users/me/settings';
    const response = await api.patch(url, settings);
    return response.data;
  } catch (error) {
    console.error('Error updating user settings:', error);
    throw error;
  }
};

// System settings
export const getSystemSettings = async (): Promise<SystemSettings> => {
  try {
    const response = await api.get('/admin/system-settings');
    return response.data;
  } catch (error) {
    console.error('Error fetching system settings:', error);
    throw error;
  }
};

export const updateSystemSettings = async (settings: Partial<SystemSettings>): Promise<SystemSettings> => {
  try {
    const response = await api.patch('/admin/system-settings', settings);
    return response.data;
  } catch (error) {
    console.error('Error updating system settings:', error);
    throw error;
  }
};

// User profile
export const getUserProfile = async (userId?: string) => {
  try {
    const url = userId ? `/users/${userId}/profile` : '/users/me/profile';
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (profileData: any, userId?: string) => {
  try {
    const url = userId ? `/users/${userId}/profile` : '/users/me/profile';
    const response = await api.patch(url, profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Theme settings
export const getAvailableThemes = async () => {
  try {
    const response = await api.get('/themes');
    return response.data;
  } catch (error) {
    console.error('Error fetching available themes:', error);
    throw error;
  }
};