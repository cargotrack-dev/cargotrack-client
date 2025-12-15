// src/features/RouteOptimization/types/index.ts
export interface Location {
    id: string;
    name: string;
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    type: 'pickup' | 'delivery' | 'depot';
  }
  
  export interface RouteConstraint {
    maxDistance?: number;
    maxDuration?: number;
    vehicleCapacity?: number;
    priorityLocations?: string[];
    avoidTolls?: boolean;
    avoidHighways?: boolean;
    departureTime?: string | Date;
  }
  
  export interface RouteSegment {
    startLocationId: string;
    endLocationId: string;
    distance: number;
    duration: number;
    polyline: string; // Encoded polyline for the path
  }
  
  export interface OptimizedRoute {
    id: string;
    name?: string;
    vehicleId?: string;
    driverId?: string;
    locations: Location[];
    segments: RouteSegment[];
    totalDistance: number;
    totalDuration: number;
    departureTime: string | Date;
    estimatedArrivalTime: string | Date;
    createdAt: string | Date;
  }
  
  export interface OptimizationResult {
    routes: OptimizedRoute[];
    unassignedLocations?: Location[];
    status: 'optimal' | 'suboptimal' | 'infeasible';
    message?: string;
  }