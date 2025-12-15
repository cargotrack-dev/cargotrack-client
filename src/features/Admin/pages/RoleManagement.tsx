// src/features/Admin/pages/RoleManagement.tsx
import React, { useState, useEffect } from 'react';
// UI Component imports
import { Button } from '@/features/UI/components/ui/button';
import { Input } from '@/features/UI/components/ui/input';
import { Card } from '@/features/UI/components/ui/card';
import { Table } from '@/features/UI/components/ui/table';
import { Checkbox } from '@/features/UI/components/ui/checkbox';
import { Dialog } from '@/features/UI/components/ui/dialog';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}

// Remove the problematic toast imports and implement a simple notification
// We'll create a basic notification system until we can figure out the correct toast implementation
const Notification = ({ message, type }: { message: string, type: 'success' | 'error' }) => (
  <div className={`fixed top-4 right-4 p-4 rounded-md shadow-md ${type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
    {message}
  </div>
);

const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // Replace toast with our own notification state
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Show notification helper function
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    // Auto-hide after 3 seconds
    setTimeout(() => setNotification(null), 3000);
  };

  // Mock data loading - replace with actual API calls
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Replace with actual API calls
        // const rolesResponse = await api.get('/admin/roles');
        // const permissionsResponse = await api.get('/admin/permissions');

        // Mock data for demonstration
        const mockRoles: Role[] = [
          {
            id: '1',
            name: 'Admin',
            description: 'Full system access',
            permissions: ['1', '2', '3', '4', '5'],
            createdAt: '2025-01-15T09:30:00',
            updatedAt: '2025-01-15T09:30:00'
          },
          {
            id: '2',
            name: 'Manager',
            description: 'Management access to shipments and reports',
            permissions: ['1', '2', '5'],
            createdAt: '2025-01-15T09:35:00',
            updatedAt: '2025-01-15T09:35:00'
          },
          {
            id: '3',
            name: 'Driver',
            description: 'Access to assigned shipments only',
            permissions: ['1'],
            createdAt: '2025-01-15T09:40:00',
            updatedAt: '2025-01-15T09:40:00'
          }
        ];

        const mockPermissions: Permission[] = [
          { id: '1', name: 'View Shipments', description: 'View shipment details', resource: 'shipments', action: 'read' },
          { id: '2', name: 'Manage Shipments', description: 'Create and update shipments', resource: 'shipments', action: 'write' },
          { id: '3', name: 'Manage Users', description: 'Create and update users', resource: 'users', action: 'write' },
          { id: '4', name: 'View Reports', description: 'View system reports', resource: 'reports', action: 'read' },
          { id: '5', name: 'Manage System', description: 'Configure system settings', resource: 'system', action: 'admin' }
        ];

        setRoles(mockRoles);
        setPermissions(mockPermissions);
      } catch (error) {
        console.error('Error fetching roles data:', error);
        showNotification('Failed to fetch roles and permissions data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateRole = () => {
    setSelectedRole(null);
    setIsDialogOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setIsDialogOpen(true);
  };

  const handleDeleteRole = async (roleId: string) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        // Replace with actual API call
        // await api.delete(`/admin/roles/${roleId}`);

        // Update state
        setRoles(prev => prev.filter(role => role.id !== roleId));

        showNotification('Role deleted successfully', 'success');
      } catch (error) {
        console.error('Error deleting role:', error);
        showNotification('Failed to delete role', 'error');
      }
    }
  };

  const handleSaveRole = async (formData: FormData) => {
    try {
      const roleData = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        permissions: permissions
          .filter(p => formData.get(`permission-${p.id}`) === 'on')
          .map(p => p.id)
      };

      if (selectedRole) {
        // Update existing role
        // const response = await api.put(`/admin/roles/${selectedRole.id}`, roleData);

        // Update state
        setRoles(prev =>
          prev.map(role =>
            role.id === selectedRole.id
              ? { ...role, ...roleData, updatedAt: new Date().toISOString() }
              : role
          )
        );

        showNotification('Role updated successfully', 'success');
      } else {
        // Create new role
        // const response = await api.post('/admin/roles', roleData);

        // Simulate response with new ID
        const newRole: Role = {
          id: `new-${Date.now()}`,
          name: roleData.name,
          description: roleData.description,
          permissions: roleData.permissions,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        // Update state
        setRoles(prev => [...prev, newRole]);

        showNotification('Role created successfully', 'success');
      }

      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving role:', error);
      showNotification('Failed to save role', 'error');
    }
  };

  const handleCheckboxChange = (permissionId: string, checked: boolean) => {
    // This is just for the UI state - the actual value will be collected from the form
    console.log(`Permission ${permissionId} is now ${checked ? 'checked' : 'unchecked'}`);
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="p-8 flex justify-center">Loading roles data...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      {notification && <Notification message={notification.message} type={notification.type} />}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Role Management</h1>
        <Button onClick={handleCreateRole}>Create New Role</Button>
      </div>

      <Card className="mb-6">
        <div className="p-4">
          <Input
            placeholder="Search roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>
      </Card>

      <Card>
        <div className="p-4">
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Permissions</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoles.map(role => (
                <tr key={role.id}>
                  <td className="font-medium">{role.name}</td>
                  <td>{role.description}</td>
                  <td>{role.permissions.length} assigned</td>
                  <td>{new Date(role.updatedAt).toLocaleDateString()}</td>
                  <td>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditRole(role)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteRole(role.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>

      {isDialogOpen && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
              <h2 className="text-xl font-bold mb-4">
                {selectedRole ? 'Edit Role' : 'Create New Role'}
              </h2>

              <form action={handleSaveRole}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Role Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      required
                      defaultValue={selectedRole?.name || ''}
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <Input
                      id="description"
                      name="description"
                      defaultValue={selectedRole?.description || ''}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Permissions
                    </label>
                    <div className="border rounded-md p-4 space-y-2 max-h-60 overflow-y-auto">
                      {permissions.map(permission => (
                        <div key={permission.id} className="flex items-start space-x-2">
                          <Checkbox
                            id={`permission-${permission.id}`}
                            checked={selectedRole?.permissions.includes(permission.id) || false}
                            onCheckedChange={(checked) => handleCheckboxChange(permission.id, !!checked)}
                          />
                          <div>
                            <label
                              htmlFor={`permission-${permission.id}`}
                              className="font-medium cursor-pointer"
                            >
                              {permission.name}
                            </label>
                            <p className="text-sm text-gray-500">{permission.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {selectedRole ? 'Update Role' : 'Create Role'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default RoleManagement;