// src/features/Dashboard/pages/InvoiceDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  AlertTriangle,
  Check,
  Clock,
  X,
  DollarSign,
  Calendar,
  ArrowUpDown
} from 'lucide-react';
import { useAuth } from '@features/Core/hooks/useAuth';
import { ResourceType, PermissionAction } from '@features/Core/types/auth';
import PermissionGate from '@features/Core/auth/PermissionGate';

interface Invoice {
  id: string;
  invoiceNumber: string;
  client: {
    id: string;
    name: string;
  };
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  issueDate: string;
  dueDate: string;
  shipmentId?: string;
}

const InvoiceDashboard: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('issueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const navigate = useNavigate();
  const { hasPermission } = useAuth();

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        // const response = await api.get('/invoices');
        // setInvoices(response.data);
        
        // Mock data for demonstration
        const mockInvoices: Invoice[] = [
          {
            id: '1',
            invoiceNumber: 'INV-2023-0001',
            client: {
              id: 'c1',
              name: 'Acme Corporation'
            },
            amount: 2500.00,
            status: 'paid',
            issueDate: '2023-05-01T12:00:00Z',
            dueDate: '2023-05-15T12:00:00Z',
            shipmentId: 'SH-1001'
          },
          {
            id: '2',
            invoiceNumber: 'INV-2023-0002',
            client: {
              id: 'c2',
              name: 'Wayne Enterprises'
            },
            amount: 3750.50,
            status: 'pending',
            issueDate: '2023-05-05T12:00:00Z',
            dueDate: '2023-05-20T12:00:00Z',
            shipmentId: 'SH-1002'
          },
          {
            id: '3',
            invoiceNumber: 'INV-2023-0003',
            client: {
              id: 'c3',
              name: 'Stark Industries'
            },
            amount: 1200.75,
            status: 'overdue',
            issueDate: '2023-04-15T12:00:00Z',
            dueDate: '2023-04-30T12:00:00Z',
            shipmentId: 'SH-1003'
          },
          {
            id: '4',
            invoiceNumber: 'INV-2023-0004',
            client: {
              id: 'c4',
              name: 'LexCorp'
            },
            amount: 950.25,
            status: 'cancelled',
            issueDate: '2023-04-20T12:00:00Z',
            dueDate: '2023-05-05T12:00:00Z',
            shipmentId: 'SH-1004'
          },
          {
            id: '5',
            invoiceNumber: 'INV-2023-0005',
            client: {
              id: 'c1',
              name: 'Acme Corporation'
            },
            amount: 1850.00,
            status: 'pending',
            issueDate: '2023-05-10T12:00:00Z',
            dueDate: '2023-05-25T12:00:00Z',
            shipmentId: 'SH-1005'
          },
        ];
        
        setInvoices(mockInvoices);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching invoices:', err);
        setError('Failed to load invoices. Please try again later.');
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'overdue':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'cancelled':
        return <X className="w-5 h-5 text-gray-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Paid';
      case 'pending':
        return 'Pending';
      case 'overdue':
        return 'Overdue';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invoice.shipmentId && invoice.shipmentId.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'invoiceNumber':
        comparison = a.invoiceNumber.localeCompare(b.invoiceNumber);
        break;
      case 'client':
        comparison = a.client.name.localeCompare(b.client.name);
        break;
      case 'amount':
        comparison = a.amount - b.amount;
        break;
      case 'issueDate':
        comparison = new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime();
        break;
      case 'dueDate':
        comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        break;
      default:
        comparison = 0;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleInvoiceClick = (id: string) => {
    if (hasPermission({ resource: ResourceType.INVOICE, action: PermissionAction.READ })) {
      navigate(`/dashboard/invoices/${id}`);
    }
  };

  const handleCreateInvoice = () => {
    navigate('/dashboard/invoices/new');
  };

  const handleDownloadInvoice = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    // In a real app, this would trigger a download
    console.log(`Downloading invoice ${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Invoices</h3>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Invoice Management</h1>
        <PermissionGate 
          permissions={{ resource: ResourceType.INVOICE, action: PermissionAction.CREATE }}
        >
          <button
            onClick={handleCreateInvoice}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Create Invoice
          </button>
        </PermissionGate>
      </div>
      
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3"
                  placeholder="Search by invoice number, client, or shipment ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                className="focus:ring-blue-500 focus:border-blue-500 text-sm border-gray-300 rounded-md py-2"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('invoiceNumber')}
                >
                  <div className="flex items-center">
                    Invoice #
                    {sortField === 'invoiceNumber' && (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('client')}
                >
                  <div className="flex items-center">
                    Client
                    {sortField === 'client' && (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center">
                    Amount
                    {sortField === 'amount' && (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('issueDate')}
                >
                  <div className="flex items-center">
                    Issue Date
                    {sortField === 'issueDate' && (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('dueDate')}
                >
                  <div className="flex items-center">
                    Due Date
                    {sortField === 'dueDate' && (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedInvoices.length > 0 ? (
                sortedInvoices.map((invoice) => (
                  <tr 
                    key={invoice.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleInvoiceClick(invoice.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</span>
                      </div>
                      {invoice.shipmentId && (
                        <div className="text-xs text-gray-500 mt-1 ml-7">
                          Shipment: {invoice.shipmentId}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{invoice.client.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-500 mr-1" />
                        <span className="text-sm font-medium text-gray-900">{formatCurrency(invoice.amount)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(invoice.status)}
                        <span className={`ml-2 inline-flex text-xs px-2 py-1 rounded-full ${getStatusClass(invoice.status)}`}>
                          {getStatusText(invoice.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        {formatDate(invoice.issueDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        {formatDate(invoice.dueDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <PermissionGate 
                        permissions={{ resource: ResourceType.INVOICE, action: PermissionAction.READ }}
                      >
                        <button
                          onClick={(e) => handleDownloadInvoice(e, invoice.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Download className="h-5 w-5" />
                        </button>
                      </PermissionGate>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No invoices found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Invoices */}
        <div className="bg-white rounded-lg shadow px-6 py-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Total Invoices</h3>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{invoices.length}</p>
          <p className="text-sm text-gray-500 mt-1">All time</p>
        </div>
        
        {/* Pending Amount */}
        <div className="bg-white rounded-lg shadow px-6 py-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Pending</h3>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold mt-2">
            {formatCurrency(
              invoices
                .filter(invoice => invoice.status === 'pending')
                .reduce((sum, invoice) => sum + invoice.amount, 0)
            )}
          </p>
          <p className="text-sm text-gray-500 mt-1">{invoices.filter(invoice => invoice.status === 'pending').length} invoices</p>
        </div>
        
        {/* Overdue Amount */}
        <div className="bg-white rounded-lg shadow px-6 py-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Overdue</h3>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-2xl font-bold mt-2">
            {formatCurrency(
              invoices
                .filter(invoice => invoice.status === 'overdue')
                .reduce((sum, invoice) => sum + invoice.amount, 0)
            )}
          </p>
          <p className="text-sm text-gray-500 mt-1">{invoices.filter(invoice => invoice.status === 'overdue').length} invoices</p>
        </div>
        
        {/* Paid Amount */}
        <div className="bg-white rounded-lg shadow px-6 py-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Paid</h3>
            <Check className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-2xl font-bold mt-2">
            {formatCurrency(
              invoices
                .filter(invoice => invoice.status === 'paid')
                .reduce((sum, invoice) => sum + invoice.amount, 0)
            )}
          </p>
          <p className="text-sm text-gray-500 mt-1">{invoices.filter(invoice => invoice.status === 'paid').length} invoices</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDashboard;