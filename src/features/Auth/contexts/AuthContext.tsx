// src/contexts/AuthContext.tsx
import React, { useState, useEffect, ReactNode } from 'react';
import { User, ResourceType, PermissionAction, UserRole } from '../types/auth';
import { 
  AuthContextType, 
  AuthState,
  ContextProperties,
  MOCK_PERMISSIONS,
  MOCK_ROLES,
  MOCK_USERS,
  AUTH_STORAGE_KEY
} from './AuthContextTypes';
import { AuthContext } from './AuthContextInstance';

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    permissions: MOCK_PERMISSIONS,
    roles: MOCK_ROLES
  });

  // Check for existing session on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
        if (storedAuth) {
          const parsedAuth = JSON.parse(storedAuth);
          setAuthState(prevState => ({
            ...prevState,
            user: parsedAuth.user,
            isAuthenticated: true,
            isLoading: false,
            error: null
          }));
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setAuthState(prevState => ({
          ...prevState,
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Authentication error'
        }));
      }
    };

    checkAuthStatus();
  }, []);

  // Login method
  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find user in mock data (replace with API call in production)
      const user = MOCK_USERS.find(u => u.email === email);

      if (!user) {
        throw new Error('User not found');
      }

      // Password validation would happen on the server
      if (password !== 'password') { // Mock password validation
        throw new Error('Invalid credentials');
      }

      // Update user's last login
      const updatedUser = {
        ...user,
        lastLoginAt: new Date()
      } as User;

      // Update state and store in localStorage
      const authData = {
        user: updatedUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        permissions: MOCK_PERMISSIONS,
        roles: MOCK_ROLES
      };

      setAuthState(authData);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
        user: updatedUser,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Login error:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed'
      }));
    }
  };

  // Logout method
  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthState(prevState => ({
      ...prevState,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    }));
  };

  // Get all permissions for the current user based on roles
  const getUserPermissions = () => {
    if (!authState.user) return [];
    
    // Get role IDs
    const userRoleIds = authState.user.roles || [];
    
    // Get roles from IDs
    const userRoles = authState.roles.filter(role => userRoleIds.includes(role.id));
    
    // Get permission IDs from roles
    const permissionIds = userRoles.flatMap(role => role.permissions);
    
    // Add direct permissions if any
    if (authState.user.directPermissions) {
      permissionIds.push(...authState.user.directPermissions);
    }
    
    // Remove duplicates
    const uniquePermissionIds = [...new Set(permissionIds)];
    
    // Get permissions from IDs
    return authState.permissions.filter(perm => uniquePermissionIds.includes(perm.id));
  };

  // Check if user has a specific permission
  const hasPermission = (resource: ResourceType, action: PermissionAction): boolean => {
    if (!authState.user) return false;
    
    const userPermissions = getUserPermissions();
    
    // Super admin has all permissions
    if (hasRole(UserRole.SUPER_ADMIN)) return true;
    
    // Check for MANAGE permission on resource (includes all actions)
    const hasManagePermission = userPermissions.some(
      p => p.resource === resource && p.action === PermissionAction.MANAGE
    );
    
    if (hasManagePermission) return true;
    
    // Check for specific action permission
    return userPermissions.some(
      p => p.resource === resource && p.action === action
    );
  };

  // Check if user has a specific role
  const hasRole = (role: UserRole | string): boolean => {
    if (!authState.user) return false;
    
    const userRoleIds = authState.user.roles || [];
    const userRoles = authState.roles.filter(r => userRoleIds.includes(r.id));
    
    return userRoles.some(r => r.type === role);
  };

  // Check if user can access a resource with specific context
  const canAccess = (
    resource: ResourceType,
    action: PermissionAction,
    context?: ContextProperties
  ): boolean => {
    if (!authState.user) return false;
    
    // Super admin has all access
    if (hasRole(UserRole.SUPER_ADMIN)) return true;
    
    const userPermissions = getUserPermissions();
    
    // Find relevant permissions
    const relevantPermissions = userPermissions.filter(
      p => p.resource === resource && (p.action === action || p.action === PermissionAction.MANAGE)
    );
    
    if (relevantPermissions.length === 0) return false;
    
    // If no context provided, base access on having the permission
    if (!context) return true;
    
    // Check each permission considering constraints
    return relevantPermissions.some(permission => {
      // If no constraints, permission is granted
      if (!permission.constraints) return true;
      
      const { constraints } = permission;
      
      // Check ownedOnly constraint
      if (constraints.ownedOnly && context.ownerId && authState.user?.id !== context.ownerId) {
        return false;
      }
      
      // Check departmentOnly constraint
      if (constraints.departmentOnly && context.departmentId) {
        const userDepartment = authState.user?.profile?.department;
        if (!userDepartment || userDepartment !== context.departmentId) {
          return false;
        }
      }
      
      // Check client restrictions
      if (constraints.clientRestrictions && context.clientId) {
        // Special case for 'self' restriction
        if (constraints.clientRestrictions.includes('self')) {
          return authState.user?.clientId === context.clientId;
        }
        
        // Check if client is in allowed list
        if (!constraints.clientRestrictions.includes(context.clientId)) {
          return false;
        }
      }
      
      // Check value limit
      if (constraints.valueLimit !== undefined && context.value !== undefined) {
        if (context.value > constraints.valueLimit) {
          return false;
        }
      }
      
      // Check time restrictions
      if (constraints.timeRestriction && context.timestamp) {
        const now = new Date();
        const contextDate = new Date(context.timestamp);
        
        // Check past restriction
        if (constraints.timeRestriction.daysInPast !== undefined) {
          const oldestAllowed = new Date();
          oldestAllowed.setDate(now.getDate() - constraints.timeRestriction.daysInPast);
          
          if (contextDate < oldestAllowed) {
            return false;
          }
        }
        
        // Check future restriction
        if (constraints.timeRestriction.daysInFuture !== undefined) {
          const furthestAllowed = new Date();
          furthestAllowed.setDate(now.getDate() + constraints.timeRestriction.daysInFuture);
          
          if (contextDate > furthestAllowed) {
            return false;
          }
        }
      }
      
      // Custom restrictions would be checked here based on application needs
      
      // If all constraint checks passed, grant access
      return true;
    });
  };

  // Provide auth context value
  const contextValue: AuthContextType = {
    ...authState,
    login,
    logout,
    hasPermission,
    hasRole,
    canAccess
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};