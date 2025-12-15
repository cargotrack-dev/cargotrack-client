// src/features/Dashboard/types/index.ts
export interface DashboardWidget {
    id: string;
    title: string;
    type: 'chart' | 'stats' | 'table' | 'map' | 'custom';
    width: 'small' | 'medium' | 'large' | 'full';
    height: 'small' | 'medium' | 'large';
    position?: {
      x: number;
      y: number;
    };
    settings?: Record<string, unknown>;
  }
  
  export interface DashboardConfig {
    id: string;
    name: string;
    userId?: string;
    roleId?: string;
    isDefault?: boolean;
    widgets: DashboardWidget[];
    layout?: 'grid' | 'fixed' | 'auto';
  }
  
  export interface DashboardSummary {
    shipments: {
      total: number;
      inTransit: number;
      delivered: number;
      pending: number;
    };
    invoices: {
      total: number;
      paid: number;
      pending: number;
      overdue: number;
    };
    fleet: {
      total: number;
      active: number;
      maintenance: number;
      inactive: number;
    };
    clients: {
      total: number;
      active: number;
    };
  }