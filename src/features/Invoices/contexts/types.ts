// src/contexts/invoice/types.ts
import {
    Invoice,
    InvoiceItem,
    PaymentRecord
} from '@features/Invoices/types/invoice';

export interface WaybillAdditionalCharge {
    description: string;
    amount: number;
}

export interface InvoiceContextProps {
    invoices: Invoice[];
    loadInvoices: () => Promise<void>;
    getInvoice: (id: string) => Invoice | undefined;
    createInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Invoice>;
    updateInvoice: (id: string, updates: Partial<Invoice>) => Promise<Invoice>;
    deleteInvoice: (id: string) => Promise<void>;
    addInvoiceItem: (invoiceId: string, item: Omit<InvoiceItem, 'id'>) => Promise<Invoice>;
    updateInvoiceItem: (invoiceId: string, itemId: string, updates: Partial<InvoiceItem>) => Promise<Invoice>;
    removeInvoiceItem: (invoiceId: string, itemId: string) => Promise<Invoice>;
    addPayment: (invoiceId: string, payment: Omit<PaymentRecord, 'id'>) => Promise<Invoice>;
    generateInvoiceNumber: () => Promise<string>;
    generateInvoiceFromWaybill: (waybillId: string) => Promise<Invoice>;
    isLoading: boolean;
    error: string | null;
}