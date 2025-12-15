// src/services/CargoService.ts
import { Cargo, CargoStatus, CargoType, HazardClass } from "../types/cargo";
import { v4 as uuidv4 } from 'uuid';

// This is a mock implementation of a cargo service
// In a real application, this would connect to your backend API

// Mock user for created/updated by fields
const CURRENT_USER = "john.doe";

// Mock cargo data
const mockCargo: Cargo[] = [
  {
    id: "cargo-001",
    shipmentId: "shipment-001",
    reference: "CARGO-2025-001",
    description: "Electronics components for manufacturing plant",
    type: CargoType.GENERAL,
    status: CargoStatus.PENDING,
    quantity: 12,
    quantityUnit: "pallets",
    dimensions: {
      length: 120,
      width: 100,
      height: 120,
      unit: "cm",
    },
    weight: {
      gross: 500,
      net: 480,
      tare: 20,
      unit: "kg",
    },
    value: {
      amount: 75000,
      currency: "USD",
    },
    hazardClass: HazardClass.NONE,
    documents: [
      {
        id: "doc-001",
        type: "INVOICE",
        reference: "INV-20250115-001",
        issueDate: new Date("2025-01-15"),
        fileUrl: "#",
        notes: "Commercial invoice for customs clearance",
      },
    ],
    clientId: "client-001",
    tags: ["electronics", "fragile", "high-value"],
    createdAt: new Date("2025-01-15T09:30:00"),
    updatedAt: new Date("2025-01-15T09:30:00"),
    createdBy: "john.doe",
    updatedBy: "john.doe",
  },
  {
    id: "cargo-002",
    shipmentId: "shipment-002",
    reference: "CARGO-2025-002",
    description: "Automotive parts for assembly line",
    type: CargoType.CONTAINER,
    status: CargoStatus.SCHEDULED,
    quantity: 1,
    quantityUnit: "container",
    dimensions: {
      length: 240,
      width: 240,
      height: 260,
      unit: "cm",
    },
    weight: {
      gross: 15000,
      net: 14200,
      tare: 800,
      unit: "kg",
    },
    value: {
      amount: 125000,
      currency: "USD",
    },
    hazardClass: HazardClass.NONE,
    documents: [],
    clientId: "client-002",
    tags: ["automotive", "parts"],
    createdAt: new Date("2025-01-16T14:20:00"),
    updatedAt: new Date("2025-01-17T09:15:00"),
    createdBy: "jane.smith",
    updatedBy: "jane.smith",
  },
  {
    id: "cargo-003",
    shipmentId: "shipment-003",
    reference: "CARGO-2025-003",
    description: "Chemical solutions for industrial cleaning",
    type: CargoType.LIQUID,
    status: CargoStatus.PENDING,
    quantity: 20,
    quantityUnit: "drums",
    dimensions: {
      length: 60,
      width: 60,
      height: 90,
      unit: "cm",
    },
    weight: {
      gross: 400,
      net: 380,
      tare: 20,
      unit: "kg",
    },
    value: {
      amount: 8500,
      currency: "USD",
    },
    hazardClass: HazardClass.CORROSIVE,
    hazardDetails: "Contains hydrochloric acid solution (10%)",
    handlingInstructions: {
      orientationRequired: true,
      stackable: false,
      fragile: true,
      customInstructions: "Keep upright at all times. Do not stack. Keep away from heat sources and incompatible materials."
    },
    documents: [
      {
        id: "doc-002",
        type: "CERTIFICATE",
        reference: "MSDS-20250110",
        issueDate: new Date("2025-01-10"),
        fileUrl: "#",
        notes: "Material Safety Data Sheet",
      },
      {
        id: "doc-003",
        type: "PERMIT",
        reference: "HAZMAT-2025-0123",
        issueDate: new Date("2025-01-12"),
        expiryDate: new Date("2025-12-31"),
        fileUrl: "#",
        notes: "Hazardous materials transport permit",
      },
    ],
    clientId: "client-003",
    tags: ["chemical", "hazardous", "corrosive"],
    createdAt: new Date("2025-01-18T11:45:00"),
    updatedAt: new Date("2025-01-18T11:45:00"),
    createdBy: "robert.johnson",
    updatedBy: "robert.johnson",
  },
];

// Local storage key
const STORAGE_KEY = "cargotrack_cargo_items";

/**
 * Initialize local storage with mock data if empty
 */
const initializeStorage = (): void => {
  const storedCargo = localStorage.getItem(STORAGE_KEY);
  if (!storedCargo) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockCargo));
  }
};

/**
 * Cargo service for CRUD operations
 */
export class CargoService {
  /**
   * Get all cargo items
   */
  static async getAllCargo(): Promise<Cargo[]> {
    // Initialize storage if needed
    initializeStorage();

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const storedCargo = localStorage.getItem(STORAGE_KEY);
        resolve(JSON.parse(storedCargo || "[]"));
      }, 500);
    });
  }

  /**
   * Get a single cargo item by ID
   */
  static async getCargoById(id: string): Promise<Cargo | null> {
    // Initialize storage if needed
    initializeStorage();

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const storedCargo = localStorage.getItem(STORAGE_KEY);
        const cargoList = JSON.parse(storedCargo || "[]") as Cargo[];
        const cargo = cargoList.find((item) => item.id === id) || null;
        resolve(cargo);
      }, 300);
    });
  }

  /**
   * Create a new cargo item
   */
  static async createCargo(cargoData: Omit<Cargo, "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy">): Promise<Cargo> {
    // Initialize storage if needed
    initializeStorage();

    // Create new cargo with generated ID and timestamps
    const newCargo: Cargo = {
      ...cargoData,
      id: `cargo-${uuidv4().substring(0, 8)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: CURRENT_USER,
      updatedBy: CURRENT_USER,
    };

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const storedCargo = localStorage.getItem(STORAGE_KEY);
        const cargoList = JSON.parse(storedCargo || "[]") as Cargo[];
        
        // Add new cargo to list
        cargoList.push(newCargo);
        
        // Save to storage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cargoList));
        
        resolve(newCargo);
      }, 700);
    });
  }

  /**
   * Update an existing cargo item
   */
  static async updateCargo(id: string, cargoData: Partial<Cargo>): Promise<Cargo> {
    // Initialize storage if needed
    initializeStorage();

    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const storedCargo = localStorage.getItem(STORAGE_KEY);
        const cargoList = JSON.parse(storedCargo || "[]") as Cargo[];
        
        // Find cargo index
        const cargoIndex = cargoList.findIndex((item) => item.id === id);
        
        if (cargoIndex === -1) {
          reject(new Error(`Cargo with ID ${id} not found`));
          return;
        }
        
        // Update cargo data
        const updatedCargo: Cargo = {
          ...cargoList[cargoIndex],
          ...cargoData,
          updatedAt: new Date(),
          updatedBy: CURRENT_USER,
        };
        
        // Replace in list
        cargoList[cargoIndex] = updatedCargo;
        
        // Save to storage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cargoList));
        
        resolve(updatedCargo);
      }, 700);
    });
  }

  /**
   * Delete a cargo item
   */
  static async deleteCargo(id: string): Promise<void> {
    // Initialize storage if needed
    initializeStorage();

    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const storedCargo = localStorage.getItem(STORAGE_KEY);
        const cargoList = JSON.parse(storedCargo || "[]") as Cargo[];
        
        // Find cargo index
        const cargoIndex = cargoList.findIndex((item) => item.id === id);
        
        if (cargoIndex === -1) {
          reject(new Error(`Cargo with ID ${id} not found`));
          return;
        }
        
        // Remove from list
        cargoList.splice(cargoIndex, 1);
        
        // Save to storage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cargoList));
        
        resolve();
      }, 500);
    });
  }

  /**
   * Update cargo status
   */
  static async updateCargoStatus(id: string, status: CargoStatus): Promise<Cargo> {
    return this.updateCargo(id, { status });
  }
}

export default CargoService;