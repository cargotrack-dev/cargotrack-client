// src/features/Invoices/components/InvoiceForm.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../UI/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../UI/components/ui/form';
import { Input } from '../../UI/components/ui/input';
import { Button } from '../../UI/components/ui/button';
import { Textarea } from '../../UI/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../UI/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../UI/components/ui/table';
import { Plus, Save, Trash2, X, ArrowLeft, RefreshCw } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useInvoice } from '../hooks/useInvoice';
import { 
  InvoiceStatus, 
  InvoiceItem, 
  FormValues,
  PaymentRecord 
} from '../types/invoice-types'; // Import from our new types file
import { v4 as uuidv4 } from 'uuid';

export const InvoiceForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedInvoice, loading, fetchInvoiceById, createInvoice, updateInvoice } = useInvoice();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      invoiceNumber: '',
      clientId: '',
      clientName: '',
      clientContact: '',
      clientEmail: '',
      clientAddress: '',
      clientPhone: '',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
      status: InvoiceStatus.DRAFT,
      items: [
        {
          id: uuidv4(),
          description: '',
          quantity: 1,
          unitPrice: 0,
          amount: 0,
          taxable: true,
        },
      ],
      subtotal: 0,
      taxRate: 0,
      total: 0,
      currency: 'USD',
      terms: 'Net 30',
      notes: '',
      payments: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  // Fetch invoice details if editing
  useEffect(() => {
    if (id) {
      fetchInvoiceById(id);
    }
  }, [id, fetchInvoiceById]);

  // Populate form when invoice is loaded
  useEffect(() => {
    if (id && selectedInvoice) {
      // Reset form with invoice data
      form.reset({
        invoiceNumber: selectedInvoice.invoiceNumber,
        clientId: selectedInvoice.clientId,
        clientName: selectedInvoice.clientName,
        clientContact: selectedInvoice.clientContact || '',
        clientEmail: selectedInvoice.clientEmail || '',
        clientAddress: selectedInvoice.clientAddress || '',
        clientPhone: selectedInvoice.clientPhone || '',
        issueDate: selectedInvoice.issueDate,
        dueDate: selectedInvoice.dueDate,
        status: selectedInvoice.status as InvoiceStatus,
        subtotal: selectedInvoice.subtotal,
        taxRate: selectedInvoice.taxTotal / selectedInvoice.subtotal * 100, // Approximate tax rate
        total: selectedInvoice.total,
        currency: selectedInvoice.currency,
        terms: selectedInvoice.terms || '',
        notes: selectedInvoice.notes || '',
        items: selectedInvoice.items.map(item => ({
          ...item,
          id: item.id || uuidv4()
        })),
        payments: (selectedInvoice.payments || []) as PaymentRecord[],
      });
    } else if (!id) {
      // Generate new invoice number for new invoices
      form.setValue('invoiceNumber', `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
    }
  }, [id, selectedInvoice, form]);

  // Use proper variables to watch
  const watchedItems = form.watch('items');
  const watchedTaxRate = form.watch('taxRate');
  
  // Calculate totals when items change
  useEffect(() => {
    if (watchedItems && watchedItems.length > 0) {
      const subtotal = watchedItems.reduce((sum: number, item: InvoiceItem) => sum + (item.quantity * item.unitPrice), 0);
      form.setValue('subtotal', subtotal);
      
      const taxRate = watchedTaxRate / 100;
      const taxAmount = subtotal * taxRate;
      form.setValue('total', subtotal + taxAmount);
    }
  }, [watchedItems, watchedTaxRate, form]);

  // Update item amount when quantity or unit price changes
  const updateItemAmount = (index: number) => {
    const items = form.getValues('items');
    if (items[index]) {
      const quantity = items[index].quantity;
      const unitPrice = items[index].unitPrice;
      form.setValue(`items.${index}.amount`, quantity * unitPrice);
    }
  };

  const handleAddItem = () => {
    append({
      id: uuidv4(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      amount: 0,
      taxable: true,
    });
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // First convert payments to the right format
      const formattedPayments = (data.payments || []).map(payment => ({
        id: payment.id || uuidv4(),
        date: payment.date || new Date().toISOString().split('T')[0],
        amount: payment.amount,
        method: payment.method || 'unknown',
        reference: payment.reference || '',
        notes: payment.notes || ''
      }));
      
      // Create invoice data with explicit types
      const invoiceData = {
        invoiceNumber: data.invoiceNumber,
        clientId: data.clientId,
        clientName: data.clientName,
        clientContact: data.clientContact,
        clientEmail: data.clientEmail,
        clientAddress: data.clientAddress,
        clientPhone: data.clientPhone,
        issueDate: data.issueDate,
        dueDate: data.dueDate,
        status: data.status,
        items: data.items,
        subtotal: data.subtotal,
        taxTotal: data.subtotal * (data.taxRate / 100),
        total: data.total,
        currency: data.currency,
        terms: data.terms,
        notes: data.notes,
        discountTotal: 0,
        discounts: [], 
        taxes: [{
          id: uuidv4(),
          name: 'Tax',
          type: 'percentage',
          rate: data.taxRate,
          amount: data.subtotal * (data.taxRate / 100)
        }],
        balance: data.total,
        payments: formattedPayments,
        createdBy: getCurrentUserId()
      };
      
      // Type casting using unknown as intermediate step to avoid explicit any
      if (id) {
        await updateInvoice(id, invoiceData as unknown as Parameters<typeof updateInvoice>[1]);
      } else {
        await createInvoice(invoiceData as unknown as Parameters<typeof createInvoice>[0]);
      }
      navigate('/invoices');
    } catch (error) {
      console.error('Failed to save invoice:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to get the current user ID
  const getCurrentUserId = (): string => {
    // You should implement this to get the current user ID from your auth context
    // For now, using a placeholder value
    return 'current-user-id';
  };

  if (loading && id) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/invoices')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <CardTitle>{id ? 'Edit Invoice' : 'Create New Invoice'}</CardTitle>
            <CardDescription>
              {id ? 'Update the invoice details' : 'Enter the details to create a new invoice'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="invoiceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., INV-2025-0001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={InvoiceStatus.DRAFT}>Draft</SelectItem>
                        <SelectItem value={InvoiceStatus.PENDING}>Pending</SelectItem>
                        <SelectItem value={InvoiceStatus.PAID}>Paid</SelectItem>
                        <SelectItem value={InvoiceStatus.OVERDUE}>Overdue</SelectItem>
                        <SelectItem value={InvoiceStatus.CANCELLED}>Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter client name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client ID *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="client-1">Acme Corporation</SelectItem>
                        <SelectItem value="client-2">Globex Industries</SelectItem>
                        <SelectItem value="client-3">Oceanic Shipping</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="issueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Date *</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        value={typeof field.value === 'string' ? field.value : ''}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date *</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        value={typeof field.value === 'string' ? field.value : ''}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Terms *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select terms" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
                        <SelectItem value="Net 15">Net 15</SelectItem>
                        <SelectItem value="Net 30">Net 30</SelectItem>
                        <SelectItem value="Net 45">Net 45</SelectItem>
                        <SelectItem value="Net 60">Net 60</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Invoice Items</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddItem}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Description</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field, index) => (
                    <TableRow key={field.id}>
                      <TableCell>
                        <Input
                          placeholder="Item description"
                          {...form.register(`items.${index}.description`)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="1"
                          step="1"
                          {...form.register(`items.${index}.quantity`, {
                            valueAsNumber: true,
                            onChange: () => updateItemAmount(index)
                          })}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          {...form.register(`items.${index}.unitPrice`, {
                            valueAsNumber: true,
                            onChange: () => updateItemAmount(index)
                          })}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          disabled
                          {...form.register(`items.${index}.amount`, {
                            valueAsNumber: true
                          })}
                        />
                      </TableCell>
                      <TableCell>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          disabled={fields.length <= 1}
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Additional notes or payment instructions"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Subtotal:</span>
                  <span>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: form.watch('currency') || 'USD'
                    }).format(form.watch('subtotal') || 0)}
                  </span>
                </div>

                <div className="flex items-center">
                  <FormField
                    control={form.control}
                    name="taxRate"
                    render={({ field }) => (
                      <FormItem className="flex flex-1 items-center space-x-2 space-y-0">
                        <FormLabel className="flex-shrink-0">Tax (%):</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            className="w-20"
                            {...field}
                            onChange={(e) => {
                              field.onChange(parseFloat(e.target.value) || 0);
                              const subtotal = form.watch('subtotal') || 0;
                              const taxRate = parseFloat(e.target.value) / 100 || 0;
                              form.setValue('total', subtotal + (subtotal * taxRate));
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <span className="ml-auto">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: form.watch('currency') || 'USD'
                    }).format((form.watch('subtotal') || 0) * (form.watch('taxRate') || 0) / 100)}
                  </span>
                </div>

                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="CAD">CAD</SelectItem>
                          <SelectItem value="AUD">AUD</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="font-semibold">Total:</span>
                  <span className="font-semibold">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: form.watch('currency') || 'USD'
                    }).format(form.watch('total') || 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/invoices')}
                disabled={isSubmitting}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {id ? 'Update Invoice' : 'Create Invoice'}
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