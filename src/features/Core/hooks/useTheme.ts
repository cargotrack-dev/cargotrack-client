// 📁 src/features/Core/hooks/useTheme.ts
import { useEffect } from 'react';
import { useThemeStore } from '../store/themeStore';

/**
 * useTheme Hook
 * 
 * Custom hook for accessing and managing theme state
 * 
 * Usage:
 * const { isDarkMode, toggleTheme } = useTheme();
 */
export const useTheme = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const setTheme = useThemeStore((state) => state.setTheme);

  return {
    isDarkMode,
    toggleTheme,
    setTheme,
  };
};

/**
 * useThemeInit Hook
 * 
 * Initialize theme on app mount
 * Call this once in your main App component
 * 
 * Usage:
 * useEffect(() => {
 *   useThemeInit();
 * }, []);
 */
export const useThemeInit = () => {
  const initializeTheme = useThemeStore((state) => state.initializeTheme);

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);
};

export default useTheme;