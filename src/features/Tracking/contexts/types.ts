// src/contexts/tracking/types.ts
export enum ShipmentStatus {
  PENDING = 'pending',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  DELAYED = 'delayed',
  EXCEPTION = 'exception'
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface TrackingEvent {
  id: string;
  shipmentId: string;
  eventType: string;
  timestamp: string; // ISO string
  location: Location;
  description: string;
  createdBy: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  status: ShipmentStatus;
  origin: Location;
  destination: Location;
  departureTime?: string; // ISO string
  estimatedArrival: string; // ISO string
  actualArrival?: string; // ISO string
  vehicleId?: string;
  driverId?: string;
  clientId: string;
  clientName: string;
  waybillId?: string;
  events: TrackingEvent[];
  currentLocation?: Location;
  lastUpdated: string; // ISO string
  createdAt: string; // ISO string
  notes?: string;
}

export interface TrackingContextType {
  shipments: Shipment[];
  isLoading: boolean;
  error: string | null;
  selectedShipment: Shipment | null;
  
  // Shipment operations
  loadShipments: () => Promise<void>;
  getShipmentById: (id: string) => Shipment | null;
  getShipmentByTrackingNumber: (trackingNumber: string) => Shipment | null;
  createShipment: (data: Omit<Shipment, 'id' | 'events' | 'lastUpdated' | 'createdAt'>) => Promise<Shipment>;
  updateShipment: (id: string, data: Partial<Shipment>) => Promise<Shipment>;
  deleteShipment: (id: string) => Promise<void>;
  fetchShipmentById: (id: string) => Promise<void>;
  
  // Tracking events
  addTrackingEvent: (shipmentId: string, event: Omit<TrackingEvent, 'id'>) => Promise<Shipment>;
  updateShipmentStatus: (shipmentId: string, status: ShipmentStatus, notes?: string) => Promise<Shipment>;
  markAsDelivered: (shipmentId: string, deliveryDetails: {
    timestamp: string;
    location: Location;
    notes?: string;
  }) => Promise<Shipment>;
  
  // Location updates
  updateShipmentLocation: (shipmentId: string, location: Location, timestamp: string) => Promise<Shipment>;
  getShipmentCurrentLocation: (shipmentId: string) => Location | null;
  
  // Filtering and search
  getShipmentsByStatus: (status: ShipmentStatus) => Shipment[];
  getShipmentsByClient: (clientId: string) => Shipment[];
  getShipmentsByVehicle: (vehicleId: string) => Shipment[];
  getShipmentsByDriver: (driverId: string) => Shipment[];
}