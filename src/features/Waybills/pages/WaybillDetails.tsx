// src/pages/waybills/WaybillDetails.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FileText, Truck, User, Package, MapPin, Calendar,
    DollarSign, Clock, ArrowLeft, Printer, Edit,
    File, Send, CheckCircle, XCircle, AlignRight
} from 'lucide-react';
import { Button } from '@features/UI/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@features/UI/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@features/UI/components/ui/tabs';
import {
    WaybillDocument,
    WaybillStatus,
    StatusHistoryEntry,
    AdditionalCharge,
    DocumentEntry
} from '../types/waybill.types';

// Mock data - replace with API call
const mockWaybill: WaybillDocument = {
    id: 'WB-2025-000001',
    client: {
        id: 'CLT-001',
        name: 'ACME Logistics',
        contactPerson: 'James Wilson',
        phone: '+1 (555) 123-4567',
        email: 'jwilson@acmelogistics.com'
    },
    shipper: {
        name: 'TechGadgets Inc.',
        address: '123 Innovation Ave, New York, NY 10001',
        phone: '+1 (555) 987-6543',
        email: 'shipping@techgadgets.com'
    },
    consignee: {
        name: 'WestCoast Electronics',
        address: '456 Silicon Blvd, Los Angeles, CA 90001',
        phone: '+1 (555) 789-0123',
        email: 'receiving@westcoastelectronics.com'
    },
    origin: 'New York, NY',
    destination: 'Los Angeles, CA',
    pickupDate: '2025-02-15',
    estimatedDeliveryDate: '2025-02-20',
    actualDeliveryDate: null,
    truck: {
        id: 'TRK-001',
        licensePlate: 'NY-CARGO-789',
        driver: {
            name: 'John Smith',
            license: 'CDL-123456-NY',
            phone: '+1 (555) 234-5678'
        },
        currentLocation: {
            lat: 39.7456,
            lng: -97.0892,
            lastUpdated: '2025-02-17T14:30:00Z'
        }
    },
    status: 'in_transit',
    statusHistory: [
        {
            status: 'pending',
            timestamp: '2025-02-14T10:15:00Z',
            location: 'New York, NY',
            note: 'Waybill created and assigned to truck',
            updatedBy: 'Alice Johnson (Admin)'
        },
        {
            status: 'pending',
            timestamp: '2025-02-15T08:30:00Z',
            location: 'New York, NY',
            note: 'Truck arrived at pickup location',
            updatedBy: 'John Smith (Driver)'
        },
        {
            status: 'in_transit',
            timestamp: '2025-02-15T11:45:00Z',
            location: 'New York, NY',
            note: 'Cargo loaded, truck departed',
            updatedBy: 'John Smith (Driver)'
        },
        {
            status: 'in_transit',
            timestamp: '2025-02-17T14:30:00Z',
            location: 'Columbus, OH',
            note: 'En route, all systems normal',
            updatedBy: 'John Smith (Driver)'
        }
    ],
    cargo: {
        description: 'Consumer Electronics - Smartphones and Tablets',
        type: 'Electronics',
        weight: 2500,
        units: 350,
        value: 175000,
        dimensions: {
            length: 250,
            width: 180,
            height: 210
        },
        hazardous: false,
        specialInstructions: 'Handle with care. Keep away from extreme temperatures.'
    },
    pricing: {
        baseRate: 5200,
        additionalCharges: [
            {
                description: 'Rush delivery fee',
                amount: 750
            },
            {
                description: 'Insurance premium',
                amount: 450
            },
            {
                description: 'Packaging materials',
                amount: 180
            }
        ],
        tax: 8.5,
        total: 7129.85,
        currency: 'USD'
    },
    documents: [
        {
            type: 'Bill of Lading',
            url: '/documents/bol-2025-000001.pdf',
            uploadedAt: '2025-02-15T09:20:00Z'
        },
        {
            type: 'Load Manifest',
            url: '/documents/manifest-2025-000001.pdf',
            uploadedAt: '2025-02-15T09:25:00Z'
        }
    ],
    signatures: {
        shipper: {
            name: 'Michael Johnson',
            date: '2025-02-15T10:30:00Z'
        },
        driver: {
            name: 'John Smith',
            date: '2025-02-15T10:35:00Z'
        }
    },
    invoiceGenerated: true,
    invoiceId: 'INV-2025-000118',
    notes: 'Customer requested delivery notification 2 hours prior to arrival.',
    createdAt: '2025-02-14T10:15:00Z',
    updatedAt: '2025-02-17T14:30:00Z'
};

const WaybillDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [waybill, setWaybill] = useState<WaybillDocument | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        // In a real app, this would be an API call
        setIsLoading(true);
        setTimeout(() => {
            // Simulate fetching the waybill by ID
            setWaybill(mockWaybill);
            setIsLoading(false);
        }, 800);
    }, [id]);

    const handleBack = () => {
        navigate('/waybills');
    };

    const handleUpdateStatus = (newStatus: WaybillStatus) => {
        // In a real app, this would be an API call
        console.log(`Updating status to: ${newStatus}`);
        // Then refresh the waybill data
    };

    const getStatusBadgeClass = (status: WaybillStatus) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'in_transit':
                return 'bg-blue-100 text-blue-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: WaybillStatus) => {
        switch (status) {
            case 'pending':
                return 'Pending';
            case 'in_transit':
                return 'In Transit';
            case 'delivered':
                return 'Delivered';
            case 'cancelled':
                return 'Cancelled';
            default:
                return status;
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto p-4 flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!waybill) {
        return (
            <div className="container mx-auto p-4">
                <div className="bg-red-50 text-red-800 p-4 rounded-md">
                    <h2 className="text-lg font-semibold">Waybill Not Found</h2>
                    <p className="mt-2">The waybill you're looking for doesn't exist or has been removed.</p>
                    <Button
                        variant="outline"
                        className="mt-4"
                        onClick={handleBack}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Waybills
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" onClick={handleBack} className="p-1">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <FileText className="h-6 w-6 text-blue-600" />
                            <h1 className="text-2xl font-bold">{waybill.id}</h1>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(waybill.status)}`}>
                                {getStatusLabel(waybill.status)}
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm">
                            Created: {new Date(waybill.createdAt).toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button variant="outline">
                        <Printer className="mr-2 h-4 w-4" />
                        Print
                    </Button>
                    <Button variant="outline">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Send className="mr-2 h-4 w-4" />
                        Share
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="w-full bg-gray-50 p-1">
                    <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                    <TabsTrigger value="tracking" className="flex-1">Tracking</TabsTrigger>
                    <TabsTrigger value="documents" className="flex-1">Documents</TabsTrigger>
                    <TabsTrigger value="finance" className="flex-1">Finance</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    {/* Status Actions */}
                    {waybill.status !== 'delivered' && waybill.status !== 'cancelled' && (
                        <Card className="border-blue-100">
                            <CardContent className="p-4">
                                <div className="flex flex-wrap items-center gap-4">
                                    <span className="text-gray-700 font-medium">Update Status:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {waybill.status === 'pending' && (
                                            <Button
                                                size="sm"
                                                onClick={() => handleUpdateStatus('in_transit')}
                                            >
                                                <Truck className="mr-2 h-4 w-4" />
                                                Mark as In Transit
                                            </Button>
                                        )}
                                        {waybill.status === 'in_transit' && (
                                            <Button
                                                size="sm"
                                                onClick={() => handleUpdateStatus('delivered')}
                                            >
                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                Mark as Delivered
                                            </Button>
                                        )}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleUpdateStatus('cancelled')}
                                        >
                                            <XCircle className="mr-2 h-4 w-4" />
                                            Cancel Waybill
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-gray-500" />
                                    Route Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div>
                                        <span className="text-sm text-gray-500">Origin:</span>
                                        <p className="font-medium">{waybill.origin}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Destination:</span>
                                        <p className="font-medium">{waybill.destination}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Distance:</span>
                                        <p className="font-medium">2,789 miles</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    Schedule
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div>
                                        <span className="text-sm text-gray-500">Pickup Date:</span>
                                        <p className="font-medium">
                                            {new Date(waybill.pickupDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Est. Delivery Date:</span>
                                        <p className="font-medium">
                                            {new Date(waybill.estimatedDeliveryDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Time in Transit:</span>
                                        <p className="font-medium">5 days</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-gray-500" />
                                    Financial Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div>
                                        <span className="text-sm text-gray-500">Total Amount:</span>
                                        <p className="font-medium">
                                            {new Intl.NumberFormat('en-US', {
                                                style: 'currency',
                                                currency: waybill.pricing.currency
                                            }).format(waybill.pricing.total)}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Invoice Status:</span>
                                        <p className="font-medium">
                                            {waybill.invoiceGenerated
                                                ? <span className="text-green-600">Generated</span>
                                                : <span className="text-yellow-600">Pending</span>
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Invoice #:</span>
                                        <p className="font-medium">
                                            {waybill.invoiceId || 'Not generated yet'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Cargo & Trucking */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5 text-blue-600" />
                                    Cargo Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-sm text-gray-500">Description:</span>
                                            <p className="font-medium">{waybill.cargo.description}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-500">Type:</span>
                                            <p className="font-medium">{waybill.cargo.type}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-sm text-gray-500">Weight:</span>
                                            <p className="font-medium">{waybill.cargo.weight} kg</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-500">Units:</span>
                                            <p className="font-medium">{waybill.cargo.units} units</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-sm text-gray-500">Value:</span>
                                            <p className="font-medium">
                                                {new Intl.NumberFormat('en-US', {
                                                    style: 'currency',
                                                    currency: waybill.pricing.currency
                                                }).format(waybill.cargo.value)}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-500">Hazardous:</span>
                                            <p className="font-medium">
                                                {waybill.cargo.hazardous ? 'Yes' : 'No'}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-sm text-gray-500">Dimensions:</span>
                                        <p className="font-medium">
                                            {waybill.cargo.dimensions.length} × {waybill.cargo.dimensions.width} × {waybill.cargo.dimensions.height} cm
                                        </p>
                                    </div>

                                    {waybill.cargo.specialInstructions && (
                                        <div>
                                            <span className="text-sm text-gray-500">Special Instructions:</span>
                                            <p className="font-medium text-amber-600">{waybill.cargo.specialInstructions}</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Truck className="h-5 w-5 text-blue-600" />
                                    Truck & Driver Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-sm text-gray-500">Truck ID:</span>
                                            <p className="font-medium">{waybill.truck.id}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-500">License Plate:</span>
                                            <p className="font-medium">{waybill.truck.licensePlate}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-sm text-gray-500">Driver:</span>
                                        <p className="font-medium">{waybill.truck.driver.name}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-sm text-gray-500">Driver License:</span>
                                            <p className="font-medium">{waybill.truck.driver.license}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-500">Contact:</span>
                                            <p className="font-medium">{waybill.truck.driver.phone}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-sm text-gray-500">Current Location:</span>
                                        <p className="font-medium flex items-center">
                                            <MapPin className="h-4 w-4 mr-1 text-red-500" />
                                            {waybill.truck.currentLocation ? (
                                                <>
                                                    {waybill.truck.currentLocation.lat.toFixed(4)}, {waybill.truck.currentLocation.lng.toFixed(4)}
                                                    <span className="text-xs text-gray-500 ml-2">
                                                        Updated: {new Date(waybill.truck.currentLocation.lastUpdated).toLocaleString()}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-gray-500">No location available</span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Parties */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5 text-blue-600" />
                                Involved Parties
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-2">Client</h3>
                                    <div className="space-y-2">
                                        <p className="font-medium">{waybill.client.name}</p>
                                        <p>{waybill.client.contactPerson}</p>
                                        <p>{waybill.client.phone}</p>
                                        <p className="text-blue-600">{waybill.client.email}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-2">Shipper</h3>
                                    <div className="space-y-2">
                                        <p className="font-medium">{waybill.shipper.name}</p>
                                        <p>{waybill.shipper.address}</p>
                                        <p>{waybill.shipper.phone}</p>
                                        <p className="text-blue-600">{waybill.shipper.email}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-2">Consignee</h3>
                                    <div className="space-y-2">
                                        <p className="font-medium">{waybill.consignee.name}</p>
                                        <p>{waybill.consignee.address}</p>
                                        <p>{waybill.consignee.phone}</p>
                                        <p className="text-blue-600">{waybill.consignee.email}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tracking Tab */}
                <TabsContent value="tracking" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-blue-600" />
                                Status Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative">
                                {/* Timeline line */}
                                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                                <div className="space-y-8">
                                    {waybill.statusHistory.map((event: StatusHistoryEntry, index: number) => (
                                        <div key={index} className="relative pl-10">
                                            {/* Status dot */}
                                            <div className={`absolute left-0 w-6 h-6 rounded-full border-2 flex items-center justify-center
                        ${index === 0 ? 'bg-blue-100 border-blue-600' : 'bg-white border-gray-300'}`}
                                            >
                                                <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                                            </div>

                                            <div>
                                                <div className="flex flex-wrap items-baseline gap-x-2">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(event.status)}`}>
                                                        {getStatusLabel(event.status)}
                                                    </span>
                                                    <span className="text-gray-500 text-sm">
                                                        {new Date(event.timestamp).toLocaleString()}
                                                    </span>
                                                </div>

                                                <div className="mt-1">
                                                    <div className="font-medium">{event.note}</div>
                                                    <div className="text-sm flex items-center gap-2 mt-1">
                                                        <MapPin className="h-3 w-3 text-gray-400" />
                                                        <span className="text-gray-600">{event.location}</span>
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        Updated by: {event.updatedBy}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Location Map</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-gray-100 h-64 rounded-md flex items-center justify-center">
                                <p className="text-gray-500">Map integration will be implemented here</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Documents Tab */}
                <TabsContent value="documents" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Waybill Documents</CardTitle>
                                <Button size="sm">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Upload New Document
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {waybill.documents && waybill.documents.length > 0 ? (
                                <div className="space-y-4">
                                    {waybill.documents.map((doc: DocumentEntry, index: number) => (
                                        <div key={index} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
                                            <div className="flex items-center">
                                                <File className="h-8 w-8 text-blue-500 mr-3" />
                                                <div>
                                                    <p className="font-medium">{doc.type}</p>
                                                    <p className="text-sm text-gray-500">
                                                        Uploaded: {new Date(doc.uploadedAt).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm">
                                                Download
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <File className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900">No documents yet</h3>
                                    <p className="text-gray-500 max-w-md mx-auto mt-2">
                                        There are no documents attached to this waybill yet.
                                        Click 'Upload New Document' to add one.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Signatures</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="border rounded-md p-4">
                                    <h3 className="font-medium mb-2">Shipper</h3>
                                    {waybill.signatures?.shipper ? (
                                        <div className="space-y-2">
                                            <div className="h-20 bg-gray-50 border rounded-md flex items-center justify-center">
                                                <span className="italic text-gray-600">{waybill.signatures.shipper.name}</span>
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                Signed: {new Date(waybill.signatures.shipper.date).toLocaleString()}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="h-20 bg-gray-50 border rounded-md flex items-center justify-center">
                                            <span className="text-gray-400">Not signed</span>
                                        </div>
                                    )}
                                </div>

                                <div className="border rounded-md p-4">
                                    <h3 className="font-medium mb-2">Driver</h3>
                                    {waybill.signatures?.driver ? (
                                        <div className="space-y-2">
                                            <div className="h-20 bg-gray-50 border rounded-md flex items-center justify-center">
                                                <span className="italic text-gray-600">{waybill.signatures.driver.name}</span>
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                Signed: {new Date(waybill.signatures.driver.date).toLocaleString()}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="h-20 bg-gray-50 border rounded-md flex items-center justify-center">
                                            <span className="text-gray-400">Not signed</span>
                                        </div>
                                    )}
                                </div>

                                <div className="border rounded-md p-4">
                                    <h3 className="font-medium mb-2">Driver</h3>
                                    {waybill.signatures?.driver ? (
                                        <div className="space-y-2">
                                            <div className="h-20 bg-gray-50 border rounded-md flex items-center justify-center">
                                                <span className="italic text-gray-600">{waybill.signatures.driver.name}</span>
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                Signed: {new Date(waybill.signatures.driver.date).toLocaleString()}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="h-20 bg-gray-50 border rounded-md flex items-center justify-center">
                                            <span className="text-gray-400">Not signed</span>
                                        </div>
                                    )}
                                </div>

                                <div className="border rounded-md p-4">
                                    <h3 className="font-medium mb-2">Consignee</h3>
                                    {waybill.signatures?.consignee ? (
                                        <div className="space-y-2">
                                            <div className="h-20 bg-gray-50 border rounded-md flex items-center justify-center">
                                                <span className="italic text-gray-600">{waybill.signatures.consignee.name}</span>
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                Signed: {new Date(waybill.signatures.consignee.date).toLocaleString()}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="h-20 bg-gray-50 border rounded-md flex items-center justify-center">
                                            <span className="text-gray-400">Not signed</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Finance Tab */}
                <TabsContent value="finance" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Invoice Details</CardTitle>
                                {!waybill.invoiceGenerated && (
                                    <Button>
                                        <DollarSign className="mr-2 h-4 w-4" />
                                        Generate Invoice
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {waybill.invoiceGenerated ? (
                                <div className="space-y-6">
                                    <div className="flex justify-between border-b pb-4">
                                        <div>
                                            <span className="text-sm text-gray-500">Invoice Number:</span>
                                            <p className="font-medium">{waybill.invoiceId}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm text-gray-500">Status:</span>
                                            <p className="font-medium text-amber-600">Pending Payment</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-medium mb-3">Pricing Breakdown</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span>Base Rate:</span>
                                                <span className="font-medium">
                                                    {new Intl.NumberFormat('en-US', {
                                                        style: 'currency',
                                                        currency: waybill.pricing.currency
                                                    }).format(waybill.pricing.baseRate)}
                                                </span>
                                            </div>

                                            {waybill.pricing.additionalCharges.map((charge: AdditionalCharge, index: number) => (
                                                <div key={index} className="flex justify-between">
                                                    <span>{charge.description}:</span>
                                                    <span>
                                                        {new Intl.NumberFormat('en-US', {
                                                            style: 'currency',
                                                            currency: waybill.pricing.currency
                                                        }).format(charge.amount)}
                                                    </span>
                                                </div>
                                            ))}

                                            <div className="flex justify-between border-t pt-2 mt-2">
                                                <span>Subtotal:</span>
                                                <span className="font-medium">
                                                    {new Intl.NumberFormat('en-US', {
                                                        style: 'currency',
                                                        currency: waybill.pricing.currency
                                                    }).format(
                                                        waybill.pricing.baseRate +
                                                        waybill.pricing.additionalCharges.reduce((sum, charge) => sum + charge.amount, 0)
                                                    )}
                                                </span>
                                            </div>

                                            <div className="flex justify-between">
                                                <span>Tax ({waybill.pricing.tax}%):</span>
                                                <span>
                                                    {new Intl.NumberFormat('en-US', {
                                                        style: 'currency',
                                                        currency: waybill.pricing.currency
                                                    }).format(
                                                        (waybill.pricing.baseRate +
                                                            waybill.pricing.additionalCharges.reduce((sum, charge) => sum + charge.amount, 0)) *
                                                        (waybill.pricing.tax / 100)
                                                    )}
                                                </span>
                                            </div>

                                            <div className="flex justify-between border-t pt-2 font-medium text-lg">
                                                <span>Total:</span>
                                                <span>
                                                    {new Intl.NumberFormat('en-US', {
                                                        style: 'currency',
                                                        currency: waybill.pricing.currency
                                                    }).format(waybill.pricing.total)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 justify-end">
                                        <Button variant="outline">
                                            <Printer className="mr-2 h-4 w-4" />
                                            Print Invoice
                                        </Button>
                                        <Button>
                                            <Send className="mr-2 h-4 w-4" />
                                            Send to Client
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900">No Invoice Generated</h3>
                                    <p className="text-gray-500 max-w-md mx-auto mt-2">
                                        An invoice hasn't been generated for this waybill yet.
                                        Click 'Generate Invoice' to create one.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Payment History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8">
                                <AlignRight className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900">No Payments Yet</h3>
                                <p className="text-gray-500 max-w-md mx-auto mt-2">
                                    This waybill doesn't have any payment records yet.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default WaybillDetails;