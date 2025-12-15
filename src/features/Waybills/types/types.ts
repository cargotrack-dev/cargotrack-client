// src/features/Waybills/types/types.ts

// Main form data interface
export interface WaybillFormData {
  truckId: string;
  clientId: string;
  client: {
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
    hazardClass: string;
    specialInstructions: string;
  };
  pricing: {
    baseRate: number;
    additionalCharges: Array<{
      description: string;
      amount: number;
    }>;
    tax: number;
    total: number;
    currency: string;
  };
  pickupDate: string;
  estimatedDeliveryDate: string;
  notes: string;
  isDraft?: boolean;
  volume?: number;
  id?: string;
}
  
// Props interface for the WaybillForm component
export interface WaybillFormProps {
  onSubmit: (data: WaybillFormData) => void;
  trucks?: Array<{id: string, licensePlate: string}>;
  clients?: Array<{id: string, name: string}>;
  initialData?: Partial<WaybillFormData>;
}
  
// Additional Charge interface
export interface AdditionalCharge {
  description: string;
  amount: number;
}
  
// Currency options type
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD';
  
// Form section identifiers
export type FormSection = 'general' | 'parties' | 'cargo' | 'pricing' | 'additional';

export interface WaybillFilter {
  status?: string;
  shipmentId?: string;
  createdAfter?: string;
  createdBefore?: string;
}

export interface Waybill {
  id: string;
  waybillNumber: string;
  shipmentId: string;
  createdAt: string;
  status: string;
  
  // Add shipper and consignee properties
  shipper: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    phone?: string;
    email?: string;
  };
  
  consignee: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    phone?: string;
    email?: string;
  };
  
  origin: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  
  destination: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  
  // Update the items to include declaredValue
  items: Array<{
    description: string;
    quantity: number;
    weight: number;
    declaredValue: number; // Add this missing property
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
  }>;
  
  signatures?: {
    sender?: {
      name: string;
      signature: string;
      date: string;
    };
    receiver?: {
      name: string;
      signature: string;
      date: string;
    };
  };
  
  notes?: string;
}

export interface WaybillFilter {
  status?: string;
  shipmentId?: string;
  createdAfter?: string;
  createdBefore?: string;
}