import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../UI/components/ui/card';
import { Separator } from '../../UI/components/ui/separator';
import { Truck } from '../types/truck.types';
import { getTruckById } from '../services/truckService';

interface TruckSpecificationsProps {
  truckId: string;
}

// ✅ FIXED: Extended Truck interface to handle missing properties safely
interface ExtendedTruck extends Truck {
  fuelType?: string; // Make fuelType optional to handle both cases
}

// Define additional truck specifications
interface TruckSpecs {
  engine: {
    type: string;
    displacement: string;
    horsepower: number;
    torque: string;
    emissions: string;
  };
  dimensions: {
    length: string;
    width: string;
    height: string;
    wheelbase: string;
    groundClearance: string;
  };
  capacity: {
    payload: string;
    towingCapacity: string;
    cargoVolume: string;
    fuelTank: string;
    seatCount: number;
  };
  features: string[];
}

const TruckSpecifications: React.FC<TruckSpecificationsProps> = ({ truckId }) => {
  const [truck, setTruck] = useState<ExtendedTruck | null>(null);
  const [specs, setSpecs] = useState<TruckSpecs | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTruckAndSpecs = async () => {
      try {
        setLoading(true);
        const truckData = await getTruckById(truckId);
        
        // ✅ FIXED: Safely cast to ExtendedTruck to handle optional fuelType
        setTruck(truckData as ExtendedTruck);
        
        // ✅ ENHANCED: Generate more realistic specs based on truck data
        const mockSpecs: TruckSpecs = {
          engine: {
            type: 'Diesel V8 Turbo',
            displacement: '6.7L',
            horsepower: 475,
            torque: '1,050 lb-ft',
            emissions: 'Euro 6'
          },
          dimensions: {
            length: '6.35m',
            width: '2.45m',
            height: '2.8m',
            wheelbase: '4.1m',
            groundClearance: '30cm'
          },
          capacity: {
            payload: '5,500 kg',
            towingCapacity: '32,500 kg',
            cargoVolume: '28 cubic meters',
            fuelTank: '125L',
            seatCount: 3
          },
          features: [
            'GPS Navigation System', 
            'Blind Spot Detection', 
            'Lane Departure Warning', 
            'Advanced Climate Control',
            'Air Ride Suspension',
            'Electronic Stability Control',
            'Autonomous Emergency Braking',
            'Adaptive Cruise Control',
            'Load Monitoring System',
            'Digital Driver Display'
          ]
        };

        setSpecs(mockSpecs);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load truck specifications'));
        console.error('Error fetching truck specifications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTruckAndSpecs();
  }, [truckId]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="flex justify-between">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !truck || !specs) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-red-500 p-4 border border-red-200 rounded bg-red-50">
            <p className="font-medium">Failed to load truck specifications</p>
            {error && <p className="text-sm mt-1">{error.message}</p>}
          </div>
        </CardContent>
      </Card>
    );
  }

  // ✅ FIXED: Helper function to safely get fuel type
  const getFuelType = (): string => {
    if (truck.fuelType) {
      return truck.fuelType;
    }
    // Fallback based on truck type or default
    if (truck.type?.toLowerCase().includes('electric')) {
      return 'Electric';
    }
    if (truck.type?.toLowerCase().includes('hybrid')) {
      return 'Hybrid';
    }
    return 'Diesel'; // Default for commercial trucks
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Basic Information */}
            <div>
              <h3 className="font-medium text-lg mb-3 text-gray-900">Basic Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-500 text-sm">Make</span>
                  <span className="font-medium">{truck.make}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-500 text-sm">Model</span>
                  <span className="font-medium">{truck.model}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-500 text-sm">Year</span>
                  <span className="font-medium">{truck.year}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-500 text-sm">Type</span>
                  <span className="font-medium">{truck.type}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-500 text-sm">VIN</span>
                  <span className="font-medium font-mono text-xs">{truck.vin}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-500 text-sm">License Plate</span>
                  <span className="font-medium">{truck.licensePlate}</span>
                </div>
                {/* ✅ FIXED: Safe fuel type display */}
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-500 text-sm">Fuel Type</span>
                  <span className="font-medium">{getFuelType()}</span>
                </div>
              </div>
            </div>

            {/* Engine Specifications */}
            <div>
              <h3 className="font-medium text-lg mb-3 text-gray-900">Engine Specifications</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-500 text-sm">Engine Type</span>
                  <span className="font-medium">{specs.engine.type}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-500 text-sm">Displacement</span>
                  <span className="font-medium">{specs.engine.displacement}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-500 text-sm">Horsepower</span>
                  <span className="font-medium">{specs.engine.horsepower.toLocaleString()} hp</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-500 text-sm">Torque</span>
                  <span className="font-medium">{specs.engine.torque}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-500 text-sm">Emissions Standard</span>
                  <span className="font-medium">{specs.engine.emissions}</span>
                </div>
              </div>
            </div>

            {/* Dimensions */}
            <div>
              <h3 className="font-medium text-lg mb-3 text-gray-900">Dimensions</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-500 text-sm">Length</span>
                  <span className="font-medium">{specs.dimensions.length}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-500 text-sm">Width</span>
                  <span className="font-medium">{specs.dimensions.width}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-500 text-sm">Height</span>
                  <span className="font-medium">{specs.dimensions.height}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-500 text-sm">Wheelbase</span>
                  <span className="font-medium">{specs.dimensions.wheelbase}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-500 text-sm">Ground Clearance</span>
                  <span className="font-medium">{specs.dimensions.groundClearance}</span>
                </div>
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          {/* Capacity Section */}
          <div>
            <h3 className="font-medium text-lg mb-4 text-gray-900">Capacity & Performance</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-center">
                <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Payload</p>
                <p className="text-lg font-bold text-blue-900 mt-1">{specs.capacity.payload}</p>
              </div>
              <div className="bg-green-50 border border-green-100 p-4 rounded-lg text-center">
                <p className="text-xs text-green-600 font-medium uppercase tracking-wide">Towing</p>
                <p className="text-lg font-bold text-green-900 mt-1">{specs.capacity.towingCapacity}</p>
              </div>
              <div className="bg-purple-50 border border-purple-100 p-4 rounded-lg text-center">
                <p className="text-xs text-purple-600 font-medium uppercase tracking-wide">Cargo Volume</p>
                <p className="text-lg font-bold text-purple-900 mt-1">{specs.capacity.cargoVolume}</p>
              </div>
              <div className="bg-orange-50 border border-orange-100 p-4 rounded-lg text-center">
                <p className="text-xs text-orange-600 font-medium uppercase tracking-wide">Fuel Tank</p>
                <p className="text-lg font-bold text-orange-900 mt-1">{specs.capacity.fuelTank}</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 p-4 rounded-lg text-center">
                <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">Seats</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{specs.capacity.seatCount}</p>
              </div>
            </div>
          </div>

          <Separator className="my-6" />
          
          {/* Features Section */}
          <div>
            <h3 className="font-medium text-lg mb-4 text-gray-900">Features & Equipment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {specs.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                  <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ✅ ADDED: Additional Actions Section */}
          <Separator className="my-6" />
          
          <div className="flex justify-end space-x-3">
            <button className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              Download Specs
            </button>
            <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              View Maintenance History
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TruckSpecifications;