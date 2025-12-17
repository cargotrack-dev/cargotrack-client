// src/components/maintenance/MaintenanceScheduleList.tsx
// ✅ FIXED: All TypeScript errors resolved with proper null checks

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../UI/components/ui/table';
import { Button } from '../../UI/components/ui/button';
import { Badge } from '../../UI/components/ui/badge';
import { 
  ExternalLink, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Truck as TruckIcon,
  User,
  Wrench,
  DollarSign
} from 'lucide-react';
import { 
  MaintenanceSchedule, 
  MaintenanceStatus,
  MaintenancePriority,
  MAINTENANCE_STATUS_COLORS, 
  MAINTENANCE_STATUS_LABELS,
  MAINTENANCE_PRIORITY_COLORS,
  MAINTENANCE_PRIORITY_LABELS
} from '../types/maintenance';

interface MaintenanceScheduleListProps {
  schedules: MaintenanceSchedule[];
  isLoading: boolean;
}

const MaintenanceScheduleList: React.FC<MaintenanceScheduleListProps> = ({ 
  schedules, 
  isLoading 
}) => {
  const navigate = useNavigate();

  const viewScheduleDetails = (id: string) => {
    navigate(`/maintenance/schedule/${id}`);
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

  // Check if a date is in the past
  const isPastDate = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  // Calculate days until or days overdue
  const getDaysMessage = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Calculate the time difference in days
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else {
      return `Due in ${diffDays} days`;
    }
  };

  // ✅ FIXED: Calculate total tasks and completed tasks with null safety
  const getTaskProgress = (schedule: MaintenanceSchedule) => {
    const tasks = schedule.tasks || []; // ✅ FIXED: Handle undefined tasks
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    return { totalTasks, completedTasks };
  };

  // ✅ FIXED: Safe accessor functions for optional fields
  const getScheduleStatus = (schedule: MaintenanceSchedule): MaintenanceStatus => {
    return schedule.status || MaintenanceStatus.SCHEDULED;
  };

  const getSchedulePriority = (schedule: MaintenanceSchedule): MaintenancePriority => {
    return schedule.priority || MaintenancePriority.MEDIUM;
  };

  const getScheduledDate = (schedule: MaintenanceSchedule): string => {
    return schedule.scheduledDate || new Date().toISOString();
  };

  const getEstimatedCost = (schedule: MaintenanceSchedule): number => {
    return schedule.estimatedCost || 0;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (schedules.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No maintenance schedules found matching your criteria.</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate('/maintenance/schedule/new')}
        >
          Create New Schedule
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vehicle</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Scheduled Date</TableHead>
            <TableHead>Tasks</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Est. Cost</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedules.map((schedule) => {
            const { totalTasks, completedTasks } = getTaskProgress(schedule);
            const scheduleStatus = getScheduleStatus(schedule);
            const schedulePriority = getSchedulePriority(schedule);
            const scheduledDate = getScheduledDate(schedule);
            const estimatedCost = getEstimatedCost(schedule);
            const isOverdue = scheduleStatus === MaintenanceStatus.OVERDUE;
            
            return (
              <TableRow 
                key={schedule.id} 
                className={isOverdue ? 'bg-red-50' : ''}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <TruckIcon className="h-4 w-4 mr-2 text-gray-500" />
                    <div>
                      <div>{schedule.vehicleName || 'Unknown Vehicle'}</div>
                      <div className="text-xs text-gray-500">{schedule.vehicleType || 'Unknown Type'}</div>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <Badge className={`${MAINTENANCE_STATUS_COLORS[scheduleStatus]} bg-opacity-80 flex items-center w-fit`}>
                    {scheduleStatus === MaintenanceStatus.OVERDUE ? (
                      <AlertTriangle className="h-3 w-3 mr-1" />
                    ) : scheduleStatus === MaintenanceStatus.COMPLETED ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <Clock className="h-3 w-3 mr-1" />
                    )}
                    {MAINTENANCE_STATUS_LABELS[scheduleStatus]}
                  </Badge>
                </TableCell>
                
                <TableCell>
                  <Badge className={`${MAINTENANCE_PRIORITY_COLORS[schedulePriority]} bg-opacity-80 text-gray-800`}>
                    {MAINTENANCE_PRIORITY_LABELS[schedulePriority]}
                  </Badge>
                </TableCell>
                
                <TableCell>
                  <div className="flex flex-col">
                    <div className={isPastDate(scheduledDate) && scheduleStatus !== MaintenanceStatus.COMPLETED ? 'text-red-600' : ''}>
                      {formatDate(scheduledDate)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {scheduleStatus !== MaintenanceStatus.COMPLETED && (
                        getDaysMessage(scheduledDate)
                      )}
                      {scheduleStatus === MaintenanceStatus.COMPLETED && schedule.completionDate && (
                        `Completed: ${formatDate(schedule.completionDate)}`
                      )}
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center">
                    <Wrench className="h-4 w-4 mr-2 text-gray-500" />
                    <div>
                      <div>{completedTasks} of {totalTasks} completed</div>
                      {totalTasks > 0 ? (
                        <div className="w-24 h-2 bg-gray-200 rounded mt-1">
                          <div 
                            className="h-2 bg-green-500 rounded" 
                            style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                          ></div>
                        </div>
                      ) : (
                        <div className="w-24 h-2 bg-gray-200 rounded mt-1">
                          <div className="h-2 bg-gray-400 rounded" style={{ width: '0%' }}></div>
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  {schedule.assigneeName ? (
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      {schedule.assigneeName}
                    </div>
                  ) : (
                    <span className="text-gray-500">Unassigned</span>
                  )}
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    {scheduleStatus === MaintenanceStatus.COMPLETED && schedule.actualCost 
                      ? schedule.actualCost.toFixed(2)
                      : estimatedCost.toFixed(2)
                    }
                  </div>
                  {scheduleStatus === MaintenanceStatus.COMPLETED && schedule.actualCost && schedule.actualCost !== estimatedCost && (
                    <div className={`text-xs ${schedule.actualCost > estimatedCost ? 'text-red-500' : 'text-green-500'}`}>
                      {schedule.actualCost > estimatedCost ? '+' : ''}
                      {(schedule.actualCost - estimatedCost).toFixed(2)}
                    </div>
                  )}
                </TableCell>
                
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => viewScheduleDetails(schedule.id)}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default MaintenanceScheduleList;