// src/hooks/useRealTimeTracking.ts
import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

// Define types for location data
interface LocationData {
  latitude: number;
  longitude: number;
  speed?: number;
  heading?: number;
  altitude?: number;
  accuracy?: number;
  timestamp: string;
}

interface LocationUpdate {
  shipmentId: string;
  location: LocationData;
}

interface UseRealTimeTrackingResult {
  location: LocationData | null;
  isConnected: boolean;
  error: string | null;
}

const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

export const useRealTimeTracking = (shipmentId: string | null): UseRealTimeTrackingResult => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shipmentId) return;

    // Connect to the WebSocket server
    const socket: Socket = io(SOCKET_SERVER_URL);

    // Set up connection event handlers
    socket.on('connect', () => {
      setIsConnected(true);
      // Subscribe to updates for this specific shipment
      socket.emit('subscribe', { shipmentId });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('connect_error', (err: Error) => {
      setError(err.message || 'Socket connection error');
    });

    // Listen for location updates
    socket.on('location_update', (data: LocationUpdate) => {
      if (data.shipmentId === shipmentId) {
        setLocation(data.location);
      }
    });

    // Clean up on unmount
    return () => {
      socket.emit('unsubscribe', { shipmentId });
      socket.disconnect();
    };
  }, [shipmentId]);

  return { location, isConnected, error };
};