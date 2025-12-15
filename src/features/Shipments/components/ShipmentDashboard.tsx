// src/components/shipment/ShipmentDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@features/UI/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@features/UI/components/ui/table';
import { Badge } from '@features/UI/components/ui/badge';
import { Button } from '@features/UI/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@features/UI/components/ui/select';
import { Input } from '@features/UI/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@features/UI/components/ui/tabs';
import {
  Truck,
  Package,
  Search,
  Plus,
  RefreshCw,
  ArrowUpDown,
  Eye,
  Route,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Loader2,
} from 'lucide-react';
import { Shipment, ShipmentStatus } from '../types/shipment';
import ShipmentService from '../services/ShipmentService';
import ShipmentStatusBadge from './ShipmentStatusBadge';

const ShipmentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<string>('updatedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Dashboard stats
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    completed: 0,
    incidents: 0
  });

  useEffect(() => {
    fetchShipments();
  }, []);

  useEffect(() => {
    // Apply filters, search, and sorting whenever dependencies change
    let result = [...shipments];
    
    // Apply status filter
    if (statusFilter !== 'ALL') {
      result = result.filter(shipment => shipment.status === statusFilter);
    }
    
    // Apply tab filter
    switch (activeTab) {
      case 'active':
        result = result.filter(
          shipment => 
            shipment.status === ShipmentStatus.IN_TRANSIT || 
            shipment.status === ShipmentStatus.DISPATCHED
        );
        break;
      case 'pending':
        result = result.filter(
          shipment => shipment.status === ShipmentStatus.PLANNED
        );
        break;
      case 'completed':
        result = result.filter(
          shipment => shipment.status === ShipmentStatus.COMPLETED
        );
        break;
      case 'issues':
        result = result.filter(
          shipment => 
            shipment.status === ShipmentStatus.INCIDENT || 
            shipment.status === ShipmentStatus.CANCELLED
        );
        break;
      default:
        // 'all' tab - no filtering needed
        break;
    }
    
    // Apply search
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        shipment =>
          shipment.reference.toLowerCase().includes(query) ||
          shipment.description.toLowerCase().includes(query) ||
          shipment.origin.name.toLowerCase().includes(query) ||
          shipment.destination.name.toLowerCase().includes(query) ||
          (shipment.notes && shipment.notes.toLowerCase().includes(query))
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let aValue: string | number | Date;
      let bValue: string | number | Date;
      
      switch (sortBy) {
        case 'reference':
          aValue = a.reference;
          bValue = b.reference;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'priority':
          aValue = a.priority;
          bValue = b.priority;
          break;
        case 'origin':
          aValue = a.origin.name;
          bValue = b.origin.name;
          break;
        case 'destination':
          aValue = a.destination.name;
          bValue = b.destination.name;
          break;
        case 'plannedStart':
          aValue = a.schedule.plannedStart;
          bValue = b.schedule.plannedStart;
          break;
        case 'plannedEnd':
          aValue = a.schedule.plannedEnd;
          bValue = b.schedule.plannedEnd;
          break;
        case 'createdAt':
          aValue = a.createdAt;
          bValue = b.createdAt;
          break;
        case 'updatedAt':
        default:
          aValue = a.updatedAt;
          bValue = b.updatedAt;
          break;
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredShipments(result);
  }, [shipments, activeTab, searchQuery, statusFilter, sortBy, sortDirection]);

  useEffect(() => {
    // Calculate dashboard stats
    if (shipments.length > 0) {
      setStats({
        total: shipments.length,
        active: shipments.filter(s => 
          s.status === ShipmentStatus.IN_TRANSIT || 
          s.status === ShipmentStatus.DISPATCHED
        ).length,
        pending: shipments.filter(s => 
          s.status === ShipmentStatus.PLANNED
        ).length,
        completed: shipments.filter(s => 
          s.status === ShipmentStatus.COMPLETED
        ).length,
        incidents: shipments.filter(s => 
          s.status === ShipmentStatus.INCIDENT || 
          s.status === ShipmentStatus.CANCELLED
        ).length
      });
    }
  }, [shipments]);

  const fetchShipments = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await ShipmentService.getAllShipments();
      setShipments(data);
    } catch (err) {
      console.error('Error fetching shipments:', err);
      setError('Failed to load shipments. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchShipments();
  };

  const handleCreateNew = () => {
    navigate('/shipments/new');
  };

  const handleView = (id: string) => {
    navigate(`/shipments/${id}`);
  };

  const handleTrack = (id: string) => {
    navigate(`/shipments/${id}/track`);
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const getShipmentPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'text-orange-600';
      case 'URGENT':
        return 'text-red-600 font-bold';
      case 'LOW':
        return 'text-gray-600';
      default:
        return 'text-blue-600';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Shipment Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            New Shipment
          </Button>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total Shipments</p>
                <p className="text-3xl font-bold">{stats.total}</p>
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
                <p className="text-3xl font-bold">{stats.active}</p>
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
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-3xl font-bold">{stats.pending}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-3xl font-bold">{stats.completed}</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Issues</p>
                <p className="text-3xl font-bold">{stats.incidents}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shipment List</CardTitle>
          <CardDescription>
            Manage and track all your shipments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-between items-center mb-6">
              <TabsList>
                <TabsTrigger value="all" className="relative">
                  All
                  <Badge variant="secondary" className="ml-2 absolute -top-2 -right-2">
                    {stats.total}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="active" className="relative">
                  Active
                  <Badge variant="secondary" className="ml-2 absolute -top-2 -right-2">
                    {stats.active}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="pending" className="relative">
                  Pending
                  <Badge variant="secondary" className="ml-2 absolute -top-2 -right-2">
                    {stats.pending}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="completed" className="relative">
                  Completed
                  <Badge variant="secondary" className="ml-2 absolute -top-2 -right-2">
                    {stats.completed}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="issues" className="relative">
                  Issues
                  <Badge variant="secondary" className="ml-2 absolute -top-2 -right-2">
                    {stats.incidents}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            
              <div className="flex space-x-2">
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
                
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ShipmentStatus | 'ALL')}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    {Object.values(ShipmentStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="all" className="m-0">
              {renderShipmentTable()}
            </TabsContent>
            <TabsContent value="active" className="m-0">
              {renderShipmentTable()}
            </TabsContent>
            <TabsContent value="pending" className="m-0">
              {renderShipmentTable()}
            </TabsContent>
            <TabsContent value="completed" className="m-0">
              {renderShipmentTable()}
            </TabsContent>
            <TabsContent value="issues" className="m-0">
              {renderShipmentTable()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );

  function renderShipmentTable() {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-500">Loading shipments...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex justify-center items-center py-20">
          <AlertTriangle className="h-8 w-8 text-red-500" />
          <span className="ml-2 text-red-500">{error}</span>
        </div>
      );
    }

    if (filteredShipments.length === 0) {
      return (
        <div className="text-center py-20 border rounded-md border-dashed">
          <Package className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">No shipments found</h3>
          <p className="mt-1 text-gray-500">
            {searchQuery || statusFilter !== 'ALL' 
              ? 'Try changing your search or filter criteria'
              : 'Create your first shipment to get started'}
          </p>
          {!searchQuery && statusFilter === 'ALL' && (
            <Button onClick={handleCreateNew} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Create New Shipment
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => { setSortBy('reference'); toggleSortDirection(); }} className="cursor-pointer">
                <div className="flex items-center">
                  Reference
                  {sortBy === 'reference' && (
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead onClick={() => { setSortBy('status'); toggleSortDirection(); }} className="cursor-pointer">
                <div className="flex items-center">
                  Status
                  {sortBy === 'status' && (
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead onClick={() => { setSortBy('origin'); toggleSortDirection(); }} className="cursor-pointer">
                <div className="flex items-center">
                  Origin
                  {sortBy === 'origin' && (
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead onClick={() => { setSortBy('destination'); toggleSortDirection(); }} className="cursor-pointer">
                <div className="flex items-center">
                  Destination
                  {sortBy === 'destination' && (
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead onClick={() => { setSortBy('plannedStart'); toggleSortDirection(); }} className="cursor-pointer">
                <div className="flex items-center">
                  Departure
                  {sortBy === 'plannedStart' && (
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead onClick={() => { setSortBy('plannedEnd'); toggleSortDirection(); }} className="cursor-pointer">
                <div className="flex items-center">
                  Arrival
                  {sortBy === 'plannedEnd' && (
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredShipments.map((shipment) => (
              <TableRow key={shipment.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{shipment.reference}</span>
                    <span className={`text-xs ${getShipmentPriorityColor(shipment.priority)}`}>
                      {shipment.priority}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <ShipmentStatusBadge status={shipment.status} />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{shipment.origin.name}</span>
                    <span className="text-xs text-gray-500">
                      {shipment.origin.city}, {shipment.origin.country}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{shipment.destination.name}</span>
                    <span className="text-xs text-gray-500">
                      {shipment.destination.city}, {shipment.destination.country}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {formatDate(shipment.schedule.plannedStart)}
                </TableCell>
                <TableCell>
                  {formatDate(shipment.schedule.plannedEnd)}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="outline" onClick={() => handleView(shipment.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {(shipment.status === ShipmentStatus.IN_TRANSIT || 
                      shipment.status === ShipmentStatus.DISPATCHED) && (
                      <Button size="sm" variant="outline" onClick={() => handleTrack(shipment.id)}>
                        <Route className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
};

export default ShipmentDashboard;