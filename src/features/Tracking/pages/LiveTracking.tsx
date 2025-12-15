// src/pages/tracking/LiveTracking.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  MapPin, Truck, Search, LocateFixed,
  RefreshCw, Filter, Layers, Route,
  Info, AlertCircle, Clock,
  Phone, Navigation
} from 'lucide-react';
import { Button } from '@features/UI/components/ui/button';
import { Input } from '@features/UI/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@features/UI/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@features/UI/components/ui/card';
import { Badge } from '@features/UI/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@features/UI/components/ui/tabs';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@features/UI/components/ui/popover';


// Mock data interface
interface TruckLocation {
  id: string;
  truckId: string;
  truckName: string;
  licensePlate: string;
  driverName: string;
  driverPhone: string;
  status: 'in_transit' | 'idle' | 'loading' | 'maintenance' | 'offline';
  location: {
    lat: number;
    lng: number;
    speed: number;
    heading: number;
    lastUpdated: string;
    address?: string;
  };
  currentWaybill?: {
    id: string;
    origin: string;
    destination: string;
    cargo: string;
    client: string;
    estimatedArrival: string;
    progress: number;
  };
}

// Mock truck location data
const mockTruckLocations: TruckLocation[] = [
  {
    id: 'loc1',
    truckId: 't1',
    truckName: 'Truck-001',
    licensePlate: 'XYZ-1234',
    driverName: 'John Smith',
    driverPhone: '+1 (555) 234-5678',
    status: 'in_transit',
    location: {
      lat: 40.7128,
      lng: -74.0060,
      speed: 65,
      heading: 90,
      lastUpdated: '2025-02-19T14:32:10Z',
      address: 'I-95 N, New Jersey'
    },
    currentWaybill: {
      id: 'w1',
      origin: 'New York, NY',
      destination: 'Boston, MA',
      cargo: 'Electronics',
      client: 'TechCorp Inc.',
      estimatedArrival: '2025-02-20T10:00:00Z',
      progress: 42
    }
  },
  {
    id: 'loc2',
    truckId: 't2',
    truckName: 'Truck-002',
    licensePlate: 'ABC-5678',
    driverName: 'Sarah Johnson',
    driverPhone: '+1 (555) 345-6789',
    status: 'idle',
    location: {
      lat: 37.7749,
      lng: -122.4194,
      speed: 0,
      heading: 0,
      lastUpdated: '2025-02-19T14:25:45Z',
      address: '123 Market St, San Francisco, CA'
    }
  },
  {
    id: 'loc3',
    truckId: 't3',
    truckName: 'Truck-003',
    licensePlate: 'DEF-9012',
    driverName: 'Robert Wilson',
    driverPhone: '+1 (555) 456-7890',
    status: 'in_transit',
    location: {
      lat: 34.0522,
      lng: -118.2437,
      speed: 55,
      heading: 180,
      lastUpdated: '2025-02-19T14:30:22Z',
      address: 'I-5 S, Los Angeles, CA'
    },
    currentWaybill: {
      id: 'w2',
      origin: 'Los Angeles, CA',
      destination: 'San Diego, CA',
      cargo: 'Furniture',
      client: 'HomeGoods Inc.',
      estimatedArrival: '2025-02-19T18:30:00Z',
      progress: 75
    }
  },
  {
    id: 'loc4',
    truckId: 't4',
    truckName: 'Truck-004',
    licensePlate: 'GHI-3456',
    driverName: 'Michael Brown',
    driverPhone: '+1 (555) 567-8901',
    status: 'loading',
    location: {
      lat: 29.7604,
      lng: -95.3698,
      speed: 0,
      heading: 270,
      lastUpdated: '2025-02-19T14:15:33Z',
      address: '456 Shipping Ln, Houston, TX'
    }
  },
  {
    id: 'loc5',
    truckId: 't5',
    truckName: 'Truck-005',
    licensePlate: 'JKL-7890',
    driverName: 'Jennifer Davis',
    driverPhone: '+1 (555) 678-9012',
    status: 'maintenance',
    location: {
      lat: 41.8781,
      lng: -87.6298,
      speed: 0,
      heading: 0,
      lastUpdated: '2025-02-19T13:45:10Z',
      address: 'Fleet Maintenance Center, Chicago, IL'
    }
  },
  {
    id: 'loc6',
    truckId: 't6',
    truckName: 'Truck-006',
    licensePlate: 'MNO-1234',
    driverName: 'David Martinez',
    driverPhone: '+1 (555) 789-0123',
    status: 'offline',
    location: {
      lat: 39.9526,
      lng: -75.1652,
      speed: 0,
      heading: 0,
      lastUpdated: '2025-02-18T18:22:05Z',
      address: 'Fleet Yard, Philadelphia, PA'
    }
  }
];

// The LiveTracking component
const LiveTracking: React.FC = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [mapType, setMapType] = useState('roadmap');
  const [isLoading, setIsLoading] = useState(false);
  const [truckLocations, setTruckLocations] = useState<TruckLocation[]>([]);
  const [selectedTruck, setSelectedTruck] = useState<TruckLocation | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  // Fetch truck locations (simulated)
  const fetchTruckLocations = useCallback(() => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      let filteredLocations = [...mockTruckLocations];
      
      // Apply status filter
      if (statusFilter !== 'all') {
        filteredLocations = filteredLocations.filter(
          truck => truck.status === statusFilter
        );
      }
      
      // Apply search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredLocations = filteredLocations.filter(
          truck => 
            truck.truckName.toLowerCase().includes(query) ||
            truck.licensePlate.toLowerCase().includes(query) ||
            truck.driverName.toLowerCase().includes(query) ||
            (truck.location.address && truck.location.address.toLowerCase().includes(query))
        );
      }
      
      setTruckLocations(filteredLocations);
      setLastRefreshed(new Date());
      setIsLoading(false);
    }, 800);
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    fetchTruckLocations();
    
    // Set up auto-refresh
    const intervalId = setInterval(() => {
      fetchTruckLocations();
    }, refreshInterval * 1000);
    
    return () => clearInterval(intervalId);
  }, [refreshInterval, fetchTruckLocations]);

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);

    if (diffMinutes < 1) {
      return 'Just now';
    } else if (diffMinutes === 1) {
      return '1 minute ago';
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minutes ago`;
    } else if (diffMinutes < 120) {
      return '1 hour ago';
    } else {
      const diffHours = Math.floor(diffMinutes / 60);
      return `${diffHours} hours ago`;
    }
  };

  // Get ETA in human-readable format
  const getETA = (dateString?: string) => {
    if (!dateString) return 'N/A';

    const eta = new Date(dateString);
    const now = new Date();
    const diffMs = eta.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_transit':
        return <Badge className="bg-green-100 text-green-800 border-green-200">In Transit</Badge>;
      case 'idle':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Idle</Badge>;
      case 'loading':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Loading</Badge>;
      case 'maintenance':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Maintenance</Badge>;
      case 'offline':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Offline</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Handle manual refresh
  const handleRefresh = () => {
    fetchTruckLocations();
  };

  // Handle truck selection
  const handleTruckSelect = (truck: TruckLocation) => {
    setSelectedTruck(truck);
    if (activeTab === 'list') {
      setActiveTab('map');
    }
  };

  // Render truck info card
  const renderTruckInfo = (truck: TruckLocation) => {
    const updatedAgo = formatTimeAgo(truck.location.lastUpdated);
    const isUpdatedRecently = new Date(truck.location.lastUpdated).getTime() >
      new Date().getTime() - 15 * 60 * 1000; // Within 15 minutes

    return (
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <Truck className={`h-5 w-5 ${truck.status === 'offline' ? 'text-gray-400' : 'text-blue-600'}`} />
              <CardTitle className="text-lg">{truck.truckName}</CardTitle>
            </div>
            {getStatusBadge(truck.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Driver & Truck Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">License Plate</div>
              <div className="font-medium">{truck.licensePlate}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Driver</div>
              <div className="font-medium">{truck.driverName}</div>
            </div>
          </div>

          {/* Location Info */}
          <div>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Current Location</span>
              <span className={`flex items-center ${isUpdatedRecently ? 'text-green-600' : 'text-amber-600'}`}>
                <Clock className="h-3 w-3 mr-1" />
                {updatedAgo}
              </span>
            </div>
            <div className="font-medium flex items-start mt-1">
              <MapPin className="h-4 w-4 text-red-500 mt-1 mr-1 flex-shrink-0" />
              <span>{truck.location.address || `${truck.location.lat.toFixed(4)}, ${truck.location.lng.toFixed(4)}`}</span>
            </div>
          </div>

          {/* Speed & Heading */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Speed</div>
              <div className="font-medium">{truck.location.speed} mph</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Heading</div>
              <div className="font-medium flex items-center">
                <Navigation
                  className="h-4 w-4 mr-1"
                  style={{
                    transform: `rotate(${truck.location.heading}deg)`
                  }}
                />
                {truck.location.heading}°
              </div>
            </div>
          </div>

          {/* Current Waybill */}
          {truck.currentWaybill ? (
            <div className="border-t pt-4 mt-2">
              <div className="text-sm font-medium mb-2">Current Shipment</div>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500">Waybill #</div>
                  <div className="font-medium text-blue-600">{truck.currentWaybill.id}</div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-gray-500">From</div>
                    <div className="text-sm">{truck.currentWaybill.origin}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">To</div>
                    <div className="text-sm">{truck.currentWaybill.destination}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-gray-500">Cargo</div>
                    <div className="text-sm">{truck.currentWaybill.cargo}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Client</div>
                    <div className="text-sm">{truck.currentWaybill.client}</div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Progress</span>
                    <span>ETA: {getETA(truck.currentWaybill.estimatedArrival)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${truck.currentWaybill.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-t pt-4 mt-2 text-center text-gray-500">
              No active shipment
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex items-center justify-center">
              <Route className="h-4 w-4 mr-1" />
              View Route
            </Button>
            <Button variant="outline" size="sm" className="flex items-center justify-center">
              <Phone className="h-4 w-4 mr-1" />
              Contact Driver
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Render the map view
  const renderMapView = () => {
    return (
      <div className="space-y-4">
        <div className="relative">
          {/* Map Canvas */}
          <div className="h-[calc(100vh-240px)] min-h-[500px] rounded-lg border overflow-hidden bg-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Map integration will be implemented here</p>
              <p className="max-w-md mx-auto mt-2">
                The map will display real-time truck locations, routes, and traffic information.
              </p>
            </div>

            {/* Map Controls Overlay */}
            <div className="absolute top-4 right-4 space-y-2">
              <div className="bg-white p-2 rounded-md shadow-md">
                <Button variant="ghost" size="sm"
                  onClick={() => {}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m-7-7h14" />
                  </svg>
                </Button>
                <Button variant="ghost" size="sm"
                  onClick={() => {}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                  </svg>
                </Button>
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="bg-white">
                    <Layers className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="left" className="w-52 p-2">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Map Type</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={mapType === 'roadmap' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setMapType('roadmap')}
                      >
                        Road
                      </Button>
                      <Button
                        variant={mapType === 'satellite' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setMapType('satellite')}
                      >
                        Satellite
                      </Button>
                      <Button
                        variant={mapType === 'terrain' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setMapType('terrain')}
                      >
                        Terrain
                      </Button>
                      <Button
                        variant={mapType === 'hybrid' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setMapType('hybrid')}
                      >
                        Hybrid
                      </Button>
                    </div>

                    <h3 className="text-sm font-medium pt-2">Layers</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label htmlFor="layer-traffic" className="text-sm cursor-pointer">Traffic</label>
                        <input type="checkbox" id="layer-traffic" className="cursor-pointer" />
                      </div>
                      <div className="flex items-center justify-between">
                        <label htmlFor="layer-weather" className="text-sm cursor-pointer">Weather</label>
                        <input type="checkbox" id="layer-weather" className="cursor-pointer" />
                      </div>
                      <div className="flex items-center justify-between">
                        <label htmlFor="layer-gas" className="text-sm cursor-pointer">Gas Stations</label>
                        <input type="checkbox" id="layer-gas" className="cursor-pointer" />
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Button variant="outline" size="sm" className="bg-white" onClick={() => setSelectedTruck(null)}>
                <LocateFixed className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white p-3 rounded-md shadow-md">
            <h3 className="text-sm font-medium mb-2">Truck Status</h3>
            <div className="space-y-1">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-xs">In Transit</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-xs">Idle</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-xs">Loading</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                <span className="text-xs">Maintenance</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
                <span className="text-xs">Offline</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Truck Info */}
        {selectedTruck && (
          <div className="lg:absolute lg:top-4 lg:left-4 lg:w-80">
            {renderTruckInfo(selectedTruck)}
          </div>
        )}
      </div>
    );
  };

  // Render the list view
  const renderListView = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            Array(3).fill(0).map((_, index) => (
              <Card key={index} className="h-96 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </Card>
            ))
          ) : truckLocations.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <Truck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No trucks found</h3>
              <p className="text-gray-500 max-w-md mx-auto mt-2">
                {searchQuery || statusFilter !== 'all'
                  ? "No trucks match your search criteria. Try adjusting your filters."
                  : "There are no trucks available for tracking at this time."}
              </p>
            </div>
          ) : (
            truckLocations.map(truck => (
              <div key={truck.id} className="cursor-pointer h-full" onClick={() => handleTruckSelect(truck)}>
                {renderTruckInfo(truck)}
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Live Tracking</h1>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search trucks..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-36">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Trucks</SelectItem>
              <SelectItem value="in_transit">In Transit</SelectItem>
              <SelectItem value="idle">Idle</SelectItem>
              <SelectItem value="loading">Loading</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Refresh Interval & Last Updated */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-gray-500">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          <span>Last updated: {lastRefreshed.toLocaleTimeString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Auto-refresh:</span>
          <Select
            value={refreshInterval.toString()}
            onValueChange={(value) => setRefreshInterval(parseInt(value))}
          >
            <SelectTrigger className="h-7 w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 sec</SelectItem>
              <SelectItem value="30">30 sec</SelectItem>
              <SelectItem value="60">1 min</SelectItem>
              <SelectItem value="300">5 min</SelectItem>
              <SelectItem value="0">Off</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main content */}
      <Card>
        <CardHeader className="pb-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList>
              <TabsTrigger value="map">Map View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="pt-4 relative">
          <TabsContent value="map" className="m-0">
            {renderMapView()}
          </TabsContent>
          <TabsContent value="list" className="m-0">
            {renderListView()}
          </TabsContent>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Total Trucks</div>
              <div className="text-2xl font-bold">{mockTruckLocations.length}</div>
            </div>
            <Truck className="h-8 w-8 text-gray-400" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">In Transit</div>
              <div className="text-2xl font-bold">
                {mockTruckLocations.filter(t => t.status === 'in_transit').length}
              </div>
            </div>
            <LocateFixed className="h-8 w-8 text-green-400" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Idle/Loading</div>
              <div className="text-2xl font-bold">
                {mockTruckLocations.filter(t => t.status === 'idle' || t.status === 'loading').length}
              </div>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-400" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Issues</div>
              <div className="text-2xl font-bold">
                {mockTruckLocations.filter(t => t.status === 'maintenance' || t.status === 'offline').length}
              </div>
            </div>
            <Info className="h-8 w-8 text-red-400" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LiveTracking;