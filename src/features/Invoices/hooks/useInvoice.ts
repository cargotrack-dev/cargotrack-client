// src/features/Invoices/hooks/useInvoice.ts
import { useContext } from 'react';
import { InvoiceContext } from '../contexts/InvoiceContext';

// Re-export types that might be needed when using this hook
export enum InvoiceStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
  PARTIALLY_PAID = 'partially_paid'
}

// Define the basic invoice interfaces
export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  taxable: boolean;
  waybillId?: string;
  notes?: string;
}

export interface TaxItem {
  id: string;
  name: string;
  type: 'percentage' | 'fixed';
  rate: number;
  amount: number;
}

export interface DiscountItem {
  id: string;
  name: string;
  type: 'percentage' | 'fixed';
  rate: number;
  amount: number;
}

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  method: string;
  reference?: string;
  notes?: string;
}

export interface Invoice {
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

// Define the interface for what the hook returns to make TypeScript happy
export interface InvoiceContextValue {
  invoices: Invoice[];
  isLoading: boolean;
  error: string | null;
  loadInvoices: () => Promise<void>;
  getInvoice: (id: string) => Invoice | undefined;
  createInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Invoice>;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => Promise<Invoice>;
  deleteInvoice: (id: string) => Promise<boolean>;
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => Promise<Invoice>;
  recordPayment: (invoiceId: string, payment: {
    amount: number;
    method: string;
    date: string;
    reference?: string;
    notes?: string;
  }) => Promise<Invoice>;
  generateInvoiceNumber: () => Promise<string>; // Add this
  loading: boolean; // Add this alias for isLoading
  selectedInvoice: Invoice | null; // Add this
  fetchInvoiceById: (id: string) => Promise<Invoice>; // Add this
}

export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  
  if (!context) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }

  // No need to redefine these as they're already in the context
  // Just return the context as is - any additional functionality
  // has already been added in the context provider

  return context;
};