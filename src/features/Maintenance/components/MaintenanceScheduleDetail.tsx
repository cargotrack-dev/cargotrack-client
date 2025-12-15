// src/components/maintenance/MaintenanceScheduleDetail.tsx
// ✅ FIXED: All TypeScript errors resolved with proper null checks

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMaintenance } from '@features/Maintenance/contexts'; // ✅ FIXED: Correct import path
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@features/UI/components/ui/card';
import { Button } from '@features/UI/components/ui/button';
import { Badge } from '@features/UI/components/ui/badge';
import { Textarea } from '@features/UI/components/ui/textarea';
import { Input } from '@features/UI/components/ui/input';
import { 
  ChevronLeft, 
  Calendar,
  Truck as TruckIcon,
  User,
  Wrench,
  DollarSign,
  CheckCircle,
  Edit,
  Trash2,
  PlusCircle
} from 'lucide-react';
import { 
  MaintenanceStatus,
  MaintenancePriority,
  MAINTENANCE_STATUS_COLORS, 
  MAINTENANCE_STATUS_LABELS,
  MAINTENANCE_PRIORITY_COLORS,
  MAINTENANCE_PRIORITY_LABELS,
  MAINTENANCE_TYPE_LABELS,
  MaintenanceTaskExtended,
  MaintenancePart
} from '../types/maintenance';

const MaintenanceScheduleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSchedule, deleteSchedule, completeMaintenanceTask, isLoading } = useMaintenance();
  const [taskCompletionData, setTaskCompletionData] = useState<{
    taskId: string;
    actualHours: number;
    notes: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const schedule = id ? getSchedule(id) : undefined;

  // ✅ FIXED: Safe accessor functions for optional fields
  const getScheduleStatus = () => {
    return schedule?.status || MaintenanceStatus.SCHEDULED;
  };

  const getSchedulePriority = () => {
    return schedule?.priority || MaintenancePriority.MEDIUM;
  };

  const getScheduledDate = () => {
    return schedule?.scheduledDate || new Date().toISOString();
  };

  const getEstimatedCost = () => {
    return schedule?.estimatedCost || 0;
  };

  const getVehicleName = () => {
    return schedule?.vehicleName || 'Unknown Vehicle';
  };

  const getScheduleTasks = () => {
    return schedule?.tasks || [];
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-xl font-semibold mb-2">Maintenance Schedule Not Found</h2>
        <p className="text-gray-500 mb-4">The requested maintenance schedule could not be found.</p>
        <Button onClick={() => navigate('/maintenance')}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Maintenance
        </Button>
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Check if a date is in the past
  const isPastDate = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  // Handle marking a task as completed
  const handleCompleteTask = async (taskId: string) => {
    if (!taskCompletionData) return;
    
    setIsUpdating(true);
    try {
      await completeMaintenanceTask(
        id as string,
        taskId,
        taskCompletionData.actualHours,
        taskCompletionData.notes
      );
      setTaskCompletionData(null);
    } catch (error) {
      console.error('Failed to complete task:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle deleting the schedule
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this maintenance schedule?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteSchedule(id as string);
      navigate('/maintenance');
    } catch (error) {
      console.error('Failed to delete schedule:', error);
      setIsDeleting(false);
    }
  };

  // Get safe values for rendering
  const scheduleStatus = getScheduleStatus();
  const schedulePriority = getSchedulePriority();
  const scheduledDate = getScheduledDate();
  const estimatedCost = getEstimatedCost();
  const vehicleName = getVehicleName();
  const tasks = getScheduleTasks();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate('/maintenance')} className="mr-4">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Maintenance
        </Button>
        
        <div className="flex space-x-2">
          {scheduleStatus !== MaintenanceStatus.COMPLETED && (
            <Button 
              variant="outline" 
              onClick={() => navigate(`/maintenance/schedule/edit/${id}`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Schedule
            </Button>
          )}
          
          <Button 
            variant="outline" 
            className="bg-red-500 hover:bg-red-600 text-white hover:text-white"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isDeleting ? 'Deleting...' : 'Delete Schedule'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="bg-blue-50 border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="text-blue-800 flex items-center">
              <TruckIcon className="h-5 w-5 mr-2" />
              {vehicleName} Maintenance
            </CardTitle>
            <Badge className={`${MAINTENANCE_STATUS_COLORS[scheduleStatus]} bg-opacity-80`}>
              {MAINTENANCE_STATUS_LABELS[scheduleStatus]}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Vehicle Details</h3>
                <p className="flex items-center font-medium">
                  <TruckIcon className="h-4 w-4 mr-2 text-gray-500" />
                  {vehicleName} {schedule.vehicleType ? `- ${schedule.vehicleType}` : ''}
                </p>
                {schedule.mileage && (
                  <p className="text-sm text-gray-500 mt-1">
                    Current mileage: {schedule.mileage.toLocaleString()} miles
                  </p>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Priority</h3>
                <Badge className={`${MAINTENANCE_PRIORITY_COLORS[schedulePriority]} bg-opacity-80 mt-1`}>
                  {MAINTENANCE_PRIORITY_LABELS[schedulePriority]}
                </Badge>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Assigned To</h3>
                {schedule.assigneeName ? (
                  <p className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    {schedule.assigneeName}
                  </p>
                ) : (
                  <p className="text-gray-500">Not assigned</p>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Scheduled Date</h3>
                <p className={`flex items-center ${isPastDate(scheduledDate) && scheduleStatus !== MaintenanceStatus.COMPLETED ? 'text-red-600' : ''}`}>
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  {formatDate(scheduledDate)}
                </p>
              </div>
              
              {schedule.completionDate && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Completion Date</h3>
                  <p className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {formatDate(schedule.completionDate)}
                  </p>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Location</h3>
                <p className="text-gray-800">{schedule.location || 'Main Facility'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Cost</h3>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="font-semibold">
                    {scheduleStatus === MaintenanceStatus.COMPLETED && schedule.actualCost 
                      ? schedule.actualCost.toFixed(2)
                      : estimatedCost.toFixed(2)}
                  </span>
                  <span className="ml-1 text-gray-500">
                    {scheduleStatus === MaintenanceStatus.COMPLETED && schedule.actualCost 
                      ? '(Actual)' 
                      : '(Estimated)'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {schedule.notes && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500">Notes</h3>
              <p className="p-3 bg-gray-50 rounded-md mt-1">{schedule.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Tasks List */}
      <Card>
        <CardHeader className="bg-blue-50 border-b">
          <CardTitle className="text-blue-800 flex items-center">
            <Wrench className="h-5 w-5 mr-2" />
            Maintenance Tasks
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="space-y-6">
            {tasks.map((task: MaintenanceTaskExtended) => (
              <div 
                key={task.id} 
                className={`border rounded-lg overflow-hidden ${task.completed ? 'bg-green-50 border-green-200' : ''}`}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium flex items-center">
                        {task.completed && <CheckCircle className="h-4 w-4 mr-2 text-green-500" />}
                        {task.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    </div>
                    
                    <Badge className="bg-blue-100 text-blue-800">
                      {MAINTENANCE_TYPE_LABELS[task.type]}
                    </Badge>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Estimated Time:</p>
                      <p className="font-medium">{task.estimatedHours} hours</p>
                    </div>
                    
                    {task.completed && task.actualHours && (
                      <div>
                        <p className="text-sm text-gray-600">Actual Time:</p>
                        <p className="font-medium">{task.actualHours} hours</p>
                      </div>
                    )}
                  </div>
                  
                  {task.parts && task.parts.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">Required Parts:</p>
                      <div className="space-y-2">
                        {task.parts.map((part: MaintenancePart) => (
                          <div key={part.partId} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <div className="flex items-center">
                              <span className="font-medium">{part.partName}</span>
                              <span className="text-sm text-gray-500 ml-2">×{part.quantity}</span>
                            </div>
                            <Badge className={part.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                              {part.inStock ? 'In Stock' : 'Out of Stock'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Task completion form */}
                  {!task.completed && scheduleStatus !== MaintenanceStatus.COMPLETED && (
                    <div className="mt-4">
                      {taskCompletionData?.taskId === task.id ? (
                        <div className="border-t pt-4 mt-4">
                          <h4 className="font-medium mb-2">Complete Task</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium mb-1">Actual Hours</label>
                              <Input
                                type="number"
                                min="0"
                                step="0.25"
                                value={taskCompletionData.actualHours}
                                onChange={(e) => {
                                  if (taskCompletionData) {
                                    setTaskCompletionData({
                                      ...taskCompletionData,
                                      actualHours: parseFloat(e.target.value) || 0
                                    });
                                  }
                                }}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-1">Notes</label>
                              <Textarea
                                value={taskCompletionData.notes}
                                onChange={(e) => {
                                  if (taskCompletionData) {
                                    setTaskCompletionData({
                                      ...taskCompletionData,
                                      notes: e.target.value
                                    });
                                  }
                                }}
                                placeholder="Add notes about the completed task..."
                                className="min-h-[100px]"
                              />
                            </div>
                            
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                onClick={() => setTaskCompletionData(null)}
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={() => handleCompleteTask(task.id)}
                                disabled={isUpdating}
                              >
                                {isUpdating ? 'Saving...' : 'Mark as Completed'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => setTaskCompletionData({
                            taskId: task.id,
                            actualHours: task.estimatedHours,
                            notes: ''
                          })}
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Complete Task
                        </Button>
                      )}
                    </div>
                  )}
                  
                  {task.completed && task.notes && (
                    <div className="mt-4 bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-600 font-medium">Completion Notes:</p>
                      <p className="text-sm">{task.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenanceScheduleDetail;