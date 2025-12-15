// src/features/Core/components/Layout.tsx
import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Truck, FileText, BarChart2, Package, Wrench, 
  DollarSign, Users, Settings, Menu, X, Bell, LogOut,
  User
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ResourceType, PermissionAction, Role } from '../types/auth';
import PermissionGate from '../auth/PermissionGate';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 md:static md:z-auto transition-transform duration-300
        `}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">CargoTrack</span>
          </Link>
          <button 
            className="p-1 rounded-md md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="px-2 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            
            // If this item requires permissions
            if (item.permission) {
              return (
                <PermissionGate 
                  key={item.name}
                  permissions={item.permission}
                >
                  <Link
                    to={item.href}
                    className={`
                      flex items-center px-4 py-3 text-sm font-medium rounded-md 
                      ${isActive 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                      }
                    `}
                  >
                    <item.icon className={`
                      mr-3 w-5 h-5 
                      ${isActive ? 'text-blue-600' : 'text-gray-500'}
                    `} />
                    {item.name}
                  </Link>
                </PermissionGate>
              );
            }
            
            // For items without permission requirements
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex items-center px-4 py-3 text-sm font-medium rounded-md 
                  ${isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  }
                `}
              >
                <item.icon className={`
                  mr-3 w-5 h-5 
                  ${isActive ? 'text-blue-600' : 'text-gray-500'}
                `} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="flex items-center justify-between h-16 px-4 bg-white border-b">
          <button 
            className="p-1 rounded-md md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center">
            <button className="p-1 mr-4 rounded-full hover:bg-gray-100">
              <Bell className="w-5 h-5 text-gray-500" />
            </button>
            <div className="relative">
              <button 
                className="flex items-center"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                  {userInitials}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">{userFullName}</span>
              </button>
              
              {/* User dropdown menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                  <div className="border-b px-4 py-2">
                    <p className="text-sm font-medium text-gray-700">{userFullName}</p>
                    <p className="text-xs text-gray-500">{getUserRoleDisplay()}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-500" />
                      Your Profile
                    </div>
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <Settings className="w-4 h-4 mr-2 text-gray-500" />
                      Settings
                    </div>
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setUserMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    <div className="flex items-center">
                      <LogOut className="w-4 h-4 mr-2 text-gray-500" />
                      Sign out
                    </div>
                  </button>
                </div>
              )}
            </div>
            <button 
              className="p-1 ml-4 rounded-full hover:bg-gray-100"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;