// src/components/invoices/InvoiceGenerator.tsx
import React, { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@features/UI/components/ui/card';
import { Button } from '@features/UI/components/ui/button';
import { Input } from '@features/UI/components/ui/input';
import { Label } from '@features/UI/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@features/UI/components/ui/tabs';
import { Alert, AlertDescription } from '@features/UI/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@features/UI/components/ui/dialog';
import { DatePicker } from '@features/UI/components/ui/date-picker';
import { Switch } from '@features/UI/components/ui/switch';
import {
  Save,
  FileText,
  Send,
  Plus,
  Trash2,
  CreditCard,
  DollarSign,
  Truck,
  CheckCircle,
  Eye,
  Layout
} from 'lucide-react';
import { useToast } from '@features/UI/components/ui/toast/useToast';
import { useInvoice } from '../hooks/useInvoice';
import {
  Invoice,
  InvoiceItem,
  TaxItem,
  DiscountItem,
  PaymentRecord,
  InvoiceStatus,
  INVOICE_STATUS_LABELS,
  PaymentMethod,
  TaxType
} from '../types/invoice';
import { InvoicePreview } from './InvoicePreview';
import { InvoiceTemplateSelector } from './InvoiceTemplateSelector';
import { InvoiceEmailDialog } from './InvoiceEmailDialog';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  contactPerson: string;
  address: string;
}

interface Waybill {
  id: string;
  waybillNumber: string;
  clientId: string;
  client: Client;
  origin: string;
  destination: string;
  status: string;
  createdAt: string;
}

// Custom Select component that accepts id prop and doesn't use placeholder
const Select: React.FC<React.PropsWithChildren<{
  id?: string;
  name?: string;
  value: string | PaymentMethod | InvoiceStatus;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}>> = ({
  children,
  id,
  name,
  value,
  onChange,
  className = "w-full border rounded p-2"
}) => {
    return (
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={className}
      >
        {children}
      </select>
    );
  };

export const InvoiceGenerator: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const {
    createInvoice,
    updateInvoice,
    getInvoice,
    generateInvoiceNumber,
    isLoading,
    error
  } = useInvoice();

  // State for invoice data
  const [invoice, setInvoice] = useState<Partial<Invoice>>({
    invoiceNumber: '',
    clientId: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientContact: '',
    clientAddress: '',
    items: [],
    taxes: [],
    discounts: [],
    payments: [],
    notes: '',
    terms: 'Payment due within 30 days of issue. Late payments subject to a 2% monthly fee.',
    status: InvoiceStatus.DRAFT,
    currency: 'USD'
  });

  // State for managing available clients, templates and waybills
  const [clients, setClients] = useState<Client[]>([]);
  const [waybills, setWaybills] = useState<Waybill[]>([]);
  const [availableWaybills, setAvailableWaybills] = useState<Waybill[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  // State for UI
  const [activeTab, setActiveTab] = useState('details');
  const [previewMode, setPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  // State for new payment
  const [newPayment, setNewPayment] = useState<Omit<PaymentRecord, 'id'>>({
    amount: 0,
    date: new Date().toISOString(),
    method: 'bank_transfer' as PaymentMethod,
    reference: '',
    notes: ''
  });

  // Fetch invoice if editing an existing one
  useEffect(() => {
    const loadInvoice = async () => {
      if (id && id !== 'new') {
        const existingInvoice = getInvoice(id);
        if (existingInvoice) {
          setInvoice(existingInvoice as unknown as Partial<Invoice>);
        } else {
          addToast({
            title: 'Error',
            description: 'Invoice not found',
            variant: 'destructive'
          });
          navigate('/invoices');
        }
      } else {
        // Generate new invoice number for a new invoice
        generateNewInvoiceNumber();
      }
    };

    const generateNewInvoiceNumber = async () => {
      try {
        const newInvoiceNumber = await generateInvoiceNumber();
        setInvoice(prev => ({
          ...prev,
          invoiceNumber: newInvoiceNumber,
          issueDate: new Date().toISOString(),
          // Set due date to 30 days from now
          dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString()
        }));
      } catch (error) {
        console.error('Error generating invoice number:', error);
      }
    };

    loadInvoice();
  }, [id, getInvoice, generateInvoiceNumber, navigate, addToast]);

  // Fetch clients and available waybills
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, these would be API calls
        // For now, simulate API responses

        // Fetch clients
        const clientsResponse = await fetch('/api/clients');
        const clientsData = await clientsResponse.json();
        setClients(clientsData);

        // Fetch waybills
        const waybillsResponse = await fetch('/api/waybills');
        const waybillsData = await waybillsResponse.json();
        setWaybills(waybillsData);

        // Filter available waybills for the selected client
        if (invoice.clientId) {
          setAvailableWaybills(
            waybillsData.filter((waybill: Waybill) => waybill.clientId === invoice.clientId)
          );
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        addToast({
          title: 'Error',
          description: 'Failed to load clients or waybills',
          variant: 'destructive'
        });
      }
    };

    fetchData();
  }, [invoice.clientId, addToast]);

  // Handle client selection
  const handleClientSelect = (clientId: string) => {
    const selectedClient = clients.find(c => c.id === clientId);

    if (selectedClient) {
      setInvoice(prev => ({
        ...prev,
        clientId: selectedClient.id,
        clientName: selectedClient.name,
        clientEmail: selectedClient.email,
        clientPhone: selectedClient.phone,
        clientContact: selectedClient.contactPerson,
        clientAddress: selectedClient.address || ''
      }));

      // Update available waybills for this client
      setAvailableWaybills(waybills.filter(w => w.clientId === clientId));
    }
  };

  // Handle waybill selection
  const handleWaybillSelect = async (waybillId: string) => {
    const selectedWaybill = waybills.find(w => w.id === waybillId);

    if (!selectedWaybill) return;

    try {
      // In a real app, this would be an API call
      // For demonstration, simulate creating an item from the waybill

      const newItem: Partial<InvoiceItem> = {
        description: `Freight services from ${selectedWaybill.origin} to ${selectedWaybill.destination}`,
        quantity: 1,
        unitPrice: 1500, // Placeholder price
        amount: 1500,     // Placeholder amount
        taxable: true,
        waybillId
      };

      // Add the item to the invoice
      setInvoice(prev => ({
        ...prev,
        items: [...(prev.items || []), {
          ...newItem,
          id: `item-${Date.now()}`
        } as InvoiceItem]
      }));

      addToast({
        title: 'Waybill Added',
        description: `Successfully added waybill ${selectedWaybill.waybillNumber} to the invoice`,
        variant: 'default'
      });
    } catch (error) {
      console.error('Error adding waybill:', error);
      addToast({
        title: 'Error',
        description: 'Failed to add waybill to invoice',
        variant: 'destructive'
      });
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInvoice(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle date changes
  const handleDateChange = (name: string, date: Date) => {
    setInvoice(prev => ({
      ...prev,
      [name]: date.toISOString()
    }));
  };

  // Handle invoice item changes
  const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number | boolean) => {
    setInvoice(prev => {
      const items = [...(prev.items || [])];
      const index = items.findIndex(item => item.id === id);

      if (index !== -1) {
        const updatedItem = { ...items[index], [field]: value };

        // Recalculate amount if quantity or unitPrice changes
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.amount = updatedItem.quantity * updatedItem.unitPrice;
        }

        items[index] = updatedItem;
      }

      return { ...prev, items };
    });
  };


  // Add a new invoice item
  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      description: '',
      quantity: 1,
      unitPrice: 0,
      amount: 0,
      taxable: true
    };

    setInvoice(prev => ({
      ...prev,
      items: [...(prev.items || []), newItem]
    }));
  };

  // Remove an invoice item
  const handleRemoveItem = (id: string) => {
    setInvoice(prev => ({
      ...prev,
      items: (prev.items || []).filter(item => item.id !== id)
    }));
  };

  // Handle tax changes
  const handleTaxChange = (id: string, field: keyof TaxItem, value: string | number | TaxType) => {
    setInvoice(prev => {
      const taxes = [...(prev.taxes || [])];
      const index = taxes.findIndex(tax => tax.id === id);

      if (index !== -1) {
        taxes[index] = { ...taxes[index], [field]: value };
      }

      return { ...prev, taxes };
    });
  };

  // Add a new tax
  const handleAddTax = () => {
    const newTax: TaxItem = {
      id: `tax-${Date.now()}`,
      name: 'Sales Tax',
      type: 'percentage' as TaxType,
      rate: 0,
      amount: 0
    };

    setInvoice(prev => ({
      ...prev,
      taxes: [...(prev.taxes || []), newTax]
    }));
  };

  // Remove a tax
  const handleRemoveTax = (id: string) => {
    setInvoice(prev => ({
      ...prev,
      taxes: (prev.taxes || []).filter(tax => tax.id !== id)
    }));
  };

  // Handle discount changes
  const handleDiscountChange = (id: string, field: keyof DiscountItem, value: string | number | TaxType) => {
    setInvoice(prev => {
      const discounts = [...(prev.discounts || [])];
      const index = discounts.findIndex(discount => discount.id === id);

      if (index !== -1) {
        discounts[index] = { ...discounts[index], [field]: value };
      }

      return { ...prev, discounts };
    });
  };

  // Add a new discount
  const handleAddDiscount = () => {
    const newDiscount: DiscountItem = {
      id: `discount-${Date.now()}`,
      name: 'Discount',
      type: 'percentage' as TaxType,
      rate: 0,
      amount: 0
    };

    setInvoice(prev => ({
      ...prev,
      discounts: [...(prev.discounts || []), newDiscount]
    }));
  };

  // Remove a discount
  const handleRemoveDiscount = (id: string) => {
    setInvoice(prev => ({
      ...prev,
      discounts: (prev.discounts || []).filter(discount => discount.id !== id)
    }));
  };

  // Handle new payment changes
  const handlePaymentChange = (field: keyof typeof newPayment, value: string | number | PaymentMethod) => {
    setNewPayment(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Add a new payment
  const handleAddPayment = () => {
    const payment: PaymentRecord = {
      ...newPayment,
      id: `payment-${Date.now()}`
    };

    setInvoice(prev => ({
      ...prev,
      payments: [...(prev.payments || []), payment]
    }));

    // Reset payment form
    setNewPayment({
      amount: 0,
      date: new Date().toISOString(),
      method: 'bank_transfer' as PaymentMethod,
      reference: '',
      notes: ''
    });

    // Close dialog
    setShowPaymentDialog(false);
  };

  // Remove a payment
  const handleRemovePayment = (id: string) => {
    setInvoice(prev => ({
      ...prev,
      payments: (prev.payments || []).filter(payment => payment.id !== id)
    }));
  };

  // Calculate subtotal, taxes, discounts, and total
  const calculateTotals = () => {
    const items = invoice.items || [];
    const taxes = invoice.taxes || [];
    const discounts = invoice.discounts || [];
    const payments = invoice.payments || [];

    // Calculate subtotal (sum of all item amounts)
    const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);

    // Calculate taxable amount (sum of taxable items)
    const taxableAmount = items
      .filter(item => item.taxable)
      .reduce((sum, item) => sum + (item.amount || 0), 0);

    // Calculate tax total
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

    // Calculate discount total
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

    // Calculate total (subtotal + tax - discount)
    const total = subtotal + taxTotal - discountTotal;

    // Calculate balance (total - sum of payments)
    const paymentsTotal = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
    const balance = total - paymentsTotal;

    return {
      subtotal,
      taxTotal,
      discountTotal,
      total,
      balance,
      updatedTaxes,
      updatedDiscounts
    };
  };

  // Compute totals for rendering
  const totals = calculateTotals();

  // Save the invoice
  const handleSaveInvoice = async (status?: InvoiceStatus) => {
    if (!invoice.clientId || !invoice.invoiceNumber) {
      addToast({
        title: 'Validation Error',
        description: 'Client and invoice number are required',
        variant: 'destructive'
      });
      return;
    }

    setIsSaving(true);

    try {
      // Calculate totals
      const {
        subtotal,
        taxTotal,
        discountTotal,
        total,
        balance,
        updatedTaxes,
        updatedDiscounts
      } = calculateTotals();

      // Prepare invoice data
      const invoiceData: Partial<Invoice> = {
        ...invoice,
        status: status || invoice.status,
        subtotal,
        taxTotal,
        discountTotal,
        total,
        balance,
        taxes: updatedTaxes,
        discounts: updatedDiscounts
      };

      let savedInvoice;

      if (id && id !== 'new') {
        // Update existing invoice
        savedInvoice = await updateInvoice(id, invoiceData);
        addToast({
          title: 'Invoice Updated',
          description: `Invoice #${savedInvoice.invoiceNumber} has been updated`,
          variant: 'default'
        });
      } else {
        // Create new invoice
        savedInvoice = await createInvoice(invoiceData as Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>);
        addToast({
          title: 'Invoice Created',
          description: `Invoice #${savedInvoice.invoiceNumber} has been created`,
          variant: 'default'
        });
      }

      // Navigate to invoice details
      navigate(`/invoices/${savedInvoice.id}`);
    } catch (error) {
      console.error('Error saving invoice:', error);
      addToast({
        title: 'Error',
        description: 'Failed to save invoice',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Send the invoice via email
  const handleSendInvoice = async (emailData: {
    to: string;
    subject: string;
    message: string;
    attachPdf: boolean;
  }) => {
    try {
      // First save the invoice
      await handleSaveInvoice(InvoiceStatus.PENDING);

      // In a real app, this would be an API call to send the email
      // For now, simulate sending
      await new Promise(resolve => setTimeout(resolve, 1000));

      setShowEmailDialog(false);

      addToast({
        title: 'Invoice Sent',
        description: `Invoice has been sent to ${emailData.to}`,
        variant: 'default'
      });
    } catch (error) {
      console.error('Error sending invoice:', error);
      addToast({
        title: 'Error',
        description: 'Failed to send invoice',
        variant: 'destructive'
      });
    }
  };

  // Toggle preview mode
  const togglePreview = () => {
    setPreviewMode(prev => !prev);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {id === 'new' ? 'Create New Invoice' : 'Edit Invoice'}
        </h1>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={togglePreview}
          >
            {previewMode ? (
              <FileText className="h-4 w-4 mr-2" />
            ) : (
              <Eye className="h-4 w-4 mr-2" />
            )}
            {previewMode ? 'Edit Mode' : 'Preview'}
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowEmailDialog(true)}
            disabled={isSaving || !invoice.clientEmail}
          >
            <Send className="h-4 w-4 mr-2" />
            Send Email
          </Button>

          <Button
            variant="default"
            onClick={() => handleSaveInvoice()}
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Invoice'}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {previewMode ? (
        <InvoicePreview
          invoice={invoice as Invoice}
          templateId={selectedTemplate}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">
                  <FileText className="h-4 w-4 mr-2" />
                  Details
                </TabsTrigger>
                <TabsTrigger value="items">
                  <Truck className="h-4 w-4 mr-2" />
                  Items
                </TabsTrigger>
                <TabsTrigger value="payments">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payments
                </TabsTrigger>
                <TabsTrigger value="template">
                  <Layout className="h-4 w-4 mr-2" />
                  Template
                </TabsTrigger>
              </TabsList>

              {/* Details Tab */}
              <TabsContent value="details" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Invoice Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Invoice Information</h3>

                    <div className="space-y-2">
                      <Label htmlFor="invoiceNumber">Invoice Number</Label>
                      <Input
                        id="invoiceNumber"
                        name="invoiceNumber"
                        value={invoice.invoiceNumber || ''}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="issueDate">Issue Date</Label>
                        <DatePicker
                          value={invoice.issueDate ? new Date(invoice.issueDate) : new Date()}
                          onChange={(date: Date) => handleDateChange('issueDate', date)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dueDate">Due Date</Label>
                        <DatePicker
                          value={invoice.dueDate ? new Date(invoice.dueDate) : new Date()}
                          onChange={(date: Date) => handleDateChange('dueDate', date)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        name="status"
                        value={invoice.status || InvoiceStatus.DRAFT}
                        onChange={handleChange}
                      >
                        {Object.entries(INVOICE_STATUS_LABELS).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select
                        name="currency"
                        value={invoice.currency || 'USD'}
                        onChange={handleChange}
                      >
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="CAD">CAD - Canadian Dollar</option>
                        <option value="AUD">AUD - Australian Dollar</option>
                      </Select>
                    </div>
                  </div>

                  {/* Client Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Client Information</h3>

                    <div className="space-y-2">
                      <Label htmlFor="clientId">Select Client</Label>
                      <Select
                        name="clientId"
                        value={invoice.clientId || ''}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => handleClientSelect(e.target.value)}
                      >
                        <option value="">Select a client...</option>
                        {clients.map((client) => (
                          <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                      </Select>
                    </div>

                    {invoice.clientId && (
                      <div className="space-y-3 p-4 border rounded-md bg-gray-50">
                        <div className="space-y-2">
                          <Label htmlFor="clientName">Client Name</Label>
                          <Input
                            id="clientName"
                            name="clientName"
                            value={invoice.clientName || ''}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="clientContact">Contact Person</Label>
                          <Input
                            id="clientContact"
                            name="clientContact"
                            value={invoice.clientContact || ''}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="clientEmail">Email</Label>
                          <Input
                            id="clientEmail"
                            name="clientEmail"
                            type="email"
                            value={invoice.clientEmail || ''}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="clientPhone">Phone</Label>
                          <Input
                            id="clientPhone"
                            name="clientPhone"
                            value={invoice.clientPhone || ''}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="clientAddress">Address</Label>
                          <textarea
                            id="clientAddress"
                            name="clientAddress"
                            className="w-full border rounded p-2"
                            rows={3}
                            value={invoice.clientAddress || ''}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Notes & Terms */}
                <div className="space-y-4 pt-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <textarea
                        id="notes"
                        name="notes"
                        className="w-full border rounded p-2"
                        rows={3}
                        value={invoice.notes || ''}
                        onChange={handleChange}
                        placeholder="Any additional notes for the client..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="terms">Terms & Conditions</Label>
                      <textarea
                        id="terms"
                        name="terms"
                        className="w-full border rounded p-2"
                        rows={3}
                        value={invoice.terms || ''}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Items Tab */}
              <TabsContent value="items" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Invoice Items</h3>

                  <div className="space-x-2">
                    {invoice.clientId && availableWaybills.length > 0 && (
                      <select
                        className="w-60 border rounded p-2"
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                          if (e.target.value) handleWaybillSelect(e.target.value);
                          e.target.value = ''; // Reset after selection
                        }}
                        value=""
                      >
                        <option value="">Add from waybill...</option>
                        {availableWaybills.map((waybill) => (
                          <option key={waybill.id} value={waybill.id}>
                            {waybill.waybillNumber} - {waybill.origin} to {waybill.destination}
                          </option>
                        ))}
                      </select>
                    )}

                    <Button
                      type="button"
                      onClick={handleAddItem}
                      disabled={isLoading}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 border text-left">Description</th>
                        <th className="p-2 border text-center">Quantity</th>
                        <th className="p-2 border text-center">Unit Price</th>
                        <th className="p-2 border text-center">Taxable</th>
                        <th className="p-2 border text-right">Amount</th>
                        <th className="p-2 border text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(invoice.items || []).map((item) => (
                        <tr key={item.id}>
                          <td className="p-2 border">
                            <Input
                              value={item.description}
                              onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                              placeholder="Item description"
                            />
                          </td>
                          <td className="p-2 border">
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                              min="1"
                              className="text-center"
                            />
                          </td>
                          <td className="p-2 border">
                            <Input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => handleItemChange(item.id, 'unitPrice', Number(e.target.value))}
                              min="0"
                              step="0.01"
                              className="text-center"
                            />
                          </td>
                          <td className="p-2 border text-center">
                            <Switch
                              checked={item.taxable}
                              onCheckedChange={(checked) => handleItemChange(item.id, 'taxable', checked)}
                            />
                          </td>
                          <td className="p-2 border text-right">
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: invoice.currency || 'USD'
                            }).format(item.amount)}
                          </td>
                          <td className="p-2 border text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </td>
                        </tr>
                      ))}

                      {(invoice.items || []).length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-4 text-center text-gray-500">
                            No items added. Click "Add Item" to add invoice items.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Taxes & Discounts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                  {/* Taxes */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Taxes</h4>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleAddTax}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Tax
                      </Button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="p-2 border text-left">Name</th>
                            <th className="p-2 border text-center">Type</th>
                            <th className="p-2 border text-center">Rate</th>
                            <th className="p-2 border text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(invoice.taxes || []).map((tax) => (
                            <tr key={tax.id}>
                              <td className="p-2 border">
                                <Input
                                  value={tax.name}
                                  onChange={(e) => handleTaxChange(tax.id, 'name', e.target.value)}
                                  placeholder="Tax name"
                                />
                              </td>
                              <td className="p-2 border">
                                <select
                                  className="w-full border rounded p-2"
                                  value={tax.type}
                                  onChange={(e) => handleTaxChange(tax.id, 'type', e.target.value as TaxType)}
                                >
                                  <option value="percentage">Percentage (%)</option>
                                  <option value="fixed">Fixed Amount</option>
                                </select>
                              </td>
                              <td className="p-2 border">
                                <Input
                                  type="number"
                                  value={tax.rate}
                                  onChange={(e) => handleTaxChange(tax.id, 'rate', Number(e.target.value))}
                                  min="0"
                                  step={tax.type === 'percentage' ? '0.1' : '0.01'}
                                />
                              </td>
                              <td className="p-2 border text-center">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveTax(tax.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </td>
                            </tr>
                          ))}

                          {(invoice.taxes || []).length === 0 && (
                            <tr>
                              <td colSpan={4} className="p-4 text-center text-gray-500">
                                No taxes added.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Discounts */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Discounts</h4>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleAddDiscount}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Discount
                      </Button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="p-2 border text-left">Name</th>
                            <th className="p-2 border text-center">Type</th>
                            <th className="p-2 border text-center">Rate</th>
                            <th className="p-2 border text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(invoice.discounts || []).map((discount) => (
                            <tr key={discount.id}>
                              <td className="p-2 border">
                                <Input
                                  value={discount.name}
                                  onChange={(e) => handleDiscountChange(discount.id, 'name', e.target.value)}
                                  placeholder="Discount name"
                                />
                              </td>
                              <td className="p-2 border">
                                <select
                                  className="w-full border rounded p-2"
                                  value={discount.type}
                                  onChange={(e) => handleDiscountChange(discount.id, 'type', e.target.value as TaxType)}
                                >
                                  <option value="percentage">Percentage (%)</option>
                                  <option value="fixed">Fixed Amount</option>
                                </select>
                              </td>
                              <td className="p-2 border">
                                <Input
                                  type="number"
                                  value={discount.rate}
                                  onChange={(e) => handleDiscountChange(discount.id, 'rate', Number(e.target.value))}
                                  min="0"
                                  step={discount.type === 'percentage' ? '0.1' : '0.01'}
                                />
                              </td>
                              <td className="p-2 border text-center">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveDiscount(discount.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </td>
                            </tr>
                          ))}

                          {(invoice.discounts || []).length === 0 && (
                            <tr>
                              <td colSpan={4} className="p-4 text-center text-gray-500">
                                No discounts added.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Totals */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-end">
                    <div className="w-64 space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: invoice.currency || 'USD'
                          }).format(totals.subtotal)}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span>Tax Total:</span>
                        <span>
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: invoice.currency || 'USD'
                          }).format(totals.taxTotal)}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span>Discount Total:</span>
                        <span>
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: invoice.currency || 'USD'
                          }).format(totals.discountTotal)}
                        </span>
                      </div>

                      <div className="flex justify-between font-bold pt-2 border-t">
                        <span>Total:</span>
                        <span>
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: invoice.currency || 'USD'
                          }).format(totals.total)}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span>Amount Paid:</span>
                        <span>
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: invoice.currency || 'USD'
                          }).format(totals.total - totals.balance)}
                        </span>
                      </div>

                      <div className="flex justify-between font-bold pt-2 border-t">
                        <span>Balance Due:</span>
                        <span>
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: invoice.currency || 'USD'
                          }).format(totals.balance)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Payments Tab */}
              <TabsContent value="payments" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Payments</h3>

                  <Button
                    type="button"
                    onClick={() => setShowPaymentDialog(true)}
                    disabled={isLoading}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Record Payment
                  </Button>
                </div>

                {/* Payments Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 border text-left">Date</th>
                        <th className="p-2 border text-left">Method</th>
                        <th className="p-2 border text-left">Reference</th>
                        <th className="p-2 border text-right">Amount</th>
                        <th className="p-2 border text-left">Notes</th>
                        <th className="p-2 border text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(invoice.payments || []).map((payment) => (
                        <tr key={payment.id}>
                          <td className="p-2 border">
                            {new Date(payment.date).toLocaleDateString()}
                          </td>
                          <td className="p-2 border">
                            {payment.method === 'credit_card' ? 'Credit Card' :
                              payment.method === 'bank_transfer' ? 'Bank Transfer' :
                                payment.method === 'cash' ? 'Cash' :
                                  payment.method === 'check' ? 'Check' : payment.method}
                          </td>
                          <td className="p-2 border">
                            {payment.reference || '-'}
                          </td>
                          <td className="p-2 border text-right">
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: invoice.currency || 'USD'
                            }).format(payment.amount)}
                          </td>
                          <td className="p-2 border">
                            {payment.notes || '-'}
                          </td>
                          <td className="p-2 border text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemovePayment(payment.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </td>
                        </tr>
                      ))}

                      {(invoice.payments || []).length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-4 text-center text-gray-500">
                            No payments recorded. Click "Record Payment" to add payment.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Payment Summary */}
                <div className="pt-4 border-t">
                  <div className="flex justify-end">
                    <div className="w-64 space-y-2">
                      <div className="flex justify-between">
                        <span>Invoice Total:</span>
                        <span>
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: invoice.currency || 'USD'
                          }).format(totals.total)}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span>Amount Paid:</span>
                        <span>
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: invoice.currency || 'USD'
                          }).format(totals.total - totals.balance)}
                        </span>
                      </div>

                      <div className="flex justify-between font-bold pt-2 border-t">
                        <span>Balance Due:</span>
                        <span>
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: invoice.currency || 'USD'
                          }).format(totals.balance)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Template Tab */}
              <TabsContent value="template" className="space-y-6">
                <InvoiceTemplateSelector
                  selectedTemplateId={selectedTemplate}
                  onSelect={setSelectedTemplate}
                />
              </TabsContent>
            </Tabs>

            {/* Action buttons */}
            <div className="flex justify-between pt-6 border-t mt-6">
              <Button
                variant="outline"
                onClick={() => navigate('/invoices')}
              >
                Cancel
              </Button>

              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={togglePreview}
                >
                  {previewMode ? 'Edit' : 'Preview'}
                </Button>

                {!id || id === 'new' ? (
                  <Button
                    variant="outline"
                    onClick={() => handleSaveInvoice(InvoiceStatus.DRAFT)}
                    disabled={isSaving}
                  >
                    Save as Draft
                  </Button>
                ) : null}

                <Button
                  variant="default"
                  onClick={() => handleSaveInvoice(InvoiceStatus.PENDING)}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : id && id !== 'new' ? 'Update Invoice' : 'Create Invoice'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Record Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Record a payment for this invoice. The payment will be applied to the current balance.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="paymentAmount">Payment Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="paymentAmount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  className="pl-9"
                  value={newPayment.amount}
                  onChange={(e) => handlePaymentChange('amount', Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentDate">Payment Date</Label>
              <DatePicker
                value={new Date(newPayment.date)}
                onChange={(date: Date) => handlePaymentChange('date', date.toISOString())}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select
                value={newPayment.method}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => handlePaymentChange('method', e.target.value)}
              >
                <option value="bank_transfer">Bank Transfer</option>
                <option value="credit_card">Credit Card</option>
                <option value="cash">Cash</option>
                <option value="check">Check</option>
                <option value="other">Other</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentReference">Reference Number (Optional)</Label>
              <Input
                id="paymentReference"
                placeholder="e.g., Transaction ID, Check Number"
                value={newPayment.reference}
                onChange={(e) => handlePaymentChange('reference', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentNotes">Notes (Optional)</Label>
              <textarea
                id="paymentNotes"
                className="w-full border rounded p-2"
                rows={2}
                placeholder="Additional payment details..."
                value={newPayment.notes}
                onChange={(e) => handlePaymentChange('notes', e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPaymentDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddPayment}
              disabled={!newPayment.amount || newPayment.amount <= 0}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Record Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Invoice Dialog */}
      {showEmailDialog && (
        <InvoiceEmailDialog
          invoice={invoice as Invoice}
          onSend={handleSendInvoice}
          onCancel={() => setShowEmailDialog(false)}
        />
      )}
    </div>
  );
};