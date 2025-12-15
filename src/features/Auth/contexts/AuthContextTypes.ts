// src/contexts/AuthContextTypes.ts
import { 
    User,
    UserRole,
    Permission,
    ResourceType,
    PermissionAction,
    Role
  } from '../types/auth';
  
  // Auth state interface
  export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    permissions: Permission[];
    roles: Role[];
  }
  
  // Define a more specific type for additional context properties
  export interface ContextProperties {
    ownerId?: string;
    departmentId?: string;
    clientId?: string;
    value?: number;
    timestamp?: Date;
    [key: string]: unknown;
  }
  
  // Auth context with extended functionality
  export interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    
    // Permission checking methods
    hasPermission: (resource: ResourceType, action: PermissionAction) => boolean;
    hasRole: (role: UserRole | string) => boolean;
    
    // Check if user can perform an action on a specific resource with constraints
    canAccess: (
      resource: ResourceType, 
      action: PermissionAction, 
      context?: ContextProperties
    ) => boolean;
  }
  
  // Mock data
  export const MOCK_ROLES: Role[] = [
    {
      id: 'role-001',
      name: 'Super Admin',
      description: 'Complete system access with all permissions',
      type: UserRole.SUPER_ADMIN,
      permissions: ['perm-all'],
      isDefault: false,
      isActive: true,
      createdAt: new Date('2023-01-01'),
      createdBy: 'system'
    },
    {
      id: 'role-002',
      name: 'Administrator',
      description: 'Administrative access without system configuration',
      type: UserRole.ADMIN,
      permissions: ['perm-admin'],
      isDefault: false,
      isActive: true,
      createdAt: new Date('2023-01-01'),
      createdBy: 'system'
    },
    {
      id: 'role-003',
      name: 'Operations Manager',
      description: 'Management-level access for operations',
      type: UserRole.MANAGER,
      permissions: ['perm-ops-manage'],
      isDefault: false,
      isActive: true,
      createdAt: new Date('2023-01-01'),
      createdBy: 'system'
    },
    {
      id: 'role-004',
      name: 'Dispatcher',
      description: 'Responsible for dispatching and route planning',
      type: UserRole.DISPATCHER,
      permissions: ['perm-dispatch'],
      isDefault: false,
      isActive: true,
      createdAt: new Date('2023-01-01'),
      createdBy: 'system'
    },
    {
      id: 'role-005',
      name: 'Driver',
      description: 'Driver-specific access',
      type: UserRole.DRIVER,
      permissions: ['perm-driver'],
      isDefault: false,
      isActive: true,
      createdAt: new Date('2023-01-01'),
      createdBy: 'system'
    },
    {
      id: 'role-006',
      name: 'Client',
      description: 'External client access',
      type: UserRole.CLIENT,
      permissions: ['perm-client'],
      isDefault: false,
      isActive: true,
      createdAt: new Date('2023-01-01'),
      createdBy: 'system'
    }
  ];
  
  export const MOCK_PERMISSIONS: Permission[] = [
    // Super Admin permissions
    {
      id: 'perm-all',
      resource: ResourceType.SETTING,
      action: PermissionAction.MANAGE,
      description: 'Full system access'
    },
    
    // Admin permissions
    {
      id: 'perm-admin',
      resource: ResourceType.USER,
      action: PermissionAction.MANAGE,
      description: 'Manage all users'
    },
    
    // Operations Manager permissions
    {
      id: 'perm-ops-manage',
      resource: ResourceType.SHIPMENT,
      action: PermissionAction.MANAGE,
      description: 'Manage all shipments'
    },
    
    // Dispatcher permissions
    {
      id: 'perm-dispatch',
      resource: ResourceType.SHIPMENT,
      action: PermissionAction.CREATE,
      description: 'Create shipments'
    },
    {
      id: 'perm-dispatch-update',
      resource: ResourceType.SHIPMENT,
      action: PermissionAction.UPDATE,
      description: 'Update shipments'
    },
    {
      id: 'perm-route-manage',
      resource: ResourceType.ROUTE,
      action: PermissionAction.MANAGE,
      description: 'Manage routes'
    },
    
    // Driver permissions
    {
      id: 'perm-driver',
      resource: ResourceType.SHIPMENT,
      action: PermissionAction.READ,
      description: 'View assigned shipments',
      constraints: {
        ownedOnly: true
      }
    },
    
    // Client permissions
    {
      id: 'perm-client',
      resource: ResourceType.CARGO,
      action: PermissionAction.READ,
      description: 'View own cargo',
      constraints: {
        clientRestrictions: ['self']
      }
    },
    {
      id: 'perm-client-create',
      resource: ResourceType.CARGO,
      action: PermissionAction.CREATE,
      description: 'Create cargo items'
    }
  ];
  
  export const MOCK_USERS: Partial<User>[] = [
    {
      id: 'user-001',
      username: 'admin',
      email: 'admin@cargotrackpro.com',
      isActive: true,
      isEmailVerified: true,
      roles: ['role-001'], // Super Admin
      passwordLastChanged: new Date('2023-01-01'),
      passwordResetRequired: false,
      profile: {
        id: 'profile-001',
        username: 'admin',
        email: 'admin@cargotrackpro.com',
        firstName: 'Admin',
        lastName: 'User'
      },
      settings: {
        userId: 'user-001',
        preferences: {
          language: 'en',
          dateFormat: 'MM/DD/YYYY',
          timeFormat: '12h',
          timezone: 'America/New_York',
          theme: 'light',
          notificationPreferences: {
            email: true,
            sms: false,
            push: true,
            inApp: true
          }
        },
        mfaEnabled: false,
        failedLoginAttempts: 0,
        updatedAt: new Date('2023-01-01')
      },
      createdAt: new Date('2023-01-01')
    },
    {
      id: 'user-002',
      username: 'manager',
      email: 'manager@cargotrackpro.com',
      isActive: true,
      isEmailVerified: true,
      roles: ['role-003'], // Operations Manager
      passwordLastChanged: new Date('2023-01-01'),
      passwordResetRequired: false,
      profile: {
        id: 'profile-002',
        username: 'manager',
        email: 'manager@cargotrackpro.com',
        firstName: 'Operations',
        lastName: 'Manager',
        jobTitle: 'Operations Manager'
      },
      settings: {
        userId: 'user-002',
        preferences: {
          language: 'en',
          dateFormat: 'MM/DD/YYYY',
          timeFormat: '12h',
          timezone: 'America/New_York',
          theme: 'light',
          notificationPreferences: {
            email: true,
            sms: false,
            push: true,
            inApp: true
          }
        },
        mfaEnabled: false,
        failedLoginAttempts: 0,
        updatedAt: new Date('2023-01-01')
      },
      createdAt: new Date('2023-01-01')
    },
    {
      id: 'user-003',
      username: 'dispatcher',
      email: 'dispatcher@cargotrackpro.com',
      isActive: true,
      isEmailVerified: true,
      roles: ['role-004'], // Dispatcher
      passwordLastChanged: new Date('2023-01-01'),
      passwordResetRequired: false,
      profile: {
        id: 'profile-003',
        username: 'dispatcher',
        email: 'dispatcher@cargotrackpro.com',
        firstName: 'Dispatch',
        lastName: 'User',
        jobTitle: 'Dispatcher'
      },
      settings: {
        userId: 'user-003',
        preferences: {
          language: 'en',
          dateFormat: 'MM/DD/YYYY',
          timeFormat: '12h',
          timezone: 'America/New_York',
          theme: 'light',
          notificationPreferences: {
            email: true,
            sms: true,
            push: true,
            inApp: true
          }
        },
        mfaEnabled: false,
        failedLoginAttempts: 0,
        updatedAt: new Date('2023-01-01')
      },
      createdAt: new Date('2023-01-01')
    },
    {
      id: 'user-004',
      username: 'driver1',
      email: 'driver@cargotrackpro.com',
      isActive: true,
      isEmailVerified: true,
      roles: ['role-005'], // Driver
      passwordLastChanged: new Date('2023-01-01'),
      passwordResetRequired: false,
      profile: {
        id: 'profile-004',
        username: 'driver1',
        email: 'driver@cargotrackpro.com',
        firstName: 'John',
        lastName: 'Driver',
        jobTitle: 'Truck Driver'
      },
      settings: {
        userId: 'user-004',
        preferences: {
          language: 'en',
          dateFormat: 'MM/DD/YYYY',
          timeFormat: '12h',
          timezone: 'America/New_York',
          theme: 'dark',
          notificationPreferences: {
            email: true,
            sms: true,
            push: true,
            inApp: true
          }
        },
        mfaEnabled: false,
        failedLoginAttempts: 0,
        updatedAt: new Date('2023-01-01')
      },
      driverProfile: {
        id: 'profile-004',
        username: 'driver1',
        email: 'driver@cargotrackpro.com',
        firstName: 'John',
        lastName: 'Driver',
        licenseInformation: {
          licenseNumber: 'DL12345678',
          licenseClass: 'A',
          issueDate: new Date('2020-01-01'),
          expiryDate: new Date('2025-01-01'),
          issuingAuthority: 'State DOT'
        },
        qualification: {
          hazmatCertified: true,
          yearsOfExperience: 5,
          safetyRating: 4.8
        },
        availability: {
          status: 'AVAILABLE'
        }
      },
      createdAt: new Date('2023-01-01')
    },
    {
      id: 'user-005',
      username: 'client1',
      email: 'client@example.com',
      isActive: true,
      isEmailVerified: true,
      roles: ['role-006'], // Client
      clientId: 'client-001',
      passwordLastChanged: new Date('2023-01-01'),
      passwordResetRequired: false,
      profile: {
        id: 'profile-005',
        username: 'client1',
        email: 'client@example.com',
        firstName: 'Client',
        lastName: 'User'
      },
      settings: {
        userId: 'user-005',
        preferences: {
          language: 'en',
          dateFormat: 'MM/DD/YYYY',
          timeFormat: '12h',
          timezone: 'America/New_York',
          theme: 'light',
          notificationPreferences: {
            email: true,
            sms: false,
            push: false,
            inApp: true
          }
        },
        mfaEnabled: false,
        failedLoginAttempts: 0,
        updatedAt: new Date('2023-01-01')
      },
      createdAt: new Date('2023-01-01')
    }
  ];
  
  // LocalStorage key for auth data
  export const AUTH_STORAGE_KEY = 'cargotrack_auth';