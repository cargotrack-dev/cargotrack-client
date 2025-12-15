// src/pages/maintenance/MaintenanceScheduler.tsx
import React, { useState, useEffect } from 'react';
import {
  Wrench, // Replace Tool with Wrench
  Truck,
  Plus,
  Search,
  ChevronRight,
  Check,
  ArrowRight,
  X,
  Edit,
  Printer // Add Printer icon
} from 'lucide-react';
import { Button } from '@features/UI/components/ui/button';
import { Input } from '@features/UI/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@features/UI/components/ui/select';
import { Card, CardContent, CardHeader } from '@features/UI/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@features/UI/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@features/UI/components/ui/dialog';
import { Textarea } from '@features/UI/components/ui/textarea';
import { Label } from '@features/UI/components/ui/label';

// Types
interface MaintenanceRecord {
  id: string;
  truckId: string;
  truckName: string;
  maintenanceType: 'routine' | 'repair' | 'inspection';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  scheduledDate: string;
  completedDate?: string;
  assignedTo?: string;
  cost?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface Truck {
  id: string;
  name: string;
  licensePlate: string;
  model: string;
  status: 'available' | 'in_transit' | 'maintenance';
  lastMaintenanceDate?: string;
  mileage: number;
}

// Mock maintenance records
const mockMaintenanceRecords: MaintenanceRecord[] = [
  {
    id: 'm1',
    truckId: 't1',
    truckName: 'Truck-001',
    maintenanceType: 'routine',
    status: 'scheduled',
    priority: 'medium',
    description: 'Regular oil change and filter replacement',
    scheduledDate: '2025-03-05T10:00:00Z',
    assignedTo: 'John Miller',
    createdAt: '2025-02-15T09:23:21Z',
    updatedAt: '2025-02-15T09:23:21Z'
  },
  {
    id: 'm2',
    truckId: 't2',
    truckName: 'Truck-002',
    maintenanceType: 'repair',
    status: 'in_progress',
    priority: 'high',
    description: 'Brake system repair - replace brake pads and check hydraulic system',
    scheduledDate: '2025-02-20T14:30:00Z',
    assignedTo: 'Robert Johnson',
    cost: 850,
    notes: 'Parts ordered, waiting for delivery',
    createdAt: '2025-02-18T11:45:33Z',
    updatedAt: '2025-02-19T08:15:42Z'
  },
  {
    id: 'm3',
    truckId: 't3',
    truckName: 'Truck-003',
    maintenanceType: 'inspection',
    status: 'completed',
    priority: 'low',
    description: 'Annual DOT inspection',
    scheduledDate: '2025-02-10T09:00:00Z',
    completedDate: '2025-02-10T11:45:00Z',
    assignedTo: 'Sarah Williams',
    cost: 350,
    notes: 'Passed inspection with no issues',
    createdAt: '2025-01-25T16:30:12Z',
    updatedAt: '2025-02-10T12:00:54Z'
  },
  {
    id: 'm4',
    truckId: 't4',
    truckName: 'Truck-004',
    maintenanceType: 'repair',
    status: 'scheduled',
    priority: 'critical',
    description: 'Engine overheating issue - coolant leak suspected',
    scheduledDate: '2025-02-19T08:00:00Z',
    assignedTo: 'Mike Stevens',
    notes: 'Truck reported temperature gauge in red zone',
    createdAt: '2025-02-18T17:22:05Z',
    updatedAt: '2025-02-18T17:22:05Z'
  },
  {
    id: 'm5',
    truckId: 't5',
    truckName: 'Truck-005',
    maintenanceType: 'routine',
    status: 'cancelled',
    priority: 'medium',
    description: 'Tire rotation and pressure check',
    scheduledDate: '2025-02-22T13:00:00Z',
    notes: 'Cancelled due to truck being on long-haul delivery',
    createdAt: '2025-02-15T10:12:33Z',
    updatedAt: '2025-02-20T09:05:18Z'
  }
];

// Mock trucks
const mockTrucks: Truck[] = [
  {
    id: 't1',
    name: 'Truck-001',
    licensePlate: 'XYZ-1234',
    model: 'Freightliner Cascadia',
    status: 'available',
    lastMaintenanceDate: '2025-01-05',
    mileage: 45250
  },
  {
    id: 't2',
    name: 'Truck-002',
    licensePlate: 'ABC-5678',
    model: 'Peterbilt 579',
    status: 'maintenance',
    lastMaintenanceDate: '2025-02-18',
    mileage: 78500
  },
  {
    id: 't3',
    name: 'Truck-003',
    licensePlate: 'DEF-9012',
    model: 'Kenworth T680',
    status: 'available',
    lastMaintenanceDate: '2025-02-10',
    mileage: 62300
  },
  {
    id: 't4',
    name: 'Truck-004',
    licensePlate: 'GHI-3456',
    model: 'Volvo VNL',
    status: 'available',
    lastMaintenanceDate: '2025-01-25',
    mileage: 89700
  },
  {
    id: 't5',
    name: 'Truck-005',
    licensePlate: 'JKL-7890',
    model: 'International LT',
    status: 'in_transit',
    lastMaintenanceDate: '2025-02-05',
    mileage: 56800
  }
];

const MaintenanceScheduler: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setpriorityFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [availableTrucks, setAvailableTrucks] = useState<Truck[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null);

  // New maintenance record form state
  const [newRecord, setNewRecord] = useState<Partial<MaintenanceRecord>>({
    maintenanceType: 'routine',
    status: 'scheduled',
    priority: 'medium',
    description: '',
    scheduledDate: new Date().toISOString().substring(0, 16),
  });

  // Fetch maintenance records
  useEffect(() => {
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      let filteredRecords = [...mockMaintenanceRecords];

      // Filter by status
      if (statusFilter !== 'all') {
        filteredRecords = filteredRecords.filter(record => record.status === statusFilter);
      }

      // Filter by maintenance type
      if (typeFilter !== 'all') {
        filteredRecords = filteredRecords.filter(record => record.maintenanceType === typeFilter);
      }

      // Filter by priority
      if (priorityFilter !== 'all') {
        filteredRecords = filteredRecords.filter(record => record.priority === priorityFilter);
      }

      // Filter by active tab
      if (activeTab === 'upcoming') {
        filteredRecords = filteredRecords.filter(record =>
          record.status === 'scheduled' || record.status === 'in_progress'
        );
      } else if (activeTab === 'completed') {
        filteredRecords = filteredRecords.filter(record =>
          record.status === 'completed'
        );
      } else if (activeTab === 'cancelled') {
        filteredRecords = filteredRecords.filter(record =>
          record.status === 'cancelled'
        );
      }

      // Apply search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredRecords = filteredRecords.filter(record =>
          record.truckName.toLowerCase().includes(query) ||
          record.description.toLowerCase().includes(query) ||
          (record.assignedTo && record.assignedTo.toLowerCase().includes(query))
        );
      }

      setMaintenanceRecords(filteredRecords);
      setAvailableTrucks(mockTrucks);
      setIsLoading(false);
    }, 500);
  }, [activeTab, searchQuery, statusFilter, typeFilter, priorityFilter]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get days until scheduled date
  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const scheduledDate = new Date(dateString);
    const diffTime = scheduledDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get priority badge class
  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Update Dialog onOpenChange type
  // const handleDialogOpenChange = (open: boolean) => {
  //   setIsCreateDialogOpen(open);
  // };

  // Handle input change for new record
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewRecord({
      ...newRecord,
      [name]: value
    });
  };

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setNewRecord({
      ...newRecord,
      [name]: value
    });
  };

  // Handle create maintenance record
  const handleCreateRecord = () => {
    // In a real app, this would be an API call
    console.log('Creating maintenance record:', newRecord);

    // Reset form and close dialog
    setNewRecord({
      maintenanceType: 'routine',
      status: 'scheduled',
      priority: 'medium',
      description: '',
      scheduledDate: new Date().toISOString().substring(0, 16),
    });
    setIsCreateDialogOpen(false);
  };

  // Handle view record details
  const handleViewRecord = (record: MaintenanceRecord) => {
    setSelectedRecord(record);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <Wrench className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Maintenance Scheduler</h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search maintenance..."
              className="pl-9 w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Schedule Maintenance
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Schedule New Maintenance</DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="truckId">Select Truck</Label>
                    <Select
                      value={newRecord.truckId}
                      onValueChange={(value) => handleSelectChange('truckId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a truck" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTrucks.map(truck => (
                          <SelectItem key={truck.id} value={truck.id}>
                            {truck.name} ({truck.licensePlate})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maintenanceType">Maintenance Type</Label>
                    <Select
                      value={newRecord.maintenanceType}
                      onValueChange={(value) => handleSelectChange('maintenanceType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="routine">Routine</SelectItem>
                        <SelectItem value="repair">Repair</SelectItem>
                        <SelectItem value="inspection">Inspection</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={newRecord.priority}
                      onValueChange={(value) => handleSelectChange('priority', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assignedTo">Assigned To</Label>
                    <Input
                      id="assignedTo"
                      name="assignedTo"
                      value={newRecord.assignedTo || ''}
                      onChange={handleInputChange}
                      placeholder="Enter technician name"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="scheduledDate">Scheduled Date & Time</Label>
                    <Input
                      id="scheduledDate"
                      name="scheduledDate"
                      type="datetime-local"
                      value={newRecord.scheduledDate || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estimatedCost">Estimated Cost ($)</Label>
                    <Input
                      id="estimatedCost"
                      name="estimatedCost"
                      type="number"
                      min="0"
                      step="0.01"
                      value={newRecord.cost || ''}
                      onChange={handleInputChange}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={newRecord.description || ''}
                      onChange={handleInputChange}
                      placeholder="Describe the maintenance task"
                      rows={4}
                      required
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateRecord}>
                  Schedule Maintenance
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList>
                <TabsTrigger value="upcoming">Upcoming & In Progress</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                <TabsTrigger value="all">All Records</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Filter type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="routine">Routine</SelectItem>
                  <SelectItem value="repair">Repair</SelectItem>
                  <SelectItem value="inspection">Inspection</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setpriorityFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Filter priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : maintenanceRecords.length === 0 ? (
            <div className="text-center py-8">
              <Wrench className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No maintenance records found</h3>
              <p className="text-gray-500 max-w-md mx-auto mt-2">
                {searchQuery || statusFilter !== 'all' || typeFilter !== 'all' || priorityFilter !== 'all'
                  ? "No records match your search criteria. Try adjusting your filters."
                  : "There are no maintenance records in this category. Click 'Schedule Maintenance' to create one."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 font-medium">Truck</th>
                    <th className="py-3 px-4 font-medium">Description</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium">Priority</th>
                    <th className="py-3 px-4 font-medium">Scheduled Date</th>
                    <th className="py-3 px-4 font-medium">Assigned To</th>
                    <th className="py-3 px-4 font-medium w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {maintenanceRecords.map((record) => {
                    const daysUntil = getDaysUntil(record.scheduledDate);
                    const isOverdue = record.status === 'scheduled' && daysUntil < 0;

                    return (
                      <tr
                        key={record.id}
                        className={`border-b hover:bg-gray-50 cursor-pointer ${isOverdue ? 'bg-red-50' : ''
                          }`}
                        onClick={() => handleViewRecord(record)}
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <Truck className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="font-medium">{record.truckName}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <span className="line-clamp-1">{record.description}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(record.status)}`}>
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadgeClass(record.priority)}`}>
                            {record.priority.charAt(0).toUpperCase() + record.priority.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col">
                            <span>{formatDate(record.scheduledDate)}</span>
                            {record.status === 'scheduled' && (
                              <span className={`text-xs ${daysUntil < 0 ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                                {daysUntil === 0 ? 'Today' :
                                  daysUntil > 0 ? `In ${daysUntil} day${daysUntil !== 1 ? 's' : ''}` :
                                    `Overdue by ${Math.abs(daysUntil)} day${Math.abs(daysUntil) !== 1 ? 's' : ''}`}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {record.assignedTo || '-'}
                        </td>
                        <td className="py-4 px-4">
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Maintenance Record Detail Dialog */}
      {selectedRecord && (
        <Dialog open={!!selectedRecord} onOpenChange={(open) => !open && setSelectedRecord(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Maintenance Record Details</DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="flex flex-col md:flex-row justify-between border-b pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-blue-600" />
                    <h2 className="text-xl font-semibold">{selectedRecord.truckName}</h2>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Reference ID: {selectedRecord.id}
                  </p>
                </div>

                <div className="mt-4 md:mt-0 flex flex-col items-end">
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(selectedRecord.status)}`}>
                      {selectedRecord.status.charAt(0).toUpperCase() + selectedRecord.status.slice(1)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityBadgeClass(selectedRecord.priority)}`}>
                      {selectedRecord.priority.charAt(0).toUpperCase() + selectedRecord.priority.slice(1)} Priority
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Last Updated: {new Date(selectedRecord.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">MAINTENANCE TYPE</h3>
                    <p className="font-medium capitalize">{selectedRecord.maintenanceType}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">DESCRIPTION</h3>
                    <p>{selectedRecord.description}</p>
                  </div>

                  {selectedRecord.notes && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">NOTES</h3>
                      <p>{selectedRecord.notes}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">SCHEDULED DATE</h3>
                    <p>{formatDate(selectedRecord.scheduledDate)}</p>
                  </div>

                  {selectedRecord.completedDate && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">COMPLETED DATE</h3>
                      <p>{formatDate(selectedRecord.completedDate)}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">ASSIGNED TO</h3>
                    <p>{selectedRecord.assignedTo || 'Not assigned'}</p>
                  </div>

                  {selectedRecord.cost !== undefined && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">COST</h3>
                      <p>${selectedRecord.cost.toFixed(2)}</p>
                    </div>
                  )}
                </div>
              </div>

              {selectedRecord.status !== 'completed' && selectedRecord.status !== 'cancelled' && (
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3">Update Status</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedRecord.status === 'scheduled' && (
                      <Button variant="outline">
                        <ArrowRight className="mr-2 h-4 w-4" />
                        Mark as In Progress
                      </Button>
                    )}
                    <Button variant="outline" className="text-green-600">
                      <Check className="mr-2 h-4 w-4" />
                      Mark as Completed
                    </Button>
                    <Button variant="outline" className="text-gray-600">
                      <X className="mr-2 h-4 w-4" />
                      Cancel Maintenance
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedRecord(null)}>
                Close
              </Button>
              <Button variant="outline">
                <Printer className="mr-2 h-4 w-4" />
                Print Details
              </Button>
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                Edit Record
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MaintenanceScheduler;