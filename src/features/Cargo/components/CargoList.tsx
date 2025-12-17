// src/components/cargo/CargoList.tsx
import React, { useState } from 'react';
import { 
  Cargo, 
  CargoStatus, 
  CargoType, 
  HazardClass 
} from '../types/cargo';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../UI/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../UI/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../UI/components/ui/dropdown-menu';
import { Badge } from '../../UI/components/ui/badge';
import { Button } from '../../UI/components/ui/button';
import { Input } from '../../UI/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger
} from '../../UI/components/ui/select';
import { 
  Edit, 
  FileText, 
  Filter, 
  MoreVertical, 
  Package, 
  Plus, 
  Search, 
  Trash2, 
  TruckIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface CargoListProps {
  cargoItems: Cargo[];
  isLoading?: boolean;
  onViewDetails?: (cargoId: string) => void;
  onEdit?: (cargoId: string) => void;
  onDelete?: (cargoId: string) => void;
  onCreateShipment?: (cargoId: string) => void;
}

// Helper function to get status badge variant
const getStatusBadge = (status: CargoStatus) => {
  switch (status) {
    case CargoStatus.PENDING:
      return <Badge variant="outline">{status}</Badge>;
    case CargoStatus.SCHEDULED:
      return <Badge variant="secondary">{status}</Badge>;
    case CargoStatus.IN_TRANSIT:
      return <Badge variant="default" className="bg-blue-500">{status}</Badge>;
    case CargoStatus.DELIVERED:
      return <Badge variant="default" className="bg-green-500">{status}</Badge>;
    case CargoStatus.RETURNED:
      return <Badge variant="destructive">{status}</Badge>;
    case CargoStatus.DAMAGED:
      return <Badge variant="destructive">{status}</Badge>;
    case CargoStatus.LOST:
      return <Badge variant="destructive">{status}</Badge>;
    case CargoStatus.ON_HOLD:
      return <Badge variant="warning" className="bg-amber-500 text-white">{status}</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

// Helper function to get hazard badge
const getHazardBadge = (hazardClass: HazardClass) => {
  if (hazardClass === HazardClass.NONE) {
    return null;
  }
  
  return (
    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
      {hazardClass}
    </Badge>
  );
};

const CargoList: React.FC<CargoListProps> = ({
  cargoItems,
  isLoading = false,
  onViewDetails,
  onEdit,
  onDelete,
  onCreateShipment
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');

  // Filter cargo items based on search term and filters
  const filteredCargo = cargoItems.filter((cargo) => {
    const matchesSearch = 
      cargo.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cargo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cargo.tags && cargo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesStatus = !selectedStatus || cargo.status === selectedStatus;
    const matchesType = !selectedType || cargo.type === selectedType;
    
    return matchesSearch && matchesStatus && matchesType;
  });
  
  const handleAddCargo = () => {
    navigate('/cargo/new');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Cargo Items</CardTitle>
            <CardDescription>
              Manage all cargo items awaiting shipment
            </CardDescription>
          </div>
          <Button onClick={handleAddCargo}>
            <Plus className="h-4 w-4 mr-2" />
            Add Cargo
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search cargo..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <div className="w-40">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      <span>{selectedStatus || 'Status'}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    {Object.values(CargoStatus).map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-40">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <div className="flex items-center">
                      <Package className="h-4 w-4 mr-2" />
                      <span>{selectedType || 'Type'}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    {Object.values(CargoType).map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : filteredCargo.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Package className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-900">No cargo items found</p>
              <p className="text-sm text-gray-500 mb-4">
                {searchTerm || selectedStatus || selectedType
                  ? 'Try adjusting your filters'
                  : 'Add your first cargo item to get started'}
              </p>
              {!searchTerm && !selectedStatus && !selectedType && (
                <Button onClick={handleAddCargo}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Cargo
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCargo.map((cargo) => (
                    <TableRow key={cargo.id} className="cursor-pointer hover:bg-gray-50" onClick={() => onViewDetails?.(cargo.id)}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          {cargo.reference}
                          {getHazardBadge(cargo.hazardClass)}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {cargo.description}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{cargo.type}</Badge>
                      </TableCell>
                      <TableCell>
                        {cargo.quantity} {cargo.quantityUnit}
                      </TableCell>
                      <TableCell>
                        {cargo.weight.gross} {cargo.weight.unit}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(cargo.status)}
                      </TableCell>
                      <TableCell className="text-gray-500 text-sm">
                        {format(new Date(cargo.createdAt), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              onViewDetails?.(cargo.id);
                            }}>
                              <FileText className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              onEdit?.(cargo.id);
                            }}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              onCreateShipment?.(cargo.id);
                            }}>
                              <TruckIcon className="h-4 w-4 mr-2" />
                              Create Shipment
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm('Are you sure you want to delete this cargo?')) {
                                  onDelete?.(cargo.id);
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {filteredCargo.length} of {cargoItems.length} items
            </div>
            {/* Pagination would go here in a real implementation */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CargoList;