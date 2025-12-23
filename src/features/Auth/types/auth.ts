// src/types/auth.ts

/**
 * Enum for user roles
 */
export enum UserRole {
    SUPER_ADMIN = 'SUPER_ADMIN',   // Complete system access
    ADMIN = 'ADMIN',               // Administrative access without system configuration
    MANAGER = 'MANAGER',           // Management-level access
    DISPATCHER = 'DISPATCHER',     // Responsible for dispatching and route planning
    DRIVER = 'DRIVER',             // Driver-specific access
    ACCOUNTANT = 'ACCOUNTANT',     // Financial access
    CLIENT = 'CLIENT',             // External client access
    MAINTENANCE = 'MAINTENANCE',   // Maintenance team
    ANALYST = 'ANALYST',           // Read-only access for analytics
    CUSTOM = 'CUSTOM'              // Custom role with specific permissions
  }
  
  /**
   * Enum for resource types that can have permissions
   */
  export enum ResourceType {
    SHIPMENT = 'SHIPMENT',
    CARGO = 'CARGO',
    VEHICLE = 'VEHICLE',
    DRIVER = 'DRIVER',
    INVOICE = 'INVOICE',
    CLIENT = 'CLIENT',
    REPORT = 'REPORT',
    USER = 'USER',
    ROLE = 'ROLE',
    SETTING = 'SETTING',
    TEMPLATE = 'TEMPLATE',
    MAINTENANCE = 'MAINTENANCE',
    ROUTE = 'ROUTE',
    COST = 'COST',
    REVENUE = 'REVENUE',
    DOCUMENT = 'DOCUMENT',
    DASHBOARD = 'DASHBOARD',
    NOTIFICATION = 'NOTIFICATION'
  }
  
  /**
   * Enum for permission actions
   */
  export enum PermissionAction {
    CREATE = 'CREATE',
    READ = 'READ',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    APPROVE = 'APPROVE',
    ASSIGN = 'ASSIGN',
    EXECUTE = 'EXECUTE',
    EXPORT = 'EXPORT',
    IMPORT = 'IMPORT',
    SHARE = 'SHARE',
    PRINT = 'PRINT',
    MANAGE = 'MANAGE'    // Full resource management
  }
  
  /**
   * Interface for permission constraints
   */
  export interface PermissionConstraints {
    // Existing constraints
    ownedOnly?: boolean;            // User can only act on resources they created
    departmentOnly?: boolean;       // User can only act on resources in their department
    clientRestrictions?: string[];  // Restricted to specific clients
    valueLimit?: number;            // Value limit (for financial permissions)
    timeRestriction?: {             // Time-based restriction
      daysInPast?: number;
      daysInFuture?: number;
    };
    customRestriction?: Record<string, unknown>; // Custom restriction logic
    
    // ✅ NEW CUSTOM RESTRICTIONS (for enterprise logistics)
    regionRestriction?: boolean;
    vehicleTypeRestriction?: boolean;
    customerRestriction?: boolean;
    maxPriorityLevel?: 'standard' | 'express' | 'urgent' | 'critical';
    allowedStatuses?: string[];
    budgetLimit?: number;
    maxWeight?: number; // kg
    maxDistance?: number; // km
    workingHours?: {
      daysOfWeek?: number[]; // 0-6 (Sunday-Saturday)
      startHour?: number; // 0-23
      endHour?: number; // 0-23
    };
    geofence?: {
      centerLat: number;
      centerLng: number;
      radiusKm: number;
    };
    requiredVehicleStatus?: 'active' | 'maintenance' | 'standby';
    tempControlRequired?: boolean;
    minApprovalLevel?: number;
    allowedCompanies?: string[];
    requiredDocuments?: string[];
  }
  
  /**
   * Interface for a permission
   */
  export interface Permission {
    id: string;
    resource: ResourceType;
    action: PermissionAction;
    description?: string;
    constraints?: PermissionConstraints;
  }
  
  /**
   * Interface for role definition
   */
  export interface Role {
    id: string;
    name: string;
    description?: string;
    type: UserRole | string;
    permissions: string[];  // Permission IDs
    isDefault?: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt?: Date;
    createdBy: string;
    updatedBy?: string;
  }
  
  /**
   * Interface for user profile
   */
  export interface UserProfile {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    jobTitle?: string;
    department?: string;
    employeeId?: string;
    profileImageUrl?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
    };
    emergencyContact?: {
      name: string;
      relationship: string;
      phoneNumber: string;
    };
    notes?: string;
    
    // ✅ NEW CUSTOM RESTRICTION PROPERTIES
    allowedRegions?: string[];
    allowedVehicleTypes?: string[];
    allowedCustomers?: string[];
    blockedCustomers?: string[];
    budgetUsed?: number;
  }
  
  /**
   * Interface for user settings
   */
  export interface UserSettings {
    userId: string;
    preferences: {
      language: string;
      dateFormat: string;
      timeFormat: string;
      timezone: string;
      theme: string;
      notificationPreferences: {
        email: boolean;
        sms: boolean;
        push: boolean;
        inApp: boolean;
      };
      dashboardLayout?: Record<string, unknown>;
      defaultViews?: Record<string, unknown>;
    };
    apiKeys?: {
      key: string;
      description: string;
      createdAt: Date;
      expiresAt?: Date;
      lastUsed?: Date;
      permissions: string[];  // Limited set of permissions
    }[];
    mfaEnabled: boolean;
    lastLogin?: Date;
    failedLoginAttempts: number;
    updatedAt: Date;
  }
  
  /**
   * Interface for driver-specific information
   * Extends the basic user profile for drivers
   */
  export interface DriverProfile extends UserProfile {
    licenseInformation: {
      licenseNumber: string;
      licenseClass: string;
      issueDate: Date;
      expiryDate: Date;
      issuingAuthority: string;
      restrictions?: string[];
      endorsements?: string[];
    };
    qualification: {
      hazmatCertified: boolean;
      specialTraining?: string[];
      yearsOfExperience: number;
      safetyRating?: number;
    };
    availability: {
      status: 'AVAILABLE' | 'ON_DUTY' | 'OFF_DUTY' | 'ON_LEAVE' | 'SICK' | 'TERMINATED';
      schedule?: {
        regularHours?: {
          startTime: string;
          endTime: string;
          daysOfWeek: number[];  // 0 = Sunday, 6 = Saturday
        };
        timeOff?: {
          startDate: Date;
          endDate: Date;
          reason?: string;
        }[];
      };
      currentLocation?: {
        latitude: number;
        longitude: number;
        lastUpdated: Date;
      };
      hoursOfService?: {
        currentCycle: {
          cycleStartTime: Date;
          availableHours: number;
          drivingHours: number;
          dutyHours: number;
          restRequired: boolean;
        };
        logs: {
          date: Date;
          status: 'DRIVING' | 'ON_DUTY' | 'OFF_DUTY' | 'SLEEPER';
          startTime: Date;
          endTime?: Date;
          location?: string;
          notes?: string;
        }[];
      };
    };
    assignedVehicles?: string[];  // Vehicle IDs
    preferredRoutes?: string[];   // Route IDs
    payInformation?: {
      payType: 'HOURLY' | 'PER_MILE' | 'PERCENTAGE' | 'FIXED' | 'MIXED';
      baseRate: number;
      currency: string;
      bonuses?: {
        type: string;
        amount: number;
        condition: string;
      }[];
    };
  }
  
  /**
   * Interface for user with authentication and permission information
   */
  export interface User {
    id: string;
    username: string;
    email: string;
    isActive: boolean;
    isEmailVerified: boolean;
    roles: string[];  // Role IDs
    directPermissions?: string[];  // Permission IDs assigned directly to user
    clientId?: string;  // For client users
    passwordLastChanged: Date;
    passwordResetRequired: boolean;
    accountLockedUntil?: Date;
    profile: UserProfile;
    settings: UserSettings;
    driverProfile?: DriverProfile;  // Only for driver users
    createdAt: Date;
    updatedAt?: Date;
    lastLoginAt?: Date;
  }
  
  /**
   * Interface for access tokens
   */
  export interface AccessToken {
    userId: string;
    tokenId: string;
    issuedAt: Date;
    expiresAt: Date;
    clientIp?: string;
    userAgent?: string;
    scope?: string[];
    isRevoked: boolean;
  }