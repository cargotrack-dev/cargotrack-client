// src/components/maintenance/MaintenanceScheduleForm.tsx
// ✅ FIXED: All TypeScript errors resolved

import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useMaintenance } from '@features/Maintenance/contexts'; // ✅ FIXED: Correct import path
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@features/UI/components/ui/card';
import { Input } from '@features/UI/components/ui/input';
import { Textarea } from '@features/UI/components/ui/textarea';
import { Label } from '@features/UI/components/ui/label';
import { Button } from '@features/UI/components/ui/button';
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent
} from '@features/UI/components/ui/tabs';
import { Checkbox } from '@features/UI/components/ui/checkbox';
import {
    ChevronLeft,
    Calendar,
    Truck as TruckIcon,
    Wrench,
    Plus,
    Trash2,
    AlertCircle
} from 'lucide-react';
import {
    MaintenanceStatus,
    MaintenancePriority,
    MaintenanceType,
    MaintenanceTask,
    PartRequirement,
    MAINTENANCE_PRIORITY_LABELS,
    MAINTENANCE_TYPE_LABELS
} from '../types/maintenance';
import { Alert, AlertDescription } from '@features/UI/components/ui/alert';

// ✅ FIXED: Properly typed interfaces
interface TaskTemplate {
    name: string;
    description: string;
    type: MaintenanceType;
    estimatedHours: number;
    parts?: PartRequirement[];
}

interface FormTask {
    id?: string;
    tempId?: string;
    name: string;
    description: string;
    type: MaintenanceType;
    estimatedHours: number;
    completed: boolean;
    parts: PartRequirement[];
}

// ✅ PERFORMANCE: Properly typed vehicle and technician interfaces
interface Vehicle {
    id: string;
    name: string;
    type: string;
    mileage: number;
}

interface Technician {
    id: string;
    name: string;
}

// ✅ FIXED: Proper form data interface with required fields and no undefined values
interface MaintenanceScheduleFormData {
    vehicleId: string;
    vehicleName: string;
    vehicleType: string;
    tasks: MaintenanceTask[]; // Always required array, never undefined
    scheduledDate: string;
    status: MaintenanceStatus;
    priority: MaintenancePriority;
    estimatedCost: number;
    notes: string;
    assignedTo?: string;
    assigneeName?: string;
    location?: string;
    mileage?: number;
}

// ✅ PERFORMANCE: Memoized mock data to prevent unnecessary re-renders
const mockVehicles: Vehicle[] = [
    { id: 'v1', name: 'Truck 101', type: 'Heavy Duty Truck', mileage: 15000 },
    { id: 'v2', name: 'Truck 102', type: 'Heavy Duty Truck', mileage: 25000 },
    { id: 'v3', name: 'Truck 103', type: 'Medium Duty Truck', mileage: 18000 },
    { id: 'v4', name: 'Truck 104', type: 'Medium Duty Truck', mileage: 21000 },
    { id: 'v5', name: 'Van 201', type: 'Delivery Van', mileage: 12000 },
    { id: 'v6', name: 'Van 202', type: 'Delivery Van', mileage: 9000 },
];

const mockTechnicians: Technician[] = [
    { id: 't1', name: 'John Smith' },
    { id: 't2', name: 'Maria Rodriguez' },
    { id: 't3', name: 'David Johnson' },
    { id: 't4', name: 'Sarah Wilson' },
];

// ✅ FIXED: Properly typed common tasks
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
    }
];

// Configuration constants
const LABOR_RATE = 75; // $75 per hour
const AVERAGE_PART_COST = 20; // $20 per part (simplified)

// ✅ PERFORMANCE: Memoized TaskCard component
const TaskCard = memo<{
    task: MaintenanceTask;
    index: number;
    onRemove: (index: number) => void;
}>(({ task, index, onRemove }) => {
    const taskHours = useMemo(() => {
        return task.estimatedHours || task.estimatedDuration || 1;
    }, [task.estimatedHours, task.estimatedDuration]);

    const taskName = useMemo(() => {
        return task.name || task.title;
    }, [task.name, task.title]);

    const estimatedCost = useMemo(() => {
        return (taskHours * LABOR_RATE).toFixed(2);
    }, [taskHours]);

    return (
        <div className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-medium">{taskName}</h3>
                    <p className="text-sm text-gray-600">{task.description}</p>
                    <div className="flex mt-2 gap-4">
                        <p className="text-sm">
                            <span className="text-gray-500">Type:</span> {MAINTENANCE_TYPE_LABELS[task.type]}
                        </p>
                        <p className="text-sm">
                            <span className="text-gray-500">Est. Time:</span> {taskHours} hours
                        </p>
                        <p className="text-sm">
                            <span className="text-gray-500">Est. Cost:</span> ${estimatedCost}
                        </p>
                    </div>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    className="bg-red-500 hover:bg-red-600 text-white hover:text-white"
                    size="sm"
                    onClick={() => onRemove(index)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>

            {task.parts && task.parts.length > 0 && (
                <div className="mt-3">
                    <h4 className="text-sm font-medium mb-2">Required Parts:</h4>
                    <div className="space-y-1">
                        {task.parts.map((part, partIndex) => (
                            <div key={partIndex} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                                <span>{part.partName} (x{part.quantity})</span>
                                <span className={part.inStock ? 'text-green-600' : 'text-red-600'}>
                                    {part.inStock ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
});

TaskCard.displayName = 'TaskCard';

// ✅ PERFORMANCE: Memoized CommonTaskCard component
const CommonTaskCard = memo<{
    task: TaskTemplate;
    onAdd: (task: TaskTemplate) => void;
}>(({ task, onAdd }) => {
    const handleAdd = useCallback(() => {
        onAdd(task);
    }, [task, onAdd]);

    return (
        <div className="border rounded-lg p-3 hover:bg-gray-50">
            <h3 className="font-medium">{task.name}</h3>
            <p className="text-sm text-gray-600">{task.description}</p>
            <div className="flex mt-2 gap-4">
                <p className="text-xs">
                    <span className="text-gray-500">Type:</span> {MAINTENANCE_TYPE_LABELS[task.type]}
                </p>
                <p className="text-xs">
                    <span className="text-gray-500">Est. Time:</span> {task.estimatedHours} hours
                </p>
            </div>
            {task.parts && task.parts.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">Includes {task.parts.length} parts</p>
            )}
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAdd}
                className="mt-2"
            >
                <Plus className="h-3 w-3 mr-1" />
                Add to Schedule
            </Button>
        </div>
    );
});

CommonTaskCard.displayName = 'CommonTaskCard';

const MaintenanceScheduleForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { getSchedule, createSchedule, updateSchedule } = useMaintenance();

    const isEditing = !!id;
    const [activeTab, setActiveTab] = useState('details');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Get URL query parameters
    const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const preselectedVehicleId = queryParams.get('vehicleId');

    // ✅ FIXED: Properly typed form data with all required fields having defaults
    const [formData, setFormData] = useState<MaintenanceScheduleFormData>({
        vehicleId: preselectedVehicleId || '',
        vehicleName: '',
        vehicleType: '',
        tasks: [], // Always an array, never undefined
        scheduledDate: new Date().toISOString().split('T')[0],
        status: MaintenanceStatus.SCHEDULED,
        priority: MaintenancePriority.MEDIUM,
        estimatedCost: 0,
        notes: '' // Always a string, never undefined
    });

    const [newTask, setNewTask] = useState<FormTask>({
        name: '',
        description: '',
        type: MaintenanceType.PREVENTIVE,
        estimatedHours: 1,
        completed: false,
        parts: []
    });

    const [newPart, setNewPart] = useState<PartRequirement>({
        partId: '',
        partName: '',
        quantity: 1,
        inStock: true
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // ✅ FIXED: Properly typed conversion function for form tasks
    const convertFormTaskToMaintenanceTask = useCallback((
        taskData: FormTask, 
        vehicleId: string, 
        scheduledDate: string
    ): MaintenanceTask => {
        const now = new Date().toISOString();
        return {
            id: taskData.id || `temp-${Date.now()}`,
            vehicleId: vehicleId,
            name: taskData.name,
            title: taskData.name,
            description: taskData.description,
            type: taskData.type,
            status: MaintenanceStatus.SCHEDULED,
            priority: MaintenancePriority.MEDIUM,
            scheduledDate: scheduledDate,
            estimatedHours: taskData.estimatedHours,
            estimatedDuration: taskData.estimatedHours,
            completed: taskData.completed,
            parts: taskData.parts,
            createdAt: now,
            updatedAt: now
        };
    }, []);

    // ✅ FIXED: Helper function to convert any task to MaintenanceTask with proper typing
    const ensureMaintenanceTask = useCallback((
        task: Partial<MaintenanceTask> & { id?: string; name?: string; title?: string; type?: MaintenanceType }, 
        vehicleId: string, 
        scheduledDate: string
    ): MaintenanceTask => {
        const now = new Date().toISOString();
        
        // If it's already a proper MaintenanceTask, return it
        if (task.vehicleId && task.status && task.createdAt) {
            return task as MaintenanceTask;
        }
        
        // Otherwise, convert it
        return {
            id: task.id || `temp-${Date.now()}`,
            vehicleId: vehicleId,
            name: task.name || task.title || '',
            title: task.name || task.title || '',
            description: task.description || '',
            type: task.type || MaintenanceType.PREVENTIVE,
            status: task.status || MaintenanceStatus.SCHEDULED,
            priority: task.priority || MaintenancePriority.MEDIUM,
            scheduledDate: scheduledDate,
            estimatedHours: task.estimatedHours || task.estimatedDuration || 1,
            estimatedDuration: task.estimatedHours || task.estimatedDuration || 1,
            completed: task.completed || false,
            parts: task.parts || [],
            createdAt: task.createdAt || now,
            updatedAt: now
        };
    }, []);

    // ✅ PERFORMANCE: Memoized cost calculations
    const costs = useMemo(() => {
        const laborCost = formData.tasks.reduce((sum, task: MaintenanceTask) => { // ✅ FIXED: Proper typing
            const hours = task.estimatedHours || task.estimatedDuration || 1;
            return sum + (hours * LABOR_RATE);
        }, 0);

        const partsCost = formData.tasks.reduce((sum, task: MaintenanceTask) => { // ✅ FIXED: Proper typing
            if (!task.parts) return sum;
            return sum + task.parts.reduce((partSum, part) => {
                return partSum + (part.quantity * AVERAGE_PART_COST);
            }, 0);
        }, 0);

        return {
            laborCost,
            partsCost,
            totalCost: laborCost + partsCost
        };
    }, [formData.tasks]);

    // ✅ FIXED: Load existing schedule data for editing
    useEffect(() => {
        if (isEditing && id) {
            const schedule = getSchedule(id);
            if (schedule) {
                // ✅ FIXED: Provide default date if scheduledDate is undefined
                const scheduleDate = schedule.scheduledDate || new Date().toISOString();
                const formattedDate = new Date(scheduleDate).toISOString().split('T')[0];
                
                // ✅ FIXED: Safe handling of tasks array with proper type conversion
                const safeTasks = schedule.tasks || [];
                const convertedTasks: MaintenanceTask[] = safeTasks.map((task: Partial<MaintenanceTask>) => 
                    ensureMaintenanceTask(task, schedule.vehicleId, formattedDate)
                );

                setFormData({
                    vehicleId: schedule.vehicleId,
                    vehicleName: schedule.vehicleName || '', // ✅ FIXED: Provide default for required field
                    vehicleType: schedule.vehicleType || '',
                    tasks: convertedTasks,
                    scheduledDate: formattedDate,
                    status: schedule.status || MaintenanceStatus.SCHEDULED, // ✅ FIXED: Provide default
                    priority: schedule.priority || MaintenancePriority.MEDIUM, // ✅ FIXED: Provide default
                    estimatedCost: schedule.estimatedCost || 0, // ✅ FIXED: Provide default
                    notes: schedule.notes || '',
                    assignedTo: schedule.assignedTo,
                    assigneeName: schedule.assigneeName,
                    location: schedule.location,
                    mileage: schedule.mileage
                });
            }
        }
    }, [isEditing, id, getSchedule, ensureMaintenanceTask]);

    // ✅ PERFORMANCE: Memoized vehicle lookup
    const selectedVehicle = useMemo(() => {
        return mockVehicles.find(v => v.id === formData.vehicleId);
    }, [formData.vehicleId]);

    // Update vehicle info when vehicleId changes
    useEffect(() => {
        if (selectedVehicle) {
            setFormData(prev => ({
                ...prev,
                vehicleName: selectedVehicle.name,
                vehicleType: selectedVehicle.type,
                mileage: selectedVehicle.mileage
            }));
        }
    }, [selectedVehicle]);

    // Update estimated cost when tasks or costs change
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            estimatedCost: costs.totalCost
        }));
    }, [costs.totalCost]);

    // Clear form errors when changing tabs
    useEffect(() => {
        if (errors.submit) {
            setErrors(prev => ({ ...prev, submit: '' }));
        }
    }, [activeTab, errors.submit]);

    // ✅ PERFORMANCE: Memoized handlers
    const handleInputChange = useCallback((name: string, value: string | number | boolean) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error for this field if it exists
        setErrors(prev => {
            if (prev[name]) {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            }
            return prev;
        });
    }, []);

    const handleAddTask = useCallback(() => {
        // Validate task
        if (!newTask.name) {
            setErrors(prev => ({
                ...prev,
                taskName: 'Task name is required'
            }));
            return;
        }

        // Convert FormTask to MaintenanceTask
        const maintenanceTask = convertFormTaskToMaintenanceTask(
            newTask, 
            formData.vehicleId, // Now guaranteed to be string, not undefined
            formData.scheduledDate // Now guaranteed to be string, not undefined
        );

        setFormData(prev => ({
            ...prev,
            tasks: [...prev.tasks, maintenanceTask]
        }));

        // Reset new task form
        setNewTask({
            name: '',
            description: '',
            type: MaintenanceType.PREVENTIVE,
            estimatedHours: 1,
            completed: false,
            parts: []
        });

        // Clear any task-related errors
        setErrors(prev => {
            if (prev.tasks) {
                const newErrors = { ...prev };
                delete newErrors.tasks;
                return newErrors;
            }
            return prev;
        });
    }, [newTask, convertFormTaskToMaintenanceTask, formData.vehicleId, formData.scheduledDate]);

    const handleRemoveTask = useCallback((taskIndex: number) => {
        setFormData(prev => ({
            ...prev,
            tasks: prev.tasks.filter((_, index) => index !== taskIndex)
        }));
    }, []);

    const handleAddPredefinedTask = useCallback((taskTemplate: TaskTemplate) => {
        const formTask: FormTask = {
            name: taskTemplate.name,
            description: taskTemplate.description,
            type: taskTemplate.type,
            estimatedHours: taskTemplate.estimatedHours,
            completed: false,
            parts: taskTemplate.parts || [],
            tempId: `temp-${Date.now()}`
        };

        const maintenanceTask = convertFormTaskToMaintenanceTask(
            formTask,
            formData.vehicleId, // Now guaranteed to be string, not undefined
            formData.scheduledDate // Now guaranteed to be string, not undefined
        );

        setFormData(prev => ({
            ...prev,
            tasks: [...prev.tasks, maintenanceTask]
        }));

        // Clear any task-related errors
        setErrors(prev => {
            if (prev.tasks) {
                const newErrors = { ...prev };
                delete newErrors.tasks;
                return newErrors;
            }
            return prev;
        });
    }, [convertFormTaskToMaintenanceTask, formData.vehicleId, formData.scheduledDate]);

    const handleAddPart = useCallback(() => {
        // Validate part
        if (!newPart.partName) {
            setErrors(prev => ({
                ...prev,
                partName: 'Part name is required'
            }));
            return;
        }

        setNewTask(prev => ({
            ...prev,
            parts: [...prev.parts, newPart]
        }));

        // Reset new part form
        setNewPart({
            partId: '',
            partName: '',
            quantity: 1,
            inStock: true
        });
    }, [newPart]);

    const handleRemovePart = useCallback((partIndex: number) => {
        setNewTask(prev => ({
            ...prev,
            parts: prev.parts.filter((_, index) => index !== partIndex)
        }));
    }, []);

    // Form validation
    const validateForm = useCallback(() => {
        const newErrors: Record<string, string> = {};

        if (!formData.vehicleId) {
            newErrors.vehicleId = 'Vehicle is required';
        }

        if (!formData.scheduledDate) {
            newErrors.scheduledDate = 'Scheduled date is required';
        }

        if (formData.tasks.length === 0) {
            newErrors.tasks = 'At least one task is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData.vehicleId, formData.scheduledDate, formData.tasks.length]);

    // Form submission
    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!validateForm()) {
            // Show error message and automatically switch to the tab with errors
            if (errors.vehicleId || errors.scheduledDate) {
                setActiveTab('details');
            } else if (errors.tasks) {
                setActiveTab('tasks');
            }
            return;
        }
    
        setIsSubmitting(true);
        try {
            if (isEditing && id) {
                // ✅ FIXED: Safe handling of id parameter
                await updateSchedule(id, formData);
                navigate(`/maintenance/schedule/${id}`);
            } else {
                // Add createdAt and updatedAt for new schedules
                const now = new Date().toISOString();
                const scheduleWithDates = {
                    ...formData,
                    createdAt: now,
                    updatedAt: now
                };
                const newSchedule = await createSchedule(scheduleWithDates);
                navigate(`/maintenance/schedule/${newSchedule.id}`);
            }
        } catch (error) {
            console.error('Failed to save maintenance schedule:', error);
            setErrors(prev => ({
                ...prev,
                submit: 'Failed to save maintenance schedule. Please try again.'
            }));
        } finally {
            setIsSubmitting(false);
        }
    }, [validateForm, errors.vehicleId, errors.scheduledDate, errors.tasks, isEditing, id, formData, updateSchedule, navigate, createSchedule]);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/maintenance')}
                >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back to Maintenance
                </Button>

                <h1 className="text-2xl font-bold">
                    {isEditing ? 'Edit Maintenance Schedule' : 'New Maintenance Schedule'}
                </h1>

                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/maintenance')}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : 'Save Schedule'}
                    </Button>
                </div>
            </div>

            {errors.submit && (
                <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <AlertDescription>{errors.submit}</AlertDescription>
                </Alert>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="details">Schedule Details</TabsTrigger>
                    <TabsTrigger value="tasks">Maintenance Tasks</TabsTrigger>
                    <TabsTrigger value="notes">Notes & Additional Info</TabsTrigger>
                </TabsList>

                {/* Schedule Details Tab */}
                <TabsContent value="details" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <TruckIcon className="h-5 w-5 mr-2" />
                                Vehicle Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="vehicleId">Select Vehicle</Label>
                                <select
                                    id="vehicleId"
                                    value={formData.vehicleId}
                                    onChange={(e) => handleInputChange('vehicleId', e.target.value)}
                                    className={`mt-1 block w-full rounded-md border ${errors.vehicleId ? 'border-red-500' : 'border-gray-300'} px-3 py-2`}
                                >
                                    <option value="">Select a vehicle</option>
                                    {mockVehicles.map((vehicle) => (
                                        <option key={vehicle.id} value={vehicle.id}>
                                            {vehicle.name} - {vehicle.type}
                                        </option>
                                    ))}
                                </select>
                                {errors.vehicleId && (
                                    <p className="mt-1 text-sm text-red-600">{errors.vehicleId}</p>
                                )}
                            </div>

                            {selectedVehicle && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Vehicle Type</Label>
                                        <p className="mt-1 p-2 bg-gray-50 rounded">{selectedVehicle.type}</p>
                                    </div>
                                    <div>
                                        <Label>Current Mileage</Label>
                                        <p className="mt-1 p-2 bg-gray-50 rounded">{selectedVehicle.mileage.toLocaleString()} miles</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Calendar className="h-5 w-5 mr-2" />
                                Schedule Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="scheduledDate">Scheduled Date</Label>
                                    <Input
                                        id="scheduledDate"
                                        type="date"
                                        value={formData.scheduledDate}
                                        onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                                        className={errors.scheduledDate ? 'border-red-500' : ''}
                                    />
                                    {errors.scheduledDate && (
                                        <p className="mt-1 text-sm text-red-600">{errors.scheduledDate}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="priority">Priority</Label>
                                    <select
                                        id="priority"
                                        value={formData.priority}
                                        onChange={(e) => handleInputChange('priority', e.target.value)}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                    >
                                        {Object.entries(MAINTENANCE_PRIORITY_LABELS).map(([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="assignedTo">Assign Technician (Optional)</Label>
                                <select
                                    id="assignedTo"
                                    value={formData.assignedTo || ''}
                                    onChange={(e) => {
                                        const techId = e.target.value;
                                        if (techId) {
                                            const tech = mockTechnicians.find(t => t.id === techId);
                                            handleInputChange('assignedTo', techId);
                                            handleInputChange('assigneeName', tech?.name || '');
                                        } else {
                                            handleInputChange('assignedTo', '');
                                            handleInputChange('assigneeName', '');
                                        }
                                    }}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                >
                                    <option value="">Unassigned</option>
                                    {mockTechnicians.map((tech) => (
                                        <option key={tech.id} value={tech.id}>
                                            {tech.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <Label htmlFor="location">Location</Label>
                                <select
                                    id="location"
                                    value={formData.location || 'Main Garage'}
                                    onChange={(e) => handleInputChange('location', e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                >
                                    <option value="Main Garage">Main Garage</option>
                                    <option value="Field Service">Field Service</option>
                                    <option value="Service Center">Service Center</option>
                                </select>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button
                            type="button"
                            onClick={() => setActiveTab('tasks')}
                            disabled={!formData.vehicleId || !formData.scheduledDate}
                        >
                            Next: Add Tasks
                        </Button>
                    </div>
                </TabsContent>

                {/* Maintenance Tasks Tab */}
                <TabsContent value="tasks" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Wrench className="h-5 w-5 mr-2" />
                                Tasks List
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {errors.tasks && (
                                <Alert variant="destructive" className="mb-4">
                                    <AlertCircle className="h-4 w-4 mr-2" />
                                    <AlertDescription>{errors.tasks}</AlertDescription>
                                </Alert>
                            )}

                            {formData.tasks.length > 0 ? (
                                <div className="space-y-4">
                                    {formData.tasks.map((task, index) => (
                                        <TaskCard
                                            key={task.id || index}
                                            task={task}
                                            index={index}
                                            onRemove={handleRemoveTask}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 bg-gray-50 rounded-lg">
                                    <p className="text-gray-500">No tasks added yet.</p>
                                    <p className="text-sm text-gray-400 mt-1">Add tasks using the form below or select from common tasks.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Add New Task</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="taskName">Task Name</Label>
                                    <Input
                                        id="taskName"
                                        value={newTask.name}
                                        onChange={(e) => setNewTask(prev => ({ ...prev, name: e.target.value }))}
                                        className={errors.taskName ? 'border-red-500' : ''}
                                        placeholder="e.g., Oil Change"
                                    />
                                    {errors.taskName && (
                                        <p className="mt-1 text-sm text-red-600">{errors.taskName}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="taskType">Task Type</Label>
                                    <select
                                        id="taskType"
                                        value={newTask.type}
                                        onChange={(e) => setNewTask(prev => ({ ...prev, type: e.target.value as MaintenanceType }))}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                    >
                                        {Object.entries(MAINTENANCE_TYPE_LABELS).map(([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="taskDescription">Description</Label>
                                <Textarea
                                    id="taskDescription"
                                    value={newTask.description}
                                    onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Describe the maintenance task..."
                                />
                            </div>

                            <div>
                                <Label htmlFor="estimatedHours">Estimated Hours</Label>
                                <Input
                                    id="estimatedHours"
                                    type="number"
                                    min="0.25"
                                    step="0.25"
                                    value={newTask.estimatedHours}
                                    onChange={(e) => setNewTask(prev => ({ ...prev, estimatedHours: parseFloat(e.target.value) || 0 }))}
                                />
                            </div>

                            {/* Parts section */}
                            <div className="mt-4 border-t pt-4">
                                <h4 className="font-medium mb-2">Required Parts</h4>

                                {newTask.parts && newTask.parts.length > 0 ? (
                                    <div className="space-y-2 mb-4">
                                        {newTask.parts.map((part, index) => (
                                            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                                <div>
                                                    <span className="font-medium">{part.partName}</span>
                                                    <span className="text-sm text-gray-500 ml-2">×{part.quantity}</span>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRemovePart(index)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 mb-4">No parts added yet.</p>
                                )}

                                <div className="grid grid-cols-3 gap-2 items-end">
                                    <div className="col-span-2">
                                        <Label htmlFor="partName">Part Name</Label>
                                        <Input
                                            id="partName"
                                            value={newPart.partName}
                                            onChange={(e) => setNewPart(prev => ({ ...prev, partName: e.target.value }))}
                                            placeholder="e.g., Oil Filter"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="partQuantity">Quantity</Label>
                                        <Input
                                            id="partQuantity"
                                            type="number"
                                            min="1"
                                            value={newPart.quantity}
                                            onChange={(e) => setNewPart(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center mt-2">
                                    <Checkbox
                                        id="partInStock"
                                        checked={newPart.inStock}
                                        onCheckedChange={(checked) => setNewPart(prev => ({ ...prev, inStock: !!checked }))}
                                    />
                                    <Label htmlFor="partInStock" className="ml-2">
                                        Part is in stock
                                    </Label>
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleAddPart}
                                    className="mt-2"
                                    disabled={!newPart.partName}
                                >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Part
                                </Button>
                            </div>

                            <div className="flex justify-end mt-4">
                                <Button
                                    type="button"
                                    onClick={handleAddTask}
                                    disabled={!newTask.name}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Task
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Common Tasks</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {commonTasks.map((task, index) => (
                                    <CommonTaskCard
                                        key={index}
                                        task={task}
                                        onAdd={handleAddPredefinedTask}
                                    />
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-between">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setActiveTab('details')}
                        >
                            Back to Details
                        </Button>
                        <Button
                            type="button"
                            onClick={() => setActiveTab('notes')}
                            disabled={formData.tasks.length === 0}
                        >
                            Next: Notes & Summary
                        </Button>
                    </div>
                </TabsContent>

                {/* Notes & Additional Info Tab */}
                <TabsContent value="notes" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Additional Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    value={formData.notes}
                                    onChange={(e) => handleInputChange('notes', e.target.value)}
                                    placeholder="Add any additional information, special instructions, or notes..."
                                    className="min-h-[150px]"
                                />
                            </div>

                            <div className="bg-blue-50 p-4 rounded-md">
                                <h3 className="font-medium mb-2 text-blue-800">Cost Estimates</h3>
                                <div className="space-y-2">
                                    <div className="grid grid-cols-2">
                                        <div className="text-gray-600">Labor Cost:</div>
                                        <div className="font-medium">${costs.laborCost.toFixed(2)}</div>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <div className="text-gray-600">Parts Cost:</div>
                                        <div className="font-medium">${costs.partsCost.toFixed(2)}</div>
                                    </div>
                                    <div className="grid grid-cols-2 border-t pt-2 mt-2">
                                        <div className="text-gray-600 font-medium">Total Estimated Cost:</div>
                                        <div className="font-medium">${costs.totalCost.toFixed(2)}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-md">
                                <h3 className="font-medium mb-2">Summary</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="grid grid-cols-2">
                                        <div className="text-gray-600">Vehicle:</div>
                                        <div>{formData.vehicleName} ({formData.vehicleType})</div>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <div className="text-gray-600">Scheduled Date:</div>
                                        <div>{new Date(formData.scheduledDate).toLocaleDateString()}</div>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <div className="text-gray-600">Priority:</div>
                                        <div>{MAINTENANCE_PRIORITY_LABELS[formData.priority]}</div>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <div className="text-gray-600">Tasks:</div>
                                        <div>{formData.tasks.length} maintenance tasks</div>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <div className="text-gray-600">Assigned To:</div>
                                        <div>{formData.assigneeName || 'Unassigned'}</div>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <div className="text-gray-600">Location:</div>
                                        <div>{formData.location || 'Main Garage'}</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-between">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setActiveTab('tasks')}
                        >
                            Back to Tasks
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : (isEditing ? 'Update Schedule' : 'Create Schedule')}
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>
        </form>
    );
};

export default MaintenanceScheduleForm;