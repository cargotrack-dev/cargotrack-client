// src/pages/invoices/InvoiceList.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// You'll likely have an invoice type defined in your types
interface Invoice {
  id: string;
  invoiceNumber: string;
  client: {
    id: string;
    name: string;
  };
  status: 'DRAFT' | 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  amount: number;
  currency: string;
  issueDate: string;
  dueDate: string;
  shipmentIds: string[];
}

export const InvoiceList: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Use useMemo to memoize the mock data to prevent recreating it on each render
  const mockInvoices = useMemo<Invoice[]>(() => [
    {
      id: 'inv-001',
      invoiceNumber: 'INV-2023-001',
      client: {
        id: 'client-001',
        name: 'Acme Corporation'
      },
      status: 'PAID',
      amount: 5800.50,
      currency: 'USD',
      issueDate: '2023-03-10',
      dueDate: '2023-04-10',
      shipmentIds: ['ship-001', 'ship-002']
    },
    {
      id: 'inv-002',
      invoiceNumber: 'INV-2023-002',
      client: {
        id: 'client-002',
        name: 'Globex Industries'
      },
      status: 'PENDING',
      amount: 3250.75,
      currency: 'USD',
      issueDate: '2023-03-15',
      dueDate: '2023-04-15',
      shipmentIds: ['ship-003']
    },
    {
      id: 'inv-003',
      invoiceNumber: 'INV-2023-003',
      client: {
        id: 'client-003',
        name: 'Oceanic Shipping'
      },
      status: 'OVERDUE',
      amount: 12500.00,
      currency: 'USD',
      issueDate: '2023-02-20',
      dueDate: '2023-03-20',
      shipmentIds: ['ship-004', 'ship-005', 'ship-006']
    },
    {
      id: 'inv-004',
      invoiceNumber: 'INV-2023-004',
      client: {
        id: 'client-001',
        name: 'Acme Corporation'
      },
      status: 'DRAFT',
      amount: 4200.00,
      currency: 'USD',
      issueDate: '2023-03-25',
      dueDate: '2023-04-25',
      shipmentIds: ['ship-007']
    }
  ], []);

  useEffect(() => {
    // Simulate API call
    const fetchInvoices = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setInvoices(mockInvoices);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, [mockInvoices]); // Include mockInvoices in the dependency array

  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const handleViewInvoice = (id: string) => {
    navigate(`/invoices/${id}`);
  };

  const handleCreateInvoice = () => {
    navigate('/invoices/new');
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoice Management</h1>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleCreateInvoice}
        >
          Create Invoice
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr 
                  key={invoice.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleViewInvoice(invoice.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{invoice.client.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatCurrency(invoice.amount, invoice.currency)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{invoice.issueDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{invoice.dueDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      className="text-blue-600 hover:text-blue-900 mr-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewInvoice(invoice.id);
                      }}
                    >
                      View
                    </button>
                    <button 
                      className="text-blue-600 hover:text-blue-900 mr-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add edit function
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add delete function
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>This is a stub implementation. Replace with your actual invoice component.</p>
      </div>
    </div>
  );
};