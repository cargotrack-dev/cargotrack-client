// src/components/invoices/InvoiceEmailDialog.tsx
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '../../UI/components/ui/dialog';
import { Button } from '../../UI/components/ui/button';
import { Input } from '../../UI/components/ui/input';
import { Label } from '../../UI/components/ui/label';
import { Switch } from '../../UI/components/ui/switch';
import { Send, Paperclip, X } from 'lucide-react';
import { Invoice, EmailData } from '../types/invoice';
import { isValidEmail } from '../utils/invoiceUtils';

interface InvoiceEmailDialogProps {
  invoice: Invoice;
  onSend: (data: EmailData) => Promise<void>;
  onCancel: () => void;
}

export const InvoiceEmailDialog: React.FC<InvoiceEmailDialogProps> = ({
  invoice,
  onSend,
  onCancel,
}) => {
  const [isSending, setIsSending] = useState(false);
  const [emailData, setEmailData] = useState<EmailData>({
    to: invoice.clientEmail || '',
    subject: `Invoice #${invoice.invoiceNumber} from ${invoice.clientName}`,
    message: getDefaultEmailMessage(invoice),
    attachPdf: true,
  });
  
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmailData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear validation error when user edits the field
    if (name === 'to' && validationError) {
      setValidationError(null);
    }
  };
  
  // Handle sending the email
  const handleSend = async () => {
    // Validate email
    if (!emailData.to || !isValidEmail(emailData.to)) {
      setValidationError('Please enter a valid email address.');
      return;
    }
    
    // Validate content
    if (!emailData.subject.trim()) {
      setValidationError('Subject is required.');
      return;
    }
    
    if (!emailData.message.trim()) {
      setValidationError('Message is required.');
      return;
    }
    
    setIsSending(true);
    
    try {
      await onSend(emailData);
    } catch (error) {
      console.error('Error sending email:', error);
      setValidationError('Failed to send email. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Send Invoice via Email</DialogTitle>
          <DialogDescription>
            Send invoice #{invoice.invoiceNumber} to your client via email.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {validationError && (
            <div className="text-sm font-medium text-red-500 bg-red-50 p-3 rounded border border-red-200">
              {validationError}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="to">To <span className="text-red-500">*</span></Label>
            <Input
              id="to"
              name="to"
              type="email"
              value={emailData.to}
              onChange={handleChange}
              placeholder="client@example.com"
              className={validationError && !emailData.to ? "border-red-500" : ""}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cc">CC</Label>
              <Input
                id="cc"
                name="cc"
                type="email"
                value={cc}
                onChange={(e) => setCc(e.target.value)}
                placeholder="cc@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bcc">BCC</Label>
              <Input
                id="bcc"
                name="bcc"
                type="email"
                value={bcc}
                onChange={(e) => setBcc(e.target.value)}
                placeholder="bcc@example.com"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">Subject <span className="text-red-500">*</span></Label>
            <Input
              id="subject"
              name="subject"
              value={emailData.subject}
              onChange={handleChange}
              className={validationError && !emailData.subject ? "border-red-500" : ""}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message <span className="text-red-500">*</span></Label>
            <textarea
              id="message"
              name="message"
              className={`w-full border rounded p-2 min-h-[150px] ${
                validationError && !emailData.message ? "border-red-500" : "border-input"
              }`}
              value={emailData.message}
              onChange={handleChange}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="attachPdf"
              checked={emailData.attachPdf}
              onCheckedChange={(checked) => 
                setEmailData((prev) => ({ ...prev, attachPdf: checked }))
              }
            />
            <Label htmlFor="attachPdf" className="flex items-center">
              <Paperclip className="h-4 w-4 mr-1" />
              Attach invoice as PDF
            </Label>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSend}
            disabled={isSending}
          >
            <Send className="h-4 w-4 mr-2" />
            {isSending ? 'Sending...' : 'Send Email'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Helper function to generate the default email message
function getDefaultEmailMessage(invoice: Invoice): string {
  const dueDate = new Date(invoice.dueDate).toLocaleDateString();
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: invoice.currency,
  });
  
  return `Dear ${invoice.clientContact || invoice.clientName},

Please find attached invoice #${invoice.invoiceNumber} for ${currencyFormatter.format(invoice.total)}.

Invoice details:
- Invoice Number: ${invoice.invoiceNumber}
- Issue Date: ${new Date(invoice.issueDate).toLocaleDateString()}
- Due Date: ${dueDate}
- Amount Due: ${currencyFormatter.format(invoice.balance)}

${invoice.balance <= 0 
  ? 'This invoice has been fully paid. Thank you for your business.'
  : `Please make payment by ${dueDate}. If you have any questions, feel free to contact us.`}

Thank you for your business!

Best regards,
Your Company Name`;
}

export default InvoiceEmailDialog;