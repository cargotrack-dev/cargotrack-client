// src/features/Maintenance/utils/maintenanceUtils.ts
import { MaintenanceTask, MaintenanceStatus, MaintenancePriority } from '../types/maintenance';

/**
 * Get color for maintenance status
 */
export const getStatusColor = (status: MaintenanceStatus): string => {
  const colors: Record<MaintenanceStatus, string> = {
    scheduled: 'blue',
    in_progress: 'amber',  // ✅ FIXED: Changed from 'inProgress' to 'in_progress'
    completed: 'green',
    overdue: 'red',
    cancelled: 'gray'
  };
  
  return colors[status] || 'gray';
};

/**
 * Get color for maintenance priority
 */
export const getPriorityColor = (priority: MaintenancePriority): string => {
  const colors: Record<MaintenancePriority, string> = {
    low: 'green',
    medium: 'amber',
    high: 'red',
    critical: 'rose'
  };
  
  return colors[priority] || 'gray';
};

/**
 * Check if maintenance task is overdue
 */
export const isTaskOverdue = (task: MaintenanceTask): boolean => {
  if (task.status === 'completed' || task.status === 'cancelled') {
    return false;
  }
  
  if (!task.scheduledDate) {
    return false;
  }
  
  const today = new Date();
  const scheduledDate = new Date(task.scheduledDate);
  
  return today > scheduledDate;
};

/**
 * Group maintenance tasks by vehicle
 */
export const groupTasksByVehicle = (tasks: MaintenanceTask[]): Record<string, MaintenanceTask[]> => {
  return tasks.reduce((grouped, task) => {
    const vehicleId = task.vehicleId;
    
    if (!grouped[vehicleId]) {
      grouped[vehicleId] = [];
    }
    
    grouped[vehicleId].push(task);
    return grouped;
  }, {} as Record<string, MaintenanceTask[]>);
};

/**
 * Calculate days until scheduled maintenance
 */
export const getDaysUntil = (date: string | Date): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Format maintenance date with relative time
 */
export const formatMaintenanceDate = (date: string | Date): string => {
  const days = getDaysUntil(date);
  
  if (days === 0) {
    return 'Today';
  } else if (days === 1) {
    return 'Tomorrow';
  } else if (days === -1) {
    return 'Yesterday';
  } else if (days > 0) {
    return `In ${days} days`;
  } else {
    return `${Math.abs(days)} days ago`;
  }
};