// 🔧 FIXED: mockTrackingService.ts with complete TrackingData objects
// src/services/mockTrackingService.ts

// ✅ FIXED: Import from unified types instead of separate tracking types
import { TrackingData, ShipmentStatus, StatusUpdate, SimpleLocation, ShipmentPriority } from '../../Shipments/types/shipment';

// ✅ FIXED: Use SimpleLocation for tracking compatibility
const generateNearbyLocation = (baseLat: number, baseLng: number): SimpleLocation => {
  // Random offset between -0.1 and 0.1 degrees (roughly 10km)
  const latOffset = (Math.random() - 0.5) * 0.2;
  const lngOffset = (Math.random() - 0.5) * 0.2;
  
  return {
    latitude: baseLat + latOffset,
    longitude: baseLng + lngOffset,
    address: generateRandomAddress(),
    timestamp: new Date().toISOString()
  };
};

// Generate random address for demonstration
const generateRandomAddress = (): string => {
  const streets = ['Main St', 'Broadway', 'Park Ave', 'Oak St', 'Maple Rd', 'Washington Blvd'];
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Dallas', 'Denver', 'Miami'];
  const states = ['NY', 'CA', 'IL', 'TX', 'CO', 'FL'];
  
  const streetNum = Math.floor(Math.random() * 1000) + 1;
  const street = streets[Math.floor(Math.random() * streets.length)];
  const city = cities[Math.floor(Math.random() * cities.length)];
  const state = states[Math.floor(Math.random() * states.length)];
  
  return `${streetNum} ${street}, ${city}, ${state}`;
};

// Generate a random date between two dates
const randomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// ✅ FIXED: Generate a single mock shipment with all required TrackingData properties
const generateMockShipment = (id: number): TrackingData => {
  // Base locations for major US cities
  const locations = [
    { city: 'New York', state: 'NY', lat: 40.7128, lng: -74.0060 },
    { city: 'Los Angeles', state: 'CA', lat: 34.0522, lng: -118.2437 },
    { city: 'Chicago', state: 'IL', lat: 41.8781, lng: -87.6298 },
    { city: 'Houston', state: 'TX', lat: 29.7604, lng: -95.3698 },
    { city: 'Phoenix', state: 'AZ', lat: 33.4484, lng: -112.0740 },
    { city: 'Philadelphia', state: 'PA', lat: 39.9526, lng: -75.1652 },
    { city: 'San Antonio', state: 'TX', lat: 29.4241, lng: -98.4936 },
    { city: 'San Diego', state: 'CA', lat: 32.7157, lng: -117.1611 },
    { city: 'Dallas', state: 'TX', lat: 32.7767, lng: -96.7970 },
    { city: 'San Jose', state: 'CA', lat: 37.3382, lng: -121.8863 }
  ];
  
  // Randomly select origin and destination
  const originIndex = Math.floor(Math.random() * locations.length);
  let destIndex;
  do {
    destIndex = Math.floor(Math.random() * locations.length);
  } while (destIndex === originIndex);
  
  const origin = locations[originIndex];
  const destination = locations[destIndex];
  
  // Random dates for shipment timeline
  const now = new Date();
  const pastDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
  const futureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
  
  const createdDate = randomDate(pastDate, now);
  const estimatedDelivery = randomDate(now, futureDate);
  const lastUpdateDate = new Date();
  
  // ✅ ADDED: Random priority
  const priorities: ShipmentPriority[] = ['LOW', 'NORMAL', 'HIGH', 'URGENT'];
  const priority = priorities[Math.floor(Math.random() * priorities.length)];
  
  // Randomly determine if delivered or delayed
  const isDelivered = Math.random() > 0.7;
  const isDelayed = !isDelivered && Math.random() > 0.7;
  
  // Current status based on delivery state
  let currentStatus: ShipmentStatus;
  let actualDelivery: string | undefined;
  
  if (isDelivered) {
    currentStatus = ShipmentStatus.DELIVERED;
    actualDelivery = randomDate(createdDate, now).toISOString();
  } else if (isDelayed) {
    currentStatus = ShipmentStatus.DELAYED;
  } else {
    const statuses = [ShipmentStatus.PENDING, ShipmentStatus.PICKED_UP, ShipmentStatus.IN_TRANSIT];
    currentStatus = statuses[Math.floor(Math.random() * statuses.length)];
  }
  
  // Generate status history
  const statusHistory: StatusUpdate[] = [];
  
  // Always start with PENDING
  statusHistory.push({
    id: `update-${id}-1`,
    shipmentId: `shipment-${id}`,
    status: ShipmentStatus.PENDING,
    location: generateNearbyLocation(origin.lat, origin.lng),
    notes: 'Shipment created and pending assignment',
    timestamp: createdDate.toISOString(),
    updatedBy: 'System'
  });
  
  // Add more statuses based on current status
  if (currentStatus !== ShipmentStatus.PENDING) {
    statusHistory.push({
      id: `update-${id}-2`,
      shipmentId: `shipment-${id}`,
      status: ShipmentStatus.PICKED_UP,
      location: generateNearbyLocation(origin.lat, origin.lng),
      notes: 'Package picked up from origin',
      timestamp: new Date(createdDate.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      updatedBy: 'Dispatch Manager'
    });
  }
  
  if (currentStatus === ShipmentStatus.IN_TRANSIT || currentStatus === ShipmentStatus.DELAYED || 
      currentStatus === ShipmentStatus.DELIVERED) {
    statusHistory.push({
      id: `update-${id}-3`,
      shipmentId: `shipment-${id}`,
      status: ShipmentStatus.IN_TRANSIT,
      location: generateNearbyLocation(
        origin.lat + (destination.lat - origin.lat) * 0.3,
        origin.lng + (destination.lng - origin.lng) * 0.3
      ),
      notes: 'Shipment in transit',
      timestamp: new Date(createdDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedBy: `Driver-${Math.floor(Math.random() * 100)}`
    });
  }
  
  if (currentStatus === ShipmentStatus.DELAYED) {
    statusHistory.push({
      id: `update-${id}-4`,
      shipmentId: `shipment-${id}`,
      status: ShipmentStatus.DELAYED,
      location: generateNearbyLocation(
        origin.lat + (destination.lat - origin.lat) * 0.6,
        origin.lng + (destination.lng - origin.lng) * 0.6
      ),
      notes: 'Shipment delayed due to weather conditions',
      timestamp: new Date(createdDate.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      updatedBy: `Driver-${Math.floor(Math.random() * 100)}`
    });
  }
  
  if (currentStatus === ShipmentStatus.DELIVERED) {
    statusHistory.push({
      id: `update-${id}-5`,
      shipmentId: `shipment-${id}`,
      status: ShipmentStatus.DELIVERED,
      location: generateNearbyLocation(destination.lat, destination.lng),
      notes: 'Shipment delivered successfully',
      timestamp: actualDelivery as string,
      updatedBy: `Driver-${Math.floor(Math.random() * 100)}`
    });
  }
  
  // Get the latest location from status history
  const currentLocation = statusHistory[statusHistory.length - 1].location;
  
  // ✅ FIXED: Create complete TrackingData object with all required properties
  return {
    shipmentId: `shipment-${id}`,
    waybillNumber: `WB-${1000 + id}`,
    currentStatus,
    currentLocation,
    estimatedDelivery: estimatedDelivery.toISOString(),
    actualDelivery,
    // ✅ ADDED: Missing required properties
    origin: `${origin.city}, ${origin.state}`,
    destination: `${destination.city}, ${destination.state}`,
    priority,
    lastUpdate: lastUpdateDate.toISOString(),
    createdAt: createdDate.toISOString(),
    updatedAt: lastUpdateDate.toISOString(),
    statusHistory,
    isDelayed,
    delayReason: isDelayed ? 'Weather conditions causing road closures' : undefined,
    assignedVehicle: currentStatus !== ShipmentStatus.PENDING ? `TRK-${100 + Math.floor(Math.random() * 900)}` : undefined,
    assignedDriver: currentStatus !== ShipmentStatus.PENDING ? `Driver ${Math.floor(Math.random() * 100)}` : undefined,
  };
};

// Generate a set of mock shipments
export const generateMockShipments = (count: number = 20): TrackingData[] => {
  return Array.from({ length: count }, (_, i) => generateMockShipment(i + 1));
};

// ✅ ENHANCED: Mock API functions with better error handling and features

// Simulate loading shipments from API
export const fetchShipments = async (): Promise<TrackingData[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Generate mock data
  const mockData = generateMockShipments();
  
  return mockData;
};

// Simulate loading a specific shipment
export const fetchShipmentById = async (shipmentId: string): Promise<TrackingData | null> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Generate mock data and find the specific shipment
  const allShipments = generateMockShipments(50);
  const shipment = allShipments.find(s => s.shipmentId === shipmentId);
  
  return shipment || null;
};

// Simulate updating a shipment status
export const updateShipmentStatus = async (update: StatusUpdate): Promise<StatusUpdate> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simulate success/failure
  if (Math.random() > 0.1) { // 10% chance of failure for testing error handling
    return {
      ...update,
      timestamp: new Date().toISOString(), // Update timestamp to current time
    };
  } else {
    throw new Error('Network error: Failed to update shipment status');
  }
};

// ✅ ADDED: Search shipments by various criteria
export const searchShipments = async (query: string): Promise<TrackingData[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const allShipments = generateMockShipments(50);
  const normalizedQuery = query.toLowerCase();
  
  return allShipments.filter(shipment => 
    shipment.waybillNumber.toLowerCase().includes(normalizedQuery) ||
    shipment.shipmentId.toLowerCase().includes(normalizedQuery) ||
    shipment.origin.toLowerCase().includes(normalizedQuery) ||
    shipment.destination.toLowerCase().includes(normalizedQuery) ||
    (shipment.assignedDriver && shipment.assignedDriver.toLowerCase().includes(normalizedQuery))
  );
};

// ✅ ADDED: Get shipments by status
export const fetchShipmentsByStatus = async (status: ShipmentStatus): Promise<TrackingData[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const allShipments = generateMockShipments(50);
  return allShipments.filter(shipment => shipment.currentStatus === status);
};

// ✅ ADDED: Get delayed shipments
export const fetchDelayedShipments = async (): Promise<TrackingData[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const allShipments = generateMockShipments(50);
  return allShipments.filter(shipment => shipment.isDelayed);
};

// ✅ ADDED: Simulate real-time location updates
export const subscribeToLocationUpdates = (
  //shipmentId: string, 
  callback: (location: SimpleLocation) => void
): () => void => {
  const interval = setInterval(() => {
    // Generate a random location update
    const mockLocation = generateNearbyLocation(
      40.7128 + (Math.random() - 0.5) * 10, // Random location in US
      -74.0060 + (Math.random() - 0.5) * 10
    );
    
    callback(mockLocation);
  }, 30000); // Update every 30 seconds
  
  // Return unsubscribe function
  return () => clearInterval(interval);
};

// ✅ ADDED: Export utility functions
export const getShipmentStatusCounts = (shipments: TrackingData[]): Record<ShipmentStatus, number> => {
  return shipments.reduce((counts, shipment) => {
    counts[shipment.currentStatus] = (counts[shipment.currentStatus] || 0) + 1;
    return counts;
  }, {} as Record<ShipmentStatus, number>);
};

export const calculateAverageDeliveryTime = (shipments: TrackingData[]): number => {
  const deliveredShipments = shipments.filter(s => s.currentStatus === ShipmentStatus.DELIVERED && s.actualDelivery);
  
  if (deliveredShipments.length === 0) return 0;
  
  const totalTime = deliveredShipments.reduce((sum, shipment) => {
    const created = new Date(shipment.createdAt).getTime();
    const delivered = new Date(shipment.actualDelivery!).getTime();
    return sum + (delivered - created);
  }, 0);
  
  return totalTime / deliveredShipments.length / (1000 * 60 * 60 * 24); // Return average days
};