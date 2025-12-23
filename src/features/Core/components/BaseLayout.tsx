// src/features/Core/components/BaseLayout.tsx
// ✅ SIMPLIFIED - RELIABLE STATE MANAGEMENT FOR SIDEBAR TOGGLE

import React, { ReactNode, useState, useMemo } from 'react';
import { useTheme } from '../hooks/useTheme';

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface BaseLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
  header?: ReactNode;
  showBreadcrumbs?: boolean;
  breadcrumbItems?: BreadcrumbItem[];
}

/**
 * BaseLayout Component - SIMPLIFIED
 * 
 * ✅ Manages sidebar state internally
 * ✅ Passes toggle callback to header
 * ✅ Sidebar opens/closes smoothly
 * ✅ Works reliably
 */
export const BaseLayout: React.FC<BaseLayoutProps> = ({
  children,
  sidebar,
  header,
  showBreadcrumbs = false,
  breadcrumbItems = [],
}) => {
  const { isDarkMode } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Handle toggle - simple and direct
  const handleToggleSidebar = () => {
    console.log('BaseLayout: Toggle called, current state:', sidebarOpen);
    setSidebarOpen(!sidebarOpen);
  };

  // Clone header element and pass props if header exists
  const headerWithProps = useMemo(() => {
    if (!header) return null;
    
    // If header is a React element, clone it with props
    if (React.isValidElement(header)) {
      return React.cloneElement(header as React.ReactElement<any>, {
        onToggleSidebar: handleToggleSidebar,
        sidebarOpen: sidebarOpen
      });
    }
    
    return header;
  }, [header, sidebarOpen]);

  return (
    <div
      className={`flex h-screen bg-white dark:bg-gray-900 ${isDarkMode ? 'dark' : 'light'}`}
    >
      {/* ✅ SIDEBAR - COLLAPSIBLE */}
      {sidebar && (
        <aside
          className={`
            bg-gray-900 dark:bg-gray-950 text-white shadow-lg
            flex flex-col transition-all duration-300 ease-in-out
            ${sidebarOpen ? 'w-64' : 'w-0'}
            overflow-hidden
          `}
          style={{
            transitionProperty: 'width',
            transitionDuration: '300ms',
            transitionTimingFunction: 'ease-in-out'
          }}
        >
          {sidebar}
        </aside>
      )}

      {/* ✅ MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ✅ HEADER SECTION */}
        {headerWithProps && (
          <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
            {headerWithProps}
          </header>
        )}

        {/* ✅ BREADCRUMB SECTION */}
        {showBreadcrumbs && breadcrumbItems.length > 0 && (
          <nav className="px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-sm">
              {breadcrumbItems.map((item, index) => (
                <React.Fragment key={item.href}>
                  {index > 0 && (
                    <span className="text-gray-400 dark:text-gray-600">/</span>
                  )}
                  <a
                    href={item.href}
                    className={`
                      transition-colors duration-200
                      ${index === breadcrumbItems.length - 1
                        ? 'text-gray-900 dark:text-white font-medium cursor-default'
                        : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                      }
                    `}
                  >
                    {item.label}
                  </a>
                </React.Fragment>
              ))}
            </div>
          </nav>
        )}

        {/* ✅ MAIN CONTENT SECTION */}
        <main
          className="
            flex-1 overflow-y-auto
            bg-white dark:bg-gray-900
            p-6 md:p-8
            transition-all duration-300
          "
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default BaseLayout;