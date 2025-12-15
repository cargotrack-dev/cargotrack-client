// src/features/Dashboard/pages/VehicleDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Truck,
  Search,
  Filter,
  AlertTriangle,
  MapPin,
  Check,
  X,
  Wrench,
  Calendar,
  Gauge,
  Fuel,
  BarChart2
} from 'lucide-react';
import { useAuth } from '@features/Core/hooks/useAuth';
import { ResourceType, PermissionAction } from '@features/Core/types/auth';
import PermissionGate from '@features/Core/auth/PermissionGate';

interface Vehicle {
  id: string;
  registrationNumber: string;
  model: string;
  type: 'truck' | 'van' | 'trailer';
  status: 'active' | 'maintenance' | 'out_of_service' | 'idle';
  location: string;
  lastMaintenance: string;
  nextMaintenance: string;
  fuelLevel: number;
  mileage: number;
  assignedDriver?: string;
  currentShipment?: string;
}

const VehicleDashboard: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const navigate = useNavigate();
  const { hasPermission } = useAuth();

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        // const response = await api.get('/vehicles');
        // setVehicles(response.data);

        // Mock data for demonstration
        const mockVehicles: Vehicle[] = [
          {
            id: '1',
            registrationNumber: 'TRK-1001',
            model: 'Volvo FH16',
            type: 'truck',
            status: 'active',
            location: 'Chicago, IL',
            lastMaintenance: '2023-04-15T10:00:00Z',
            nextMaintenance: '2023-07-15T10:00:00Z',
            fuelLevel: 85,
            mileage: 45780,
            assignedDriver: 'John Doe',
            currentShipment: 'SH-5678'
          },
          {
            id: '2',
            registrationNumber: 'TRK-1002',
            model: 'Freightliner Cascadia',
            type: 'truck',
            status: 'maintenance',
            location: 'Detroit, MI',
            lastMaintenance: '2023-05-10T08:30:00Z',
            nextMaintenance: '2023-08-10T08:30:00Z',
            fuelLevel: 45,
            mileage: 78950,
            assignedDriver: 'Jane Smith'
          },
          {
            id: '3',
            registrationNumber: 'VAN-2001',
            model: 'Mercedes-Benz Sprinter',
            type: 'van',
            status: 'active',
            location: 'Indianapolis, IN',
            lastMaintenance: '2023-03-20T14:15:00Z',
            nextMaintenance: '2023-06-20T14:15:00Z',
            fuelLevel: 92,
            mileage: 32150,
            assignedDriver: 'Bob Johnson'
          },
          {
            id: '4',
            registrationNumber: 'TRL-3001',
            model: 'Great Dane Reefer',
            type: 'trailer',
            status: 'idle',
            location: 'Columbus, OH',
            lastMaintenance: '2023-02-05T09:45:00Z',
            nextMaintenance: '2023-06-05T09:45:00Z',
            fuelLevel: 0,
            mileage: 65420
          },
          {
            id: '5',
            registrationNumber: 'TRK-1003',
            model: 'Peterbilt 579',
            type: 'truck',
            status: 'out_of_service',
            location: 'Cincinnati, OH',
            lastMaintenance: '2023-01-12T11:30:00Z',
            nextMaintenance: '2023-07-12T11:30:00Z',
            fuelLevel: 10,
            mileage: 112540
          },
        ];

        setVehicles(mockVehicles);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching vehicles:', err);
        setError('Failed to load vehicles. Please try again later.');
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'maintenance':
        return <Wrench className="w-5 h-5 text-yellow-500" />;
      case 'out_of_service':
        return <X className="w-5 h-5 text-red-500" />;
      case 'idle':
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'maintenance':
        return 'In Maintenance';
      case 'out_of_service':
        return 'Out of Service';
      case 'idle':
        return 'Idle';
      default:
        return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'out_of_service':
        return 'bg-red-100 text-red-800';
      case 'idle':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'truck':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'van':
        return <Truck className="w-5 h-5 text-indigo-500" />;
      case 'trailer':
        return <Truck className="w-5 h-5 text-purple-500" />;
      default:
        return <Truck className="w-5 h-5 text-gray-500" />;
    }
  };

  const getVehicleTypeText = (type: string) => {
    switch (type) {
      case 'truck':
        return 'Truck';
      case 'van':
        return 'Van';
      case 'trailer':
        return 'Trailer';
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatFuelLevel = (level: number) => {
    return `${level}%`;
  };

  const formatMileage = (miles: number) => {
    return new Intl.NumberFormat('en-US').format(miles) + ' mi';
  };

  const getFuelLevelClass = (level: number) => {
    if (level > 60) return 'text-green-600';
    if (level > 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch =
      vehicle.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vehicle.assignedDriver && vehicle.assignedDriver.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (vehicle.currentShipment && vehicle.currentShipment.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    const matchesType = typeFilter === 'all' || vehicle.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleVehicleClick = (id: string) => {
    if (hasPermission({ resource: ResourceType.VEHICLE, action: PermissionAction.READ })) {
      navigate(`/dashboard/vehicles/${id}`);
    }
  };

  const handleAddVehicle = () => {
    navigate('/dashboard/vehicles/new');
  };

  const handleScheduleMaintenance = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigate(`/dashboard/maintenance/schedule?vehicleId=${id}`);
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
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Vehicles</h3>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  // Calculate summary statistics
  const activeTrucks = vehicles.filter(v => v.status === 'active' && v.type === 'truck').length;
  const inMaintenance = vehicles.filter(v => v.status === 'maintenance').length;
  const outOfService = vehicles.filter(v => v.status === 'out_of_service').length;
  const totalVehicles = vehicles.length;

  // Function to check if maintenance is coming soon (within 30 days)
  const isMaintenanceSoon = (nextMaintenanceDate: string) => {
    const today = new Date();
    const maintenance = new Date(nextMaintenanceDate);
    const diffTime = maintenance.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Vehicle Management</h1>
        <PermissionGate
          permissions={{ resource: ResourceType.VEHICLE, action: PermissionAction.CREATE }}
        >
          <button
            onClick={handleAddVehicle}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Add New Vehicle
          </button>
        </PermissionGate>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow px-6 py-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-gray-900">Total Fleet</h3>
            <Truck className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{totalVehicles}</p>
          <div className="flex items-center mt-1">
            <span className="text-sm text-gray-500">Vehicles in operation</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow px-6 py-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-gray-900">Active</h3>
            <Check className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{activeTrucks}</p>
          <div className="flex items-center mt-1">
            <span className="text-sm text-gray-500">Trucks on the road</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow px-6 py-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-gray-900">In Maintenance</h3>
            <Wrench className="h-8 w-8 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{inMaintenance}</p>
          <div className="flex items-center mt-1">
            <span className="text-sm text-gray-500">Undergoing repairs</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow px-6 py-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-gray-900">Out of Service</h3>
            <X className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{outOfService}</p>
          <div className="flex items-center mt-1">
            <span className="text-sm text-gray-500">Unavailable vehicles</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3"
                  placeholder="Search by registration, model, or driver..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  className="focus:ring-blue-500 focus:border-blue-500 text-sm border-gray-300 rounded-md py-2"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="out_of_service">Out of Service</option>
                  <option value="idle">Idle</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-gray-400" />
                <select
                  className="focus:ring-blue-500 focus:border-blue-500 text-sm border-gray-300 rounded-md py-2"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="truck">Trucks</option>
                  <option value="van">Vans</option>
                  <option value="trailer">Trailers</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Maintenance
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Metrics
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map((vehicle) => (
                  <tr
                    key={vehicle.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleVehicleClick(vehicle.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTypeIcon(vehicle.type)}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{vehicle.registrationNumber}</div>
                          <div className="text-sm text-gray-500">{vehicle.model}</div>
                          <div className="text-xs text-gray-500">{getVehicleTypeText(vehicle.type)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(vehicle.status)}
                        <span className={`ml-2 inline-flex text-xs px-2 py-1 rounded-full ${getStatusClass(vehicle.status)}`}>
                          {getStatusText(vehicle.status)}
                        </span>
                      </div>
                      {vehicle.currentShipment && (
                        <div className="text-xs text-gray-500 mt-1 ml-7">
                          Shipment: {vehicle.currentShipment}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                        {vehicle.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{vehicle.assignedDriver || 'Unassigned'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                          <span>Last: {formatDate(vehicle.lastMaintenance)}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                          <span className={isMaintenanceSoon(vehicle.nextMaintenance) ? 'text-yellow-600 font-medium' : ''}>
                            Next: {formatDate(vehicle.nextMaintenance)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="flex items-center">
                          <Gauge className="h-4 w-4 text-gray-400 mr-1" />
                          <span>{formatMileage(vehicle.mileage)}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <Fuel className="h-4 w-4 text-gray-400 mr-1" />
                          <span className={getFuelLevelClass(vehicle.fuelLevel)}>
                            {formatFuelLevel(vehicle.fuelLevel)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <PermissionGate
                        permissions={{ resource: ResourceType.MAINTENANCE, action: PermissionAction.CREATE }}
                      >
                        <button
                          onClick={(e) => handleScheduleMaintenance(e, vehicle.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Schedule Maintenance"
                        >
                          <Wrench className="h-5 w-5" />
                        </button>
                      </PermissionGate>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No vehicles found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fleet Analytics Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Fleet Analytics Summary</h2>
          <BarChart2 className="h-6 w-6 text-blue-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Vehicle Type Distribution */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Vehicle Types</h3>
            <div className="space-y-2">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Trucks</span>
                  <span className="text-sm font-medium">{vehicles.filter(v => v.type === 'truck').length}</span>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(vehicles.filter(v => v.type === 'truck').length / totalVehicles) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Vans</span>
                  <span className="text-sm font-medium">{vehicles.filter(v => v.type === 'van').length}</span>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-500 h-2 rounded-full"
                    style={{ width: `${(vehicles.filter(v => v.type === 'van').length / totalVehicles) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Trailers</span>
                  <span className="text-sm font-medium">{vehicles.filter(v => v.type === 'trailer').length}</span>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${(vehicles.filter(v => v.type === 'trailer').length / totalVehicles) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Distribution */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Status Distribution</h3>
            <div className="space-y-2">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active</span>
                  <span className="text-sm font-medium">{vehicles.filter(v => v.status === 'active').length}</span>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(vehicles.filter(v => v.status === 'active').length / totalVehicles) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Maintenance</span>
                  <span className="text-sm font-medium">{vehicles.filter(v => v.status === 'maintenance').length}</span>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${(vehicles.filter(v => v.status === 'maintenance').length / totalVehicles) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Out of Service</span>
                  <span className="text-sm font-medium">{vehicles.filter(v => v.status === 'out_of_service').length}</span>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${(vehicles.filter(v => v.status === 'out_of_service').length / totalVehicles) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Idle</span>
                  <span className="text-sm font-medium">{vehicles.filter(v => v.status === 'idle').length}</span>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gray-500 h-2 rounded-full"
                    style={{ width: `${(vehicles.filter(v => v.status === 'idle').length / totalVehicles) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Maintenance Alerts */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Maintenance Alerts</h3>
            <div className="space-y-2">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Upcoming Maintenance</p>
                    <p className="text-xs text-yellow-700 mt-1">
                      {vehicles.filter(v => isMaintenanceSoon(v.nextMaintenance)).length} vehicles due for maintenance in the next 30 days
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Low Fuel Alerts</p>
                    <p className="text-xs text-red-700 mt-1">
                      {vehicles.filter(v => v.fuelLevel < 25).length} vehicles with fuel level below 25%
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Fleet Utilization</p>
                    <p className="text-xs text-green-700 mt-1">
                      {Math.round((vehicles.filter(v => v.status === 'active').length / totalVehicles) * 100)}% of fleet currently active
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDashboard;