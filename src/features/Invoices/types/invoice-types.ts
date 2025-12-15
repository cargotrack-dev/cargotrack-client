// src/features/Invoices/types/invoice-types.ts

/**
 * Enum for invoice status values
 */
export enum InvoiceStatus {
    DRAFT = 'draft',
    PENDING = 'pending',
    PAID = 'paid',
    OVERDUE = 'overdue',
    CANCELLED = 'cancelled'
  }
  
  /**
   * Interface for invoice item
   */
  export interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
    taxable: boolean;
  }
  
  /**
   * Interface for tax item
   */
  export interface TaxItem {
    id: string;
    name: string;
    type: 'percentage' | 'fixed';
    rate: number;
    amount: number;
  }
  
  /**
   * Interface for discount item
   */
  export interface DiscountItem {
    id: string;
    name: string;
    type: 'percentage' | 'fixed';
    rate: number;  // Changed from 'value' to 'rate' to match InvoiceContext
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
  
  /**
   * Main Invoice interface
   */
  export interface Invoice {
    id: string;
    invoiceNumber: string;
    clientId: string;
    clientName: string;
    clientContact: string;
    clientEmail: string;
    clientAddress: string;
    clientPhone: string;
    issueDate: string;
    dueDate: string;
    status: InvoiceStatus;
    items: InvoiceItem[];
    subtotal: number;
    taxes: TaxItem[];
    taxTotal: number;
    discounts: DiscountItem[];
    discountTotal: number;
    total: number;
    balance: number;
    currency: string;
    terms: string;
    notes: string;
    payments: PaymentRecord[];
    createdBy: string;
    createdAt: string;
    updatedAt: string;
  }
  
  /**
   * Interface for form values type - this is used directly in the InvoiceForm component
   */
  export type FormValues = {
    invoiceNumber: string;
    clientId: string;
    clientName: string;
    clientContact: string;
    clientEmail: string;
    clientAddress: string;
    clientPhone: string;
    issueDate: string;
    dueDate: string;
    status: InvoiceStatus;
    items: InvoiceItem[];
    subtotal: number;
    taxRate: number;
    total: number;
    currency: string;
    terms: string;
    notes: string;
    payments: PaymentRecord[];
  }