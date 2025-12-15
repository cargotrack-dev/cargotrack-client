// src/services/mockInvoiceService.ts
import { 
    Invoice, 
    InvoiceStatus, 
    InvoiceItem, 
    TaxItem, 
    DiscountItem, 
    PaymentRecord,
    PaymentMethod,
    TaxType,
    DEFAULT_INVOICE_TERMS
  } from '../types/invoice';
  
  // Helper function to generate a random ID
  const generateId = () => {
    return Math.random().toString(36).substring(2, 15);
  };
  
  // Generate a random date within a range
  const randomDate = (start: Date, end: Date): Date => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  };
  
  // List of mock clients
  const mockClients = [
    { 
      id: 'client1', 
      name: 'Acme Corporation',
      contact: 'John Doe',
      email: 'john.doe@acme.com',
      address: '123 Main St, Suite 200, Anytown, CA 12345',
      phone: '(555) 123-4567'
    },
    { 
      id: 'client2', 
      name: 'TechNova Inc.',
      contact: 'Jane Smith',
      email: 'jane.smith@technova.com',
      address: '456 Park Ave, Floor 10, Metro City, NY 54321',
      phone: '(555) 987-6543'
    },
    { 
      id: 'client3', 
      name: 'Global Logistics Ltd.',
      contact: 'Robert Johnson',
      email: 'robert.j@globallogistics.com',
      address: '789 Harbor Blvd, Port City, FL 33456',
      phone: '(555) 456-7890'
    },
    { 
      id: 'client4', 
      name: 'Sunshine Distributors',
      contact: 'Maria Garcia',
      email: 'mgarcia@sunshinedist.com',
      address: '234 Desert Rd, Sunshine City, AZ 85123',
      phone: '(555) 234-5678'
    },
    { 
      id: 'client5', 
      name: 'Mountain Freight Co.',
      contact: 'David Lee',
      email: 'dlee@mountainfreight.com',
      address: '567 Ridge Way, Highland Town, CO 80123',
      phone: '(555) 345-6789'
    }
  ];
  
  // Generate common invoice items
  const generateInvoiceItems = (count: number): InvoiceItem[] => {
    const items: InvoiceItem[] = [];
    
    const commonServices = [
      { name: 'Freight - Standard Delivery', basePrice: 450 },
      { name: 'Freight - Express Delivery', basePrice: 850 },
      { name: 'Freight - Same Day Delivery', basePrice: 1200 },
      { name: 'Loading/Unloading Service', basePrice: 150 },
      { name: 'Packaging Materials', basePrice: 75 },
      { name: 'Warehouse Storage (per day)', basePrice: 50 },
      { name: 'Insurance Premium', basePrice: 125 },
      { name: 'Special Handling Fee', basePrice: 200 },
      { name: 'Fuel Surcharge', basePrice: 95 },
      { name: 'Customs Documentation', basePrice: 175 },
      { name: 'Temperature-Controlled Transport', basePrice: 350 },
      { name: 'After-Hours Delivery', basePrice: 300 }
    ];
    
    // Randomly select items
    const availableItems = [...commonServices];
    
    for (let i = 0; i < count; i++) {
      if (availableItems.length === 0) break;
      
      const randomIndex = Math.floor(Math.random() * availableItems.length);
      const item = availableItems.splice(randomIndex, 1)[0];
      
      const quantity = Math.floor(Math.random() * 3) + 1; // 1-3
      const unitPrice = item.basePrice * (0.9 + Math.random() * 0.2); // +/- 10% variation
      
      items.push({
        id: `item-${generateId()}`,
        description: item.name,
        quantity,
        unitPrice,
        amount: quantity * unitPrice,
        taxable: Math.random() > 0.2, // 80% chance of being taxable
        notes: Math.random() > 0.7 ? 'Special instructions apply' : undefined
      });
    }
    
    return items;
  };
  
  // Generate taxes for an invoice
  const generateTaxes = (): TaxItem[] => {
    const taxes: TaxItem[] = [];
    
    // Add sales tax (usually)
    if (Math.random() > 0.1) { // 90% chance
      taxes.push({
        id: `tax-${generateId()}`,
        name: 'Sales Tax',
        type: TaxType.PERCENTAGE,
        rate: 5 + Math.random() * 5, // 5-10%
        amount: 0 // Calculated later
      });
    }
    
    // Sometimes add service fee
    if (Math.random() > 0.7) { // 30% chance
      taxes.push({
        id: `tax-${generateId()}`,
        name: 'Service Fee',
        type: Math.random() > 0.5 ? TaxType.PERCENTAGE : TaxType.FIXED,
        rate: Math.random() > 0.5 ? 2 + Math.random() * 3 : 25 + Math.random() * 25, // 2-5% or $25-50
        amount: 0 // Calculated later
      });
    }
    
    return taxes;
  };
  
  // Generate discounts for an invoice
  const generateDiscounts = (): DiscountItem[] => {
    const discounts: DiscountItem[] = [];
    
    // Sometimes add a discount
    if (Math.random() > 0.7) { // 30% chance
      discounts.push({
        id: `discount-${generateId()}`,
        name: Math.random() > 0.5 ? 'Volume Discount' : 'Loyalty Discount',
        type: Math.random() > 0.3 ? TaxType.PERCENTAGE : TaxType.FIXED,
        rate: Math.random() > 0.3 ? 5 + Math.random() * 10 : 50 + Math.random() * 100, // 5-15% or $50-150
        amount: 0 // Calculated later
      });
    }
    
    return discounts;
  };
  
  // Generate payments for an invoice
  const generatePayments = (total: number, status: InvoiceStatus): PaymentRecord[] => {
    const payments: PaymentRecord[] = [];
    
    if (status === InvoiceStatus.PAID) {
      // Fully paid
      payments.push({
        id: `payment-${generateId()}`,
        date: new Date().toISOString(),
        amount: total,
        method: Object.values(PaymentMethod)[Math.floor(Math.random() * Object.values(PaymentMethod).length)],
        reference: `REF-${Math.floor(Math.random() * 10000)}`,
        notes: Math.random() > 0.7 ? 'Payment confirmed' : undefined
      });
    } else if (status === InvoiceStatus.PARTIALLY_PAID) {
      // Partially paid (40-80% of total)
      const paidAmount = total * (0.4 + Math.random() * 0.4);
      payments.push({
        id: `payment-${generateId()}`,
        date: new Date().toISOString(),
        amount: paidAmount,
        method: Object.values(PaymentMethod)[Math.floor(Math.random() * Object.values(PaymentMethod).length)],
        reference: `REF-${Math.floor(Math.random() * 10000)}`,
        notes: Math.random() > 0.7 ? 'Partial payment received' : undefined
      });
    }
    
    return payments;
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
      if (tax.type === TaxType.PERCENTAGE) {
        taxAmount = (taxableAmount * tax.rate) / 100;
      } else {
        taxAmount = tax.rate;
      }
      taxAmount = parseFloat(taxAmount.toFixed(2));
      taxTotal += taxAmount;
      return { ...tax, amount: taxAmount };
    });
    
    // Calculate discounts
    let discountTotal = 0;
    const updatedDiscounts = discounts.map(discount => {
      let discountAmount = 0;
      if (discount.type === TaxType.PERCENTAGE) {
        discountAmount = (subtotal * discount.rate) / 100;
      } else {
        discountAmount = discount.rate;
      }
      discountAmount = parseFloat(discountAmount.toFixed(2));
      discountTotal += discountAmount;
      return { ...discount, amount: discountAmount };
    });
    
    // Calculate total
    const total = parseFloat((subtotal + taxTotal - discountTotal).toFixed(2));
    
    return {
      subtotal,
      taxTotal,
      discountTotal,
      total,
      updatedTaxes,
      updatedDiscounts
    };
  };
  
  // Generate a mock invoice
  const generateMockInvoice = (index: number): Invoice => {
    // Set up date ranges
    const now = new Date();
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(now.getMonth() - 6);
    
    // Randomly determine invoice status
    const statusDistribution = [
      { status: InvoiceStatus.DRAFT, weight: 0.1 },       // 10%
      { status: InvoiceStatus.PENDING, weight: 0.3 },     // 30%
      { status: InvoiceStatus.PAID, weight: 0.3 },        // 30%
      { status: InvoiceStatus.PARTIALLY_PAID, weight: 0.1 }, // 10%
      { status: InvoiceStatus.OVERDUE, weight: 0.15 },    // 15%
      { status: InvoiceStatus.CANCELLED, weight: 0.05 }   // 5%
    ];
    
    let selectedStatus = InvoiceStatus.PENDING;
    const random = Math.random();
    let cumulativeWeight = 0;
    
    for (const { status, weight } of statusDistribution) {
      cumulativeWeight += weight;
      if (random < cumulativeWeight) {
        selectedStatus = status;
        break;
      }
    }
    
    // Select a random client
    const client = mockClients[Math.floor(Math.random() * mockClients.length)];
    
    // Generate random dates based on status
    let issueDate: Date;
    let dueDate: Date;
    
    if (selectedStatus === InvoiceStatus.DRAFT) {
      // Draft invoices can be recent
      issueDate = randomDate(new Date(now.setDate(now.getDate() - 14)), now);
      dueDate = new Date(issueDate);
      dueDate.setDate(issueDate.getDate() + 30);
    } else if (selectedStatus === InvoiceStatus.OVERDUE) {
      // Overdue invoices have past due dates
      issueDate = randomDate(sixMonthsAgo, new Date(now.setDate(now.getDate() - 45)));
      dueDate = new Date(issueDate);
      dueDate.setDate(issueDate.getDate() + 30);
    } else if (selectedStatus === InvoiceStatus.PAID) {
      // Paid invoices can be from any time
      issueDate = randomDate(sixMonthsAgo, now);
      dueDate = new Date(issueDate);
      dueDate.setDate(issueDate.getDate() + 30);
    } else {
      // Other statuses
      issueDate = randomDate(sixMonthsAgo, now);
      dueDate = new Date(issueDate);
      dueDate.setDate(issueDate.getDate() + 30);
    }
    
    // If we're overdue but the due date is in the future, adjust it
    if (selectedStatus === InvoiceStatus.OVERDUE && dueDate > now) {
      dueDate = new Date(now);
      dueDate.setDate(now.getDate() - Math.floor(Math.random() * 30) - 1);
    }
    
    // Generate items
    const items = generateInvoiceItems(Math.floor(Math.random() * 3) + 1); // 1-3 items
    
    // Generate taxes
    const taxes = generateTaxes();
    
    // Generate discounts
    const discounts = generateDiscounts();
    
    // Calculate totals
    const { 
      subtotal, 
      taxTotal, 
      discountTotal, 
      total, 
      updatedTaxes, 
      updatedDiscounts 
    } = calculateInvoiceTotals(items, taxes, discounts);
    
    // Generate payments
    const payments = generatePayments(total, selectedStatus);
    
    // Calculate balance
    const paymentsTotal = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const balance = parseFloat((total - paymentsTotal).toFixed(2));
    
    // Generate invoice number
    const prefix = 'INV';
    const dateCode = issueDate.toISOString().slice(2, 7).replace('-', ''); // YY-MM -> YYMM
    const count = (index + 1).toString().padStart(4, '0');
    const randomSuffix = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    const invoiceNumber = `${prefix}-${dateCode}-${count}-${randomSuffix}`;
    
    return {
      id: `invoice-${index + 1}`,
      invoiceNumber,
      clientId: client.id,
      clientName: client.name,
      clientContact: client.contact,
      clientEmail: client.email,
      clientAddress: client.address,
      clientPhone: client.phone,
      issueDate: issueDate.toISOString(),
      dueDate: dueDate.toISOString(),
      items,
      taxes: updatedTaxes,
      discounts: updatedDiscounts,
      payments,
      notes: Math.random() > 0.7 ? 'Thank you for your business.' : undefined,
      terms: DEFAULT_INVOICE_TERMS,
      subtotal,
      taxTotal,
      discountTotal,
      total,
      balance,
      status: selectedStatus,
      createdAt: new Date(issueDate.getTime() - Math.random() * 86400000 * 5).toISOString(), // 0-5 days before issue date
      updatedAt: new Date().toISOString(),
      createdBy: 'System User',
      currency: 'USD'
    };
  };
  
  // Generate a set of mock invoices
  export const generateMockInvoices = (count: number = 20): Invoice[] => {
    return Array.from({ length: count }, (_, i) => generateMockInvoice(i));
  };
  
  // Mock API functions
  
  // Simulate fetching invoices from API
  export const fetchInvoices = async (): Promise<Invoice[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate mock data
    const mockData = generateMockInvoices();
    
    return mockData;
  };
  
  // Simulate fetching an invoice by ID
  export const fetchInvoiceById = async (id: string): Promise<Invoice | null> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Generate mock data and find the invoice
    const mockData = generateMockInvoices();
    const invoice = mockData.find(invoice => invoice.id === id);
    
    return invoice || null;
  };
  
  // Simulate creating a new invoice
export const createInvoice = async (invoiceData: Partial<Invoice>): Promise<Invoice> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Create a new invoice with the provided data
    const now = new Date().toISOString();
    
    const newInvoice: Invoice = {
      id: `invoice-${generateId()}`,
      invoiceNumber: invoiceData.invoiceNumber || `INV-${now.slice(2, 7).replace('-', '')}-${Math.floor(Math.random() * 10000)}`,
      clientId: invoiceData.clientId || '',
      clientName: invoiceData.clientName || '',
      clientContact: invoiceData.clientContact || '',
      clientEmail: invoiceData.clientEmail || '',
      clientAddress: invoiceData.clientAddress || '',
      clientPhone: invoiceData.clientPhone,
      issueDate: invoiceData.issueDate || now,
      dueDate: invoiceData.dueDate || (() => {
        const date = new Date();
        date.setDate(date.getDate() + 30);
        return date.toISOString();
      })(),
      items: invoiceData.items || [],
      taxes: invoiceData.taxes || [],
      discounts: invoiceData.discounts || [],
      payments: invoiceData.payments || [],
      notes: invoiceData.notes,
      terms: invoiceData.terms || DEFAULT_INVOICE_TERMS,
      subtotal: invoiceData.subtotal || 0,
      taxTotal: invoiceData.taxTotal || 0,
      discountTotal: invoiceData.discountTotal || 0,
      total: invoiceData.total || 0,
      balance: invoiceData.balance || 0,
      status: invoiceData.status || InvoiceStatus.DRAFT,
      createdAt: now,
      updatedAt: now,
      createdBy: invoiceData.createdBy || 'System User',
      currency: invoiceData.currency || 'USD'
    };
    
    return newInvoice;
  };
  
  // Simulate updating an invoice
  export const updateInvoice = async (id: string, updates: Partial<Invoice>): Promise<Invoice> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate mock data and find the invoice
    const mockData = generateMockInvoices();
    const invoice = mockData.find(invoice => invoice.id === id);
    
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    
    // Update the invoice
    const updatedInvoice: Invoice = {
      ...invoice,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return updatedInvoice;
  };
  
  // Simulate deleting an invoice
  export const deleteInvoice = async (id: string): Promise<void> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // In a real app, this would delete the invoice from the database
    // For our mock service, we'll just simulate success
    const mockData = generateMockInvoices();
    const invoiceIndex = mockData.findIndex(invoice => invoice.id === id);
    
    if (invoiceIndex === -1) {
      throw new Error('Invoice not found');
    }
    
    // Successful deletion (no return value needed)
  };
  
  // Simulate adding a payment to an invoice
  export const addPaymentToInvoice = async (
    invoiceId: string, 
    payment: Omit<PaymentRecord, 'id'>
  ): Promise<Invoice> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate mock data and find the invoice
    const mockData = generateMockInvoices();
    const invoice = mockData.find(invoice => invoice.id === invoiceId);
    
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    
    // Add the payment
    const newPayment: PaymentRecord = {
      ...payment,
      id: `payment-${generateId()}`
    };
    
    const updatedPayments = [...invoice.payments, newPayment];
    
    // Calculate new balance
    const paymentsTotal = updatedPayments.reduce((sum, p) => sum + p.amount, 0);
    const newBalance = invoice.total - paymentsTotal;
    
    // Determine new status
    let newStatus = invoice.status;
    if (newBalance <= 0) {
      newStatus = InvoiceStatus.PAID;
    } else if (paymentsTotal > 0) {
      newStatus = InvoiceStatus.PARTIALLY_PAID;
    }
    
    // Update the invoice
    const updatedInvoice: Invoice = {
      ...invoice,
      payments: updatedPayments,
      balance: parseFloat(newBalance.toFixed(2)),
      status: newStatus,
      updatedAt: new Date().toISOString()
    };
    
    return updatedInvoice;
  };
  
  // Simulate generating an invoice from waybill data
  export const generateInvoiceFromWaybill = async (waybillId: string): Promise<Invoice> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate a mock waybill
    const mockWaybill = {
      id: waybillId,
      waybillNumber: `WB-${Math.floor(Math.random() * 10000)}`,
      client: mockClients[Math.floor(Math.random() * mockClients.length)],
      origin: 'Los Angeles, CA',
      destination: 'San Francisco, CA',
      pickupDate: new Date().toISOString(),
      deliveryDate: (() => {
        const date = new Date();
        date.setDate(date.getDate() + 3);
        return date.toISOString();
      })(),
      pricing: {
        baseRate: 850,
        additionalCharges: [
          { description: 'Fuel Surcharge', amount: 95 },
          { description: 'Insurance', amount: 75 }
        ],
        currency: 'USD'
      }
    };
    
    // Generate invoice items from waybill
    const items: InvoiceItem[] = [
      {
        id: `item-${generateId()}`,
        description: `Freight Charges (${mockWaybill.origin} to ${mockWaybill.destination})`,
        quantity: 1,
        unitPrice: mockWaybill.pricing.baseRate,
        amount: mockWaybill.pricing.baseRate,
        taxable: true,
        waybillId: waybillId
      },
      ...mockWaybill.pricing.additionalCharges.map(charge => ({
        id: `item-${generateId()}`,
        description: charge.description,
        quantity: 1,
        unitPrice: charge.amount,
        amount: charge.amount,
        taxable: true,
        waybillId: waybillId
      }))
    ];
    
    // Calculate subtotal
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    
    // Add default sales tax
    const taxes: TaxItem[] = [
      {
        id: `tax-${generateId()}`,
        name: 'Sales Tax',
        type: TaxType.PERCENTAGE,
        rate: 8.5,
        amount: parseFloat((subtotal * 0.085).toFixed(2))
      }
    ];
    
    // Calculate tax total
    const taxTotal = taxes.reduce((sum, tax) => sum + tax.amount, 0);
    
    // Calculate total
    const total = parseFloat((subtotal + taxTotal).toFixed(2));
    
    // Create the invoice
    const now = new Date();
    const dueDate = new Date(now);
    dueDate.setDate(now.getDate() + 30);
    
    const invoice: Invoice = {
      id: `invoice-${generateId()}`,
      invoiceNumber: `INV-${now.toISOString().slice(2, 7).replace('-', '')}-${Math.floor(Math.random() * 10000)}`,
      clientId: mockWaybill.client.id,
      clientName: mockWaybill.client.name,
      clientContact: mockWaybill.client.contact,
      clientEmail: mockWaybill.client.email,
      clientAddress: mockWaybill.client.address,
      clientPhone: mockWaybill.client.phone,
      issueDate: now.toISOString(),
      dueDate: dueDate.toISOString(),
      items,
      taxes,
      discounts: [],
      payments: [],
      notes: `Invoice for waybill ${mockWaybill.waybillNumber}. Shipment from ${mockWaybill.origin} to ${mockWaybill.destination}.`,
      terms: DEFAULT_INVOICE_TERMS,
      subtotal,
      taxTotal,
      discountTotal: 0,
      total,
      balance: total,
      status: InvoiceStatus.DRAFT,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      createdBy: 'System User',
      currency: mockWaybill.pricing.currency
    };
    
    return invoice;
  };