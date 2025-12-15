// src/features/Maintenance/types/maintenance.ts
// ✅ COMPLETELY FIXED - All interfaces aligned for provider compatibility

export enum MaintenanceStatus {
    SCHEDULED = 'scheduled',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    OVERDUE = 'overdue'
}

export enum MaintenancePriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical'
}

export enum MaintenanceType {
    PREVENTIVE = 'preventive',
    CORRECTIVE = 'corrective',
    PREDICTIVE = 'predictive',
    INSPECTION = 'inspection',
    SAFETY = 'safety',
    ROUTINE = 'routine' // ✅ ADDED: Missing ROUTINE type
}

export interface PartRequirement {
    partId: string;
    partName: string;
    quantity: number;
    inStock: boolean;
}

export interface MaintenancePart {
    partId: string;
    partName: string;
    partNumber?: string;
    quantity: number;
    inStock: boolean;
    cost?: number;
}

// ✅ SIMPLIFIED: Basic task interface for provider compatibility
export interface MaintenanceTaskBasic {
    id: string;
    name: string;
    description?: string;
    estimatedDuration?: number;
    completed: boolean;
    notes?: string;
}

// ✅ UNIFIED MaintenanceTask interface - single source of truth
export interface MaintenanceTask {
    id: string;
    vehicleId: string;
    name: string;
    title: string; // For compatibility with existing code
    description?: string;
    type: MaintenanceType;
    status: MaintenanceStatus;
    priority: MaintenancePriority;
    scheduledDate: string; // ISO date string
    completedDate?: string;
    estimatedHours: number;
    estimatedDuration?: number; // For compatibility
    actualHours?: number;
    actualDuration?: number;
    completed?: boolean;
    cost?: number;
    estimatedCost?: number;
    assignedTechnician?: string;
    notes?: string;
    parts?: PartRequirement[];
    createdAt: string;
    updatedAt: string;
}

// ✅ ADDED: MaintenanceRecord interface for provider compatibility
export interface MaintenanceRecord {
    id: string;
    vehicleId: string;
    vehicleName: string;
    maintenanceType: MaintenanceType;
    status: MaintenanceStatus;
    title: string;
    description?: string;
    scheduledDate: string;
    completedDate?: string;
    tasks: MaintenanceTaskBasic[]; // Use simplified task interface
    assignedTechnicians: string[];
    estimatedCost: number;
    actualCost?: number;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    notes?: string;
}

// ✅ Extended version for detailed views (inherits from MaintenanceTask)
export interface MaintenanceTaskExtended extends MaintenanceTask {
    parts?: MaintenancePart[]; // Override with more detailed part info
}

// ✅ UPDATED: MaintenanceSchedule interface with provider compatibility
export interface MaintenanceSchedule {
    id: string;
    vehicleId: string;
    vehicleName?: string; // For display purposes (e.g., "Truck 123") - made optional for provider
    vehicleType?: string; // Made optional for provider
    tasks?: MaintenanceTask[]; // Made optional for provider schedules
    scheduledDate?: string; // Made optional for provider schedules
    completionDate?: string;
    status?: MaintenanceStatus; // Made optional for provider schedules
    priority?: MaintenancePriority; // Made optional for provider schedules
    notes?: string;
    assignedTo?: string; // Technician ID
    assigneeName?: string; // Technician name
    estimatedCost?: number; // Made optional for provider schedules
    actualCost?: number;
    createdAt: string;
    updatedAt: string;
    mileage?: number; // Current vehicle mileage
    location?: string; // Where maintenance will be performed
    
    // ✅ ADDED: Provider-specific properties
    maintenanceType?: MaintenanceType; // For provider compatibility
    title?: string; // For provider compatibility
    description?: string; // For provider compatibility
    frequency?: number; // For recurring schedules (in days)
    nextDueDate?: string; // When next maintenance is due
    active?: boolean; // Whether schedule is active
}

// Use Omit to remove the properties we want to make optional, then extend with optional versions
export interface MaintenanceScheduleDetailed extends Omit<MaintenanceSchedule, 'vehicleType' | 'location' | 'tasks'> {
    vehicleType?: string;
    location?: string;
    tasks: MaintenanceTaskExtended[]; // Override the tasks property with the extended version
}

export interface MaintenanceHistory {
    id: string;
    vehicleId: string;
    scheduleId: string;
    date: string;
    type: MaintenanceType;
    description: string;
    technician: string;
    cost: number;
    partsReplaced: PartReplacement[];
    notes?: string;
    mileage: number;
}

export interface PartReplacement {
    partId: string;
    partName: string;
    quantity: number;
    cost: number;
}

export interface MaintenanceReminder {
    id: string;
    vehicleId: string;
    vehicleName: string;
    taskName: string;
    dueDate: string;
    daysRemaining: number;
    milesRemaining?: number;
    priority: MaintenancePriority;
    type: MaintenanceType;
}

// Constants for status color coding and icons
export const MAINTENANCE_STATUS_COLORS = {
    [MaintenanceStatus.SCHEDULED]: 'bg-blue-200',
    [MaintenanceStatus.IN_PROGRESS]: 'bg-yellow-200',
    [MaintenanceStatus.COMPLETED]: 'bg-green-200',
    [MaintenanceStatus.CANCELLED]: 'bg-gray-200',
    [MaintenanceStatus.OVERDUE]: 'bg-red-200'
};

export const MAINTENANCE_STATUS_LABELS = {
    [MaintenanceStatus.SCHEDULED]: 'Scheduled',
    [MaintenanceStatus.IN_PROGRESS]: 'In Progress',
    [MaintenanceStatus.COMPLETED]: 'Completed',
    [MaintenanceStatus.CANCELLED]: 'Cancelled',
    [MaintenanceStatus.OVERDUE]: 'Overdue'
};

export const MAINTENANCE_PRIORITY_COLORS = {
    [MaintenancePriority.LOW]: 'bg-gray-200',
    [MaintenancePriority.MEDIUM]: 'bg-blue-200',
    [MaintenancePriority.HIGH]: 'bg-yellow-200',
    [MaintenancePriority.CRITICAL]: 'bg-red-200'
};

export const MAINTENANCE_PRIORITY_LABELS = {
    [MaintenancePriority.LOW]: 'Low',
    [MaintenancePriority.MEDIUM]: 'Medium',
    [MaintenancePriority.HIGH]: 'High',
    [MaintenancePriority.CRITICAL]: 'Critical'
};

export const MAINTENANCE_TYPE_LABELS = {
    [MaintenanceType.PREVENTIVE]: 'Preventive',
    [MaintenanceType.CORRECTIVE]: 'Corrective',
    [MaintenanceType.PREDICTIVE]: 'Predictive',
    [MaintenanceType.INSPECTION]: 'Inspection',
    [MaintenanceType.SAFETY]: 'Safety',
    [MaintenanceType.ROUTINE]: 'Routine' // ✅ ADDED: Missing label
};