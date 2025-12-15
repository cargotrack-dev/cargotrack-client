// src/components/client/ClientPortal.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@features/UI/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@features/UI/components/ui/tabs';
import { Button } from '@features/UI/components/ui/button';
import { Input } from '@features/UI/components/ui/input';
import { Badge } from '@features/UI/components/ui/badge';
import {
  Truck,
  Package,
  FileText,
  Download,
  DollarSign,
  Search,
  Bell,
  Mail,
  Phone,
  Eye,
  Clock
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface ClientPortalProps {
  clientId: string;
}

// Fix leaflet icon issue
// Using proper TypeScript declaration to avoid the _getIconUrl error
const DefaultIcon = L.icon({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Set the default icon for all markers
L.Marker.prototype.options.icon = DefaultIcon;


// Define types for our client portal
interface Shipment {
  id: string;
  reference: string;
  status: 'SCHEDULED' | 'IN_TRANSIT' | 'DELIVERED' | 'DELAYED';
  origin: string;
  destination: string;
  departureDate: Date;
  estimatedArrival: Date;
  actualArrival?: Date;
  trackingEnabled: boolean;
  currentLocation?: {
    latitude: number;
    longitude: number;
    lastUpdated: Date;
  };
}

interface Invoice {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  issueDate: Date;
  dueDate: Date;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  shipmentId: string;
}

interface Document {
  id: string;
  type: string;
  reference: string;
  shipmentId: string;
  createDate: Date;
  fileUrl: string;
}

interface Notification {
  id: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS';
  message: string;
  timestamp: Date;
  read: boolean;
  shipmentId?: string;
}

interface ClientStats {
  totalShipments: number;
  activeShipments: number;
  deliveredOnTime: number;
  totalSpent: number;
  monthlyShipments: {
    month: string;
    shipments: number;
  }[];
}

// Mock data
const mockShipments: Shipment[] = [
  {
    id: 'ship-001',
    reference: 'SHP-2023-001',
    status: 'IN_TRANSIT',
    origin: 'New York, NY',
    destination: 'Los Angeles, CA',
    departureDate: new Date('2023-04-05'),
    estimatedArrival: new Date('2023-04-10'),
    trackingEnabled: true,
    currentLocation: {
      latitude: 39.8283,
      longitude: -98.5795,
      lastUpdated: new Date('2023-04-07T14:30:00')
    }
  },
  {
    id: 'ship-002',
    reference: 'SHP-2023-002',
    status: 'SCHEDULED',
    origin: 'Chicago, IL',
    destination: 'Miami, FL',
    departureDate: new Date('2023-04-12'),
    estimatedArrival: new Date('2023-04-18'),
    trackingEnabled: true
  },
  {
    id: 'ship-003',
    reference: 'SHP-2023-003',
    status: 'DELIVERED',
    origin: 'Seattle, WA',
    destination: 'Boston, MA',
    departureDate: new Date('2023-03-25'),
    estimatedArrival: new Date('2023-03-31'),
    actualArrival: new Date('2023-03-30'),
    trackingEnabled: true
  },
  {
    id: 'ship-004',
    reference: 'SHP-2023-004',
    status: 'DELAYED',
    origin: 'Houston, TX',
    destination: 'Denver, CO',
    departureDate: new Date('2023-04-01'),
    estimatedArrival: new Date('2023-04-05'),
    trackingEnabled: true,
    currentLocation: {
      latitude: 35.8561,
      longitude: -102.4184,
      lastUpdated: new Date('2023-04-07T09:15:00')
    }
  }
];

const mockInvoices: Invoice[] = [
  {
    id: 'inv-001',
    reference: 'INV-2023-001',
    amount: 2850.75,
    currency: 'USD',
    issueDate: new Date('2023-04-01'),
    dueDate: new Date('2023-05-01'),
    status: 'PENDING',
    shipmentId: 'ship-001'
  },
  {
    id: 'inv-002',
    reference: 'INV-2023-002',
    amount: 1430.25,
    currency: 'USD',
    issueDate: new Date('2023-03-15'),
    dueDate: new Date('2023-04-15'),
    status: 'PAID',
    shipmentId: 'ship-003'
  }
];

const mockDocuments: Document[] = [
  {
    id: 'doc-001',
    type: 'Waybill',
    reference: 'WB-2023-001',
    shipmentId: 'ship-001',
    createDate: new Date('2023-04-05'),
    fileUrl: '/documents/waybill-001.pdf'
  },
  {
    id: 'doc-002',
    type: 'Invoice',
    reference: 'INV-2023-001',
    shipmentId: 'ship-001',
    createDate: new Date('2023-04-01'),
    fileUrl: '/documents/invoice-001.pdf'
  },
  {
    id: 'doc-003',
    type: 'Customs Declaration',
    reference: 'CD-2023-001',
    shipmentId: 'ship-001',
    createDate: new Date('2023-04-04'),
    fileUrl: '/documents/customs-001.pdf'
  },
  {
    id: 'doc-004',
    type: 'Delivery Receipt',
    reference: 'DR-2023-003',
    shipmentId: 'ship-003',
    createDate: new Date('2023-03-30'),
    fileUrl: '/documents/receipt-003.pdf'
  }
];

const mockNotifications: Notification[] = [
  {
    id: 'notif-001',
    type: 'INFO',
    message: 'Shipment SHP-2023-001 has left the origin facility.',
    timestamp: new Date('2023-04-05T08:30:00'),
    read: true,
    shipmentId: 'ship-001'
  },
  {
    id: 'notif-002',
    type: 'WARNING',
    message: 'Shipment SHP-2023-004 is experiencing delays due to weather conditions.',
    timestamp: new Date('2023-04-03T16:45:00'),
    read: false,
    shipmentId: 'ship-004'
  },
  {
    id: 'notif-003',
    type: 'SUCCESS',
    message: 'Shipment SHP-2023-003 has been delivered successfully.',
    timestamp: new Date('2023-03-30T14:22:00'),
    read: false,
    shipmentId: 'ship-003'
  },
  {
    id: 'notif-004',
    type: 'INFO',
    message: 'Invoice INV-2023-001 has been generated and is ready for payment.',
    timestamp: new Date('2023-04-01T09:15:00'),
    read: true
  }
];

const mockStats: ClientStats = {
  totalShipments: 12,
  activeShipments: 3,
  deliveredOnTime: 8,
  totalSpent: 18750.45,
  monthlyShipments: [
    { month: 'Jan', shipments: 1 },
    { month: 'Feb', shipments: 2 },
    { month: 'Mar', shipments: 4 },
    { month: 'Apr', shipments: 5 }
  ]
};

export const ClientPortal: React.FC<ClientPortalProps> = ({ clientId }) => {
  // Removed setter functions that aren't used
  const [shipments] = useState<Shipment[]>(mockShipments);
  const [invoices] = useState<Invoice[]>(mockInvoices);
  const [documents] = useState<Document[]>(mockDocuments);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [stats] = useState<ClientStats>(mockStats);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: false,
    push: true
  });
  
    // Filter shipments based on search query
  const filteredShipments = shipments.filter(
    shipment => 
      shipment.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format date with time for display
  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'SCHEDULED':
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case 'IN_TRANSIT':
        return <Badge className="bg-green-100 text-green-800">In Transit</Badge>;
      case 'DELIVERED':
        return <Badge className="bg-gray-100 text-gray-800">Delivered</Badge>;
      case 'DELAYED':
        return <Badge className="bg-yellow-100 text-yellow-800">Delayed</Badge>;
      case 'PAID':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'OVERDUE':
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Handle marking notifications as read
  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  // Handle viewing a shipment
  const handleViewShipment = (shipment: Shipment) => {
    setSelectedShipment(shipment);
  };

  // Close shipment details modal
  const handleCloseShipmentDetails = () => {
    setSelectedShipment(null);
  };

  // Save notification settings
  const handleSaveNotificationSettings = () => {
    // In a real app, this would save to the backend
    alert('Notification preferences saved successfully');
  };

  return (
    <div className="space-y-6">
      <p>Client Portal management for client ID: {clientId}</p>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Client Portal - Acme Corporation</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell className="h-6 w-6 text-gray-500" />
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            A
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total Shipments</p>
                <p className="text-3xl font-bold">{stats.totalShipments}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Active Shipments</p>
                <p className="text-3xl font-bold">{stats.activeShipments}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Truck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">On-Time Delivery</p>
                <p className="text-3xl font-bold">{Math.round((stats.deliveredOnTime / stats.totalShipments) * 100)}%</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-3xl font-bold">{formatCurrency(stats.totalSpent, 'USD')}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shipment Activity</CardTitle>
          <CardDescription>Your recent and upcoming shipments</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.monthlyShipments}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="shipments" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Tabs defaultValue="shipments">
        <TabsList className="mb-4">
          <TabsTrigger value="shipments">
            <Truck className="h-4 w-4 mr-2" />
            Shipments
          </TabsTrigger>
          <TabsTrigger value="invoices">
            <DollarSign className="h-4 w-4 mr-2" />
            Invoices
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="h-4 w-4 mr-2" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* Shipments Tab */}
        <TabsContent value="shipments">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Your Shipments</CardTitle>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input 
                    type="search" 
                    placeholder="Search shipments..." 
                    className="pl-8 w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Add your table component here */}
              {/* This component depends on your UI library */}
              <div className="overflow-x-auto">
                {/* Replace with your actual Table component */}
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origin</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departure</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ETA</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredShipments.length > 0 ? (
                      filteredShipments.map(shipment => (
                        <tr key={shipment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap font-medium">{shipment.reference}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(shipment.status)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{shipment.origin}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{shipment.destination}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{formatDate(shipment.departureDate)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{formatDate(shipment.estimatedArrival)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleViewShipment(shipment)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                              {shipment.trackingEnabled && shipment.status === 'IN_TRANSIT' && (
                                <Button size="sm">
                                  <Truck className="h-4 w-4 mr-2" />
                                  Track
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-gray-500">
                          No shipments found. Try adjusting your search criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Your Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoices.map(invoice => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{invoice.reference}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(invoice.amount, invoice.currency)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{formatDate(invoice.issueDate)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{formatDate(invoice.dueDate)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(invoice.status)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            {invoice.status === 'PENDING' && (
                              <Button size="sm">
                                <DollarSign className="h-4 w-4 mr-2" />
                                Pay Now
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Your Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {documents.map(doc => (
                      <tr key={doc.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{doc.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{doc.reference}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {shipments.find(s => s.id === doc.shipmentId)?.reference || doc.shipmentId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{formatDate(doc.createDate)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="ghost">
                              <a 
                                href={doc.fileUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center"
                              >
                                <Eye className="h-4 w-4" />
                              </a>
                            </Button>
                            <Button size="sm" variant="ghost">
                              <a 
                                href={doc.fileUrl} 
                                download={doc.reference}
                                className="flex items-center"
                              >
                                <Download className="h-4 w-4" />
                              </a>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className={`p-4 border rounded-md ${!notification.read ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-start space-x-2">
                              {notification.type === 'INFO' && (
                                <div className="mt-0.5 bg-blue-100 p-1.5 rounded-full">
                                  <Bell className="h-4 w-4 text-blue-600" />
                                </div>
                              )}
                              {notification.type === 'WARNING' && (
                                <div className="mt-0.5 bg-yellow-100 p-1.5 rounded-full">
                                  <Bell className="h-4 w-4 text-yellow-600" />
                                </div>
                              )}
                              {notification.type === 'SUCCESS' && (
                                <div className="mt-0.5 bg-green-100 p-1.5 rounded-full">
                                  <Bell className="h-4 w-4 text-green-600" />
                                </div>
                              )}
                              <div>
                                <p className="text-sm">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatDateTime(notification.timestamp)}
                                </p>
                              </div>
                            </div>
                            {!notification.read && (
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleMarkAsRead(notification.id)}
                              >
                                Mark as read
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No notifications to display.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Choose how you would like to receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-5 w-5 text-gray-500" />
                      <span>Email Notifications</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={notificationSettings.email}
                        onChange={() => setNotificationSettings({
                          ...notificationSettings,
                          email: !notificationSettings.email
                        })}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-5 w-5 text-gray-500" />
                      <span>SMS Notifications</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={notificationSettings.sms}
                        onChange={() => setNotificationSettings({
                          ...notificationSettings,
                          sms: !notificationSettings.sms
                        })}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-5 w-5 text-gray-500" />
                      <span>Push Notifications</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={notificationSettings.push}
                        onChange={() => setNotificationSettings({
                          ...notificationSettings,
                          push: !notificationSettings.push
                        })}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-6"
                  onClick={handleSaveNotificationSettings}
                >
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      {/* Shipment Details Modal */}
      {selectedShipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{selectedShipment.reference}</h2>
                  <div className="mt-1">{getStatusBadge(selectedShipment.status)}</div>
                </div>
                <Button variant="ghost" onClick={handleCloseShipmentDetails}>
                  &times;
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Origin</p>
                  <p className="font-medium">{selectedShipment.origin}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Destination</p>
                  <p className="font-medium">{selectedShipment.destination}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Departure Date</p>
                  <p className="font-medium">{formatDate(selectedShipment.departureDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Estimated Arrival</p>
                  <p className="font-medium">{formatDate(selectedShipment.estimatedArrival)}</p>
                </div>
              </div>

              {selectedShipment.currentLocation && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Current Location</h3>
                  <div className="h-[300px] border rounded-md">
                    <MapContainer 
                      center={[selectedShipment.currentLocation.latitude, selectedShipment.currentLocation.longitude]} 
                      zoom={5} 
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <Marker position={[selectedShipment.currentLocation.latitude, selectedShipment.currentLocation.longitude]}>
                        <Popup>
                          Current Location<br />
                          Last updated: {formatDateTime(selectedShipment.currentLocation.lastUpdated)}
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Last updated: {formatDateTime(selectedShipment.currentLocation.lastUpdated)}
                  </p>
                </div>
              )}

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Related Documents</h3>
                <div className="space-y-2">
                  {documents
                    .filter(doc => doc.shipmentId === selectedShipment.id)
                    .map(doc => (
                      <div key={doc.id} className="flex justify-between items-center p-3 border rounded-md">
                        <div>
                          <p className="font-medium">{doc.type}: {doc.reference}</p>
                          <p className="text-sm text-gray-500">Created on {formatDate(doc.createDate)}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </a>
                          </Button>
                          <Button size="sm" variant="outline">
                            <a href={doc.fileUrl} download={doc.reference}>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </a>
                          </Button>
                        </div>
                      </div>
                    ))}
                  {documents.filter(doc => doc.shipmentId === selectedShipment.id).length === 0 && (
                    <p className="text-gray-500">No documents available for this shipment.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientPortal;