// src/features/clients/types/index.ts
export interface Client {
    id: string;
    name: string;
    email: string;
    phone?: string;
    contactPerson?: string;
    company?: string;
    address?: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    status: 'active' | 'inactive' | 'pending';
    createdAt: string | Date;
    updatedAt: string | Date;
  }
  
  export interface ClientPreferences {
    notificationChannels?: {
      email: boolean;
      sms: boolean;
      app: boolean;
    };
    notificationTypes?: {
      shipmentUpdates: boolean;
      deliveryAlerts: boolean;
      invoices: boolean;
      promotions: boolean;
    };
    language?: string;
    timezone?: string;
  }
  
  export interface ClientFeedback {
    id: string;
    clientId: string;
    subject: string;
    message: string;
    rating?: number;
    status: 'new' | 'inProgress' | 'resolved';
    createdAt: string | Date;
  }
  
  export interface Quote {
    id: string;
    clientId: string;
    services: string[];
    origin: string;
    destination: string;
    cargoDetails: {
      type: string;
      weight: number;
      dimensions: {
        length: number;
        width: number;
        height: number;
      };
    };
    estimatedPrice: {
      amount: number;
      currency: string;
    };
    validUntil: string | Date;
    status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
    createdAt: string | Date;
  }