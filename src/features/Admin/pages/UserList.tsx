// src/pages/users/UserList.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../../Auth/types/auth';
//import { User } from '../../Auth/types/auth';

// You'll likely have a user type defined in your types
interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  department?: string;
  isActive: boolean;
  lastLogin?: Date;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Move mockUsers into useMemo to avoid recreating it on each render
  const mockUsers = useMemo<User[]>(() => [
    {
      id: 'user-001',
      username: 'johndoe',
      email: 'john.doe@example.com',
      fullName: 'John Doe',
      role: UserRole.ADMIN,
      department: 'Management',
      isActive: true,
      lastLogin: new Date('2023-04-05T10:30:00')
    },
    {
      id: 'user-002',
      username: 'janesmith',
      email: 'jane.smith@example.com',
      fullName: 'Jane Smith',
      role: UserRole.DISPATCHER,
      department: 'Operations',
      isActive: true,
      lastLogin: new Date('2023-04-06T08:45:00')
    },
    {
      id: 'user-003',
      username: 'mikeross',
      email: 'mike.ross@example.com',
      fullName: 'Mike Ross',
      role: UserRole.DRIVER,
      isActive: true,
      lastLogin: new Date('2023-04-06T06:15:00')
    },
    {
      id: 'user-004',
      username: 'sarahpalmer',
      email: 'sarah.palmer@example.com',
      fullName: 'Sarah Palmer',
      role: UserRole.ACCOUNTANT,
      department: 'Finance',
      isActive: false,
      lastLogin: new Date('2023-03-28T14:20:00')
    },
    {
      id: 'user-005',
      username: 'davidmiller',
      email: 'david.miller@example.com',
      fullName: 'David Miller',
      role: UserRole.CLIENT,
      isActive: true,
      lastLogin: new Date('2023-04-04T11:10:00')
    }
  ], []);

  useEffect(() => {
    // Simulate API call
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUsers(mockUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [mockUsers]); // Add mockUsers to the dependency array

  const getRoleBadgeClass = (role: UserRole) => {
    switch(role) {
      case UserRole.SUPER_ADMIN:
      case UserRole.ADMIN:
        return 'bg-purple-100 text-purple-800';
      case UserRole.MANAGER:
        return 'bg-blue-100 text-blue-800';
      case UserRole.DISPATCHER:
        return 'bg-green-100 text-green-800';
      case UserRole.DRIVER:
        return 'bg-yellow-100 text-yellow-800';
      case UserRole.ACCOUNTANT:
        return 'bg-indigo-100 text-indigo-800';
      case UserRole.CLIENT:
        return 'bg-orange-100 text-orange-800';
      case UserRole.MAINTENANCE:
        return 'bg-gray-100 text-gray-800';
      case UserRole.ANALYST:
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'Never';
    
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCreateUser = () => {
    navigate('/users/new');
  };

  const handleViewUser = (id: string) => {
    navigate(`/users/${id}`);
  };

  const handleDeleteUser = (id: string) => {
    // Add delete confirmation dialog and API call
    if (window.confirm('Are you sure you want to delete this user?')) {
      // In a real app, this would be an API call
      const updatedUsers = users.filter(user => user.id !== id);
      setUsers(updatedUsers);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleCreateUser}
        >
          Add User
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr 
                  key={user.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleViewUser(user.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="font-medium text-gray-600">
                            {user.fullName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.department || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(user.lastLogin)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      className="text-blue-600 hover:text-blue-900 mr-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewUser(user.id);
                      }}
                    >
                      View
                    </button>
                    <button 
                      className="text-blue-600 hover:text-blue-900 mr-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/users/${user.id}/edit`);
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteUser(user.id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserList;