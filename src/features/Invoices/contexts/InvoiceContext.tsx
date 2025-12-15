// src/features/Invoices/contexts/InvoiceContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { shipmentsAPI } from '../services/api/shipmentsAPI';

// Define Invoice types inline to avoid import errors
enum InvoiceStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
  PARTIALLY_PAID = 'partially_paid'
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
  type: string; // Use string instead of enum for compatibility
  rate: number;
  amount: number;
}

export interface DiscountItem {
  id: string;
  name: string;
  type: string; // Use string instead of enum for compatibility
  rate: number;
  amount: number;
}

/**
 * Interface for payment record
 */
export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  method: string;
  reference?: string;
  notes?: string;
}

interface InvoiceContextType {
  invoices: Invoice[];
  isLoading: boolean;
  error: string | null;
  loadInvoices: () => Promise<void>;
  getInvoice: (id: string) => Invoice | undefined;
  createInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Invoice>;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => Promise<Invoice>;
  deleteInvoice: (id: string) => Promise<boolean>;
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => Promise<Invoice>;
  generateInvoiceNumber: () => Promise<string>;
  recordPayment: (invoiceId: string, payment: {
    amount: number;
    method: string;
    date: string;
    reference?: string;
    notes?: string;
  }) => Promise<Invoice>;

  // Add these new properties
  loading: boolean;                            // Alias for isLoading
  selectedInvoice: Invoice | null;             // Currently selected invoice
  fetchInvoiceById: (id: string) => Promise<Invoice>; // Method to fetch a specific invoice
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

// Export the context for the hook to use
export { InvoiceContext };

export const InvoiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const fetchInvoiceById = async (id: string): Promise<Invoice> => {
    try {
      setIsLoading(true);
      const response = await shipmentsAPI.get<Invoice>(`/invoices/${id}`);
      const invoice = response.data as Invoice;
      setSelectedInvoice(invoice);
      return invoice;
    } catch (err) {
      setError(`Failed to fetch invoice ${id}`);
      console.error(`Error fetching invoice ${id}:`, err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Load invoices from API
  const loadInvoices = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      // Replace with actual API call
      const response = await shipmentsAPI.get<Invoice[]>('/invoices');
      // Type assertion to make TypeScript happy
      const invoicesData: Invoice[] = Array.isArray(response.data) ? response.data : [];
      setInvoices(invoicesData);
    } catch (err) {
      setError('Failed to load invoices');
      console.error('Error loading invoices:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Get single invoice by ID
  const getInvoice = (id: string): Invoice | undefined => {
    return invoices.find(invoice => invoice.id === id);
  };

  // Create new invoice
  const createInvoice = async (invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<Invoice> => {
    try {
      setIsLoading(true);
      // Replace with actual API call
      const response = await shipmentsAPI.post<Invoice, typeof invoiceData>('/invoices', invoiceData);
      // Type assertion with validation
      const newInvoice: Invoice = response.data as Invoice;
      setInvoices(prev => [...prev, newInvoice] as Invoice[]);
      return newInvoice;
    } catch (err) {
      setError('Failed to create invoice');
      console.error('Error creating invoice:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update invoice
  const updateInvoice = async (id: string, invoiceData: Partial<Invoice>): Promise<Invoice> => {
    try {
      setIsLoading(true);
      // Replace with actual API call
      const response = await shipmentsAPI.put<Invoice, typeof invoiceData>(`/invoices/${id}`, invoiceData);
      // Type assertion with validation
      const updatedInvoice: Invoice = response.data as Invoice;
      setInvoices(prev =>
        prev.map(invoice => invoice.id === id ? updatedInvoice : invoice) as Invoice[]
      );
      return updatedInvoice;
    } catch (err) {
      setError('Failed to update invoice');
      console.error('Error updating invoice:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete invoice
  const deleteInvoice = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      // Replace with actual API call
      await shipmentsAPI.delete<void>(`/invoices/${id}`);
      setInvoices(prev => prev.filter(invoice => invoice.id !== id));
      return true;
    } catch (err) {
      setError('Failed to delete invoice');
      console.error('Error deleting invoice:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Update invoice status
  const updateInvoiceStatus = async (id: string, status: InvoiceStatus): Promise<Invoice> => {
    return updateInvoice(id, { status });
  };

  // Record payment for invoice
  const recordPayment = async (
    invoiceId: string,
    payment: {
      amount: number;
      method: string;
      date: string;
      reference?: string;
      notes?: string;
    }
  ): Promise<Invoice> => {
    try {
      setIsLoading(true);
      // Replace with actual API call
      const response = await shipmentsAPI.post<Invoice, typeof payment>(`/invoices/${invoiceId}/payments`, payment);
      // Type assertion with validation
      const updatedInvoice: Invoice = response.data as Invoice;
      setInvoices(prev =>
        prev.map(invoice => invoice.id === invoiceId ? updatedInvoice : invoice) as Invoice[]
      );
      return updatedInvoice;
    } catch (err) {
      setError('Failed to record payment');
      console.error('Error recording payment:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Generate a unique invoice number
   * Implementation example:
   */
  const generateInvoiceNumber = async (): Promise<string> => {
    const prefix = 'INV';
    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${year}-${randomNum}`;
  };

  // Load invoices on component mount
  useEffect(() => {
    loadInvoices();
  }, []);

  return (
    <InvoiceContext.Provider value={{
      loading: isLoading, // Alias
      selectedInvoice,
      fetchInvoiceById,
      invoices,
      isLoading,
      error,
      loadInvoices,
      getInvoice,
      createInvoice,
      updateInvoice,
      deleteInvoice,
      updateInvoiceStatus,
      recordPayment,
      generateInvoiceNumber // Added the missing function here
    }}>
      {children}
    </InvoiceContext.Provider>
  );
};

// Export the hook in a separate file to avoid ESLint react-refresh warning