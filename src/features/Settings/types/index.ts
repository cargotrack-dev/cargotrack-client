// src/features/Settings/types/index.ts
export interface UserSettings {
    id: string;
    userId: string;
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
    dateFormat: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    notificationPreferences: {
      shipmentUpdates: boolean;
      deliveryAlerts: boolean;
      taskAssignments: boolean;
      systemAlerts: boolean;
      marketingMessages: boolean;
    };
    dashboardConfig?: {
      defaultView: string;
      widgets: string[];
    };
  }
  
  export interface SystemSettings {
    id: string;
    companyName: string;
    companyLogo?: string;
    contactEmail: string;
    contactPhone?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    defaultCurrency: string;
    defaultLanguage: string;
    defaultTimezone: string;
    taxRate?: number;
    allowUserRegistration: boolean;
    maintenanceMode: boolean;
    updatedAt: string | Date;
    updatedBy: string;
  }
  
  export interface AppTheme {
    name: string;
    colors: {
      primary: string;
      secondary: string;
      background: string;
      surface: string;
      error: string;
      text: string;
      border: string;
    };
    isDark: boolean;
  }