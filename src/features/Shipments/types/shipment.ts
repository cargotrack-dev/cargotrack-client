import { CargoType } from '../../Cargo/types/cargo';

/**
 * Interface for a location with coordinates
 */
export interface Location {
  id?: string;
  name: string;            // Location name
  address: string;         // Full address
  city: string;            // City
  state?: string;          // State/province
  country: string;         // Country
  postalCode?: string;     // Postal/ZIP code
  coordinates?: {          // GPS coordinates
    latitude: number;
    longitude: number;
  };
  contactName?: string;    // Contact person at this location
  contactPhone?: string;   // Contact phone at this location
  notes?: string;          // Additional notes about the location
}

// ✅ ADDED: Simple location interface for tracking compatibility
export interface SimpleLocation {
  latitude: number;
  longitude: number;
  timestamp: string;
  address?: string;
}

/**
 * Interface for waypoints and stops during a shipment
 */
export interface ShipmentStop {
  id: string;
  location: Location;
  type: 'PICKUP' | 'DELIVERY' | 'REST' | 'CHECKPOINT' | 'BORDER_CROSSING' | 'FUEL' | 'OTHER';
  scheduledArrival: Date;
  actualArrival?: Date;
  scheduledDeparture: Date;
  actualDeparture?: Date;
  status: 'PENDING' | 'ARRIVED' | 'COMPLETED' | 'SKIPPED' | 'CANCELLED';
  cargoOperations?: {     // For pickup/delivery stops
    cargoId: string;
    operation: 'LOAD' | 'UNLOAD' | 'TRANSFER' | 'INSPECT';
    quantity: number;
    notes?: string;
  }[];
  durationMinutes?: number; // Planned duration at this stop
  notes?: string;
}

/**
 * Interface for drivers assigned to a shipment
 */
export interface ShipmentDriver {
  id: string;
  name: string;
  licenseNumber: string;
  contactPhone: string;
  assignment: {
    role: 'PRIMARY' | 'RELIEF' | 'TRAINEE';
    startTime: Date;
    endTime?: Date;
  };
  hoursOfService?: {
    availableHours: number;
    startTime: Date;
  };
}

/**
 * Interface for vehicle information
 */
export interface ShipmentVehicle {
  id: string;
  type: 'TRUCK' | 'TRACTOR' | 'TRAILER' | 'VAN' | 'OTHER';
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  capacity?: {
    maxWeight: number;
    weightUnit: 'kg' | 'lb' | 't';
    maxVolume?: number;
    volumeUnit?: 'm³' | 'ft³';
  };
  fuelType?: 'DIESEL' | 'GASOLINE' | 'ELECTRIC' | 'HYBRID' | 'CNG' | 'LNG' | 'OTHER';
  fuelLevel?: number; // Percentage
  status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'OUT_OF_SERVICE';
}

/**
 * Interface for route and navigation details
 */
export interface ShipmentRoute {
  totalDistance: number;
  distanceUnit: 'km' | 'mi';
  estimatedDuration: number; // Minutes
  routePolyline?: string;    // Encoded polyline for map display
  navigationInstructions?: {
    step: number;
    instruction: string;
    distance: number;
    duration: number;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  }[];
  tollRoads?: {
    name: string;
    cost: number;
    currency: string;
  }[];
  restrictions?: string[];  // Route restrictions (e.g., no hazmat)
}

/**
 * Interface for tracking and real-time updates
 */
export interface ShipmentTracking {
  lastKnownLocation?: {
    latitude: number;
    longitude: number;
    timestamp: Date;
    speed?: number;  // km/h
    heading?: number; // Degrees
    accuracy?: number; // Meters
  };
  trackingEvents: {
    timestamp: Date;
    type: 'LOCATION_UPDATE' | 'STATUS_CHANGE' | 'STOP_ARRIVAL' | 'STOP_DEPARTURE' | 'INCIDENT' | 'MESSAGE';
    description: string;
    location?: {
      latitude: number;
      longitude: number;
    };
    data?: Record<string, unknown>; // Additional event-specific data
  }[];
  currentEta?: Date;
  delayMinutes?: number;
}

/**
 * Interface for cost tracking
 */
export interface ShipmentCosts {
  estimatedTotal: number;
  actualTotal?: number;
  currency: string;
  breakdown: {
    category: 'FUEL' | 'TOLLS' | 'DRIVER_PAY' | 'MAINTENANCE' | 'PERMITS' | 'OTHER';
    description: string;
    estimatedAmount: number;
    actualAmount?: number;
    notes?: string;
    receiptUrl?: string;
  }[];
  profitability?: {
    revenue: number;
    costs: number;
    margin: number; // Percentage
  };
}

// ✅ UNIFIED: Single ShipmentStatus enum for all modules
export enum ShipmentStatus {
  PENDING = 'PENDING',
  PLANNED = 'PLANNED',
  PICKED_UP = 'PICKED_UP',
  DISPATCHED = 'DISPATCHED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DELAYED = 'DELAYED',
  EXCEPTION = 'EXCEPTION',
  INCIDENT = 'INCIDENT',
  ON_HOLD = 'ON_HOLD',
}

// ✅ FIXED: Use consistent priority values
export type ShipmentPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

/**
 * Main Shipment interface representing a cargo transport assignment
 */
export interface Shipment {
  id: string;
  reference: string;               // Shipment reference number
  description: string;             // Brief description
  status: ShipmentStatus;          // Current status
  priority: ShipmentPriority;      // ✅ FIXED: Use consistent type
  cargoIds: string[];              // IDs of related cargo
  origin: Location;                // Starting location
  destination: Location;           // Final destination
  stops: ShipmentStop[];           // All stops including origin/destination
  drivers: ShipmentDriver[];       // Assigned drivers
  vehicles: ShipmentVehicle[];     // Assigned vehicles/equipment
  schedule: {
    plannedStart: Date;
    actualStart?: Date;
    plannedEnd: Date;
    actualEnd?: Date;
  };
  route?: ShipmentRoute;           // Route details
  tracking: ShipmentTracking;      // Tracking information
  costs: ShipmentCosts;            // Financial tracking
  documents: {                     // Related documents
    id: string;
    type: string;
    reference: string;
    fileUrl?: string;
  }[];
  clientId: string;                // Associated client
  customFields?: Record<string, unknown>; // Client-specific fields
  notes?: string;                  // General notes
  createdAt: Date;                 // Creation timestamp
  updatedAt: Date;                 // Last update timestamp
  createdBy: string;               // User ID who created
  updatedBy: string;               // User ID who last updated
}

/**
 * Interface for shipment summaries and list views
 */
export interface ShipmentSummary {
  id: string;
  reference: string;
  status: ShipmentStatus;
  priority: ShipmentPriority;      // ✅ FIXED: Use consistent type
  origin: {
    name: string;
    city: string;
    country: string;
  };
  destination: {
    name: string;
    city: string;
    country: string;
  };
  schedule: {
    plannedStart: Date;
    plannedEnd: Date;
  };
  client: {
    id: string;
    name: string;
  };
  cargoSummary: {
    count: number;
    totalWeight: number;
    weightUnit: 'kg' | 'lb' | 't';
    types: CargoType[];
  };
  driverName?: string; // Primary driver
  vehicleInfo?: string; // Primary vehicle
  alerts?: string[]; // Any active alerts
}

// ✅ TRACKING: Interfaces for tracking dashboard compatibility
export interface StatusUpdate {
  id: string;
  shipmentId: string;
  status: ShipmentStatus;
  notes: string;
  updatedBy: string;
  timestamp: string;
  location?: SimpleLocation;  // ✅ FIXED: Use SimpleLocation for tracking
}

// ✅ UNIFIED: TrackingData interface for dashboard compatibility
export interface TrackingData {
  shipmentId: string;
  waybillNumber: string;
  currentStatus: ShipmentStatus;
  estimatedDelivery: string;
  actualDelivery?: string;
  origin: string;
  destination: string;
  priority: ShipmentPriority;      // ✅ FIXED: Use consistent type
  lastUpdate: string;
  statusHistory: StatusUpdate[];
  isDelayed: boolean;
  delayReason?: string;
  currentLocation?: SimpleLocation; // ✅ FIXED: Use SimpleLocation for tracking
  assignedVehicle?: string;
  assignedDriver?: string;
  createdAt: string;
  updatedAt: string;
}

// ✅ DISPLAY: Status display configurations
export const STATUS_COLORS: Record<ShipmentStatus, string> = {
  [ShipmentStatus.PENDING]: 'bg-gray-200 text-gray-800',
  [ShipmentStatus.PLANNED]: 'bg-blue-100 text-blue-800',
  [ShipmentStatus.PICKED_UP]: 'bg-blue-200 text-blue-800',
  [ShipmentStatus.DISPATCHED]: 'bg-blue-300 text-blue-800',
  [ShipmentStatus.IN_TRANSIT]: 'bg-yellow-200 text-yellow-800',
  [ShipmentStatus.DELIVERED]: 'bg-green-200 text-green-800',
  [ShipmentStatus.COMPLETED]: 'bg-green-300 text-green-800',
  [ShipmentStatus.CANCELLED]: 'bg-red-500 text-white',
  [ShipmentStatus.DELAYED]: 'bg-red-200 text-red-800',
  [ShipmentStatus.EXCEPTION]: 'bg-red-400 text-white',
  [ShipmentStatus.INCIDENT]: 'bg-red-300 text-red-800',
  [ShipmentStatus.ON_HOLD]: 'bg-orange-200 text-orange-800',
};

export const STATUS_LABELS: Record<ShipmentStatus, string> = {
  [ShipmentStatus.PENDING]: 'Pending',
  [ShipmentStatus.PLANNED]: 'Planned',
  [ShipmentStatus.PICKED_UP]: 'Picked Up',
  [ShipmentStatus.DISPATCHED]: 'Dispatched',
  [ShipmentStatus.IN_TRANSIT]: 'In Transit',
  [ShipmentStatus.DELIVERED]: 'Delivered',
  [ShipmentStatus.COMPLETED]: 'Completed',
  [ShipmentStatus.CANCELLED]: 'Cancelled',
  [ShipmentStatus.DELAYED]: 'Delayed',
  [ShipmentStatus.EXCEPTION]: 'Exception',
  [ShipmentStatus.INCIDENT]: 'Incident',
  [ShipmentStatus.ON_HOLD]: 'On Hold',
};