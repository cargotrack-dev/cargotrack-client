// src/types/cargo.ts

/**
 * Enumeration of possible cargo types
 */
export enum CargoType {
    GENERAL = 'GENERAL',
    BULK = 'BULK',
    LIQUID = 'LIQUID',
    CONTAINER = 'CONTAINER',
    REFRIGERATED = 'REFRIGERATED',
    HAZARDOUS = 'HAZARDOUS',
    OVERSIZED = 'OVERSIZED',
    LIVESTOCK = 'LIVESTOCK',
    VEHICLES = 'VEHICLES',
    ELECTRONICS = 'ELECTRONICS',
    FURNITURE = 'FURNITURE',
    AUTOMOTIVE = 'AUTOMOTIVE',
    CLOTHING = 'CLOTHING',
    FOOD = 'FOOD',
    MEDICAL = 'MEDICAL',
    FRAGILE = 'FRAGILE',
    PERISHABLE = 'PERISHABLE',
    OTHER = 'OTHER'
}

/**
 * Enumeration of cargo status for tracking
 */
export enum CargoStatus {
    PENDING = 'PENDING',         // Waiting to be picked up
    SCHEDULED = 'SCHEDULED',     // Scheduled for pickup
    IN_TRANSIT = 'IN_TRANSIT',   // Currently being transported
    DELIVERED = 'DELIVERED',     // Successfully delivered
    RETURNED = 'RETURNED',       // Returned to sender
    DAMAGED = 'DAMAGED',         // Damaged during transport
    LOST = 'LOST',               // Lost during transport
    ON_HOLD = 'ON_HOLD'          // Temporarily on hold
}

/**
 * Enumeration of hazardous material classes
 * Based on international standards for dangerous goods
 */
export enum HazardClass {
    NONE = 'NONE',                     // Not hazardous
    EXPLOSIVE = 'EXPLOSIVE',           // Class 1: Explosives
    GASES = 'GASES',                   // Class 2: Gases
    FLAMMABLE_LIQUID = 'FLAMMABLE_LIQUID', // Class 3: Flammable liquids
    FLAMMABLE_SOLID = 'FLAMMABLE_SOLID',  // Class 4: Flammable solids
    OXIDIZER = 'OXIDIZER',             // Class 5: Oxidizing substances
    TOXIC = 'TOXIC',                   // Class 6: Toxic substances
    RADIOACTIVE = 'RADIOACTIVE',       // Class 7: Radioactive materials
    CORROSIVE = 'CORROSIVE',           // Class 8: Corrosive substances
    MISCELLANEOUS = 'MISCELLANEOUS'    // Class 9: Miscellaneous dangerous goods
}

/**
 * Interface for cargo dimensions
 */
export interface CargoDimensions {
    length: number;  // Length in meters
    width: number;   // Width in meters
    height: number;  // Height in meters
    unit: 'cm' | 'm' | 'in' | 'ft';  // Unit of measurement
}

/**
 * Interface for cargo weight
 */
export interface CargoWeight {
    gross: number;   // Gross weight including packaging
    net: number;     // Net weight of goods only
    tare: number;    // Weight of empty container/packaging
    unit: 'kg' | 'lb' | 't';  // Unit of measurement
}

/**
 * Interface for special handling instructions
 */
export interface HandlingInstructions {
    temperatureRange?: {
        min: number;
        max: number;
        unit: 'C' | 'F';
    };
    orientationRequired?: boolean;
    stackable?: boolean;
    fragile?: boolean;
    customInstructions?: string;
}

/**
 * Interface for cargo documentation
 */
export interface CargoDocument {
    id: string;
    type: 'BOL' | 'CMR' | 'INVOICE' | 'PERMIT' | 'CUSTOMS' | 'CERTIFICATE' | 'OTHER';
    reference: string;
    issueDate: Date;
    expiryDate?: Date;
    fileUrl?: string;
    notes?: string;
}

/**
 * Main Cargo interface representing goods for shipment
 */
export interface Cargo {
    id: string;
    reference: string;           // Customer reference number
    description: string;         // Description of cargo
    type: CargoType;             // Type of cargo
    status: CargoStatus;         // Current status
    shipmentId: string;          // Shipment ID
    quantity: number;            // Number of items/units
    quantityUnit: string;        // Unit for quantity (boxes, pallets, etc.)
    dimensions?: CargoDimensions; // Physical dimensions
    weight: CargoWeight;         // Weight information
    value: {                     // Value information for insurance and customs
        amount: number;
        currency: string;
    };
    hazardClass: HazardClass;    // Hazardous material classification
    hazardDetails?: string;      // Additional details for hazardous materials
    handlingInstructions?: HandlingInstructions; // Special handling requirements
    documents: CargoDocument[];  // Associated documentation
    clientId: string;            // Associated client
    notes?: string;              // Additional notes
    tags?: string[];             // Searchable tags
    createdAt: Date;             // Creation timestamp
    updatedAt: Date;             // Last update timestamp
    createdBy: string;           // User ID who created
    updatedBy: string;           // User ID who last updated
}
