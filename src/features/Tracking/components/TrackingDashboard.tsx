// File: client/src/features/Tracking/components/TrackingDashboard.tsx

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@features/UI/components/ui/card';
import { Button } from '@features/UI/components/ui/button';
import { Input } from '@features/UI/components/ui/input';
import { Search, RefreshCw } from 'lucide-react';
import { ShipmentMap } from '@features/Shipments/components/ShipmentMap';

// ✅ FIXED: Import from your existing types file
import {
  ShipmentStatus,
  TrackingData,
  STATUS_COLORS,
  STATUS_LABELS,
  ShipmentPriority
} from '@features/Shipments/types/shipment';  // or wherever your types file is located

export const TrackingDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<ShipmentStatus | 'all'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // ✅ FIXED: Use proper TrackingData type with correct priority values
  const [shipments] = useState<TrackingData[]>([
    {
      shipmentId: 'SH001',
      waybillNumber: 'WB001',
      currentStatus: ShipmentStatus.IN_TRANSIT,
      estimatedDelivery: new Date(Date.now() + 86400000).toISOString(),
      origin: 'New York',
      destination: 'Los Angeles',
      priority: 'NORMAL' as ShipmentPriority, // ✅ FIXED: Use correct priority values
      lastUpdate: new Date().toISOString(),
      isDelayed: false,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
      statusHistory: [
        {
          id: 'su001',
          shipmentId: 'SH001',
          status: ShipmentStatus.PENDING,
          notes: 'Shipment created and awaiting pickup',
          updatedBy: 'system',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          location: {
            latitude: 40.7128,
            longitude: -74.0060,
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            address: 'New York Warehouse'
          }
        },
        {
          id: 'su002',
          shipmentId: 'SH001',
          status: ShipmentStatus.PICKED_UP,
          notes: 'Package picked up by driver',
          updatedBy: 'driver001',
          timestamp: new Date(Date.now() - 43200000).toISOString(),
          location: {
            latitude: 40.7589,
            longitude: -73.9851,
            timestamp: new Date(Date.now() - 43200000).toISOString(),
            address: 'New York Distribution Center'
          }
        },
        {
          id: 'su003',
          shipmentId: 'SH001',
          status: ShipmentStatus.IN_TRANSIT,
          notes: 'Package in transit to destination',
          updatedBy: 'system',
          timestamp: new Date().toISOString(),
          location: {
            latitude: 39.7392,
            longitude: -104.9903,
            timestamp: new Date().toISOString(),
            address: 'En route to Los Angeles'
          }
        }
      ],
      currentLocation: {
        latitude: 39.7392,
        longitude: -104.9903,
        timestamp: new Date().toISOString(),
        address: 'En route to Los Angeles'
      },
      assignedVehicle: 'TRK001',
      assignedDriver: 'John Smith'
    },
    {
      shipmentId: 'SH002',
      waybillNumber: 'WB002',
      currentStatus: ShipmentStatus.DELIVERED,
      estimatedDelivery: new Date(Date.now() - 86400000).toISOString(),
      actualDelivery: new Date().toISOString(),
      origin: 'Chicago',
      destination: 'Miami',
      priority: 'HIGH' as ShipmentPriority, // ✅ FIXED: Use correct priority values
      lastUpdate: new Date().toISOString(),
      isDelayed: false,
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      updatedAt: new Date().toISOString(),
      statusHistory: [
        {
          id: 'su004',
          shipmentId: 'SH002',
          status: ShipmentStatus.PENDING,
          notes: 'Shipment created and awaiting pickup',
          updatedBy: 'system',
          timestamp: new Date(Date.now() - 259200000).toISOString(),
          location: {
            latitude: 41.8781,
            longitude: -87.6298,
            timestamp: new Date(Date.now() - 259200000).toISOString(),
            address: 'Chicago Warehouse'
          }
        },
        {
          id: 'su005',
          shipmentId: 'SH002',
          status: ShipmentStatus.PICKED_UP,
          notes: 'Package picked up by driver',
          updatedBy: 'driver002',
          timestamp: new Date(Date.now() - 216000000).toISOString(),
          location: {
            latitude: 41.8781,
            longitude: -87.6298,
            timestamp: new Date(Date.now() - 216000000).toISOString(),
            address: 'Chicago Distribution Center'
          }
        },
        {
          id: 'su006',
          shipmentId: 'SH002',
          status: ShipmentStatus.IN_TRANSIT,
          notes: 'Package in transit to destination',
          updatedBy: 'system',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          location: {
            latitude: 28.5383,
            longitude: -81.3792,
            timestamp: new Date(Date.now() - 172800000).toISOString(),
            address: 'En route to Miami'
          }
        },
        {
          id: 'su007',
          shipmentId: 'SH002',
          status: ShipmentStatus.DELIVERED,
          notes: 'Package delivered successfully',
          updatedBy: 'driver002',
          timestamp: new Date().toISOString(),
          location: {
            latitude: 25.7617,
            longitude: -80.1918,
            timestamp: new Date().toISOString(),
            address: 'Miami Delivery Point'
          }
        }
      ],
      currentLocation: {
        latitude: 25.7617,
        longitude: -80.1918,
        timestamp: new Date().toISOString(),
        address: 'Miami Delivery Point'
      },
      assignedVehicle: 'TRK002',
      assignedDriver: 'Maria Rodriguez'
    },
    {
      shipmentId: 'SH003',
      waybillNumber: 'WB003',
      currentStatus: ShipmentStatus.DELAYED,
      estimatedDelivery: new Date(Date.now() + 172800000).toISOString(),
      origin: 'Dallas',
      destination: 'Seattle',
      priority: 'LOW' as ShipmentPriority, // ✅ FIXED: Use correct priority values
      lastUpdate: new Date().toISOString(),
      isDelayed: true,
      delayReason: 'Weather conditions causing transit delays',
      createdAt: new Date(Date.now() - 345600000).toISOString(),
      updatedAt: new Date().toISOString(),
      statusHistory: [
        {
          id: 'su008',
          shipmentId: 'SH003',
          status: ShipmentStatus.PENDING,
          notes: 'Shipment created and awaiting pickup',
          updatedBy: 'system',
          timestamp: new Date(Date.now() - 345600000).toISOString(),
          location: {
            latitude: 32.7767,
            longitude: -96.7970,
            timestamp: new Date(Date.now() - 345600000).toISOString(),
            address: 'Dallas Warehouse'
          }
        },
        {
          id: 'su009',
          shipmentId: 'SH003',
          status: ShipmentStatus.PICKED_UP,
          notes: 'Package picked up by driver',
          updatedBy: 'driver003',
          timestamp: new Date(Date.now() - 302400000).toISOString(),
          location: {
            latitude: 32.7767,
            longitude: -96.7970,
            timestamp: new Date(Date.now() - 302400000).toISOString(),
            address: 'Dallas Distribution Center'
          }
        },
        {
          id: 'su010',
          shipmentId: 'SH003',
          status: ShipmentStatus.DELAYED,
          notes: 'Severe weather conditions causing delays',
          updatedBy: 'system',
          timestamp: new Date().toISOString(),
          location: {
            latitude: 39.7392,
            longitude: -104.9903,
            timestamp: new Date().toISOString(),
            address: 'Denver - Weather delay'
          }
        }
      ],
      currentLocation: {
        latitude: 39.7392,
        longitude: -104.9903,
        timestamp: new Date().toISOString(),
        address: 'Denver - Weather delay'
      },
      assignedVehicle: 'TRK003',
      assignedDriver: 'Robert Johnson'
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const loadShipments = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      console.log('Shipments loaded');
    }, 1000);
  };

  useEffect(() => {
    loadShipments();
    const intervalId = setInterval(() => {
      loadShipments();
    }, 120000);

    return () => clearInterval(intervalId);
  }, []);

  // ✅ FIXED: Properly typed filter function
  const filteredShipments = shipments.filter((shipment: TrackingData) => {
    const matchesSearch =
      searchTerm === '' ||
      shipment.waybillNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.shipmentId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || shipment.currentStatus === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // ✅ FIXED: Properly typed status counting
  const statusCounts = shipments.reduce((acc: Record<ShipmentStatus, number>, shipment: TrackingData) => {
    const status = shipment.currentStatus;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<ShipmentStatus, number>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-blue-50 border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="text-blue-800">
              Shipment Tracking Dashboard
            </CardTitle>
            <Button
              variant="outline"
              onClick={() => loadShipments()}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Status Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <p className="text-sm text-gray-500">Total Shipments</p>
                <h3 className="text-2xl font-bold">{shipments.length}</h3>
              </CardContent>
            </Card>

            {Object.values(ShipmentStatus).map((status: ShipmentStatus) => (
              <Card key={status} className={`${STATUS_COLORS[status]} bg-opacity-30`}>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600">{STATUS_LABELS[status]}</p>
                  <h3 className="text-2xl font-bold text-gray-800">{statusCounts[status] || 0}</h3>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by waybill # or shipment ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as ShipmentStatus | 'all')}
              className="border rounded p-2"
            >
              <option value="all">All Statuses</option>
              {Object.values(ShipmentStatus).map((status: ShipmentStatus) => (
                <option key={status} value={status}>{STATUS_LABELS[status]}</option>
              ))}
            </select>

            <div className="flex gap-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
              >
                List View
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                onClick={() => setViewMode('map')}
              >
                Map View
              </Button>
            </div>
          </div>

          {/* Main Content Area */}
          {viewMode === 'map' ? (
            <ShipmentMap
              shipments={filteredShipments}  // ✅ Direct pass-through
            />
          ) : (
            <ShipmentMap
              shipments={filteredShipments}  // ⚠️ Type assertion
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};