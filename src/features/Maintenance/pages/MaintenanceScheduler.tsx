// src/features/Maintenance/pages/MaintenanceScheduler.tsx
// 🚀 FULLY MODERNIZED - Calendar UI, 100% Inline Styles, FIXED

import React, { useState, useMemo } from 'react';
import {
  Calendar, Plus, Edit2, Trash2, AlertCircle, Clock,
  ChevronLeft, ChevronRight, X
} from 'lucide-react';

// ==================== TYPES ====================
type MaintenanceStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
type MaintenanceType = 'ROUTINE' | 'REPAIR' | 'INSPECTION';
type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

interface MaintenanceEvent {
  id: string;
  truckId: string;
  truckName: string;
  type: MaintenanceType;
  status: MaintenanceStatus;
  priority: Priority;
  scheduledDate: string;
  estimatedDuration: number;
  cost: number;
  description: string;
  technician: string;
  notes?: string;
}

// ==================== MOCK DATA ====================
const MOCK_EVENTS: MaintenanceEvent[] = [
  {
    id: 'evt1', truckId: 't1', truckName: 'Truck-001', type: 'ROUTINE', status: 'IN_PROGRESS',
    priority: 'MEDIUM', scheduledDate: new Date().toISOString(),
    estimatedDuration: 4, cost: 450, description: 'Oil change and filter replacement',
    technician: 'Mike Johnson'
  },
  {
    id: 'evt2', truckId: 't2', truckName: 'Truck-002', type: 'REPAIR', status: 'SCHEDULED',
    priority: 'HIGH', scheduledDate: new Date(Date.now() + 24 * 3600000).toISOString(),
    estimatedDuration: 8, cost: 1200, description: 'Brake system overhaul',
    technician: 'Sarah Davis'
  },
  {
    id: 'evt3', truckId: 't3', truckName: 'Truck-003', type: 'INSPECTION', status: 'SCHEDULED',
    priority: 'MEDIUM', scheduledDate: new Date(Date.now() + 3 * 24 * 3600000).toISOString(),
    estimatedDuration: 2, cost: 150, description: 'Annual safety inspection',
    technician: 'Bob Wilson'
  },
  {
    id: 'evt4', truckId: 't4', truckName: 'Truck-004', type: 'ROUTINE', status: 'SCHEDULED',
    priority: 'LOW', scheduledDate: new Date(Date.now() + 7 * 24 * 3600000).toISOString(),
    estimatedDuration: 3, cost: 300, description: 'Tire rotation and balance',
    technician: 'Jane Smith'
  }
];

// ==================== STYLES & CONFIGS ====================
const formatCurrency = (amount: number): string => `$${amount.toLocaleString()}`;

const STATUS_CONFIG = {
  SCHEDULED: { icon: '📅', bgColor: '#eff6ff', textColor: '#1e40af', label: 'Scheduled' },
  IN_PROGRESS: { icon: '⚙️', bgColor: '#fffbeb', textColor: '#92400e', label: 'In Progress' },
  COMPLETED: { icon: '✅', bgColor: '#f0fdf4', textColor: '#166534', label: 'Completed' },
  CANCELLED: { icon: '❌', bgColor: '#f3f4f6', textColor: '#374151', label: 'Cancelled' }
};

const PRIORITY_CONFIG = {
  LOW: { bg: '#dcfce7', text: '#166534', icon: '🟢' },
  MEDIUM: { bg: '#fef3c7', text: '#92400e', icon: '🟡' },
  HIGH: { bg: '#fed7aa', text: '#92400e', icon: '🟠' },
  CRITICAL: { bg: '#fecaca', text: '#7f1d1d', icon: '🔴' }
};

// ==================== CALENDAR COMPONENT ====================
interface CalendarProps {
  currentDate: Date;
  events: MaintenanceEvent[];
  onDateSelect: (date: Date) => void;
}

const CalendarGrid: React.FC<CalendarProps> = ({ currentDate, events, onDateSelect }) => {
  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const days = [];
  const current = new Date(startDate);
  while (current < monthEnd) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(evt =>
      new Date(evt.scheduledDate).toDateString() === date.toDateString()
    );
  };

  return (
    <div>
      {/* Weekday Headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '16px' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} style={{ textAlign: 'center', fontWeight: '600', color: '#6b7280', padding: '8px 0', fontSize: '13px' }}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
        {days.map((date, i) => {
          const dayEvents = getEventsForDate(date);
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          const isToday = date.toDateString() === new Date().toDateString();

          return (
            <button
              key={i}
              onClick={() => onDateSelect(date)}
              style={{
                padding: '12px 8px',
                backgroundColor: isCurrentMonth ? 'white' : '#f3f4f6',
                borderRadius: '8px',
                minHeight: '100px',
                border: isToday ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                cursor: 'pointer',
                transition: 'all 0.2s',
                color: isCurrentMonth ? '#111827' : '#9ca3af',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
              onMouseEnter={(e) => {
                if (isCurrentMonth) {
                  e.currentTarget.style.backgroundColor = '#eff6ff';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.07)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isCurrentMonth ? 'white' : '#f3f4f6';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '16px', fontWeight: isToday ? '700' : '600', marginBottom: '4px' }}>
                {date.getDate()}
              </div>
              {dayEvents.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', width: '100%', fontSize: '10px' }}>
                  {dayEvents.slice(0, 2).map(evt => (
                    <div
                      key={evt.id}
                      style={{
                        backgroundColor: '#dbeafe',
                        color: '#1e40af',
                        padding: '2px 4px',
                        borderRadius: '3px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontWeight: '500'
                      }}
                    >
                      {evt.truckName}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div style={{ fontSize: '9px', color: '#2563eb', fontWeight: '600' }}>
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ==================== EVENT CARD ====================
interface EventCardProps {
  event: MaintenanceEvent;
  onEdit: (event: MaintenanceEvent) => void;
  onDelete: (id: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onEdit, onDelete }) => {
  const statusConfig = STATUS_CONFIG[event.status];
  const priorityConfig = PRIORITY_CONFIG[event.priority];

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.2s',
        borderLeft: `4px solid #3b82f6`
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '16px' }}>{statusConfig.icon}</span>
            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {event.truckName}
            </h4>
          </div>
          <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 6px 0' }}>{event.type}</p>
          <p style={{ fontSize: '12px', color: '#374151', margin: '0 0 6px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {event.description}
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{
              backgroundColor: priorityConfig.bg,
              color: priorityConfig.text,
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '10px',
              fontWeight: '600'
            }}>
              {priorityConfig.icon} {event.priority}
            </span>
            <span style={{ fontSize: '10px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '2px' }}>
              <Clock size={10} />
              {event.estimatedDuration}h
            </span>
            <span style={{ fontSize: '10px', color: '#10b981', fontWeight: '600' }}>
              {formatCurrency(event.cost)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => onEdit(event)}
            style={{
              width: '32px',
              height: '32px',
              padding: 0,
              backgroundColor: '#f3f4f6',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb';
              (e.currentTarget.firstChild as SVGElement).style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              (e.currentTarget.firstChild as SVGElement).style.color = 'inherit';
            }}
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(event.id)}
            style={{
              width: '32px',
              height: '32px',
              padding: 0,
              backgroundColor: '#f3f4f6',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#fecaca';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== CREATE EVENT MODAL ====================
interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Partial<MaintenanceEvent>) => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    truckName: '',
    type: 'ROUTINE' as MaintenanceType,
    priority: 'MEDIUM' as Priority,
    date: '',
    duration: '4',
    cost: '500',
    technician: '',
    description: ''
  });

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: '16px',
        backdropFilter: 'blur(4px)'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          animation: 'slideUp 0.3s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', margin: 0 }}>
            Schedule New Maintenance
          </h2>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              padding: 0,
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {/* Truck */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '6px', display: 'block' }}>Truck</label>
            <select
              value={formData.truckName}
              onChange={(e) => setFormData({ ...formData, truckName: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'inherit'
              }}
            >
              <option value="">Select truck</option>
              {['Truck-001', 'Truck-002', 'Truck-003', 'Truck-004'].map(truck => (
                <option key={truck} value={truck}>{truck}</option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '6px', display: 'block' }}>Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as MaintenanceType })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'inherit'
              }}
            >
              <option value="ROUTINE">Routine</option>
              <option value="REPAIR">Repair</option>
              <option value="INSPECTION">Inspection</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '6px', display: 'block' }}>Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'inherit'
              }}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '6px', display: 'block' }}>Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Duration */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '6px', display: 'block' }}>Duration (hours)</label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Cost */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '6px', display: 'block' }}>Cost</label>
            <input
              type="number"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Technician */}
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '6px', display: 'block' }}>Technician</label>
            <input
              type="text"
              value={formData.technician}
              onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
              placeholder="Technician name"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Description */}
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '6px', display: 'block' }}>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the maintenance task..."
              rows={3}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'none'
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '12px' }}>
          <button
            onClick={() => {
              onSave({
                ...formData,
                cost: parseInt(formData.cost, 10),
                estimatedDuration: parseInt(formData.duration, 10)
              });
              onClose();
            }}
            style={{
              flex: 1,
              padding: '10px 16px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 12px rgba(124, 58, 237, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Schedule
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '10px 16px',
              backgroundColor: 'white',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
          >
            Cancel
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================
const MaintenanceScheduler: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'calendar' | 'upcoming' | 'completed' | 'all'>('calendar');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Filter events
  const filteredEvents = useMemo(() => {
    let result = [...MOCK_EVENTS];

    if (activeTab === 'upcoming') {
      result = result.filter(e => e.status === 'SCHEDULED' || e.status === 'IN_PROGRESS');
    } else if (activeTab === 'completed') {
      result = result.filter(e => e.status === 'COMPLETED');
    }

    if (activeTab === 'calendar') {
      result = result.filter(e =>
        new Date(e.scheduledDate).toDateString() === selectedDate.toDateString()
      );
    }

    return result.sort((a, b) =>
      new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
    );
  }, [activeTab, selectedDate]);

  const stats = useMemo(() => ({
    total: MOCK_EVENTS.length,
    upcoming: MOCK_EVENTS.filter(e => e.status === 'SCHEDULED' || e.status === 'IN_PROGRESS').length,
    completed: MOCK_EVENTS.filter(e => e.status === 'COMPLETED').length,
    totalCost: MOCK_EVENTS.reduce((sum, e) => sum + e.cost, 0)
  }), []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      padding: '32px 24px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px', height: '48px',
            background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 6px rgba(124, 58, 237, 0.3)'
          }}>
            <Calendar size={24} style={{ color: 'white' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#111827', margin: 0 }}>
              Maintenance Scheduler
            </h1>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
              Plan and track fleet maintenance
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          style={{
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s',
            boxShadow: '0 4px 6px rgba(124, 58, 237, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 12px rgba(124, 58, 237, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(124, 58, 237, 0.2)';
          }}
        >
          <Plus size={16} />
          Schedule
        </button>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px',
        marginBottom: '24px'
      }}>
        {[
          { label: 'Total Tasks', value: stats.total, icon: '📋', color: '#3b82f6' },
          { label: 'Upcoming', value: stats.upcoming, icon: '📅', color: '#2563eb' },
          { label: 'Completed', value: stats.completed, icon: '✅', color: '#10b981' },
          { label: 'Total Cost', value: formatCurrency(stats.totalCost), icon: '💰', color: '#f59e0b' }
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              padding: '16px',
              textAlign: 'center',
              borderLeft: `4px solid ${stat.color}`,
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span style={{ fontSize: '28px', display: 'block', marginBottom: '8px' }}>{stat.icon}</span>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0', fontWeight: '500' }}>{stat.label}</p>
            <p style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: 0 }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        backgroundColor: 'white',
        padding: '8px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        width: 'fit-content'
      }}>
        {(['calendar', 'upcoming', 'completed', 'all'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 16px',
              backgroundColor: activeTab === tab ? '#7c3aed' : 'transparent',
              color: activeTab === tab ? 'white' : '#6b7280',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textTransform: 'capitalize'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab) {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            {tab === 'calendar' && '📅'}
            {tab === 'upcoming' && '📋'}
            {tab === 'completed' && '✅'}
            {tab === 'all' && '📊'}
            {' ' + tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'calendar' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Calendar */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: 0 }}>
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                  style={{
                    width: '32px',
                    height: '32px',
                    padding: 0,
                    backgroundColor: '#f3f4f6',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e5e7eb')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                  style={{
                    width: '32px',
                    height: '32px',
                    padding: 0,
                    backgroundColor: '#f3f4f6',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e5e7eb')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <CalendarGrid
              currentDate={currentDate}
              events={MOCK_EVENTS}
              onDateSelect={setSelectedDate}
            />
          </div>

          {/* Selected Date Events */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
            padding: '20px',
            height: 'fit-content'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', margin: '0 0 16px 0' }}>
              {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </h3>
            {filteredEvents.length === 0 ? (
              <p style={{ fontSize: '14px', color: '#6b7280', textAlign: 'center', padding: '32px 0' }}>
                No events scheduled
              </p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                {filteredEvents.map(evt => (
                  <EventCard
                    key={evt.id}
                    event={evt}
                    onEdit={(e) => console.log('Edit:', e)}
                    onDelete={(id) => console.log('Delete:', id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
          padding: '20px'
        }}>
          {filteredEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 24px' }}>
              <AlertCircle size={48} style={{ color: '#d1d5db', margin: '0 auto 16px', display: 'block' }} />
              <p style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
                No events found
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
              {filteredEvents.map(evt => (
                <EventCard
                  key={evt.id}
                  event={evt}
                  onEdit={(e) => console.log('Edit:', e)}
                  onDelete={(id) => console.log('Delete:', id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      <CreateEventModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={(event) => console.log('New event:', event)}
      />
    </div>
  );
};

export default MaintenanceScheduler;