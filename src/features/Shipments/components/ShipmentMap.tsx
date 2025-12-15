// src/components/tracking/ShipmentMap.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrackingData, ShipmentStatus, STATUS_COLORS, STATUS_LABELS } from '@features/Shipments/types/shipment';
import { Card, CardContent } from '@features/UI/components/ui/card';
import { Button } from '@features/UI/components/ui/button';


interface ShipmentMapProps {
  shipments: TrackingData[];  // ✅ Use unified type
}

export const ShipmentMap: React.FC<ShipmentMapProps> = ({ shipments }) => {
  const navigate = useNavigate();
  const [selectedShipment, setSelectedShipment] = useState<TrackingData | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // In a real implementation, we would initialize a map library here
    // such as Google Maps, Mapbox, or Leaflet
    // For this demo, we'll simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const viewShipmentDetails = (id: string) => {
    navigate(`/tracking/${id}`);
  };

  // Format date for readable display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (!mapLoaded) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="ml-3">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="h-[600px] relative border rounded-lg overflow-hidden">
      {/* This would be replaced with an actual map component in a real implementation */}
      <div className="h-full w-full bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-2">Map Visualization</p>
          <p className="text-sm text-gray-400">In a real implementation, this would show a map with shipment locations</p>
        </div>
        
        {/* Simulated shipment markers */}
        <div className="absolute inset-0">
          {shipments.map((shipment, index) => {
            // In a real implementation, we would use actual coordinates
            // Here we're just placing markers randomly for demonstration
            const top = Math.floor(Math.random() * 80) + 10;
            const left = Math.floor(Math.random() * 80) + 10;
            
            return (
              <div
                key={shipment.shipmentId}
                className={`absolute cursor-pointer ${STATUS_COLORS[shipment.currentStatus]} rounded-full h-6 w-6 flex items-center justify-center border-2 border-white shadow-md`}
                style={{ top: `${top}%`, left: `${left}%` }}
                onClick={() => setSelectedShipment(shipment)}
                title={shipment.waybillNumber}
              >
                {index + 1}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Shipment info card */}
      {selectedShipment && (
        <Card className="absolute bottom-4 right-4 w-80 shadow-lg">
          <CardContent className="p-4">
            <div className="flex justify-between mb-2">
              <h3 className="font-bold">{selectedShipment.waybillNumber}</h3>
              <button
                onClick={() => setSelectedShipment(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className={`font-medium ${selectedShipment.isDelayed ? 'text-red-600' : ''}`}>
                  {STATUS_LABELS[selectedShipment.currentStatus]}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">Current Location:</span>
                <span className="font-medium">
                  {selectedShipment.currentLocation?.address || 'Unknown'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">Estimated Delivery:</span>
                <span className="font-medium">
                  {formatDate(selectedShipment.estimatedDelivery)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">Driver:</span>
                <span className="font-medium">
                  {selectedShipment.assignedDriver || 'Unassigned'}
                </span>
              </div>
              
              <Button
                className="w-full mt-2"
                onClick={() => viewShipmentDetails(selectedShipment.shipmentId)}
              >
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Map controls and legend */}
      <div className="absolute top-4 left-4 bg-white p-3 rounded shadow-md">
        <h4 className="font-medium text-sm mb-2">Status Legend</h4>
        <div className="space-y-1">
          {Object.entries(STATUS_LABELS).map(([status, label]) => (
            <div key={status} className="flex items-center text-xs">
              <div className={`${STATUS_COLORS[status as ShipmentStatus]} w-3 h-3 rounded-full mr-2`}></div>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};