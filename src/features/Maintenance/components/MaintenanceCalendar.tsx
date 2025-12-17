// src/components/maintenance/MaintenanceCalendar.tsx
// ✅ FIXED: All TypeScript errors resolved with proper null checks

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card,
  CardContent
} from '../../UI/components/ui/card';
import { Button } from '../../UI/components/ui/button';
import { Badge } from '../../UI/components/ui/badge';
import { 
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  ExternalLink
} from 'lucide-react';
import { 
  MaintenanceSchedule, 
  MaintenanceStatus,
  MAINTENANCE_STATUS_LABELS,
  MAINTENANCE_STATUS_COLORS
} from '../types/maintenance';

interface MaintenanceCalendarProps {
  schedules: MaintenanceSchedule[];
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  schedules: MaintenanceSchedule[];
}

const MaintenanceCalendar: React.FC<MaintenanceCalendarProps> = ({ schedules }) => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Navigate to schedule details
  const viewScheduleDetails = (id: string) => {
    navigate(`/maintenance/schedule/${id}`);
  };

  // ✅ FIXED: Safe accessor functions for optional fields
  const getScheduledDate = (schedule: MaintenanceSchedule): string => {
    return schedule.scheduledDate || new Date().toISOString();
  };

  const getScheduleStatus = (schedule: MaintenanceSchedule): MaintenanceStatus => {
    return schedule.status || MaintenanceStatus.SCHEDULED;
  };

  const getScheduleTasks = (schedule: MaintenanceSchedule) => {
    return schedule.tasks || [];
  };

  const getVehicleName = (schedule: MaintenanceSchedule): string => {
    return schedule.vehicleName || 'Unknown Vehicle';
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  // Get days for current month view
  const getDaysInMonthView = (date: Date): CalendarDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();
    
    // Calculate how many days to show from previous month
    const daysFromPrevMonth = firstDayOfWeek;
    
    // Calculate total days in the current month
    const daysInMonth = lastDay.getDate();
    
    // Calculate how many days to show from next month to complete the grid
    // We'll create a 6-row calendar (42 days) to have consistent height
    const totalCells = 42;
    const daysFromNextMonth = totalCells - daysInMonth - daysFromPrevMonth;
    
    const days: CalendarDay[] = [];
    
    // Add days from previous month
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      const day = new Date(year, month, 0 - i);
      days.push({
        date: day,
        isCurrentMonth: false,
        isToday: isSameDay(day, new Date()),
        schedules: getSchedulesForDay(day)
      });
    }
    
    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(year, month, i);
      days.push({
        date: day,
        isCurrentMonth: true,
        isToday: isSameDay(day, new Date()),
        schedules: getSchedulesForDay(day)
      });
    }
    
    // Add days from next month
    for (let i = 1; i <= daysFromNextMonth; i++) {
      const day = new Date(year, month + 1, i);
      days.push({
        date: day,
        isCurrentMonth: false,
        isToday: isSameDay(day, new Date()),
        schedules: getSchedulesForDay(day)
      });
    }
    
    return days;
  };
  
  // Helper to check if two dates are the same day
  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };
  
  // ✅ FIXED: Filter schedules for a specific day with safe date handling
  const getSchedulesForDay = (date: Date): MaintenanceSchedule[] => {
    return schedules.filter(schedule => {
      const scheduleDateString = getScheduledDate(schedule);
      const scheduleDate = new Date(scheduleDateString);
      return isSameDay(scheduleDate, date);
    });
  };
  
  // Get days of the week headers
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };
  
  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };
  
  // Navigate to current month
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Get calendar days
  const calendarDays = getDaysInMonthView(currentDate);
  
  // ✅ FIXED: Get schedules for the selected date with safe date handling
  const selectedDateSchedules = selectedDate 
    ? schedules.filter(schedule => {
        const scheduleDateString = getScheduledDate(schedule);
        return isSameDay(new Date(scheduleDateString), selectedDate);
      })
    : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Button variant="outline" size="sm" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-medium mx-4">
            {formatDate(currentDate)}
          </h3>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <Button variant="outline" onClick={goToToday}>
          Today
        </Button>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {daysOfWeek.map((day, index) => (
          <div 
            key={day} 
            className={`text-center p-2 text-sm font-medium ${index === 0 || index === 6 ? 'text-red-500' : 'text-gray-700'}`}
          >
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {calendarDays.map((day, index) => (
          <div 
            key={index}
            className={`
              relative min-h-24 p-1 border ${day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
              ${day.isToday ? 'border-blue-500' : 'border-gray-200'}
              ${selectedDate && isSameDay(day.date, selectedDate) ? 'ring-2 ring-blue-500' : ''}
              hover:bg-blue-50 cursor-pointer
            `}
            onClick={() => setSelectedDate(day.date)}
          >
            <div className="flex justify-between">
              <span 
                className={`
                  text-sm font-medium p-1 rounded-full w-6 h-6 flex items-center justify-center
                  ${!day.isCurrentMonth ? 'text-gray-400' : ''}
                  ${day.isToday ? 'bg-blue-500 text-white' : ''}
                `}
              >
                {day.date.getDate()}
              </span>
              
              {day.schedules.length > 0 && (
                <Badge className="text-xs">{day.schedules.length}</Badge>
              )}
            </div>
            
            <div className="mt-1 space-y-1 max-h-20 overflow-hidden">
              {day.schedules.slice(0, 2).map(schedule => {
                const scheduleStatus = getScheduleStatus(schedule);
                const vehicleName = getVehicleName(schedule);
                const tasks = getScheduleTasks(schedule);
                
                return (
                  <div 
                    key={schedule.id}
                    className={`
                      text-xs px-1 py-0.5 rounded truncate
                      ${MAINTENANCE_STATUS_COLORS[scheduleStatus]} bg-opacity-80
                    `}
                    title={`${vehicleName} - ${tasks.length} tasks`}
                  >
                    {vehicleName}
                  </div>
                );
              })}
              
              {day.schedules.length > 2 && (
                <div className="text-xs text-center text-gray-500">
                  +{day.schedules.length - 2} more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Selected day details */}
      {selectedDate && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2 text-blue-500" />
                Maintenance for {new Intl.DateTimeFormat('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                }).format(selectedDate)}
              </h3>
            </div>
            
            {selectedDateSchedules.length === 0 ? (
              <p className="text-gray-500 text-sm">No maintenance scheduled for this day.</p>
            ) : (
              <div className="space-y-3">
                {selectedDateSchedules.map(schedule => {
                  const scheduleStatus = getScheduleStatus(schedule);
                  const vehicleName = getVehicleName(schedule);
                  const tasks = getScheduleTasks(schedule);
                  
                  return (
                    <div key={schedule.id} className="flex items-start p-3 border rounded-lg">
                      <div className="flex-grow">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{vehicleName}</h4>
                          <Badge className={`${MAINTENANCE_STATUS_COLORS[scheduleStatus]} bg-opacity-80`}>
                            {MAINTENANCE_STATUS_LABELS[scheduleStatus]}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-gray-600 mt-1">
                          {tasks.length} task{tasks.length !== 1 ? 's' : ''}
                        </div>
                        
                        {schedule.assigneeName && (
                          <div className="text-sm text-gray-600 mt-1">
                            Assigned to: {schedule.assigneeName}
                          </div>
                        )}
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            viewScheduleDetails(schedule.id);
                          }}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MaintenanceCalendar;