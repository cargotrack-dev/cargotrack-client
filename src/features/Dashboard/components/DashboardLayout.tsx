// src/features/Dashboard/components/DashboardLayout.tsx
import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Truck,
  FileText,
  BarChart2,
  Package,
  Wrench,
  DollarSign,
  Users,
  Settings,
  Menu,
  X,
  Bell,
  LogOut,
  User as UserIcon,
  Home,
  UserCheck,
  FileBarChart
} from 'lucide-react';
import { useAuth } from '@features/Core/hooks/useAuth';
import { ResourceType, PermissionAction, UserRole } from '@features/Core/types/auth';
import PermissionGate from '@features/Core/auth/PermissionGate';

interface MenuItem {
  name: string;
  href: string;
  icon: React.ElementType;
  permission?: {
    resource: ResourceType;
    action: PermissionAction;
  };
  roles?: UserRole[];
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

const DashboardLayout: React.FC = () => {
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
    const role = roles.find(r => r.id === roleId);
    
    return role ? role.name : 'User';
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  // Define menu groups
  const menuGroups: MenuGroup[] = [
    {
      title: "Overview",
      items: [
        {
          name: "Dashboard",
          href: "/dashboard",
          icon: Home
        },
        {
          name: "Analytics",
          href: "/dashboard/analytics",
          icon: BarChart2
        }
      ]
    },
    {
      title: "Operations",
      items: [
        {
          name: "Shipments",
          href: "/dashboard/shipments",
          icon: Package,
          permission: {
            resource: ResourceType.SHIPMENT,
            action: PermissionAction.READ
          }
        },
        {
          name: "Trucks",
          href: "/dashboard/trucks",
          icon: Truck,
          permission: {
            resource: ResourceType.VEHICLE,
            action: PermissionAction.READ
          }
        },
        {
          name: "Drivers",
          href: "/dashboard/drivers",
          icon: UserCheck,
          permission: {
            resource: ResourceType.DRIVER,
            action: PermissionAction.READ
          }
        },
        {
          name: "Clients",
          href: "/dashboard/clients",
          icon: Users,
          permission: {
            resource: ResourceType.CLIENT,
            action: PermissionAction.READ
          }
        }
      ]
    },
    {
      title: "Management",
      items: [
        {
          name: "Reports",
          href: "/dashboard/reports",
          icon: FileBarChart,
          permission: {
            resource: ResourceType.REPORT,
            action: PermissionAction.READ
          }
        },
        {
          name: "Maintenance",
          href: "/dashboard/maintenance",
          icon: Wrench,
          roles: [UserRole.ADMIN, UserRole.MAINTENANCE]
        },
        {
          name: "Invoices",
          href: "/dashboard/invoices",
          icon: DollarSign,
          roles: [UserRole.ADMIN, UserRole.MAINTENANCE]
        },
        {
          name: "Documents",
          href: "/dashboard/documents",
          icon: FileText,
          roles: [UserRole.ADMIN, UserRole.DISPATCHER]
        }
      ]
    },
    {
      title: "System",
      items: [
        {
          name: "User Management",
          href: "/dashboard/users",
          icon: Users,
          roles: [UserRole.SUPER_ADMIN]
        },
        {
          name: "Configuration",
          href: "/dashboard/configuration",
          icon: Settings,
          roles: [UserRole.SUPER_ADMIN]
        },
        {
          name: "Audit Logs",
          href: "/dashboard/audit",
          icon: FileText,
          roles: [UserRole.SUPER_ADMIN]
        }
      ]
    }
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
          <Link to="/dashboard" className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">CargoTrack</span>
          </Link>
          <button 
            className="p-1 rounded-md md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="px-4 py-6 overflow-y-auto h-[calc(100vh-4rem)]">
          {menuGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-8">
              <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item, itemIndex) => {
                  const isActive = location.pathname === item.href;
                  
                  // If this item requires permissions or roles
                  if (item.permission || item.roles) {
                    return (
                      <PermissionGate 
                        key={`${groupIndex}-${itemIndex}`}
                        permissions={item.permission}
                        roles={item.roles}
                      >
                        <Link
                          to={item.href}
                          className={`
                            flex items-center px-3 py-2 text-sm font-medium rounded-md 
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
                      key={`${groupIndex}-${itemIndex}`}
                      to={item.href}
                      className={`
                        flex items-center px-3 py-2 text-sm font-medium rounded-md 
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
              </div>
            </div>
          ))}
        </div>
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
          
          <div className="flex items-center ml-auto">
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
                    to="/dashboard/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <UserIcon className="w-4 h-4 mr-2 text-gray-500" />
                      Your Profile
                    </div>
                  </Link>
                  <Link
                    to="/dashboard/settings"
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

export default DashboardLayout;