// src/pages/maintenance/MaintenanceList.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Remove react-toastify import
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../UI/components/ui/dialog';
import { Button } from '../../UI/components/ui/button';
// Remove Spinner import
import { Badge } from '../../UI/components/ui/badge';
// Import existing utils or create simple formatters
import { format } from 'date-fns';

// You'll likely have a maintenance type defined in your types
interface Maintenance {
  id: string;
  truckId: string;
  plateNumber: string;
  truckModel: string;
  type: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  date: string;
  cost: number;
  description: string;
  technician: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

// Simple API response type - you can expand this later
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Create a simple API client
const apiClient = {
  get: async <T,>(url: string, config?: { params?: Record<string, unknown> }): Promise<{ data: T }> => {
    // This is a placeholder. In a real app, you would use axios, fetch, etc.
    console.log(`GET ${url}`, config);
    
    // Mock data - replace with actual API call in production
    const mockData = {
      success: true,
      data: {
        records: [
          { 
            id: '1', 
            truckId: 'TR-001',
            plateNumber: 'ABC-1234',
            truckModel: 'Volvo FH16',
            type: 'Routine Service',
            status: 'COMPLETED' as const,
            date: '2023-03-15',
            cost: 1200,
            description: 'Regular oil change, filter replacement, and brake inspection',
            technician: 'John Smith',
            location: 'Main Garage - Chicago',
            createdAt: '2023-03-10T10:00:00Z',
            updatedAt: '2023-03-15T16:30:00Z'
          },
          { 
            id: '2', 
            truckId: 'TR-002',
            plateNumber: 'XYZ-5678',
            truckModel: 'Mercedes Actros',
            type: 'Repair',
            status: 'IN_PROGRESS' as const,
            date: '2023-04-02',
            cost: 3500,
            description: 'Transmission repair after failure noticed during inspection',
            technician: 'Mike Johnson',
            location: 'East Service Center - New York',
            createdAt: '2023-04-01T08:15:00Z',
            updatedAt: '2023-04-02T09:45:00Z'
          },
          { 
            id: '3', 
            truckId: 'TR-003',
            plateNumber: 'DEF-9012',
            truckModel: 'Scania R450',
            type: 'Inspection',
            status: 'SCHEDULED' as const,
            date: '2023-04-25',
            cost: 350,
            description: 'Annual DOT inspection and certification',
            technician: 'Sarah Williams',
            location: 'West Service Center - Los Angeles',
            createdAt: '2023-04-15T13:20:00Z',
            updatedAt: '2023-04-15T13:20:00Z'
          },
        ],
        totalCount: 3,
        totalPages: 1
      },
      message: 'Records fetched successfully'
    } as T;
    
    return { data: mockData };
  },
  delete: async <T,>(url: string): Promise<{ data: T }> => {
    // This is a placeholder. In a real app, you would use axios, fetch, etc.
    console.log(`DELETE ${url}`);
    
    // Mock response - replace with actual API call in production
    const mockResponse = {
      success: true,
      data: null,
      message: 'Record deleted successfully'
    } as T;
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { data: mockResponse };
  }
};

  // Utility functions for formatting
const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'MMM dd, yyyy');
  } catch {
    // Silently handle date parsing errors and return the original string
    return dateString;
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD'
  }).format(amount);
};

// Simple toast notification (replace with your preferred solution)
const toast = {
  success: (message: string) => {
    console.log(`SUCCESS: ${message}`);
    alert(message); // Replace with your UI component
  },
  error: (message: string) => {
    console.error(`ERROR: ${message}`);
    alert(`Error: ${message}`); // Replace with your UI component
  }
};

const MaintenanceList: React.FC = () => {
  // State management
  const [maintenanceRecords, setMaintenanceRecords] = useState<Maintenance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Maintenance | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  
  // For navigation
  const navigate = useNavigate();

  // Fetch maintenance records
  useEffect(() => {
    const fetchMaintenanceRecords = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Real API call with pagination and search
        const response = await apiClient.get<ApiResponse<{
          records: Maintenance[],
          totalCount: number,
          totalPages: number
        }>>('/maintenance', {
          params: {
            page,
            limit: 10,
            search: searchQuery,
            // You could add more filters here
          }
        });

        if (response.data.success) {
          setMaintenanceRecords(response.data.data.records);
          setTotalPages(response.data.data.totalPages);
        } else {
          throw new Error(response.data.message || 'Failed to fetch maintenance records');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        toast.error(`Error loading maintenance records: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaintenanceRecords();
  }, [page, searchQuery]);

  // Function to handle navigation to detail view
  const handleViewDetails = (id: string) => {
    const record = maintenanceRecords.find(record => record.id === id);
    if (record) {
      setSelectedRecord(record);
      setDetailModalOpen(true);
    }
  };

  // Function to handle editing a record
  const handleEdit = (id: string) => {
    navigate(`/maintenance/edit/${id}`);
  };

  // Function to handle deleting a record
  const handleDelete = (id: string) => {
    setRecordToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  // Function to confirm deletion
  const confirmDelete = async () => {
    if (!recordToDelete) return;
    
    try {
      setIsDeleting(true);
      
      // Real API call to delete the record
      const response = await apiClient.delete<ApiResponse<null>>(`/maintenance/${recordToDelete}`);
      
      if (response.data.success) {
        // Update local state after successful deletion
        setMaintenanceRecords(prevRecords => 
          prevRecords.filter(record => record.id !== recordToDelete)
        );
        
        toast.success('Maintenance record deleted successfully');
      } else {
        throw new Error(response.data.message || 'Failed to delete record');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      toast.error(`Error deleting record: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setRecordToDelete('');
    }
  };
  
  // Function to handle creating new maintenance record
  const handleScheduleMaintenance = () => {
    navigate('/maintenance/new');
  };
  
  // Function to handle pagination
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };
  
  // Function to handle search
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    // Reset to first page when searching
    setPage(1);
    // The actual search query update triggers the useEffect
  };
  
  // Render status badge with appropriate color
  const renderStatusBadge = (status: Maintenance['status']) => {
    switch (status) {
      case 'SCHEDULED':
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case 'IN_PROGRESS':
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      case 'COMPLETED':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'CANCELLED':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Maintenance Management</h1>
        <Button 
          onClick={handleScheduleMaintenance}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Schedule Maintenance
        </Button>
      </div>
      
      {/* Search form */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by plate number, model, or technician..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit">
            Search
          </Button>
          {searchQuery && (
            <Button
              variant="outline"
              onClick={() => setSearchQuery('')}
            >
              Clear
            </Button>
          )}
        </div>
      </form>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              {/* You can add an error icon here */}
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium">Error loading maintenance records</h3>
              <div className="mt-2 text-sm">{error}</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Maintenance records table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {maintenanceRecords.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No maintenance records found.</p>
                {searchQuery && (
                  <p className="mt-2">Try adjusting your search query.</p>
                )}
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Truck
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cost
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {maintenanceRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{record.plateNumber}</div>
                        <div className="text-xs text-gray-500">{record.truckModel}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{record.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(record.date)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderStatusBadge(record.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatCurrency(record.cost)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button 
                          variant="ghost"
                          className="text-blue-600 hover:text-blue-900 mr-2"
                          onClick={() => handleViewDetails(record.id)}
                        >
                          View
                        </Button>
                        <Button 
                          variant="ghost"
                          className="text-blue-600 hover:text-blue-900 mr-2"
                          onClick={() => handleEdit(record.id)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="ghost"
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDelete(record.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <div>
                <p className="text-sm text-gray-700">
                  Page {page} of {totalPages}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Detail Modal */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Maintenance Details</DialogTitle>
            <DialogDescription>
              Complete information about this maintenance record
            </DialogDescription>
          </DialogHeader>
          
          {selectedRecord && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div>
                <p className="text-sm text-gray-500">Truck ID</p>
                <p className="font-medium">{selectedRecord.truckId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Plate Number</p>
                <p className="font-medium">{selectedRecord.plateNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Model</p>
                <p className="font-medium">{selectedRecord.truckModel}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium">{selectedRecord.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">{selectedRecord.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{formatDate(selectedRecord.date)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cost</p>
                <p className="font-medium">{formatCurrency(selectedRecord.cost)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Technician</p>
                <p className="font-medium">{selectedRecord.technician}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{selectedRecord.location}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Description</p>
                <p className="font-medium">{selectedRecord.description}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created At</p>
                <p className="font-medium">{formatDate(selectedRecord.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-medium">{formatDate(selectedRecord.updatedAt)}</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDetailModalOpen(false);
                setSelectedRecord(null);
              }}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setDetailModalOpen(false);
                if (selectedRecord) {
                  handleEdit(selectedRecord.id);
                }
              }}
            >
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this maintenance record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setRecordToDelete('');
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MaintenanceList;