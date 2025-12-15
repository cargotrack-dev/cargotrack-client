// src/components/tracking/LiveTrackingMap.tsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, LatLngBoundsExpression, LatLngTuple } from 'leaflet';
import { io } from 'socket.io-client';
import { Shipment } from '@features/Shipments/types/shipment';
import { Card, CardContent, CardHeader, CardTitle } from '@features/UI/components/ui/card';
import { Truck, Calendar, Clock } from 'lucide-react';

// Custom truck icon for the map
const truckIcon = new Icon({
  iconUrl: '/assets/truck-icon.png',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

interface TrackingLocation {
  latitude: number;
  longitude: number;
  timestamp: Date;
  speed?: number;
  heading?: number;
}

interface LiveTrackingMapProps {
  shipmentId: string;
  initialLocations?: TrackingLocation[];
  origin: { latitude: number; longitude: number; name: string };
  destination: { latitude: number; longitude: number; name: string };
}

const LiveTrackingMap: React.FC<LiveTrackingMapProps> = ({ 
  shipmentId, 
  initialLocations = [],
  origin,
  destination
}) => {
  const [currentLocation, setCurrentLocation] = useState<TrackingLocation | null>(null);
  const [trackingPath, setTrackingPath] = useState<[number, number][]>(
    initialLocations.map(loc => [loc.latitude, loc.longitude])
  );
  const [shipmentInfo, setShipmentInfo] = useState<Shipment | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect to the tracking socket server
    const newSocket = io(`${process.env.REACT_APP_SOCKET_URL}/tracking`);
    
    newSocket.on('connect', () => {
      console.log('Connected to tracking server');
      setIsConnected(true);
      
      // Subscribe to updates for this specific shipment
      newSocket.emit('subscribe', { shipmentId });
    });
    
    newSocket.on('disconnect', () => {
      console.log('Disconnected from tracking server');
      setIsConnected(false);
    });
    
    newSocket.on('location_update', (data: { 
      location: TrackingLocation, 
      shipment: Shipment 
    }) => {
      setCurrentLocation(data.location);
      setShipmentInfo(data.shipment);
      
      // Add new point to the tracking path
      setTrackingPath(prevPath => [
        ...prevPath, 
        [data.location.latitude, data.location.longitude]
      ]);
    });
    
    // Clean up on unmount
    return () => {
      newSocket.disconnect();
    };
  }, [shipmentId]);

  // Calculate map bounds to show all relevant points
  const getBounds = (): LatLngBoundsExpression => {
    const points: LatLngTuple[] = [
      [origin.latitude, origin.longitude],
      [destination.latitude, destination.longitude],
    ];
    
    if (currentLocation) {
      points.push([currentLocation.latitude, currentLocation.longitude]);
    }
    
    return points;
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Live Tracking</CardTitle>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isConnected ? "Connected" : "Disconnected"}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[500px] relative">
          {currentLocation ? (
            <div className="absolute top-4 right-4 z-10 bg-white p-3 rounded-md shadow-md max-w-xs">
              <div className="flex items-center mb-2">
                <Truck className="h-5 w-5 text-blue-600 mr-2" />
                <span className="font-bold">Current Status</span>
              </div>
              <div className="text-sm space-y-1">
                <p>
                  <Clock className="h-4 w-4 inline mr-1 text-gray-500" />
                  Last Updated: {formatDateTime(currentLocation.timestamp)}
                </p>
                <p>
                  <span className="font-medium">Speed:</span> {currentLocation.speed || 0} mph
                </p>
                {shipmentInfo?.tracking?.currentEta && (
                  <p>
                    <Calendar className="h-4 w-4 inline mr-1 text-gray-500" />
                    ETA: {formatDateTime(shipmentInfo.tracking.currentEta)}
                  </p>
                )}
              </div>
            </div>
          ) : null}

          <MapContainer 
            bounds={getBounds()} 
            style={{ height: '100%', width: '100%' }} 
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Origin marker */}
            <Marker position={[origin.latitude, origin.longitude]}>
              <Popup>
                <strong>Origin:</strong> {origin.name}
              </Popup>
            </Marker>
            
            {/* Destination marker */}
            <Marker position={[destination.latitude, destination.longitude]}>
              <Popup>
                <strong>Destination:</strong> {destination.name}
              </Popup>
            </Marker>
            
            {/* Current location */}
            {currentLocation && (
              <Marker 
                position={[currentLocation.latitude, currentLocation.longitude]} 
                icon={truckIcon}
              >
                <Popup>
                  <div>
                    <strong>Current Location</strong>
                    <p>Speed: {currentLocation.speed || 0} mph</p>
                    <p>Last Updated: {formatDateTime(currentLocation.timestamp)}</p>
                  </div>
                </Popup>
              </Marker>
            )}
            
            {/* Path line */}
            {trackingPath.length > 1 && (
              <Polyline 
                positions={trackingPath as [number, number][]} 
                color="#3B82F6" 
                weight={3} 
                opacity={0.7} 
              />
            )}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveTrackingMap;