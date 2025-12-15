// src/features/Core/contexts/AuthContextInstance.tsx
import React, { useState, useEffect } from 'react';
import { 
  User, 
  UserProfile, 
  RegisterUserData,
  Role,
  Permission
} from '../types/auth';
import { api } from '../services/api';
import { AuthContext } from './AuthContext';

// Mock roles for initial implementation
const defaultRoles: Role[] = [
  {
    id: 'admin',
    name: 'Administrator',
    permissions: ['user:*', 'vehicle:*', 'document:*', 'cargo:*', 'maintenance:*', 'invoice:*', 'setting:*']
  },
  {
    id: 'manager',
    name: 'Manager',
    permissions: ['user:read', 'vehicle:*', 'document:*', 'cargo:*', 'maintenance:*', 'invoice:*', 'setting:read']
  },
  {
    id: 'operator',
    name: 'Operator',
    permissions: ['vehicle:read', 'document:read', 'cargo:read', 'maintenance:read', 'invoice:read']
  }
];

// Create the provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [roles] = useState<Role[]>(defaultRoles);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setIsLoading(false);
          return;
        }

        // Verify token and get user data
        const response = await api.get('/auth/me');
        setUser(response.data);
      } catch (err) {
        console.error('Auth check failed:', err);
        localStorage.removeItem('authToken');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      // Save token to local storage
      localStorage.setItem('authToken', token);
      
      // Update state
      setUser(user);
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? 
        err.message : 
        'Login failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Clear local storage and state
    localStorage.removeItem('authToken');
    setUser(null);
  };

  // Register function
  const register = async (userData: RegisterUserData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      
      // Save token and update state
      localStorage.setItem('authToken', token);
      setUser(user);
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? 
        err.message : 
        'Registration failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.post('/auth/reset-password', { email });
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? 
        err.message : 
        'Password reset failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh token function
  const refreshToken = async () => {
    try {
      const response = await api.post('/auth/refresh-token');
      const { token } = response.data;
      localStorage.setItem('authToken', token);
    } catch (err) {
      console.error('Token refresh failed:', err);
      logout();
    }
  };

  // Update profile function
  const updateProfile = async (data: Partial<UserProfile>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.put('/auth/profile', data);
      setUser((prevUser: User | null) => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          profile: {
            ...prevUser.profile,
            ...response.data
          }
        };
      });
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? 
        err.message : 
        'Profile update failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user has a specific permission
  const hasPermission = (permission: Permission | string) => {
    if (!user || !user.roles || user.roles.length === 0) return false;

    // Get the first role for simplicity (can be expanded to check all roles)
    const roleId = user.roles[0];
    const role = roles.find(r => r.id === roleId);
    
    if (!role) return false;

    // Handle string permission format (legacy)
    if (typeof permission === 'string') {
      return role.permissions.includes(permission);
    }

    // Handle Permission object format
    const permissionString = `${permission.resource}:${permission.action}`;
    const wildCardPermission = `${permission.resource}:*`;
    
    return (
      role.permissions.includes(permissionString) || 
      role.permissions.includes(wildCardPermission) ||
      role.permissions.includes('*:*')
    );
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      register,
      error,
      resetPassword,
      refreshToken,
      updateProfile,
      roles,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
};