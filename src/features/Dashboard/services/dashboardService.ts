// src/features/Dashboard/services/dashboardService.ts
import axios from 'axios';
import { DashboardConfig, DashboardSummary } from '../types';

// Create a basic client (replace with your actual API client if available)
const api = axios.create({
  baseURL: '/api',
});

// Define more specific types for driver and vehicle dashboards
interface DriverDashboardData {
  id: string;
  name: string;
  assignments: {
    current: {
      shipmentId: string;
      origin: string;
      destination: string;
      status: string;
      eta: string;
    }[];
    upcoming: {
      shipmentId: string;
      origin: string;
      destination: string;
      scheduledDate: string;
    }[];
  };
  stats: {
    deliveries: {
      today: number;
      week: number;
      month: number;
    };
    distance: {
      today: number;
      week: number;
      month: number;
    };
    onTimeRate: number;
  };
}

interface VehicleDashboardData {
  summary: {
    total: number;
    active: number;
    maintenance: number;
    idle: number;
  };
  vehicles: {
    id: string;
    name: string;
    type: string;
    status: string;
    currentDriver?: string;
    currentLocation?: {
      latitude: number;
      longitude: number;
      address: string;
    };
    fuelLevel?: number;
    maintenanceStatus?: string;
  }[];
  maintenanceSchedule: {
    id: string;
    vehicleId: string;
    vehicleName: string;
    type: string;
    scheduledDate: string;
    priority: 'low' | 'medium' | 'high';
  }[];
}

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const response = await api.get('/dashboard/summary');
  return response.data;
};

export const getUserDashboard = async (): Promise<DashboardConfig> => {
  const response = await api.get('/dashboard/config');
  return response.data;
};

export const saveDashboardConfig = async (config: Partial<DashboardConfig>): Promise<DashboardConfig> => {
  const response = await api.post('/dashboard/config', config);
  return response.data;
};

export const getDriverDashboard = async (driverId?: string): Promise<DriverDashboardData> => {
  const response = await api.get(`/dashboard/driver${driverId ? `/${driverId}` : ''}`);
  return response.data;
};

export const getVehicleDashboard = async (): Promise<VehicleDashboardData> => {
  const response = await api.get('/dashboard/vehicle');
  return response.data;
};