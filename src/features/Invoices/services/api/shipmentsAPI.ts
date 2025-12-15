// src/features/Invoices/services/api/shipmentsAPI.ts
import { apiRequest } from './apiClient';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

// Invoice related types - defined inline since we couldn't import them
enum InvoiceStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
  PARTIALLY_PAID = 'partially_paid'
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  taxable: boolean;
  waybillId?: string;
  notes?: string;
}

interface TaxItem {
  id: string;
  name: string;
  type: 'percentage' | 'fixed';
  rate: number;
  amount: number;
}

interface DiscountItem {
  id: string;
  name: string;
  type: 'percentage' | 'fixed';
  rate: number;
  amount: number;
}

interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  method: string;
  reference?: string;
  notes?: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  clientContact: string;
  clientEmail: string;
  clientAddress: string;
  clientPhone?: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  taxes: TaxItem[];
  discounts: DiscountItem[];
  payments: PaymentRecord[];
  notes?: string;
  terms?: string;
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  total: number;
  balance: number;
  status: InvoiceStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  currency: string;
}

// Shipment interface - assuming this matches your backend model
interface Shipment {
  id: string;
  shipmentNumber: string;
  clientId: string;
  clientName: string;
  origin: string;
  destination: string;
  status: string;
  departureDate: string;
  estimatedArrival: string;
  actualArrival?: string;
  items: {
    id: string;
    description: string;
    quantity: number;
    weight: number;
    volume: number;
  }[];
  trackingInfo: {
    trackingNumber: string;
    carrier: string;
    service: string;
  };
  waybillId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// API helper methods
export const shipmentsAPI = {
  // Generic API methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return apiRequest.get<T>(url, config);
  },
  
  async post<T, D = Record<string, unknown>>(url: string, data?: D, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return apiRequest.post<T, D>(url, data, config);
  },
  
  async put<T, D = Record<string, unknown>>(url: string, data?: D, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return apiRequest.put<T, D>(url, data, config);
  },
  
  async patch<T, D = Record<string, unknown>>(url: string, data?: D, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return apiRequest.patch<T, D>(url, data, config);
  },
  
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return apiRequest.delete<T>(url, config);
  },
  
  // Shipment-specific methods
  async getShipments(params?: Record<string, string | number | boolean>) {
    return this.get<Shipment[]>('/shipments', { params });
  },
  
  async getShipmentById(id: string) {
    return this.get<Shipment>(`/shipments/${id}`);
  },
  
  async createShipment(data: Omit<Shipment, 'id'>) {
    return this.post<Shipment, Omit<Shipment, 'id'>>('/shipments', data);
  },
  
  async updateShipment(id: string, data: Partial<Shipment>) {
    return this.put<Shipment, Partial<Shipment>>(`/shipments/${id}`, data);
  },
  
  async deleteShipment(id: string) {
    return this.delete<Shipment>(`/shipments/${id}`);
  },
  
  // Invoice-specific methods
  async getInvoices(params?: Record<string, string | number | boolean>) {
    return this.get<Invoice[]>('/invoices', { params });
  },
  
  async getInvoiceById(id: string) {
    return this.get<Invoice>(`/invoices/${id}`);
  },
  
  async createInvoice(data: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.post<Invoice, Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>>('/invoices', data);
  },
  
  async updateInvoice(id: string, data: Partial<Invoice>) {
    return this.put<Invoice, Partial<Invoice>>(`/invoices/${id}`, data);
  },
  
  async deleteInvoice(id: string) {
    return this.delete<void>(`/invoices/${id}`);
  },
  
  async updateInvoiceStatus(id: string, status: InvoiceStatus) {
    return this.patch<Invoice, { status: InvoiceStatus }>(`/invoices/${id}/status`, { status });
  },
  
  async recordInvoicePayment(invoiceId: string, paymentData: {
    amount: number;
    method: string;
    date: string;
    reference?: string;
    notes?: string;
  }) {
    return this.post<Invoice>(`/invoices/${invoiceId}/payments`, paymentData);
  },
  
  async generateInvoiceFromWaybill(
    waybillId: string,
    invoiceData?: Partial<Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>>
  ) {
    return this.post<Invoice>(`/waybills/${waybillId}/generate-invoice`, invoiceData);
  },
  
  // Utility method for file uploads
  async uploadFile(file: File, path = 'uploads') {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.post<{ url: string, filename: string }>(`/${path}`, formData as unknown as Record<string, unknown>, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default shipmentsAPI;