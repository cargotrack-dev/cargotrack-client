// src/features/Shipments/pages/ShipmentListPage.tsx

import React, { useState } from 'react';
import { ShipmentList } from '../components/ShipmentList';
import { useShipments } from '../hooks/useShipments';
import { Card, CardHeader, CardTitle, CardContent } from '@features/UI/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@features/UI/components/ui/select';
import { Input } from '@features/UI/components/ui/input';

// ✅ FIXED: Import from unified types instead of module-specific types
import { 
  ShipmentStatus, 
  TrackingData, 
  StatusUpdate, 
  SimpleLocation,
} from '@features/Shipments/types/shipment';

// ✅ FIXED: Import Shipment from shipments module (if needed)
import { Shipment } from '@features/Shipments/types/shipment';

interface ShipmentFilters {
  status?: string;
  priority?: string;
  search?: string;
  [key: string]: string | undefined;
}

const ShipmentListPage: React.FC = () => {
  const [filters, setFilters] = useState<ShipmentFilters>({});
  const { shipments, loading } = useShipments(filters);

  const handleStatusChange = (value: string) => {
    setFilters(prev => ({ ...prev, status: value || undefined }));
  };

  const handlePriorityChange = (value: string) => {
    setFilters(prev => ({ ...prev, priority: value || undefined }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value.trim();
    setFilters(prev => ({ ...prev, search: search || undefined }));
  };

  // Filter shipments by search term if provided
  const filteredShipments = filters.search 
    ? shipments.filter(shipment => 
        shipment.reference.toLowerCase().includes(filters.search!.toLowerCase()) ||
        shipment.description.toLowerCase().includes(filters.search!.toLowerCase())
      )
    : shipments;

  // ✅ FIXED: Convert Shipment objects to unified TrackingData format
  const trackingData: TrackingData[] = filteredShipments.map((shipment: Shipment) => {
    // ✅ FIXED: Use unified ShipmentStatus enum
    const currentStatus = shipment.status;
    
    // ✅ FIXED: Safe date conversion with fallbacks
    const estimatedDeliveryStr = shipment.schedule.plannedEnd ? 
      (typeof shipment.schedule.plannedEnd === 'string' ? 
        shipment.schedule.plannedEnd : 
        shipment.schedule.plannedEnd.toISOString()
      ) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      
    const lastUpdateStr = shipment.updatedAt ? 
      (typeof shipment.updatedAt === 'string' ? 
        shipment.updatedAt : 
        shipment.updatedAt.toISOString()
      ) : new Date().toISOString();
      
    const createdAtStr = shipment.createdAt ? 
      (typeof shipment.createdAt === 'string' ? 
        shipment.createdAt : 
        shipment.createdAt.toISOString()
      ) : new Date().toISOString();
    
    // ✅ FIXED: Convert tracking events to proper StatusUpdate format
    const statusUpdates: StatusUpdate[] = (shipment.tracking?.trackingEvents || []).map(event => {
      // ✅ FIXED: Create proper SimpleLocation data
      let locationData: SimpleLocation | undefined;
      if (event.location) {
        locationData = {
          latitude: event.location.latitude,
          longitude: event.location.longitude,
          timestamp: typeof event.timestamp === 'string' ? 
            event.timestamp : 
            event.timestamp.toISOString(),
          address: 'Last known location'
        };
      }
      
      return {
        id: `status-${Math.random().toString(36).substring(2, 11)}`,
        shipmentId: shipment.id,
        status: currentStatus,
        notes: event.description || '',
        updatedBy: 'System',
        timestamp: typeof event.timestamp === 'string' ? 
          event.timestamp : 
          event.timestamp.toISOString(),
        location: locationData
      };
    });
    
    // ✅ FIXED: Create current location from last known position
    let currentLocation: SimpleLocation | undefined;
    if (shipment.tracking?.lastKnownLocation) {
      const lastKnown = shipment.tracking.lastKnownLocation;
      currentLocation = {
        latitude: lastKnown.latitude,
        longitude: lastKnown.longitude,
        timestamp: typeof lastKnown.timestamp === 'string' ? 
          lastKnown.timestamp : 
          lastKnown.timestamp.toISOString(),
        address: 'Current location'
      };
    }
    
    // ✅ FIXED: Complete TrackingData object with unified types
    return {
      shipmentId: shipment.id,
      waybillNumber: shipment.reference,
      currentStatus: currentStatus,
      estimatedDelivery: estimatedDeliveryStr,
      actualDelivery: shipment.schedule.actualEnd ? 
        (typeof shipment.schedule.actualEnd === 'string' ? 
          shipment.schedule.actualEnd : 
          shipment.schedule.actualEnd.toISOString()
        ) : undefined,
      origin: `${shipment.origin.city}, ${shipment.origin.country}`,
      destination: `${shipment.destination.city}, ${shipment.destination.country}`,
      priority: shipment.priority,
      lastUpdate: lastUpdateStr,
      statusHistory: statusUpdates,
      isDelayed: shipment.status === ShipmentStatus.DELAYED || 
                (shipment.schedule.plannedEnd && new Date(shipment.schedule.plannedEnd) < new Date()),
      delayReason: shipment.status === ShipmentStatus.DELAYED ? 
        'Shipment delayed - check tracking for details' : undefined,
      currentLocation: currentLocation,
      assignedVehicle: shipment.vehicles?.[0]?.licensePlate || undefined,
      assignedDriver: shipment.drivers?.[0]?.name || undefined,
      // ✅ FIXED: Add required timestamp properties
      createdAt: createdAtStr,
      updatedAt: lastUpdateStr,
    };
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Shipment Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <Select onValueChange={handleStatusChange} value={filters.status || ''}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  {Object.values(ShipmentStatus).map(status => (
                    <SelectItem key={status} value={status}>
                      {status.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <Select onValueChange={handlePriorityChange} value={filters.priority || ''}>
                <SelectTrigger>
                  <SelectValue placeholder="All priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All priorities</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="NORMAL">Normal</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Search</label>
              <Input
                placeholder="Search by reference or description"
                onChange={handleSearchChange}
                value={filters.search || ''}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* ✅ FIXED: Now uses unified TrackingData type */}
      <ShipmentList 
        shipments={trackingData} 
        isLoading={loading} 
      />
    </div>
  );
};

export default ShipmentListPage;