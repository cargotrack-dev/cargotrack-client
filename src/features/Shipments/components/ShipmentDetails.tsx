// src/features/Shipment/components/ShipmentDetails.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../UI/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../UI/components/ui/tabs';
import { Button } from '../../UI/components/ui/button';
import { Badge } from '../../UI/components/ui/badge';
import { Separator } from '../../UI/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../UI/components/ui/table';
import {
  Truck as TruckIcon,
  Package,
  Map,
  FileText,
  User,
  Clipboard,
  ArrowLeft as ChevronLeft,
  Edit,
  Route,
  Trash2,
  Download,
  PenTool,
  DollarSign,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Mail
} from 'lucide-react';
import { Shipment } from '../types/shipment';
import { StatusUpdate } from '../../Tracking/types/tracking';
import ShipmentService from '../services/ShipmentService';
import ShipmentStatusBadge from './ShipmentStatusBadge';
import { useAuth } from '../../Auth/hooks/useAuth';


// Define the document type
interface Document {
  id: string;
  type: string;
  reference: string;
  fileUrl?: string;
  createdAt?: Date;
}

// Add missing properties to the Shipment interface
interface ExtendedShipment extends Shipment {
  waybillNumber?: string;
  isDelayed?: boolean;
  delayReason?: string;
  currentLocation?: {
    latitude: number;
    longitude: number;
    timestamp: string; // Changed from Date to string to match Location type
  };
  customer?: {
    name: string;
    contactName?: string;
    contactPhone?: string;
    contactEmail?: string;
  };
  trackingUpdates?: StatusUpdate[];
}

const ShipmentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  useAuth();
  const [shipment, setShipment] = useState<ExtendedShipment | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Status update state
  useState('');
  useState<string>('');

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

        setShipment(data as ExtendedShipment);
      } catch (err) {
        console.error('Error fetching shipment:', err);
        setError('Failed to load shipment details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchShipment();
  }, [id]);


  // Navigation functions
  const handleBack = () => {
    navigate('/shipments');
  };

  const handleEdit = () => {
    navigate(`/shipments/${id}/edit`);
  };

  const handleTrack = () => {
    navigate(`/shipments/${id}/track`);
  };

  const handleDelete = async () => {
    if (!id || !shipment) return;

    if (window.confirm(`Are you sure you want to delete shipment ${shipment.reference}?`)) {
      try {
        await ShipmentService.deleteShipment(id);
        navigate('/shipments', { replace: true });
      } catch (err) {
        console.error('Error deleting shipment:', err);
        alert('Failed to delete shipment. Please try again later.');
      }
    }
  };

  // Document generation functions
  const handleGenerateWaybill = async () => {
    if (!id) return;

    try {
      // In a real app, this would generate a PDF
      alert('Waybill generation would be implemented here');
    } catch (err) {
      console.error('Error generating waybill:', err);
      alert('Failed to generate waybill. Please try again later.');
    }
  };

  const handleGenerateInvoice = async () => {
    if (!id) return;

    try {
      // In a real app, this would generate a PDF
      alert('Invoice generation would be implemented here');
    } catch (err) {
      console.error('Error generating invoice:', err);
      alert('Failed to generate invoice. Please try again later.');
    }
  };

  // Utility functions
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'N/A';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj);
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  // Get time elapsed since estimated delivery if delayed
  const getDelayDuration = () => {
    if (!shipment || !shipment.isDelayed) return null;

    const now = new Date();
    const estimatedDelivery = new Date(shipment.schedule.plannedEnd);

    if (now <= estimatedDelivery) return null;

    const diffMs = now.getTime() - estimatedDelivery.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHrs < 24) {
      return `${diffHrs} hours`;
    } else {
      const diffDays = Math.floor(diffHrs / 24);
      return `${diffDays} days`;
    }
  };

  // Calculate ETA or show delivered time
  const getDeliveryInfo = () => {
    if (!shipment) return null;

    if (shipment.status === 'COMPLETED' && shipment.schedule.actualEnd) {
      return (
        <div className="flex items-center text-green-600">
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Delivered on {formatDate(shipment.schedule.actualEnd)}
        </div>
      );
    }

    const delayDuration = getDelayDuration();
    if (delayDuration) {
      return (
        <div className="flex items-center text-red-600">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Delayed by {delayDuration}
        </div>
      );
    }

    return (
      <div className="flex items-center">
        <Clock className="h-4 w-4 mr-2 text-blue-500" />
        Expected delivery: {formatDate(shipment.schedule.plannedEnd)}
      </div>
    );
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
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Shipments
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="outline" size="sm" onClick={handleBack} className="mr-4">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Shipment {shipment.reference}</h1>
          <ShipmentStatusBadge status={shipment.status} />
        </div>
        <div className="flex space-x-2">
          {shipment.status === 'IN_TRANSIT' && (
            <Button onClick={handleTrack}>
              <Route className="h-4 w-4 mr-2" />
              Track
            </Button>
          )}
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" onClick={handleDelete} className="bg-red-100 text-red-600 hover:bg-red-200">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Shipment Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{shipment.reference}</h2>
              <p className="text-gray-500 mt-1">{shipment.description}</p>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <ShipmentStatusBadge status={shipment.status} />
              <Badge variant="outline" className="mt-1">
                Priority: {shipment.priority}
              </Badge>
              {shipment.isDelayed && (
                <Badge variant="destructive">Delayed</Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div>
              <p className="text-sm text-gray-500">Origin</p>
              <p className="font-medium">{shipment.origin.name}</p>
              <p className="text-sm">{shipment.origin.city}, {shipment.origin.country}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Destination</p>
              <p className="font-medium">{shipment.destination.name}</p>
              <p className="text-sm">{shipment.destination.city}, {shipment.destination.country}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Planned Departure</p>
              <p className="font-medium">{formatDate(shipment.schedule.plannedStart)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Planned Arrival</p>
              <p className="font-medium">{formatDate(shipment.schedule.plannedEnd)}</p>
            </div>
          </div>

          {shipment.tracking?.lastKnownLocation && (
            <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-100">
              <div className="flex items-center">
                <TruckIcon className="h-5 w-5 text-blue-500 mr-2" />
                <div>
                  <p className="text-sm text-blue-700">
                    Last Updated: {formatDate(shipment.tracking.lastKnownLocation.timestamp)}
                  </p>
                  <p>
                    <Badge variant="secondary" className="mr-2">
                      Lat: {shipment.tracking.lastKnownLocation.latitude.toFixed(4)}
                    </Badge>
                    <Badge variant="secondary">
                      Long: {shipment.tracking.lastKnownLocation.longitude.toFixed(4)}
                    </Badge>
                    {shipment.tracking.lastKnownLocation.speed && (
                      <Badge variant="secondary" className="ml-2">
                        Speed: {shipment.tracking.lastKnownLocation.speed} mph
                      </Badge>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-6 md:w-auto w-full">
          <TabsTrigger value="overview">
            <Clipboard className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="tracking">
            <Route className="h-4 w-4 mr-2" />
            Tracking
          </TabsTrigger>
          <TabsTrigger value="cargo">
            <Package className="h-4 w-4 mr-2" />
            Cargo
          </TabsTrigger>
          <TabsTrigger value="route">
            <Map className="h-4 w-4 mr-2" />
            Route
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="h-4 w-4 mr-2" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="costs">
            <DollarSign className="h-4 w-4 mr-2" />
            Costs
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Shipment Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Waybill Number</h3>
                      <p className="font-semibold">{shipment.waybillNumber || shipment.reference}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Current Status</h3>
                      <div className="flex items-center">
                        <ShipmentStatusBadge status={shipment.status} />
                        {shipment.isDelayed && (
                          <Badge variant="destructive" className="ml-2 mt-1">
                            Delayed
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Origin</h3>
                      <p className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                        {shipment.origin.address}, {shipment.origin.city}, {shipment.origin.country}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Current Location</h3>
                      <p className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                        {
                          shipment.tracking?.lastKnownLocation
                            ? `${shipment.tracking.lastKnownLocation.latitude.toFixed(6)}, ${shipment.tracking.lastKnownLocation.longitude.toFixed(6)}`
                            : 'Location data not available'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Assigned Driver</h3>
                      <p className="flex items-center">
                        <User className="h-4 w-4 mr-1 text-gray-500" />
                        {shipment.drivers && shipment.drivers.length > 0
                          ? shipment.drivers[0].name
                          : 'Unassigned'}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Vehicle</h3>
                      <p className="flex items-center">
                        <TruckIcon className="h-4 w-4 mr-1 text-gray-500" />
                        {shipment.vehicles && shipment.vehicles.length > 0
                          ? `${shipment.vehicles[0].make} ${shipment.vehicles[0].model}`
                          : 'Unassigned'}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Delivery Information</h3>
                      {getDeliveryInfo()}
                    </div>

                    {shipment.delayReason && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Delay Reason</h3>
                        <p className="text-red-600">{shipment.delayReason}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <Button variant="outline" onClick={handleGenerateWaybill}>
                    <FileText className="h-4 w-4 mr-2" />
                    View Waybill Details
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Customer</h3>
                    <p className="font-semibold">
                      {shipment.customer?.name || 'Not Available'}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Contact Person</h3>
                    <p>{shipment.customer?.contactName || 'Not Available'}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                    <p className="flex items-center">
                      <Phone className="h-4 w-4 mr-1 text-gray-500" />
                      {shipment.customer?.contactPhone || 'Not Available'}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="flex items-center">
                      <Mail className="h-4 w-4 mr-1 text-gray-500" />
                      {shipment.customer?.contactEmail || 'Not Available'}
                    </p>
                  </div>

                  <div className="pt-2">
                    <Button className="w-full">
                      Notify Customer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Schedule information */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Planned Start</p>
                      <p className="font-medium">{formatDate(shipment.schedule.plannedStart)}</p>
                    </div>
                    {shipment.schedule.actualStart && (
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Actual Start</p>
                        <p className="font-medium">{formatDate(shipment.schedule.actualStart)}</p>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Planned End</p>
                      <p className="font-medium">{formatDate(shipment.schedule.plannedEnd)}</p>
                    </div>
                    {shipment.schedule.actualEnd && (
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Actual End</p>
                        <p className="font-medium">{formatDate(shipment.schedule.actualEnd)}</p>
                      </div>
                    )}
                  </div>

                  {shipment.tracking?.currentEta && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm text-gray-500">Current ETA</p>
                        <p className="font-medium">{formatDate(shipment.tracking.currentEta)}</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            {shipment.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{shipment.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Tracking Tab */}
        <TabsContent value="tracking">
          <div className="space-y-6">
            {/* Status Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Status Timeline</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute h-full w-0.5 bg-gray-200 left-2.5 top-0"></div>

                  {/* Timeline items */}
                  {shipment.tracking?.trackingEvents && shipment.tracking.trackingEvents.length > 0 ? (
                    <div className="space-y-6 ml-10">
                      {shipment.tracking.trackingEvents.map((update, index) => (
                        <div key={index} className="relative">
                          {/* Status dot */}
                          <div className={`absolute w-5 h-5 rounded-full bg-blue-500 border-2 border-white left-[-30px] top-1`}></div>

                          <div className="pb-2">
                            <div className="flex items-center">
                              <span className="font-semibold">{update.type}</span>
                              <span className="ml-4 text-sm text-gray-500">{formatDate(update.timestamp)}</span>
                            </div>

                            {update.location && (
                              <div className="flex items-center mt-1 text-sm">
                                <MapPin className="h-3 w-3 mr-1 text-gray-500" />
                                {`${update.location.latitude.toFixed(6)}, ${update.location.longitude.toFixed(6)}`}
                              </div>
                            )}

                            {update.description && (
                              <p className="mt-1 text-sm">{update.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-6">
                      <p className="text-gray-500">No tracking events available for this shipment.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Route Tab */}
        <TabsContent value="route">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Route & Stops</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-8">
                <h3 className="font-medium mb-2">Origin to Destination</h3>
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-2 rounded-full mt-1">
                    <MapPin className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1 border-r border-dashed border-gray-300 pr-4">
                    <p className="font-medium">{shipment.origin.name}</p>
                    <p className="text-sm text-gray-500">
                      {shipment.origin.address}<br />
                      {shipment.origin.city}, {shipment.origin.state} {shipment.origin.country}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Departure: {formatDate(shipment.schedule.plannedStart)}
                    </p>
                  </div>
                  <div className="flex-1 pl-4">
                    <p className="font-medium">{shipment.destination.name}</p>
                    <p className="text-sm text-gray-500">
                      {shipment.destination.address}<br />
                      {shipment.destination.city}, {shipment.destination.state} {shipment.destination.country}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Arrival: {formatDate(shipment.schedule.plannedEnd)}
                    </p>
                  </div>
                </div>
              </div>

              {shipment.stops && shipment.stops.length > 0 ? (
                <div>
                  <h3 className="font-medium mb-4">Intermediate Stops ({shipment.stops.length})</h3>
                  <div className="space-y-6">
                    {shipment.stops.map((stop, index) => (
                      <div key={stop.id} className="border rounded-md p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center">
                            <div className="bg-blue-100 p-2 rounded-full mr-2">
                              <MapPin className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">Stop {index + 1}: {stop.location.name}</p>
                              <p className="text-sm text-gray-500">
                                {stop.location.address}, {stop.location.city}, {stop.location.country}
                              </p>
                            </div>
                          </div>
                          <Badge>{stop.type}</Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-4">
                          <div>
                            <p className="text-sm text-gray-500">Scheduled Arrival</p>
                            <p>{formatDate(stop.scheduledArrival)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Scheduled Departure</p>
                            <p>{formatDate(stop.scheduledDeparture)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <Badge variant="outline">{stop.status}</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center p-6 border border-dashed rounded-md">
                  <Map className="h-12 w-12 mx-auto text-gray-300" />
                  <p className="mt-2 text-gray-500">No intermediate stops defined for this route</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Documents</span>
                <div className="flex space-x-2">
                  <Button size="sm" onClick={handleGenerateWaybill}>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Waybill
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleGenerateInvoice}>
                    <PenTool className="h-4 w-4 mr-2" />
                    Generate Invoice
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {shipment.documents && shipment.documents.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shipment.documents.map((doc: Document) => (
                      <TableRow key={doc.id}>
                        <TableCell>
                          <Badge variant="outline">{doc.type}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{doc.reference}</TableCell>
                        <TableCell>
                          {doc.createdAt ? formatDate(doc.createdAt) : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {doc.fileUrl && (
                            <Button variant="ghost" size="sm">
                              <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </a>
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center p-6 border border-dashed rounded-md">
                  <FileText className="h-12 w-12 mx-auto text-gray-300" />
                  <p className="mt-2 text-gray-500">No documents associated with this shipment</p>
                  <div className="flex justify-center space-x-2 mt-4">
                    <Button size="sm" onClick={handleGenerateWaybill}>
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Waybill
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleGenerateInvoice}>
                      <PenTool className="h-4 w-4 mr-2" />
                      Generate Invoice
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Costs Tab */}
        <TabsContent value="costs">
          <Card>
            <CardHeader>
              <CardTitle>Cost Information</CardTitle>
              <CardDescription>
                Estimated and actual costs for this shipment
              </CardDescription>
            </CardHeader>
            <CardContent>
              {shipment.costs ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Summary</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between p-3 bg-gray-50 rounded-md">
                        <span className="font-medium">Estimated Total:</span>
                        <span className="font-bold">
                          {formatCurrency(shipment.costs.estimatedTotal, shipment.costs.currency)}
                        </span>
                      </div>

                      {shipment.costs.actualTotal !== undefined && (
                        <div className="flex justify-between p-3 bg-blue-50 rounded-md">
                          <span className="font-medium">Actual Total:</span>
                          <span className="font-bold">
                            {formatCurrency(shipment.costs.actualTotal, shipment.costs.currency)}
                          </span>
                        </div>
                      )}

                      {shipment.costs.actualTotal !== undefined && (
                        <div className="flex justify-between p-3 rounded-md border">
                          <span className="font-medium">Difference:</span>
                          <span className={
                            shipment.costs.actualTotal > shipment.costs.estimatedTotal
                              ? 'font-bold text-red-600'
                              : 'font-bold text-green-600'
                          }>
                            {formatCurrency(
                              shipment.costs.actualTotal - shipment.costs.estimatedTotal,
                              shipment.costs.currency
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Cost Breakdown</h3>
                    {shipment.costs.breakdown && shipment.costs.breakdown.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Category</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Estimated</TableHead>
                            <TableHead className="text-right">Actual</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {shipment.costs.breakdown.map((cost, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Badge variant="outline">{cost.category}</Badge>
                              </TableCell>
                              <TableCell>{cost.description}</TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(cost.estimatedAmount, shipment.costs.currency)}
                              </TableCell>
                              <TableCell className="text-right">
                                {cost.actualAmount !== undefined
                                  ? formatCurrency(cost.actualAmount, shipment.costs.currency)
                                  : 'N/A'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center p-6 border border-dashed rounded-md">
                        <DollarSign className="h-12 w-12 mx-auto text-gray-300" />
                        <p className="mt-2 text-gray-500">No cost breakdown available</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center p-6 border border-dashed rounded-md">
                  <DollarSign className="h-12 w-12 mx-auto text-gray-300" />
                  <p className="mt-2 text-gray-500">No cost information available for this shipment</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShipmentDetails; 