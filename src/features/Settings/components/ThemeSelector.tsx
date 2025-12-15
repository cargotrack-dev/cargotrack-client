// src/features/Settings/components/ThemeSelector.tsx
import React from 'react';

interface ThemeSelectorProps {
  value: 'light' | 'dark' | 'system';
  onChange: (theme: 'light' | 'dark' | 'system') => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Appearance</h3>
      <div className="flex space-x-4">
        <label className="flex flex-col items-center space-y-2 cursor-pointer">
          <input
            type="radio"
            name="theme"
            value="light"
            checked={value === 'light'}
            onChange={() => onChange('light')}
            className="sr-only"
          />
          <div className={`p-2 rounded-md ${value === 'light' ? 'bg-blue-100 ring-2 ring-blue-500' : 'bg-gray-100'}`}>
            {/* Light theme icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" fill="#F59E0B" />
              <path d="M12 1V3M12 21V23M1 12H3M21 12H23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M18.36 5.64L19.78 4.22M4.22 19.78L5.64 18.36" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-sm">Light</span>
        </label>

        <label className="flex flex-col items-center space-y-2 cursor-pointer">
          <input
            type="radio"
            name="theme"
            value="dark"
            checked={value === 'dark'}
            onChange={() => onChange('dark')}
            className="sr-only"
          />
          <div className={`p-2 rounded-md ${value === 'dark' ? 'bg-blue-100 ring-2 ring-blue-500' : 'bg-gray-100'}`}>
            {/* Dark theme icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" fill="#6B7280" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-sm">Dark</span>
        </label>

        <label className="flex flex-col items-center space-y-2 cursor-pointer">
          <input
            type="radio"
            name="theme"
            value="system"
            checked={value === 'system'}
            onChange={() => onChange('system')}
            className="sr-only"
          />
          <div className={`p-2 rounded-md ${value === 'system' ? 'bg-blue-100 ring-2 ring-blue-500' : 'bg-gray-100'}`}>
            {/* System theme icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="3" width="20" height="14" rx="2" stroke="#4B5563" strokeWidth="2" />
              <path d="M8 21H16" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 17V21" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-sm">System</span>
        </label>
      </div>
    </div>
  );
};