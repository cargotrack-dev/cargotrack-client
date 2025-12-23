// src/features/Core/components/AppSidebar.tsx
// ✅ UNIFIED FINAL: Single sidebar for entire app, no duplication!

import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Home,
  BarChart3,
  Package,
  Truck,
  Users,
  MapPin,
  Settings,
  LogOut,
  ChevronDown,
  Briefcase
} from 'lucide-react'

interface AppSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

interface MenuItem {
  href: string
  label: string
  icon: React.ReactNode
  badge?: number
}

interface MenuSection {
  title: string
  items: MenuItem[]
}

/**
 * AppSidebar Component - UNIFIED VERSION
 * 
 * ✅ Single sidebar used across ENTIRE app
 * ✅ Expandable/collapsible sections
 * ✅ Professional inline styles
 * ✅ Consistent across all pages
 * ✅ No duplication, no conflicts
 */
const AppSidebar: React.FC<AppSidebarProps> = ({ isOpen = true, onClose }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [expandedSections, setExpandedSections] = useState<string[]>(['overview', 'operations'])

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const isActive = (href: string) => location.pathname === href

  // Menu structure with professional lucide icons
  const menuSections: MenuSection[] = [
    {
      title: 'OVERVIEW',
      items: [
        { href: '/dashboard', label: 'Dashboard', icon: <Home size={16} />, badge: 0 },
        { href: '/analytics', label: 'Analytics', icon: <BarChart3 size={16} />, badge: 0 }
      ]
    },
    {
      title: 'OPERATIONS',
      items: [
        { href: '/shipments', label: 'Shipments', icon: <Package size={16} />, badge: 5 },
        { href: '/trucks', label: 'Trucks', icon: <Truck size={16} />, badge: 2 },
        { href: '/drivers', label: 'Drivers', icon: <Users size={16} />, badge: 0 },
        { href: '/tracking', label: 'Real-Time Tracking', icon: <MapPin size={16} />, badge: 0 }
      ]
    },
    {
      title: 'MANAGEMENT',
      items: [
        { href: '/clients', label: 'Clients', icon: <Briefcase size={16} />, badge: 0 },
        { href: '/invoices', label: 'Invoices', icon: <Package size={16} />, badge: 3 },
        { href: '/maintenance', label: 'Maintenance', icon: <Truck size={16} />, badge: 0 },
        { href: '/settings', label: 'Settings', icon: <Settings size={16} />, badge: 0 }
      ]
    }
  ]

  const sidebarStyle: React.CSSProperties = {
    width: '260px',
    background: 'linear-gradient(180deg, #1e3a8a 0%, #0369a1 100%)',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    flexShrink: 0 // ✅ IMPORTANT: Prevents sidebar from shrinking
  }

  return (
    <aside style={sidebarStyle}>
      {/* LOGO SECTION */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '24px',
          flexShrink: 0
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            padding: '8px 12px',
            borderRadius: '8px'
          }}
          onClick={() => navigate('/dashboard')}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.1)'
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'transparent'
          }}
        >
          {/* Logo Icon */}
          <div
            style={{
              width: '36px',
              height: '36px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              flexShrink: 0
            }}
          >
            🚛
          </div>

          {/* Text */}
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: '16px',
                fontWeight: '700',
                color: 'white',
                margin: '0',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              CargoTrack
            </div>
            <div
              style={{
                fontSize: '11px',
                color: 'rgba(255, 255, 255, 0.7)',
                margin: '2px 0 0 0',
                whiteSpace: 'nowrap'
              }}
            >
              Enterprise
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION - Scrollable */}
      <nav
        style={{
          flex: 1,
          overflow: 'auto',
          paddingBottom: '20px',
          paddingRight: '4px'
        }}
      >
        {menuSections.map((section) => (
          <MenuSection
            key={section.title}
            section={section}
            isExpanded={expandedSections.includes(section.title.toLowerCase())}
            onToggle={() => toggleSection(section.title.toLowerCase())}
            isActive={isActive}
            navigate={navigate}
          />
        ))}
      </nav>

      {/* USER FOOTER - Fixed at bottom */}
      <div
        style={{
          padding: '16px 20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          flexShrink: 0
        }}
      >
        {/* User Info Card */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            marginBottom: '12px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.15)'
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.1)'
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              flexShrink: 0
            }}
          >
            👤
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: 'white', margin: 0 }}>
              Admin User
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)', margin: '2px 0 0 0' }}>
              Super Admin
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => navigate('/')}
          style={{
            width: '100%',
            padding: '10px 12px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '6px',
            color: 'white',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
          }}
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </aside>
  )
}

// MENU SECTION COMPONENT
interface MenuSectionProps {
  section: MenuSection
  isExpanded: boolean
  onToggle: () => void
  isActive: (href: string) => boolean
  navigate: (path: string) => void
}

const MenuSection: React.FC<MenuSectionProps> = ({
  section,
  isExpanded,
  onToggle,
  isActive,
  navigate
}) => (
  <div style={{ marginBottom: '8px' }}>
    {/* Section Header */}
    <button
      onClick={onToggle}
      style={{
        width: '100%',
        padding: '12px 20px',
        background: 'none',
        border: 'none',
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '10px',
        fontWeight: '700',
        textAlign: 'left',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.color = 'rgba(255, 255, 255, 0.9)'
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.color = 'rgba(255, 255, 255, 0.6)'
      }}
    >
      <span>{section.title}</span>
      <ChevronDown
        size={14}
        style={{
          transition: 'transform 0.2s',
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
        }}
      />
    </button>

    {/* Menu Items */}
    {isExpanded && (
      <div style={{ paddingBottom: '8px' }}>
        {section.items.map((item) => (
          <button
            key={item.href}
            onClick={() => navigate(item.href)}
            style={{
              width: '100%',
              padding: '10px 20px',
              background: isActive(item.href) ? 'rgba(255, 255, 255, 0.15)' : 'none',
              border: 'none',
              color: isActive(item.href) ? 'white' : 'rgba(255, 255, 255, 0.7)',
              fontSize: '13px',
              fontWeight: isActive(item.href) ? '600' : '500',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.2s',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              if (!isActive(item.href)) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                e.currentTarget.style.color = 'white'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(item.href)) {
                e.currentTarget.style.background = 'none'
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'
              }
            }}
          >
            {/* Icon */}
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {item.icon}
            </span>

            {/* Label */}
            <span style={{ flex: 1 }}>{item.label}</span>

            {/* Badge */}
            {item.badge && item.badge > 0 && (
              <span
                style={{
                  background: '#ef4444',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: '700',
                  flexShrink: 0
                }}
              >
                {item.badge}
              </span>
            )}

            {/* Active Indicator */}
            {isActive(item.href) && (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '3px',
                  height: '24px',
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '0 2px 2px 0'
                }}
              />
            )}
          </button>
        ))}
      </div>
    )}
  </div>
)

export default AppSidebar