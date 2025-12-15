// src/features/Trucks/types/truck.types.ts

// Add this new interface for the MaintenanceRecord
export interface MaintenanceRecord {
  id: string;
  date: string;
  type: 'routine' | 'repair' | 'inspection' | 'emergency';
  description: string;
  cost: number;
  technician: string;
  mileage: number;
  status: 'completed' | 'scheduled' | 'in_progress';
  notes?: string;
  parts?: {
    name: string;
    quantity: number;
    cost: number;
  }[];
}

export enum TruckStatus {
  ACTIVE = 'ACTIVE',
  MAINTENANCE = 'MAINTENANCE',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE',
  ASSIGNED = 'ASSIGNED'
}

// Your existing Truck interface would be here
export interface Truck {
  id: string;
  make: string;
  model: string;
  year: number;
  type: string;
  vin: string;
  licensePlate: string;
  status: TruckStatus;
  currentLocation: string | { lat: number; lng: number };
  lastUpdated?: string;
  registrationExpiry?: string;
  insuranceExpiry?: string;
  currentAssignment?: {
    shipmentId: string;
    status: string;
    driverName: string;
    startDate: string;
    route?: {
      origin: string;
      destination: string;
    }
  };
  alerts?: Array<{
    title: string;
    message: string;
    timestamp: string;
  }>;
  maintenanceStatus?: {
    odometer: number;
    nextServiceDate: string;
    expectedCompletion?: string;
    healthScore: number;
  };
}

export type MaintenanceStatus = {
  odometer: number;
  nextServiceDate: string | Date;
  lastServiceDate: string | Date;
  healthScore: number;
  expectedCompletion?: string | Date;
  notes?: string;
};

export type Assignment = {
  id: string;
  shipmentId: string;
  status: string;
  startDate: string | Date;
  endDate?: string | Date;
  driverName: string;
  route?: {
    origin: string;
    destination: string;
  };
};

export type Alert = {
  id?: string;
  title: string;
  message: string;
  level: 'info' | 'warning' | 'critical';
  timestamp: string | Date;
  resolved?: boolean;
};

export interface TruckFilter {
  status?: string;
  type?: string;
  available?: boolean;
  locationId?: string;
  driverId?: string;
  fleet?: string;
  [key: string]: string | boolean | undefined;
}
