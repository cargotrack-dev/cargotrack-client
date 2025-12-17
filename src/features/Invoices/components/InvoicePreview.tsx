// src/components/invoices/InvoicePreview.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../UI/components/ui/card';
import { Button } from '../../UI/components/ui/button';
import { Download, Printer } from 'lucide-react';
import { useToast } from '../../UI/components/ui/toast/useToast';
import { Invoice } from '../types/invoice';

// Define the InvoiceTemplate interface
interface InvoiceTemplate {
  id: string;
  name: string;
  fontFamily: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyWebsite: string;
  showHeaderTitle: boolean;
  headerTitle: string;
  showHeaderSubtitle: boolean;
  headerSubtitle: string;
  fontSize: 'small' | 'medium' | 'large';
  showTaxDetails: boolean;
  showPaymentTerms: boolean;
  defaultPaymentTerms: string;
  showNotes: boolean;
  showSignatureArea: boolean;
  signatureLabel: string;
  showQRCode: boolean;
  showFooter: boolean;
  footerText: string;
}

interface InvoicePreviewProps {
  invoice: Invoice;
  templateId?: string;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice, templateId }) => {
  const { addToast } = useToast();
  const [template, setTemplate] = useState<InvoiceTemplate | null>(null);
  
  // Fetch the selected template
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        if (!templateId) {
          // Fetch default template if no templateId provided
          const response = await fetch('/api/invoice-templates/default');
          if (!response.ok) {
            throw new Error('Failed to load default template');
          }
          const data = await response.json();
          setTemplate(data);
          return;
        }
        
        // Fetch specific template
        const response = await fetch(`/api/invoice-templates/${templateId}`);
        if (!response.ok) {
          throw new Error('Failed to load template');
        }
        const data = await response.json();
        setTemplate(data);
      } catch (error) {
        console.error('Error loading template:', error);
        // Fallback to a simple preview without template
        setTemplate(null);
      }
    };
    
    fetchTemplate();
  }, [templateId]);
  
  // Handle print invoice
  const handlePrintInvoice = () => {
    window.print();
  };
  
  // Handle download invoice as PDF
  const handleDownloadPdf = () => {
    // In a real app, this would call an API to generate a PDF
    addToast({
      title: 'PDF Generated',
      description: 'Invoice PDF has been generated and downloaded',
      variant: 'default'
    });
  };
  
  // If template is still loading
  if (!template && templateId) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-500">
          Loading invoice preview...
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div>
      <div className="flex justify-end mb-4 space-x-2 print:hidden">
        <Button variant="outline" onClick={handlePrintInvoice}>
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
        <Button variant="outline" onClick={handleDownloadPdf}>
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>
      
      <div className="bg-white border rounded-lg p-8" id="invoice-preview">
        {/* If we have a template, render according to template */}
        {template ? (
          <TemplatedInvoice invoice={invoice} template={template} />
        ) : (
          <SimpleInvoice invoice={invoice} />
        )}
      </div>
    </div>
  );
};

// Simple invoice preview (fallback)
const SimpleInvoice: React.FC<{ invoice: Invoice }> = ({ invoice }) => {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-800">INVOICE</h1>
          <div className="text-sm text-gray-600 mt-1">
            <p>Your Company Name</p>
            <p>123 Business Street, City, Country</p>
            <p>billing@yourcompany.com</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm">
            <div className="mb-1">
              <span className="font-bold">Invoice Number: </span>
              <span>{invoice.invoiceNumber}</span>
            </div>
            <div className="mb-1">
              <span className="font-bold">Issue Date: </span>
              <span>{new Date(invoice.issueDate).toLocaleDateString()}</span>
            </div>
            <div className="mb-1">
              <span className="font-bold">Due Date: </span>
              <span>{new Date(invoice.dueDate).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="font-bold">Status: </span>
              <span className="inline-block px-2 py-1 bg-blue-500 text-white rounded-full text-xs">
                {invoice.status}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Client Section */}
      <div>
        <h2 className="text-lg font-bold mb-2 text-blue-800">Bill To:</h2>
        <div className="p-4 border rounded bg-gray-50">
          <p className="font-bold">{invoice.clientName}</p>
          <p>{invoice.clientContact}</p>
          <p>{invoice.clientAddress}</p>
          <p>{invoice.clientEmail}</p>
          <p>{invoice.clientPhone}</p>
        </div>
      </div>
      
      {/* Items Section */}
      <div>
        <h2 className="text-lg font-bold mb-2 text-blue-800">Items</h2>
        <table className="w-full border-collapse">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-2 border text-left">Description</th>
              <th className="p-2 border text-right">Quantity</th>
              <th className="p-2 border text-right">Unit Price</th>
              <th className="p-2 border text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id}>
                <td className="p-2 border">{item.description}</td>
                <td className="p-2 border text-right">{item.quantity}</td>
                <td className="p-2 border text-right">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: invoice.currency
                  }).format(item.unitPrice)}
                </td>
                <td className="p-2 border text-right">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: invoice.currency
                  }).format(item.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Summary Section */}
      <div className="flex justify-end">
        <div className="w-1/3 space-y-2">
          <div className="flex justify-between border-b pb-2">
            <span>Subtotal:</span>
            <span>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: invoice.currency
              }).format(invoice.subtotal)}
            </span>
          </div>
          
          {invoice.taxes.length > 0 && (
            <div>
              {invoice.taxes.map((tax) => (
                <div key={tax.id} className="flex justify-between">
                  <span>{tax.name} ({tax.type === 'percentage' ? `${tax.rate}%` : 'Fixed'}):</span>
                  <span>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: invoice.currency
                    }).format(tax.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
          
          {invoice.discounts.length > 0 && (
            <div>
              {invoice.discounts.map((discount) => (
                <div key={discount.id} className="flex justify-between">
                  <span>{discount.name} ({discount.type === 'percentage' ? `${discount.rate}%` : 'Fixed'}):</span>
                  <span>
                    -{new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: invoice.currency
                    }).format(discount.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex justify-between font-bold text-lg pt-2">
            <span>Total:</span>
            <span>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: invoice.currency
              }).format(invoice.total)}
            </span>
          </div>
          
          {invoice.payments.length > 0 && (
            <div>
              {invoice.payments.map((payment) => (
                <div key={payment.id} className="flex justify-between text-green-700">
                  <span>Payment ({new Date(payment.date).toLocaleDateString()}):</span>
                  <span>
                    -{new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: invoice.currency
                    }).format(payment.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex justify-between font-bold pt-2 border-t">
            <span>Balance Due:</span>
            <span className="text-blue-800">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: invoice.currency
              }).format(invoice.balance)}
            </span>
          </div>
        </div>
      </div>
      
      {/* Notes & Terms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t">
        {invoice.notes && (
          <div>
            <h3 className="font-bold mb-2">Notes</h3>
            <p className="text-sm text-gray-700">{invoice.notes}</p>
          </div>
        )}
        
        <div>
          <h3 className="font-bold mb-2">Terms & Conditions</h3>
          <p className="text-sm text-gray-700">{invoice.terms}</p>
        </div>
      </div>
      
      {/* Footer */}
      <div className="text-center text-sm text-gray-500 pt-6 mt-8 border-t">
        Thank you for your business!
      </div>
    </div>
  );
};

// Template-based invoice preview
const TemplatedInvoice: React.FC<{ invoice: Invoice; template: InvoiceTemplate }> = ({ invoice, template }) => {
  return (
    <div className="space-y-8" style={{ fontFamily: template.fontFamily }}>
      {/* Header Section */}
      <div className="flex justify-between">
        <div>
          {template.logoUrl && (
            <img 
              src={template.logoUrl} 
              alt={template.companyName} 
              className="max-h-16 mb-2"
            />
          )}
          <h1 className="text-xl font-bold" style={{ color: template.primaryColor }}>
            {template.companyName}
          </h1>
          <div className="text-sm text-gray-600">
            <p>{template.companyAddress}</p>
            <p>{template.companyPhone} | {template.companyEmail}</p>
            <p>{template.companyWebsite}</p>
          </div>
        </div>
        
        <div className="text-right">
          {template.showHeaderTitle && (
            <h1 className="text-2xl font-bold" style={{ color: template.primaryColor }}>
              {template.headerTitle}
            </h1>
          )}
          {template.showHeaderSubtitle && (
            <p className="text-gray-600 mt-1">{template.headerSubtitle}</p>
          )}
          
          <div className="mt-4 p-3 rounded" style={{ backgroundColor: template.secondaryColor }}>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="font-semibold">Invoice Number:</p>
                <p>{invoice.invoiceNumber}</p>
              </div>
              <div>
                <p className="font-semibold">Issue Date:</p>
                <p>{new Date(invoice.issueDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="font-semibold">Due Date:</p>
                <p>{new Date(invoice.dueDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="font-semibold">Status:</p>
                <p className="inline-block px-2 py-1 rounded-full text-xs font-semibold" style={{ 
                  backgroundColor: template.primaryColor,
                  color: '#ffffff'
                }}>
                  {invoice.status}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Client Section */}
      <div>
        <h2 className="text-lg font-bold mb-2" style={{ color: template.primaryColor }}>
          Client Information
        </h2>
        <div className="p-4 border rounded">
          <p className="font-bold">{invoice.clientName}</p>
          <p>{invoice.clientContact}</p>
          <p>{invoice.clientAddress}</p>
          <p>{invoice.clientEmail}</p>
          <p>{invoice.clientPhone}</p>
        </div>
      </div>
      
      {/* Items Section */}
      <div>
        <h2 className="text-lg font-bold mb-2" style={{ color: template.primaryColor }}>
          Items
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border" style={{ 
            fontSize: template.fontSize === 'small' ? '0.875rem' : template.fontSize === 'medium' ? '1rem' : '1.125rem'
          }}>
            <thead>
              <tr style={{ backgroundColor: template.primaryColor, color: '#ffffff' }}>
                <th className="py-2 px-4 border text-left">Description</th>
                <th className="py-2 px-4 border text-right">Quantity</th>
                <th className="py-2 px-4 border text-right">Unit Price</th>
                <th className="py-2 px-4 border text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-2 px-4 border">{item.description}</td>
                  <td className="py-2 px-4 border text-right">{item.quantity}</td>
                  <td className="py-2 px-4 border text-right">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: invoice.currency
                    }).format(item.unitPrice)}
                  </td>
                  <td className="py-2 px-4 border text-right">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: invoice.currency
                    }).format(item.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Summary Section */}
      <div className="flex justify-end">
        <div className="w-1/3">
          <div className="flex justify-between py-2">
            <span className="font-semibold">Subtotal:</span>
            <span>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: invoice.currency
              }).format(invoice.subtotal)}
            </span>
          </div>
          
          {template.showTaxDetails && invoice.taxes.map((tax) => (
            <div key={tax.id} className="flex justify-between py-2">
              <span className="font-semibold">
                {tax.name} ({tax.type === 'percentage' ? `${tax.rate}%` : 'Fixed'}):
              </span>
              <span>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: invoice.currency
                }).format(tax.amount)}
              </span>
            </div>
          ))}
          
          {invoice.discounts.map((discount) => (
            <div key={discount.id} className="flex justify-between py-2">
              <span className="font-semibold">
                {discount.name} ({discount.type === 'percentage' ? `${discount.rate}%` : 'Fixed'}):
              </span>
              <span>
                -{new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: invoice.currency
                }).format(discount.amount)}
              </span>
            </div>
          ))}
          
          <div className="flex justify-between py-2 font-bold text-lg" style={{ color: template.primaryColor }}>
            <span>Total:</span>
            <span>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: invoice.currency
              }).format(invoice.total)}
            </span>
          </div>
          
          {invoice.payments.map((payment) => (
            <div key={payment.id} className="flex justify-between py-2 text-green-700">
              <span>Payment ({new Date(payment.date).toLocaleDateString()}):</span>
              <span>
                -{new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: invoice.currency
                }).format(payment.amount)}
              </span>
            </div>
          ))}
          
          <div className="flex justify-between py-2 border-t border-gray-300 mt-1 font-bold">
            <span>Balance Due:</span>
            <span style={{ color: template.primaryColor }}>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: invoice.currency
              }).format(invoice.balance)}
            </span>
          </div>
        </div>
      </div>
      
      {/* Payment Terms */}
      {template.showPaymentTerms && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2" style={{ color: template.primaryColor }}>
            Payment Terms
          </h2>
          <div className="p-4 border rounded bg-gray-50">
            <p>{invoice.terms || template.defaultPaymentTerms}</p>
          </div>
        </div>
      )}
      
      {/* Notes */}
      {template.showNotes && invoice.notes && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2" style={{ color: template.primaryColor }}>
            Notes
          </h2>
          <div className="p-4 border rounded bg-gray-50">
            <p>{invoice.notes}</p>
          </div>
        </div>
      )}
      
      {/* Signature Area */}
      {template.showSignatureArea && (
        <div className="mt-12 mb-6">
          <div className="border-t border-gray-300 pt-4 mt-8 w-48">
            <p className="text-sm text-gray-500">{template.signatureLabel}</p>
          </div>
        </div>
      )}
      
      {/* QR Code */}
      {template.showQRCode && (
        <div className="flex justify-end mb-6">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 mx-auto border">
              {/* Placeholder for QR Code */}
              <div className="flex items-center justify-center h-full text-xs text-gray-500">
                QR Code
              </div>
            </div>
            <p className="text-xs mt-1 text-gray-500">Scan to pay</p>
          </div>
        </div>
      )}
      
      {/* Footer */}
      {template.showFooter && (
        <div className="text-center text-sm text-gray-500 mt-12 pt-4 border-t">
          {template.footerText}
        </div>
      )}
    </div>
  );
};

export default InvoicePreview;