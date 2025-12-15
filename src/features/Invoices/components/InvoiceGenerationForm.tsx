// client/src/components/Financial/InvoiceGenerationForm.tsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CircularProgress, 
  Divider, 
  FormControl, 
  FormControlLabel,
  FormHelperText,
  Grid as MuiGrid, // Rename to avoid conflicts
  InputLabel, 
  MenuItem, 
  Select,
  SelectChangeEvent,
  Stack, 
  Switch, 
  TextField, 
  Typography,
  Alert,
  styled,
  // Remove unused Chip
  // Chip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { addDays } from 'date-fns';
// Remove unused format
// import { format, addDays } from 'date-fns';
import { apiClient } from '../services/api/apiClient';

// Create styled components for Grid to fix TypeScript errors
const StyledGrid = styled(MuiGrid)({});
const Item = styled(StyledGrid)({});
const Container = styled(StyledGrid)({});

interface InvoiceGenerationFormProps {
  onInvoiceGenerated: (invoiceId: string, filePath: string) => void;
}

// Define types for shipment and client
interface Client {
  id: string;
  name: string;
}

interface Shipment {
  id: string;
  trackingNumber: string;
  origin: string;
  destination: string;
  status: string;
  cargoType: string;
  cargoWeight: number;
  deliveryDate?: Date;
}

export const InvoiceGenerationForm: React.FC<InvoiceGenerationFormProps> = ({ onInvoiceGenerated }) => {
  // Form state
  const [clientId, setClientId] = useState<string>('');
  const [issueDate, setIssueDate] = useState<Date | null>(new Date());
  const [dueDate, setDueDate] = useState<Date | null>(addDays(new Date(), 30));
  const [paymentTerms, setPaymentTerms] = useState<string>('Net 30');
  const [notes, setNotes] = useState<string>('');
  const [selectedShipments, setSelectedShipments] = useState<string[]>([]);
  
  // Data state
  const [clients, setClients] = useState<Client[]>([]);
  const [availableShipments, setAvailableShipments] = useState<Shipment[]>([]);
  
  // UI state
  const [loading, setLoading] = useState<boolean>(false);
  const [clientLoading, setClientLoading] = useState<boolean>(true);
  const [shipmentLoading, setShipmentLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
  // Load clients on component mount
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await apiClient.get('/api/clients');
        if (response.data.success) {
          setClients(response.data.data);
        } else {
          setError('Failed to load clients');
        }
      } catch (err) {
        console.error('Error fetching clients:', err);
        setError('Failed to load clients. Please try again.');
      } finally {
        setClientLoading(false);
      }
    };
    
    fetchClients();
  }, []);
  
  // Load available shipments when client changes
  useEffect(() => {
    if (!clientId) return;
    
    const fetchShipments = async () => {
      try {
        setShipmentLoading(true);
        
        const response = await apiClient.get(`/api/shipments`, {
          params: {
            clientId,
            status: ['DELIVERED', 'COMPLETED'],
            invoiced: false
          }
        });
        
        if (response.data.success) {
          setAvailableShipments(response.data.data);
        } else {
          setError('Failed to load shipments');
        }
      } catch (err) {
        console.error('Error fetching shipments:', err);
        setError('Failed to load shipments. Please try again.');
      } finally {
        setShipmentLoading(false);
      }
    };
    
    fetchShipments();
  }, [clientId]);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!clientId) {
      setError('Please select a client');
      return;
    }
    
    if (selectedShipments.length === 0) {
      setError('Please select at least one shipment');
      return;
    }
    
    if (!issueDate || !dueDate) {
      setError('Please specify issue and due dates');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.post('/api/financial/invoices', {
        clientId,
        shipmentIds: selectedShipments,
        issueDate,
        dueDate,
        paymentTerms,
        notes
      });
      
      if (response.data.success) {
        setSuccess(true);
        // Call the callback with the new invoice details
        onInvoiceGenerated(response.data.data.invoiceId, response.data.data.filePath);
        
        // Reset form after successful submission
        setSelectedShipments([]);
        setNotes('');
        
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        setError('Failed to generate invoice');
      }
    } catch (err) {
      console.error('Error generating invoice:', err);
      setError('An error occurred while generating the invoice');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle select all shipments
  const handleSelectAllShipments = () => {
    setSelectedShipments(availableShipments.map(shipment => shipment.id));
  };
  
  // Handle clear shipment selection
  const handleClearShipmentSelection = () => {
    setSelectedShipments([]);
  };
  
  // Handle client change - Fixed the SelectChangeEvent type
  const handleClientChange = (e: SelectChangeEvent) => {
    setClientId(e.target.value);
  };
  
  // Handle issue date change
  const handleIssueDateChange = (newValue: Date | null) => {
    setIssueDate(newValue);
  };
  
  // Handle due date change
  const handleDueDateChange = (newValue: Date | null) => {
    setDueDate(newValue);
  };
  
  // Handle payment terms change - Fixed the SelectChangeEvent type
  const handlePaymentTermsChange = (e: SelectChangeEvent) => {
    setPaymentTerms(e.target.value);
  };
  
  // Handle notes change
  const handleNotesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };
  
  // Handle shipment selection change
  const handleShipmentSelectionChange = (e: React.ChangeEvent<HTMLInputElement>, shipmentId: string) => {
    if (e.target.checked) {
      setSelectedShipments([...selectedShipments, shipmentId]);
    } else {
      setSelectedShipments(selectedShipments.filter(id => id !== shipmentId));
    }
  };
  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Generate Invoice</Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Invoice generated successfully
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <Container container spacing={3}>
              {/* Client Selection */}
              <Item item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="client-select-label">Client</InputLabel>
                  <Select
                    labelId="client-select-label"
                    value={clientId}
                    label="Client"
                    onChange={handleClientChange}
                    disabled={clientLoading || loading}
                  >
                    {clients.map(client => (
                      <MenuItem key={client.id} value={client.id}>
                        {client.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {clientLoading && (
                    <FormHelperText>Loading clients...</FormHelperText>
                  )}
                </FormControl>
              </Item>
              
              {/* Shipment Selection */}
              <Item item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Select Shipments
                  {shipmentLoading && (
                    <CircularProgress size={16} sx={{ ml: 1 }} />
                  )}
                </Typography>
                
                {availableShipments.length > 0 ? (
                  <>
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                      <Button 
                        variant="outlined" 
                        size="small"
                        onClick={handleSelectAllShipments}
                        disabled={loading || shipmentLoading}
                      >
                        Select All
                      </Button>
                      <Button 
                        variant="outlined" 
                        size="small"
                        onClick={handleClearShipmentSelection}
                        disabled={loading || shipmentLoading || selectedShipments.length === 0}
                      >
                        Clear Selection
                      </Button>
                    </Stack>
                    
                    <Box sx={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #e0e0e0', borderRadius: 1, p: 1, mb: 2 }}>
                      {availableShipments.map(shipment => (
                        <FormControlLabel
                          key={shipment.id}
                          control={
                            <Switch
                              checked={selectedShipments.includes(shipment.id)}
                              onChange={(e) => handleShipmentSelectionChange(e, shipment.id)}
                              disabled={loading}
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="body2">
                                {shipment.trackingNumber} - {shipment.origin} to {shipment.destination}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {shipment.cargoType} ({shipment.cargoWeight} kg) - {shipment.status}
                              </Typography>
                            </Box>
                          }
                          sx={{ 
                            display: 'flex', 
                            mb: 1,
                            bgcolor: selectedShipments.includes(shipment.id) ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                            borderRadius: 1,
                            width: '100%'
                          }}
                        />
                      ))}
                    </Box>
                    
                    <Typography variant="body2" color="textSecondary">
                      {selectedShipments.length} shipment(s) selected
                    </Typography>
                  </>
                ) : (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    {clientId ? 'No uninvoiced shipments found for this client.' : 'Select a client to view available shipments.'}
                  </Alert>
                )}
              </Item>
              
              <Item item xs={12}>
                <Divider />
              </Item>
              
              {/* Invoice Details */}
              <Item item xs={12} md={6}>
                <DatePicker
                  label="Issue Date"
                  value={issueDate}
                  onChange={handleIssueDateChange}
                  slotProps={{ textField: { fullWidth: true } }}
                  disabled={loading}
                />
              </Item>
              
              <Item item xs={12} md={6}>
                <DatePicker
                  label="Due Date"
                  value={dueDate}
                  onChange={handleDueDateChange}
                  slotProps={{ textField: { fullWidth: true } }}
                  disabled={loading}
                />
              </Item>
              
              <Item item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="payment-terms-label">Payment Terms</InputLabel>
                  <Select
                    labelId="payment-terms-label"
                    value={paymentTerms}
                    label="Payment Terms"
                    onChange={handlePaymentTermsChange}
                    disabled={loading}
                  >
                    <MenuItem value="Net 15">Net 15 (Due in 15 days)</MenuItem>
                    <MenuItem value="Net 30">Net 30 (Due in 30 days)</MenuItem>
                    <MenuItem value="Net 45">Net 45 (Due in 45 days)</MenuItem>
                    <MenuItem value="Net 60">Net 60 (Due in 60 days)</MenuItem>
                    <MenuItem value="Due on Receipt">Due on Receipt</MenuItem>
                    <MenuItem value="End of Month">End of Month</MenuItem>
                  </Select>
                </FormControl>
              </Item>
              
              <Item item xs={12}>
                <TextField
                  label="Notes (Optional)"
                  multiline
                  rows={3}
                  fullWidth
                  value={notes}
                  onChange={handleNotesChange}
                  disabled={loading}
                  placeholder="Add any special notes or instructions to appear on the invoice"
                />
              </Item>
              
              {/* Submit Button */}
              <Item item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={loading || selectedShipments.length === 0}
                  startIcon={loading && <CircularProgress size={20} color="inherit" />}
                >
                  {loading ? 'Generating Invoice...' : 'Generate Invoice'}
                </Button>
              </Item>
            </Container>
          </form>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};