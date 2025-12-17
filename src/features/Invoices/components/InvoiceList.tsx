// src/components/invoices/InvoiceList.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../UI/components/ui/table';
import { Button } from '../../UI/components/ui/button';
import { Badge } from '../../UI/components/ui/badge';
import { 
  FileText, 
  ExternalLink, 
  Calendar,
  CreditCard,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { 
  Invoice, 
  InvoiceStatus,
  INVOICE_STATUS_COLORS,
  INVOICE_STATUS_LABELS
} from '../types/invoice';

interface InvoiceListProps {
  invoices: Invoice[];
  isLoading: boolean;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({ invoices, isLoading }) => {
  const navigate = useNavigate();

  const viewInvoiceDetails = (id: string) => {
    navigate(`/invoices/${id}`);
  };

  // Format date for readable display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Format currency amount
  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  // Calculate days remaining or days overdue
  const getDaysMessage = (dueDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return {
        message: `${Math.abs(diffDays)} days overdue`,
        className: 'text-red-600'
      };
    } else if (diffDays === 0) {
      return {
        message: 'Due today',
        className: 'text-orange-500 font-medium'
      };
    } else if (diffDays === 1) {
      return {
        message: 'Due tomorrow',
        className: 'text-orange-500'
      };
    } else if (diffDays <= 7) {
      return {
        message: `Due in ${diffDays} days`,
        className: 'text-yellow-600'
      };
    } else {
      return {
        message: `Due in ${diffDays} days`,
        className: 'text-gray-600'
      };
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-lg">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500">No invoices found matching your criteria.</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate('/invoices/new')}
        >
          Create New Invoice
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice #</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Issue Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => {
            const { message, className } = getDaysMessage(invoice.dueDate);
            const isPaid = invoice.status === InvoiceStatus.PAID;
            const isOverdue = invoice.status === InvoiceStatus.OVERDUE;
            
            return (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">
                  {invoice.invoiceNumber}
                </TableCell>
                
                <TableCell>
                  <div>
                    <div className="font-medium">{invoice.clientName}</div>
                    <div className="text-sm text-gray-500">{invoice.clientEmail}</div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                    {formatDate(invoice.issueDate)}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                      {formatDate(invoice.dueDate)}
                    </div>
                    {!isPaid && (
                      <div className={`text-xs ${className} mt-1`}>
                        {message}
                      </div>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="font-medium">
                    {formatCurrency(invoice.total, invoice.currency)}
                  </div>
                  
                  {isPaid ? (
                    <div className="flex items-center text-xs text-green-600 mt-1">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Paid in full
                    </div>
                  ) : invoice.payments.length > 0 ? (
                    <div className="text-xs text-blue-600 mt-1">
                      Balance: {formatCurrency(invoice.balance, invoice.currency)}
                    </div>
                  ) : isOverdue ? (
                    <div className="flex items-center text-xs text-red-600 mt-1">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Payment overdue
                    </div>
                  ) : null}
                </TableCell>
                
                <TableCell>
                  <Badge className={`${INVOICE_STATUS_COLORS[invoice.status]} bg-opacity-80`}>
                    {INVOICE_STATUS_LABELS[invoice.status]}
                  </Badge>
                </TableCell>
                
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => viewInvoiceDetails(invoice.id)}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    
                    {invoice.status !== InvoiceStatus.PAID && invoice.status !== InvoiceStatus.CANCELLED && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/invoices/${invoice.id}/payment`)}
                      >
                        <CreditCard className="h-4 w-4 mr-1" />
                        Pay
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};