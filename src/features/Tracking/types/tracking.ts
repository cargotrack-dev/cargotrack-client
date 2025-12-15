// src/features/Tracking/types/tracking.ts
// ✅ FIXED: Cleaned up duplicate interfaces and consolidated types

/**
 * Enum for shipment statuses in the tracking module
 */
export enum ShipmentStatus {
    PENDING = 'PENDING',
    PICKED_UP = 'PICKED_UP',
    IN_TRANSIT = 'IN_TRANSIT',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
    DELAYED = 'DELAYED',
    EXCEPTION = 'EXCEPTION',
    ON_HOLD = 'ON_HOLD',
    ASSIGNED = 'ASSIGNED' // ✅ FIXED: Consistent with other enum values
}

/**
 * Interface for a location
 */
export interface Location {
    latitude: number;
    longitude: number;
    timestamp: string;
    address?: string;
}

/**
 * Interface for status updates
 */
export interface StatusUpdate {
    id: string;
    shipmentId: string;
    status: ShipmentStatus;
    notes: string;
    updatedBy: string;
    timestamp: string;
    location?: Location;
}

/**
 * ✅ FIXED: Consolidated TrackingData interface with all necessary properties
 */
export interface TrackingData {
    shipmentId: string;
    waybillNumber: string;
    currentStatus: ShipmentStatus;
    estimatedDelivery: string;
    actualDelivery?: string;
    origin: string;
    destination: string;
    priority: string;
    lastUpdate: string;
    statusHistory: StatusUpdate[];
    isDelayed: boolean;
    delayReason?: string;
    currentLocation?: Location;
    assignedVehicle?: string;
    assignedDriver?: string;
    // ✅ ADDED: Properties needed for compatibility with components
    createdAt: string;
    updatedAt: string;
}

// Constants for status color coding and icons
export const STATUS_COLORS = {
    [ShipmentStatus.PENDING]: 'bg-gray-200 text-gray-800',
    [ShipmentStatus.PICKED_UP]: 'bg-blue-200 text-blue-800', // ✅ ADDED: Missing status
    [ShipmentStatus.ASSIGNED]: 'bg-blue-200 text-blue-800',
    [ShipmentStatus.IN_TRANSIT]: 'bg-yellow-200 text-yellow-800',
    [ShipmentStatus.DELIVERED]: 'bg-green-200 text-green-800',
    [ShipmentStatus.DELAYED]: 'bg-red-200 text-red-800',
    [ShipmentStatus.CANCELLED]: 'bg-red-500 text-white',
    [ShipmentStatus.EXCEPTION]: 'bg-red-400 text-white', // ✅ ADDED: Missing status
    [ShipmentStatus.ON_HOLD]: 'bg-orange-200 text-orange-800' // ✅ ADDED: Missing status
};

export const STATUS_LABELS = {
    [ShipmentStatus.PENDING]: 'Pending',
    [ShipmentStatus.PICKED_UP]: 'Picked Up', // ✅ ADDED: Missing status
    [ShipmentStatus.ASSIGNED]: 'Assigned',
    [ShipmentStatus.IN_TRANSIT]: 'In Transit',
    [ShipmentStatus.DELIVERED]: 'Delivered',
    [ShipmentStatus.DELAYED]: 'Delayed',
    [ShipmentStatus.CANCELLED]: 'Cancelled',
    [ShipmentStatus.EXCEPTION]: 'Exception', // ✅ ADDED: Missing status
    [ShipmentStatus.ON_HOLD]: 'On Hold' // ✅ ADDED: Missing status
};