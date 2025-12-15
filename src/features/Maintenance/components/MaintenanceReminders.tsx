// src/components/maintenance/MaintenanceReminders.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card,
  CardContent,
  CardFooter
} from '@features/UI/components/ui/card';
import { Button } from '@features/UI/components/ui/button';
import { Badge } from '@features/UI/components/ui/badge';
import { 
  Bell,
  Calendar,
  Truck as TruckIcon,
  AlertTriangle,
  Wrench,
  Clock
} from 'lucide-react';
import { 
  MaintenanceReminder, 
  MaintenanceType,
  MAINTENANCE_PRIORITY_COLORS,
  MAINTENANCE_PRIORITY_LABELS,
  MAINTENANCE_TYPE_LABELS
} from '../types/maintenance';

interface MaintenanceRemindersProps {
  reminders: MaintenanceReminder[];
  isLoading: boolean;
}

const MaintenanceReminders: React.FC<MaintenanceRemindersProps> = ({ 
  reminders, 
  isLoading 
}) => {
  const navigate = useNavigate();

  const handleScheduleMaintenance = (vehicleId: string, reminderType: MaintenanceType) => {
    navigate(`/maintenance/schedule/new?vehicleId=${vehicleId}&type=${reminderType}`);
  };

  // Format date for readable display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Get color based on days remaining
  const getTimeBasedColor = (daysRemaining: number) => {
    if (daysRemaining <= 0) return 'text-red-600';
    if (daysRemaining <= 7) return 'text-orange-500';
    if (daysRemaining <= 14) return 'text-yellow-500';
    return 'text-green-600';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (reminders.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-lg">
        <Bell className="h-10 w-10 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500">No maintenance reminders at this time.</p>
        <p className="text-sm text-gray-400 mt-1">All vehicles are up to date with their maintenance schedules.</p>
      </div>
    );
  }

  // Group reminders by vehicle
  const remindersByVehicle = reminders.reduce<Record<string, MaintenanceReminder[]>>((acc, reminder) => {
    if (!acc[reminder.vehicleId]) {
      acc[reminder.vehicleId] = [];
    }
    acc[reminder.vehicleId].push(reminder);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(remindersByVehicle).map(([vehicleId, vehicleReminders]) => (
        <Card key={vehicleId} className="overflow-hidden">
          <div className="bg-blue-50 p-4 border-b">
            <div className="flex items-center">
              <TruckIcon className="h-5 w-5 mr-2 text-blue-600" />
              <h3 className="font-semibold text-blue-800">{vehicleReminders[0].vehicleName}</h3>
            </div>
          </div>
          
          <CardContent className="p-4">
            <div className="space-y-4">
              {vehicleReminders.map((reminder) => (
                <div key={reminder.id} className="flex items-start border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                  <div className="bg-blue-100 p-2 rounded mr-4">
                    <Wrench className="h-5 w-5 text-blue-700" />
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{reminder.taskName}</h4>
                      <Badge className={`${MAINTENANCE_PRIORITY_COLORS[reminder.priority]} bg-opacity-80 text-gray-800`}>
                        {MAINTENANCE_PRIORITY_LABELS[reminder.priority]}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-1">
                      {MAINTENANCE_TYPE_LABELS[reminder.type]}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                        <span className="text-sm">{formatDate(reminder.dueDate)}</span>
                      </div>
                      
                      <div className={`flex items-center text-sm ${getTimeBasedColor(reminder.daysRemaining)}`}>
                        <Clock className="h-4 w-4 mr-1" />
                        {reminder.daysRemaining <= 0 
                          ? <span>Overdue by {Math.abs(reminder.daysRemaining)} days</span>
                          : <span>{reminder.daysRemaining} days remaining</span>
                        }
                      </div>
                    </div>
                    
                    {reminder.milesRemaining !== undefined && (
                      <div className="flex items-center mt-1 text-sm">
                        <span className="text-gray-500 mr-2">Mileage:</span>
                        <span className={reminder.milesRemaining <= 0 ? 'text-red-600' : ''}>
                          {reminder.milesRemaining <= 0 
                            ? `Overdue by ${Math.abs(reminder.milesRemaining)} miles` 
                            : `${reminder.milesRemaining} miles remaining`
                          }
                        </span>
                      </div>
                    )}
                    
                    {reminder.daysRemaining <= 0 && (
                      <div className="flex items-center mt-2 text-red-600 text-xs">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        <span>Requires immediate attention</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          
          <CardFooter className="bg-gray-50 p-4 border-t">
            <Button
              onClick={() => handleScheduleMaintenance(vehicleId, vehicleReminders[0].type)}
              className="w-full"
            >
              Schedule Maintenance
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default MaintenanceReminders