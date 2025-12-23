// src/features/Core/components/AppHeader.tsx
// ✅ FIXED - Properly typed AppHeader with breadcrumbs support

import React, { useState } from 'react'
import { useAuth } from '../../Auth/hooks/useAuth'
import { useNavigate } from 'react-router-dom'

// ✅ PROPER TYPE EXPORT
export interface BreadcrumbItem {
  label: string
  href: string
}

export interface AppHeaderProps {
  breadcrumbs?: BreadcrumbItem[]
}

/**
 * AppHeader Component - FULLY FIXED
 * 
 * ✅ Properly typed with React.FC<AppHeaderProps>
 * ✅ Accepts breadcrumbs prop
 * ✅ Matches User type (email, roles[])
 * ✅ No TypeScript errors
 */
const AppHeader: React.FC<AppHeaderProps> = ({ breadcrumbs = [] }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notifications] = useState(3)

  // ✅ HELPER: Extract username from email
  const getUserDisplayName = () => {
    if (!user?.email) return 'User'
    const nameFromEmail = user.email.split('@')[0]
    return nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1)
  }

  // ✅ HELPER: Get user role from roles array
  const getUserRole = () => {
    if (!user?.roles || user.roles.length === 0) return 'User'
    const roleString = user.roles[0]
    return roleString
      .replace(/_/g, ' ')
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery)
      setSearchQuery('')
    }
  }

  return (
    <header
      style={{
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        zIndex: 40,
        position: 'relative'
      }}
    >
      {/* LEFT SIDE - SEARCH & BREADCRUMBS */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '24px' }}>
        {/* BREADCRUMBS */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={`${crumb.href}-${index}`}>
                <button
                  onClick={() => navigate(crumb.href)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: index === breadcrumbs.length - 1 ? '#6b7280' : '#0891b2',
                    cursor: index === breadcrumbs.length - 1 ? 'default' : 'pointer',
                    fontSize: '13px',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    transition: 'all 0.2s',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (index !== breadcrumbs.length - 1) {
                      e.currentTarget.style.background = '#f0f9ff'
                      e.currentTarget.style.color = '#0369a1'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (index !== breadcrumbs.length - 1) {
                      e.currentTarget.style.background = 'none'
                      e.currentTarget.style.color = '#0891b2'
                    }
                  }}
                  disabled={index === breadcrumbs.length - 1}
                  aria-current={index === breadcrumbs.length - 1 ? 'page' : undefined}
                >
                  {crumb.label}
                </button>
                {index < breadcrumbs.length - 1 && (
                  <span style={{ color: '#d1d5db', fontSize: '12px' }}>/</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* SEARCH */}
        <form
          onSubmit={handleSearch}
          style={{
            display: 'flex',
            flex: breadcrumbs && breadcrumbs.length > 0 ? 0 : 1,
            minWidth: '0'
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: breadcrumbs && breadcrumbs.length > 0 ? '250px' : '400px'
            }}
          >
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 32px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '13px',
                background: '#f9fafb',
                color: '#111827',
                transition: 'all 0.2s',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.currentTarget.style.background = 'white'
                e.currentTarget.style.borderColor = '#0891b2'
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(8, 145, 178, 0.1)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.background = '#f9fafb'
                e.currentTarget.style.borderColor = '#d1d5db'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
            <span
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
                fontSize: '14px'
              }}
            >
              🔍
            </span>
          </div>
        </form>
      </div>

      {/* RIGHT SIDE - NOTIFICATIONS, USER MENU */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* NOTIFICATION BELL */}
        <button
          style={{
            position: 'relative',
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            color: '#9ca3af'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#0891b2')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#9ca3af')}
          title="Notifications"
          aria-label="Notifications"
        >
          🔔
          {notifications > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                background: '#dc2626',
                color: 'white',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: '700'
              }}
            >
              {notifications}
            </span>
          )}
        </button>

        {/* DIVIDER */}
        <div
          style={{
            width: '1px',
            height: '24px',
            background: '#e5e7eb'
          }}
        ></div>

        {/* USER MENU */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              padding: '5px 10px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f3f4f6'
              e.currentTarget.style.borderColor = '#d1d5db'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f9fafb'
              e.currentTarget.style.borderColor = '#e5e7eb'
            }}
            aria-label="User menu"
            aria-expanded={isUserMenuOpen}
          >
            {/* USER AVATAR */}
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #14b8a6 0%, #fbbf24 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '12px',
                flexShrink: 0
              }}
            >
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>

            {/* USER NAME & ROLE */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: '0' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#111827', whiteSpace: 'nowrap' }}>
                {getUserDisplayName()}
              </span>
              <span style={{ fontSize: '10px', color: '#9ca3af', whiteSpace: 'nowrap' }}>
                {getUserRole()}
              </span>
            </div>

            {/* DROPDOWN ARROW */}
            <span
              style={{
                fontSize: '10px',
                color: '#9ca3af',
                transition: 'transform 0.2s',
                transform: isUserMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                flexShrink: 0
              }}
            >
              ▼
            </span>
          </button>

          {/* USER DROPDOWN MENU */}
          {isUserMenuOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '6px',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                minWidth: '180px',
                zIndex: 1000,
                animation: 'slideDown 0.2s ease-out'
              }}
            >
              {/* USER INFO */}
              <div style={{ padding: '10px 12px', borderBottom: '1px solid #e5e7eb' }}>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: '600', color: '#111827' }}>
                  {getUserDisplayName()}
                </p>
                <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#6b7280', wordBreak: 'break-all' }}>
                  {user?.email}
                </p>
                <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: '#9ca3af' }}>
                  {getUserRole()}
                </p>
              </div>

              {/* MENU ITEMS */}
              <button
                onClick={() => {
                  navigate('/settings')
                  setIsUserMenuOpen(false)
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 12px',
                  background: 'none',
                  border: 'none',
                  fontSize: '12px',
                  color: '#374151',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f9fafb'
                  e.currentTarget.style.color = '#111827'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none'
                  e.currentTarget.style.color = '#374151'
                }}
              >
                <span style={{ fontSize: '14px' }}>⚙️</span>
                Settings
              </button>

              <button
                onClick={() => {
                  navigate('/profile')
                  setIsUserMenuOpen(false)
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 12px',
                  background: 'none',
                  border: 'none',
                  fontSize: '12px',
                  color: '#374151',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f9fafb'
                  e.currentTarget.style.color = '#111827'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none'
                  e.currentTarget.style.color = '#374151'
                }}
              >
                <span style={{ fontSize: '14px' }}>👤</span>
                Profile
              </button>

              {/* DIVIDER */}
              <div style={{ height: '1px', background: '#e5e7eb', margin: '6px 0' }}></div>

              {/* LOGOUT */}
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 12px',
                  background: 'none',
                  border: 'none',
                  fontSize: '12px',
                  color: '#dc2626',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#fee2e2'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none'
                }}
              >
                <span style={{ fontSize: '14px' }}>🚪</span>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  )
}

export default AppHeader