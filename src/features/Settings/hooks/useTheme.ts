import { useState, useEffect } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Custom hook for theme management
 * Handles theme switching and persistence
 */
export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(() => {
    // Get from localStorage or use system default
    const savedTheme = localStorage.getItem('theme') as ThemeMode | null;
    
    if (savedTheme) {
      return savedTheme;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  });

  useEffect(() => {
    // Apply theme to body/document when it changes
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
    } else if (currentTheme === 'light') {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
    } else if (currentTheme === 'system') {
      // Check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark-theme');
        document.documentElement.classList.remove('light-theme');
      } else {
        document.documentElement.classList.add('light-theme');
        document.documentElement.classList.remove('dark-theme');
      }
    }
    
    // Store theme preference in localStorage
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme]);

  // Listen for system theme changes if using 'system' setting
  useEffect(() => {
    if (currentTheme !== 'system') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.classList.add('dark-theme');
        document.documentElement.classList.remove('light-theme');
      } else {
        document.documentElement.classList.add('light-theme');
        document.documentElement.classList.remove('dark-theme');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [currentTheme]);

  /**
   * Toggle theme between light, dark, and system
   * @param theme Optional theme to set. If not provided, cycles through themes
   */
  const toggleTheme = (theme?: ThemeMode) => {
    if (theme) {
      setCurrentTheme(theme);
    } else {
      // Cycle through themes: light -> dark -> system -> light
      setCurrentTheme(prevTheme => {
        if (prevTheme === 'light') return 'dark';
        if (prevTheme === 'dark') return 'system';
        return 'light';
      });
    }
  };

  return {
    currentTheme,
    toggleTheme,
    isDarkMode: currentTheme === 'dark' || (currentTheme === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
  };
};

export default useTheme;