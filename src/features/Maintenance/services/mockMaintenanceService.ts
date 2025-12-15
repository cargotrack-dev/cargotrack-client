// src/services/mockMaintenanceService.ts
// ✅ FIXED: All TypeScript errors resolved

import {
  MaintenanceSchedule,
  MaintenanceHistory,
  MaintenanceReminder,
  MaintenanceStatus,
  MaintenancePriority,
  MaintenanceType,
  MaintenanceTask,
  PartRequirement
} from '../types/maintenance';

// ✅ FIXED: Create a separate interface for task templates
interface TaskTemplate {
  name: string;
  description: string;
  type: MaintenanceType;
  estimatedHours: number;
  parts?: PartRequirement[];
}

// Helper function to generate a random ID
const generateId = () => {
  return Math.random().toString(36).substring(2, 15);
};

// Generate a random date within a range
const randomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// List of vehicles for the mock data
const vehicles = [
  { id: 'v1', name: 'Truck 101', type: 'Heavy Duty Truck' },
  { id: 'v2', name: 'Truck 102', type: 'Heavy Duty Truck' },
  { id: 'v3', name: 'Truck 103', type: 'Medium Duty Truck' },
  { id: 'v4', name: 'Truck 104', type: 'Medium Duty Truck' },
  { id: 'v5', name: 'Van 201', type: 'Delivery Van' },
  { id: 'v6', name: 'Van 202', type: 'Delivery Van' },
];

// List of technicians
const technicians = [
  { id: 't1', name: 'John Smith' },
  { id: 't2', name: 'Maria Rodriguez' },
  { id: 't3', name: 'David Johnson' },
  { id: 't4', name: 'Sarah Wilson' },
];

// ✅ FIXED: List of common maintenance tasks using TaskTemplate interface
const commonTasks: TaskTemplate[] = [
  {
    name: 'Oil Change',
    description: 'Replace engine oil and filter',
    type: MaintenanceType.PREVENTIVE,
    estimatedHours: 1,
    parts: [
      { partId: 'p1', partName: 'Engine Oil', quantity: 1, inStock: true },
      { partId: 'p2', partName: 'Oil Filter', quantity: 1, inStock: true }
    ]
  },
  {
    name: 'Brake Inspection',
    description: 'Inspect brake pads, rotors, and fluid levels',
    type: MaintenanceType.INSPECTION,
    estimatedHours: 1.5
  },
  {
    name: 'Tire Rotation',
    description: 'Rotate and balance tires',
    type: MaintenanceType.PREVENTIVE,
    estimatedHours: 1
  },
  {
    name: 'Air Filter Replacement',
    description: 'Replace air filter',
    type: MaintenanceType.PREVENTIVE,
    estimatedHours: 0.5,
    parts: [
      { partId: 'p3', partName: 'Air Filter', quantity: 1, inStock: true }
    ]
  },
  {
    name: 'Transmission Fluid Change',
    description: 'Drain and replace transmission fluid',
    type: MaintenanceType.PREVENTIVE,
    estimatedHours: 2,
    parts: [
      { partId: 'p4', partName: 'Transmission Fluid', quantity: 1, inStock: true },
      { partId: 'p5', partName: 'Transmission Filter', quantity: 1, inStock: false }
    ]
  },
  {
    name: 'Belt Replacement',
    description: 'Replace worn or damaged drive belts',
    type: MaintenanceType.CORRECTIVE,
    estimatedHours: 1.5,
    parts: [
      { partId: 'p6', partName: 'Drive Belt', quantity: 1, inStock: true }
    ]
  },
  {
    name: 'Battery Replacement',
    description: 'Replace vehicle battery',
    type: MaintenanceType.CORRECTIVE,
    estimatedHours: 0.5,
    parts: [
      { partId: 'p7', partName: 'Battery', quantity: 1, inStock: true }
    ]
  },
  {
    name: 'Full Vehicle Inspection',
    description: 'Comprehensive inspection of vehicle systems',
    type: MaintenanceType.INSPECTION,
    estimatedHours: 3
  },
  {
    name: 'Safety Check',
    description: 'Check all safety systems including lights, brakes, and emergency equipment',
    type: MaintenanceType.SAFETY,
    estimatedHours: 1
  }
];

// ✅ FIXED: Helper function to convert TaskTemplate to MaintenanceTask
const createMaintenanceTaskFromTemplate = (
  template: TaskTemplate,
  vehicleId: string,
  scheduledDate: string
): MaintenanceTask => {
  const now = new Date().toISOString();
  
  return {
    id: generateId(),
    vehicleId,
    name: template.name,
    title: template.name,
    description: template.description,
    type: template.type,
    status: MaintenanceStatus.SCHEDULED,
    priority: MaintenancePriority.MEDIUM,
    scheduledDate,
    estimatedHours: template.estimatedHours,
    estimatedDuration: template.estimatedHours,
    completed: Math.random() > 0.7, // 30% chance of being completed
    parts: template.parts || [],
    createdAt: now,
    updatedAt: now
  };
};

// ✅ FIXED: Generate a set of tasks for a schedule
const generateTasks = (count: number = 3, vehicleId: string, scheduledDate: string): MaintenanceTask[] => {
  const tasks: MaintenanceTask[] = [];

  // Randomly select tasks from the common tasks
  const availableTasks = [...commonTasks];

  for (let i = 0; i < count; i++) {
    if (availableTasks.length === 0) break;

    const randomIndex = Math.floor(Math.random() * availableTasks.length);
    const template = availableTasks.splice(randomIndex, 1)[0];

    tasks.push(createMaintenanceTaskFromTemplate(template, vehicleId, scheduledDate));
  }

  return tasks;
};

// Generate a mock maintenance schedule
const generateMockSchedule = (
  index: number,
  status: MaintenanceStatus = MaintenanceStatus.SCHEDULED
): MaintenanceSchedule => {
  // Generate dates based on status
  const now = new Date();
  let scheduledDate: Date;
  let completionDate: Date | undefined;

  if (status === MaintenanceStatus.COMPLETED) {
    // Completed schedules should be in the past
    scheduledDate = randomDate(new Date(now.getFullYear(), now.getMonth() - 2, 1), new Date(now.getFullYear(), now.getMonth(), 1));
    completionDate = randomDate(scheduledDate, now);
  } else if (status === MaintenanceStatus.OVERDUE) {
    // Overdue schedules should be in the past
    scheduledDate = randomDate(new Date(now.getFullYear(), now.getMonth() - 1, 1), new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1));
  } else {
    // Scheduled or in-progress should be in the future or recent past
    scheduledDate = randomDate(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5), new Date(now.getFullYear(), now.getMonth() + 1, 30));
  }

  // Randomly select a vehicle
  const vehicle = vehicles[Math.floor(Math.random() * vehicles.length)];

  // Randomly select a technician (or leave unassigned)
  const assignTechnician = Math.random() > 0.2; // 80% chance of being assigned
  const technician = assignTechnician ? technicians[Math.floor(Math.random() * technicians.length)] : undefined;

  // Generate tasks
  const taskCount = Math.floor(Math.random() * 3) + 1; // 1-3 tasks
  const tasks = generateTasks(taskCount, vehicle.id, scheduledDate.toISOString());

  // Calculate estimated cost based on tasks
  const partsCost = tasks.reduce((total, task) => {
    if (!task.parts) return total;
    return total + task.parts.reduce((sum, part) => sum + part.quantity * 20, 0); // Assume $20 per part
  }, 0);

  const laborCost = tasks.reduce((total, task) => total + task.estimatedHours * 75, 0); // $75/hour labor
  const estimatedCost = partsCost + laborCost;

  // For completed tasks, add actual cost with some variation
  const actualCost = status === MaintenanceStatus.COMPLETED
    ? estimatedCost * (Math.random() * 0.4 + 0.8) // 80%-120% of estimated cost
    : undefined;

  // Select a random priority with weights
  const priorityWeights = [0.4, 0.3, 0.2, 0.1]; // Low, Medium, High, Critical
  const randomPriority = Math.random();
  let priority: MaintenancePriority;

  if (randomPriority < priorityWeights[0]) {
    priority = MaintenancePriority.LOW;
  } else if (randomPriority < priorityWeights[0] + priorityWeights[1]) {
    priority = MaintenancePriority.MEDIUM;
  } else if (randomPriority < priorityWeights[0] + priorityWeights[1] + priorityWeights[2]) {
    priority = MaintenancePriority.HIGH;
  } else {
    priority = MaintenancePriority.CRITICAL;
  }

  // Critical and High should tend toward being overdue
  if (priority === MaintenancePriority.CRITICAL && status !== MaintenanceStatus.COMPLETED && Math.random() > 0.3) {
    status = MaintenanceStatus.OVERDUE;
    scheduledDate = randomDate(new Date(now.getFullYear(), now.getMonth() - 1, 1), new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1));
  }

  return {
    id: `schedule-${index}`,
    vehicleId: vehicle.id,
    vehicleName: vehicle.name,
    vehicleType: vehicle.type,
    tasks,
    scheduledDate: scheduledDate.toISOString(),
    completionDate: completionDate?.toISOString(),
    status,
    priority,
    notes: Math.random() > 0.7 ? 'Additional notes for this maintenance schedule.' : undefined,
    assignedTo: technician?.id,
    assigneeName: technician?.name,
    estimatedCost,
    actualCost,
    createdAt: new Date(scheduledDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    mileage: Math.floor(Math.random() * 100000) + 10000,
    location: Math.random() > 0.5 ? 'Main Garage' : 'Field Service'
  };
};

// ✅ FIXED: Generate a mock maintenance history entry
const generateMockHistoryEntry = (index: number, vehicleId: string): MaintenanceHistory => {
  const date = randomDate(new Date(new Date().getFullYear() - 1, 0, 1), new Date());
  const technician = technicians[Math.floor(Math.random() * technicians.length)];
  const task = commonTasks[Math.floor(Math.random() * commonTasks.length)];

  const partsReplaced = task.parts
    ? task.parts.map(part => ({
      partId: part.partId,
      partName: part.partName,
      quantity: part.quantity,
      cost: part.quantity * 20 // $20 per part
    }))
    : [];

  const laborCost = task.estimatedHours * 75; // $75/hour labor
  const partsCost = partsReplaced.reduce((sum, part) => sum + part.cost, 0);

  return {
    id: `history-${index}`,
    vehicleId,
    scheduleId: `schedule-old-${index}`,
    date: date.toISOString(),
    type: task.type,
    description: task.description, // ✅ FIXED: This is guaranteed to be a string from TaskTemplate
    technician: technician.name,
    cost: laborCost + partsCost,
    partsReplaced,
    notes: Math.random() > 0.7 ? 'Additional notes about this maintenance.' : undefined,
    mileage: Math.floor(Math.random() * 90000) + 10000
  };
};

// Generate a mock maintenance reminder
const generateMockReminder = (index: number): MaintenanceReminder => {
  const vehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
  const task = commonTasks[Math.floor(Math.random() * commonTasks.length)];

  // Random due date between today and 30 days from now
  const now = new Date();
  const dueDate = randomDate(now, new Date(now.getFullYear(), now.getMonth(), now.getDate() + 30));

  // Calculate days remaining (can be negative for overdue)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffTime = dueDate.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Random miles remaining 
  const milesRemaining = Math.random() > 0.3
    ? Math.floor(Math.random() * 3000) // 0-3000 miles remaining
    : -Math.floor(Math.random() * 500); // 0-500 miles overdue

  // Priority based on days remaining
  let priority: MaintenancePriority;
  if (daysRemaining < 0) {
    priority = MaintenancePriority.CRITICAL;
  } else if (daysRemaining < 7) {
    priority = MaintenancePriority.HIGH;
  } else if (daysRemaining < 14) {
    priority = MaintenancePriority.MEDIUM;
  } else {
    priority = MaintenancePriority.LOW;
  }

  return {
    id: `reminder-${index}`,
    vehicleId: vehicle.id,
    vehicleName: vehicle.name,
    taskName: task.name,
    dueDate: dueDate.toISOString(),
    daysRemaining,
    milesRemaining: Math.random() > 0.5 ? milesRemaining : undefined,
    priority,
    type: task.type
  };
};

// Generate all mock schedules
export const generateMockSchedules = (count: number = 15): MaintenanceSchedule[] => {
  const schedules: MaintenanceSchedule[] = [];

  // Distribution of statuses
  const statusDistribution = [
    { status: MaintenanceStatus.SCHEDULED, weight: 0.4 },
    { status: MaintenanceStatus.IN_PROGRESS, weight: 0.2 },
    { status: MaintenanceStatus.COMPLETED, weight: 0.3 },
    { status: MaintenanceStatus.OVERDUE, weight: 0.1 }
  ];

  for (let i = 0; i < count; i++) {
    // Select status based on distribution
    const random = Math.random();
    let cumulativeWeight = 0;
    let selectedStatus = MaintenanceStatus.SCHEDULED;

    for (const { status, weight } of statusDistribution) {
      cumulativeWeight += weight;
      if (random < cumulativeWeight) {
        selectedStatus = status;
        break;
      }
    }

    schedules.push(generateMockSchedule(i + 1, selectedStatus));
  }

  return schedules;
};

// Generate all mock history entries
export const generateMockHistory = (count: number = 25): MaintenanceHistory[] => {
  const history: MaintenanceHistory[] = [];

  // Create some history entries for each vehicle
  vehicles.forEach((vehicle, vIndex) => {
    const entriesPerVehicle = Math.floor(count / vehicles.length);

    for (let i = 0; i < entriesPerVehicle; i++) {
      history.push(generateMockHistoryEntry(vIndex * entriesPerVehicle + i + 1, vehicle.id));
    }
  });

  // Sort by date (newest first)
  return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Generate all mock reminders
export const generateMockReminders = (count: number = 10): MaintenanceReminder[] => {
  const reminders: MaintenanceReminder[] = [];

  for (let i = 0; i < count; i++) {
    reminders.push(generateMockReminder(i + 1));
  }

  // Sort by days remaining (most urgent first)
  return reminders.sort((a, b) => a.daysRemaining - b.daysRemaining);
};

// Mock API functions

// Simulate loading maintenance schedules from API
export const fetchMaintenanceSchedules = async (): Promise<MaintenanceSchedule[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Generate mock data
  const mockData = generateMockSchedules();

  return mockData;
};

// Simulate loading maintenance history from API
export const fetchMaintenanceHistory = async (vehicleId?: string): Promise<MaintenanceHistory[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));

  // Generate mock data
  const mockData = generateMockHistory();

  // Filter by vehicleId if provided
  return vehicleId
    ? mockData.filter(entry => entry.vehicleId === vehicleId)
    : mockData;
};

// Simulate loading maintenance reminders from API
export const fetchMaintenanceReminders = async (): Promise<MaintenanceReminder[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Generate mock data
  const mockData = generateMockReminders();

  return mockData;
};

// Simulate creating a new maintenance schedule
export const createMaintenanceSchedule = async (schedule: Omit<MaintenanceSchedule, 'id' | 'createdAt' | 'updatedAt'>): Promise<MaintenanceSchedule> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 700));

  // Create new schedule with ID and timestamps
  const newSchedule: MaintenanceSchedule = {
    ...schedule,
    id: `schedule-new-${generateId()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return newSchedule;
};

// Simulate updating an existing maintenance schedule
export const updateMaintenanceSchedule = async (id: string, updates: Partial<MaintenanceSchedule>): Promise<MaintenanceSchedule> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));

  // In a real app, we would fetch the existing schedule first
  // For mock, we'll create a dummy schedule to update
  const existingSchedule = generateMockSchedule(parseInt(id.split('-')[1]), MaintenanceStatus.IN_PROGRESS);

  // Update the schedule
  const updatedSchedule: MaintenanceSchedule = {
    ...existingSchedule,
    ...updates,
    id, // Ensure ID doesn't change
    updatedAt: new Date().toISOString()
  };

  return updatedSchedule;
};

// Simulate completing a maintenance task
export const completeMaintenanceTask = async (
  scheduleId: string,
  taskId: string,
  actualHours: number,
  notes?: string
): Promise<MaintenanceSchedule> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // In a real app, we would fetch the existing schedule
  // For mock, create a dummy schedule
  const schedule = generateMockSchedule(parseInt(scheduleId.split('-')[1]), MaintenanceStatus.IN_PROGRESS);

  // ✅ FIXED: Check if tasks exist before trying to map over them
  if (!schedule.tasks || schedule.tasks.length === 0) {
    throw new Error('No tasks found for this maintenance schedule');
  }

  // Update the specific task
  const updatedTasks = schedule.tasks.map(task => {
    if (task.id === taskId) {
      return {
        ...task,
        completed: true,
        actualHours: actualHours, // Use the parameter
        notes: notes || task.notes // Use notes if provided
      };
    }
    return task;
  });

  // Check if all tasks are completed
  const allTasksCompleted = updatedTasks.every(task => task.completed);

  // Update the schedule
  const updatedSchedule: MaintenanceSchedule = {
    ...schedule,
    tasks: updatedTasks,
    status: allTasksCompleted ? MaintenanceStatus.COMPLETED : MaintenanceStatus.IN_PROGRESS,
    completionDate: allTasksCompleted ? new Date().toISOString() : undefined,
    updatedAt: new Date().toISOString()
  };

  return updatedSchedule;
};

// Simulate deleting a maintenance schedule
export const deleteMaintenanceSchedule = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _id: string
): Promise<void> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400));

  // In a real app, we would make an API call to delete
  // For mock, just return success
  return;
};

// ✅ EXPORT: Export TaskTemplate interface for use in other files
export type { TaskTemplate };