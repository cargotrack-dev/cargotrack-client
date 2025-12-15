// src/features/Invoices/types/invoice.ts

export enum InvoiceStatus {
    DRAFT = 'draft',
    PENDING = 'pending',
    PAID = 'paid',
    OVERDUE = 'overdue',
    CANCELLED = 'cancelled',
    PARTIALLY_PAID = 'partially_paid'
}

export enum PaymentMethod {
    CASH = 'cash',
    CREDIT_CARD = 'credit_card',
    BANK_TRANSFER = 'bank_transfer',
    CHECK = 'check',
    PAYPAL = 'paypal',
    OTHER = 'other'
}

export enum TaxType {
    PERCENTAGE = 'percentage',
    FIXED = 'fixed'
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
    type: TaxType;
    rate: number; // Either percentage (0-100) or fixed amount
    amount: number;
}

export interface DiscountItem {
    id: string;
    name: string;
    type: TaxType; // Using same type as tax for simplicity
    rate: number; // Either percentage (0-100) or fixed amount
    amount: number;
}

export interface PaymentRecord {
    id: string;
    date: string;
    amount: number;
    method: PaymentMethod;
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

// Constants for status color coding and labels
export const INVOICE_STATUS_COLORS = {
    [InvoiceStatus.DRAFT]: 'bg-gray-200',
    [InvoiceStatus.PENDING]: 'bg-blue-200',
    [InvoiceStatus.PAID]: 'bg-green-200',
    [InvoiceStatus.OVERDUE]: 'bg-red-200',
    [InvoiceStatus.CANCELLED]: 'bg-red-500',
    [InvoiceStatus.PARTIALLY_PAID]: 'bg-yellow-200'
};

export const INVOICE_STATUS_LABELS = {
    [InvoiceStatus.DRAFT]: 'Draft',
    [InvoiceStatus.PENDING]: 'Pending',
    [InvoiceStatus.PAID]: 'Paid',
    [InvoiceStatus.OVERDUE]: 'Overdue',
    [InvoiceStatus.CANCELLED]: 'Cancelled',
    [InvoiceStatus.PARTIALLY_PAID]: 'Partially Paid'
};

export const PAYMENT_METHOD_LABELS = {
    [PaymentMethod.CASH]: 'Cash',
    [PaymentMethod.CREDIT_CARD]: 'Credit Card',
    [PaymentMethod.BANK_TRANSFER]: 'Bank Transfer',
    [PaymentMethod.CHECK]: 'Check',
    [PaymentMethod.PAYPAL]: 'PayPal',
    [PaymentMethod.OTHER]: 'Other'
};

export interface EmailData {
    to: string;
    subject: string;
    message: string;
    attachPdf: boolean;
};

export const DEFAULT_TAX_RATES = [
    { id: 'tax-1', name: 'Sales Tax', type: TaxType.PERCENTAGE, rate: 8.5 },
    { id: 'tax-2', name: 'Service Fee', type: TaxType.FIXED, rate: 25 }
];

export const DEFAULT_INVOICE_TERMS = `
  Payment is due within 30 days of the invoice date.
  Late payments are subject to a 5% fee.
  Please include the invoice number with your payment.
  `;