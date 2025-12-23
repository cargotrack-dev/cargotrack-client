// 📁 src/features/Core/store/themeStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
  initializeTheme: () => void;
}

/**
 * Theme Store
 * 
 * Zustand store for managing application theme state with:
 * - Dark mode toggle
 * - Persistence to localStorage
 * - System preference detection
 * - DOM manipulation
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: false,

      // Toggle between light and dark mode
      toggleTheme: () =>
        set((state) => {
          const newDarkMode = !state.isDarkMode;
          applyTheme(newDarkMode);
          return { isDarkMode: newDarkMode };
        }),

      // Set theme explicitly
      setTheme: (isDark: boolean) => {
        applyTheme(isDark);
        set({ isDarkMode: isDark });
      },

      // Initialize theme on app load
      initializeTheme: () => {
        // Check localStorage first
        const stored = localStorage.getItem('theme');
        
        if (stored) {
          const isDark = stored === 'dark';
          applyTheme(isDark);
          set({ isDarkMode: isDark });
        } else {
          // Check system preference
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          applyTheme(prefersDark);
          set({ isDarkMode: prefersDark });
        }
      },
    }),
    {
      name: 'theme-store', // Key in localStorage
      partialize: (state) => ({ isDarkMode: state.isDarkMode }), // Only persist isDarkMode
    }
  )
);

/**
 * Apply theme to the DOM
 * Adds or removes 'dark' class from html element
 */
function applyTheme(isDark: boolean) {
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

/**
 * Initialize theme on app startup
 * Call this in App.tsx useEffect on mount
 */
export const initializeTheme = () => {
  useThemeStore.getState().initializeTheme();
};

// Export for easy access
export const toggleTheme = () => useThemeStore.getState().toggleTheme();
export const setTheme = (isDark: boolean) => useThemeStore.getState().setTheme(isDark);