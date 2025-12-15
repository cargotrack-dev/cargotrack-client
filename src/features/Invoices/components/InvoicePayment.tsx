// src/components/invoices/InvoicePayment.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInvoice } from '../hooks/useInvoice';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@features/UI/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@features/UI/components/ui/form';
import { Input } from '@features/UI/components/ui/input';
import { Button } from '@features/UI/components/ui/button';
import { Textarea } from '@features/UI/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@features/UI/components/ui/select';
import { Separator } from '@features/UI/components/ui/separator';
import { 
  ArrowLeft, 
  RefreshCw, 
  AlertCircle, 
  DollarSign, 
  Calendar,
  CreditCard,
  Save,
  X
} from 'lucide-react';
import { useForm } from 'react-hook-form';

interface PaymentFormValues {
  amount: number;
  method: string;
  reference: string;
  date: Date;
  notes: string;
}

export const InvoicePayment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedInvoice, loading, error, fetchInvoiceById, recordPayment } = useInvoice();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const form = useForm<PaymentFormValues>({
    defaultValues: {
      amount: 0,
      method: 'Credit Card',
      reference: '',
      date: new Date(),
      notes: '',
    },
  });

  useEffect(() => {
    if (id) {
      fetchInvoiceById(id);
    }
  }, [id, fetchInvoiceById]);

  // Set default amount to remaining balance
  useEffect(() => {
    if (selectedInvoice) {
      const totalPaid = selectedInvoice.payments?.reduce(
        (sum, payment) => sum + payment.amount, 0
      ) || 0;
      const remainingBalance = selectedInvoice.total - totalPaid;
      form.setValue('amount', remainingBalance);
    }
  }, [selectedInvoice, form]);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const calculateRemainingBalance = () => {
    if (!selectedInvoice) return 0;
    
    const totalPaid = selectedInvoice.payments?.reduce(
      (sum, payment) => sum + payment.amount, 0
    ) || 0;
    
    return selectedInvoice.total - totalPaid;
  };

  const onSubmit = async (data: PaymentFormValues) => {
    if (!id || !selectedInvoice) return;
    
    // Validate payment amount
    const remainingBalance = calculateRemainingBalance();
    if (data.amount <= 0) {
      setPaymentError('Payment amount must be greater than zero');
      return;
    }
    
    if (data.amount > remainingBalance) {
      setPaymentError(`Payment amount exceeds the remaining balance of ${formatCurrency(remainingBalance, selectedInvoice.currency)}`);
      return;
    }
    
    setIsSubmitting(true);
    setPaymentError(null);
    
    try {
      await recordPayment(id, {
        date: data.date.toISOString(),
        amount: data.amount,
        method: data.method,
        reference: data.reference,
        notes: data.notes,
      });
      
      navigate(`/invoices/${id}`);
    } catch (error) {
      console.error('Failed to record payment:', error);
      setPaymentError('Failed to record payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !selectedInvoice) {
    return (
      <div className="p-4 text-center">
        <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
        <p className="text-destructive">Error: {error || "Invoice not found"}</p>
        <Button variant="outline" onClick={() => navigate('/invoices')} className="mt-4">
          Back to Invoices
        </Button>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/invoices/${id}`)}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <CardTitle>Record Payment</CardTitle>
            <CardDescription>
              Invoice {selectedInvoice.invoiceNumber} for {selectedInvoice.clientName}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {paymentError && (
          <div className="bg-destructive/15 text-destructive p-3 rounded-md mb-4 flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p>{paymentError}</p>
          </div>
        )}
        
        <div className="mb-6 space-y-2 p-4 bg-muted/50 rounded-md">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Invoice Total:</span>
            <span>{formatCurrency(selectedInvoice.total, selectedInvoice.currency)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm font-medium">Amount Paid:</span>
            <span>
              {formatCurrency(
                selectedInvoice.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0,
                selectedInvoice.currency
              )}
            </span>
          </div>
          
          <Separator className="my-2" />
          
          <div className="flex justify-between font-semibold">
            <span>Remaining Balance:</span>
            <span>{formatCurrency(calculateRemainingBalance(), selectedInvoice.currency)}</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Amount *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        min="0.01"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-8"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Payment in {selectedInvoice.currency}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Credit Card">Credit Card</SelectItem>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                        <SelectItem value="Check">Check</SelectItem>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="PayPal">PayPal</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Date *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="date"
                          className="pl-8"
                          value={field.value instanceof Date 
                            ? field.value.toISOString().split('T')[0] 
                            : new Date().toISOString().split('T')[0]}
                          onChange={(e) => field.onChange(new Date(e.target.value))}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Reference</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <CreditCard className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="e.g., Transaction ID, Check Number"
                        className="pl-8"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Reference number for this payment
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional information about this payment"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(`/invoices/${id}`)}
                disabled={isSubmitting}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Record Payment
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};