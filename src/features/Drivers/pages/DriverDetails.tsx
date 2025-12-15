// src/features/Drivers/pages/DriverDetails.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Truck, 
  CheckCircle, 
  XCircle,
  Package,
  ArrowLeft,
  Edit,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@features/UI/components/ui/card';
import { Button } from '@features/UI/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@features/UI/components/ui/tabs';
import { Badge } from '@features/UI/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@features/UI/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@features/UI/components/ui/table';
import { ResourceType, PermissionAction } from '@features/Core/types/auth';
import PermissionGate from '@features/Core/auth/PermissionGate';

// Define driver interface
interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: Date;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  dateOfBirth: Date;
  dateHired: Date;
  status: 'active' | 'inactive' | 'on_leave' | 'suspended';
  profileImage?: string;
  notes?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}

// Define vehicle interface
interface Vehicle {
  id: string;
  registrationNumber: string;
  model: string;
  type: string;
  status: string;
}

// Define shipment interface
interface Shipment {
  id: string;
  reference: string;
  origin: string;
  destination: string;
  departureDate: Date;
  arrivalDate: Date;
  status: 'pending' | 'in_transit' | 'delivered' | 'cancelled';
}

// Define document interface
interface Document {
  id: string;
  title: string;
  type: string;
  uploadDate: Date;
  expiryDate?: Date;
  fileUrl: string;
}

const DriverDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [assignedVehicle, setAssignedVehicle] = useState<Vehicle | null>(null);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDriverData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // In a real app, this would be API calls
        // const response = await api.get(`/drivers/${id}`);
        // setDriver(response.data);
        
        // Mock data for demonstration
        setTimeout(() => {
          // Mock driver data
          const mockDriver: Driver = {
            id: id || 'driver-001',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '+1 (555) 123-4567',
            licenseNumber: 'DL-12345678',
            licenseExpiry: new Date('2025-06-30'),
            address: '123 Trucking Lane',
            city: 'Chicago',
            state: 'IL',
            postalCode: '60601',
            country: 'United States',
            dateOfBirth: new Date('1985-04-15'),
            dateHired: new Date('2020-03-10'),
            status: 'active',
            profileImage: '',
            notes: 'Excellent driver with clean record. Prefers long-haul routes.',
            emergencyContact: {
              name: 'Jane Doe',
              relationship: 'Spouse',
              phone: '+1 (555) 987-6543'
            }
          };
          
          // Mock vehicle data
          const mockVehicle: Vehicle = {
            id: 'vehicle-001',
            registrationNumber: 'TRK-1001',
            model: 'Freightliner Cascadia',
            type: 'Semi-Truck',
            status: 'active'
          };
          
          // Mock shipments data
          const mockShipments: Shipment[] = [
            {
              id: 'shipment-001',
              reference: 'SH-2023-001',
              origin: 'Chicago, IL',
              destination: 'Columbus, OH',
              departureDate: new Date('2023-05-15T08:00:00'),
              arrivalDate: new Date('2023-05-15T16:30:00'),
              status: 'delivered'
            },
            {
              id: 'shipment-002',
              reference: 'SH-2023-025',
              origin: 'Detroit, MI',
              destination: 'Indianapolis, IN',
              departureDate: new Date('2023-05-18T07:30:00'),
              arrivalDate: new Date('2023-05-18T14:45:00'),
              status: 'delivered'
            },
            {
              id: 'shipment-003',
              reference: 'SH-2023-042',
              origin: 'Chicago, IL',
              destination: 'St. Louis, MO',
              departureDate: new Date('2023-05-20T06:15:00'),
              arrivalDate: new Date('2023-05-20T15:30:00'),
              status: 'in_transit'
            }
          ];
          
          // Mock documents data
          const mockDocuments: Document[] = [
            {
              id: 'doc-001',
              title: 'Driver\'s License',
              type: 'license',
              uploadDate: new Date('2022-01-15'),
              expiryDate: new Date('2025-06-30'),
              fileUrl: '/files/license.pdf'
            },
            {
              id: 'doc-002',
              title: 'Medical Certificate',
              type: 'medical',
              uploadDate: new Date('2023-02-10'),
              expiryDate: new Date('2024-02-10'),
              fileUrl: '/files/medical.pdf'
            },
            {
              id: 'doc-003',
              title: 'Employment Contract',
              type: 'contract',
              uploadDate: new Date('2020-03-10'),
              fileUrl: '/files/contract.pdf'
            }
          ];
          
          setDriver(mockDriver);
          setAssignedVehicle(mockVehicle);
          setShipments(mockShipments);
          setDocuments(mockDocuments);
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        console.error('Error fetching driver data:', err);
        setError('Failed to load driver data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchDriverData();
  }, [id]);
  
  const handleEditDriver = () => {
    navigate(`/drivers/edit/${id}`);
  };
  
  const handleAssignVehicle = () => {
    navigate(`/drivers/${id}/assign-vehicle`);
  };
  
  const handleViewShipment = (shipmentId: string) => {
    navigate(`/shipments/${shipmentId}`);
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case 'on_leave':
        return <Badge className="bg-yellow-100 text-yellow-800">On Leave</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const getShipmentStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>;
      case 'in_transit':
        return <Badge className="bg-blue-100 text-blue-800">In Transit</Badge>;
      case 'delivered':
        return <Badge className="bg-green-100 text-green-800">Delivered</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Driver</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <Button variant="outline" onClick={() => navigate('/drivers')}>
          Back to Drivers
        </Button>
      </div>
    );
  }
  
  if (!driver) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Driver Not Found</h3>
        <p className="text-gray-500 mb-4">The requested driver could not be found.</p>
        <Button variant="outline" onClick={() => navigate('/drivers')}>
          Back to Drivers
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center">
          <Button variant="outline" onClick={() => navigate('/drivers')} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Driver Details</h1>
        </div>
        
        <PermissionGate
          permissions={{ resource: ResourceType.DRIVER, action: PermissionAction.UPDATE }}
        >
          <Button onClick={handleEditDriver}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Driver
          </Button>
        </PermissionGate>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Driver Profile Card */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Driver Profile</CardTitle>
            <CardDescription>Personal and contact information</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-24 w-24 mb-4">
                {driver.profileImage ? (
                  <AvatarImage src={driver.profileImage} alt={`${driver.firstName} ${driver.lastName}`} />
                ) : (
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                    {driver.firstName[0]}{driver.lastName[0]}
                  </AvatarFallback>
                )}
              </Avatar>
              <h3 className="text-xl font-bold">{driver.firstName} {driver.lastName}</h3>
              <div className="flex items-center mt-2">
                {getStatusBadge(driver.status)}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{driver.email}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{driver.phone}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{driver.address}</p>
                  <p className="font-medium">{driver.city}, {driver.state} {driver.postalCode}</p>
                  <p className="font-medium">{driver.country}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="font-medium">{formatDate(driver.dateOfBirth)}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Date Hired</p>
                  <p className="font-medium">{formatDate(driver.dateHired)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* License and Emergency Contact Card */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Driver Information</CardTitle>
            <CardDescription>License and emergency contact details</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-6">
              <div>
                <h3 className="text-md font-semibold mb-2">License Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">License Number:</span>
                    <span className="font-medium">{driver.licenseNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Expiry Date:</span>
                    <span className="font-medium">{formatDate(driver.licenseExpiry)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span className={`font-medium ${
                      new Date(driver.licenseExpiry) > new Date() ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {new Date(driver.licenseExpiry) > new Date() ? 'Valid' : 'Expired'}
                    </span>
                  </div>
                </div>
              </div>
              
              {driver.emergencyContact && (
                <div>
                  <h3 className="text-md font-semibold mb-2">Emergency Contact</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Name:</span>
                      <span className="font-medium">{driver.emergencyContact.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Relationship:</span>
                      <span className="font-medium">{driver.emergencyContact.relationship}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phone:</span>
                      <span className="font-medium">{driver.emergencyContact.phone}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {driver.notes && (
                <div>
                  <h3 className="text-md font-semibold mb-2">Notes</h3>
                  <p className="text-gray-700">{driver.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Assigned Vehicle Card */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Assigned Vehicle</CardTitle>
                <CardDescription>Current vehicle assignment</CardDescription>
              </div>
              <PermissionGate
                permissions={{ resource: ResourceType.VEHICLE, action: PermissionAction.UPDATE }}
              >
                <Button size="sm" variant="outline" onClick={handleAssignVehicle}>
                  Assign
                </Button>
              </PermissionGate>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {assignedVehicle ? (
              <div>
                <div className="flex items-center justify-center my-6">
                  <Truck className="h-16 w-16 text-blue-500" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Registration:</span>
                    <span className="font-medium">{assignedVehicle.registrationNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Model:</span>
                    <span className="font-medium">{assignedVehicle.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Type:</span>
                    <span className="font-medium">{assignedVehicle.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span className="font-medium">
                      {assignedVehicle.status === 'active' ? (
                        <span className="flex items-center text-green-600">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600">
                          <XCircle className="h-4 w-4 mr-1" />
                          Inactive
                        </span>
                      )}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full">
                    View Vehicle Details
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48">
                <Truck className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500 mb-4">No vehicle currently assigned</p>
                <PermissionGate
                  permissions={{ resource: ResourceType.VEHICLE, action: PermissionAction.UPDATE }}
                >
                  <Button variant="outline" onClick={handleAssignVehicle}>
                    Assign Vehicle
                  </Button>
                </PermissionGate>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs for Shipments and Documents */}
      <div className="mt-8">
        <Tabs defaultValue="shipments">
          <TabsList className="mb-6">
            <TabsTrigger value="shipments">Shipments</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="shipments">
            <Card>
              <CardHeader>
                <CardTitle>Shipment History</CardTitle>
                <CardDescription>Recent and upcoming shipments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Reference</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Departure</TableHead>
                        <TableHead>Arrival</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shipments.length > 0 ? (
                        shipments.map(shipment => (
                          <TableRow key={shipment.id} className="cursor-pointer hover:bg-gray-50">
                            <TableCell className="font-medium">{shipment.reference}</TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="text-sm">From: {shipment.origin}</span>
                                <span className="text-sm">To: {shipment.destination}</span>
                              </div>
                            </TableCell>
                            <TableCell>{formatDateTime(shipment.departureDate)}</TableCell>
                            <TableCell>{formatDateTime(shipment.arrivalDate)}</TableCell>
                            <TableCell>{getShipmentStatusBadge(shipment.status)}</TableCell>
                            <TableCell>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleViewShipment(shipment.id)}
                              >
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            No shipments found for this driver.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <div className="flex justify-between items-center w-full">
                  <div className="text-sm text-gray-500">
                    Showing {shipments.length} shipments
                  </div>
                  <Button variant="outline" size="sm">
                    <Package className="h-4 w-4 mr-2" />
                    Assign Shipment
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Driver Documents</CardTitle>
                    <CardDescription>Licenses, certifications, and other documents</CardDescription>
                  </div>
                  <PermissionGate
                    permissions={{ resource: ResourceType.DOCUMENT, action: PermissionAction.CREATE }}
                  >
                    <Button size="sm">
                      Upload Document
                    </Button>
                  </PermissionGate>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Document Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Upload Date</TableHead>
                        <TableHead>Expiry Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documents.length > 0 ? (
                        documents.map(document => (
                          <TableRow key={document.id}>
                            <TableCell className="font-medium">{document.title}</TableCell>
                            <TableCell className="capitalize">{document.type}</TableCell>
                            <TableCell>{formatDate(document.uploadDate)}</TableCell>
                            <TableCell>
                              {document.expiryDate ? formatDate(document.expiryDate) : 'N/A'}
                            </TableCell>
                            <TableCell>
                              {document.expiryDate ? (
                                new Date(document.expiryDate) > new Date() ? (
                                  <Badge className="bg-green-100 text-green-800">Valid</Badge>
                                ) : (
                                  <Badge className="bg-red-100 text-red-800">Expired</Badge>
                                )
                              ) : (
                                <Badge className="bg-gray-100 text-gray-800">No Expiry</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="ghost">
                                  <a 
                                    href={document.fileUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                  >
                                    View
                                  </a>
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <a 
                                    href={document.fileUrl} 
                                    download={document.title}
                                  >
                                    Download
                                  </a>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            No documents found for this driver.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DriverDetails;