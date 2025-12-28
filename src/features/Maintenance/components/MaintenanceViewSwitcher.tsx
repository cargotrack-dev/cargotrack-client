// src/features/Maintenance/components/MaintenanceViewSwitcher.tsx
// 🚀 NAVIGATION HUB - Switch between all maintenance views

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface ViewOption {
  path: string;
  label: string;
  icon: string;
  description: string;
}

const VIEW_OPTIONS: ViewOption[] = [
  {
    path: '/maintenance',
    label: 'Dashboard',
    icon: '📋',
    description: 'Forms & quick actions'
  },
  {
    path: '/maintenance/list',
    label: 'List View',
    icon: '📊',
    description: 'Search & filter records'
  },
  {
    path: '/maintenance/scheduler',
    label: 'Calendar',
    icon: '📅',
    description: 'Monthly planning'
  },
  {
    path: '/maintenance/history',
    label: 'History',
    icon: '📜',
    description: 'Past maintenance'
  }
];

/**
 * MaintenanceViewSwitcher
 * 
 * Navigation component to switch between different maintenance dashboard views
 * 
 * Views:
 * - Dashboard: Forms-based quick entry (existing)
 * - List View: Search & filter with statistics (new)
 * - Calendar: Month planning with calendar grid (new)
 * - History: View past maintenance records (existing)
 * 
 * Usage:
 * <MaintenanceViewSwitcher />
 */

export const MaintenanceViewSwitcher: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
        backgroundColor: 'white',
        padding: '12px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {VIEW_OPTIONS.map((view) => {
        const isActive = location.pathname === view.path;

        return (
          <button
            key={view.path}
            onClick={() => navigate(view.path)}
            title={view.description}
            style={{
              padding: '10px 16px',
              backgroundColor: isActive ? '#3b82f6' : '#f3f4f6',
              color: isActive ? 'white' : '#6b7280',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              boxShadow: isActive ? '0 4px 6px rgba(59, 130, 246, 0.2)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = '#e5e7eb';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }
            }}
          >
            <span style={{ fontSize: '16px' }}>{view.icon}</span>
            <span>{view.label}</span>
          </button>
        );
      })}
    </div>
  );
};

/**
 * ==================== VARIANTS ====================
 */

/**
 * Compact variant - No labels, just icons
 */
export const MaintenanceViewSwitcherCompact: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        padding: '8px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}
    >
      {VIEW_OPTIONS.map((view) => {
        const isActive = location.pathname === view.path;

        return (
          <button
            key={view.path}
            onClick={() => navigate(view.path)}
            title={view.label}
            style={{
              width: '40px',
              height: '40px',
              padding: 0,
              backgroundColor: isActive ? '#3b82f6' : '#f3f4f6',
              color: isActive ? 'white' : '#6b7280',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '18px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = '#e5e7eb';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }
            }}
          >
            {view.icon}
          </button>
        );
      })}
    </div>
  );
};

/**
 * Vertical variant - For sidebar
 */
export const MaintenanceViewSwitcherVertical: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}
    >
      {VIEW_OPTIONS.map((view) => {
        const isActive = location.pathname === view.path;

        return (
          <button
            key={view.path}
            onClick={() => navigate(view.path)}
            title={view.description}
            style={{
              padding: '12px 16px',
              backgroundColor: isActive ? '#3b82f6' : 'transparent',
              color: isActive ? 'white' : '#6b7280',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '14px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <span style={{ fontSize: '16px' }}>{view.icon}</span>
            <span>{view.label}</span>
          </button>
        );
      })}
    </div>
  );
};

/**
 * Dropdown variant - For compact spaces
 */
export const MaintenanceViewSwitcherDropdown: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentView = VIEW_OPTIONS.find(v => v.path === location.pathname);

  return (
    <select
      value={currentView?.path || '/maintenance'}
      onChange={(e) => navigate(e.target.value)}
      style={{
        padding: '8px 12px',
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '14px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#111827'
      }}
    >
      {VIEW_OPTIONS.map((view) => (
        <option key={view.path} value={view.path}>
          {view.icon} {view.label}
        </option>
      ))}
    </select>
  );
};

export default MaintenanceViewSwitcher;