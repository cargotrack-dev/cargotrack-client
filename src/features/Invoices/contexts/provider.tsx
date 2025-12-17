// src/contexts/invoice/provider.tsx
import React, { useState, useCallback, useEffect } from 'react';
import {
    Invoice,
    InvoiceStatus,
    InvoiceItem,
    TaxItem,
    DiscountItem,
    PaymentRecord,
    DEFAULT_INVOICE_TERMS,
    TaxType,
    PaymentMethod,

} from '../types/invoice';
import { useToast } from '../../UI/components/ui/toast/useToast'; // Direct import
import { InvoiceContext } from './context';
import { WaybillAdditionalCharge } from './types';

// Helper function to generate unique IDs
const generateId = (): string => {
    return Math.random().toString(36).substr(2, 9);
};

// Mock data for invoices while API is in development
const mockInvoices: Invoice[] = [
    {
        id: '1',
        invoiceNumber: 'INV-2025-0001',
        clientId: 'client-1',
        clientName: 'Acme Corporation',
        clientContact: 'John Smith',
        clientEmail: 'john@acme.com',
        clientAddress: '123 Main St, New York, NY 10001',
        clientPhone: '555-123-4567',
        issueDate: '2025-01-15',
        dueDate: '2025-02-15',
        items: [
            {
                id: 'item-1',
                description: 'Transportation Services - Route A',
                quantity: 1,
                unitPrice: 1200,
                amount: 1200,
                taxable: true
            },
            {
                id: 'item-2',
                description: 'Loading/Unloading',
                quantity: 2,
                unitPrice: 150,
                amount: 300,
                taxable: true
            }
        ],
        taxes: [
            {
                id: 'tax-1',
                name: 'Sales Tax',
                type: TaxType.PERCENTAGE,
                rate: 8.5,
                amount: 127.5
            }
        ],
        discounts: [],
        payments: [],
        notes: 'Please include invoice number in payment reference',
        terms: DEFAULT_INVOICE_TERMS,
        subtotal: 1500,
        taxTotal: 127.5,
        discountTotal: 0,
        total: 1627.5,
        balance: 1627.5,
        status: InvoiceStatus.PENDING,
        createdAt: '2025-01-15T12:00:00Z',
        updatedAt: '2025-01-15T12:00:00Z',
        createdBy: 'user-1',
        currency: 'USD'
    },
    {
        id: '2',
        invoiceNumber: 'INV-2025-0002',
        clientId: 'client-2',
        clientName: 'Globex Industries',
        clientContact: 'Jane Doe',
        clientEmail: 'jane@globex.com',
        clientAddress: '456 Commerce Ave, Chicago, IL 60601',
        clientPhone: '555-987-6543',
        issueDate: '2025-01-20',
        dueDate: '2025-02-20',
        items: [
            {
                id: 'item-3',
                description: 'Expedited Shipping - Route B',
                quantity: 1,
                unitPrice: 2200,
                amount: 2200,
                taxable: true,
                waybillId: 'waybill-1'
            }
        ],
        taxes: [
            {
                id: 'tax-2',
                name: 'Sales Tax',
                type: TaxType.PERCENTAGE,
                rate: 8.5,
                amount: 187
            }
        ],
        discounts: [],
        payments: [
            {
                id: 'payment-1',
                date: '2025-01-25',
                amount: 2387,
                method: PaymentMethod.CREDIT_CARD,
                reference: 'PYMT-25012025'
            }
        ],
        notes: '',
        terms: DEFAULT_INVOICE_TERMS,
        subtotal: 2200,
        taxTotal: 187,
        discountTotal: 0,
        total: 2387,
        balance: 0,
        status: InvoiceStatus.PAID,
        createdAt: '2025-01-20T14:30:00Z',
        updatedAt: '2025-01-25T09:15:00Z',
        createdBy: 'user-1',
        currency: 'USD'
    },
    {
        id: '3',
        invoiceNumber: 'INV-2025-0003',
        clientId: 'client-1',
        clientName: 'Acme Corporation',
        clientContact: 'John Smith',
        clientEmail: 'john@acme.com',
        clientAddress: '123 Main St, New York, NY 10001',
        clientPhone: '555-123-4567',
        issueDate: '2025-01-10',
        dueDate: '2025-01-25',
        items: [
            {
                id: 'item-4',
                description: 'Standard Shipping - Route C',
                quantity: 1,
                unitPrice: 900,
                amount: 900,
                taxable: true,
                waybillId: 'waybill-2'
            },
            {
                id: 'item-5',
                description: 'Insurance',
                quantity: 1,
                unitPrice: 100,
                amount: 100,
                taxable: false
            }
        ],
        taxes: [
            {
                id: 'tax-3',
                name: 'Sales Tax',
                type: TaxType.PERCENTAGE,
                rate: 8.5,
                amount: 76.5
            }
        ],
        discounts: [],
        payments: [],
        notes: '',
        terms: DEFAULT_INVOICE_TERMS,
        subtotal: 1000,
        taxTotal: 76.5,
        discountTotal: 0,
        total: 1076.5,
        balance: 1076.5,
        status: InvoiceStatus.OVERDUE,
        createdAt: '2025-01-10T11:45:00Z',
        updatedAt: '2025-01-10T11:45:00Z',
        createdBy: 'user-1',
        currency: 'USD'
    },
    {
        id: '4',
        invoiceNumber: 'INV-2025-0004',
        clientId: 'client-3',
        clientName: 'Oceanic Shipping',
        clientContact: 'Robert Brown',
        clientEmail: 'robert@oceanic.com',
        clientAddress: '789 Seaside Blvd, Miami, FL 33101',
        clientPhone: '555-789-0123',
        issueDate: '2025-01-25',
        dueDate: '2025-02-25',
        items: [
            {
                id: 'item-6',
                description: 'Container Transport',
                quantity: 2,
                unitPrice: 1800,
                amount: 3600,
                taxable: true,
                waybillId: 'waybill-3'
            },
            {
                id: 'item-7',
                description: 'Customs Processing',
                quantity: 1,
                unitPrice: 400,
                amount: 400,
                taxable: true
            }
        ],
        taxes: [
            {
                id: 'tax-4',
                name: 'Sales Tax',
                type: TaxType.PERCENTAGE,
                rate: 7,
                amount: 280
            }
        ],
        discounts: [
            {
                id: 'discount-1',
                name: 'Loyalty Discount',
                type: TaxType.PERCENTAGE,
                rate: 5,
                amount: 200
            }
        ],
        payments: [
            {
                id: 'payment-2',
                date: '2025-01-27',
                amount: 2000,
                method: PaymentMethod.BANK_TRANSFER,
                reference: 'BT-27012025'
            }
        ],
        notes: 'Regular client - applies for loyalty discount',
        terms: DEFAULT_INVOICE_TERMS,
        subtotal: 4000,
        taxTotal: 280,
        discountTotal: 200,
        total: 4080,
        balance: 2080,
        status: InvoiceStatus.PARTIALLY_PAID,
        createdAt: '2025-01-25T16:20:00Z',
        updatedAt: '2025-01-27T10:30:00Z',
        createdBy: 'user-2',
        currency: 'USD'
    },
    {
        id: '5',
        invoiceNumber: 'INV-2025-0005',
        clientId: 'client-2',
        clientName: 'Globex Industries',
        clientContact: 'Jane Doe',
        clientEmail: 'jane@globex.com',
        clientAddress: '456 Commerce Ave, Chicago, IL 60601',
        clientPhone: '555-987-6543',
        issueDate: '2025-01-28',
        dueDate: '2025-02-28',
        items: [
            {
                id: 'item-8',
                description: 'Transport Services (Draft)',
                quantity: 1,
                unitPrice: 1500,
                amount: 1500,
                taxable: true
            }
        ],
        taxes: [
            {
                id: 'tax-5',
                name: 'Sales Tax',
                type: TaxType.PERCENTAGE,
                rate: 8.5,
                amount: 127.5
            }
        ],
        discounts: [],
        payments: [],
        notes: 'Draft invoice - pending client approval',
        terms: DEFAULT_INVOICE_TERMS,
        subtotal: 1500,
        taxTotal: 127.5,
        discountTotal: 0,
        total: 1627.5,
        balance: 1627.5,
        status: InvoiceStatus.DRAFT,
        createdAt: '2025-01-28T09:00:00Z',
        updatedAt: '2025-01-28T09:00:00Z',
        createdBy: 'user-1',
        currency: 'USD'
    }
];

// Your helper functions and implementation
export const InvoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { addToast } = useToast();

    // Wrap loadInvoices in useCallback to use as a dependency in useEffect
    const loadInvoices = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // In a real app, this would be an API call
            // For now, we'll simulate with mock data
            // Comment out the API call for now
            // const response = await fetch('/api/invoices');
            // const data = await response.json();
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
            setInvoices(mockInvoices);
        } catch (err) {
            console.error('Failed to load invoices:', err);
            setError('Failed to load invoices. Please try again.');
            addToast({
                title: 'Error',
                description: 'Failed to load invoices data',
                variant: 'destructive'
            });
        } finally {
            setIsLoading(false);
        }
    }, [addToast]);

    // Get a single invoice by ID
    const getInvoice = (id: string) => {
        return invoices.find(invoice => invoice.id === id);
    };

    // Calculate invoice totals
    const calculateInvoiceTotals = (
        items: InvoiceItem[],
        taxes: TaxItem[],
        discounts: DiscountItem[]
    ) => {
        // Calculate subtotal
        const subtotal = items.reduce((sum, item) => sum + item.amount, 0);

        // Calculate taxable amount (sum of taxable items)
        const taxableAmount = items
            .filter(item => item.taxable)
            .reduce((sum, item) => sum + item.amount, 0);

        // Calculate taxes
        let taxTotal = 0;
        const updatedTaxes = taxes.map(tax => {
            let taxAmount = 0;
            if (tax.type === 'percentage') {
                taxAmount = (taxableAmount * tax.rate) / 100;
            } else {
                taxAmount = tax.rate;
            }
            taxTotal += taxAmount;
            return { ...tax, amount: taxAmount };
        });

        // Calculate discounts
        let discountTotal = 0;
        const updatedDiscounts = discounts.map(discount => {
            let discountAmount = 0;
            if (discount.type === 'percentage') {
                discountAmount = (subtotal * discount.rate) / 100;
            } else {
                discountAmount = discount.rate;
            }
            discountTotal += discountAmount;
            return { ...discount, amount: discountAmount };
        });

        // Calculate total and balance
        const total = subtotal + taxTotal - discountTotal;

        return {
            subtotal,
            taxTotal,
            discountTotal,
            total,
            updatedTaxes,
            updatedDiscounts
        };
    };

    // Create a new invoice
    const createInvoice = async (
        invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>
    ): Promise<Invoice> => {
        setIsLoading(true);
        setError(null);
        try {
            // In a real app, this would be an API call
            // For now, we'll simulate
            const now = new Date().toISOString();

            // Calculate totals
            const {
                subtotal,
                taxTotal,
                discountTotal,
                total,
                updatedTaxes,
                updatedDiscounts
            } = calculateInvoiceTotals(
                invoiceData.items,
                invoiceData.taxes,
                invoiceData.discounts
            );

            // Calculate balance (total - sum of payments)
            const paymentsTotal = invoiceData.payments.reduce((sum, payment) => sum + payment.amount, 0);
            const balance = total - paymentsTotal;

            // Determine status based on balance and dates
            let status = invoiceData.status;
            if (status === InvoiceStatus.PENDING) {
                if (balance <= 0) {
                    status = InvoiceStatus.PAID;
                } else if (balance < total) {
                    status = InvoiceStatus.PARTIALLY_PAID;
                } else if (new Date(invoiceData.dueDate) < new Date()) {
                    status = InvoiceStatus.OVERDUE;
                }
            }

            const newInvoice: Invoice = {
                ...invoiceData,
                id: `invoice-${generateId()}`,
                createdAt: now,
                updatedAt: now,
                subtotal,
                taxTotal,
                discountTotal,
                total,
                balance,
                status,
                taxes: updatedTaxes,
                discounts: updatedDiscounts
            };

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            // Update local state
            setInvoices(prev => [...prev, newInvoice]);

            addToast({
                title: 'Invoice Created',
                description: `Invoice #${newInvoice.invoiceNumber} has been created successfully`,
                variant: 'default'
            });

            return newInvoice;
        } catch (err) {
            console.error('Failed to create invoice:', err);
            setError('Failed to create invoice. Please try again.');
            addToast({
                title: 'Error',
                description: 'Failed to create invoice',
                variant: 'destructive'
            });
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Update an existing invoice
    const updateInvoice = async (
        id: string,
        updates: Partial<Invoice>
    ): Promise<Invoice> => {
        setIsLoading(true);
        setError(null);
        try {
            // Find the invoice to update
            const invoiceToUpdate = invoices.find(i => i.id === id);
            if (!invoiceToUpdate) {
                throw new Error('Invoice not found');
            }

            // Prepare updated invoice data
            const updatedInvoice = {
                ...invoiceToUpdate,
                ...updates,
                updatedAt: new Date().toISOString()
            };

            // Recalculate totals if necessary
            if (updates.items || updates.taxes || updates.discounts) {
                const items = updates.items || invoiceToUpdate.items;
                const taxes = updates.taxes || invoiceToUpdate.taxes;
                const discounts = updates.discounts || invoiceToUpdate.discounts;

                const {
                    subtotal,
                    taxTotal,
                    discountTotal,
                    total,
                    updatedTaxes,
                    updatedDiscounts
                } = calculateInvoiceTotals(items, taxes, discounts);

                // Update calculated fields
                updatedInvoice.subtotal = subtotal;
                updatedInvoice.taxTotal = taxTotal;
                updatedInvoice.discountTotal = discountTotal;
                updatedInvoice.total = total;
                updatedInvoice.taxes = updatedTaxes;
                updatedInvoice.discounts = updatedDiscounts;
            }

            // Recalculate balance and status if payments were updated
            if (updates.payments) {
                const paymentsTotal = updatedInvoice.payments.reduce((sum, payment) => sum + payment.amount, 0);
                updatedInvoice.balance = updatedInvoice.total - paymentsTotal;

                // Update status based on balance and dates
                if (updatedInvoice.balance <= 0) {
                    updatedInvoice.status = InvoiceStatus.PAID;
                } else if (updatedInvoice.balance < updatedInvoice.total) {
                    updatedInvoice.status = InvoiceStatus.PARTIALLY_PAID;
                } else if (new Date(updatedInvoice.dueDate) < new Date() && updatedInvoice.status !== InvoiceStatus.DRAFT) {
                    updatedInvoice.status = InvoiceStatus.OVERDUE;
                }
            }

            // If status is directly updated, respect that
            if (updates.status) {
                updatedInvoice.status = updates.status;
            }

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            // Update local state
            setInvoices(prev => prev.map(i => i.id === id ? updatedInvoice : i));

            addToast({
                title: 'Invoice Updated',
                description: `Invoice #${updatedInvoice.invoiceNumber} has been updated successfully`,
                variant: 'default'
            });

            return updatedInvoice;
        } catch (err) {
            console.error('Failed to update invoice:', err);
            setError('Failed to update invoice. Please try again.');
            addToast({
                title: 'Error',
                description: 'Failed to update invoice',
                variant: 'destructive'
            });
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Delete an invoice
    const deleteInvoice = async (id: string): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            // In a real app, this would be an API call
            // For now, we'll simulate
            await new Promise(resolve => setTimeout(resolve, 500));

            // Update local state
            setInvoices(prev => prev.filter(i => i.id !== id));

            addToast({
                title: 'Invoice Deleted',
                description: 'The invoice has been deleted successfully',
                variant: 'default'
            });
        } catch (err) {
            console.error('Failed to delete invoice:', err);
            setError('Failed to delete invoice. Please try again.');
            addToast({
                title: 'Error',
                description: 'Failed to delete invoice',
                variant: 'destructive'
            });
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Add an item to an invoice
    const addInvoiceItem = async (
        invoiceId: string,
        newItem: Omit<InvoiceItem, 'id'>
    ): Promise<Invoice> => {
        // Find the invoice
        const invoice = invoices.find(i => i.id === invoiceId);
        if (!invoice) {
            throw new Error('Invoice not found');
        }

        // Create the new item with ID
        const item: InvoiceItem = {
            ...newItem,
            id: `item-${generateId()}`
        };

        // Update the invoice with the new item
        const updatedItems = [...invoice.items, item];
        return updateInvoice(invoiceId, { items: updatedItems });
    };

    // Update an item in an invoice
    const updateInvoiceItem = async (
        invoiceId: string,
        itemId: string,
        updates: Partial<InvoiceItem>
    ): Promise<Invoice> => {
        // Find the invoice
        const invoice = invoices.find(i => i.id === invoiceId);
        if (!invoice) {
            throw new Error('Invoice not found');
        }

        // Find and update the item
        const updatedItems = invoice.items.map(item => {
            if (item.id === itemId) {
                // Make sure amount is calculated correctly if quantity or unitPrice changes
                let amount = item.amount;
                if (updates.quantity !== undefined || updates.unitPrice !== undefined) {
                    const quantity = updates.quantity ?? item.quantity;
                    const unitPrice = updates.unitPrice ?? item.unitPrice;
                    amount = quantity * unitPrice;
                }

                return {
                    ...item,
                    ...updates,
                    amount
                };
            }
            return item;
        });

        // Update the invoice with the updated items
        return updateInvoice(invoiceId, { items: updatedItems });
    };

    // Remove an item from an invoice
    const removeInvoiceItem = async (
        invoiceId: string,
        itemId: string
    ): Promise<Invoice> => {
        // Find the invoice
        const invoice = invoices.find(i => i.id === invoiceId);
        if (!invoice) {
            throw new Error('Invoice not found');
        }

        // Remove the item
        const updatedItems = invoice.items.filter(item => item.id !== itemId);

        // Update the invoice without the removed item
        return updateInvoice(invoiceId, { items: updatedItems });
    };

    // Add a payment to an invoice
    const addPayment = async (
        invoiceId: string,
        newPayment: Omit<PaymentRecord, 'id'>
    ): Promise<Invoice> => {
        // Find the invoice
        const invoice = invoices.find(i => i.id === invoiceId);
        if (!invoice) {
            throw new Error('Invoice not found');
        }

        // Create the new payment with ID
        const payment: PaymentRecord = {
            ...newPayment,
            id: `payment-${generateId()}`
        };

        // Update the invoice with the new payment
        const updatedPayments = [...invoice.payments, payment];
        return updateInvoice(invoiceId, { payments: updatedPayments });
    };

    // Generate a new invoice number
    const generateInvoiceNumber = async (): Promise<string> => {
        // In a real app, this would be an API call to ensure uniqueness
        // For now, we'll generate a simple number based on the current count plus a random element
        const prefix = 'INV';
        const date = new Date().toISOString().slice(2, 7).replace('-', ''); // YY-MM -> YYMM
        const count = (invoices.length + 1).toString().padStart(4, '0');
        const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');

        return `${prefix}-${date}-${count}-${random}`;
    };

    // Generate an invoice from a waybill
    const generateInvoiceFromWaybill = async (waybillId: string): Promise<Invoice> => {
        setIsLoading(true);
        setError(null);
        try {
            // Instead of fetching from API, use mock data
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

            // Mock waybill data for development
            const waybill = {
                id: waybillId,
                clientId: 'client-1',
                origin: 'New York',
                destination: 'Los Angeles',
                client: {
                    name: 'Acme Corporation',
                    contactPerson: 'John Smith',
                    email: 'john@acme.com',
                    address: '123 Main St, New York, NY 10001',
                    phone: '555-123-4567'
                },
                pricing: {
                    baseRate: 1500,
                    currency: 'USD',
                    additionalCharges: [
                        { description: 'Express Handling', amount: 200 },
                        { description: 'Insurance', amount: 150 }
                    ]
                }
            };

            // Generate invoice number
            const invoiceNumber = await generateInvoiceNumber();

            // Create invoice items from waybill data
            const items: Omit<InvoiceItem, 'id'>[] = [
                {
                    description: `Freight charges for shipment from ${waybill.origin} to ${waybill.destination}`,
                    quantity: 1,
                    unitPrice: waybill.pricing.baseRate,
                    amount: waybill.pricing.baseRate,
                    taxable: true,
                    waybillId: waybillId
                }
            ];

            // Add additional charges as separate items
            if (waybill.pricing.additionalCharges && Array.isArray(waybill.pricing.additionalCharges)) {
                waybill.pricing.additionalCharges.forEach((charge: WaybillAdditionalCharge) => {
                    items.push({
                        description: charge.description,
                        quantity: 1,
                        unitPrice: charge.amount,
                        amount: charge.amount,
                        taxable: true,
                        waybillId: waybillId
                    });
                });
            }

            // Calculate due date (30 days from now by default)
            const today = new Date();
            const dueDate = new Date(today);
            dueDate.setDate(today.getDate() + 30);

            // Create the invoice data
            const invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'> = {
                invoiceNumber,
                clientId: waybill.clientId,
                clientName: waybill.client.name,
                clientContact: waybill.client.contactPerson,
                clientEmail: waybill.client.email,
                clientAddress: waybill.client.address || 'Address not provided',
                clientPhone: waybill.client.phone,
                issueDate: today.toISOString(),
                dueDate: dueDate.toISOString(),
                items: items.map(item => ({ ...item, id: `item-${generateId()}` })),
                taxes: [
                    {
                        id: `tax-${generateId()}`,
                        name: 'Sales Tax',
                        type: 'percentage' as TaxType,
                        rate: 8.5,
                        amount: 0 // Will be calculated in createInvoice
                    }
                ],
                discounts: [],
                payments: [],
                notes: `Invoice for waybill ${waybillId}. Shipment from ${waybill.origin} to ${waybill.destination}.`,
                terms: DEFAULT_INVOICE_TERMS,
                subtotal: 0, // Will be calculated in createInvoice
                taxTotal: 0, // Will be calculated in createInvoice
                discountTotal: 0, // Will be calculated in createInvoice
                total: 0, // Will be calculated in createInvoice
                balance: 0, // Will be calculated in createInvoice
                status: InvoiceStatus.DRAFT,
                createdBy: 'Current User', // In a real app, get from auth context
                currency: waybill.pricing.currency
            };

            // Create the invoice
            return createInvoice(invoiceData);
        } catch (err) {
            console.error('Failed to generate invoice from waybill:', err);
            setError('Failed to generate invoice from waybill. Please try again.');
            addToast({
                title: 'Error',
                description: 'Failed to generate invoice from waybill',
                variant: 'destructive'
            });
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Load invoices on mount
    useEffect(() => {
        loadInvoices();
    }, [loadInvoices]);

    return (
        <InvoiceContext.Provider
            value={{
                invoices,
                loadInvoices,
                getInvoice,
                createInvoice,
                updateInvoice,
                deleteInvoice,
                addInvoiceItem,
                updateInvoiceItem,
                removeInvoiceItem,
                addPayment,
                generateInvoiceNumber,
                generateInvoiceFromWaybill,
                isLoading,
                error
            }}
        >
            {children}
        </InvoiceContext.Provider>
    );
};