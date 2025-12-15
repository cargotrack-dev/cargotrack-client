// src/features/Invouces/contexts/context.tsx
import { createContext } from 'react';
import { Invoice, PaymentRecord } from '../types/invoice';


interface InvoiceContextType {
  invoices: Invoice[];
  isLoading: boolean;
  error: string | null;
  selectedInvoice: Invoice | null;
  loadInvoices: () => Promise<void>;
  getInvoiceById: (id: string) => Invoice | null;
  createInvoice: (data: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateInvoice: (id: string, data: Partial<Invoice>) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  fetchInvoiceById: (id: string) => Promise<void>;
  recordPayment: (invoiceId: string, payment: Omit<PaymentRecord, 'id'>) => Promise<void>;
  generateFromWaybill: (waybillId: string) => Promise<void>;
}

// Create context with default values
export const InvoiceContext = createContext<InvoiceContextType>({
  invoices: [],
  isLoading: false,
  error: null,
  selectedInvoice: null,
  loadInvoices: async () => {},
  getInvoiceById: () => null,
  createInvoice: async () => {},
  updateInvoice: async () => {},
  deleteInvoice: async () => {},
  fetchInvoiceById: async () => {},
  recordPayment: async () => {},
  generateFromWaybill: async () => {},
});