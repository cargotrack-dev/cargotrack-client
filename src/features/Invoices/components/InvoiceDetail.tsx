// src/components/invoices/InvoiceDetail.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInvoice } from '../hooks/useInvoice';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '../../UI/components/ui/card';
import { Button } from '../../UI/components/ui/button';
import { Badge } from '../../UI/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../UI/components/ui/table';
import {
  ChevronLeft,
  Calendar,
  CreditCard,
  Edit,
  Printer,
  Download,
  Send,
  Trash2,
  CheckCircle,
  DollarSign,
  Mail,
  Phone
} from 'lucide-react';
import {
  InvoiceStatus,
  PaymentMethod,
  INVOICE_STATUS_COLORS,
  INVOICE_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  Invoice,         // Add this for the invoice object
  InvoiceItem,     // Add this for invoice items
  TaxItem,         // Add this for tax objects
  DiscountItem,    // Add this for discount objects
  PaymentRecord    // Add this for payment records
} from '../types/invoice';

type HookInvoice = {
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
  items: {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
    taxable: boolean;
    waybillId?: string;
    notes?: string;
  }[];
  taxes: {
    id: string;
    name: string;
    type: string; // String type instead of enum
    rate: number;
    amount: number;
  }[];
  discounts: {
    id: string;
    name: string;
    type: string; // String type instead of enum
    rate: number;
    amount: number;
  }[];
  payments: {
    id: string;
    date: string;
    amount: number;
    method: string;
    reference?: string;
    notes?: string;
  }[];
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

export const InvoiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getInvoice, updateInvoice, deleteInvoice, isLoading } = useInvoice();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEmailSending, setIsEmailSending] = useState(false);

  const invoice = id ? (getInvoice(id) as HookInvoice as Invoice) : undefined;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-xl font-semibold mb-2">Invoice Not Found</h2>
        <p className="text-gray-500 mb-4">The requested invoice could not be found.</p>
        <Button onClick={() => navigate('/invoices')}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Invoices
        </Button>
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Format currency amount
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: invoice.currency
    }).format(amount);
  };

  // Calculate days until due or days overdue
  const getDueDateInfo = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(invoice.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
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
    } else {
      return {
        message: `Due in ${diffDays} days`,
        className: 'text-blue-600'
      };
    }
  };

  // Handle deleting the invoice
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteInvoice(id as string);
      navigate('/invoices');
    } catch (error) {
      console.error('Failed to delete invoice:', error);
      setIsDeleting(false);
    }
  };

  // Handle marking as paid
  const handleMarkAsPaid = async () => {
    if (!window.confirm('Mark this invoice as paid in full?')) {
      return;
    }

    setIsUpdating(true);
    try {
      await updateInvoice(id as string, {
        status: InvoiceStatus.PAID,
        balance: 0,
        payments: [
          ...invoice.payments,
          {
            id: `payment-${Math.random().toString(36).substr(2, 9)}`,
            date: new Date().toISOString(),
            amount: invoice.balance,
            method: PaymentMethod.BANK_TRANSFER,
            reference: 'Marked as paid manually',
            notes: 'Invoice marked as paid in full'
          }
        ]
      });
    } catch (error) {
      console.error('Failed to mark invoice as paid:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle marking as sent
  const handleMarkAsSent = async () => {
    setIsUpdating(true);
    try {
      await updateInvoice(id as string, {
        status: invoice.status === InvoiceStatus.DRAFT ? InvoiceStatus.PENDING : invoice.status
      });
    } catch (error) {
      console.error('Failed to mark invoice as sent:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle sending invoice via email
  const handleSendEmail = async () => {
    setIsEmailSending(true);
    try {
      // In a real app, this would send an email via API
      await new Promise(resolve => setTimeout(resolve, 1500));
      await updateInvoice(id as string, {
        status: invoice.status === InvoiceStatus.DRAFT ? InvoiceStatus.PENDING : invoice.status
      });
      alert('Invoice has been sent to the client.');
    } catch (error) {
      console.error('Failed to send invoice email:', error);
    } finally {
      setIsEmailSending(false);
    }
  };

  // Handle print invoice
  const handlePrint = () => {
    window.print();
  };

  // Handle download invoice as PDF
  const handleDownload = () => {
    // In a real app, this would generate a PDF for download
    alert('PDF download feature would be implemented here');
  };

  const dueDateInfo = getDueDateInfo();

  return (
    <div className="space-y-6 print:p-8" id="invoice-detail">
      <div className="flex items-center justify-between print:hidden">
        <Button variant="outline" onClick={() => navigate('/invoices')} className="mr-4">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Invoices
        </Button>

        <div className="flex space-x-2">
          {invoice.status === InvoiceStatus.DRAFT && (
            <Button
              variant="outline"
              onClick={() => navigate(`/invoices/edit/${id}`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}

          <Button
            variant="outline"
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>

          <Button
            variant="outline"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>

          {invoice.status === InvoiceStatus.DRAFT && (
            <Button
              variant="outline"
              onClick={handleMarkAsSent}
              disabled={isUpdating}
            >
              <Send className="h-4 w-4 mr-2" />
              {isUpdating ? 'Updating...' : 'Mark as Sent'}
            </Button>
          )}

          <Button
            variant="outline"
            onClick={handleSendEmail}
            disabled={isEmailSending}
          >
            <Mail className="h-4 w-4 mr-2" />
            {isEmailSending ? 'Sending...' : 'Email Invoice'}
          </Button>

          {(invoice.status === InvoiceStatus.PENDING ||
            invoice.status === InvoiceStatus.PARTIALLY_PAID ||
            invoice.status === InvoiceStatus.OVERDUE) && (
              <Button
                onClick={handleMarkAsPaid}
                disabled={isUpdating}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {isUpdating ? 'Updating...' : 'Mark as Paid'}
              </Button>
            )}

          {invoice.status === InvoiceStatus.DRAFT && (
            <Button
              variant="outline"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-500 border-red-300 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          )}
        </div>
      </div>

      <div className="print:mt-0">
        {/* Invoice Header */}
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invoice</h1>
            <p className="text-gray-500">{invoice.invoiceNumber}</p>
          </div>
          <Badge className={`${INVOICE_STATUS_COLORS[invoice.status as InvoiceStatus]} bg-opacity-80 text-lg py-1 px-3`}>
            {INVOICE_STATUS_LABELS[invoice.status as InvoiceStatus]}
          </Badge>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-lg font-semibold mb-2">Bill To</h2>
            <div className="space-y-1">
              <p className="font-medium">{invoice.clientName}</p>
              <p>{invoice.clientContact}</p>
              <p>{invoice.clientAddress}</p>
              <p className="flex items-center">
                <Mail className="h-4 w-4 mr-1 text-gray-500" />
                {invoice.clientEmail}
              </p>
              {invoice.clientPhone && (
                <p className="flex items-center">
                  <Phone className="h-4 w-4 mr-1 text-gray-500" />
                  {invoice.clientPhone}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Invoice Details</h2>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-gray-500">Invoice Number:</div>
                <div>{invoice.invoiceNumber}</div>

                <div className="text-gray-500">Issue Date:</div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                  {formatDate(invoice.issueDate)}
                </div>

                <div className="text-gray-500">Due Date:</div>
                <div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                    {formatDate(invoice.dueDate)}
                  </div>
                  {invoice.status !== InvoiceStatus.PAID && (
                    <div className={`text-sm ${dueDateInfo.className}`}>
                      {dueDateInfo.message}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {invoice.status === InvoiceStatus.PAID && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3">
                <div className="flex items-center text-green-700">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span className="font-medium">Paid in Full</span>
                </div>
                <p className="text-sm text-green-600 mt-1">
                  Thank you for your payment of {formatCurrency(invoice.total)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Invoice Items */}
        <Card className="mb-8">
          <CardHeader className="bg-gray-50 py-4">
            <CardTitle>Invoice Items</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Description</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.items.map((item: InvoiceItem) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.description}
                      {item.notes && (
                        <p className="text-sm text-gray-500 mt-1">{item.notes}</p>
                      )}
                    </TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Invoice Summary */}
        <div className="flex justify-end mb-8">
          <div className="w-full max-w-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal:</span>
                <span>{formatCurrency(invoice.subtotal)}</span>
              </div>

              {invoice.taxes.map((tax: TaxItem) => (
                <div key={tax.id} className="flex justify-between">
                  <span className="text-gray-500">
                    {tax.name} ({tax.type === 'percentage' ? `${tax.rate}%` : 'Flat'}):
                  </span>
                  <span>{formatCurrency(tax.amount)}</span>
                </div>
              ))}

              {invoice.discounts.map((discount: DiscountItem) => (
                <div key={discount.id} className="flex justify-between">
                  <span className="text-gray-500">
                    {discount.name} ({discount.type === 'percentage' ? `${discount.rate}%` : 'Flat'}):
                  </span>
                  <span>-{formatCurrency(discount.amount)}</span>
                </div>
              ))}

              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(invoice.total)}</span>
                </div>
              </div>

              {invoice.payments.length > 0 && (
                <>
                  <div className="border-t pt-2 mt-2">
                    <p className="text-sm font-medium mb-1">Payments</p>
                    {invoice.payments.map((payment: PaymentRecord) => (
                      <div key={payment.id} className="flex justify-between text-sm">
                        <span className="text-gray-500">
                          {formatDate(payment.date)} - {PAYMENT_METHOD_LABELS[payment.method as PaymentMethod]}:
                        </span>
                        <span className="text-green-600">-{formatCurrency(payment.amount)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold">
                      <span>Balance Due:</span>
                      <span>{formatCurrency(invoice.balance)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Notes & Terms */}
        {(invoice.notes || invoice.terms) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {invoice.notes && (
              <div>
                <h3 className="font-medium mb-2">Notes</h3>
                <p className="text-sm text-gray-600 whitespace-pre-line">{invoice.notes}</p>
              </div>
            )}

            {invoice.terms && (
              <div>
                <h3 className="font-medium mb-2">Terms and Conditions</h3>
                <p className="text-sm text-gray-600 whitespace-pre-line">{invoice.terms}</p>
              </div>
            )}
          </div>
        )}

        {/* Payment Instructions */}
        {invoice.status !== InvoiceStatus.PAID && invoice.status !== InvoiceStatus.CANCELLED && (
          <Card className="print:break-before-page">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center text-blue-800">
                <CreditCard className="h-5 w-5 mr-2" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Payment Methods</h3>
                  <ul className="mt-2 space-y-2">
                    <li className="flex items-start">
                      <CreditCard className="h-5 w-5 mr-2 text-gray-500" />
                      <span>
                        <span className="font-medium">Credit Card:</span> Pay online using the link in the email.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <DollarSign className="h-5 w-5 mr-2 text-gray-500" />
                      <span>
                        <span className="font-medium">Bank Transfer:</span> Please use the invoice number as the payment reference.
                      </span>
                    </li>
                  </ul>
                </div>

                {invoice.status !== InvoiceStatus.DRAFT && (
                  <div className="flex justify-end">
                    <Button
                      onClick={() => navigate(`/invoices/${id}/payment`)}
                    >
                      Make Payment
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};