// src/pages/waybills/WaybillList.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Plus, Filter, Download, Truck, 
  Calendar, Users, MapPin, Search, MoreHorizontal
} from 'lucide-react';
import { Button } from '../../UI/components/ui/button';
import { Input } from '../../UI/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../UI/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../UI/components/ui/card';

// Mock data - replace with API call
const mockWaybills = [
  {
    id: 'WB-2025-000001',
    client: 'ACME Logistics',
    origin: 'New York, NY',
    destination: 'Los Angeles, CA',
    pickupDate: '2025-02-15',
    deliveryDate: '2025-02-20',
    status: 'in_transit',
    truckId: 'TRK-001',
    driver: 'John Smith',
    cargo: 'Electronics',
    value: 25000,
  },
  {
    id: 'WB-2025-000002',
    client: 'Global Shipping Inc',
    origin: 'Chicago, IL',
    destination: 'Miami, FL',
    pickupDate: '2025-02-16',
    deliveryDate: '2025-02-22',
    status: 'pending',
    truckId: 'TRK-002',
    driver: 'Sarah Jones',
    cargo: 'Furniture',
    value: 18500,
  },
  {
    id: 'WB-2025-000003',
    client: 'FastFreight LLC',
    origin: 'Seattle, WA',
    destination: 'Portland, OR',
    pickupDate: '2025-02-10',
    deliveryDate: '2025-02-12',
    status: 'delivered',
    truckId: 'TRK-003',
    driver: 'Robert Johnson',
    cargo: 'Food Products',
    value: 12800,
  },
  {
    id: 'WB-2025-000004',
    client: 'CargoMasters',
    origin: 'Houston, TX',
    destination: 'Phoenix, AZ',
    pickupDate: '2025-02-18',
    deliveryDate: '2025-02-23',
    status: 'pending',
    truckId: 'TRK-004',
    driver: 'Michael Brown',
    cargo: 'Machinery',
    value: 43200,
  },
  {
    id: 'WB-2025-000005',
    client: 'Continental Transport',
    origin: 'Denver, CO',
    destination: 'Dallas, TX',
    pickupDate: '2025-02-14',
    deliveryDate: '2025-02-17',
    status: 'in_transit',
    truckId: 'TRK-005',
    driver: 'Lisa Williams',
    cargo: 'Textiles',
    value: 15600,
  },
];

const WaybillList: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [waybills, setWaybills] = useState(mockWaybills);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // In a real app, this would be an API call
    setIsLoading(true);
    setTimeout(() => {
      let filteredWaybills = [...mockWaybills];
      
      // Apply status filter
      if (statusFilter !== 'all') {
        filteredWaybills = filteredWaybills.filter(
          waybill => waybill.status === statusFilter
        );
      }
      
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredWaybills = filteredWaybills.filter(
          waybill => 
            waybill.id.toLowerCase().includes(query) ||
            waybill.client.toLowerCase().includes(query) ||
            waybill.origin.toLowerCase().includes(query) ||
            waybill.destination.toLowerCase().includes(query) ||
            waybill.driver.toLowerCase().includes(query) ||
            waybill.cargo.toLowerCase().includes(query)
        );
      }
      
      setWaybills(filteredWaybills);
      setIsLoading(false);
    }, 500); // Simulate API delay
  }, [searchQuery, statusFilter]);

  const getStatusBadgeClass = (status: string) => {
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

  const getStatusLabel = (status: string) => {
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

  const handleCreateWaybill = () => {
    navigate('/waybills/create');
  };

  const handleViewWaybill = (id: string) => {
    navigate(`/waybills/${id}`);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Waybills</h1>
        </div>
        <Button 
          onClick={handleCreateWaybill}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Waybill
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle>All Waybills</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search waybills..."
                  className="pl-9 w-full sm:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : waybills.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No waybills found</h3>
              <p className="text-gray-500 max-w-md mt-2">
                {searchQuery || statusFilter !== 'all'
                  ? "No waybills match your search criteria. Try adjusting your filters."
                  : "You haven't created any waybills yet. Click 'Create Waybill' to get started."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 font-medium">Waybill #</th>
                    <th className="py-3 px-4 font-medium">Client</th>
                    <th className="py-3 px-4 font-medium hidden md:table-cell">Route</th>
                    <th className="py-3 px-4 font-medium hidden lg:table-cell">Pickup Date</th>
                    <th className="py-3 px-4 font-medium hidden lg:table-cell">Truck/Driver</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {waybills.map((waybill) => (
                    <tr 
                      key={waybill.id} 
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleViewWaybill(waybill.id)}
                    >
                      <td className="py-3 px-4 font-medium text-blue-600">{waybill.id}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-gray-400 mr-2" />
                          <span>{waybill.client}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="truncate max-w-xs">
                            {waybill.origin} → {waybill.destination}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <span>{new Date(waybill.pickupDate).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <div className="flex items-center">
                          <Truck className="h-4 w-4 text-gray-400 mr-2" />
                          <span>{waybill.truckId} / {waybill.driver}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(waybill.status)}`}>
                          {getStatusLabel(waybill.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Show more actions menu
                          }}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WaybillList;