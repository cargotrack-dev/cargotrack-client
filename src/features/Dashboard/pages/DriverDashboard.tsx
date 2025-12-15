// src/features/Dashboard/pages/DriverDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, Calendar, Check, X, AlertTriangle } from 'lucide-react';
import { useAuth } from '@features/Core/hooks/useAuth';
import { ResourceType, PermissionAction } from '@features/Core/types/auth';
import PermissionGate from '@features/Core/auth/PermissionGate';

interface Driver {
  id: string;
  name: string;
  phone: string;
  location: string;
  status: 'available' | 'on_delivery' | 'off_duty' | 'maintenance';
  lastUpdate: string;
  assignedVehicle?: string;
  currentShipment?: string;
  licensePlate?: string;
}

const DriverDashboard: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const navigate = useNavigate();
  const { hasPermission } = useAuth();

  useEffect(() => {
    const fetchDrivers = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        // const response = await api.get('/drivers');
        // setDrivers(response.data);
        
        // Mock data for demonstration
        const mockDrivers: Driver[] = [
          {
            id: '1',
            name: 'John Doe',
            phone: '+1 (555) 123-4567',
            location: 'Chicago, IL',
            status: 'available',
            lastUpdate: '2023-05-15T08:30:00Z',
            assignedVehicle: 'Truck #T-1001',
            licensePlate: 'IL-TR-1001'
          },
          {
            id: '2',
            name: 'Jane Smith',
            phone: '+1 (555) 987-6543',
            location: 'Detroit, MI',
            status: 'on_delivery',
            lastUpdate: '2023-05-15T07:15:00Z',
            assignedVehicle: 'Truck #T-1002',
            currentShipment: 'SH-5678',
            licensePlate: 'MI-TR-1002'
          },
          {
            id: '3',
            name: 'Bob Johnson',
            phone: '+1 (555) 456-7890',
            location: 'Indianapolis, IN',
            status: 'off_duty',
            lastUpdate: '2023-05-15T06:00:00Z',
            assignedVehicle: 'Truck #T-1003',
            licensePlate: 'IN-TR-1003'
          },
          {
            id: '4',
            name: 'Alice Williams',
            phone: '+1 (555) 345-6789',
            location: 'Columbus, OH',
            status: 'maintenance',
            lastUpdate: '2023-05-15T05:45:00Z',
            assignedVehicle: 'Truck #T-1004',
            licensePlate: 'OH-TR-1004'
          },
        ];
        
        setDrivers(mockDrivers);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching drivers:', err);
        setError('Failed to load drivers. Please try again later.');
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'on_delivery':
        return <MapPin className="w-5 h-5 text-blue-500" />;
      case 'off_duty':
        return <X className="w-5 h-5 text-gray-500" />;
      case 'maintenance':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'on_delivery':
        return 'On Delivery';
      case 'off_duty':
        return 'Off Duty';
      case 'maintenance':
        return 'Maintenance';
      default:
        return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'on_delivery':
        return 'bg-blue-100 text-blue-800';
      case 'off_duty':
        return 'bg-gray-100 text-gray-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          driver.assignedVehicle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          driver.licensePlate?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDriverClick = (id: string) => {
    if (hasPermission({ resource: ResourceType.DRIVER, action: PermissionAction.READ })) {
      navigate(`/dashboard/drivers/${id}`);
    }
  };

  const handleAddDriver = () => {
    navigate('/dashboard/drivers/new');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Drivers</h3>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Driver Management</h1>
        <PermissionGate 
          permissions={{ resource: ResourceType.DRIVER, action: PermissionAction.CREATE }}
        >
          <button
            onClick={handleAddDriver}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Add New Driver
          </button>
        </PermissionGate>
      </div>
      
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3"
                  placeholder="Search drivers, vehicles, or license plates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
                Status:
              </label>
              <select
                id="status-filter"
                className="focus:ring-blue-500 focus:border-blue-500 text-sm border-gray-300 rounded-md py-2"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="available">Available</option>
                <option value="on_delivery">On Delivery</option>
                <option value="off_duty">Off Duty</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDrivers.length > 0 ? (
                filteredDrivers.map((driver) => (
                  <tr 
                    key={driver.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleDriverClick(driver.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                          <div className="text-sm text-gray-500">{driver.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-900">{driver.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{driver.assignedVehicle || 'None'}</div>
                      {driver.licensePlate && (
                        <div className="text-sm text-gray-500">{driver.licensePlate}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(driver.status)}
                        <span className={`ml-2 inline-flex text-xs px-2 py-1 rounded-full ${getStatusClass(driver.status)}`}>
                          {getStatusText(driver.status)}
                        </span>
                      </div>
                      {driver.currentShipment && (
                        <div className="text-xs text-gray-500 mt-1">
                          Shipment: {driver.currentShipment}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                        {new Date(driver.lastUpdate).toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No drivers found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;