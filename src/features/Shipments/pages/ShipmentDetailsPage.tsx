// src/features/Shipments/pages/ShipmentDetailsPage.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ShipmentDetails from '../components/ShipmentDetails';
import { useShipment } from '../hooks/useShipments';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '../../UI/components/ui/card';
import { Button } from '../../UI/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ShipmentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { shipment, loading, error } = useShipment(id);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !shipment) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{error?.message || 'Shipment not found'}</p>
            <Button onClick={() => navigate('/shipments')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shipments
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // From what we've learned, ShipmentDetails renders directly without props
  // The component likely uses a context or hooks for data fetching
  return (
    <div className="container mx-auto py-6">
      <ShipmentDetails />
    </div>
  );
};

export default ShipmentDetailsPage;