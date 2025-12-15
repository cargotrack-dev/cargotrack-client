// src/features/Core/types/auth.ts

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  OPERATOR = 'operator',
  CLIENT = 'client',
  GUEST = 'guest',
  MAINTENANCE = 'maintenance',
  DISPATCHER = 'dispatcher',
  SUPER_ADMIN = 'super_admin'
}

export enum ResourceType {
  USER = 'user',
  VEHICLE = 'vehicle',
  DOCUMENT = 'document',
  CARGO = 'cargo',
  MAINTENANCE = 'maintenance',
  INVOICE = 'invoice',
  SETTING = 'setting',
  SHIPMENT = 'shipment',
  DRIVER = 'driver',
  CLIENT = 'client',
  REPORT = 'report'
}

export enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete'
}

export interface Permission {
  resource: ResourceType;
  action: PermissionAction;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface User {
  id: string;
  profile: UserProfile;
  roles: string[];
  permissions?: string[];
}

export interface Role {
  id: string;
  name: string;
  type?: string;
  permissions: string[];
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterUserData) => Promise<void>;
  error: string | null;
  resetPassword: (email: string) => Promise<void>;
  refreshToken: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  roles: Role[];
  hasPermission: (permission: Permission | string) => boolean;
}

export interface RegisterUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}