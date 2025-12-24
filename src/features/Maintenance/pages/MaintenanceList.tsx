// src/features/Maintenance/pages/MaintenanceList.tsx
// 🚀 FULLY MODERNIZED - with Fully Integrated Calendar

import React, { useState, useMemo } from 'react';
import { Plus, Wrench } from 'lucide-react';

// ==================== TYPES ====================
type MaintenanceStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
type MaintenanceType = 'ROUTINE' | 'REPAIR' | 'INSPECTION';

interface MaintenanceRecord {
  id: string;
  truckId: string;
  truckName: string;
  type: MaintenanceType;
  status: MaintenanceStatus;
  scheduledDate: string;
  estimatedDuration: number;
  cost: number;
  description: string;
  technician: string;
}

interface StatusStyle {
  icon: string;
  bgColor: string;
  textColor: string;
  badgeBg: string;
}

interface TypeStyle {
  icon: string;
  label: string;
}

// ==================== MOCK DATA ====================
const MOCK_RECORDS: MaintenanceRecord[] = [
  {
    id: 'm1', truckId: 't1', truckName: 'Truck-001', type: 'ROUTINE', status: 'COMPLETED',
    scheduledDate: '2025-01-20', estimatedDuration: 3, cost: 450,
    description: 'Oil change and filter replacement', technician: 'Mike Johnson'
  },
  {
    id: 'm2', truckId: 't2', truckName: 'Truck-002', type: 'REPAIR', status: 'IN_PROGRESS',
    scheduledDate: '2025-01-24', estimatedDuration: 8, cost: 1200,
    description: 'Brake system overhaul', technician: 'Sarah Davis'
  },
  {
    id: 'm3', truckId: 't3', truckName: 'Truck-003', type: 'INSPECTION', status: 'SCHEDULED',
    scheduledDate: '2025-01-26', estimatedDuration: 2, cost: 150,
    description: 'Annual safety inspection', technician: 'Bob Wilson'
  },
  {
    id: 'm4', truckId: 't5', truckName: 'Truck-005', type: 'ROUTINE', status: 'CANCELLED',
    scheduledDate: '2025-01-17', estimatedDuration: 3, cost: 300,
    description: 'Tire rotation and balance', technician: 'Jane Smith'
  },
  {
    id: 'm5', truckId: 't4', truckName: 'Truck-004', type: 'REPAIR', status: 'SCHEDULED',
    scheduledDate: '2025-02-01', estimatedDuration: 6, cost: 800,
    description: 'Engine coolant flush', technician: 'Mike Johnson'
  },
  {
    id: 'm6', truckId: 't6', truckName: 'Truck-006', type: 'INSPECTION', status: 'SCHEDULED',
    scheduledDate: '2025-02-05', estimatedDuration: 2, cost: 150,
    description: 'Safety inspection', technician: 'Sarah Davis'
  }
];

// ==================== STYLES & CONFIGS ====================
const formatCurrency = (amount: number): string => `$${amount.toLocaleString()}`;
const formatDate = (dateStr: string): string => new Date(dateStr).toLocaleDateString('en-US', {
  month: 'short', day: 'numeric', year: 'numeric'
});

const STATUS_STYLES: Record<MaintenanceStatus, StatusStyle> = {
  SCHEDULED: { icon: '📅', bgColor: '#eff6ff', textColor: '#1e40af', badgeBg: '#dbeafe' },
  IN_PROGRESS: { icon: '⚙️', bgColor: '#fffbeb', textColor: '#92400e', badgeBg: '#fef3c7' },
  COMPLETED: { icon: '✅', bgColor: '#f0fdf4', textColor: '#166534', badgeBg: '#dcfce7' },
  CANCELLED: { icon: '❌', bgColor: '#f3f4f6', textColor: '#374151', badgeBg: '#e5e7eb' }
};

const TYPE_STYLES: Record<MaintenanceType, TypeStyle> = {
  ROUTINE: { icon: '🔄', label: 'Routine' },
  REPAIR: { icon: '🔧', label: 'Repair' },
  INSPECTION: { icon: '🔍', label: 'Inspection' }
};

// ==================== CALENDAR COMPONENT ====================
interface CalendarGridProps {
  currentDate: Date;
  events: MaintenanceRecord[];
  onDateSelect: (date: Date) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ currentDate, events, onDateSelect }) => {
  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const days = [];
  const current = new Date(startDate);
  while (current <= monthEnd) {
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

// ==================== MAINTENANCE SCHEDULER MODAL ====================
interface SchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MaintenanceSchedulerModal: React.FC<SchedulerModalProps> = ({ isOpen, onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formData, setFormData] = useState({
    truck: '', type: 'ROUTINE', priority: 'MEDIUM',
    date: '', technician: '', cost: ''
  });

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 50, padding: '16px', backdropFilter: 'blur(4px)'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white', borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          width: '95vw', maxWidth: '1200px', maxHeight: '90vh',
          overflow: 'auto', animation: 'slideUp 0.3s ease-out',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            width: '40px', height: '40px', padding: 0,
            backgroundColor: 'white', border: '1px solid #e5e7eb',
            borderRadius: '8px', cursor: 'pointer', fontSize: '20px',
            fontWeight: 'bold', color: '#6b7280',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10, transition: 'all 0.2s',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
            e.currentTarget.style.borderColor = '#d1d5db';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.borderColor = '#e5e7eb';
          }}
        >
          ✕
        </button>

        {/* Header */}
        <div style={{ padding: '32px 24px 0' }}>
          <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px', height: '48px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
              borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 6px rgba(124, 58, 237, 0.3)', fontSize: '24px'
            }}>
              📅
            </div>
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', margin: 0 }}>
                Maintenance Scheduler
              </h2>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
                Plan and track fleet maintenance with interactive calendar
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '0 24px 32px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Calendar Section */}
          <div style={{
            backgroundColor: '#f9fafb', borderRadius: '12px', padding: '20px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: 0 }}>
                📆 {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                  style={{
                    width: '32px', height: '32px', padding: 0,
                    backgroundColor: '#f3f4f6', border: 'none', borderRadius: '6px',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e5e7eb')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                >
                  ◀
                </button>
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                  style={{
                    width: '32px', height: '32px', padding: 0,
                    backgroundColor: '#f3f4f6', border: 'none', borderRadius: '6px',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e5e7eb')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                >
                  ▶
                </button>
              </div>
            </div>
            <CalendarGrid
              currentDate={currentDate}
              events={MOCK_RECORDS}
              onDateSelect={setSelectedDate}
            />
          </div>

          {/* Quick Schedule Form */}
          <div style={{
            backgroundColor: '#f9fafb', borderRadius: '12px', padding: '20px',
            border: '1px solid #e5e7eb', height: 'fit-content'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: '0 0 16px 0' }}>
              ➕ Quick Schedule
            </h3>
            <form style={{ display: 'grid', gap: '12px' }}>
              {/* Truck */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '4px', display: 'block' }}>
                  🚛 Truck
                </label>
                <select
                  value={formData.truck}
                  onChange={(e) => setFormData({ ...formData, truck: e.target.value })}
                  style={{
                    width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb',
                    borderRadius: '6px', fontSize: '13px', fontFamily: 'inherit'
                  }}
                >
                  <option value="">Select</option>
                  {['Truck-001', 'Truck-002', 'Truck-003', 'Truck-004', 'Truck-005', 'Truck-006'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '4px', display: 'block' }}>
                  🔧 Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  style={{
                    width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb',
                    borderRadius: '6px', fontSize: '13px', fontFamily: 'inherit'
                  }}
                >
                  <option value="ROUTINE">🔄 Routine</option>
                  <option value="REPAIR">🔧 Repair</option>
                  <option value="INSPECTION">🔍 Inspection</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '4px', display: 'block' }}>
                  🎯 Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  style={{
                    width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb',
                    borderRadius: '6px', fontSize: '13px', fontFamily: 'inherit'
                  }}
                >
                  <option value="LOW">🟢 Low</option>
                  <option value="MEDIUM">🟡 Medium</option>
                  <option value="HIGH">🟠 High</option>
                  <option value="CRITICAL">🔴 Critical</option>
                </select>
              </div>

              {/* Date */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '4px', display: 'block' }}>
                  📅 Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  style={{
                    width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb',
                    borderRadius: '6px', fontSize: '13px', fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Technician */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '4px', display: 'block' }}>
                  👤 Technician
                </label>
                <input
                  type="text"
                  value={formData.technician}
                  onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
                  placeholder="Name"
                  style={{
                    width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb',
                    borderRadius: '6px', fontSize: '13px', fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Cost */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '4px', display: 'block' }}>
                  💰 Cost ($)
                </label>
                <input
                  type="number"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  placeholder="0"
                  style={{
                    width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb',
                    borderRadius: '6px', fontSize: '13px', fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Schedule Button */}
              <button
                type="button"
                onClick={() => {
                  console.log('Maintenance scheduled:', { ...formData, date: selectedDate });
                  onClose();
                }}
                style={{
                  width: '100%', padding: '10px 16px',
                  background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                  color: 'white', border: 'none', borderRadius: '8px',
                  fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                  transition: 'all 0.2s', marginTop: '8px'
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
                📅 Schedule
              </button>
            </form>

            {/* Selected Date Info */}
            <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#eff6ff', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
              <p style={{ fontSize: '12px', fontWeight: '600', color: '#1e40af', margin: 0 }}>
                📅 Selected: {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

// ==================== DETAIL MODAL ====================
interface DetailModalProps {
  record: MaintenanceRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (record: MaintenanceRecord) => void;
  onDelete: (id: string) => void;
}

const MaintenanceDetailModal: React.FC<DetailModalProps> = ({ record, isOpen, onClose, onEdit, onDelete }) => {
  if (!isOpen || !record) return null;

  const status = STATUS_STYLES[record.status];
  const type = TYPE_STYLES[record.type];

  return (
    <div
      style={{
        position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 40, backdropFilter: 'blur(4px)'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white', borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxWidth: '500px', width: '90vw', maxHeight: '90vh',
          overflow: 'auto', animation: 'slideUp 0.3s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          padding: '24px', borderBottom: '1px solid #e5e7eb',
          background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
          color: 'white', borderRadius: '16px 16px 0 0'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 8px 0' }}>
            {status.icon} {record.truckName}
          </h2>
          <p style={{ fontSize: '14px', opacity: 0.9, margin: 0 }}>
            {type.icon} {type.label}
          </p>
        </div>

        <div style={{ padding: '24px', display: 'grid', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Status</label>
            <p style={{ fontSize: '16px', fontWeight: '600', 
              backgroundColor: status.badgeBg, color: status.textColor,
              padding: '6px 12px', borderRadius: '20px', display: 'inline-block', margin: '4px 0 0 0'
            }}>
              {status.icon} {record.status}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>📅 Date</label>
              <p style={{ fontSize: '14px', color: '#111827', margin: '4px 0 0 0', fontWeight: '500' }}>
                {formatDate(record.scheduledDate)}
              </p>
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>⏱️ Duration</label>
              <p style={{ fontSize: '14px', color: '#111827', margin: '4px 0 0 0', fontWeight: '500' }}>
                {record.estimatedDuration}h
              </p>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>💰 Cost</label>
            <p style={{ fontSize: '16px', fontWeight: '700', color: '#10b981', margin: '4px 0 0 0' }}>
              {formatCurrency(record.cost)}
            </p>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>👤 Technician</label>
            <p style={{ fontSize: '14px', color: '#111827', margin: '4px 0 0 0', fontWeight: '500' }}>
              {record.technician}
            </p>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>📝 Description</label>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0', lineHeight: '1.5' }}>
              {record.description}
            </p>
          </div>
        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '12px' }}>
          <button
            onClick={() => {
              onEdit(record);
              onClose();
            }}
            style={{
              flex: 1, padding: '10px 16px',
              backgroundColor: '#f3f4f6', color: '#111827',
              border: '1px solid #d1d5db', borderRadius: '8px',
              fontSize: '14px', fontWeight: '600', cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e5e7eb')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => {
              onDelete(record.id);
              onClose();
            }}
            style={{
              flex: 1, padding: '10px 16px',
              backgroundColor: '#fee2e2', color: '#dc2626',
              border: '1px solid #fecaca', borderRadius: '8px',
              fontSize: '14px', fontWeight: '600', cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fecaca')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fee2e2')}
          >
            🗑️ Delete
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '10px 16px',
              backgroundColor: '#dbeafe', color: '#1e40af',
              border: '1px solid #bfdbfe', borderRadius: '8px',
              fontSize: '14px', fontWeight: '600', cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#bfdbfe')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#dbeafe')}
          >
            Close
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================
const MaintenanceList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | MaintenanceStatus>('all');
  const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'cost'>('date');

  // Filter & sort records
  const filteredRecords = useMemo(() => {
    let result = MOCK_RECORDS;

    if (statusFilter !== 'all') {
      result = result.filter(r => r.status === statusFilter);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r =>
        r.truckName.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.technician.toLowerCase().includes(q)
      );
    }

    return result.sort((a, b) =>
      sortBy === 'date'
        ? new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
        : a.cost - b.cost
    );
  }, [searchQuery, statusFilter, sortBy]);

  // Calculate stats
  const stats = useMemo(() => ({
    total: MOCK_RECORDS.length,
    scheduled: MOCK_RECORDS.filter(r => r.status === 'SCHEDULED').length,
    inProgress: MOCK_RECORDS.filter(r => r.status === 'IN_PROGRESS').length,
    overdue: MOCK_RECORDS.filter(r => r.status === 'SCHEDULED' && new Date(r.scheduledDate) < new Date()).length,
    totalCost: MOCK_RECORDS.reduce((sum, r) => sum + r.cost, 0)
  }), []);

  const handleEdit = (record: MaintenanceRecord) => {
    console.log('Edit record:', record);
  };

  const handleDelete = (id: string) => {
    console.log('Delete record:', id);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      padding: '32px 24px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
          <div style={{
            width: '56px', height: '56px',
            background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
            borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 6px rgba(234, 88, 12, 0.3)'
          }}>
            <Wrench size={28} style={{ color: 'white' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#111827', margin: 0 }}>
              Maintenance Schedule
            </h1>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
              Fleet maintenance records and tracking
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '12px',
        marginBottom: '24px'
      }}>
        {[
          { label: 'Total Records', value: stats.total, icon: '📋', color: '#3b82f6' },
          { label: 'Scheduled', value: stats.scheduled, icon: '📅', color: '#2563eb' },
          { label: 'In Progress', value: stats.inProgress, icon: '⚙️', color: '#f59e0b' },
          { label: 'Overdue', value: stats.overdue, icon: '⚠️', color: '#ef4444' },
          { label: 'Total Cost', value: formatCurrency(stats.totalCost), icon: '💰', color: '#10b981' }
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
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0', fontWeight: '500' }}>
              {stat.label}
            </p>
            <p style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: 0 }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        padding: '16px',
        marginBottom: '24px',
        display: 'grid',
        gridTemplateColumns: '1fr auto auto',
        gap: '12px',
        alignItems: 'center'
      }}>
        {/* Search */}
        <input
          type="text"
          placeholder="Search trucks, description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: '10px 14px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'inherit'
          }}
        />

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | MaintenanceStatus)}
          style={{
            padding: '10px 14px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'inherit',
            minWidth: '140px'
          }}
        >
          <option value="all">All Status</option>
          <option value="SCHEDULED">📅 Scheduled</option>
          <option value="IN_PROGRESS">⚙️ In Progress</option>
          <option value="COMPLETED">✅ Completed</option>
          <option value="CANCELLED">❌ Cancelled</option>
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'date' | 'cost')}
          style={{
            padding: '10px 14px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'inherit',
            minWidth: '140px'
          }}
        >
          <option value="date">Sort by Date</option>
          <option value="cost">Sort by Cost</option>
        </select>
      </div>

      {/* Add Button */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => setIsSchedulerOpen(true)}
          style={{
            width: '100%',
            padding: '16px',
            background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            transition: 'all 0.3s',
            boxShadow: '0 4px 6px rgba(234, 88, 12, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 12px rgba(234, 88, 12, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(234, 88, 12, 0.2)';
          }}
        >
          <Plus size={20} />
          New Maintenance
        </button>
      </div>

      {/* Records List */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
        {filteredRecords.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '48px 24px',
            backgroundColor: 'white', borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <Wrench size={48} style={{ color: '#d1d5db', margin: '0 auto 16px', display: 'block' }} />
            <p style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
              No maintenance records found
            </p>
          </div>
        ) : (
          filteredRecords.map(record => {
            const status = STATUS_STYLES[record.status];
            const type = TYPE_STYLES[record.type];

            return (
              <button
                key={record.id}
                onClick={() => {
                  setSelectedRecord(record);
                  setIsDetailOpen(true);
                }}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  padding: '16px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left',
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr auto',
                  gap: '16px',
                  alignItems: 'start'
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
                {/* Icon */}
                <div style={{ fontSize: '32px', marginTop: '4px' }}>
                  {type.icon}
                </div>

                {/* Content */}
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', margin: '0 0 8px 0' }}>
                    {record.truckName}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0' }}>
                    {record.description}
                  </p>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{
                      backgroundColor: status.badgeBg,
                      color: status.textColor,
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {status.icon} {record.status}
                    </span>
                    <span style={{ fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      📅 {formatDate(record.scheduledDate)}
                    </span>
                    <span style={{ fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      ⏱️ {record.estimatedDuration}h
                    </span>
                    <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '600' }}>
                      💰 {formatCurrency(record.cost)}
                    </span>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
                      👤 {record.technician}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '20px', marginRight: '8px' }}>▶</span>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Modals */}
      <MaintenanceDetailModal
        record={selectedRecord}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <MaintenanceSchedulerModal
        isOpen={isSchedulerOpen}
        onClose={() => setIsSchedulerOpen(false)}
      />

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default MaintenanceList;