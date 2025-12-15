// src/features/Tasks/types/task.ts
export interface Task {
  id: string;
  type: 'MAINTENANCE' | 'INSPECTION' | 'CLEANING' | 'DELIVERY' | 'PICKUP' | 'OTHER';
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  assignedTo?: string;
  truckId?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFilters {
  status?: string;
  priority?: string;
  type?: string;
  assignedTo?: string;
  truckId?: string;
}