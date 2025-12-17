// src/components/maintenance/MaintenanceHistory.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMaintenance } from '../contexts/useMaintenance';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '../../UI/components/ui/card';
import { Button } from '../../UI/components/ui/button';
import { Badge } from '../../UI/components/ui/badge';
import { Input } from '../../UI/components/ui/input';
import { 
  ChevronLeft, 
  Calendar,
  Truck as TruckIcon,
  User,
  Search,
  FileText,
  DollarSign
} from 'lucide-react';
import { 
  MaintenanceHistory as MaintenanceHistoryType,
  MaintenanceType,
  MAINTENANCE_TYPE_LABELS
} from '../types/maintenance';

// Mock data for vehicles (in a real app, these would come from API)
const mockVehicles = [
  { id: 'v1', name: 'Truck 101', type: 'Heavy Duty Truck' },
  { id: 'v2', name: 'Truck 102', type: 'Heavy Duty Truck' },
  { id: 'v3', name: 'Truck 103', type: 'Medium Duty Truck' },
  { id: 'v4', name: 'Truck 104', type: 'Medium Duty Truck' },
  { id: 'v5', name: 'Van 201', type: 'Delivery Van' },
  { id: 'v6', name: 'Van 202', type: 'Delivery Van' },
];

const MaintenanceHistory: React.FC = () => {
  const { vehicleId } = useParams<{ vehicleId?: string }>();
  const navigate = useNavigate();
  const { history, loadHistory, isLoading } = useMaintenance();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<MaintenanceType | 'all'>('all');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: ''
  });
  
  // Load history data
  useEffect(() => {
    loadHistory(vehicleId);
  }, [loadHistory, vehicleId]);
  
  // Get vehicle name if filtered by vehicleId
  const vehicleName = vehicleId
    ? mockVehicles.find(v => v.id === vehicleId)?.name || 'Unknown Vehicle'
    : undefined;
  
  // Filter history based on search term, type, and date range
  const filteredHistory = history.filter((entry: MaintenanceHistoryType) => {
    // Search term filter
    const matchesSearch = 
      searchTerm === '' || 
      entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.technician.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Type filter
    const matchesType = filterType === 'all' || entry.type === filterType;
    
    // Date range filter
    let matchesDateRange = true;
    if (dateRange.start) {
      matchesDateRange = matchesDateRange && new Date(entry.date) >= new Date(dateRange.start);
    }
    if (dateRange.end) {
      matchesDateRange = matchesDateRange && new Date(entry.date) <= new Date(dateRange.end);
    }
    
    return matchesSearch && matchesType && matchesDateRange;
  });
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  // Group history by month/year
  const groupedHistory: Record<string, MaintenanceHistoryType[]> = {};
  filteredHistory.forEach((entry: MaintenanceHistoryType) => {
    const date = new Date(entry.date);
    const month = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    
    if (!groupedHistory[month]) {
      groupedHistory[month] = [];
    }
    
    groupedHistory[month].push(entry);
  });
  
  // Sort months in descending order (newest first)
  const sortedMonths = Object.keys(groupedHistory).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateB.getTime() - dateA.getTime();
  });
  
  // Calculate maintenance costs by month
  const costsByMonth: Record<string, number> = {};
  Object.entries(groupedHistory).forEach(([month, entries]) => {
    costsByMonth[month] = entries.reduce((sum, entry) => sum + entry.cost, 0);
  });
  
  // View schedule details
  const viewScheduleDetails = (scheduleId: string) => {
    navigate(`/maintenance/schedule/${scheduleId}`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="outline" onClick={() => navigate('/maintenance')} className="mr-4">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Maintenance
        </Button>
        <h1 className="text-2xl font-bold">
          {vehicleName ? `Maintenance History: ${vehicleName}` : 'Maintenance History'}
        </h1>
      </div>
      
      <Card>
        <CardHeader className="bg-blue-50 border-b">
          <CardTitle className="text-blue-800">Filters</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search by description or technician"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as MaintenanceType | 'all')}
                className="w-full border rounded p-2"
              >
                <option value="all">All Types</option>
                {Object.entries(MAINTENANCE_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                <Input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                <Input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                />
              </div>
            </div>
          </div>
          
          {vehicleId && (
            <div className="mt-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/maintenance/history')}
              >
                View All Vehicles
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No maintenance history found matching your criteria.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedMonths.map(month => (
            <Card key={month}>
              <CardHeader className="bg-gray-50 border-b">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-semibold">
                    <Calendar className="h-5 w-5 mr-2 inline-block" />
                    {month}
                  </CardTitle>
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-gray-600" />
                    <span className="font-medium">${costsByMonth[month].toFixed(2)}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="divide-y">
                {groupedHistory[month].map(entry => (
                  <div key={entry.id} className="py-4">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-100 text-blue-800 font-normal">
                            {MAINTENANCE_TYPE_LABELS[entry.type]}
                          </Badge>
                          <p className="text-sm text-gray-500">
                            {formatDate(entry.date)}
                          </p>
                        </div>
                        
                        <h3 className="font-medium mt-1">{entry.description}</h3>
                        
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div className="flex items-center text-sm">
                            <TruckIcon className="h-4 w-4 mr-1 text-gray-500" />
                            <span>Mileage: {entry.mileage.toLocaleString()} miles</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <User className="h-4 w-4 mr-1 text-gray-500" />
                            <span>Technician: {entry.technician}</span>
                          </div>
                        </div>
                        
                        {entry.notes && (
                          <p className="text-sm mt-2">{entry.notes}</p>
                        )}
                        
                        {entry.partsReplaced.length > 0 && (
                          <div className="mt-3">
                            <h4 className="text-sm font-medium mb-1">Parts Replaced:</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {entry.partsReplaced.map((part, index) => (
                                <div key={index} className="text-xs bg-gray-50 p-2 rounded flex justify-between">
                                  <span>{part.partName} (x{part.quantity})</span>
                                  <span className="text-gray-600">${part.cost.toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-2 items-end">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Total Cost</p>
                          <p className="font-medium">${entry.cost.toFixed(2)}</p>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => viewScheduleDetails(entry.scheduleId)}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MaintenanceHistory