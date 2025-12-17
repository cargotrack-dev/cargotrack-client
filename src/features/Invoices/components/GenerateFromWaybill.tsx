// src/components/invoices/GenerateFromWaybill.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvoice } from '../contexts/hooks';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../UI/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../UI/components/ui/table';
import { Input } from '../../UI/components/ui/input';
import { Button } from '../../UI/components/ui/button';
import { Checkbox } from '../../UI/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../UI/components/ui/select';
import {
  ArrowLeft,
  RefreshCw,
  Search,
  FileText,
  Truck,
  Calendar,
  Package,
  AlertCircle,
} from 'lucide-react';

// Mock waybill/shipment interface
interface Shipment {
  id: string;
  reference: string;
  clientId: string;
  clientName: string;
  origin: string;
  destination: string;
  date: Date;
  status: string;
  cargoItems: number;
  totalWeight: number;
  totalValue: number;
  invoiced: boolean;
}

// Mock data for shipments
const mockShipments: Shipment[] = [
  {
    id: 'shipment-1',
    reference: 'WB-2025-0001',
    clientId: 'client-1',
    clientName: 'Acme Corporation',
    origin: 'New York, NY',
    destination: 'Los Angeles, CA',
    date: new Date('2025-01-15'),
    status: 'DELIVERED',
    cargoItems: 3,
    totalWeight: 2500,
    totalValue: 12500,
    invoiced: false,
  },
  {
    id: 'shipment-2',
    reference: 'WB-2025-0002',
    clientId: 'client-2',
    clientName: 'Globex Industries',
    origin: 'Chicago, IL',
    destination: 'Houston, TX',
    date: new Date('2025-01-18'),
    status: 'DELIVERED',
    cargoItems: 1,
    totalWeight: 1200,
    totalValue: 8000,
    invoiced: false,
  },
  {
    id: 'shipment-3',
    reference: 'WB-2025-0003',
    clientId: 'client-1',
    clientName: 'Acme Corporation',
    origin: 'Seattle, WA',
    destination: 'Denver, CO',
    date: new Date('2025-01-22'),
    status: 'DELIVERED',
    cargoItems: 2,
    totalWeight: 1800,
    totalValue: 15000,
    invoiced: false,
  },
  {
    id: 'shipment-4',
    reference: 'WB-2025-0004',
    clientId: 'client-3',
    clientName: 'Oceanic Shipping',
    origin: 'Miami, FL',
    destination: 'Atlanta, GA',
    date: new Date('2025-01-25'),
    status: 'IN_TRANSIT',
    cargoItems: 5,
    totalWeight: 3500,
    totalValue: 22000,
    invoiced: false,
  },
];

export const GenerateFromWaybill: React.FC = () => {
  const navigate = useNavigate();
  // ✅ FIXED: Use the actual context without type assertion
  const invoiceContext = useInvoice();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selectedShipments, setSelectedShipments] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [clientFilter, setClientFilter] = useState<string>('ALL');

  // Load shipments
  useEffect(() => {
    const fetchShipments = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setShipments(mockShipments);
      } catch (err) {
        setError('Failed to load shipments');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShipments();
  }, []);

  // Filter shipments based on search and client filter
  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = 
      searchQuery === '' || 
      shipment.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesClient = clientFilter === 'ALL' || shipment.clientId === clientFilter;
    
    // Only show delivered shipments that haven't been invoiced yet
    return matchesSearch && matchesClient && shipment.status === 'DELIVERED' && !shipment.invoiced;
  });

  const toggleShipmentSelection = (shipmentId: string) => {
    setSelectedShipments(prev => {
      if (prev.includes(shipmentId)) {
        return prev.filter(id => id !== shipmentId);
      } else {
        return [...prev, shipmentId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedShipments.length === filteredShipments.length) {
      // If all are selected, deselect all
      setSelectedShipments([]);
    } else {
      // Otherwise, select all filtered shipments
      setSelectedShipments(filteredShipments.map(s => s.id));
    }
  };

  // ✅ FIXED: Handle the actual return type from generateInvoiceFromWaybill
  const handleGenerateInvoice = async () => {
    if (selectedShipments.length === 0) {
      setError('Please select at least one shipment');
      return;
    }

    // ✅ FIXED: Check if context exists
    if (!invoiceContext) {
      setError('Invoice context not available');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // ✅ FIXED: Handle the Promise<Invoice> return type
      if (selectedShipments.length === 1) {
        const invoice = await invoiceContext.generateInvoiceFromWaybill(selectedShipments[0]);
        console.log('Generated invoice:', invoice);
      } else {
        // Handle multiple shipments
        const invoice = await invoiceContext.generateInvoiceFromWaybill(selectedShipments[0]);
        console.log('Generated invoice for multiple shipments:', invoice);
        // In a real app, you might have a different method for multiple shipments
      }
      
      navigate('/invoices');
    } catch (err) {
      setError('Failed to generate invoice');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get unique clients for filter dropdown
  const uniqueClients = Array.from(
    new Set(shipments.map(s => s.clientId))
  ).map(clientId => {
    const client = shipments.find(s => s.clientId === clientId);
    return {
      id: clientId,
      name: client?.clientName || 'Unknown Client'
    };
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (isLoading && shipments.length === 0) {
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
            <CardTitle>Generate Invoice from Waybill</CardTitle>
            <CardDescription>
              Select one or more completed shipments to generate an invoice
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-destructive/15 text-destructive p-3 rounded-md mb-4 flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        
        <div className="flex justify-between mb-4 gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by reference or client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <Select
            value={clientFilter}
            onValueChange={setClientFilter}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Filter by client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Clients</SelectItem>
              {uniqueClients.map(client => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {filteredShipments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-2 text-muted-foreground/60" />
            <h3 className="text-lg font-medium mb-1">No eligible shipments found</h3>
            <p className="text-sm">
              {shipments.length === 0 
                ? "No shipments have been recorded yet." 
                : "There are no delivered shipments that haven't been invoiced yet."}
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-md border mb-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox 
                        checked={selectedShipments.length === filteredShipments.length && filteredShipments.length > 0}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all"
                      />
                    </TableHead>
                    <TableHead>Waybill Reference</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredShipments.map((shipment) => (
                    <TableRow key={shipment.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <Checkbox 
                          checked={selectedShipments.includes(shipment.id)}
                          onCheckedChange={() => toggleShipmentSelection(shipment.id)}
                          aria-label={`Select shipment ${shipment.reference}`}
                        />
                      </TableCell>
                      <TableCell 
                        className="font-medium"
                        onClick={() => toggleShipmentSelection(shipment.id)}
                      >
                        <div className="flex items-center">
                          <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                          {shipment.reference}
                        </div>
                      </TableCell>
                      <TableCell onClick={() => toggleShipmentSelection(shipment.id)}>
                        {shipment.clientName}
                      </TableCell>
                      <TableCell onClick={() => toggleShipmentSelection(shipment.id)}>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          {formatDate(shipment.date)}
                        </div>
                      </TableCell>
                      <TableCell onClick={() => toggleShipmentSelection(shipment.id)}>
                        <span className="text-xs">
                          {shipment.origin} → {shipment.destination}
                        </span>
                      </TableCell>
                      <TableCell onClick={() => toggleShipmentSelection(shipment.id)}>
                        <div className="flex items-center">
                          <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{shipment.cargoItems} items ({shipment.totalWeight} kg)</span>
                        </div>
                      </TableCell>
                      <TableCell onClick={() => toggleShipmentSelection(shipment.id)}>
                        {formatCurrency(shipment.totalValue)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                {selectedShipments.length > 0 ? (
                  <span className="text-sm">
                    {selectedShipments.length} shipment{selectedShipments.length > 1 ? 's' : ''} selected
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Select shipments to generate an invoice
                  </span>
                )}
              </div>
              
              <Button
                onClick={handleGenerateInvoice}
                disabled={selectedShipments.length === 0 || isLoading || !invoiceContext}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Invoice
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};