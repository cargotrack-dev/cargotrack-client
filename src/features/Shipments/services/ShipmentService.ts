// src/services/ShipmentService.ts
import { Shipment, ShipmentStatus } from "../types/shipment";
import { v4 as uuidv4 } from 'uuid';
import CargoService from "@features/Cargo/services/CargoService";
import { CargoStatus } from "@features/Cargo/types/cargo";

// Mock user for created/updated by fields
const CURRENT_USER = "john.doe";

// Mock shipment data
const mockShipments: Shipment[] = [
  {
    id: "ship-001",
    reference: "SHIP-2025-0001",
    description: "Electronics delivery to Chicago distribution center",
    status: ShipmentStatus.IN_TRANSIT,
    priority: "NORMAL",
    cargoIds: ["cargo-001"],
    origin: {
      name: "Main Warehouse",
      address: "123 Logistics Way",
      city: "Los Angeles",
      state: "CA",
      country: "USA",
    },
    destination: {
      name: "Chicago Distribution Center",
      address: "456 Commerce Road",
      city: "Chicago",
      state: "IL",
      country: "USA",
    },
    stops: [
      {
        id: "stop-001",
        location: {
          name: "Rest Area 23",
          address: "Interstate 40",
          city: "Flagstaff",
          state: "AZ",
          country: "USA",
        },
        type: "REST",
        scheduledArrival: new Date("2025-01-17T18:00:00"),
        scheduledDeparture: new Date("2025-01-17T20:00:00"),
        status: "COMPLETED",
      },
      {
        id: "stop-002",
        location: {
          name: "Fuel Station",
          address: "789 Highway Drive",
          city: "Kansas City",
          state: "MO",
          country: "USA",
        },
        type: "FUEL",
        scheduledArrival: new Date("2025-01-18T14:00:00"),
        scheduledDeparture: new Date("2025-01-18T15:00:00"),
        status: "PENDING",
      },
    ],
    drivers: [
      {
        id: "driver-1",
        name: "John Smith",
        licenseNumber: "DL12345678",
        contactPhone: "+1-123-456-7890",
        assignment: {
          role: "PRIMARY",
          startTime: new Date("2025-01-16T08:00:00"),
        },
      },
    ],
    vehicles: [
      {
        id: "vehicle-1",
        type: "TRUCK",
        make: "Volvo",
        model: "VNL 860",
        year: 2023,
        licensePlate: "ABC-1234",
        vin: "4V4NC9EH4LN123456",
        status: "IN_USE",
      },
      {
        id: "vehicle-2",
        type: "TRAILER",
        make: "Great Dane",
        model: "Champion",
        year: 2022,
        licensePlate: "XYZ-7890",
        vin: "1GRAA06Y2HS123456",
        status: "IN_USE",
      },
    ],
    schedule: {
      plannedStart: new Date("2025-01-16T08:00:00"),
      actualStart: new Date("2025-01-16T08:15:00"),
      plannedEnd: new Date("2025-01-19T17:00:00"),
    },
    tracking: {
      lastKnownLocation: {
        latitude: 39.0997,
        longitude: -94.5786,
        timestamp: new Date("2025-01-18T10:30:00"),
        speed: 65,
        heading: 78,
      },
      trackingEvents: [
        {
          timestamp: new Date("2025-01-16T08:15:00"),
          type: "STATUS_CHANGE",
          description: "Shipment departed from origin",
          location: {
            latitude: 34.0522,
            longitude: -118.2437,
          },
        },
        {
          timestamp: new Date("2025-01-17T19:00:00"),
          type: "STOP_ARRIVAL",
          description: "Arrived at Rest Area 23",
          location: {
            latitude: 35.1983,
            longitude: -111.6513,
          },
        },
      ],
      currentEta: new Date("2025-01-19T16:30:00"),
    },
    costs: {
      estimatedTotal: 3250,
      actualTotal: 1800,
      currency: "USD",
      breakdown: [
        {
          category: "FUEL",
          description: "Diesel fuel",
          estimatedAmount: 1200,
          actualAmount: 950,
        },
        {
          category: "TOLLS",
          description: "Highway tolls",
          estimatedAmount: 350,
          actualAmount: 280,
        },
        {
          category: "DRIVER_PAY",
          description: "Driver salary",
          estimatedAmount: 1700,
          actualAmount: 570,
        },
      ],
    },
    documents: [
      {
        id: "doc-001",
        type: "BOL",
        reference: "BOL-20250116-001",
        fileUrl: "#",
      },
    ],
    clientId: "client-002",
    notes: "High-value electronics shipment, requires signature upon delivery.",
    createdAt: new Date("2025-01-15T14:30:00"),
    updatedAt: new Date("2025-01-18T10:30:00"),
    createdBy: "jane.smith",
    updatedBy: "system",
  },
  {
    id: "ship-002",
    reference: "SHIP-2025-0002",
    description: "Automotive parts delivery to manufacturing plant",
    status: ShipmentStatus.PLANNED,
    priority: "HIGH",
    cargoIds: ["cargo-002"],
    origin: {
      name: "Parts Warehouse",
      address: "789 Industrial Blvd",
      city: "Detroit",
      state: "MI",
      country: "USA",
    },
    destination: {
      name: "Assembly Plant",
      address: "101 Factory Lane",
      city: "Columbus",
      state: "OH",
      country: "USA",
    },
    stops: [],
    drivers: [],
    vehicles: [],
    schedule: {
      plannedStart: new Date("2025-01-25T07:00:00"),
      plannedEnd: new Date("2025-01-25T16:00:00"),
    },
    tracking: {
      trackingEvents: [],
    },
    costs: {
      estimatedTotal: 1200,
      currency: "USD",
      breakdown: [
        {
          category: "FUEL",
          description: "Diesel fuel",
          estimatedAmount: 350,
        },
        {
          category: "DRIVER_PAY",
          description: "Driver salary",
          estimatedAmount: 850,
        },
      ],
    },
    documents: [],
    clientId: "client-001",
    notes: "Just-in-time delivery required for manufacturing schedule.",
    createdAt: new Date("2025-01-18T09:15:00"),
    updatedAt: new Date("2025-01-18T09:15:00"),
    createdBy: "john.doe",
    updatedBy: "john.doe",
  },
];

// Local storage key
const STORAGE_KEY = "cargotrack_shipments";

/**
 * Initialize local storage with mock data if empty
 */
const initializeStorage = (): void => {
  const storedShipments = localStorage.getItem(STORAGE_KEY);
  if (!storedShipments) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockShipments));
  }
};

/**
 * Shipment service for CRUD operations
 */
export class ShipmentService {
  /**
   * Get all shipments
   */
  static async getAllShipments(): Promise<Shipment[]> {
    // Initialize storage if needed
    initializeStorage();

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const storedShipments = localStorage.getItem(STORAGE_KEY);
        resolve(JSON.parse(storedShipments || "[]"));
      }, 500);
    });
  }

  /**
   * Get a single shipment by ID
   */
  static async getShipmentById(id: string): Promise<Shipment | null> {
    // Initialize storage if needed
    initializeStorage();

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const storedShipments = localStorage.getItem(STORAGE_KEY);
        const shipmentList = JSON.parse(storedShipments || "[]") as Shipment[];
        const shipment = shipmentList.find((item) => item.id === id) || null;
        resolve(shipment);
      }, 300);
    });
  }

  /**
   * Create a new shipment
   */
  static createShipment(shipmentData: Omit<Shipment, "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy">): Promise<Shipment> {
    // Initialize storage if needed
    initializeStorage();

    // Create new shipment with generated ID and timestamps
    const newShipment: Shipment = {
      ...shipmentData,
      id: `ship-${uuidv4().substring(0, 8)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: CURRENT_USER,
      updatedBy: CURRENT_USER,
    };

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const processShipment = async () => {
          const storedShipments = localStorage.getItem(STORAGE_KEY);
          const shipmentList = JSON.parse(storedShipments || "[]") as Shipment[];
          
          // Add new shipment to list
          shipmentList.push(newShipment);
          
          // Save to storage
          localStorage.setItem(STORAGE_KEY, JSON.stringify(shipmentList));
          
          // Update cargo status if cargo items are provided
          if (newShipment.cargoIds && newShipment.cargoIds.length > 0) {
            await ShipmentService.updateCargoStatus(newShipment.cargoIds, CargoStatus.SCHEDULED);
          }
          
          resolve(newShipment);
        };
        
        processShipment().catch(error => {
          console.error('Error creating shipment:', error);
        });
      }, 700);
    });
  }

  /**
   * Update an existing shipment
   */
  static updateShipment(id: string, shipmentData: Partial<Shipment>): Promise<Shipment> {
    // Initialize storage if needed
    initializeStorage();

    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const processUpdate = async () => {
          const storedShipments = localStorage.getItem(STORAGE_KEY);
          const shipmentList = JSON.parse(storedShipments || "[]") as Shipment[];
          
          // Find shipment index
          const shipmentIndex = shipmentList.findIndex((item) => item.id === id);
          
          if (shipmentIndex === -1) {
            reject(new Error(`Shipment with ID ${id} not found`));
            return;
          }
          
          const oldShipment = shipmentList[shipmentIndex];
          
          // Update shipment data
          const updatedShipment: Shipment = {
            ...oldShipment,
            ...shipmentData,
            updatedAt: new Date(),
            updatedBy: CURRENT_USER,
          };
          
          // Replace in list
          shipmentList[shipmentIndex] = updatedShipment;
          
          // Save to storage
          localStorage.setItem(STORAGE_KEY, JSON.stringify(shipmentList));
          
          // Handle cargo status changes if cargo items changed
          if (shipmentData.cargoIds && oldShipment.cargoIds) {
            // Find removed cargo items
            const removedCargoIds = oldShipment.cargoIds.filter(
              id => !shipmentData.cargoIds?.includes(id)
            );
            
            // Find added cargo items
            const addedCargoIds = shipmentData.cargoIds.filter(
              id => !oldShipment.cargoIds.includes(id)
            );
            
            // Update status for removed cargo (back to PENDING)
            if (removedCargoIds.length > 0) {
              await ShipmentService.updateCargoStatus(removedCargoIds, CargoStatus.PENDING);
            }
            
            // Update status for added cargo
            if (addedCargoIds.length > 0) {
              const newStatus = shipmentData.status === ShipmentStatus.IN_TRANSIT 
                ? CargoStatus.IN_TRANSIT 
                : CargoStatus.SCHEDULED;
              await ShipmentService.updateCargoStatus(addedCargoIds, newStatus);
            }
          }
          
          // Update cargo status if shipment status changed
          if (shipmentData.status && oldShipment.status !== shipmentData.status && updatedShipment.cargoIds) {
            let cargoStatus: CargoStatus;
            
            switch (shipmentData.status) {
              case ShipmentStatus.PLANNED:
              case ShipmentStatus.DISPATCHED:
                cargoStatus = CargoStatus.SCHEDULED;
                break;
              case ShipmentStatus.IN_TRANSIT:
                cargoStatus = CargoStatus.IN_TRANSIT;
                break;
              case ShipmentStatus.COMPLETED:
                cargoStatus = CargoStatus.DELIVERED;
                break;
              case ShipmentStatus.CANCELLED:
                cargoStatus = CargoStatus.PENDING; // Reset to pending
                break;
              case ShipmentStatus.INCIDENT:
                cargoStatus = CargoStatus.ON_HOLD;
                break;
              default:
                cargoStatus = CargoStatus.SCHEDULED;
            }
            
            await ShipmentService.updateCargoStatus(updatedShipment.cargoIds, cargoStatus);
          }
          
          resolve(updatedShipment);
        };
        
        processUpdate().catch(error => {
          reject(error);
        });
      }, 700);
    });
  }

  /**
   * Delete a shipment
   */
  static deleteShipment(id: string): Promise<void> {
    // Initialize storage if needed
    initializeStorage();

    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const processDelete = async () => {
          const storedShipments = localStorage.getItem(STORAGE_KEY);
          const shipmentList = JSON.parse(storedShipments || "[]") as Shipment[];
          
          // Find shipment index
          const shipmentIndex = shipmentList.findIndex((item) => item.id === id);
          
          if (shipmentIndex === -1) {
            reject(new Error(`Shipment with ID ${id} not found`));
            return;
          }
          
          const shipment = shipmentList[shipmentIndex];
          
          // Handle cargo status updates
          if (shipment.cargoIds && shipment.cargoIds.length > 0) {
            await ShipmentService.updateCargoStatus(shipment.cargoIds, CargoStatus.PENDING);
          }
          
          // Remove from list
          shipmentList.splice(shipmentIndex, 1);
          
          // Save to storage
          localStorage.setItem(STORAGE_KEY, JSON.stringify(shipmentList));
          
          resolve();
        };
        
        processDelete().catch(error => {
          reject(error);
        });
      }, 500);
    });
  }

  /**
   * Get shipments by cargo ID
   */
  static getShipmentsByCargo(cargoId: string): Promise<Shipment[]> {
    // Initialize storage if needed
    initializeStorage();

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const storedShipments = localStorage.getItem(STORAGE_KEY);
        const shipmentList = JSON.parse(storedShipments || "[]") as Shipment[];
        
        // Filter shipments that contain the cargo ID
        const matchingShipments = shipmentList.filter(
          shipment => shipment.cargoIds.includes(cargoId)
        );
        
        resolve(matchingShipments);
      }, 300);
    });
  }

  /**
   * Update cargo status for multiple cargo items
   * This is a helper method to maintain consistency between cargo and shipments
   */
  private static async updateCargoStatus(cargoIds: string[], status: CargoStatus): Promise<void> {
    try {
      for (const cargoId of cargoIds) {
        await CargoService.updateCargoStatus(cargoId, status);
      }
    } catch (error) {
      console.error('Error updating cargo status:', error);
    }
  }
}

export default ShipmentService;