// client/src/components/Financial/PaymentRecordingForm.tsx
import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Card, 
  CardContent, 
  CircularProgress, 
  Divider, 
  FormControl, 
  FormHelperText,
  Grid as MuiGrid, 
  InputAdornment,
  InputLabel, 
  MenuItem, 
  Select, 
  TextField, 
  Typography,
  Alert,
  Paper
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format } from 'date-fns';
import { apiClient } from '../services/api/apiClient';

// Create a custom Grid component to work around TypeScript issues
interface GridProps {
  children: React.ReactNode;
  container?: boolean;
  item?: boolean;
  xs?: number | boolean;
  sm?: number | boolean;
  md?: number | boolean;
  lg?: number | boolean;
  xl?: number | boolean;
  spacing?: number;
  sx?: Record<string, unknown>;
  [key: string]: unknown;
}

// Type-safe wrapper for MUI Grid
const Grid = ({ children, ...props }: GridProps) => {
  return <MuiGrid {...props}>{children}</MuiGrid>;
};

interface PaymentRecordingFormProps {
  onPaymentRecorded: (paymentId: string) => void;
  invoiceId?: string; // Optional - if provided, pre-selects the invoice
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  dueDate: Date;
  status: string;
}

interface ApiInvoice {
  id: string;
  invoiceNumber: string;
  client: {
    name: string;
  };
  totalAmount: number;
  paidAmount?: number;
  dueDate: string;
  status: string;
}

const paymentMethods = [
  { value: 'CREDIT_CARD', label: 'Credit Card' },
  { value: 'CHECK', label: 'Check' },
  { value: 'CASH', label: 'Cash' },
  { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
  { value: 'OTHER', label: 'Other' }
];

export const PaymentRecordingForm: React.FC<PaymentRecordingFormProps> = ({ onPaymentRecorded, invoiceId }) => {
  // Form state
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>(invoiceId || '');
  const [amount, setAmount] = useState<number | ''>('');
  const [paymentDate, setPaymentDate] = useState<Date | null>(new Date());
  const [paymentMethod, setPaymentMethod] = useState<string>('BANK_TRANSFER');
  const [transactionId, setTransactionId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  
  // Data state
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  
  // UI state
  const [loading, setLoading] = useState<boolean>(false);
  const [invoicesLoading, setInvoicesLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
  // Load unpaid invoices on component mount
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setInvoicesLoading(true);
        
        const response = await apiClient.get('/api/financial/invoices', {
          params: {
            status: ['PENDING', 'PARTIALLY_PAID']
          }
        });
        
        if (response.data.success) {
          const formattedInvoices = response.data.data.map((invoice: ApiInvoice) => ({
            id: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            clientName: invoice.client.name,
            totalAmount: invoice.totalAmount,
            paidAmount: invoice.paidAmount || 0,
            remainingAmount: invoice.totalAmount - (invoice.paidAmount || 0),
            dueDate: new Date(invoice.dueDate),
            status: invoice.status
          }));
          
          setInvoices(formattedInvoices);
          
          // If invoiceId is provided, find and set the selected invoice
          if (invoiceId) {
            const foundInvoice = formattedInvoices.find((inv: Invoice) => inv.id === invoiceId) || null;
            setSelectedInvoice(foundInvoice);
            
            // Set default amount to the remaining amount
            if (foundInvoice) {
              setAmount(foundInvoice.remainingAmount);
            }
          }
        } else {
          setError('Failed to load invoices');
        }
      } catch (err) {
        console.error('Error fetching invoices:', err);
        setError('Failed to load invoices. Please try again.');
      } finally {
        setInvoicesLoading(false);
      }
    };
    
    fetchInvoices();
  }, [invoiceId]);
  
  // Update selected invoice when invoice selection changes
  useEffect(() => {
    const invoice = invoices.find(inv => inv.id === selectedInvoiceId) || null;
    setSelectedInvoice(invoice);
    
    // Set default amount to the remaining amount
    if (invoice) {
      setAmount(invoice.remainingAmount);
    } else {
      setAmount('');
    }
  }, [selectedInvoiceId, invoices]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!selectedInvoiceId) {
      setError('Please select an invoice');
      return;
    }
    
    if (!amount || amount <= 0) {
      setError('Please enter a valid payment amount');
      return;
    }
    
    if (!paymentDate) {
      setError('Please specify a payment date');
      return;
    }
    
    if (selectedInvoice && amount > selectedInvoice.remainingAmount) {
      setError(`Payment amount cannot exceed the remaining balance of ${formatCurrency(selectedInvoice.remainingAmount)}`);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.post('/api/financial/payments', {
        invoiceId: selectedInvoiceId,
        amount,
        paymentDate,
        paymentMethod,
        transactionId: transactionId || undefined,
        notes: notes || undefined
      });
      
      if (response.data.success) {
        setSuccess(true);
        
        // Call callback with the payment ID
        onPaymentRecorded(response.data.data.paymentId);
        
        // Reset form after successful submission
        resetForm();
        
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        setError('Failed to record payment');
      }
    } catch (err) {
      console.error('Error recording payment:', err);
      setError('An error occurred while recording the payment');
    } finally {
      setLoading(false);
    }
  };
  
  const resetForm = () => {
    if (!invoiceId) {
      setSelectedInvoiceId('');
    }
    setAmount('');
    setPaymentDate(new Date());
    setPaymentMethod('BANK_TRANSFER');
    setTransactionId('');
    setNotes('');
  };
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };
  
  // Format date
  const formatDate = (date: Date) => {
    return format(date, 'MMM d, yyyy');
  };
  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Record Payment</Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Payment recorded successfully
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Invoice Selection */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="invoice-select-label">Invoice</InputLabel>
                  <Select
                    labelId="invoice-select-label"
                    value={selectedInvoiceId}
                    label="Invoice"
                    onChange={(e) => setSelectedInvoiceId(e.target.value)}
                    disabled={invoicesLoading || loading || !!invoiceId}
                  >
                    {invoices.map(invoice => (
                      <MenuItem key={invoice.id} value={invoice.id}>
                        {invoice.invoiceNumber} - {invoice.clientName} ({formatCurrency(invoice.remainingAmount)} remaining)
                      </MenuItem>
                    ))}
                  </Select>
                  {invoicesLoading && (
                    <FormHelperText>Loading invoices...</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
              {/* Invoice Details */}
              {selectedInvoice && (
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Invoice Details</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="textSecondary">Client</Typography>
                        <Typography variant="body1">{selectedInvoice.clientName}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="textSecondary">Invoice Number</Typography>
                        <Typography variant="body1">{selectedInvoice.invoiceNumber}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2" color="textSecondary">Total Amount</Typography>
                        <Typography variant="body1">{formatCurrency(selectedInvoice.totalAmount)}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2" color="textSecondary">Paid Amount</Typography>
                        <Typography variant="body1">{formatCurrency(selectedInvoice.paidAmount)}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2" color="textSecondary">Remaining Balance</Typography>
                        <Typography variant="body1" fontWeight="bold">{formatCurrency(selectedInvoice.remainingAmount)}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="textSecondary">Due Date</Typography>
                        <Typography variant="body1">{formatDate(selectedInvoice.dueDate)}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="textSecondary">Status</Typography>
                        <Typography variant="body1">{selectedInvoice.status}</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              )}
              
              <Grid item xs={12}>
                <Divider />
              </Grid>
              
              {/* Payment Amount */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Payment Amount"
                  type="number"
                  fullWidth
                  value={amount}
                  onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  required
                  disabled={loading}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    inputProps: { min: 0, step: 0.01 }
                  }}
                />
              </Grid>
              
              {/* Payment Date */}
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Payment Date"
                  value={paymentDate}
                  onChange={(newValue) => setPaymentDate(newValue)}
                  slotProps={{ textField: { fullWidth: true, required: true } }}
                  disabled={loading}
                />
              </Grid>
              
              {/* Payment Method */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="payment-method-label">Payment Method</InputLabel>
                  <Select
                    labelId="payment-method-label"
                    value={paymentMethod}
                    label="Payment Method"
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    required
                    disabled={loading}
                  >
                    {paymentMethods.map(method => (
                      <MenuItem key={method.value} value={method.value}>
                        {method.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              {/* Transaction ID */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Transaction ID / Reference (Optional)"
                  fullWidth
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  disabled={loading}
                  placeholder="Check number, transaction reference, etc."
                />
              </Grid>
              
              {/* Notes */}
              <Grid item xs={12}>
                <TextField
                  label="Notes (Optional)"
                  multiline
                  rows={3}
                  fullWidth
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={loading}
                  placeholder="Add any additional notes about this payment"
                />
              </Grid>
              
              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={loading || !selectedInvoiceId || !amount || amount <= 0}
                  startIcon={loading && <CircularProgress size={20} color="inherit" />}
                >
                  {loading ? 'Recording Payment...' : 'Record Payment'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};