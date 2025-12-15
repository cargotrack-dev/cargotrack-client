// src/components/cargo/CargoDashboard.tsx
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
  Package,
  Search,
  Plus,
  RefreshCw,
  ArrowUpDown,
  Eye,
  Link2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Loader2,
  PanelTop,
  Truck,
  HardDrive,
  Box,
  ShoppingBag,
} from 'lucide-react';
import { Cargo, CargoStatus, CargoType } from '../types/cargo';
import { CargoService } from '../services/CargoService';

// Create a component for the cargo status badge
const CargoStatusBadge: React.FC<{ status: CargoStatus }> = ({ status }) => {
  const getStatusConfig = (status: CargoStatus) => {
    switch (status) {
      case CargoStatus.PENDING:
        return {
          label: 'Pending',
          variant: 'outline' as const,
          className: 'text-yellow-600 border-yellow-300 bg-yellow-50'
        };
      case CargoStatus.SCHEDULED:
        return {
          label: 'Scheduled',
          variant: 'outline' as const,
          className: 'text-blue-600 border-blue-300 bg-blue-50'
        };
      case CargoStatus.ON_HOLD:
        return {
          label: 'On Hold',
          variant: 'outline' as const,
          className: 'text-orange-600 border-orange-300 bg-orange-50'
        };
      case CargoStatus.IN_TRANSIT:
        return {
          label: 'In Transit',
          variant: 'outline' as const,
          className: 'text-green-600 border-green-300 bg-green-50'
        };
      case CargoStatus.DELIVERED:
        return {
          label: 'Delivered',
          variant: 'outline' as const,
          className: 'text-gray-600 border-gray-300 bg-gray-50'
        };
      case CargoStatus.RETURNED:
        return {
          label: 'Returned',
          variant: 'outline' as const,
          className: 'text-red-600 border-red-300 bg-red-50'
        };
      case CargoStatus.LOST:
        return {
          label: 'Lost',
          variant: 'outline' as const,
          className: 'text-red-600 border-red-300 bg-red-50'
        };
      default:
        return {
          label: status,
          variant: 'outline' as const,
          className: 'text-gray-600 border-gray-300 bg-gray-50'
        };
    }
  };

  const config = getStatusConfig(status);
  
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};

// Create a component for the cargo type icon
const CargoTypeIcon: React.FC<{ type: CargoType }> = ({ type }) => {
  const getTypeConfig = (type: CargoType) => {
    switch (type) {
      case CargoType.ELECTRONICS:
        return {
          icon: <HardDrive className="h-4 w-4" />,
          className: 'text-blue-500'
        };
      case CargoType.FURNITURE:
        return {
          icon: <PanelTop className="h-4 w-4" />,
          className: 'text-amber-500'
        };
      case CargoType.AUTOMOTIVE:
        return {
          icon: <Truck className="h-4 w-4" />,
          className: 'text-gray-500'
        };
      case CargoType.CLOTHING:
        return {
          icon: <ShoppingBag className="h-4 w-4" />,
          className: 'text-purple-500'
        };
      case CargoType.FOOD:
        return {
          icon: <Package className="h-4 w-4" />,
          className: 'text-green-500'
        };
      case CargoType.MEDICAL:
        return {
          icon: <Package className="h-4 w-4" />,
          className: 'text-red-500'
        };
      case CargoType.HAZARDOUS:
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          className: 'text-orange-500'
        };
      case CargoType.FRAGILE:
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          className: 'text-red-500'
        };
      case CargoType.PERISHABLE:
        return {
          icon: <Clock className="h-4 w-4" />,
          className: 'text-yellow-500'
        };
      case CargoType.BULK:
        return {
          icon: <Box className="h-4 w-4" />,
          className: 'text-gray-500'
        };
      default:
        return {
          icon: <Package className="h-4 w-4" />,
          className: 'text-gray-500'
        };
    }
  };

  const config = getTypeConfig(type);
  
  return (
    <div className={config.className}>
      {config.icon}
    </div>
  );
};

const CargoDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [cargoItems, setCargoItems] = useState<Cargo[]>([]);
  const [filteredCargoItems, setFilteredCargoItems] = useState<Cargo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<CargoStatus | 'ALL'>('ALL');
  const [typeFilter, setTypeFilter] = useState<CargoType | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<string>('updatedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Dashboard stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inTransit: 0,
    delivered: 0,
    issues: 0
  });

  useEffect(() => {
    fetchCargoItems();
  }, []);

  useEffect(() => {
    // Apply filters, search, and sorting whenever dependencies change
    let result = [...cargoItems];
    
    // Apply status filter
    if (statusFilter !== 'ALL') {
      result = result.filter(cargo => cargo.status === statusFilter);
    }
    
    // Apply type filter
    if (typeFilter !== 'ALL') {
      result = result.filter(cargo => cargo.type === typeFilter);
    }
    
    // Apply tab filter
    switch (activeTab) {
      case 'available':
        result = result.filter(
          cargo => 
            cargo.status === CargoStatus.PENDING || 
            cargo.status === CargoStatus.ON_HOLD
        );
        break;
      case 'inTransit':
        result = result.filter(
          cargo => cargo.status === CargoStatus.IN_TRANSIT
        );
        break;
      case 'delivered':
        result = result.filter(
          cargo => cargo.status === CargoStatus.DELIVERED
        );
        break;
      case 'issues':
        result = result.filter(
          cargo => 
            cargo.status === CargoStatus.RETURNED || 
            cargo.status === CargoStatus.LOST
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
        cargo =>
          cargo.reference.toLowerCase().includes(query) ||
          cargo.description.toLowerCase().includes(query) ||
          cargo.type.toLowerCase().includes(query) ||
          (cargo.notes && cargo.notes.toLowerCase().includes(query))
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
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        case 'weight':
          aValue = a.weight.gross;
          bValue = b.weight.gross;
          break;
        case 'value':
          aValue = a.value.amount;
          bValue = b.value.amount;
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
    
    setFilteredCargoItems(result);
  }, [cargoItems, activeTab, searchQuery, statusFilter, typeFilter, sortBy, sortDirection]);

  useEffect(() => {
    // Calculate dashboard stats
    if (cargoItems.length > 0) {
      setStats({
        total: cargoItems.length,
        pending: cargoItems.filter(c => 
          c.status === CargoStatus.PENDING ||
          c.status === CargoStatus.SCHEDULED || 
          c.status === CargoStatus.ON_HOLD
        ).length,
        inTransit: cargoItems.filter(c => 
          c.status === CargoStatus.IN_TRANSIT
        ).length,
        delivered: cargoItems.filter(c => 
          c.status === CargoStatus.DELIVERED
        ).length,
        issues: cargoItems.filter(c => 
          c.status === CargoStatus.RETURNED || 
          c.status === CargoStatus.LOST
        ).length
      });
    }
  }, [cargoItems]);

  const fetchCargoItems = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await CargoService.getAllCargo();
      setCargoItems(data);
    } catch (err) {
      console.error('Error fetching cargo items:', err);
      setError('Failed to load cargo items. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchCargoItems();
  };

  const handleCreateNew = () => {
    navigate('/cargo/new');
  };

  const handleView = (id: string) => {
    navigate(`/cargo/${id}`);
  };

  const handleCreateShipment = (cargoId: string) => {
    navigate(`/shipments/new?cargoId=${cargoId}`);
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Cargo Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            New Cargo
          </Button>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total Cargo</p>
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
                <p className="text-sm text-gray-500">Pending/Scheduled</p>
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
                <p className="text-sm text-gray-500">In Transit</p>
                <p className="text-3xl font-bold">{stats.inTransit}</p>
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
                <p className="text-sm text-gray-500">Delivered</p>
                <p className="text-3xl font-bold">{stats.delivered}</p>
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
                <p className="text-3xl font-bold">{stats.issues}</p>
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
          <CardTitle>Cargo List</CardTitle>
          <CardDescription>
            Manage all your cargo items and shipments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
              <TabsList>
                <TabsTrigger value="all" className="relative">
                  All
                  <Badge variant="secondary" className="ml-2 absolute -top-2 -right-2">
                    {stats.total}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="available" className="relative">
                  Available
                  <Badge variant="secondary" className="ml-2 absolute -top-2 -right-2">
                    {stats.pending}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="inTransit" className="relative">
                  In Transit
                  <Badge variant="secondary" className="ml-2 absolute -top-2 -right-2">
                    {stats.inTransit}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="delivered" className="relative">
                  Delivered
                  <Badge variant="secondary" className="ml-2 absolute -top-2 -right-2">
                    {stats.delivered}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="issues" className="relative">
                  Issues
                  <Badge variant="secondary" className="ml-2 absolute -top-2 -right-2">
                    {stats.issues}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            
              <div className="flex flex-col md:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search cargo..."
                    className="pl-8 w-full md:w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as CargoStatus | 'ALL')}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    {Object.values(CargoStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as CargoType | 'ALL')}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Types</SelectItem>
                    {Object.values(CargoType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="all" className="m-0">
              {renderCargoTable()}
            </TabsContent>
            <TabsContent value="available" className="m-0">
              {renderCargoTable()}
            </TabsContent>
            <TabsContent value="inTransit" className="m-0">
              {renderCargoTable()}
            </TabsContent>
            <TabsContent value="delivered" className="m-0">
              {renderCargoTable()}
            </TabsContent>
            <TabsContent value="issues" className="m-0">
              {renderCargoTable()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );

  function renderCargoTable() {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-500">Loading cargo items...</span>
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

    if (filteredCargoItems.length === 0) {
      return (
        <div className="text-center py-20 border rounded-md border-dashed">
          <Package className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">No cargo items found</h3>
          <p className="mt-1 text-gray-500">
            {searchQuery || statusFilter !== 'ALL' || typeFilter !== 'ALL'
              ? 'Try changing your search or filter criteria'
              : 'Create your first cargo item to get started'}
          </p>
          {!searchQuery && statusFilter === 'ALL' && typeFilter === 'ALL' && (
            <Button onClick={handleCreateNew} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Create New Cargo
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
              <TableHead onClick={() => { setSortBy('type'); toggleSortDirection(); }} className="cursor-pointer">
                <div className="flex items-center">
                  Type
                  {sortBy === 'type' && (
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
              <TableHead onClick={() => { setSortBy('weight'); toggleSortDirection(); }} className="cursor-pointer">
                <div className="flex items-center">
                  Weight
                  {sortBy === 'weight' && (
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead onClick={() => { setSortBy('value'); toggleSortDirection(); }} className="cursor-pointer">
                <div className="flex items-center">
                  Value
                  {sortBy === 'value' && (
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead>Current Shipment</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCargoItems.map((cargo) => (
              <TableRow key={cargo.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    <CargoTypeIcon type={cargo.type} />
                    <div>
                      <div>{cargo.reference}</div>
                      <div className="text-xs text-gray-500 truncate max-w-[200px]">{cargo.description}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{cargo.type}</Badge>
                </TableCell>
                <TableCell>
                  <CargoStatusBadge status={cargo.status} />
                </TableCell>
                <TableCell>
                  {cargo.weight.gross} {cargo.weight.unit}
                </TableCell>
                <TableCell>
                  {formatCurrency(cargo.value.amount, cargo.value.currency)}
                </TableCell>
                <TableCell>
                  {cargo.shipmentId ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/shipments/${cargo.shipmentId}`);
                      }}
                    >
                      View Shipment
                    </Button>
                  ) : (
                    <span className="text-gray-500 text-sm">None</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="outline" onClick={() => handleView(cargo.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {(cargo.status === CargoStatus.PENDING || cargo.status === CargoStatus.ON_HOLD) && (
                      <Button size="sm" variant="outline" onClick={() => handleCreateShipment(cargo.id)}>
                        <Link2 className="h-4 w-4" />
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

export default CargoDashboard;