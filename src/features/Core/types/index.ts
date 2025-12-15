// client/src/features/Core/types/index.ts
// 🚀 FIXED VERSION - Resolved missing import errors
// Creates proper type exports for CargoTrack Core types

// 🎯 CORE TYPES - Essential shared interfaces
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasMore?: boolean;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface FilterParams {
  startDate?: string;
  endDate?: string;
  status?: string;
  category?: string;
  tags?: string[];
}

// 🎯 LOCATION TYPES - Geographic and address information
export interface Coordinates {
  lat: number;
  lng: number;
  accuracy?: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  formatted?: string;
}

export interface Location extends BaseEntity {
  name: string;
  address: Address;
  coordinates?: Coordinates;
  type: 'warehouse' | 'depot' | 'customer' | 'pickup' | 'delivery' | 'transit';
  isActive: boolean;
  contactInfo?: {
    phone?: string;
    email?: string;
    contactPerson?: string;
  };
  operatingHours?: {
    open: string;
    close: string;
    timezone: string;
    daysOfWeek: number[]; // 0-6, Sunday = 0
  };
  metadata?: Record<string, unknown>;
}

export interface LocationUpdate {
  coordinates?: Coordinates;
  timestamp: string;
  accuracy?: number;
  speed?: number;
  heading?: number;
  source: 'gps' | 'manual' | 'estimated';
}

// 🎯 TASK TYPES - Task and workflow management
export interface Task extends BaseEntity {
  title: string;
  description?: string;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: string;
  assignedBy?: string;
  dueDate?: string;
  completedAt?: string;
  estimatedDuration?: number; // in minutes
  actualDuration?: number; // in minutes
  tags?: string[];
  metadata?: Record<string, unknown>;
  dependencies?: string[]; // task IDs
  attachments?: TaskAttachment[];
  comments?: TaskComment[];
  relatedEntityId?: string; // shipment, vehicle, etc.
  relatedEntityType?: 'shipment' | 'vehicle' | 'driver' | 'maintenance';
}

export enum TaskType {
  PICKUP = 'pickup',
  DELIVERY = 'delivery',
  MAINTENANCE = 'maintenance',
  INSPECTION = 'inspection',
  DOCUMENTATION = 'documentation',
  CUSTOMER_SERVICE = 'customer_service',
  ROUTE_PLANNING = 'route_planning',
  INVENTORY = 'inventory',
  ADMIN = 'admin',
  OTHER = 'other'
}

export enum TaskStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  FAILED = 'failed'
}

export enum TaskPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
  CRITICAL = 'critical'
}

export interface TaskAttachment {
  id: string;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface TaskComment extends BaseEntity {
  taskId: string;
  content: string;
  author: string;
  isInternal: boolean;
  attachments?: TaskAttachment[];
}

export interface TaskAssignment {
  taskId: string;
  assignedTo: string;
  assignedBy: string;
  assignedAt: string;
  note?: string;
}

// 🎯 USER & PERMISSION TYPES
export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: string;
  permissions: string[];
  isActive: boolean;
  lastLoginAt?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  dashboard: {
    layout: string;
    widgets: string[];
  };
}

// 🎯 NOTIFICATION TYPES
export interface Notification extends BaseEntity {
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  recipientId: string;
  senderId?: string;
  isRead: boolean;
  readAt?: string;
  data?: Record<string, unknown>;
  channels: NotificationChannel[];
  scheduledFor?: string;
  sentAt?: string;
}

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  REMINDER = 'reminder',
  ALERT = 'alert'
}

export enum NotificationPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum NotificationChannel {
  EMAIL = 'email',
  PUSH = 'push',
  SMS = 'sms',
  IN_APP = 'in_app'
}

// 🎯 FILE & DOCUMENT TYPES
export interface Document extends BaseEntity {
  name: string;
  description?: string;
  type: DocumentType;
  category: string;
  url: string;
  size: number;
  mimeType: string;
  checksum?: string;
  isPublic: boolean;
  tags?: string[];
  metadata?: Record<string, unknown>;
  relatedEntityId?: string;
  relatedEntityType?: string;
  uploadedBy: string;
  expiresAt?: string;
}

export enum DocumentType {
  INVOICE = 'invoice',
  RECEIPT = 'receipt',
  CONTRACT = 'contract',
  WAYBILL = 'waybill',
  MANIFEST = 'manifest',
  INSURANCE = 'insurance',
  PERMIT = 'permit',
  PHOTO = 'photo',
  SIGNATURE = 'signature',
  OTHER = 'other'
}

// 🎯 AUDIT & LOGGING TYPES
export interface AuditLog extends BaseEntity {
  action: string;
  entityType: string;
  entityId: string;
  userId: string;
  userEmail: string;
  changes?: {
    before: Record<string, unknown>;
    after: Record<string, unknown>;
  };
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

// 🎯 SETTINGS & CONFIGURATION TYPES
export interface SystemSettings {
  company: {
    name: string;
    address: Address;
    phone: string;
    email: string;
    website?: string;
    logo?: string;
    taxId?: string;
  };
  business: {
    currency: string;
    timezone: string;
    dateFormat: string;
    timeFormat: string;
    measurementUnit: 'metric' | 'imperial';
  };
  features: {
    tracking: boolean;
    analytics: boolean;
    invoicing: boolean;
    maintenance: boolean;
    routeOptimization: boolean;
  };
  integrations: {
    maps: {
      provider: 'google' | 'mapbox' | 'openstreet';
      apiKey?: string;
    };
    payment: {
      provider?: string;
      isEnabled: boolean;
    };
    sms: {
      provider?: string;
      isEnabled: boolean;
    };
  };
}

// 🎯 ERROR HANDLING TYPES
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
  userId?: string;
  trace?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: unknown;
}

// 🎯 UTILITY TYPES
export type SortOrder = 'asc' | 'desc';
export type EntityStatus = 'active' | 'inactive' | 'pending' | 'archived';
export type DateRange = {
  start: string;
  end: string;
};

// 🎯 SEARCH & FILTER TYPES
export interface SearchParams {
  query?: string;
  filters?: Record<string, unknown>;
  sort?: {
    field: string;
    order: SortOrder;
  };
  pagination?: PaginationParams;
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  hasMore: boolean;
  facets?: Record<string, unknown>;
}

// 🎯 CHART & ANALYTICS TYPES
export interface ChartDataPoint {
  label: string;
  value: number;
  metadata?: Record<string, unknown>;
}

export interface TimeSeries {
  timestamp: string;
  value: number;
  label?: string;
}

export interface AnalyticsMetric {
  name: string;
  value: number;
  unit?: string;
  trend?: {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
    period: string;
  };
  target?: number;
}

// 🎯 EXPORT ALL TYPES
export type {
  // Re-export existing types from other features if needed
  // These can be imported from their respective feature modules
}