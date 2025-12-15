// src/pages/invoices/InvoiceGenerator.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  DollarSign,
  Search,
  Save,
  Printer,
  Send,
  ArrowLeft,
  Trash
} from 'lucide-react';
import { Button } from '@features/UI/components/ui/button';
import { Input } from '@features/UI/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@features/UI/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@features/UI/components/ui/card';
import { Textarea } from '@features/UI/components/ui/textarea';
import { Checkbox } from '@features/UI/components/ui/checkbox';
import { Label } from '@features/UI/components/ui/label';

// Interface for waybill selection
interface WaybillItem {
  id: string;
  waybillNumber: string;
  client: string;
  origin: string;
  destination: string;
  date: string;
  amount: number;
  status: 'delivered' | 'in_transit' | 'pending';
  selected?: boolean;
}

// Interface for invoice data
interface InvoiceData {
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  clientPhone: string;
  issueDate: string;
  dueDate: string;
  waybills: WaybillItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
  total: number;
  notes: string;
  terms: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
}

// Mock data for waybills
const mockWaybills: WaybillItem[] = [
  {
    id: '1',
    waybillNumber: 'WB-2025-000123',
    client: 'ACME Inc.',
    origin: 'New York, NY',
    destination: 'Los Angeles, CA',
    date: '2025-02-15',
    amount: 2450.00,
    status: 'delivered'
  },
  {
    id: '2',
    waybillNumber: 'WB-2025-000124',
    client: 'ACME Inc.',
    origin: 'Chicago, IL',
    destination: 'Miami, FL',
    date: '2025-02-16',
    amount: 1875.50,
    status: 'delivered'
  },
  {
    id: '3',
    waybillNumber: 'WB-2025-000125',
    client: 'ACME Inc.',
    origin: 'Seattle, WA',
    destination: 'Dallas, TX',
    date: '2025-02-18',
    amount: 3240.75,
    status: 'delivered'
  },
  {
    id: '4',
    waybillNumber: 'WB-2025-000126',
    client: 'ACME Inc.',
    origin: 'Boston, MA',
    destination: 'Denver, CO',
    date: '2025-02-20',
    amount: 2780.25,
    status: 'delivered'
  }
];

// Mock client data
const mockClient = {
  id: 'CLT-001',
  name: 'ACME Inc.',
  address: '123 Corporate Plaza, Suite 500, New York, NY 10001',
  email: 'accounts@acmeinc.com',
  phone: '+1 (555) 987-6543'
};

// Default terms
const defaultTerms = 'Payment is due within 30 days of invoice date. Late payments are subject to a 1.5% monthly interest charge.';

export const InvoiceGenerator: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'waybill_selection' | 'invoice_details' | 'preview'>('waybill_selection');
  const [availableWaybills, setAvailableWaybills] = useState<WaybillItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWaybills, setSelectedWaybills] = useState<WaybillItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: '',
    clientId: mockClient.id,
    clientName: mockClient.name,
    clientAddress: mockClient.address,
    clientEmail: mockClient.email,
    clientPhone: mockClient.phone,
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    waybills: [],
    subtotal: 0,
    taxRate: 8.5,
    taxAmount: 0,
    discountType: 'percentage',
    discountValue: 0,
    discountAmount: 0,
    total: 0,
    notes: '',
    terms: defaultTerms,
    status: 'draft'
  });

  // Fetch available waybills
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setAvailableWaybills(mockWaybills);
      setIsLoading(false);
    }, 800);
  }, []);

  // Calculate invoice totals whenever relevant values change
  useEffect(() => {
    const subtotal = selectedWaybills.reduce((total, waybill) => total + waybill.amount, 0);
    let discountAmount = 0;

    if (invoiceData.discountType === 'percentage') {
      discountAmount = subtotal * (invoiceData.discountValue / 100);
    } else {
      discountAmount = invoiceData.discountValue;
    }

    const afterDiscount = subtotal - discountAmount;
    const taxAmount = afterDiscount * (invoiceData.taxRate / 100);
    const total = afterDiscount + taxAmount;

    setInvoiceData(prevData => ({
      ...prevData,
      subtotal,
      taxAmount,
      discountAmount,
      total,
      waybills: selectedWaybills
    }));
  }, [selectedWaybills, invoiceData.taxRate, invoiceData.discountType, invoiceData.discountValue]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Handle waybill selection
  const handleWaybillSelect = (waybill: WaybillItem) => {
    const isSelected = selectedWaybills.find(w => w.id === waybill.id);

    if (isSelected) {
      setSelectedWaybills(selectedWaybills.filter(w => w.id !== waybill.id));
    } else {
      setSelectedWaybills([...selectedWaybills, waybill]);
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedWaybills.length === availableWaybills.length) {
      setSelectedWaybills([]);
    } else {
      setSelectedWaybills([...availableWaybills]);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInvoiceData({
      ...invoiceData,
      [name]: value
    });
  };

  // Handle numeric input changes
  // Type the event handler for numeric inputs
  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === '' ? 0 : parseFloat(value);

    setInvoiceData(prevData => ({
      ...prevData,
      [name]: numValue
    }));
  };

  // Generate invoice number
  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const randomPart = Math.floor(100000 + Math.random() * 900000);
    return `INV-${year}-${randomPart}`;
  };

  // Handle continue to invoice details
  const handleContinueToDetails = () => {
    if (selectedWaybills.length === 0) {
      alert('Please select at least one waybill');
      return;
    }

    setInvoiceData({
      ...invoiceData,
      invoiceNumber: generateInvoiceNumber(),
      waybills: selectedWaybills
    });

    setStep('invoice_details');
  };

  // Handle continue to preview
  const handleContinueToPreview = () => {
    setStep('preview');
  };

  // Handle back button
  const handleBack = () => {
    if (step === 'invoice_details') {
      setStep('waybill_selection');
    } else if (step === 'preview') {
      setStep('invoice_details');
    } else {
      navigate('/invoices');
    }
  };

  // Handle save invoice
  const handleSaveInvoice = () => {
    // In a real app, this would be an API call
    console.log('Saving invoice:', invoiceData);
    alert('Invoice saved successfully!');
    navigate('/invoices');
  };

  // Render the waybill selection step
  const renderWaybillSelection = () => {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold">Select Waybills</h2>
            <p className="text-gray-500">Select the waybills to include in this invoice</p>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search waybills..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Available Waybills</CardTitle>
              <div className="flex items-center">
                <Checkbox
                  id="select-all"
                  checked={selectedWaybills.length === availableWaybills.length && availableWaybills.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <Label htmlFor="select-all" className="ml-2">Select All</Label>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : availableWaybills.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No waybills available</h3>
                <p className="text-gray-500 max-w-md mx-auto mt-2">
                  There are no delivered waybills available for invoicing at this time.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-4 font-medium">Waybill #</th>
                      <th className="py-3 px-4 font-medium">Route</th>
                      <th className="py-3 px-4 font-medium">Date</th>
                      <th className="py-3 px-4 font-medium text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availableWaybills.map((waybill) => (
                      <tr key={waybill.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => handleWaybillSelect(waybill)}>
                        <td className="py-4 px-4">
                          <Checkbox
                            checked={selectedWaybills.some(w => w.id === waybill.id)}
                            onCheckedChange={() => handleWaybillSelect(waybill)}
                          />
                        </td>
                        <td className="py-4 px-4 font-medium text-blue-600">{waybill.waybillNumber}</td>
                        <td className="py-4 px-4">{waybill.origin} → {waybill.destination}</td>
                        <td className="py-4 px-4">{new Date(waybill.date).toLocaleDateString()}</td>
                        <td className="py-4 px-4 text-right">{formatCurrency(waybill.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              disabled={selectedWaybills.length === 0}
              onClick={handleContinueToDetails}
            >
              Continue
            </Button>
          </CardFooter>
        </Card>

        {selectedWaybills.length > 0 && (
          <div className="bg-blue-50 p-4 rounded-md flex justify-between items-center">
            <div>
              <span className="font-medium">{selectedWaybills.length} waybill{selectedWaybills.length !== 1 ? 's' : ''} selected</span>
              <p className="text-sm text-gray-600">
                Total: {formatCurrency(selectedWaybills.reduce((total, waybill) => total + waybill.amount, 0))}
              </p>
            </div>
            <Button onClick={handleContinueToDetails}>
              Continue
            </Button>
          </div>
        )}
      </div>
    );
  };

  // Render the invoice details step
  const renderInvoiceDetails = () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Invoice Details</h2>
          <p className="text-gray-500">Enter additional information for this invoice</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoiceNumber">Invoice Number</Label>
                  <Input
                    id="invoiceNumber"
                    name="invoiceNumber"
                    value={invoiceData.invoiceNumber}
                    onChange={handleInputChange}
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={invoiceData.status}
                    onValueChange={(value: InvoiceData['status']) =>
                      setInvoiceData(prev => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="issueDate">Issue Date</Label>
                  <Input
                    id="issueDate"
                    name="issueDate"
                    type="date"
                    value={invoiceData.issueDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    value={invoiceData.dueDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name</Label>
                <Input
                  id="clientName"
                  name="clientName"
                  value={invoiceData.clientName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientAddress">Client Address</Label>
                <Textarea
                  id="clientAddress"
                  name="clientAddress"
                  value={invoiceData.clientAddress}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientEmail">Email</Label>
                  <Input
                    id="clientEmail"
                    name="clientEmail"
                    type="email"
                    value={invoiceData.clientEmail}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientPhone">Phone</Label>
                  <Input
                    id="clientPhone"
                    name="clientPhone"
                    value={invoiceData.clientPhone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 font-medium">Waybill #</th>
                    <th className="py-3 px-4 font-medium">Description</th>
                    <th className="py-3 px-4 font-medium text-right">Amount</th>
                    <th className="py-3 px-4 font-medium w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {selectedWaybills.map((waybill) => (
                    <tr key={waybill.id} className="border-b">
                      <td className="py-4 px-4 font-medium">{waybill.waybillNumber}</td>
                      <td className="py-4 px-4">Transportation services: {waybill.origin} → {waybill.destination}</td>
                      <td className="py-4 px-4 text-right">{formatCurrency(waybill.amount)}</td>
                      <td className="py-4 px-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleWaybillSelect(waybill)}
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col items-end space-y-2 pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="discountType">Discount Type</Label>
                  <Select
                    value={invoiceData.discountType}
                    onValueChange={(value: unknown) => setInvoiceData({ ...invoiceData, discountType: value as 'percentage' | 'fixed' })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discountValue">
                    {invoiceData.discountType === 'percentage' ? 'Discount (%)' : 'Discount Amount'}
                  </Label>
                  <Input
                    id="discountValue"
                    name="discountValue"
                    type="number"
                    min="0"
                    step={invoiceData.discountType === 'percentage' ? '0.01' : '0.01'}
                    value={invoiceData.discountValue}
                    onChange={handleNumericChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    name="taxRate"
                    type="number"
                    min="0"
                    step="0.01"
                    value={invoiceData.taxRate}
                    onChange={handleNumericChange}
                  />
                </div>
              </div>

              <div className="w-full max-w-md space-y-2 border-t pt-4 mt-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(invoiceData.subtotal)}</span>
                </div>
                {invoiceData.discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>
                      Discount
                      {invoiceData.discountType === 'percentage' && ` (${invoiceData.discountValue}%)`}:
                    </span>
                    <span>-{formatCurrency(invoiceData.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Tax ({invoiceData.taxRate}%):</span>
                  <span>{formatCurrency(invoiceData.taxAmount)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total:</span>
                  <span>{formatCurrency(invoiceData.total)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={invoiceData.notes}
                onChange={handleInputChange}
                placeholder="Enter any notes or special instructions..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="terms">Terms & Conditions</Label>
              <Textarea
                id="terms"
                name="terms"
                value={invoiceData.terms}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button onClick={handleContinueToPreview}>
              Preview Invoice
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };

  // Render the invoice preview step
  const renderInvoicePreview = () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Invoice Preview</h2>
          <p className="text-gray-500">Review the invoice before finalizing</p>
        </div>

        {/* Invoice Preview */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row justify-between pb-8 border-b">
              <div>
                <h1 className="text-3xl font-bold text-blue-600">INVOICE</h1>
                <div className="mt-4 space-y-1">
                  <p className="font-medium">{invoiceData.invoiceNumber}</p>
                  <p>Issue Date: {new Date(invoiceData.issueDate).toLocaleDateString()}</p>
                  <p>Due Date: {new Date(invoiceData.dueDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="mt-6 md:mt-0 text-right">
                <div className="text-xl font-bold">CargoTrack Pro</div>
                <div className="mt-2 text-sm">
                  <p>123 Logistics Avenue</p>
                  <p>New York, NY 10001</p>
                  <p>United States</p>
                  <p>+1 (555) 123-4567</p>
                  <p>billing@cargotrackpro.com</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-b">
              <div>
                <h3 className="text-gray-500 font-medium text-sm mb-3">BILL TO</h3>
                <p className="font-bold text-lg">{invoiceData.clientName}</p>
                <div className="mt-2 space-y-1 text-sm">
                  <p style={{ whiteSpace: 'pre-line' }}>{invoiceData.clientAddress}</p>
                  <p>{invoiceData.clientPhone}</p>
                  <p>{invoiceData.clientEmail}</p>
                </div>
              </div>

              <div className="flex flex-col items-end justify-end">
                <div className="bg-blue-50 p-4 rounded-md w-full max-w-xs text-right">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Amount Due:</span>
                    <span className="font-bold text-xl">{formatCurrency(invoiceData.total)}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="capitalize">{invoiceData.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="py-8 border-b">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-2 text-left font-medium text-gray-600">#</th>
                    <th className="py-2 px-2 text-left font-medium text-gray-600">Description</th>
                    <th className="py-2 px-2 text-right font-medium text-gray-600">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.waybills.map((waybill, index) => (
                    <tr key={waybill.id} className="border-b">
                      <td className="py-4 px-2 text-gray-600">{index + 1}</td>
                      <td className="py-4 px-2">
                        <div className="font-medium">{waybill.waybillNumber}</div>
                        <div className="text-sm text-gray-600">Transportation services: {waybill.origin} → {waybill.destination}</div>
                        <div className="text-sm text-gray-600">Date: {new Date(waybill.date).toLocaleDateString()}</div>
                      </td>
                      <td className="py-4 px-2 text-right">{formatCurrency(waybill.amount)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={2} className="pt-4 text-right font-medium">Subtotal</td>
                    <td className="pt-4 text-right">{formatCurrency(invoiceData.subtotal)}</td>
                  </tr>
                  {invoiceData.discountAmount > 0 && (
                    <tr>
                      <td colSpan={2} className="pt-2 text-right font-medium">
                        Discount
                        {invoiceData.discountType === 'percentage' && ` (${invoiceData.discountValue}%)`}
                      </td>
                      <td className="pt-2 text-right">-{formatCurrency(invoiceData.discountAmount)}</td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan={2} className="pt-2 text-right font-medium">Tax ({invoiceData.taxRate}%)</td>
                    <td className="pt-2 text-right">{formatCurrency(invoiceData.taxAmount)}</td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="pt-4 text-right font-bold text-lg">Total</td>
                    <td className="pt-4 text-right font-bold text-lg">{formatCurrency(invoiceData.total)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {(invoiceData.notes || invoiceData.terms) && (
              <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                {invoiceData.notes && (
                  <div>
                    <h3 className="font-medium mb-2">Notes</h3>
                    <p className="text-sm text-gray-600" style={{ whiteSpace: 'pre-line' }}>{invoiceData.notes}</p>
                  </div>
                )}

                {invoiceData.terms && (
                  <div>
                    <h3 className="font-medium mb-2">Terms & Conditions</h3>
                    <p className="text-sm text-gray-600" style={{ whiteSpace: 'pre-line' }}>{invoiceData.terms}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Edit
          </Button>

          <div className="flex gap-2">
            <Button variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline">
              <Send className="mr-2 h-4 w-4" />
              Send to Client
            </Button>
            <Button onClick={handleSaveInvoice}>
              <Save className="mr-2 h-4 w-4" />
              Save Invoice
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" onClick={handleBack} className="p-1">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-blue-600" />
            Generate Invoice
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className={`flex items-center ${step === 'waybill_selection' ? 'text-blue-600 font-medium' : ''}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-1 ${step === 'waybill_selection' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>1</div>
              Select Waybills
            </div>
            <div className="w-4 h-0.5 bg-gray-200"></div>
            <div className={`flex items-center ${step === 'invoice_details' ? 'text-blue-600 font-medium' : ''}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-1 ${step === 'invoice_details' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>2</div>
              Invoice Details
            </div>
            <div className="w-4 h-0.5 bg-gray-200"></div>
            <div className={`flex items-center ${step === 'preview' ? 'text-blue-600 font-medium' : ''}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-1 ${step === 'preview' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>3</div>
              Preview & Send
            </div>
          </div>
        </div>
      </div>

      {step === 'waybill_selection' && renderWaybillSelection()}
      {step === 'invoice_details' && renderInvoiceDetails()}
      {step === 'preview' && renderInvoicePreview()}
    </div>
  );
};