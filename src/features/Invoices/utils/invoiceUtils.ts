// src/features/Invoices/utils/invoiceUtils.ts
import { Invoice, InvoiceItem, InvoiceStatus } from '../types/invoice';

/**
 * Calculate invoice total amount
 */
export const calculateInvoiceTotal = (items: InvoiceItem[]): number => {
  return items.reduce((total, item) => {
    const itemTotal = item.quantity * item.unitPrice;
    return total + itemTotal;
  }, 0);
};

/**
 * Calculate tax amount based on total and tax rate
 */
export const calculateTax = (total: number, taxRate: number): number => {
  return total * (taxRate / 100);
};

/**
 * Format currency amount with proper symbol and decimals
 */
export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Get human-readable status label
 */
export const getStatusLabel = (status: InvoiceStatus): string => {
  // Adjust these keys to match your actual InvoiceStatus enum values
  const statusMap: Record<string, string> = {
    DRAFT: 'Draft',
    PENDING: 'Pending Payment',
    PAID: 'Paid',
    OVERDUE: 'Overdue',
    CANCELLED: 'Cancelled',
    PARTIALLY_PAID: 'Partially Paid'
  };
  
  return statusMap[status] || 'Unknown';
};

/**
 * Get status color for UI elements
 */
export const getStatusColor = (status: InvoiceStatus): string => {
  // Adjust these keys to match your actual InvoiceStatus enum values
  const colorMap: Record<string, string> = {
    DRAFT: 'gray',
    PENDING: 'amber',
    PAID: 'green',
    OVERDUE: 'red',
    CANCELLED: 'slate',
    PARTIALLY_PAID: 'blue'
  };
  
  return colorMap[status] || 'gray';
};

/**
 * Check if invoice is overdue based on dueDate
 */
export const isInvoiceOverdue = (invoice: Invoice): boolean => {
  // Adjust the condition to match your enum values
  if (invoice.status === InvoiceStatus.PAID || 
      invoice.status === InvoiceStatus.CANCELLED) {
    return false;
  }
  
  const today = new Date();
  const dueDate = new Date(invoice.dueDate);
  return today > dueDate;
};

/**
 * Generate invoice reference number
 */
export const generateInvoiceNumber = (prefix = 'INV', id?: string): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const randomPart = id ? id.substring(0, 6) : Math.random().toString(36).substring(2, 8).toUpperCase();
  
  return `${prefix}-${year}${month}-${randomPart}`;
};

/**
 * Validate email format
 * @param email Email address to validate
 * @returns Boolean indicating if the email format is valid
 */
export const isValidEmail = (email: string): boolean => {
  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};