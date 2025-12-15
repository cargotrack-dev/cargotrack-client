// src/components/maintenance/MaintenanceDashboard.tsx
// ✅ FIXED: All TypeScript errors resolved

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMaintenance } from '@features/Maintenance/contexts'; // ✅ FIXED: Correct import path
import { Card, CardContent, CardHeader, CardTitle } from '@features/UI/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@features/UI/components/ui/tabs';
import { Button } from '@features/UI/components/ui/button';
import { Input } from '@features/UI/components/ui/input';
import { Badge } from '@features/UI/components/ui/badge';
import { 
  Search, 
  AlertTriangle,
  RefreshCw,
  Plus
} from 'lucide-react';
import { 
  MaintenanceStatus, 
  MaintenancePriority,
  MaintenanceSchedule,
  MAINTENANCE_STATUS_COLORS, 
  MAINTENANCE_STATUS_LABELS,
  MAINTENANCE_PRIORITY_LABELS
} from '../types/maintenance';
// ✅ FIXED: Correct default imports instead of named imports
import MaintenanceScheduleList from './MaintenanceScheduleList';
import MaintenanceReminders from './MaintenanceReminders';
import MaintenanceCalendar from './MaintenanceCalendar';

const MaintenanceDashboard: React.FC = () => {
  const { schedules, reminders, loadSchedules, loadReminders, isLoading } = useMaintenance();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<MaintenanceStatus | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<MaintenancePriority | 'all'>('all');
  const [activeTab, setActiveTab] = useState('upcoming');
  
  const navigate = useNavigate();

  // ✅ FIXED: Properly typed accessor functions for optional fields
  const getVehicleName = (schedule: MaintenanceSchedule): string => {
    return schedule.vehicleName || 'Unknown Vehicle';
  };

  const getScheduleStatus = (schedule: MaintenanceSchedule): MaintenanceStatus => {
    return schedule.status || MaintenanceStatus.SCHEDULED;
  };

  const getSchedulePriority = (schedule: MaintenanceSchedule): MaintenancePriority => {
    return schedule.priority || MaintenancePriority.MEDIUM;
  };

  const getAssigneeName = (schedule: MaintenanceSchedule): string => {
    return schedule.assigneeName || '';
  };

  // Filter schedules based on search term, status, and priority
  const filteredSchedules = schedules.filter(schedule => {
    const vehicleName = getVehicleName(schedule);
    const assigneeName = getAssigneeName(schedule);
    const scheduleStatus = getScheduleStatus(schedule);
    const schedulePriority = getSchedulePriority(schedule);
    
    const matchesSearch = 
      searchTerm === '' || 
      vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (assigneeName && assigneeName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || scheduleStatus === filterStatus;
    const matchesPriority = filterPriority === 'all' || schedulePriority === filterPriority;
    
    // For "upcoming" tab, show only scheduled or overdue
    if (activeTab === 'upcoming') {
      return matchesSearch && matchesStatus && matchesPriority && 
             (scheduleStatus === MaintenanceStatus.SCHEDULED || 
              scheduleStatus === MaintenanceStatus.OVERDUE);
    }
    
    // For "in-progress" tab
    if (activeTab === 'in-progress') {
      return matchesSearch && matchesStatus && matchesPriority && 
             scheduleStatus === MaintenanceStatus.IN_PROGRESS;
    }
    
    // For "completed" tab
    if (activeTab === 'completed') {
      return matchesSearch && matchesStatus && matchesPriority && 
             scheduleStatus === MaintenanceStatus.COMPLETED;
    }
    
    // For "all" tab
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // ✅ FIXED: Get counts for status summary with proper typing - status is guaranteed to be MaintenanceStatus
  const statusCounts = schedules.reduce((acc, schedule) => {
    const status: MaintenanceStatus = getScheduleStatus(schedule); // Explicitly typed as MaintenanceStatus
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<MaintenanceStatus, number>);

  // Count upcoming and overdue with safe field access
  const upcomingCount = schedules.filter(s => {
    const status = getScheduleStatus(s);
    return status === MaintenanceStatus.SCHEDULED || status === MaintenanceStatus.OVERDUE;
  }).length;
  
  const overdueCount = schedules.filter(s => {
    const status = getScheduleStatus(s);
    return status === MaintenanceStatus.OVERDUE;
  }).length;

  // Handle refresh
  const handleRefresh = () => {
    loadSchedules();
    loadReminders();
  };

  // Navigate to create new maintenance schedule
  const handleCreateNew = () => {
    navigate('/maintenance/schedule/new');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-blue-50 border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="text-blue-800">
              Maintenance Dashboard
            </CardTitle>
            <div className="space-x-2">
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                onClick={handleCreateNew}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Schedule
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Status Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <p className="text-sm text-gray-500">Total Schedules</p>
                <h3 className="text-2xl font-bold">{schedules.length}</h3>
              </CardContent>
            </Card>
            
            <Card className={`${MAINTENANCE_STATUS_COLORS[MaintenanceStatus.SCHEDULED]} bg-opacity-30`}>
              <CardContent className="p-4">
                <p className="text-sm text-gray-500">Upcoming</p>
                <h3 className="text-2xl font-bold">{upcomingCount}</h3>
              </CardContent>
            </Card>
            
            <Card className={`${MAINTENANCE_STATUS_COLORS[MaintenanceStatus.OVERDUE]} bg-opacity-30`}>
              <CardContent className="p-4">
                <p className="text-sm text-gray-500">Overdue</p>
                <h3 className="text-2xl font-bold">{overdueCount}</h3>
                {overdueCount > 0 && (
                  <div className="flex items-center text-red-600 text-xs mt-1">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Requires attention
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className={`${MAINTENANCE_STATUS_COLORS[MaintenanceStatus.IN_PROGRESS]} bg-opacity-30`}>
              <CardContent className="p-4">
                <p className="text-sm text-gray-500">In Progress</p>
                <h3 className="text-2xl font-bold">{statusCounts[MaintenanceStatus.IN_PROGRESS] || 0}</h3>
              </CardContent>
            </Card>
            
            <Card className={`${MAINTENANCE_STATUS_COLORS[MaintenanceStatus.COMPLETED]} bg-opacity-30`}>
              <CardContent className="p-4">
                <p className="text-sm text-gray-500">Completed</p>
                <h3 className="text-2xl font-bold">{statusCounts[MaintenanceStatus.COMPLETED] || 0}</h3>
              </CardContent>
            </Card>
          </div>
          
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="upcoming" className="relative">
                  Upcoming
                  {overdueCount > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {overdueCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                <TabsTrigger value="reminders">
                  Reminders
                  {reminders.length > 0 && (
                    <Badge className="ml-2 bg-yellow-500">
                      {reminders.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
              
              {/* Search and Filters */}
              {activeTab !== 'calendar' && activeTab !== 'reminders' && (
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search schedules..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-[250px]"
                    />
                  </div>
                  
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as MaintenanceStatus | 'all')}
                    className="border rounded p-2"
                  >
                    <option value="all">All Statuses</option>
                    {Object.entries(MAINTENANCE_STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                  
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value as MaintenancePriority | 'all')}
                    className="border rounded p-2"
                  >
                    <option value="all">All Priorities</option>
                    {Object.entries(MAINTENANCE_PRIORITY_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            
            {/* Tab Contents */}
            <TabsContent value="upcoming" className="pt-4">
              <MaintenanceScheduleList 
                schedules={filteredSchedules}
                isLoading={isLoading}
              />
            </TabsContent>
            
            <TabsContent value="in-progress" className="pt-4">
              <MaintenanceScheduleList 
                schedules={filteredSchedules}
                isLoading={isLoading}
              />
            </TabsContent>
            
            <TabsContent value="completed" className="pt-4">
              <MaintenanceScheduleList 
                schedules={filteredSchedules}
                isLoading={isLoading}
              />
            </TabsContent>
            
            <TabsContent value="all" className="pt-4">
              <MaintenanceScheduleList 
                schedules={filteredSchedules}
                isLoading={isLoading}
              />
            </TabsContent>
            
            <TabsContent value="calendar" className="pt-4">
              <MaintenanceCalendar 
                schedules={schedules}
              />
            </TabsContent>
            
            <TabsContent value="reminders" className="pt-4">
              <MaintenanceReminders 
                reminders={reminders}
                isLoading={isLoading}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenanceDashboard;