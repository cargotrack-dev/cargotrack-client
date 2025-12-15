// src/features/Invoices/index.ts
// Export components
export { GenerateFromWaybill } from './components/GenerateFromWaybill';
export { InvoiceDetail } from './components/InvoiceDetail';
export { InvoiceEmailDialog } from './components/InvoiceEmailDialog';
export { InvoiceForm } from './components/InvoiceForm';
export { InvoiceGenerator } from './components/InvoiceGenerator';
export { InvoiceList } from './components/InvoiceList';
export { InvoicePayment } from './components/InvoicePayment';
export { InvoicePreview } from './components/InvoicePreview';
export { InvoiceTemplateEditor } from './components/InvoiceTemplateEditor';
export { InvoiceTemplateSelector } from './components/InvoiceTemplateSelector';
export { InvoiceDashboard } from './components/InvoiceDashboard';
export { InvoiceGenerationForm } from './components/InvoiceGenerationForm';
export { PaymentRecordingForm } from './components/PaymentRecordingForm';

// Export pages
export { InvoiceDetails as InvoiceDetailsPage }  from './pages/InvoiceDetails';
export { InvoiceGenerator as InvoiceGeneratorPage } from './pages/InvoiceGenerator';
export { InvoiceList as InvoiceListPage } from './pages/InvoiceList';

// Export contexts
export * from './contexts/index';

// Export hooks
export { useInvoice } from './hooks/useInvoice';

// Export services
export { InvoicePdfGenerator } from './services/InvoicePdfGenerator';
export { InvoiceTemplateService } from './services/InvoiceTemplateService';

// Export types
export * from './types/invoice';
export * from './types/invoice-templates';

// Export utils
export {
  calculateInvoiceTotal,
  calculateTax,
  formatCurrency,
  getStatusLabel,
  getStatusColor,
  isInvoiceOverdue,
  generateInvoiceNumber
} from './utils/invoiceUtils';
// Export financial types
export * from './types/financials';

// Export FinancialDashboard
export { default as FinancialDashboard } from './components/FinancialDashboard';
