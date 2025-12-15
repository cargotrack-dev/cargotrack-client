import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const TruckDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock truck data - would be fetched from API in real implementation
  const truck = {
    id: id,
    plateNumber: 'ABC-1234',
    model: 'Volvo FH16',
    year: 2022,
    status: 'Available',
    vin: 'YS2R4X20005399401',
    engineType: 'Diesel',
    fuelCapacity: 600,
    fuelLevel: 450,
    odometerReading: 25000,
    dimensions: {
      length: 16.5,
      width: 2.5,
      height: 4.0,
      maxLoad: 40000
    },
    lastMaintenance: '2023-05-15',
    nextServiceDue: '2023-11-15',
    assignedDriver: 'John Doe',
    purchaseDate: '2022-01-10',
    purchasePrice: 150000,
    notes: 'This truck is in excellent condition and has been regularly serviced.'
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/trucks')}
          className="mr-4 px-2 py-1 border border-gray-300 rounded shadow-sm text-sm hover:bg-gray-50"
        >
          Back to List
        </button>
        <h1 className="text-2xl font-bold">Truck Details: {truck.plateNumber}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Information Card */}
        <div className="col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">General Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Plate Number</p>
              <p className="font-medium">{truck.plateNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Model</p>
              <p className="font-medium">{truck.model}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Year</p>
              <p className="font-medium">{truck.year}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  truck.status === 'Available' 
                    ? 'bg-green-100 text-green-800'
                    : truck.status === 'In Transit'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {truck.status}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">VIN</p>
              <p className="font-medium">{truck.vin}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Engine Type</p>
              <p className="font-medium">{truck.engineType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Assigned Driver</p>
              <p className="font-medium">{truck.assignedDriver}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Odometer</p>
              <p className="font-medium">{truck.odometerReading} km</p>
            </div>
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4">Dimensions & Capacity</h2>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Length</p>
              <p className="font-medium">{truck.dimensions.length} m</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Width</p>
              <p className="font-medium">{truck.dimensions.width} m</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Height</p>
              <p className="font-medium">{truck.dimensions.height} m</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Max Load</p>
              <p className="font-medium">{truck.dimensions.maxLoad} kg</p>
            </div>
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4">Notes</h2>
          <p className="text-gray-700">{truck.notes}</p>
        </div>

        {/* Sidebar Information */}
        <div className="col-span-1">
          {/* Fuel Status */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-3">Fuel Status</h2>
            <div className="mb-2">
              <div className="flex justify-between text-sm">
                <span>Current Level</span>
                <span>{Math.round(truck.fuelLevel / truck.fuelCapacity * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${truck.fuelLevel / truck.fuelCapacity * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm mt-4">
              <div>
                <p className="text-gray-500">Capacity</p>
                <p className="font-medium">{truck.fuelCapacity} L</p>
              </div>
              <div>
                <p className="text-gray-500">Current</p>
                <p className="font-medium">{truck.fuelLevel} L</p>
              </div>
            </div>
          </div>

          {/* Maintenance Info */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-3">Maintenance</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-sm text-gray-500">Last Service</p>
                <p className="font-medium">{truck.lastMaintenance}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Next Service Due</p>
                <p className="font-medium">{truck.nextServiceDue}</p>
              </div>
              <button className="mt-2 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Schedule Maintenance
              </button>
            </div>
          </div>

          {/* Purchase Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-3">Purchase Information</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-sm text-gray-500">Purchase Date</p>
                <p className="font-medium">{truck.purchaseDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Purchase Price</p>
                <p className="font-medium">${truck.purchasePrice.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>This is a stub implementation. Replace with actual truck details functionality.</p>
      </div>
    </div>
  );
};

export default TruckDetails;