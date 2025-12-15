// src/types/models.ts
export interface Shipment {
    id?: string;
    trackingNumber: string;
    origin: string;
    destination: string;
    status: string;
    estimatedDelivery: string;
    clientId: string;
    driverId?: string;
    cargoIds: string[];
    // Add other fields as needed
}

export interface Cargo {
    id?: string;
    name: string;
    type: string;
    weight: number;
    dimensions: {
        length: number;
        width: number;
        height: number;
    };
    description: string;
    hazardous: boolean;
    shipmentId?: string;
    // Add other fields as needed
}