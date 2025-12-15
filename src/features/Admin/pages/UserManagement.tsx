// src/pages/users/UserManagement.tsx
import React, { useState, useEffect } from 'react';
import {
  Users, Search, Plus, Edit, Trash, UserPlus,
  UserX, Lock, Mail, UserCheck
} from 'lucide-react';
import { Button } from '@/features/UI/components/ui/button';
import { Input } from '@/features/UI/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/features/UI/components/ui/select';
import { Card, CardContent } from '@/features/UI/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/features/UI/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/features/UI/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/features/UI/components/ui/dropdown-menu';
import { Checkbox } from '@/features/UI/components/ui/checkbox';
import { Label } from '@/features/UI/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/features/UI/components/ui/avatar';
import { Badge } from '@/features/UI/components/ui/badge';
import { Switch } from '@/features/UI/components/ui/switch';
import { Textarea } from '@/features/UI/components/ui/textarea';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'dispatcher' | 'driver' | 'accountant' | 'client';
  status: 'active' | 'inactive' | 'pending';
  lastActive?: string;
  createdAt: string;
  department?: string;
  permissions: string[];
  phoneNumber?: string;
  profileImage?: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  defaultPermissions: string[];
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

// Mock data - Users
const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'John Smith',
    email: 'john.smith@cargotrackpro.com',
    role: 'admin',
    status: 'active',
    lastActive: '2025-02-18T14:32:10Z',
    createdAt: '2024-10-05T09:15:22Z',
    department: 'Management',
    permissions: ['all'],
    phoneNumber: '+1 (555) 123-4567',
    profileImage: '/avatars/john.png'
  },
  {
    id: 'u2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@cargotrackpro.com',
    role: 'manager',
    status: 'active',
    lastActive: '2025-02-18T10:45:32Z',
    createdAt: '2024-11-12T11:22:45Z',
    department: 'Operations',
    permissions: ['users.view', 'users.edit', 'waybills.view', 'waybills.create', 'waybills.edit', 'trucks.view', 'trucks.edit', 'dashboard.view'],
    phoneNumber: '+1 (555) 234-5678',
    profileImage: '/avatars/sarah.png'
  },
  {
    id: 'u3',
    name: 'Michael Brown',
    email: 'michael.brown@cargotrackpro.com',
    role: 'dispatcher',
    status: 'active',
    lastActive: '2025-02-18T08:12:05Z',
    createdAt: '2024-12-03T13:45:10Z',
    department: 'Operations',
    permissions: ['waybills.view', 'waybills.create', 'waybills.edit', 'trucks.view', 'dashboard.view'],
    phoneNumber: '+1 (555) 345-6789'
  },
  {
    id: 'u4',
    name: 'Jennifer Wilson',
    email: 'jennifer.wilson@cargotrackpro.com',
    role: 'accountant',
    status: 'active',
    lastActive: '2025-02-17T16:22:47Z',
    createdAt: '2025-01-15T09:30:25Z',
    department: 'Finance',
    permissions: ['invoices.view', 'invoices.create', 'invoices.edit', 'dashboard.view', 'reports.view'],
    phoneNumber: '+1 (555) 456-7890'
  },
  {
    id: 'u5',
    name: 'Robert Davis',
    email: 'robert.davis@cargotrackpro.com',
    role: 'driver',
    status: 'active',
    lastActive: '2025-02-16T20:15:33Z',
    createdAt: '2025-01-20T08:15:40Z',
    department: 'Transport',
    permissions: ['waybills.view', 'waybills.update'],
    phoneNumber: '+1 (555) 567-8901'
  },
  {
    id: 'u6',
    name: 'Lisa Martinez',
    email: 'lisa.martinez@acmelogistics.com',
    role: 'client',
    status: 'active',
    lastActive: '2025-02-18T11:05:22Z',
    createdAt: '2025-01-25T14:20:15Z',
    permissions: ['waybills.view', 'invoices.view'],
    phoneNumber: '+1 (555) 678-9012'
  },
  {
    id: 'u7',
    name: 'David Anderson',
    email: 'david.anderson@cargotrackpro.com',
    role: 'manager',
    status: 'inactive',
    lastActive: '2025-01-05T16:45:12Z',
    createdAt: '2024-10-22T10:12:30Z',
    department: 'Maintenance',
    permissions: ['maintenance.view', 'maintenance.create', 'maintenance.edit', 'trucks.view', 'dashboard.view'],
    phoneNumber: '+1 (555) 789-0123'
  },
  {
    id: 'u8',
    name: 'Amanda Taylor',
    email: 'amanda.taylor@cargotrackpro.com',
    role: 'dispatcher',
    status: 'pending',
    createdAt: '2025-02-15T08:30:45Z',
    department: 'Operations',
    permissions: ['waybills.view', 'waybills.create', 'trucks.view', 'dashboard.view'],
    phoneNumber: '+1 (555) 890-1234'
  }
];

// Mock data - Roles
const mockRoles: Role[] = [
  {
    id: 'r1',
    name: 'Administrator',
    description: 'Full system access with all permissions',
    defaultPermissions: ['all']
  },
  {
    id: 'r2',
    name: 'Manager',
    description: 'Departmental management with restricted administrative access',
    defaultPermissions: ['users.view', 'users.edit', 'waybills.view', 'waybills.create', 'waybills.edit', 'trucks.view', 'trucks.edit', 'dashboard.view', 'reports.view']
  },
  {
    id: 'r3',
    name: 'Dispatcher',
    description: 'Manages cargo movement and truck dispatching',
    defaultPermissions: ['waybills.view', 'waybills.create', 'waybills.edit', 'trucks.view', 'dashboard.view']
  },
  {
    id: 'r4',
    name: 'Driver',
    description: 'Truck drivers with limited access to waybills and updates',
    defaultPermissions: ['waybills.view', 'waybills.update']
  },
  {
    id: 'r5',
    name: 'Accountant',
    description: 'Financial management including invoicing and payments',
    defaultPermissions: ['invoices.view', 'invoices.create', 'invoices.edit', 'dashboard.view', 'reports.view']
  },
  {
    id: 'r6',
    name: 'Client',
    description: 'External client access to shipment tracking and invoices',
    defaultPermissions: ['waybills.view', 'invoices.view']
  }
];

// Mock data - Permissions
const mockPermissions: Permission[] = [
  // Dashboard permissions
  { id: 'p1', name: 'dashboard.view', description: 'View dashboard', category: 'Dashboard' },

  // User management permissions
  { id: 'p2', name: 'users.view', description: 'View users', category: 'User Management' },
  { id: 'p3', name: 'users.create', description: 'Create users', category: 'User Management' },
  { id: 'p4', name: 'users.edit', description: 'Edit users', category: 'User Management' },
  { id: 'p5', name: 'users.delete', description: 'Delete users', category: 'User Management' },

  // Waybill permissions
  { id: 'p6', name: 'waybills.view', description: 'View waybills', category: 'Waybills' },
  { id: 'p7', name: 'waybills.create', description: 'Create waybills', category: 'Waybills' },
  { id: 'p8', name: 'waybills.edit', description: 'Edit waybills', category: 'Waybills' },
  { id: 'p9', name: 'waybills.delete', description: 'Delete waybills', category: 'Waybills' },
  { id: 'p10', name: 'waybills.update', description: 'Update waybill status', category: 'Waybills' },

  // Truck permissions
  { id: 'p11', name: 'trucks.view', description: 'View trucks', category: 'Trucks' },
  { id: 'p12', name: 'trucks.create', description: 'Create trucks', category: 'Trucks' },
  { id: 'p13', name: 'trucks.edit', description: 'Edit trucks', category: 'Trucks' },
  { id: 'p14', name: 'trucks.delete', description: 'Delete trucks', category: 'Trucks' },

  // Maintenance permissions
  { id: 'p15', name: 'maintenance.view', description: 'View maintenance records', category: 'Maintenance' },
  { id: 'p16', name: 'maintenance.create', description: 'Create maintenance records', category: 'Maintenance' },
  { id: 'p17', name: 'maintenance.edit', description: 'Edit maintenance records', category: 'Maintenance' },
  { id: 'p18', name: 'maintenance.delete', description: 'Delete maintenance records', category: 'Maintenance' },

  // Invoice permissions
  { id: 'p19', name: 'invoices.view', description: 'View invoices', category: 'Invoices' },
  { id: 'p20', name: 'invoices.create', description: 'Create invoices', category: 'Invoices' },
  { id: 'p21', name: 'invoices.edit', description: 'Edit invoices', category: 'Invoices' },
  { id: 'p22', name: 'invoices.delete', description: 'Delete invoices', category: 'Invoices' },

  // Report permissions
  { id: 'p23', name: 'reports.view', description: 'View reports', category: 'Reports' },
  { id: 'p24', name: 'reports.create', description: 'Create reports', category: 'Reports' },
  { id: 'p25', name: 'reports.export', description: 'Export reports', category: 'Reports' },

  // Settings permissions
  { id: 'p26', name: 'settings.view', description: 'View settings', category: 'Settings' },
  { id: 'p27', name: 'settings.edit', description: 'Edit settings', category: 'Settings' }
];

const UserManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);

  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // New user form state
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'dispatcher',
    status: 'active',
    permissions: [],
    department: ''
  });

  // New role form state
  const [newRole, setNewRole] = useState<Partial<Role>>({
    name: '',
    description: '',
    defaultPermissions: []
  });

  // Load data
  useEffect(() => {
    setIsLoading(true);

    // Simulating API calls
    setTimeout(() => {
      setRoles(mockRoles);
      setPermissions(mockPermissions);

      // Filter and search users
      let filteredUsers = [...mockUsers];

      // Apply role filter
      if (roleFilter !== 'all') {
        filteredUsers = filteredUsers.filter(user => user.role === roleFilter);
      }

      // Apply status filter
      if (statusFilter !== 'all') {
        filteredUsers = filteredUsers.filter(user => user.status === statusFilter);
      }

      // Apply search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredUsers = filteredUsers.filter(user =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          (user.department && user.department.toLowerCase().includes(query))
        );
      }

      setUsers(filteredUsers);
      setIsLoading(false);
    }, 500);
  }, [searchQuery, roleFilter, statusFilter, activeTab]);

  // Get time ago
  const getTimeAgo = (dateString?: string) => {
    if (!dateString) return 'Never';

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Inactive</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Group permissions by category
  const getGroupedPermissions = () => {
    const grouped: Record<string, Permission[]> = {};

    permissions.forEach(permission => {
      if (!grouped[permission.category]) {
        grouped[permission.category] = [];
      }
      grouped[permission.category].push(permission);
    });

    return grouped;
  };

  // Handle creating new user
  const handleCreateUser = () => {
    // In a real app, this would be an API call
    console.log('Creating user:', newUser);

    // Reset form and close dialog
    setNewUser({
      name: '',
      email: '',
      role: 'dispatcher',
      status: 'active',
      permissions: [],
      department: ''
    });
    setIsUserDialogOpen(false);
  };

  // Handle creating new role
  const handleCreateRole = () => {
    // In a real app, this would be an API call
    console.log('Creating role:', newRole);

    // Reset form and close dialog
    setNewRole({
      name: '',
      description: '',
      defaultPermissions: []
    });
    setIsRoleDialogOpen(false);
  };

  // Handle editing user
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setNewUser({ ...user });
    setIsUserDialogOpen(true);
  };

  // Handle editing role
  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setNewRole({ ...role });
    setIsRoleDialogOpen(true);
  };

  // Handle input change for forms
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    formSetter: React.Dispatch<React.SetStateAction<Partial<User> | Partial<Role>>>
  ) => {
    const { name, value } = e.target;
    formSetter((prev: Partial<User> | Partial<Role>) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle permission toggle for user
  const handlePermissionToggle = (permission: string) => {
    setNewUser(prev => {
      if (prev.permissions?.includes(permission)) {
        return {
          ...prev,
          permissions: prev.permissions.filter(p => p !== permission)
        };
      } else {
        return {
          ...prev,
          permissions: [...(prev.permissions || []), permission]
        };
      }
    });
  };

  // Render users tab
  const renderUsersTab = () => {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Filter role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Administrators</SelectItem>
                <SelectItem value="manager">Managers</SelectItem>
                <SelectItem value="dispatcher">Dispatchers</SelectItem>
                <SelectItem value="driver">Drivers</SelectItem>
                <SelectItem value="accountant">Accountants</SelectItem>
                <SelectItem value="client">Clients</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setSelectedUser(null)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>
                    {selectedUser ? `Edit User: ${selectedUser.name}` : 'Create New User'}
                  </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={newUser.name}
                        onChange={(e) => handleInputChange(e, setNewUser)}
                        placeholder="Enter user's full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => handleInputChange(e, setNewUser)}
                        placeholder="Enter email address"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={newUser.phoneNumber || ''}
                        onChange={(e) => handleInputChange(e, setNewUser)}
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        name="department"
                        value={newUser.department || ''}
                        onChange={(e) => handleInputChange(e, setNewUser)}
                        placeholder="Enter department"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select
                          value={newUser.role}
                          onValueChange={(value: User['role']) => setNewUser({ ...newUser, role: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Administrator</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="dispatcher">Dispatcher</SelectItem>
                            <SelectItem value="driver">Driver</SelectItem>
                            <SelectItem value="accountant">Accountant</SelectItem>
                            <SelectItem value="client">Client</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={newUser.status}
                          onValueChange={(value: User['status']) => setNewUser({ ...newUser, status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {!selectedUser && (
                      <div className="space-y-2 pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="sendInvite">Send Welcome Email</Label>
                          <Switch id="sendInvite" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="temporaryPassword">Generate Temporary Password</Label>
                          <Switch id="temporaryPassword" defaultChecked />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Permissions</h3>
                    <div className="border rounded-md p-4 h-96 overflow-y-auto">
                      {Object.entries(getGroupedPermissions()).map(([category, perms]) => (
                        <div key={category} className="mb-4">
                          <h4 className="font-medium text-sm text-gray-500 mb-2">{category.toUpperCase()}</h4>
                          <div className="space-y-2">
                            {perms.map(permission => (
                              <div key={permission.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={permission.id}
                                  checked={!!newUser.permissions?.includes(permission.name) || !!newUser.permissions?.includes('all')}
                                  // Remove: disabled={!!newUser.permissions?.includes('all')}
                                  onCheckedChange={() => {
                                    if (!newUser.permissions?.includes('all')) {
                                      handlePermissionToggle(permission.name);
                                    }
                                  }}
                                />
                                <Label htmlFor={permission.id} className="flex-1 cursor-pointer">
                                  <div className="font-medium">{permission.description}</div>
                                  <div className="text-xs text-gray-500">{permission.name}</div>
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="allPermissions"
                            checked={!!newUser.permissions?.includes('all')}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setNewUser({ ...newUser, permissions: ['all'] });
                              } else {
                                setNewUser({ ...newUser, permissions: [] });
                              }
                            }}
                          />
                          <Label htmlFor="allPermissions" className="font-semibold">
                            Grant All Permissions (Administrator)
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateUser}>
                    {selectedUser ? 'Update User' : 'Create User'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No users found</h3>
                <p className="text-gray-500 max-w-md mx-auto mt-2">
                  {searchQuery || roleFilter !== 'all' || statusFilter !== 'all'
                    ? "No users match your search criteria. Try adjusting your filters."
                    : "There are no users in the system yet. Click 'Add User' to create one."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="py-3 px-4 font-medium">Department</th>
                      <th className="py-3 px-4 font-medium">Status</th>
                      <th className="py-3 px-4 font-medium">Last Active</th>
                      <th className="py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <Avatar className="h-9 w-9 mr-3">
                              <AvatarImage src={user.profileImage} alt={user.name} />
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                {getInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 capitalize">
                          {user.role}
                        </td>
                        <td className="py-4 px-4">
                          {user.department || '-'}
                        </td>
                        <td className="py-4 px-4">
                          {getStatusBadge(user.status)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-500">{getTimeAgo(user.lastActive)}</div>
                        </td>
                        <td className="py-4 px-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                  <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              {user.status === 'active' ? (
                                <DropdownMenuItem>
                                  <UserX className="mr-2 h-4 w-4" />
                                  Deactivate
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem>
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Activate
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem>
                                <Lock className="mr-2 h-4 w-4" />
                                Reset Password
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  // Render roles tab
  const renderRolesTab = () => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Role Management</h2>

          <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setSelectedRole(null)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Role
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>
                  {selectedRole ? `Edit Role: ${selectedRole.name}` : 'Create New Role'}
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="roleName">Role Name</Label>
                    <Input
                      id="roleName"
                      name="name"
                      value={newRole.name}
                      onChange={(e) => handleInputChange(e, setNewRole)}
                      placeholder="Enter role name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="roleDescription">Description</Label>
                    <Textarea
                      id="roleDescription"
                      name="description"
                      value={newRole.description}
                      onChange={(e) => handleInputChange(e, setNewRole)}
                      placeholder="Enter role description"
                      rows={4}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Default Permissions</h3>
                  <div className="border rounded-md p-4 h-96 overflow-y-auto">
                    {Object.entries(getGroupedPermissions()).map(([category, perms]) => (
                      <div key={category} className="mb-4">
                        <h4 className="font-medium text-sm text-gray-500 mb-2">{category.toUpperCase()}</h4>
                        <div className="space-y-2">
                          {perms.map(permission => (
                            <div key={permission.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={permission.id}
                                checked={!!newUser.permissions?.includes(permission.name) || !!newUser.permissions?.includes('all')}
                                // Remove: disabled={!!newUser.permissions?.includes('all')}
                                onCheckedChange={() => {
                                  if (!newUser.permissions?.includes('all')) {
                                    handlePermissionToggle(permission.name);
                                  }
                                }}
                              />
                              <Label htmlFor={`role-${permission.id}`} className="flex-1 cursor-pointer">
                                <div className="font-medium">{permission.description}</div>
                                <div className="text-xs text-gray-500">{permission.name}</div>
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="allPermissions"
                          checked={!!newUser.permissions?.includes('all')}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNewUser({ ...newUser, permissions: ['all'] });
                            } else {
                              setNewUser({ ...newUser, permissions: [] });
                            }
                          }}
                        />
                        <Label htmlFor="allRolePermissions" className="font-semibold">
                          Grant All Permissions (Administrator)
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateRole}>
                  {selectedRole ? 'Update Role' : 'Create Role'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="py-3 px-4 font-medium">Role</th>
                    <th className="py-3 px-4 font-medium">Description</th>
                    <th className="py-3 px-4 font-medium">Users</th>
                    <th className="py-3 px-4 font-medium">Permissions</th>
                    <th className="py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((role) => {
                    const userCount = mockUsers.filter(u => u.role === role.name.toLowerCase()).length;
                    const permissionCount = role.defaultPermissions.includes('all')
                      ? permissions.length
                      : role.defaultPermissions.length;

                    return (
                      <tr key={role.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-4 font-medium">{role.name}</td>
                        <td className="py-4 px-4">{role.description}</td>
                        <td className="py-4 px-4">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {userCount} user{userCount !== 1 ? 's' : ''}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          {role.defaultPermissions.includes('all') ? (
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                              All Permissions
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                              {permissionCount} permission{permissionCount !== 1 ? 's' : ''}
                            </Badge>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                  <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditRole(role)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Users className="mr-2 h-4 w-4" />
                                View Users
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Render permissions tab
  const renderPermissionsTab = () => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">System Permissions</h2>
        </div>

        <Card>
          <CardContent className="p-6">
            {Object.entries(getGroupedPermissions()).map(([category, perms]) => (
              <div key={category} className="mb-8 last:mb-0">
                <h3 className="text-lg font-semibold mb-4">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {perms.map(permission => (
                    <Card key={permission.id} className="border shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{permission.description}</h4>
                            <p className="text-sm text-gray-500">{permission.name}</p>
                          </div>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {category}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold">User Management</h1>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          {renderUsersTab()}
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          {renderRolesTab()}
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          {renderPermissionsTab()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagement;