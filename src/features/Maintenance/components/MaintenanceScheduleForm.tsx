// src/features/Maintenance/components/MaintenanceScheduleForm.tsx
// 🎨 ENTERPRISE MODERN VERSION - Bold gradients, professional design, investor-ready

import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useMaintenance } from '../contexts/useMaintenance';
import {
    Input
} from '../../UI/components/ui/input';
import { Textarea } from '../../UI/components/ui/textarea';
import { Label } from '../../UI/components/ui/label';
import {
    Tabs,
    TabsContent
} from '../../UI/components/ui/tabs';
import { Checkbox } from '../../UI/components/ui/checkbox';
import {
    ChevronLeft,
    Calendar,
    Truck as TruckIcon,
    Wrench,
    Plus,
    Trash2,
    AlertCircle,
    TrendingUp,
    Settings,
    Zap
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
import { Alert, AlertDescription } from '../../UI/components/ui/alert';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

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

interface MaintenanceScheduleFormData {
    vehicleId: string;
    vehicleName: string;
    vehicleType: string;
    tasks: MaintenanceTask[];
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

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════════

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

const LABOR_RATE = 75;
const AVERAGE_PART_COST = 20;

// ═══════════════════════════════════════════════════════════════════════════════
// MODERN CARD COMPONENT WITH PROFESSIONAL STYLING
// ═══════════════════════════════════════════════════════════════════════════════

interface ModernCardProps {
    children: React.ReactNode;
    gradient: string;
    borderColor: string;
    title?: string;
    icon?: React.ReactNode;
}

const ModernCard: React.FC<ModernCardProps> = ({ children, gradient, borderColor, title, icon }) => {
    return (
        <div style={{
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.08)',
            border: `2px solid ${borderColor}`,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            backgroundColor: 'white'
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 32px 56px rgba(0, 0, 0, 0.16), 0 12px 24px rgba(0, 0, 0, 0.12)';
                e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
        >
            {title && (
                <div style={{
                    background: gradient,
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    borderBottom: `1px solid ${borderColor}80`
                }}>
                    {icon && <div style={{ fontSize: '20px' }}>{icon}</div>}
                    <h3 style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#1f2937',
                        margin: '0'
                    }}>
                        {title}
                    </h3>
                </div>
            )}
            <div style={{ padding: '24px' }}>
                {children}
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MEMOIZED TASK CARD
// ═══════════════════════════════════════════════════════════════════════════════

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
        <div
            style={{
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                padding: '16px',
                backgroundColor: '#f9fafb',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.12)';
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.backgroundColor = '#f0f9ff';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.backgroundColor = '#f9fafb';
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                    <h3 style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#1f2937',
                        margin: '0 0 8px 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <Wrench size={18} style={{ color: '#3b82f6' }} />
                        {taskName}
                    </h3>
                    <p style={{
                        fontSize: '13px',
                        color: '#6b7280',
                        margin: '0 0 12px 0'
                    }}>
                        {task.description}
                    </p>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px'
                    }}>
                        <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '6px 12px',
                            background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                            color: '#1e40af',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '600',
                            border: '1px solid #93c5fd'
                        }}>
                            {MAINTENANCE_TYPE_LABELS[task.type]}
                        </span>
                        <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '6px 12px',
                            background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                            color: '#374151',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '600',
                            border: '1px solid #d1d5db'
                        }}>
                            ⏱️ {taskHours}h
                        </span>
                        <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '6px 12px',
                            background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                            color: '#15803d',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '700',
                            border: '1px solid #86efac'
                        }}>
                            💰 ${estimatedCost}
                        </span>
                    </div>

                    {task.parts && task.parts.length > 0 && (
                        <div style={{ marginTop: '12px' }}>
                            <p style={{
                                fontSize: '12px',
                                fontWeight: '700',
                                color: '#374151',
                                marginBottom: '8px'
                            }}>
                                📦 Parts:
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {task.parts.map((part, partIndex) => (
                                    <div
                                        key={partIndex}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            fontSize: '11px',
                                            padding: '6px 10px',
                                            backgroundColor: 'white',
                                            borderRadius: '6px',
                                            border: '1px solid #e5e7eb'
                                        }}
                                    >
                                        <span style={{ color: '#1f2937', fontWeight: '500' }}>
                                            {part.partName} ×{part.quantity}
                                        </span>
                                        <span style={{
                                            color: part.inStock ? '#059669' : '#dc2626',
                                            fontWeight: '700',
                                            fontSize: '10px',
                                            padding: '2px 8px',
                                            backgroundColor: part.inStock ? '#d1fae5' : '#fee2e2',
                                            borderRadius: '4px'
                                        }}>
                                            {part.inStock ? '✓' : '✗'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => onRemove(index)}
                    style={{
                        backgroundColor: '#fee2e2',
                        color: '#991b1b',
                        border: '1px solid #fecaca',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '12px',
                        fontWeight: '600'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#fecaca';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#fee2e2';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    );
});

TaskCard.displayName = 'TaskCard';

// ═══════════════════════════════════════════════════════════════════════════════
// COMMON TASK CARD
// ═══════════════════════════════════════════════════════════════════════════════

const CommonTaskCard = memo<{
    task: TaskTemplate;
    onAdd: (task: TaskTemplate) => void;
}>(({ task, onAdd }) => {
    const handleAdd = useCallback(() => {
        onAdd(task);
    }, [task, onAdd]);

    return (
        <div style={{
            border: '2px solid #dbeafe',
            borderRadius: '12px',
            padding: '16px',
            backgroundColor: '#f0f9ff',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 8px 16px rgba(59, 130, 246, 0.1)'
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(59, 130, 246, 0.2)';
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.borderColor = '#3b82f6';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(59, 130, 246, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#dbeafe';
            }}
        >
            <h3 style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#1f2937',
                margin: '0 0 6px 0'
            }}>
                {task.name}
            </h3>
            <p style={{
                fontSize: '12px',
                color: '#6b7280',
                margin: '0 0 12px 0'
            }}>
                {task.description}
            </p>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flex: 1 }}>
                <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '4px 10px',
                    background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                    color: '#1e40af',
                    borderRadius: '6px',
                    fontSize: '10px',
                    fontWeight: '700',
                    border: '1px solid #93c5fd'
                }}>
                    {MAINTENANCE_TYPE_LABELS[task.type]}
                </span>
                <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '4px 10px',
                    background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                    color: '#374151',
                    borderRadius: '6px',
                    fontSize: '10px',
                    fontWeight: '700',
                    border: '1px solid #d1d5db'
                }}>
                    {task.estimatedHours}h
                </span>
            </div>
            {task.parts && task.parts.length > 0 && (
                <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 12px 0' }}>
                    📦 {task.parts.length} part{task.parts.length > 1 ? 's' : ''}
                </p>
            )}
            <button
                type="button"
                onClick={handleAdd}
                style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    marginTop: 'auto'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(37, 99, 235, 0.4)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                }}
            >
                <Plus size={14} />
                Add
            </button>
        </div>
    );
});

CommonTaskCard.displayName = 'CommonTaskCard';

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const MaintenanceScheduleForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { getSchedule, createSchedule, updateSchedule } = useMaintenance();

    const isEditing = !!id;
    const [activeTab, setActiveTab] = useState('details');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const preselectedVehicleId = queryParams.get('vehicleId');

    // ─────────────────────────────────────────────────────────────────────────
    // STATE
    // ─────────────────────────────────────────────────────────────────────────

    const [formData, setFormData] = useState<MaintenanceScheduleFormData>({
        vehicleId: preselectedVehicleId || '',
        vehicleName: '',
        vehicleType: '',
        tasks: [],
        scheduledDate: new Date().toISOString().split('T')[0],
        status: MaintenanceStatus.SCHEDULED,
        priority: MaintenancePriority.MEDIUM,
        estimatedCost: 0,
        notes: ''
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

    // ─────────────────────────────────────────────────────────────────────────
    // HELPER FUNCTIONS
    // ─────────────────────────────────────────────────────────────────────────

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

    const ensureMaintenanceTask = useCallback((
        task: Partial<MaintenanceTask> & { id?: string; name?: string; title?: string; type?: MaintenanceType },
        vehicleId: string,
        scheduledDate: string
    ): MaintenanceTask => {
        const now = new Date().toISOString();

        if (task.vehicleId && task.status && task.createdAt) {
            return task as MaintenanceTask;
        }

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

    // ─────────────────────────────────────────────────────────────────────────
    // CALCULATIONS
    // ─────────────────────────────────────────────────────────────────────────

    const costs = useMemo(() => {
        const laborCost = formData.tasks.reduce((sum, task: MaintenanceTask) => {
            const hours = task.estimatedHours || task.estimatedDuration || 1;
            return sum + (hours * LABOR_RATE);
        }, 0);

        const partsCost = formData.tasks.reduce((sum, task: MaintenanceTask) => {
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

    const selectedVehicle = useMemo(() => {
        return mockVehicles.find(v => v.id === formData.vehicleId);
    }, [formData.vehicleId]);

    // ─────────────────────────────────────────────────────────────────────────
    // EFFECTS
    // ─────────────────────────────────────────────────────────────────────────

    useEffect(() => {
        if (isEditing && id) {
            const schedule = getSchedule(id);
            if (schedule) {
                const scheduleDate = schedule.scheduledDate || new Date().toISOString();
                const formattedDate = new Date(scheduleDate).toISOString().split('T')[0];

                const safeTasks = schedule.tasks || [];
                const convertedTasks: MaintenanceTask[] = safeTasks.map((task: Partial<MaintenanceTask>) =>
                    ensureMaintenanceTask(task, schedule.vehicleId, formattedDate)
                );

                setFormData({
                    vehicleId: schedule.vehicleId,
                    vehicleName: schedule.vehicleName || '',
                    vehicleType: schedule.vehicleType || '',
                    tasks: convertedTasks,
                    scheduledDate: formattedDate,
                    status: schedule.status || MaintenanceStatus.SCHEDULED,
                    priority: schedule.priority || MaintenancePriority.MEDIUM,
                    estimatedCost: schedule.estimatedCost || 0,
                    notes: schedule.notes || '',
                    assignedTo: schedule.assignedTo,
                    assigneeName: schedule.assigneeName,
                    location: schedule.location,
                    mileage: schedule.mileage
                });
            }
        }
    }, [isEditing, id, getSchedule, ensureMaintenanceTask]);

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

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            estimatedCost: costs.totalCost
        }));
    }, [costs.totalCost]);

    useEffect(() => {
        if (errors.submit) {
            setErrors(prev => ({ ...prev, submit: '' }));
        }
    }, [activeTab, errors.submit]);

    // ─────────────────────────────────────────────────────────────────────────
    // HANDLERS
    // ─────────────────────────────────────────────────────────────────────────

    const handleInputChange = useCallback((name: string, value: string | number | boolean) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

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
        if (!newTask.name) {
            setErrors(prev => ({
                ...prev,
                taskName: 'Task name is required'
            }));
            return;
        }

        const maintenanceTask = convertFormTaskToMaintenanceTask(
            newTask,
            formData.vehicleId,
            formData.scheduledDate
        );

        setFormData(prev => ({
            ...prev,
            tasks: [...prev.tasks, maintenanceTask]
        }));

        setNewTask({
            name: '',
            description: '',
            type: MaintenanceType.PREVENTIVE,
            estimatedHours: 1,
            completed: false,
            parts: []
        });

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
            formData.vehicleId,
            formData.scheduledDate
        );

        setFormData(prev => ({
            ...prev,
            tasks: [...prev.tasks, maintenanceTask]
        }));

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

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
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
                await updateSchedule(id, formData);
                navigate(`/maintenance/schedule/${id}`);
            } else {
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

    // ═══════════════════════════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════════════════════════

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 20px' }}>
            {/* HEADER */}
            <div style={{ marginBottom: '40px' }}>
                <button
                    type="button"
                    onClick={() => navigate('/maintenance')}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#3b82f6',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '16px',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#2563eb';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#3b82f6';
                    }}
                >
                    <ChevronLeft size={16} />
                    Back to Maintenance
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
                    <div>
                        <h1 style={{
                            fontSize: '40px',
                            fontWeight: '900',
                            color: '#1f2937',
                            margin: '0 0 8px 0',
                            background: 'linear-gradient(135deg, #1f2937 0%, #3b82f6 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                            🔧 {isEditing ? 'Edit' : 'Create'} Maintenance Schedule
                        </h1>
                        <p style={{
                            fontSize: '16px',
                            color: '#6b7280',
                            margin: '0'
                        }}>
                            Enterprise-grade vehicle maintenance management
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            type="button"
                            onClick={() => navigate('/maintenance')}
                            style={{
                                background: 'white',
                                color: '#374151',
                                border: '2px solid #e5e7eb',
                                borderRadius: '10px',
                                padding: '10px 24px',
                                fontSize: '14px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#9ca3af';
                                e.currentTarget.style.backgroundColor = '#f9fafb';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#e5e7eb';
                                e.currentTarget.style.backgroundColor = 'white';
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            style={{
                                background: isSubmitting ? '#9ca3af' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                padding: '10px 28px',
                                fontSize: '14px',
                                fontWeight: '700',
                                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                boxShadow: '0 12px 24px rgba(16, 185, 129, 0.3)'
                            }}
                            onMouseEnter={(e) => {
                                if (!isSubmitting) {
                                    e.currentTarget.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
                                    e.currentTarget.style.boxShadow = '0 16px 32px rgba(16, 185, 129, 0.4)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isSubmitting) {
                                    e.currentTarget.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(16, 185, 129, 0.3)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }
                            }}
                        >
                            <Zap size={16} />
                            {isSubmitting ? 'Saving...' : `${isEditing ? 'Update' : 'Create'} Schedule`}
                        </button>
                    </div>
                </div>
            </div>

            {/* ERROR ALERT */}
            {errors.submit && (
                <div style={{
                    marginBottom: '24px',
                    padding: '16px',
                    backgroundColor: '#fee2e2',
                    borderRadius: '12px',
                    border: '2px solid #fecaca',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: '#991b1b',
                    fontSize: '14px',
                    fontWeight: '600'
                }}>
                    <AlertCircle size={20} />
                    {errors.submit}
                </div>
            )}

            {/* ULTRA-MODERN TABS */}
            <div style={{ marginBottom: '48px' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '16px',
                    marginBottom: '12px'
                }}>
                    {/* DETAILS TAB */}
                    <button
                        type="button"
                        onClick={() => setActiveTab('details')}
                        style={{
                            padding: '16px 20px',
                            borderRadius: '14px',
                            fontSize: '15px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            background: activeTab === 'details'
                                ? 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)'
                                : '#f9fafb',
                            color: activeTab === 'details' ? '#1e40af' : '#6b7280',
                            border: activeTab === 'details'
                                ? '2px solid #3b82f6'
                                : '2px solid #e5e7eb',
                            boxShadow: activeTab === 'details'
                                ? '0 12px 24px rgba(59, 130, 246, 0.2)'
                                : '0 4px 12px rgba(0, 0, 0, 0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                        onMouseEnter={(e) => {
                            if (activeTab !== 'details') {
                                e.currentTarget.style.backgroundColor = '#f3f4f6';
                                e.currentTarget.style.borderColor = '#d1d5db';
                                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.08)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (activeTab !== 'details') {
                                e.currentTarget.style.backgroundColor = '#f9fafb';
                                e.currentTarget.style.borderColor = '#e5e7eb';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                            }
                        }}
                    >
                        <span style={{ fontSize: '18px' }}>📋</span>
                        <span>Schedule Details</span>
                        {activeTab === 'details' && (
                            <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                                color: '#3b82f6',
                                fontSize: '12px',
                                fontWeight: '900',
                                marginLeft: '4px'
                            }}>
                                ✓
                            </span>
                        )}
                    </button>

                    {/* TASKS TAB */}
                    <button
                        type="button"
                        onClick={() => setActiveTab('tasks')}
                        style={{
                            padding: '16px 20px',
                            borderRadius: '14px',
                            fontSize: '15px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            background: activeTab === 'tasks'
                                ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)'
                                : '#f9fafb',
                            color: activeTab === 'tasks' ? '#166534' : '#6b7280',
                            border: activeTab === 'tasks'
                                ? '2px solid #10b981'
                                : '2px solid #e5e7eb',
                            boxShadow: activeTab === 'tasks'
                                ? '0 12px 24px rgba(16, 185, 129, 0.2)'
                                : '0 4px 12px rgba(0, 0, 0, 0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                        onMouseEnter={(e) => {
                            if (activeTab !== 'tasks') {
                                e.currentTarget.style.backgroundColor = '#f3f4f6';
                                e.currentTarget.style.borderColor = '#d1d5db';
                                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.08)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (activeTab !== 'tasks') {
                                e.currentTarget.style.backgroundColor = '#f9fafb';
                                e.currentTarget.style.borderColor = '#e5e7eb';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                            }
                        }}
                    >
                        <span style={{ fontSize: '18px' }}>✅</span>
                        <span>Maintenance Tasks</span>
                        {activeTab === 'tasks' && (
                            <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                                color: '#10b981',
                                fontSize: '12px',
                                fontWeight: '900',
                                marginLeft: '4px'
                            }}>
                                ✓
                            </span>
                        )}
                    </button>

                    {/* NOTES TAB */}
                    <button
                        type="button"
                        onClick={() => setActiveTab('notes')}
                        style={{
                            padding: '16px 20px',
                            borderRadius: '14px',
                            fontSize: '15px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            background: activeTab === 'notes'
                                ? 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)'
                                : '#f9fafb',
                            color: activeTab === 'notes' ? 'white' : '#6b7280',
                            border: activeTab === 'notes'
                                ? '2px solid #a855f7'
                                : '2px solid #e5e7eb',
                            boxShadow: activeTab === 'notes'
                                ? '0 12px 24px rgba(168, 85, 247, 0.3)'
                                : '0 4px 12px rgba(0, 0, 0, 0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                        onMouseEnter={(e) => {
                            if (activeTab !== 'notes') {
                                e.currentTarget.style.backgroundColor = '#f3f4f6';
                                e.currentTarget.style.borderColor = '#d1d5db';
                                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.08)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (activeTab !== 'notes') {
                                e.currentTarget.style.backgroundColor = '#f9fafb';
                                e.currentTarget.style.borderColor = '#e5e7eb';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                            }
                        }}
                    >
                        <span style={{ fontSize: '18px' }}>📝</span>
                        <span>Notes & Summary</span>
                        {activeTab === 'notes' && (
                            <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: '900',
                                marginLeft: '4px'
                            }}>
                                ✓
                            </span>
                        )}
                    </button>
                </div>

                {/* PROGRESS INDICATOR LINE */}
                <div style={{
                    height: '4px',
                    borderRadius: '2px',
                    background: 'linear-gradient(90deg, #e5e7eb 0%, #e5e7eb 33%, #e5e7eb 66%, #e5e7eb 100%)',
                    overflow: 'hidden',
                    position: 'relative'
                }}>
                    <div style={{
                        height: '100%',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        background: activeTab === 'details'
                            ? 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)'
                            : activeTab === 'tasks'
                            ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
                            : 'linear-gradient(90deg, #a855f7 0%, #9333ea 100%)',
                        width: activeTab === 'details'
                            ? '33.33%'
                            : activeTab === 'tasks'
                            ? '66.66%'
                            : '100%',
                        marginLeft: activeTab === 'details'
                            ? '0%'
                            : activeTab === 'tasks'
                            ? '33.33%'
                            : '66.66%',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                    }} />
                </div>
            </div>

            {/* TABS CONTENT */}
            <Tabs value={activeTab} onValueChange={setActiveTab} style={{ marginBottom: '32px' }}>

                {/* SCHEDULE DETAILS TAB */}
                <TabsContent value="details" style={{ display: activeTab === 'details' ? 'block' : 'none' }} className="space-y-6">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <ModernCard
                            title="Vehicle Information"
                            icon={<TruckIcon size={20} />}
                            gradient="linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)"
                            borderColor="#3b82f6"
                        >
                            <div style={{ marginBottom: '16px' }}>
                                <Label htmlFor="vehicleId" style={{ fontWeight: '700', color: '#374151', marginBottom: '8px' }}>
                                    Select Vehicle <span style={{ color: '#dc2626' }}>*</span>
                                </Label>
                                <select
                                    id="vehicleId"
                                    value={formData.vehicleId}
                                    onChange={(e) => handleInputChange('vehicleId', e.target.value)}
                                    style={{
                                        marginTop: '8px',
                                        width: '100%',
                                        borderRadius: '10px',
                                        border: `2px solid ${errors.vehicleId ? '#dc2626' : '#e5e7eb'}`,
                                        padding: '12px',
                                        color: '#1f2937',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        transition: 'all 0.2s',
                                        fontFamily: 'inherit',
                                        backgroundColor: 'white'
                                    }}
                                    onFocus={(e) => {
                                        if (!errors.vehicleId) {
                                            e.currentTarget.style.borderColor = '#3b82f6';
                                            e.currentTarget.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                                        }
                                    }}
                                    onBlur={(e) => {
                                        e.currentTarget.style.borderColor = errors.vehicleId ? '#dc2626' : '#e5e7eb';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <option value="">Select a vehicle...</option>
                                    {mockVehicles.map((vehicle) => (
                                        <option key={vehicle.id} value={vehicle.id}>
                                            {vehicle.name} ({vehicle.type})
                                        </option>
                                    ))}
                                </select>
                                {errors.vehicleId && (
                                    <p style={{ marginTop: '8px', fontSize: '13px', color: '#dc2626', fontWeight: '600' }}>
                                        {errors.vehicleId}
                                    </p>
                                )}
                            </div>

                            {selectedVehicle && (
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                    gap: '16px',
                                    marginTop: '16px',
                                    paddingTop: '16px',
                                    borderTop: '2px solid #dbeafe'
                                }}>
                                    <div style={{
                                        padding: '16px',
                                        background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                                        borderRadius: '10px',
                                        border: '2px solid #93c5fd'
                                    }}>
                                        <p style={{ fontSize: '12px', fontWeight: '700', color: '#1e40af', textTransform: 'uppercase', margin: '0' }}>
                                            Vehicle Type
                                        </p>
                                        <p style={{ fontSize: '16px', fontWeight: '700', color: '#1f2937', marginTop: '8px' }}>
                                            {selectedVehicle.type}
                                        </p>
                                    </div>
                                    <div style={{
                                        padding: '16px',
                                        background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                                        borderRadius: '10px',
                                        border: '2px solid #86efac'
                                    }}>
                                        <p style={{ fontSize: '12px', fontWeight: '700', color: '#166534', textTransform: 'uppercase', margin: '0' }}>
                                            Current Mileage
                                        </p>
                                        <p style={{ fontSize: '16px', fontWeight: '700', color: '#1f2937', marginTop: '8px' }}>
                                            {selectedVehicle.mileage.toLocaleString()} mi
                                        </p>
                                    </div>
                                </div>
                            )}
                        </ModernCard>

                        <ModernCard
                            title="Schedule Information"
                            icon={<Calendar size={20} />}
                            gradient="linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)"
                            borderColor="#10b981"
                        >
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                                <div>
                                    <Label htmlFor="scheduledDate" style={{ fontWeight: '700', color: '#374151', marginBottom: '8px' }}>
                                        Scheduled Date <span style={{ color: '#dc2626' }}>*</span>
                                    </Label>
                                    <Input
                                        id="scheduledDate"
                                        type="date"
                                        value={formData.scheduledDate}
                                        onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                                        style={{
                                            marginTop: '8px',
                                            borderColor: errors.scheduledDate ? '#dc2626' : '#e5e7eb',
                                            borderRadius: '10px',
                                            borderWidth: '2px',
                                            padding: '10px 12px'
                                        }}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="priority" style={{ fontWeight: '700', color: '#374151', marginBottom: '8px' }}>
                                        Priority
                                    </Label>
                                    <select
                                        id="priority"
                                        value={formData.priority}
                                        onChange={(e) => handleInputChange('priority', e.target.value)}
                                        style={{
                                            marginTop: '8px',
                                            width: '100%',
                                            borderRadius: '10px',
                                            border: '2px solid #e5e7eb',
                                            padding: '10px 12px',
                                            color: '#1f2937',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            fontFamily: 'inherit',
                                            backgroundColor: 'white'
                                        }}
                                    >
                                        {Object.entries(MAINTENANCE_PRIORITY_LABELS).map(([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <Label htmlFor="assignedTo" style={{ fontWeight: '700', color: '#374151', marginBottom: '8px' }}>
                                        Assign Technician
                                    </Label>
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
                                        style={{
                                            marginTop: '8px',
                                            width: '100%',
                                            borderRadius: '10px',
                                            border: '2px solid #e5e7eb',
                                            padding: '10px 12px',
                                            color: '#1f2937',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            fontFamily: 'inherit',
                                            backgroundColor: 'white'
                                        }}
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
                                    <Label htmlFor="location" style={{ fontWeight: '700', color: '#374151', marginBottom: '8px' }}>
                                        Location
                                    </Label>
                                    <select
                                        id="location"
                                        value={formData.location || 'Main Garage'}
                                        onChange={(e) => handleInputChange('location', e.target.value)}
                                        style={{
                                            marginTop: '8px',
                                            width: '100%',
                                            borderRadius: '10px',
                                            border: '2px solid #e5e7eb',
                                            padding: '10px 12px',
                                            color: '#1f2937',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            fontFamily: 'inherit',
                                            backgroundColor: 'white'
                                        }}
                                    >
                                        <option value="Main Garage">Main Garage</option>
                                        <option value="Field Service">Field Service</option>
                                        <option value="Service Center">Service Center</option>
                                    </select>
                                </div>
                            </div>
                        </ModernCard>

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                type="button"
                                onClick={() => setActiveTab('tasks')}
                                disabled={!formData.vehicleId || !formData.scheduledDate}
                                style={{
                                    background: !formData.vehicleId || !formData.scheduledDate
                                        ? '#9ca3af'
                                        : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    padding: '12px 28px',
                                    fontWeight: '700',
                                    cursor: !formData.vehicleId || !formData.scheduledDate ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s',
                                    fontSize: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    boxShadow: '0 12px 24px rgba(59, 130, 246, 0.3)'
                                }}
                                onMouseEnter={(e) => {
                                    if (formData.vehicleId && formData.scheduledDate) {
                                        e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)';
                                        e.currentTarget.style.boxShadow = '0 16px 32px rgba(59, 130, 246, 0.4)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (formData.vehicleId && formData.scheduledDate) {
                                        e.currentTarget.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
                                        e.currentTarget.style.boxShadow = '0 12px 24px rgba(59, 130, 246, 0.3)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }
                                }}
                            >
                                Next: Add Tasks
                                <Zap size={16} />
                            </button>
                        </div>
                    </div>
                </TabsContent>

                {/* MAINTENANCE TASKS TAB */}
                <TabsContent value="tasks" style={{ display: activeTab === 'tasks' ? 'block' : 'none' }} className="space-y-6">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '16px'
                            }}>
                                <h3 style={{
                                    fontSize: '18px',
                                    fontWeight: '700',
                                    color: '#1f2937',
                                    margin: '0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    <Wrench size={20} style={{ color: '#a855f7' }} />
                                    Maintenance Tasks
                                </h3>
                                <span style={{
                                    fontSize: '13px',
                                    fontWeight: '700',
                                    color: '#1f2937',
                                    backgroundColor: '#f0f9ff',
                                    padding: '6px 16px',
                                    borderRadius: '20px',
                                    border: '2px solid #dbeafe'
                                }}>
                                    {formData.tasks.length} {formData.tasks.length === 1 ? 'task' : 'tasks'}
                                </span>
                            </div>

                            {errors.tasks && (
                                <div style={{
                                    marginBottom: '16px',
                                    padding: '12px 16px',
                                    backgroundColor: '#fee2e2',
                                    borderRadius: '10px',
                                    border: '2px solid #fecaca',
                                    color: '#991b1b',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    <AlertCircle size={16} />
                                    {errors.tasks}
                                </div>
                            )}

                            {formData.tasks.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                                <div style={{
                                    textAlign: 'center',
                                    padding: '48px 24px',
                                    backgroundColor: '#f9fafb',
                                    borderRadius: '12px',
                                    border: '2px dashed #d1d5db'
                                }}>
                                    <p style={{ color: '#6b7280', fontSize: '15px', margin: '0 0 4px 0', fontWeight: '700' }}>
                                        No tasks added yet
                                    </p>
                                    <p style={{ color: '#9ca3af', fontSize: '13px', margin: '0' }}>
                                        Add tasks using the form below or select from common tasks.
                                    </p>
                                </div>
                            )}
                        </div>

                        <ModernCard
                            title="Add New Task"
                            icon={<Plus size={20} />}
                            gradient="linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)"
                            borderColor="#f97316"
                        >
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                                <div>
                                    <Label htmlFor="taskName" style={{ fontWeight: '700', color: '#374151', marginBottom: '8px' }}>
                                        Task Name <span style={{ color: '#dc2626' }}>*</span>
                                    </Label>
                                    <Input
                                        id="taskName"
                                        value={newTask.name}
                                        onChange={(e) => setNewTask(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="e.g., Oil Change"
                                        style={{
                                            marginTop: '8px',
                                            borderRadius: '10px',
                                            borderWidth: '2px',
                                            padding: '10px 12px'
                                        }}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="taskType" style={{ fontWeight: '700', color: '#374151', marginBottom: '8px' }}>
                                        Task Type
                                    </Label>
                                    <select
                                        id="taskType"
                                        value={newTask.type}
                                        onChange={(e) => setNewTask(prev => ({ ...prev, type: e.target.value as MaintenanceType }))}
                                        style={{
                                            marginTop: '8px',
                                            width: '100%',
                                            borderRadius: '10px',
                                            border: '2px solid #e5e7eb',
                                            padding: '10px 12px',
                                            color: '#1f2937',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            fontFamily: 'inherit',
                                            backgroundColor: 'white'
                                        }}
                                    >
                                        {Object.entries(MAINTENANCE_TYPE_LABELS).map(([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <Label htmlFor="estimatedHours" style={{ fontWeight: '700', color: '#374151', marginBottom: '8px' }}>
                                        Estimated Hours
                                    </Label>
                                    <Input
                                        id="estimatedHours"
                                        type="number"
                                        min="0.25"
                                        step="0.25"
                                        value={newTask.estimatedHours}
                                        onChange={(e) => setNewTask(prev => ({ ...prev, estimatedHours: parseFloat(e.target.value) || 0 }))}
                                        style={{
                                            marginTop: '8px',
                                            borderRadius: '10px',
                                            borderWidth: '2px',
                                            padding: '10px 12px'
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <Label htmlFor="taskDescription" style={{ fontWeight: '700', color: '#374151', marginBottom: '8px' }}>
                                    Description
                                </Label>
                                <Textarea
                                    id="taskDescription"
                                    value={newTask.description}
                                    onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Describe the maintenance task..."
                                    style={{
                                        marginTop: '8px',
                                        minHeight: '100px',
                                        borderRadius: '10px',
                                        borderWidth: '2px',
                                        padding: '10px 12px'
                                    }}
                                />
                            </div>

                            {/* PARTS SECTION */}
                            <div style={{ borderTop: '2px solid #fed7aa', paddingTop: '16px' }}>
                                <h4 style={{ fontWeight: '700', color: '#374151', marginBottom: '12px', margin: '0 0 12px 0' }}>
                                    📦 Required Parts
                                </h4>

                                {newTask.parts && newTask.parts.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                                        {newTask.parts.map((part, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    padding: '10px 12px',
                                                    backgroundColor: '#fef3c7',
                                                    borderRadius: '8px',
                                                    border: '1px solid #fcd34d'
                                                }}
                                            >
                                                <div>
                                                    <strong style={{ color: '#1f2937' }}>{part.partName}</strong>
                                                    <span style={{ color: '#6b7280', marginLeft: '8px', fontSize: '13px' }}>×{part.quantity}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemovePart(index)}
                                                    style={{
                                                        backgroundColor: 'transparent',
                                                        color: '#dc2626',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        padding: '4px 8px',
                                                        fontSize: '12px',
                                                        fontWeight: '600',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.color = '#991b1b';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.color = '#dc2626';
                                                    }}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>
                                        No parts added yet.
                                    </p>
                                )}

                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '12px' }}>
                                    <div>
                                        <Label htmlFor="partName" style={{ fontSize: '12px', fontWeight: '700', color: '#374151' }}>
                                            Part Name
                                        </Label>
                                        <Input
                                            id="partName"
                                            value={newPart.partName}
                                            onChange={(e) => setNewPart(prev => ({ ...prev, partName: e.target.value }))}
                                            placeholder="e.g., Oil Filter"
                                            style={{
                                                marginTop: '4px',
                                                borderRadius: '8px',
                                                borderWidth: '2px',
                                                padding: '8px 10px'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="partQuantity" style={{ fontSize: '12px', fontWeight: '700', color: '#374151' }}>
                                            Quantity
                                        </Label>
                                        <Input
                                            id="partQuantity"
                                            type="number"
                                            min="1"
                                            value={newPart.quantity}
                                            onChange={(e) => setNewPart(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                                            style={{
                                                marginTop: '4px',
                                                borderRadius: '8px',
                                                borderWidth: '2px',
                                                padding: '8px 10px'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                                    <Checkbox
                                        id="partInStock"
                                        checked={newPart.inStock}
                                        onCheckedChange={(checked) => setNewPart(prev => ({ ...prev, inStock: !!checked }))}
                                    />
                                    <Label htmlFor="partInStock" style={{ marginLeft: '8px', fontSize: '13px', color: '#374151', cursor: 'pointer', fontWeight: '500' }}>
                                        Part is in stock
                                    </Label>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleAddPart}
                                    disabled={!newPart.partName}
                                    style={{
                                        width: '100%',
                                        background: !newPart.partName ? '#d1d5db' : 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '10px 12px',
                                        fontSize: '12px',
                                        fontWeight: '700',
                                        cursor: !newPart.partName ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '6px'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (newPart.partName) {
                                            e.currentTarget.style.background = 'linear-gradient(135deg, #ea580c 0%, #d97706 100%)';
                                            e.currentTarget.style.boxShadow = '0 8px 16px rgba(249, 115, 22, 0.3)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (newPart.partName) {
                                            e.currentTarget.style.background = 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }
                                    }}
                                >
                                    <Plus size={14} />
                                    Add Part
                                </button>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '2px solid #fed7aa', marginTop: '16px' }}>
                                <button
                                    type="button"
                                    onClick={handleAddTask}
                                    disabled={!newTask.name}
                                    style={{
                                        background: !newTask.name ? '#d1d5db' : 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '10px',
                                        padding: '10px 28px',
                                        fontWeight: '700',
                                        cursor: !newTask.name ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.2s',
                                        fontSize: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        boxShadow: '0 8px 16px rgba(249, 115, 22, 0.2)'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (newTask.name) {
                                            e.currentTarget.style.background = 'linear-gradient(135deg, #ea580c 0%, #d97706 100%)';
                                            e.currentTarget.style.boxShadow = '0 12px 24px rgba(249, 115, 22, 0.3)';
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (newTask.name) {
                                            e.currentTarget.style.background = 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)';
                                            e.currentTarget.style.boxShadow = '0 8px 16px rgba(249, 115, 22, 0.2)';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                        }
                                    }}
                                >
                                    <Plus size={16} />
                                    Add Task
                                </button>
                            </div>
                        </ModernCard>

                        <ModernCard
                            title="Common Tasks Library"
                            icon={<TrendingUp size={20} />}
                            gradient="linear-gradient(135deg, #e0e7ff 0%, #dbeafe 100%)"
                            borderColor="#6366f1"
                        >
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                                gap: '16px'
                            }}>
                                {commonTasks.map((task, index) => (
                                    <CommonTaskCard
                                        key={index}
                                        task={task}
                                        onAdd={handleAddPredefinedTask}
                                    />
                                ))}
                            </div>
                        </ModernCard>

                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                            <button
                                type="button"
                                onClick={() => setActiveTab('details')}
                                style={{
                                    background: 'white',
                                    color: '#374151',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '10px',
                                    padding: '10px 24px',
                                    fontSize: '14px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#9ca3af';
                                    e.currentTarget.style.backgroundColor = '#f9fafb';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                    e.currentTarget.style.backgroundColor = 'white';
                                }}
                            >
                                ← Back to Details
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('notes')}
                                disabled={formData.tasks.length === 0}
                                style={{
                                    background: formData.tasks.length === 0 ? '#d1d5db' : 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    padding: '10px 28px',
                                    fontWeight: '700',
                                    cursor: formData.tasks.length === 0 ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s',
                                    fontSize: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    boxShadow: '0 8px 16px rgba(168, 85, 247, 0.2)'
                                }}
                                onMouseEnter={(e) => {
                                    if (formData.tasks.length > 0) {
                                        e.currentTarget.style.background = 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)';
                                        e.currentTarget.style.boxShadow = '0 12px 24px rgba(168, 85, 247, 0.3)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (formData.tasks.length > 0) {
                                        e.currentTarget.style.background = 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)';
                                        e.currentTarget.style.boxShadow = '0 8px 16px rgba(168, 85, 247, 0.2)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }
                                }}
                            >
                                Next: Notes & Summary
                                <Zap size={16} />
                            </button>
                        </div>
                    </div>
                </TabsContent>

                {/* NOTES & SUMMARY TAB */}
                <TabsContent value="notes" style={{ display: activeTab === 'notes' ? 'block' : 'none' }} className="space-y-6">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <ModernCard
                            title="Additional Information"
                            icon={<Settings size={20} />}
                            gradient="linear-gradient(135deg, #cffafe 0%, #a5f3fc 100%)"
                            borderColor="#06b6d4"
                        >
                            <Label htmlFor="notes" style={{ fontWeight: '700', color: '#374151', marginBottom: '8px' }}>
                                Notes
                            </Label>
                            <Textarea
                                id="notes"
                                value={formData.notes}
                                onChange={(e) => handleInputChange('notes', e.target.value)}
                                placeholder="Add any additional information, special instructions, or notes..."
                                style={{
                                    marginTop: '8px',
                                    minHeight: '150px',
                                    borderRadius: '10px',
                                    borderWidth: '2px',
                                    padding: '10px 12px'
                                }}
                            />
                        </ModernCard>

                        <ModernCard
                            title="Cost Estimates"
                            icon={<TrendingUp size={20} />}
                            gradient="linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)"
                            borderColor="#10b981"
                        >
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                gap: '16px'
                            }}>
                                <div style={{
                                    padding: '20px',
                                    background: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)',
                                    borderRadius: '12px',
                                    border: '2px solid #fed7aa'
                                }}>
                                    <p style={{ fontSize: '12px', fontWeight: '700', color: '#92400e', textTransform: 'uppercase', margin: '0' }}>
                                        Labor Cost
                                    </p>
                                    <p style={{ fontSize: '32px', fontWeight: '900', color: '#b45309', margin: '8px 0 0 0' }}>
                                        ${costs.laborCost.toFixed(2)}
                                    </p>
                                </div>
                                <div style={{
                                    padding: '20px',
                                    background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                                    borderRadius: '12px',
                                    border: '2px solid #bfdbfe'
                                }}>
                                    <p style={{ fontSize: '12px', fontWeight: '700', color: '#1e40af', textTransform: 'uppercase', margin: '0' }}>
                                        Parts Cost
                                    </p>
                                    <p style={{ fontSize: '32px', fontWeight: '900', color: '#1e3a8a', margin: '8px 0 0 0' }}>
                                        ${costs.partsCost.toFixed(2)}
                                    </p>
                                </div>
                                <div style={{
                                    padding: '20px',
                                    background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                                    borderRadius: '12px',
                                    border: '3px solid #86efac'
                                }}>
                                    <p style={{ fontSize: '12px', fontWeight: '700', color: '#166534', textTransform: 'uppercase', margin: '0' }}>
                                        Total Estimated Cost
                                    </p>
                                    <p style={{ fontSize: '32px', fontWeight: '900', color: '#15803d', margin: '8px 0 0 0' }}>
                                        ${costs.totalCost.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </ModernCard>

                        <ModernCard
                            title="Schedule Summary"
                            icon={<Settings size={20} />}
                            gradient="linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)"
                            borderColor="#64748b"
                        >
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                                gap: '20px'
                            }}>
                                <div>
                                    <p style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', margin: '0' }}>
                                        Vehicle
                                    </p>
                                    <p style={{ fontSize: '16px', fontWeight: '700', color: '#1f2937', margin: '8px 0 0 0' }}>
                                        {formData.vehicleName || 'Not selected'} <span style={{ color: '#9ca3af', fontWeight: '500', fontSize: '14px' }}>({formData.vehicleType})</span>
                                    </p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', margin: '0' }}>
                                        Scheduled Date
                                    </p>
                                    <p style={{ fontSize: '16px', fontWeight: '700', color: '#1f2937', margin: '8px 0 0 0' }}>
                                        {new Date(formData.scheduledDate).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', margin: '0' }}>
                                        Priority
                                    </p>
                                    <p style={{ fontSize: '16px', fontWeight: '700', color: '#1f2937', margin: '8px 0 0 0' }}>
                                        {MAINTENANCE_PRIORITY_LABELS[formData.priority]}
                                    </p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', margin: '0' }}>
                                        Tasks
                                    </p>
                                    <p style={{ fontSize: '16px', fontWeight: '700', color: '#1f2937', margin: '8px 0 0 0' }}>
                                        {formData.tasks.length} {formData.tasks.length === 1 ? 'task' : 'tasks'}
                                    </p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', margin: '0' }}>
                                        Assigned To
                                    </p>
                                    <p style={{ fontSize: '16px', fontWeight: '700', color: '#1f2937', margin: '8px 0 0 0' }}>
                                        {formData.assigneeName || 'Unassigned'}
                                    </p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', margin: '0' }}>
                                        Location
                                    </p>
                                    <p style={{ fontSize: '16px', fontWeight: '700', color: '#1f2937', margin: '8px 0 0 0' }}>
                                        {formData.location || 'Main Garage'}
                                    </p>
                                </div>
                            </div>
                        </ModernCard>

                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                            <button
                                type="button"
                                onClick={() => setActiveTab('tasks')}
                                style={{
                                    background: 'white',
                                    color: '#374151',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '10px',
                                    padding: '10px 24px',
                                    fontSize: '14px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#9ca3af';
                                    e.currentTarget.style.backgroundColor = '#f9fafb';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                    e.currentTarget.style.backgroundColor = 'white';
                                }}
                            >
                                ← Back to Tasks
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                style={{
                                    background: isSubmitting ? '#9ca3af' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    padding: '10px 28px',
                                    fontSize: '14px',
                                    fontWeight: '700',
                                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    boxShadow: '0 12px 24px rgba(16, 185, 129, 0.3)'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isSubmitting) {
                                        e.currentTarget.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
                                        e.currentTarget.style.boxShadow = '0 16px 32px rgba(16, 185, 129, 0.4)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isSubmitting) {
                                        e.currentTarget.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                                        e.currentTarget.style.boxShadow = '0 12px 24px rgba(16, 185, 129, 0.3)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }
                                }}
                            >
                                <Zap size={16} />
                                {isSubmitting ? 'Creating Schedule...' : `${isEditing ? 'Update' : 'Create'} Schedule`}
                            </button>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </form>
    );
};

export default MaintenanceScheduleForm;