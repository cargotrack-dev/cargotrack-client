// src/features/Core/components/AppLayout.tsx
// ✅ FIXED: BreadcrumbItem now includes required 'href' property
// AppHeader expects: { label, href } not { label, path }

import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AppSidebar from './AppSidebar'
import AppHeader from './AppHeader'

/**
 * AppLayout Component - FIXED SIDEBAR WITH PROPER BREADCRUMBS
 * 
 * Layout Structure:
 * ┌─────────────────────────────────────────┐
 * │ FIXED SIDEBAR │ HEADER                  │
 * │   (Fixed)     │ (Fixed at top)          │
 * ├───────────────┼──────────────────────┤
 * │   SIDEBAR     │ MAIN CONTENT (Scrollable) │
 * │  (Stays put)  │                          │
 * │               │ • Scrolls independently  │
 * │               │ • Doesn't affect sidebar │
 * │               │                          │
 * │  Admin User   │ (Content area scrolls)  │
 * │  Logout btn   │                          │
 * │  (Always      │                          │
 * │   visible)    │                          │
 * └───────────────┴──────────────────────┘
 * 
 * ✅ Features:
 * • Sidebar: position fixed (280px wide)
 * • Sidebar background: dark blue, maintained during scroll
 * • User section + Logout: always visible
 * • Header: position fixed (spans full width above content)
 * • Main content: scrollable independently
 * • Breadcrumbs: properly typed with href property
 * • No layout shifts when scrolling
 */
const AppLayout: React.FC = () => {
  const location = useLocation()

  /**
   * Generate breadcrumbs from location pathname
   * Returns BreadcrumbItem array with proper 'href' property
   * AppHeader expects: { label: string, href: string }
   */
  const generateBreadcrumbs = () => {
    const pathParts = location.pathname.split('/').filter(Boolean)
    
    // Start with Dashboard
    const breadcrumbs = [
      { label: 'Dashboard', href: '/dashboard' }
    ]
    
    // Add additional breadcrumb items based on path
    if (pathParts.length > 0) {
      pathParts.forEach((part, index) => {
        const label = part.charAt(0).toUpperCase() + part.slice(1)
        const href = '/' + pathParts.slice(0, index + 1).join('/')
        
        // Only add if it's not the first part (Dashboard)
        if (part !== 'dashboard') {
          breadcrumbs.push({ label, href })
        }
      })
    }
    
    return breadcrumbs
  }

  // ═══════════════════════════════════════════════════════════════════════
  // INLINE STYLES
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * LAYOUT STRUCTURE:
   * 
   * Container (full screen height)
   *   ├─ Sidebar (fixed, left side, 280px)
   *   └─ Main Area (flex column, fills rest)
   *       ├─ Header (fixed, top)
   *       └─ Content (scrollable, below header)
   */

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: '#f9fafb'
  }

  // ═ SIDEBAR (FIXED) ═
  const sidebarWrapperStyle: React.CSSProperties = {
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    width: '280px',
    backgroundColor: '#1e3a8a',
    zIndex: 40,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  }

  // ═ MAIN AREA (Takes remaining space) ═
  const mainAreaStyle: React.CSSProperties = {
    marginLeft: '280px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    height: '100vh',
    overflow: 'hidden'
  }

  // ═ HEADER (FIXED at top) ═
  const headerWrapperStyle: React.CSSProperties = {
    position: 'sticky',
    top: 0,
    zIndex: 30,
    backgroundColor: 'white',
    borderBottom: '1px solid #e5e7eb',
    flexShrink: 0
  }

  // ═ CONTENT AREA (SCROLLABLE) ═
  const contentWrapperStyle: React.CSSProperties = {
    flex: 1,
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column'
  }

  const contentStyle: React.CSSProperties = {
    padding: '24px',
    flex: 1
  }

  // ═════════════════════════════════════════════════════════════════════
  // RENDER
  // ═════════════════════════════════════════════════════════════════════

  return (
    <div style={containerStyle}>
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* FIXED SIDEBAR - STAYS VISIBLE WHILE CONTENT SCROLLS */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div style={sidebarWrapperStyle}>
        <AppSidebar />
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MAIN AREA - HEADER + SCROLLABLE CONTENT */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div style={mainAreaStyle}>
        {/* HEADER - Sticky at top of main area */}
        <div style={headerWrapperStyle}>
          <AppHeader breadcrumbs={generateBreadcrumbs()} />
        </div>

        {/* CONTENT - Scrollable below header */}
        <div style={contentWrapperStyle}>
          <div style={contentStyle}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppLayout