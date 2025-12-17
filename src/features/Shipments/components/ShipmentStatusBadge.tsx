// src/components/shipment/ShipmentStatusBadge.tsx
import React from 'react';
import { Badge } from '../../UI/components/ui/badge';
import { ShipmentStatus } from '../types/shipment';
import {
  Truck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  PackageX, 
  Send
} from 'lucide-react';

interface ShipmentStatusBadgeProps {
  status: ShipmentStatus;
}

const ShipmentStatusBadge: React.FC<ShipmentStatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: ShipmentStatus) => {
    switch (status) {
      case ShipmentStatus.PLANNED:
        return {
          label: 'Planned',
          variant: 'outline' as const,
          icon: <Clock className="h-3 w-3 mr-1" />,
          className: 'text-yellow-600 border-yellow-300 bg-yellow-50'
        };
      case ShipmentStatus.DISPATCHED:
        return {
          label: 'Dispatched',
          variant: 'outline' as const,
          icon: <Send className="h-3 w-3 mr-1" />,
          className: 'text-blue-600 border-blue-300 bg-blue-50'
        };
      case ShipmentStatus.IN_TRANSIT:
        return {
          label: 'In Transit',
          variant: 'outline' as const,
          icon: <Truck className="h-3 w-3 mr-1" />,
          className: 'text-green-600 border-green-300 bg-green-50'
        };
      case ShipmentStatus.COMPLETED:
        return {
          label: 'Completed',
          variant: 'outline' as const,
          icon: <CheckCircle2 className="h-3 w-3 mr-1" />,
          className: 'text-gray-600 border-gray-300 bg-gray-50'
        };
      case ShipmentStatus.CANCELLED:
        return {
          label: 'Cancelled',
          variant: 'outline' as const,
          icon: <PackageX className="h-3 w-3 mr-1" />,
          className: 'text-gray-600 border-gray-300 bg-gray-50'
        };
      case ShipmentStatus.INCIDENT:
        return {
          label: 'Incident',
          variant: 'outline' as const,
          icon: <AlertTriangle className="h-3 w-3 mr-1" />,
          className: 'text-red-600 border-red-300 bg-red-50'
        };
      default:
        return {
          label: status.replace('_', ' '),
          variant: 'outline' as const,
          icon: null,
          className: 'text-gray-600 border-gray-300 bg-gray-50'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.icon}
      {config.label}
    </Badge>
  );
};

export default ShipmentStatusBadge;