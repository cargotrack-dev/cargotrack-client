import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../UI/components/ui/table';
import { Badge } from '../../UI/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../UI/components/ui/card';
import { 
  Calendar, 
  DollarSign, 
  User,
  Wrench
} from 'lucide-react';

interface MaintenanceRecord {
  id: string;
  date: string;
  type: 'routine' | 'repair' | 'inspection' | 'emergency';
  description: string;
  cost: number;
  technician: string;
  mileage: number;
  status: 'completed' | 'scheduled' | 'in_progress';
  notes?: string;
  parts?: {
    name: string;
    quantity: number;
    cost: number;
  }[];
}

interface VehicleMaintenanceHistoryProps {
  vehicleId: string;
}

const VehicleMaintenanceHistory: React.FC<VehicleMaintenanceHistoryProps> = ({ vehicleId }) => {
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMaintenanceHistory = async () => {
      try {
        setLoading(true);
        
        // This would typically be an API call, we'll simulate it here
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data
        const mockMaintenanceHistory: MaintenanceRecord[] = [
          {
            id: 'm-001',
            date: '2025-04-15',
            type: 'routine',
            description: 'Regular service maintenance',
            cost: 450,
            technician: 'John Smith',
            mileage: 45000,
            status: 'completed',
            parts: [
              { name: 'Oil Filter', quantity: 1, cost: 25 },
              { name: 'Engine Oil', quantity: 10, cost: 150 },
              { name: 'Air Filter', quantity: 1, cost: 35 }
            ]
          },
          {
            id: 'm-002',
            date: '2025-03-02',
            type: 'repair',
            description: 'Brake system repair',
            cost: 780,
            technician: 'Mike Johnson',
            mileage: 42500,
            status: 'completed',
            parts: [
              { name: 'Brake Pads (Front)', quantity: 2, cost: 120 },
              { name: 'Brake Rotors (Front)', quantity: 2, cost: 350 },
              { name: 'Brake Fluid', quantity: 1, cost: 30 }
            ]
          },
          {
            id: 'm-003',
            date: '2025-02-10',
            type: 'inspection',
            description: 'Annual DOT inspection',
            cost: 250,
            technician: 'Sarah Williams',
            mileage: 40200,
            status: 'completed'
          },
          {
            id: 'm-004',
            date: '2025-01-05',
            type: 'repair',
            description: 'Alternator replacement',
            cost: 520,
            technician: 'Robert Davis',
            mileage: 38500,
            status: 'completed',
            parts: [
              { name: 'Alternator', quantity: 1, cost: 380 },
              { name: 'Drive Belt', quantity: 1, cost: 45 }
            ]
          },
          {
            id: 'm-005',
            date: '2025-05-10',
            type: 'routine',
            description: 'Scheduled maintenance',
            cost: 350,
            technician: 'Mike Johnson',
            mileage: 48000,
            status: 'scheduled',
            notes: 'Will include full inspection of cooling system'
          }
        ];
        
        // Sort by date (descending)
        mockMaintenanceHistory.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        setMaintenanceRecords(mockMaintenanceHistory);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load maintenance history'));
        console.error('Error fetching maintenance history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenanceHistory();
  }, [vehicleId]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'routine':
        return <Badge variant="outline" className="border-blue-500 text-blue-700">Routine</Badge>;
      case 'repair':
        return <Badge variant="outline" className="border-orange-500 text-orange-700">Repair</Badge>;
      case 'inspection':
        return <Badge variant="outline" className="border-green-500 text-green-700">Inspection</Badge>;
      case 'emergency':
        return <Badge variant="outline" className="border-red-500 text-red-700">Emergency</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-gray-200 rounded w-1/4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 border border-red-200 rounded">
        <p>Failed to load maintenance history.</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  // Calculate total maintenance costs
  const totalCost = maintenanceRecords.reduce((sum, record) => sum + record.cost, 0);
  // Count upcoming maintenances
  const upcomingCount = maintenanceRecords.filter(r => r.status === 'scheduled').length;

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Records</p>
              <p className="text-2xl font-bold">{maintenanceRecords.length}</p>
            </div>
            <Wrench className="h-8 w-8 text-gray-400" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Cost</p>
              <p className="text-2xl font-bold">${totalCost.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-gray-400" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Upcoming Services</p>
              <p className="text-2xl font-bold">{upcomingCount}</p>
            </div>
            <Calendar className="h-8 w-8 text-gray-400" />
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Maintenance History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead>Mileage</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {maintenanceRecords.map((record) => (
                <TableRow 
                  key={record.id}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      {new Date(record.date).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(record.type)}</TableCell>
                  <TableCell>{record.description}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1 text-gray-500" />
                      {record.technician}
                    </div>
                  </TableCell>
                  <TableCell>{record.mileage.toLocaleString()} km</TableCell>
                  <TableCell>${record.cost.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {maintenanceRecords.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No maintenance records found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleMaintenanceHistory;