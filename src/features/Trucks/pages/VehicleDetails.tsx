import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../UI/components/ui/card';
import { Button } from '../../UI/components/ui/button';
import { Badge } from '../../UI/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../UI/components/ui/tabs';
import { Separator } from '../../UI/components/ui/separator';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  MapPin,
  Settings,
  Truck,
  User,
  AlertTriangle,
  Edit,
  ChevronLeft
} from 'lucide-react';
import { useTruck } from '../hooks/useTrucks';
import VehicleMaintenanceHistory from '../components/VehicleMaintenanceHistory';
import VehicleAssignmentHistory from '../components/VehicleAssignmentHistory';
import TruckSpecifications from '../components/TruckSpecifications';
import { TruckStatus } from '../types/truck.types';

const VehicleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { truck, loading, error } = useTruck(id);
  const [activeTab, setActiveTab] = useState('overview');

  const handleBack = () => {
    navigate('/vehicles');
  };

  const handleEdit = () => {
    navigate(`/vehicles/${id}/edit`);
  };

  const getStatusBadge = (status: TruckStatus) => {
    switch (status) {
      case TruckStatus.ACTIVE:
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case TruckStatus.MAINTENANCE:
        return <Badge className="bg-orange-100 text-orange-800">Maintenance</Badge>;
      case TruckStatus.OUT_OF_SERVICE:
        return <Badge className="bg-red-100 text-red-800">Out of Service</Badge>;
      case TruckStatus.ASSIGNED:
        return <Badge className="bg-blue-100 text-blue-800">Assigned</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 flex justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !truck) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
            <CardDescription>
              {error?.message || 'Vehicle not found'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Vehicles
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header with back button and actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="outline" size="sm" onClick={handleBack} className="mr-4">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Vehicle Details: {truck.licensePlate}</h1>
          {getStatusBadge(truck.status)}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Vehicle overview card */}
      <Card>
        <CardHeader className="bg-slate-50">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{truck.make} {truck.model} ({truck.year})</CardTitle>
              <CardDescription>
                VIN: {truck.vin} • License: {truck.licensePlate}
              </CardDescription>
            </div>
            {getStatusBadge(truck.status)}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="overview">
                    <Truck className="h-4 w-4 mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="specifications">
                    <FileText className="h-4 w-4 mr-2" />
                    Specifications
                  </TabsTrigger>
                  <TabsTrigger value="maintenance">
                    <Settings className="h-4 w-4 mr-2" />
                    Maintenance
                  </TabsTrigger>
                  <TabsTrigger value="assignments">
                    <Calendar className="h-4 w-4 mr-2" />
                    Assignments
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Type</h3>
                      <p>{truck.type}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Status</h3>
                      <p>{truck.status}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Current Location</h3>
                      <p className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                        {typeof truck.currentLocation === 'object'
                          ? `${truck.currentLocation.lat}, ${truck.currentLocation.lng}`
                          : truck.currentLocation || 'Not available'}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                      <p className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-gray-500" />
                        {truck.lastUpdated ? new Date(truck.lastUpdated).toLocaleString() : 'Unknown'}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Current Assignment</h3>
                    {truck.currentAssignment ? (
                      <div className="bg-blue-50 p-3 rounded">
                        <div className="flex justify-between">
                          <p className="font-medium">{truck.currentAssignment.shipmentId}</p>
                          <Badge variant="outline">{truck.currentAssignment.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {truck.currentAssignment.route?.origin} to {truck.currentAssignment.route?.destination}
                        </p>
                        <div className="flex justify-between text-sm mt-2">
                          <p className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(truck.currentAssignment.startDate).toLocaleDateString()}
                          </p>
                          <p className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {truck.currentAssignment.driverName}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">No current assignment</p>
                    )}
                  </div>

                  {truck.alerts && truck.alerts.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Alerts</h3>
                        <div className="space-y-2">
                          {truck.alerts.map((alert, index) => (
                            <div key={index} className="bg-red-50 p-3 rounded flex items-start">
                              <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                              <div>
                                <p className="font-medium text-red-700">{alert.title}</p>
                                <p className="text-sm text-red-600">{alert.message}</p>
                                <p className="text-xs text-red-500 mt-1">{new Date(alert.timestamp).toLocaleString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {truck.maintenanceStatus && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Maintenance Status</h3>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-gray-50 p-3 rounded text-center">
                            <p className="text-sm text-gray-500">Odometer</p>
                            <p className="font-medium">{truck.maintenanceStatus.odometer.toLocaleString()} km</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded text-center">
                            <p className="text-sm text-gray-500">Next Service</p>
                            <p className="font-medium">{new Date(truck.maintenanceStatus.nextServiceDate).toLocaleDateString()}</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded text-center">
                            <p className="text-sm text-gray-500">Health</p>
                            <p className="font-medium flex justify-center items-center">
                              {truck.maintenanceStatus.healthScore >= 80 ? (
                                <><CheckCircle2 className="h-4 w-4 text-green-500 mr-1" /> Good</>
                              ) : truck.maintenanceStatus.healthScore >= 50 ? (
                                <><AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" /> Fair</>
                              ) : (
                                <><AlertTriangle className="h-4 w-4 text-red-500 mr-1" /> Poor</>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </TabsContent>

                <TabsContent value="specifications">
                  <TruckSpecifications truckId={truck.id} />
                </TabsContent>

                <TabsContent value="maintenance">
                  <VehicleMaintenanceHistory vehicleId={truck.id} />
                </TabsContent>

                <TabsContent value="assignments">
                  <VehicleAssignmentHistory vehicleId={truck.id} />
                </TabsContent>
              </Tabs>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Vehicle Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <div>
                    <p className="text-sm text-gray-500">Make & Model</p>
                    <p className="font-medium">{truck.make} {truck.model}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Year</p>
                    <p className="font-medium">{truck.year}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-medium">{truck.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">VIN</p>
                    <p className="font-medium">{truck.vin}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">License Plate</p>
                    <p className="font-medium">{truck.licensePlate}</p>
                  </div>
                  {truck.registrationExpiry && (
                    <div>
                      <p className="text-sm text-gray-500">Registration Expires</p>
                      <p className="font-medium">{new Date(truck.registrationExpiry).toLocaleDateString()}</p>
                    </div>
                  )}
                  {truck.insuranceExpiry && (
                    <div>
                      <p className="text-sm text-gray-500">Insurance Expires</p>
                      <p className="font-medium">{new Date(truck.insuranceExpiry).toLocaleDateString()}</p>
                    </div>
                  )}
                </CardContent>
                {truck.status === TruckStatus.MAINTENANCE && truck.maintenanceStatus?.expectedCompletion && (
                  <CardFooter className="border-t pt-4">
                    <p className="text-sm text-orange-700 w-full">
                      <span className="font-medium">Maintenance</span>: Expected completion on {new Date(truck.maintenanceStatus.expectedCompletion).toLocaleDateString()}
                    </p>
                  </CardFooter>
                )}
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleDetails;