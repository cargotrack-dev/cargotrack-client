// src/features/Core/contexts/AuthContext.tsx
import { createContext } from 'react';
import { AuthContextType } from '../types/auth';

// Mock roles for initial implementation
const defaultRoles = [
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

// Create the auth context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  error: null,
  resetPassword: async () => {},
  refreshToken: async () => {},
  updateProfile: async () => {},
  roles: defaultRoles,
  hasPermission: () => false
});