// src/features/Settings/index.ts
// Export components
export { ThemeSelector } from './components/ThemeSelector';

// Export pages
export { default as SettingsPage } from './pages/Settings';
export { default as SystemSettingsPage } from './pages/SystemSettings';
export { default as UserProfilePage } from './pages/UserProfile';
export { default as UserSettingsPage } from './pages/UserSettings';

// Export hooks
export { useUserSettings } from './hooks/useUserSettings';
export { useSystemSettings } from './hooks/useSystemSettings';

// Export services
export {
  getUserSettings,
  updateUserSettings,
  getSystemSettings,
  updateSystemSettings,
  getUserProfile,
  updateUserProfile,
  getAvailableThemes
} from './services/settingsService';

// Export types
export type { UserSettings, SystemSettings, AppTheme } from './types';

// Export utils
export {
  applyTheme,
  getBrowserTimezone,
  getBrowserLanguage,
  getDefaultUserSettings,
  formatTimezone
} from './utils/settingsUtils';