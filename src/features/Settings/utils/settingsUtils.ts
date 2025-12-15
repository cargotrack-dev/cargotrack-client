// src/features/Settings/utils/settingsUtils.ts
import { UserSettings } from '../types';

/**
 * Apply theme based on user settings
 */
export const applyTheme = (theme: 'light' | 'dark' | 'system') => {
  if (theme === 'system') {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', isDarkMode);
  } else {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }
};

/**
 * Get browser timezone
 */
export const getBrowserTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

/**
 * Get browser language
 */
export const getBrowserLanguage = (): string => {
  return navigator.language;
};

/**
 * Get user default settings
 */
export const getDefaultUserSettings = (): Partial<UserSettings> => {
  return {
    theme: 'system',
    language: getBrowserLanguage(),
    timezone: getBrowserTimezone(),
    dateFormat: 'MM/DD/YYYY',
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    notificationPreferences: {
      shipmentUpdates: true,
      deliveryAlerts: true,
      taskAssignments: true,
      systemAlerts: true,
      marketingMessages: false,
    },
  };
};

/**
 * Format timezone for display
 */
export const formatTimezone = (timezone: string): string => {
  try {
    // Get current date in the timezone
    const date = new Date();
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'long',
    }).format(date);
    
    // Extract timezone name
    const timezoneName = formattedDate.split(',')[1]?.trim() || timezone;
    
    return timezoneName;
  } catch (error) {
    return timezone;
  }
};