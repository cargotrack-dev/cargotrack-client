// src/contexts/tracking/provider.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { TrackingContext } from './context';
import {
  Shipment,
  ShipmentStatus,
  TrackingEvent,
  Location
} from './types';
import { useToast } from '@features/UI/components/ui/toast/useToast';

// Helper function to generate unique IDs
const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Helper to generate tracking numbers
const generateTrackingNumber = (): string => {
  const prefix = 'CT';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}${timestamp}${random}`;
};

// Mock data for shipments
const mockShipments: Shipment[] = [
  {
    id: 'ship-1',
    trackingNumber: 'CT123456789',
    status: ShipmentStatus.IN_TRANSIT,
    origin: {
      latitude: 40.7128,
      longitude: -74.0060,
      address: '123 Shipping Lane',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postalCode: '10001'
    },
    destination: {
      latitude: 34.0522,
      longitude: -118.2437,
      address: '456 Delivery Blvd',
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      postalCode: '90001'
    },
    departureTime: '2025-01-15T08:00:00Z',
    estimatedArrival: '2025-01-20T16:00:00Z',
    vehicleId: 'vehicle-1',
    driverId: 'driver-1',
    clientId: 'client-1',
    clientName: 'Acme Corporation',
    waybillId: 'waybill-1',
    events: [
      {
        id: 'event-1',
        shipmentId: 'ship-1',
        eventType: 'PICKUP',
        timestamp: '2025-01-15T08:00:00Z',
        location: {
          latitude: 40.7128,
          longitude: -74.0060,
          city: 'New York',
          state: 'NY',
          country: 'USA'
        },
        description: 'Shipment picked up',
        createdBy: 'user-1'
      },
      {
        id: 'event-2',
        shipmentId: 'ship-1',
        eventType: 'CHECKPOINT',
        timestamp: '2025-01-17T14:30:00Z',
        location: {
          latitude: 39.9526,
          longitude: -75.1652,
          city: 'Philadelphia',
          state: 'PA',
          country: 'USA'
        },
        description: 'Shipment arrived at sorting facility',
        createdBy: 'user-2'
      }
    ],
    currentLocation: {
      latitude: 39.9526,
      longitude: -75.1652,
      city: 'Philadelphia',
      state: 'PA',
      country: 'USA'
    },
    lastUpdated: '2025-01-17T14:30:00Z',
    createdAt: '2025-01-10T15:45:00Z',
    notes: 'High priority shipment'
  },
  {
    id: 'ship-2',
    trackingNumber: 'CT987654321',
    status: ShipmentStatus.DELIVERED,
    origin: {
      latitude: 41.8781,
      longitude: -87.6298,
      address: '789 Sender Street',
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      postalCode: '60601'
    },
    destination: {
      latitude: 29.7604,
      longitude: -95.3698,
      address: '101 Recipient Road',
      city: 'Houston',
      state: 'TX',
      country: 'USA',
      postalCode: '77001'
    },
    departureTime: '2025-01-10T09:15:00Z',
    estimatedArrival: '2025-01-13T11:00:00Z',
    actualArrival: '2025-01-13T10:45:00Z',
    vehicleId: 'vehicle-2',
    driverId: 'driver-2',
    clientId: 'client-2',
    clientName: 'Globex Industries',
    waybillId: 'waybill-2',
    events: [
      {
        id: 'event-3',
        shipmentId: 'ship-2',
        eventType: 'PICKUP',
        timestamp: '2025-01-10T09:15:00Z',
        location: {
          latitude: 41.8781,
          longitude: -87.6298,
          city: 'Chicago',
          state: 'IL',
          country: 'USA'
        },
        description: 'Shipment picked up',
        createdBy: 'user-1'
      },
      {
        id: 'event-4',
        shipmentId: 'ship-2',
        eventType: 'CHECKPOINT',
        timestamp: '2025-01-11T18:20:00Z',
        location: {
          latitude: 38.6270,
          longitude: -90.1994,
          city: 'St. Louis',
          state: 'MO',
          country: 'USA'
        },
        description: 'Shipment in transit',
        createdBy: 'user-2'
      },
      {
        id: 'event-5',
        shipmentId: 'ship-2',
        eventType: 'DELIVERY',
        timestamp: '2025-01-13T10:45:00Z',
        location: {
          latitude: 29.7604,
          longitude: -95.3698,
          city: 'Houston',
          state: 'TX',
          country: 'USA'
        },
        description: 'Shipment delivered',
        createdBy: 'user-2'
      }
    ],
    currentLocation: {
      latitude: 29.7604,
      longitude: -95.3698,
      city: 'Houston',
      state: 'TX',
      country: 'USA'
    },
    lastUpdated: '2025-01-13T10:45:00Z',
    createdAt: '2025-01-05T14:00:00Z'
  }
];

export const TrackingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const { addToast } = useToast();

  // Load shipments
  const loadShipments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // For now, use mock data
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      setShipments(mockShipments);
    } catch (err) {
      console.error('Failed to load shipments:', err);
      setError('Failed to load shipments. Please try again.');
      addToast({
        title: 'Error',
        description: 'Failed to load shipments',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  // Load shipments on mount
  useEffect(() => {
    loadShipments();
  }, [loadShipments]);

  // Get shipment by ID
  const getShipmentById = (id: string): Shipment | null => {
    return shipments.find(shipment => shipment.id === id) || null;
  };

  // Get shipment by tracking number
  const getShipmentByTrackingNumber = (trackingNumber: string): Shipment | null => {
    return shipments.find(shipment => shipment.trackingNumber === trackingNumber) || null;
  };

  // Fetch shipment by ID (sets selectedShipment)
  const fetchShipmentById = async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const shipment = shipments.find(s => s.id === id);
      
      if (shipment) {
        setSelectedShipment(shipment);
      } else {
        throw new Error('Shipment not found');
      }
    } catch (err) {
      console.error('Failed to fetch shipment:', err);
      setError('Failed to fetch shipment details');
      addToast({
        title: 'Error',
        description: 'Failed to fetch shipment details',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new shipment
  const createShipment = async (
    data: Omit<Shipment, 'id' | 'events' | 'lastUpdated' | 'createdAt'>
  ): Promise<Shipment> => {
    setIsLoading(true);
    setError(null);
    try {
      const now = new Date().toISOString();
      
      // Generate tracking number if not provided
      const trackingNumber = data.trackingNumber || generateTrackingNumber();
      
      const newShipment: Shipment = {
        ...data,
        id: `ship-${generateId()}`,
        trackingNumber,
        events: [],
        lastUpdated: now,
        createdAt: now
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update local state
      setShipments(prev => [...prev, newShipment]);

      addToast({
        title: 'Shipment Created',
        description: `Shipment with tracking number ${trackingNumber} has been created`,
        variant: 'default'
      });

      return newShipment;
    } catch (err) {
      console.error('Failed to create shipment:', err);
      setError('Failed to create shipment');
      addToast({
        title: 'Error',
        description: 'Failed to create shipment',
        variant: 'destructive'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update a shipment
  const updateShipment = async (
    id: string,
    data: Partial<Shipment>
  ): Promise<Shipment> => {
    setIsLoading(true);
    setError(null);
    try {
      const shipmentToUpdate = shipments.find(s => s.id === id);
      if (!shipmentToUpdate) {
        throw new Error('Shipment not found');
      }

      const now = new Date().toISOString();
      const updatedShipment = {
        ...shipmentToUpdate,
        ...data,
        lastUpdated: now
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update local state
      setShipments(prev => prev.map(s => s.id === id ? updatedShipment : s));
      
      // Update selected shipment if it's the one being updated
      if (selectedShipment && selectedShipment.id === id) {
        setSelectedShipment(updatedShipment);
      }

      addToast({
        title: 'Shipment Updated',
        description: `Shipment with tracking number ${updatedShipment.trackingNumber} has been updated`,
        variant: 'default'
      });

      return updatedShipment;
    } catch (err) {
      console.error('Failed to update shipment:', err);
      setError('Failed to update shipment');
      addToast({
        title: 'Error',
        description: 'Failed to update shipment',
        variant: 'destructive'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a shipment
  const deleteShipment = async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update local state
      setShipments(prev => prev.filter(s => s.id !== id));
      
      // Clear selected shipment if it's the one being deleted
      if (selectedShipment && selectedShipment.id === id) {
        setSelectedShipment(null);
      }

      addToast({
        title: 'Shipment Deleted',
        description: 'Shipment has been deleted successfully',
        variant: 'default'
      });
    } catch (err) {
      console.error('Failed to delete shipment:', err);
      setError('Failed to delete shipment');
      addToast({
        title: 'Error',
        description: 'Failed to delete shipment',
        variant: 'destructive'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Add a tracking event to a shipment
  const addTrackingEvent = async (
    shipmentId: string,
    event: Omit<TrackingEvent, 'id'>
  ): Promise<Shipment> => {
    const shipment = getShipmentById(shipmentId);
    if (!shipment) {
      throw new Error('Shipment not found');
    }

    const newEvent: TrackingEvent = {
      ...event,
      id: `event-${generateId()}`,
      shipmentId
    };

    const updatedEvents = [...shipment.events, newEvent];
    const now = new Date().toISOString();
    
    return updateShipment(shipmentId, { 
      events: updatedEvents,
      lastUpdated: now,
      currentLocation: event.location
    });
  };

  // Update shipment status
  const updateShipmentStatus = async (
    shipmentId: string,
    status: ShipmentStatus,
    notes?: string
  ): Promise<Shipment> => {
    const shipment = getShipmentById(shipmentId);
    if (!shipment) {
      throw new Error('Shipment not found');
    }

    // Create a status change event
    const now = new Date().toISOString();
    const statusEvent: Omit<TrackingEvent, 'id'> = {
      shipmentId,
      eventType: `STATUS_${status.toUpperCase()}`,
      timestamp: now,
      location: shipment.currentLocation || shipment.origin,
      description: `Status changed to ${status}${notes ? `: ${notes}` : ''}`,
      createdBy: 'current-user' // In a real app, get from auth context
    };

    // First add the event
    await addTrackingEvent(shipmentId, statusEvent);
    
    // Then update the status
    return updateShipment(shipmentId, { 
      status,
      notes: notes ? `${shipment.notes ? shipment.notes + '\n' : ''}${notes}` : shipment.notes
    });
  };

  // Mark a shipment as delivered
  const markAsDelivered = async (
    shipmentId: string,
    deliveryDetails: {
      timestamp: string;
      location: Location;
      notes?: string;
    }
  ): Promise<Shipment> => {
    const shipment = getShipmentById(shipmentId);
    if (!shipment) {
      throw new Error('Shipment not found');
    }

    // Create a delivery event
    const deliveryEvent: Omit<TrackingEvent, 'id'> = {
      shipmentId,
      eventType: 'DELIVERY',
      timestamp: deliveryDetails.timestamp,
      location: deliveryDetails.location,
      description: `Shipment delivered${deliveryDetails.notes ? `: ${deliveryDetails.notes}` : ''}`,
      createdBy: 'current-user' // In a real app, get from auth context
    };

    // First add the event
    await addTrackingEvent(shipmentId, deliveryEvent);
    
    // Then update the shipment
    return updateShipment(shipmentId, { 
      status: ShipmentStatus.DELIVERED,
      actualArrival: deliveryDetails.timestamp,
      currentLocation: deliveryDetails.location,
      notes: deliveryDetails.notes ? 
        `${shipment.notes ? shipment.notes + '\n' : ''}${deliveryDetails.notes}` : 
        shipment.notes
    });
  };

  // Update shipment location
  const updateShipmentLocation = async (
    shipmentId: string,
    location: Location,
    timestamp: string
  ): Promise<Shipment> => {
    const shipment = getShipmentById(shipmentId);
    if (!shipment) {
      throw new Error('Shipment not found');
    }

    // Create a location update event
    const locationEvent: Omit<TrackingEvent, 'id'> = {
      shipmentId,
      eventType: 'LOCATION_UPDATE',
      timestamp,
      location,
      description: 'Location updated',
      createdBy: 'current-user' // In a real app, get from auth context
    };

    // Add the event
    await addTrackingEvent(shipmentId, locationEvent);
    
    // Update the current location
    return updateShipment(shipmentId, { 
      currentLocation: location,
      lastUpdated: timestamp
    });
  };

  // Get shipment current location
  const getShipmentCurrentLocation = (shipmentId: string): Location | null => {
    const shipment = getShipmentById(shipmentId);
    if (!shipment) {
      return null;
    }
    
    return shipment.currentLocation || null;
  };

  // Get shipments by status
  const getShipmentsByStatus = (status: ShipmentStatus): Shipment[] => {
    return shipments.filter(shipment => shipment.status === status);
  };

  // Get shipments by client
  const getShipmentsByClient = (clientId: string): Shipment[] => {
    return shipments.filter(shipment => shipment.clientId === clientId);
  };

  // Get shipments by vehicle
  const getShipmentsByVehicle = (vehicleId: string): Shipment[] => {
    return shipments.filter(shipment => shipment.vehicleId === vehicleId);
  };

  // Get shipments by driver
  const getShipmentsByDriver = (driverId: string): Shipment[] => {
    return shipments.filter(shipment => shipment.driverId === driverId);
  };

  return (
    <TrackingContext.Provider
      value={{
        shipments,
        isLoading,
        error,
        selectedShipment,
        
        // Shipment operations
        loadShipments,
        getShipmentById,
        getShipmentByTrackingNumber,
        createShipment,
        updateShipment,
        deleteShipment,
        fetchShipmentById,
        
        // Tracking events
        addTrackingEvent,
        updateShipmentStatus,
        markAsDelivered,
        
        // Location updates
        updateShipmentLocation,
        getShipmentCurrentLocation,
        
        // Filtering and search
        getShipmentsByStatus,
        getShipmentsByClient,
        getShipmentsByVehicle,
        getShipmentsByDriver
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
};