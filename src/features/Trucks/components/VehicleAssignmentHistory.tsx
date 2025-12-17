import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../UI/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '../../UI/components/ui/card';
import { Badge } from '../../UI/components/ui/badge';
import { 
  Calendar, 
  User, 
  MapPin, 
  TrendingUp, 
  Truck,
  Navigation 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AssignmentRecord {
  id: string;
  shipmentId: string;
  driverId: string;
  driverName: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'cancelled';
  origin: string;
  destination: string;
  distance: number;
  duration: number;
  notes?: string;
}

interface VehicleAssignmentHistoryProps {
  vehicleId: string;
}

const VehicleAssignmentHistory: React.FC<VehicleAssignmentHistoryProps> = ({ vehicleId }) => {
  const [assignments, setAssignments] = useState<AssignmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignmentHistory = async () => {
      try {
        setLoading(true);
        
        // This would typically be an API call, we'll simulate it here
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data
        const mockAssignments: AssignmentRecord[] = [
          {
            id: 'asg-001',
            shipmentId: 'SHIP-2025-0023',
            driverId: 'DRV-001',
            driverName: 'Michael Johnson',
            startDate: '2025-04-10',
            endDate: '2025-04-15',
            status: 'completed',
            origin: 'Los Angeles, CA',
            destination: 'Phoenix, AZ',
            distance: 574,
            duration: 6.5,
            notes: 'Delivered on time'
          },
          {
            id: 'asg-002',
            shipmentId: 'SHIP-2025-0045',
            driverId: 'DRV-002',
            driverName: 'Sarah Williams',
            startDate: '2025-03-25',
            endDate: '2025-03-28',
            status: 'completed',
            origin: 'Phoenix, AZ',
            destination: 'Denver, CO',
            distance: 862,
            duration: 13,
            notes: 'Encountered delay due to weather'
          },
          {
            id: 'asg-003',
            shipmentId: 'SHIP-2025-0056',
            driverId: 'DRV-001',
            driverName: 'Michael Johnson',
            startDate: '2025-03-15',
            endDate: '2025-03-20',
            status: 'completed',
            origin: 'Denver, CO',
            destination: 'Chicago, IL',
            distance: 1454,
            duration: 19,
            notes: 'Completed ahead of schedule'
          },
          {
            id: 'asg-004',
            shipmentId: 'SHIP-2025-0078',
            driverId: 'DRV-003',
            driverName: 'Robert Davis',
            startDate: '2025-03-05',
            endDate: '2025-03-10',
            status: 'completed',
            origin: 'Chicago, IL',
            destination: 'New York, NY',
            distance: 1270,
            duration: 15,
            notes: 'Standard delivery'
          },
          {
            id: 'asg-005',
            shipmentId: 'SHIP-2025-0089',
            driverId: 'DRV-001',
            driverName: 'Michael Johnson',
            startDate: '2025-04-20',
            status: 'active',
            origin: 'New York, NY',
            destination: 'Miami, FL',
            distance: 1759,
            duration: 24
          }
        ];
        
        // Sort by date (descending)
        mockAssignments.sort((a, b) => 
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
        
        setAssignments(mockAssignments);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load assignment history'));
        console.error('Error fetching assignment history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignmentHistory();
  }, [vehicleId]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleRowClick = (shipmentId: string) => {
    navigate(`/shipments/${shipmentId}`);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <p>Loading assignment history...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <p className="text-red-500">Error loading assignment history: {error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (assignments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Assignment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500">No assignment history found for this vehicle.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Truck className="mr-2 h-5 w-5" />
          Assignment History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Shipment ID</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Distance</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignments.map((assignment) => (
              <TableRow 
                key={assignment.id} 
                onClick={() => handleRowClick(assignment.shipmentId)}
                className="cursor-pointer hover:bg-gray-50"
              >
                <TableCell>{assignment.shipmentId}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4 text-gray-400" />
                    {assignment.driverName}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                    <span>{new Date(assignment.startDate).toLocaleDateString()}</span>
                    {assignment.endDate && (
                      <>
                        <span className="mx-1">-</span>
                        <span>{new Date(assignment.endDate).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                    <div className="flex flex-col">
                      <span className="text-xs">{assignment.origin}</span>
                      <Navigation className="h-3 w-3 mx-auto my-1 text-gray-400" />
                      <span className="text-xs">{assignment.destination}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <TrendingUp className="mr-2 h-4 w-4 text-gray-400" />
                    <span>{assignment.distance} mi</span>
                    <span className="ml-2 text-xs text-gray-500">
                      ({assignment.duration} hrs)
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(assignment.status)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default VehicleAssignmentHistory;