// src/features/Maintenance/contexts/types.ts
// ✅ RECONCILED: Enhanced with missing pieces while keeping your existing structure

import { 
  MaintenanceSchedule, 
  MaintenanceReminder,
  MaintenanceHistory,
  MaintenanceScheduleDetailed
} from '../types/maintenance';

export enum MaintenanceStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled'
}

export enum MaintenanceType {
  ROUTINE = 'routine',
  PREVENTIVE = 'preventive',
  CORRECTIVE = 'corrective',
  EMERGENCY = 'emergency'
}

export interface MaintenanceTask {
  id: string;
  name: string;
  description: string;
  estimatedDuration: number; // in hours
  completed: boolean;
  notes?: string;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  vehicleName: string;
  maintenanceType: MaintenanceType;
  status: MaintenanceStatus;
  title: string;
  description: string;
  scheduledDate: string; // ISO string
  completedDate?: string; // ISO string
  tasks: MaintenanceTask[];
  assignedTechnicians: string[]; // IDs of assigned staff
  estimatedCost: number;
  actualCost?: number;
  attachments?: string[]; // URLs or IDs of related documents
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  createdBy: string; // User ID
  notes?: string;
}

export interface MaintenanceContextType {
  records: MaintenanceRecord[];
  schedules: MaintenanceSchedule[];
  isLoading: boolean;
  error: string | null;
  selectedRecord: MaintenanceRecord | null;
  selectedSchedule: MaintenanceSchedule | null;
  reminders: MaintenanceReminder[];
  history: MaintenanceHistory[];
 
  // CRUD operations for records
  loadMaintenanceRecords: () => Promise<void>;
  getRecordById: (id: string) => MaintenanceRecord | null;
  getRecordsByVehicle: (vehicleId: string) => MaintenanceRecord[];
  createMaintenanceRecord: (data: Omit<MaintenanceRecord, 'id' | 'createdAt' | 'updatedAt'>) => Promise<MaintenanceRecord>;
  updateMaintenanceRecord: (id: string, data: Partial<MaintenanceRecord>) => Promise<MaintenanceRecord>;
  deleteMaintenanceRecord: (id: string) => Promise<void>;
  
  // CRUD operations for schedules (keeping both naming conventions)
  loadMaintenanceSchedules: () => Promise<void>;
  loadSchedules: () => Promise<void>; // ✅ KEEPING: Your existing method
  getScheduleById: (id: string) => MaintenanceSchedule | null;
  getSchedulesByVehicle: (vehicleId: string) => MaintenanceSchedule[];
  createMaintenanceSchedule: (data: Omit<MaintenanceSchedule, 'id' | 'createdAt' | 'updatedAt'>) => Promise<MaintenanceSchedule>;
  createSchedule: (schedule: Omit<MaintenanceSchedule, 'id'>) => Promise<MaintenanceSchedule>; // ✅ KEEPING: Your existing method
  updateMaintenanceSchedule: (id: string, data: Partial<MaintenanceSchedule>) => Promise<MaintenanceSchedule>;
  updateSchedule: (id: string, schedule: Partial<MaintenanceSchedule>) => Promise<MaintenanceSchedule>; // ✅ KEEPING: Your existing method
  deleteMaintenanceSchedule: (id: string) => Promise<void>;
  deleteSchedule: (id: string) => Promise<boolean>; // ✅ KEEPING: Your existing method
  getSchedule: (id: string) => MaintenanceScheduleDetailed | undefined; // ✅ KEEPING: Your detailed view method
  
  // Task management
  addTaskToRecord: (recordId: string, task: Omit<MaintenanceTask, 'id'>) => Promise<MaintenanceRecord>;
  updateTask: (recordId: string, taskId: string, updates: Partial<MaintenanceTask>) => Promise<MaintenanceRecord>;
  removeTask: (recordId: string, taskId: string) => Promise<MaintenanceRecord>;
  completeMaintenanceTask: (scheduleId: string, taskId: string, actualHours: number, notes: string) => Promise<void>; // ✅ KEEPING: Your existing method
  
  // Status management
  updateMaintenanceStatus: (recordId: string, status: MaintenanceStatus) => Promise<MaintenanceRecord>;
  completeMaintenanceRecord: (recordId: string, completionDetails: {
    completedDate: string;
    actualCost: number;
    notes?: string;
  }) => Promise<MaintenanceRecord>;
  
  // Reminder operations
  loadReminders: () => Promise<void>;
  createReminder: (reminder: Omit<MaintenanceReminder, 'id'>) => Promise<MaintenanceReminder>;
  updateReminder: (id: string, reminder: Partial<MaintenanceReminder>) => Promise<MaintenanceReminder>;
  deleteReminder: (id: string) => Promise<boolean>;
  
  // History operations
  loadHistory: (vehicleId?: string) => Promise<void>;

  // ✅ ADDED: Selection management methods needed by the form
  setSelectedRecord?: (record: MaintenanceRecord | null) => void;
  setSelectedSchedule?: (schedule: MaintenanceSchedule | null) => void;
}