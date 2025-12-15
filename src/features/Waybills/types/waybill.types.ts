// src/types/waybill.types.ts
export interface WaybillDocument {
    id: string;
    waybillNumber?: string;
    client: {
      id: string;
      name: string;
      contactPerson: string;
      phone: string;
      email: string;
    };
    shipper: {
      name: string;
      address: string;
      phone: string;
      email: string;
    };
    consignee: {
      name: string;
      address: string;
      phone: string;
      email: string;
    };
    origin: string;
    destination: string;
    pickupDate: string;
    estimatedDeliveryDate: string;
    actualDeliveryDate: string | null;
    truck: {
      id: string;
      licensePlate: string;
      driver: {
        name: string;
        license: string;
        phone: string;
      };
      currentLocation?: {
        lat: number;
        lng: number;
        lastUpdated: string;
      };
    };
    status: WaybillStatus;
    statusHistory: StatusHistoryEntry[];
    cargo: {
      description: string;
      type: string;
      weight: number;
      units: number;
      value: number;
      dimensions: {
        length: number;
        width: number;
        height: number;
      };
      hazardous: boolean;
      hazardClass?: string;
      specialInstructions?: string;
    };
    pricing: {
      baseRate: number;
      additionalCharges: AdditionalCharge[];
      tax: number;
      total: number;
      currency: string;
    };
    documents?: DocumentEntry[];
    signatures?: {
      shipper?: SignatureEntry;
      driver?: SignatureEntry;
      consignee?: SignatureEntry;
    };
    invoiceGenerated: boolean;
    invoiceId?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export type WaybillStatus = 'pending' | 'in_transit' | 'delivered' | 'cancelled';
  
  export interface StatusHistoryEntry {
    status: WaybillStatus;
    timestamp: string;
    location?: string;
    note?: string;
    updatedBy: string;
  }
  
  export interface AdditionalCharge {
    description: string;
    amount: number;
  }
  
  export interface DocumentEntry {
    type: string;
    url: string;
    uploadedAt: string;
  }
  
  export interface SignatureEntry {
    name: string;
    signature?: string;
    date: string;
  }

