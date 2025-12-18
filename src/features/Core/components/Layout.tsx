// src/features/Core/components/Layout.tsx
// Enhanced version: Your excellent auth + permissions + our beautiful styling

import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Truck, FileText, BarChart2, Package, Wrench, 
  DollarSign, Users, Settings, Menu, X, Bell, LogOut,
  User, ChevronDown
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ResourceType, PermissionAction, Role } from '../types/auth';
import PermissionGate from '../auth/PermissionGate';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, roles } = useAuth();
  
  // Prepare user info
  const userFullName = user ? `${user.profile.firstName} ${user.profile.lastName}` : 'User';
  const userInitials = userFullName.split(' ').map(name => name[0]).join('').toUpperCase();
  
  // Get user role display name
  const getUserRoleDisplay = () => {
    if (!user || !user.roles || user.roles.length === 0) return 'User';
    
    const roleId = user.roles[0];
    const role = roles.find((r: Role) => r.id === roleId);
    
    return role ? role.name : 'User';
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/', 
      icon: BarChart2
      // No permission required - accessible to all
    },
    { 
      name: 'Trucks', 
      href: '/trucks', 
      icon: Truck,
      permission: { resource: ResourceType.VEHICLE, action: PermissionAction.READ }
    },
    { 
      name: 'Waybills', 
      href: '/waybills', 
      icon: FileText,
      permission: { resource: ResourceType.DOCUMENT, action: PermissionAction.READ }
    },
    { 
      name: 'Cargo', 
      href: '/cargo', 
      icon: Package,
      permission: { resource: ResourceType.CARGO, action: PermissionAction.READ }
    },
    { 
      name: 'Maintenance', 
      href: '/maintenance', 
      icon: Wrench,
      permission: { resource: ResourceType.MAINTENANCE, action: PermissionAction.READ }
    },
    { 
      name: 'Invoices', 
      href: '/invoices', 
      icon: DollarSign,
      permission: { resource: ResourceType.INVOICE, action: PermissionAction.READ }
    },
    { 
      name: 'Users', 
      href: '/users', 
      icon: Users,
      permission: { resource: ResourceType.USER, action: PermissionAction.READ }
    },
    { 
      name: 'Settings', 
      href: '/settings', 
      icon: Settings,
      permission: { resource: ResourceType.SETTING, action: PermissionAction.READ }
    },
  ];

  return (
    <div className="app-layout">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}
        style={{
          transform: window.innerWidth < 768 ? (sidebarOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)'
        }}
      >
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <Link to="/" className="sidebar-brand">
            <div className="sidebar-logo">
              <Truck size={20} />
            </div>
            <span>CargoTrack</span>
          </Link>
          <button 
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="sidebar-nav">
          {/* Map through navigation items by section */}
          <div className="nav-section">
            <h3 className="nav-section-title">OVERVIEW</h3>
            <div className="nav-items">
              {navigation.slice(0, 1).map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="nav-section">
            <h3 className="nav-section-title">OPERATIONS</h3>
            <div className="nav-items">
              {navigation.slice(1, 5).map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                
                if (item.permission) {
                  return (
                    <PermissionGate 
                      key={item.name}
                      permissions={item.permission}
                    >
                      <Link
                        to={item.href}
                        className={`nav-item ${isActive ? 'active' : ''}`}
                      >
                        <Icon size={18} />
                        <span>{item.name}</span>
                      </Link>
                    </PermissionGate>
                  );
                }
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="nav-section">
            <h3 className="nav-section-title">MANAGEMENT</h3>
            <div className="nav-items">
              {navigation.slice(5, 7).map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                
                if (item.permission) {
                  return (
                    <PermissionGate 
                      key={item.name}
                      permissions={item.permission}
                    >
                      <Link
                        to={item.href}
                        className={`nav-item ${isActive ? 'active' : ''}`}
                      >
                        <Icon size={18} />
                        <span>{item.name}</span>
                      </Link>
                    </PermissionGate>
                  );
                }
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="nav-section">
            <h3 className="nav-section-title">SYSTEM</h3>
            <div className="nav-items">
              {navigation.slice(7).map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                
                if (item.permission) {
                  return (
                    <PermissionGate 
                      key={item.name}
                      permissions={item.permission}
                    >
                      <Link
                        to={item.href}
                        className={`nav-item ${isActive ? 'active' : ''}`}
                      >
                        <Icon size={18} />
                        <span>{item.name}</span>
                      </Link>
                    </PermissionGate>
                  );
                }
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Sidebar Footer - User Profile */}
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="profile-avatar">
              {userInitials}
            </div>
            <div className="profile-info">
              <p className="profile-name">{userFullName}</p>
              <p className="profile-role">{getUserRoleDisplay()}</p>
            </div>
          </div>
          <button 
            className="logout-button"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="top-bar-left">
            <button 
              className="menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={24} />
            </button>
            <div className="search-wrapper">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search..."
                className="search-box"
              />
            </div>
          </div>

          <div className="top-bar-right">
            <button className="notification-button">
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </button>
            <div className="user-menu">
              <button
                className="user-menu-trigger"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="user-avatar">
                  {userInitials}
                </div>
                <span className="user-name">{userFullName}</span>
                <ChevronDown size={16} />
              </button>

              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <div className="user-dropdown-menu">
                  <div className="user-dropdown-header">
                    <p className="user-dropdown-name">{userFullName}</p>
                    <p className="user-dropdown-role">{getUserRoleDisplay()}</p>
                  </div>
                  
                  <Link
                    to="/profile"
                    className="user-dropdown-item"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <User size={16} />
                    <span>Your Profile</span>
                  </Link>
                  
                  <Link
                    to="/settings"
                    className="user-dropdown-item"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Settings size={16} />
                    <span>Settings</span>
                  </Link>
                  
                  <button
                    className="user-dropdown-item user-dropdown-item-logout"
                    onClick={() => {
                      setUserMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    <LogOut size={16} />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;