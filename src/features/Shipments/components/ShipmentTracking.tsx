// src/components/shipment/ShipmentTracking.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '../../UI/components/ui/card';
import { Button } from '../../UI/components/ui/button';
import { Badge } from '../../UI/components/ui/badge';
import { Separator } from '../../UI/components/ui/separator';
import { Progress } from '../../UI/components/ui/progress';
import {
  ArrowLeft,
  Truck,
  MapPin,
  Route,
  Clock,
  AlertTriangle,
  Check,
  FileText,
  ChevronRight,
  RefreshCw,
  Map as MapIcon,
} from 'lucide-react';
import { Shipment, ShipmentStatus } from '../types/shipment';
import ShipmentService from '../services/ShipmentService';
import ShipmentStatusBadge from './ShipmentStatusBadge';

// Mock function for updating location - in a real app this would call your API
const mockUpdateLocation = async (shipmentId: string) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      console.log(`Updated location for shipment ${shipmentId}`);
      resolve();
    }, 1000);
  });
};

const ShipmentTracking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;
    
    const fetchShipment = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await ShipmentService.getShipmentById(id);
        
        if (!data) {
          setError('Shipment not found');
          setIsLoading(false);
          return;
        }
        
        // Check if shipment is trackable (active)
        if (data.status !== ShipmentStatus.IN_TRANSIT && data.status !== ShipmentStatus.DISPATCHED) {
          setError('This shipment is not currently active and cannot be tracked');
        }
        
        setShipment(data);
      } catch (err) {
        console.error('Error fetching shipment:', err);
        setError('Failed to load shipment tracking data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchShipment();
  }, [id]);

  const handleBack = () => {
    navigate(`/shipments/${id}`);
  };

  const handleUpdateLocation = async () => {
    if (!id || !shipment) return;
    
    setIsUpdating(true);
    
    try {
      await mockUpdateLocation(id);
      // In a real app, you would fetch the updated shipment data
      // const updatedShipment = await ShipmentService.getShipmentById(id);
      // setShipment(updatedShipment);
      
      // Simulate update for demo purposes
      if (shipment.tracking?.lastKnownLocation) {
        const updatedShipment = { ...shipment };
        
        // Mock movement - slightly adjust coordinates
        const randomLat = (Math.random() - 0.5) * 0.02;
        const randomLng = (Math.random() - 0.5) * 0.02;
        
        if (updatedShipment.tracking && updatedShipment.tracking.lastKnownLocation) {
          updatedShipment.tracking.lastKnownLocation = {
            ...updatedShipment.tracking.lastKnownLocation,
            latitude: updatedShipment.tracking.lastKnownLocation.latitude + randomLat,
            longitude: updatedShipment.tracking.lastKnownLocation.longitude + randomLng,
            timestamp: new Date(),
            speed: Math.floor(55 + Math.random() * 15),
          };
        }
        
        setShipment(updatedShipment);
      }
    } catch (err) {
      console.error('Error updating location:', err);
      alert('Failed to update location. Please try again later.');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateProgress = () => {
    if (!shipment || 
        !shipment.tracking?.lastKnownLocation || 
        !shipment.schedule.plannedStart || 
        !shipment.schedule.plannedEnd) {
      return 0;
    }
    
    const start = new Date(shipment.schedule.plannedStart).getTime();
    const end = new Date(shipment.schedule.plannedEnd).getTime();
    const current = new Date(shipment.tracking.lastKnownLocation.timestamp).getTime();
    
    const totalTime = end - start;
    const elapsedTime = current - start;
    
    if (totalTime <= 0) return 0;
    
    const progress = Math.min(Math.max(Math.floor((elapsedTime / totalTime) * 100), 0), 100);
    return progress;
  };

  // Calculate ETA
  const getEta = () => {
    if (!shipment) return 'N/A';
    
    if (shipment.tracking?.currentEta) {
      return formatDate(shipment.tracking.currentEta);
    }
    
    return formatDate(shipment.schedule.plannedEnd);
  };

  // Calculate estimated time remaining
  const getTimeRemaining = () => {
    if (!shipment || !shipment.schedule.plannedEnd) return 'N/A';
    
    const end = new Date(shipment.tracking?.currentEta || shipment.schedule.plannedEnd);
    const now = new Date();
    
    if (now > end) return 'Overdue';
    
    const diffMs = end.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h remaining`;
    } else if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m remaining`;
    } else {
      return `${diffMinutes}m remaining`;
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 w-full max-w-4xl bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !shipment) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
            <CardDescription>
              {error || 'An unexpected error occurred'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shipment Details
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="outline" size="sm" onClick={handleBack} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Shipment Tracking</h1>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleUpdateLocation} disabled={isUpdating}>
            {isUpdating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Update Location
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Shipment Info Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{shipment.reference}</CardTitle>
              <CardDescription>{shipment.description}</CardDescription>
            </div>
            <ShipmentStatusBadge status={shipment.status} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Origin</p>
                  <p className="font-medium">{shipment.origin.name}</p>
                  <p className="text-sm">{shipment.origin.city}, {shipment.origin.country}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-300" />
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Destination</p>
                  <p className="font-medium">{shipment.destination.name}</p>
                  <p className="text-sm">{shipment.destination.city}, {shipment.destination.country}</p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Departed</p>
                <p className="font-medium">
                  {shipment.schedule.actualStart 
                    ? formatDate(shipment.schedule.actualStart)
                    : formatDate(shipment.schedule.plannedStart)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estimated Arrival</p>
                <p className="font-medium">{getEta()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Time Remaining</p>
                <p className="font-medium">{getTimeRemaining()}</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <p className="text-sm text-gray-500 mb-2">Journey Progress</p>
              <div className="flex items-center space-x-4">
                <Progress value={calculateProgress()} className="flex-1" />
                <span className="text-sm font-medium">{calculateProgress()}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Location Card */}
      {shipment.tracking?.lastKnownLocation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              Current Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 min-h-[300px] bg-gray-100 rounded-md flex items-center justify-center">
                {/* In a real app, this would be a map component */}
                <div className="text-center">
                  <MapIcon className="h-12 w-12 text-gray-400 mx-auto" />
                  <p className="mt-2 text-gray-500">Map would be displayed here</p>
                  <p className="text-sm text-gray-500">
                    Showing location at {shipment.tracking.lastKnownLocation.latitude.toFixed(6)}, {shipment.tracking.lastKnownLocation.longitude.toFixed(6)}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="font-medium">{formatDate(shipment.tracking.lastKnownLocation.timestamp)}</p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <p className="text-sm text-gray-500">Coordinates</p>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div>
                      <p className="text-xs text-gray-500">Latitude</p>
                      <p className="font-medium">{shipment.tracking.lastKnownLocation.latitude.toFixed(6)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Longitude</p>
                      <p className="font-medium">{shipment.tracking.lastKnownLocation.longitude.toFixed(6)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-md">
                    <p className="text-sm text-gray-500">Speed</p>
                    <p className="font-medium">
                      {shipment.tracking.lastKnownLocation.speed 
                        ? `${shipment.tracking.lastKnownLocation.speed} mph`
                        : 'N/A'}
                    </p>
                  </div>
                  <div className="p-4 border rounded-md">
                    <p className="text-sm text-gray-500">Heading</p>
                    <p className="font-medium">
                      {shipment.tracking.lastKnownLocation.heading 
                        ? `${shipment.tracking.lastKnownLocation.heading}°`
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tracking Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Route className="h-5 w-5 mr-2" />
            Tracking Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          {shipment.tracking?.trackingEvents && shipment.tracking.trackingEvents.length > 0 ? (
            <div className="relative">
              {/* Timeline track */}
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              <div className="space-y-8">
                {shipment.tracking.trackingEvents.map((event, index) => (
                  <div key={index} className="relative pl-10">
                    {/* Timeline indicator */}
                    <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center">
                      {event.type === 'STATUS_CHANGE' ? (
                        <Clock className="h-3 w-3 text-blue-500" />
                      ) : event.type === 'STOP_ARRIVAL' || event.type === 'STOP_DEPARTURE' ? (
                        <MapPin className="h-3 w-3 text-blue-500" />
                      ) : event.type === 'INCIDENT' ? (
                        <AlertTriangle className="h-3 w-3 text-red-500" />
                      ) : (
                        <Check className="h-3 w-3 text-blue-500" />
                      )}
                    </div>
                    
                    <div className="mb-1 flex items-center">
                      <Badge variant="outline" className="mr-2">
                        {event.type.replace('_', ' ')}
                      </Badge>
                      <p className="text-sm text-gray-500">
                        {formatDate(event.timestamp)}
                      </p>
                    </div>
                    <p className="font-medium">{event.description}</p>
                    
                    {event.location && (
                      <p className="text-sm text-gray-500 mt-1">
                        Location: {event.location.latitude.toFixed(4)}, {event.location.longitude.toFixed(4)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center p-6 border border-dashed rounded-md">
              <Route className="h-12 w-12 mx-auto text-gray-300" />
              <p className="mt-2 text-gray-500">No tracking events available yet</p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t p-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Details
          </Button>
          
          <Button onClick={handleUpdateLocation} disabled={isUpdating}>
            {isUpdating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Update Location
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {/* Shipment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Shipment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Driver Information */}
            <div>
              <h3 className="font-medium mb-3">Driver Information</h3>
              {shipment.drivers && shipment.drivers.length > 0 ? (
                <div className="space-y-4">
                  {shipment.drivers.map(driver => (
                    <div key={driver.id} className="border rounded-md p-3">
                      <div className="flex justify-between">
                        <p className="font-medium">{driver.name}</p>
                        <Badge>
                          {driver.assignment.role}
                        </Badge>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">Contact</p>
                        <p>{driver.contactPhone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No driver information available</p>
              )}
            </div>
            
            {/* Vehicle Information */}
            <div>
              <h3 className="font-medium mb-3">Vehicle Information</h3>
              {shipment.vehicles && shipment.vehicles.length > 0 ? (
                <div className="space-y-4">
                  {shipment.vehicles.map(vehicle => (
                    <div key={vehicle.id} className="border rounded-md p-3">
                      <div className="flex justify-between">
                        <p className="font-medium">
                          {vehicle.make} {vehicle.model} ({vehicle.year})
                        </p>
                        <Badge>
                          {vehicle.type}
                        </Badge>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">License Plate</p>
                        <p>{vehicle.licensePlate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No vehicle information available</p>
              )}
            </div>
          </div>
          
          {/* Cargo Information */}
          <div className="mt-6">
            <h3 className="font-medium mb-3">Cargo Information</h3>
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Cargo Items</p>
                  <p className="font-medium">{shipment.cargoIds?.length || 0} items</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => navigate(`/shipments/${id}?tab=cargo`)}>
                  View Cargo Details
                </Button>
              </div>
            </div>
          </div>
          
          {/* Additional Information */}
          {shipment.notes && (
            <div className="mt-6">
              <h3 className="font-medium mb-3">Additional Notes</h3>
              <div className="border rounded-md p-4">
                <p className="whitespace-pre-line">{shipment.notes}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShipmentTracking;