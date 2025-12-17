// 🔧 FIXED: TrackingService with correct type usage
// File: src/features/Tracking/services/TrackingService.ts

import { TrackingData, ShipmentStatus, StatusUpdate, SimpleLocation } from '../../Shipments/types/shipment';
import { v4 as uuidv4 } from 'uuid';

// ✅ FIXED: Mock tracking data with correct SimpleLocation type
const mockTrackingData: TrackingData[] = [
  {
    shipmentId: 'ship-001',
    waybillNumber: 'SHIP-2025-0001',
    currentStatus: ShipmentStatus.IN_TRANSIT,
    estimatedDelivery: '2025-01-19T17:00:00',
    origin: 'Los Angeles, USA',
    destination: 'Chicago, USA',
    priority: 'NORMAL',
    lastUpdate: '2025-01-18T10:30:00',
    statusHistory: [
      {
        id: 'status-1',
        shipmentId: 'ship-001',
        status: ShipmentStatus.PENDING,
        notes: 'Shipment created',
        updatedBy: 'System',
        timestamp: '2025-01-15T14:30:00',
      },
      {
        id: 'status-2',
        shipmentId: 'ship-001',
        status: ShipmentStatus.PICKED_UP,
        notes: 'Shipment picked up from origin',
        updatedBy: 'John.Driver',
        timestamp: '2025-01-16T08:15:00',
        location: {
          latitude: 34.0522,
          longitude: -118.2437,
          timestamp: '2025-01-16T08:15:00',
          address: 'Los Angeles Warehouse'
        }
      },
      {
        id: 'status-3',
        shipmentId: 'ship-001',
        status: ShipmentStatus.IN_TRANSIT,
        notes: 'Shipment in transit',
        updatedBy: 'System',
        timestamp: '2025-01-17T19:00:00',
        location: {
          latitude: 35.1983,
          longitude: -111.6513,
          timestamp: '2025-01-17T19:00:00',
          address: 'Flagstaff Checkpoint'
        }
      }
    ],
    isDelayed: false,
    createdAt: '2025-01-15T14:30:00',
    updatedAt: '2025-01-18T10:30:00',
    currentLocation: {
      latitude: 35.1983,
      longitude: -111.6513,
      timestamp: '2025-01-17T19:00:00',
      address: 'Flagstaff Checkpoint'
    },
    assignedDriver: 'John Driver',
    assignedVehicle: 'TRK-001'
  },
  {
    shipmentId: 'ship-002',
    waybillNumber: 'SHIP-2025-0002',
    currentStatus: ShipmentStatus.PENDING,
    estimatedDelivery: '2025-01-25T16:00:00',
    origin: 'Detroit, MI, USA',
    destination: 'Columbus, OH, USA',
    priority: 'HIGH',
    lastUpdate: '2025-01-18T09:15:00',
    statusHistory: [
      {
        id: 'status-1',
        shipmentId: 'ship-002',
        status: ShipmentStatus.PENDING,
        notes: 'Shipment created and scheduled',
        updatedBy: 'System',
        timestamp: '2025-01-18T09:15:00',
      }
    ],
    isDelayed: false,
    createdAt: '2025-01-18T09:15:00',
    updatedAt: '2025-01-18T09:15:00',
    assignedDriver: 'Sarah Wilson',
    assignedVehicle: 'TRK-002'
  },
  {
    shipmentId: 'ship-003',
    waybillNumber: 'SHIP-2025-0003',
    currentStatus: ShipmentStatus.DELIVERED,
    estimatedDelivery: '2025-01-15T13:00:00',
    actualDelivery: '2025-01-15T12:45:00',
    origin: 'New York, NY, USA',
    destination: 'Boston, MA, USA',
    priority: 'NORMAL',
    lastUpdate: '2025-01-15T12:45:00',
    statusHistory: [
      {
        id: 'status-1',
        shipmentId: 'ship-003',
        status: ShipmentStatus.PENDING,
        notes: 'Shipment created',
        updatedBy: 'System',
        timestamp: '2025-01-14T08:00:00',
      },
      {
        id: 'status-2',
        shipmentId: 'ship-003',
        status: ShipmentStatus.PICKED_UP,
        notes: 'Shipment picked up from origin',
        updatedBy: 'Mike.Driver',
        timestamp: '2025-01-14T09:30:00',
      },
      {
        id: 'status-3',
        shipmentId: 'ship-003',
        status: ShipmentStatus.IN_TRANSIT,
        notes: 'Shipment in transit',
        updatedBy: 'System',
        timestamp: '2025-01-14T11:15:00',
      },
      {
        id: 'status-4',
        shipmentId: 'ship-003',
        status: ShipmentStatus.DELIVERED,
        notes: 'Shipment delivered successfully',
        updatedBy: 'Mike.Driver',
        timestamp: '2025-01-15T12:45:00',
        location: {
          latitude: 42.3601,
          longitude: -71.0589,
          timestamp: '2025-01-15T12:45:00',
          address: 'Boston Receiving Facility'
        }
      }
    ],
    isDelayed: false,
    createdAt: '2025-01-14T08:00:00',
    updatedAt: '2025-01-15T12:45:00',
    currentLocation: {
      latitude: 42.3601,
      longitude: -71.0589,
      timestamp: '2025-01-15T12:45:00',
      address: 'Boston Receiving Facility'
    },
    assignedDriver: 'Mike Thompson',
    assignedVehicle: 'TRK-003'
  },
  {
    shipmentId: 'ship-004',
    waybillNumber: 'SHIP-2025-0004',
    currentStatus: ShipmentStatus.DELAYED,
    estimatedDelivery: '2025-01-17T15:00:00',
    origin: 'Miami, FL, USA',
    destination: 'Atlanta, GA, USA',
    priority: 'HIGH',
    lastUpdate: '2025-01-17T09:30:00',
    statusHistory: [
      {
        id: 'status-1',
        shipmentId: 'ship-004',
        status: ShipmentStatus.PENDING,
        notes: 'Shipment created',
        updatedBy: 'System',
        timestamp: '2025-01-16T07:00:00',
      },
      {
        id: 'status-2',
        shipmentId: 'ship-004',
        status: ShipmentStatus.PICKED_UP,
        notes: 'Shipment picked up from origin',
        updatedBy: 'Sarah.Driver',
        timestamp: '2025-01-16T08:30:00',
      },
      {
        id: 'status-3',
        shipmentId: 'ship-004',
        status: ShipmentStatus.DELAYED,
        notes: 'Shipment delayed due to severe weather conditions',
        updatedBy: 'System',
        timestamp: '2025-01-17T09:30:00',
        location: {
          latitude: 30.4383,
          longitude: -84.2807,
          timestamp: '2025-01-17T09:30:00',
          address: 'Tallahassee Area'
        }
      }
    ],
    isDelayed: true,
    createdAt: '2025-01-16T07:00:00',
    updatedAt: '2025-01-17T09:30:00',
    delayReason: 'Severe weather conditions',
    currentLocation: {
      latitude: 30.4383,
      longitude: -84.2807,
      timestamp: '2025-01-17T09:30:00',
      address: 'Tallahassee Area'
    },
    assignedDriver: 'Sarah Martinez',
    assignedVehicle: 'TRK-004'
  }
];

// Local storage key
const STORAGE_KEY = 'cargotrack_tracking';

/**
 * Initialize local storage with mock data if empty
 */
const initializeStorage = (): void => {
  const storedTracking = localStorage.getItem(STORAGE_KEY);
  if (!storedTracking) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockTrackingData));
  }
};

/**
 * ✅ FIXED: Create a SimpleLocation object from coordinates and address
 */
const createSimpleLocation = (
  latitude: number, 
  longitude: number, 
  timestamp: string,
  address: string = 'Unknown location'  // ✅ FIXED: Default value instead of optional
): SimpleLocation => {
  return {
    latitude,
    longitude,
    timestamp,
    address
  };
};

/**
 * TrackingService for handling shipment tracking data
 */
class TrackingService {
  /**
   * Get all active shipments
   */
  static async getActiveShipments(): Promise<TrackingData[]> {
    // Initialize storage if needed
    initializeStorage();

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const storedTracking = localStorage.getItem(STORAGE_KEY);
        resolve(JSON.parse(storedTracking || "[]"));
      }, 500);
    });
  }

  /**
   * Get tracking details for a specific shipment
   */
  static async getShipmentTracking(shipmentId: string): Promise<TrackingData | null> {
    // Initialize storage if needed
    initializeStorage();

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const storedTracking = localStorage.getItem(STORAGE_KEY);
        const trackingList = JSON.parse(storedTracking || "[]") as TrackingData[];
        const tracking = trackingList.find((item) => item.shipmentId === shipmentId) || null;
        resolve(tracking);
      }, 300);
    });
  }

  /**
   * ✅ FIXED: Update tracking status for a shipment
   */
  static async updateTrackingStatus(
    shipmentId: string, 
    status: ShipmentStatus, 
    notes: string,
    location?: { latitude: number; longitude: number; address?: string }
  ): Promise<TrackingData | null> {
    // Initialize storage if needed
    initializeStorage();

    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const storedTracking = localStorage.getItem(STORAGE_KEY);
          const trackingList = JSON.parse(storedTracking || "[]") as TrackingData[];
          
          // Find tracking index
          const trackingIndex = trackingList.findIndex((item) => item.shipmentId === shipmentId);
          
          if (trackingIndex === -1) {
            reject(new Error(`Shipment with ID ${shipmentId} not found`));
            return;
          }
          
          const tracking = trackingList[trackingIndex];
          const timestamp = new Date().toISOString();
          
          // ✅ FIXED: Create a SimpleLocation object if location data is provided
          let locationData: SimpleLocation | undefined;
          if (location) {
            locationData = createSimpleLocation(
              location.latitude,
              location.longitude,
              timestamp,
              location.address || 'Location update'  // ✅ FIXED: Always provide address
            );
          }
          
          // Create a status update
          const statusUpdate: StatusUpdate = {
            id: `status-${uuidv4().substring(0, 8)}`,
            shipmentId,
            status,
            notes,
            updatedBy: 'Current User',
            timestamp,
            location: locationData  // ✅ FIXED: Now uses SimpleLocation
          };
          
          // ✅ FIXED: Update the tracking data with proper typing
          const updatedTracking: TrackingData = {
            ...tracking,
            currentStatus: status,
            lastUpdate: timestamp,
            updatedAt: timestamp,
            statusHistory: [...tracking.statusHistory, statusUpdate],
            isDelayed: status === ShipmentStatus.DELAYED || tracking.isDelayed,
            // ✅ FIXED: Properly handle currentLocation as SimpleLocation
            ...(locationData && { currentLocation: locationData }),
            // Update actual delivery if status is delivered
            ...(status === ShipmentStatus.DELIVERED && { actualDelivery: timestamp }),
            // Update delay reason if status is delayed
            ...(status === ShipmentStatus.DELAYED && !tracking.delayReason && { delayReason: notes })
          };
          
          // Replace in list
          trackingList[trackingIndex] = updatedTracking;
          
          // Save to storage
          localStorage.setItem(STORAGE_KEY, JSON.stringify(trackingList));
          
          resolve(updatedTracking);
        } catch (error) {
          reject(error);
        }
      }, 500);
    });
  }

  /**
   * Get shipments by status
   */
  static async getShipmentsByStatus(status: ShipmentStatus): Promise<TrackingData[]> {
    const allShipments = await this.getActiveShipments();
    return allShipments.filter(shipment => shipment.currentStatus === status);
  }

  /**
   * Get delayed shipments
   */
  static async getDelayedShipments(): Promise<TrackingData[]> {
    const allShipments = await this.getActiveShipments();
    return allShipments.filter(shipment => shipment.isDelayed);
  }

  /**
   * Search shipments by waybill number
   */
  static async searchShipments(searchTerm: string): Promise<TrackingData[]> {
    const allShipments = await this.getActiveShipments();
    const normalizedSearch = searchTerm.toLowerCase();
    return allShipments.filter(shipment => 
      shipment.waybillNumber.toLowerCase().includes(normalizedSearch) ||
      shipment.shipmentId.toLowerCase().includes(normalizedSearch) ||
      shipment.origin.toLowerCase().includes(normalizedSearch) ||
      shipment.destination.toLowerCase().includes(normalizedSearch)
    );
  }

  /**
   * ✅ ADDED: Create a new shipment tracking record
   */
  static async createShipmentTracking(
    shipmentData: Omit<TrackingData, 'shipmentId' | 'createdAt' | 'updatedAt' | 'statusHistory'>
  ): Promise<TrackingData> {
    // Initialize storage if needed
    initializeStorage();

    return new Promise((resolve) => {
      setTimeout(() => {
        const timestamp = new Date().toISOString();
        const shipmentId = `ship-${Date.now()}`;
        
        // Create initial status update
        const initialStatusUpdate: StatusUpdate = {
          id: `status-${uuidv4().substring(0, 8)}`,
          shipmentId,
          status: shipmentData.currentStatus,
          notes: 'Shipment created',
          updatedBy: 'System',
          timestamp,
        };

        // Create the tracking record
        const newTracking: TrackingData = {
          ...shipmentData,
          shipmentId,
          createdAt: timestamp,
          updatedAt: timestamp,
          statusHistory: [initialStatusUpdate],
        };

        // Add to storage
        const storedTracking = localStorage.getItem(STORAGE_KEY);
        const trackingList = JSON.parse(storedTracking || "[]") as TrackingData[];
        trackingList.push(newTracking);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trackingList));

        resolve(newTracking);
      }, 300);
    });
  }
}

export default TrackingService;

// ✅ FIXED: Export utility functions with proper typing
export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString));
};

export const getStatusColor = (status: ShipmentStatus): string => {
  const colors = {
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
  return colors[status] || 'bg-gray-200 text-gray-800';
};

// ✅ ADDED: Helper function to create SimpleLocation objects
export const createLocationUpdate = (
  latitude: number,
  longitude: number,
  address?: string
): SimpleLocation => {
  return createSimpleLocation(latitude, longitude, new Date().toISOString(), address);
};