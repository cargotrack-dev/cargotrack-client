// src/components/shipment/ShipmentSummaryCard.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../UI/components/ui/card';
import { Badge } from '../../UI/components/ui/badge';
import { Button } from '../../UI/components/ui/button';
import { Separator } from '../../UI/components/ui/separator';
import { 
  CalendarClock, 
  Package, 
  Truck, 
  Navigation, 
  CircleDollarSign, 
  FileText, 
  MoreHorizontal 
} from 'lucide-react';

// ✅ FIXED: Built-in utility functions to replace missing imports
const formatDate = (date: Date | string, format?: string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (!dateObj || isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  // Simple format handling
  if (format === 'MMM dd, yyyy') {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    }).format(dateObj);
  }

  // Default format
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(dateObj);
};

const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// ✅ FIXED: Define location interfaces locally since ../../Core imports don't exist
interface ShipmentLocation {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface PickupLocation extends ShipmentLocation {
  contactPerson?: string;
  contactPhone?: string;
  pickupInstructions?: string;
}

interface DeliveryLocation extends ShipmentLocation {
  contactPerson?: string;
  contactPhone?: string;
  deliveryInstructions?: string;
  requiresSignature?: boolean;
}

// ✅ FIXED: Main shipment interface
interface ShipmentSummaryCardProps {
  shipment: {
    id: string;
    trackingNumber: string;
    status: string;
    origin: string;
    destination: string;
    estimatedDelivery: Date | string;
    departureDate: Date | string;
    client: {
      name: string;
      id: string;
    };
    carrier: {
      name: string;
      id: string;
    };
    cost: number;
    weight: {
      value: number;
      unit: string;
    };
    packageCount: number;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    containsHazardous: boolean;
    requiresRefrigeration: boolean;
    notes?: string;
    // ✅ ADDED: Optional location data for enhanced functionality
    pickup?: PickupLocation;
    delivery?: DeliveryLocation;
    currentLocation?: ShipmentLocation;
  };
  onViewDetails?: (id: string) => void;
  onEditShipment?: (id: string) => void;
  onTrackShipment?: (trackingNumber: string) => void;
  className?: string;
}

const ShipmentSummaryCard: React.FC<ShipmentSummaryCardProps> = ({
  shipment,
  onViewDetails,
  onEditShipment,
  onTrackShipment,
  className = "",
}) => {
  // ✅ ENHANCED: Better status badge styling and handling
  const getStatusBadge = (status: string) => {
    const statusUpper = status.toUpperCase();
    
    const statusConfig = {
      'IN_TRANSIT': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'In Transit' },
      'DELIVERED': { bg: 'bg-green-100', text: 'text-green-800', label: 'Delivered' },
      'PENDING': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      'DELAYED': { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Delayed' },
      'CANCELLED': { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' },
      'PICKED_UP': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Picked Up' },
      'OUT_FOR_DELIVERY': { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'Out for Delivery' },
    };

    const config = statusConfig[statusUpper as keyof typeof statusConfig];
    
    if (config) {
      return (
        <Badge className={`${config.bg} ${config.text} border-0`}>
          {config.label}
        </Badge>
      );
    }
    
    return <Badge variant="outline">{status}</Badge>;
  };

  // ✅ ENHANCED: Better priority badge handling
  const getPriorityBadge = (priority: string) => {
    switch (priority.toUpperCase()) {
      case 'HIGH':
        return (
          <Badge variant="outline" className="border-red-500 text-red-700 bg-red-50">
            🔴 High Priority
          </Badge>
        );
      case 'MEDIUM':
        return (
          <Badge variant="outline" className="border-orange-500 text-orange-700 bg-orange-50">
            🟡 Medium Priority
          </Badge>
        );
      case 'LOW':
        return (
          <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
            🟢 Low Priority
          </Badge>
        );
      default:
        return null;
    }
  };

  // ✅ ADDED: Calculate days until delivery
  const getDaysUntilDelivery = (): string => {
    const today = new Date();
    const deliveryDate = typeof shipment.estimatedDelivery === 'string' 
      ? new Date(shipment.estimatedDelivery) 
      : shipment.estimatedDelivery;
    
    if (!deliveryDate || isNaN(deliveryDate.getTime())) {
      return '';
    }

    const diffTime = deliveryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Tomorrow';
    } else {
      return `${diffDays} days`;
    }
  };

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 border-l-4 ${
      shipment.priority === 'HIGH' ? 'border-l-red-500' : 
      shipment.priority === 'MEDIUM' ? 'border-l-orange-500' : 'border-l-green-500'
    } ${className}`}>
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              {shipment.trackingNumber}
              {shipment.containsHazardous && <span className="text-red-500 text-sm">⚠️</span>}
              {shipment.requiresRefrigeration && <span className="text-blue-500 text-sm">❄️</span>}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 mt-1">
              {shipment.client.name} • Departed {formatDate(shipment.departureDate)}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 items-end">
            {getStatusBadge(shipment.status)}
            {getPriorityBadge(shipment.priority)}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4 space-y-4">
        {/* Route Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="bg-green-100 p-2 rounded-full">
              <Navigation className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Origin</p>
              <p className="text-sm font-semibold text-gray-900">{shipment.origin}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Navigation className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Destination</p>
              <p className="text-sm font-semibold text-gray-900">{shipment.destination}</p>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Shipment Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <Truck className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500 font-medium">Carrier</p>
              <p className="text-sm font-semibold">{shipment.carrier.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Package className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500 font-medium">Packages</p>
              <p className="text-sm font-semibold">{shipment.packageCount}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <CircleDollarSign className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500 font-medium">Cost</p>
              <p className="text-sm font-semibold">{formatCurrency(shipment.cost)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm">⚖️</span>
            <div>
              <p className="text-xs text-gray-500 font-medium">Weight</p>
              <p className="text-sm font-semibold">{shipment.weight.value} {shipment.weight.unit}</p>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CalendarClock className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-xs text-blue-600 font-medium">Estimated Delivery</p>
                <p className="text-sm font-semibold text-blue-900">
                  {formatDate(shipment.estimatedDelivery)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-blue-600 font-medium">ETA</p>
              <p className="text-sm font-semibold text-blue-900">{getDaysUntilDelivery()}</p>
            </div>
          </div>
        </div>

        {/* Special Requirements */}
        {(shipment.containsHazardous || shipment.requiresRefrigeration) && (
          <div className="flex flex-wrap gap-2">
            {shipment.containsHazardous && (
              <Badge variant="outline" className="border-red-500 text-red-700 bg-red-50 text-xs">
                ⚠️ Hazardous Materials
              </Badge>
            )}
            {shipment.requiresRefrigeration && (
              <Badge variant="outline" className="border-blue-500 text-blue-700 bg-blue-50 text-xs">
                ❄️ Refrigeration Required
              </Badge>
            )}
          </div>
        )}

        {/* Notes */}
        {shipment.notes && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <FileText className="h-4 w-4 text-amber-600 mt-0.5" />
              <div>
                <p className="text-xs text-amber-700 font-medium mb-1">Special Notes</p>
                <p className="text-sm text-amber-800">{shipment.notes}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="bg-gray-50 pt-3 flex justify-between items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onViewDetails?.(shipment.id)}
          className="hover:bg-white"
        >
          <FileText className="h-4 w-4 mr-2" />
          View Details
        </Button>
        <div className="flex space-x-1">
          {onTrackShipment && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onTrackShipment(shipment.trackingNumber)}
              className="hover:bg-white"
            >
              Track
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onEditShipment?.(shipment.id)}
            className="hover:bg-white"
          >
            Edit
          </Button>
          <Button variant="ghost" size="sm" className="hover:bg-white">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ShipmentSummaryCard;

// ✅ EXPORT: Export the location interfaces for use in other components
export type { ShipmentLocation, PickupLocation, DeliveryLocation };