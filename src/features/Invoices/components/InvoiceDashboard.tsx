// src/features/Invoices/components/InvoiceDashboard.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvoice } from '../hooks/useInvoice';
import { Card, CardContent, CardHeader, CardTitle } from '../../UI/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../UI/components/ui/tabs';
import { Button } from '../../UI/components/ui/button';
import { Input } from '../../UI/components/ui/input';
import { Badge } from '../../UI/components/ui/badge';
import { 
  Search, 
  FileText, 
  CreditCard, 
  AlertTriangle,
  RefreshCw,
  Plus,
  DollarSign
} from 'lucide-react';
import { 
  Invoice as ComponentInvoice,
  InvoiceStatus, 
  INVOICE_STATUS_LABELS 
} from '../types/invoice'; // Renamed to avoid type conflicts
import { InvoiceList } from './InvoiceList';

// Type for converting between the two Invoice types
type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  taxable: boolean;
  waybillId?: string;
  notes?: string;
};

type TaxItem = {
  id: string;
  name: string;
  type: string; // Using string instead of specific enum to avoid conflicts
  rate: number;
  amount: number;
};

type DiscountItem = {
  id: string;
  name: string;
  type: string; // Using string instead of specific enum to avoid conflicts
  rate: number;
  amount: number;
};

type PaymentRecord = {
  id: string;
  date: string;
  amount: number;
  method: string;
  reference?: string;
  notes?: string;
};

type InvoiceFromHook = {
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
  status: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  currency: string;
};

export const InvoiceDashboard: React.FC = () => {
  const { invoices, loadInvoices, isLoading } = useInvoice();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<InvoiceStatus | 'all'>('all');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: ''
  });
  const [activeTab, setActiveTab] = useState('pending');
  
  const navigate = useNavigate();

  // Helper to handle type conversion
  const convertInvoices = (invoicesList: InvoiceFromHook[]): ComponentInvoice[] => {
    return invoicesList as unknown as ComponentInvoice[];
  };

  // Filter invoices based on search term, status, and date range
  const filteredInvoices = convertInvoices(
    invoices.filter((invoice: InvoiceFromHook) => {
      const matchesSearch = 
        searchTerm === '' || 
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
      
      // Date range filtering (using issueDate)
      let matchesDateRange = true;
      if (dateRange.start) {
        matchesDateRange = matchesDateRange && new Date(invoice.issueDate) >= new Date(dateRange.start);
      }
      if (dateRange.end) {
        matchesDateRange = matchesDateRange && new Date(invoice.issueDate) <= new Date(dateRange.end);
      }
      
      // For "pending" tab, show pending and partially paid
      if (activeTab === 'pending') {
        return matchesSearch && matchesStatus && matchesDateRange && 
              (invoice.status === InvoiceStatus.PENDING || 
                invoice.status === InvoiceStatus.PARTIALLY_PAID);
      }
      
      // For "overdue" tab
      if (activeTab === 'overdue') {
        return matchesSearch && matchesStatus && matchesDateRange && 
              invoice.status === InvoiceStatus.OVERDUE;
      }
      
      // For "paid" tab
      if (activeTab === 'paid') {
        return matchesSearch && matchesStatus && matchesDateRange && 
              invoice.status === InvoiceStatus.PAID;
      }
      
      // For "drafts" tab
      if (activeTab === 'drafts') {
        return matchesSearch && matchesStatus && matchesDateRange && 
              invoice.status === InvoiceStatus.DRAFT;
      }
      
      // For "all" tab
      return matchesSearch && matchesStatus && matchesDateRange;
    })
  );

  // Get counts for status summary
  const statusCounts = invoices.reduce((acc: Record<string, number>, invoice: InvoiceFromHook) => {
    const status = invoice.status as keyof typeof acc;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate financial summary
  const financialSummary = {
    totalOutstanding: invoices
      .filter((inv: InvoiceFromHook) => 
        inv.status !== InvoiceStatus.PAID && 
        inv.status !== InvoiceStatus.CANCELLED
      )
      .reduce((sum: number, inv: InvoiceFromHook) => sum + inv.balance, 0),
    totalOverdue: invoices
      .filter((inv: InvoiceFromHook) => 
        inv.status === InvoiceStatus.OVERDUE
      )
      .reduce((sum: number, inv: InvoiceFromHook) => sum + inv.balance, 0),
    totalPaid: invoices
      .filter((inv: InvoiceFromHook) => 
        inv.status === InvoiceStatus.PAID
      )
      .reduce((sum: number, inv: InvoiceFromHook) => sum + inv.total, 0),
    invoiceCount: invoices.length
  };

  // Handle refresh
  const handleRefresh = () => {
    loadInvoices();
  };

  // Navigate to create new invoice
  const handleCreateInvoice = () => {
    navigate('/invoices/new');
  };

  // Navigate to generate invoice from waybill
  const handleGenerateFromWaybill = () => {
    navigate('/invoices/generate-from-waybill');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-blue-50 border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="text-blue-800">
              <FileText className="h-5 w-5 inline-block mr-2" />
              Invoice Management
            </CardTitle>
            <div className="space-x-2">
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                variant="outline"
                onClick={handleGenerateFromWaybill}
              >
                <FileText className="h-4 w-4 mr-2" />
                From Waybill
              </Button>
              <Button 
                onClick={handleCreateInvoice}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Invoice
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Financial Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Outstanding</p>
                  <DollarSign className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold text-blue-800">
                  {new Intl.NumberFormat('en-US', { 
                    style: 'currency', 
                    currency: 'USD',
                    maximumFractionDigits: 0
                  }).format(financialSummary.totalOutstanding)}
                </h3>
                <p className="text-xs text-blue-600 mt-1">
                  {invoices.filter((inv: InvoiceFromHook) => 
                    inv.status !== InvoiceStatus.PAID && 
                    inv.status !== InvoiceStatus.CANCELLED
                  ).length} invoices
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Overdue</p>
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-red-800">
                  {new Intl.NumberFormat('en-US', { 
                    style: 'currency', 
                    currency: 'USD',
                    maximumFractionDigits: 0
                  }).format(financialSummary.totalOverdue)}
                </h3>
                <p className="text-xs text-red-600 mt-1">
                  {statusCounts[InvoiceStatus.OVERDUE] || 0} invoices
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Paid</p>
                  <CreditCard className="h-5 w-5 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-green-800">
                  {new Intl.NumberFormat('en-US', { 
                    style: 'currency', 
                    currency: 'USD',
                    maximumFractionDigits: 0
                  }).format(financialSummary.totalPaid)}
                </h3>
                <p className="text-xs text-green-600 mt-1">
                  {statusCounts[InvoiceStatus.PAID] || 0} invoices
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Total Invoices</p>
                  <FileText className="h-5 w-5 text-gray-500" />
                </div>
                <h3 className="text-2xl font-bold">
                  {financialSummary.invoiceCount}
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  {statusCounts[InvoiceStatus.DRAFT] || 0} drafts
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="pending" className="relative">
                  Pending
                  {((statusCounts[InvoiceStatus.PENDING] || 0) + (statusCounts[InvoiceStatus.PARTIALLY_PAID] || 0)) > 0 && (
                    <Badge className="ml-2 bg-blue-500">
                      {(statusCounts[InvoiceStatus.PENDING] || 0) + (statusCounts[InvoiceStatus.PARTIALLY_PAID] || 0)}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="overdue">
                  Overdue
                  {(statusCounts[InvoiceStatus.OVERDUE] || 0) > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {statusCounts[InvoiceStatus.OVERDUE] || 0}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="paid">Paid</TabsTrigger>
                <TabsTrigger value="drafts">Drafts</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
              
              {/* Search and Filters */}
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-[250px]"
                  />
                </div>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as InvoiceStatus | 'all')}
                  className="border rounded p-2"
                >
                  <option value="all">All Statuses</option>
                  {Object.entries(INVOICE_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Tab Contents */}
            <TabsContent value="pending" className="pt-4">
              <InvoiceList 
                invoices={filteredInvoices}
                isLoading={isLoading}
              />
            </TabsContent>
            
            <TabsContent value="overdue" className="pt-4">
              <InvoiceList 
                invoices={filteredInvoices}
                isLoading={isLoading}
              />
            </TabsContent>
            
            <TabsContent value="paid" className="pt-4">
              <InvoiceList 
                invoices={filteredInvoices}
                isLoading={isLoading}
              />
            </TabsContent>
            
            <TabsContent value="drafts" className="pt-4">
              <InvoiceList 
                invoices={filteredInvoices}
                isLoading={isLoading}
              />
            </TabsContent>
            
            <TabsContent value="all" className="pt-4">
              <InvoiceList 
                invoices={filteredInvoices}
                isLoading={isLoading}
              />
            </TabsContent>
          </Tabs>
          
          {/* Date Range Filter (Optional) */}
          <div className="mt-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-sm font-medium mb-3">Date Range Filter</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">From</label>
                <Input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">To</label>
                <Input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDateRange({ start: '', end: '' })}
                disabled={!dateRange.start && !dateRange.end}
              >
                Clear Dates
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};