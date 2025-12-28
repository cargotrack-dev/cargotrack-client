// src/features/Maintenance/components/MaintenanceDashboard.tsx
// 🎨 MODERNIZED - Professional UI/UX with inline styles

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface MaintenanceSchedule {
  id: string;
  truckId: string;
  truckName: string;
  type: 'ROUTINE' | 'REPAIR' | 'INSPECTION';
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  scheduledDate: string;
  estimatedDuration: number;
  cost: number;
  description: string;
  technician: string;
}

// Mock data
const MOCK_SCHEDULES: MaintenanceSchedule[] = [
  {
    id: '1',
    truckId: 'TRUCK-001',
    truckName: 'Mercedes Actros',
    type: 'ROUTINE',
    status: 'SCHEDULED',
    scheduledDate: '2024-01-28',
    estimatedDuration: 4,
    cost: 1500,
    description: 'Regular maintenance - oil change',
    technician: 'John Smith'
  },
  {
    id: '2',
    truckId: 'TRUCK-002',
    truckName: 'Volvo FH16',
    type: 'REPAIR',
    status: 'IN_PROGRESS',
    scheduledDate: '2024-01-25',
    estimatedDuration: 8,
    cost: 3200,
    description: 'Engine repair - alternator',
    technician: 'Mike Johnson'
  }
];

const MaintenanceDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [schedules] = useState<MaintenanceSchedule[]>(MOCK_SCHEDULES);

  // Calculate statistics
  const stats = {
    total: schedules.length,
    upcoming: schedules.filter(s => s.status === 'SCHEDULED').length,
    overdue: schedules.filter(s => s.status !== 'COMPLETED' && new Date(s.scheduledDate) < new Date()).length,
    inProgress: schedules.filter(s => s.status === 'IN_PROGRESS').length
  };

  return (
    <div style={{
      padding: '24px',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #f0f2f7 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* ════════════════════════════════════════════════════════════════ */}
      {/* HEADER */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '8px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              boxShadow: '0 8px 16px rgba(234, 88, 12, 0.25)',
              color: 'white'
            }}>
              🔧
            </div>
            <div>
              <h1 style={{
                fontSize: '32px',
                fontWeight: '800',
                color: '#111827',
                margin: 0,
                letterSpacing: '-0.5px'
              }}>
                Maintenance Dashboard
              </h1>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: '4px 0 0 0',
                fontWeight: '500'
              }}>
                Complete maintenance scheduling & tracking
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              backgroundColor: '#ffffff',
              color: '#111827',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#ea580c';
              e.currentTarget.style.color = '#ea580c';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(234, 88, 12, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.color = '#111827';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
            }}
          >
            🔄 Refresh
          </button>

          <button
            onClick={() => navigate('/maintenance/schedule/new')}
            style={{
              padding: '12px 28px',
              background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '14px',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 8px 20px rgba(234, 88, 12, 0.3)',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(234, 88, 12, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(234, 88, 12, 0.3)';
            }}
          >
            ➕ New Schedule
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* KPI CARDS */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        {/* Total Schedules */}
        <div style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(59, 130, 246, 0.2)',
          color: 'white',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 16px 40px rgba(59, 130, 246, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.2)';
        }}
        >
          {/* Background accent */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            zIndex: 0
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start',
              marginBottom: '16px'
            }}>
              <span style={{ fontSize: '12px', fontWeight: '600', opacity: 0.9 }}>Total Schedules</span>
              <span style={{ fontSize: '24px' }}>📋</span>
            </div>
            <div style={{
              fontSize: '40px',
              fontWeight: '800',
              marginBottom: '8px',
              letterSpacing: '-1px'
            }}>
              {stats.total}
            </div>
            <div style={{
              fontSize: '12px',
              opacity: 0.9,
              fontWeight: '500'
            }}>
              All maintenance schedules
            </div>
          </div>
        </div>

        {/* Upcoming */}
        <div style={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(139, 92, 246, 0.2)',
          color: 'white',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 16px 40px rgba(139, 92, 246, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 10px 30px rgba(139, 92, 246, 0.2)';
        }}
        >
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            zIndex: 0
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start',
              marginBottom: '16px'
            }}>
              <span style={{ fontSize: '12px', fontWeight: '600', opacity: 0.9 }}>Upcoming</span>
              <span style={{ fontSize: '24px' }}>📅</span>
            </div>
            <div style={{
              fontSize: '40px',
              fontWeight: '800',
              marginBottom: '8px',
              letterSpacing: '-1px'
            }}>
              {stats.upcoming}
            </div>
            <div style={{
              fontSize: '12px',
              opacity: 0.9,
              fontWeight: '500'
            }}>
              Scheduled for later
            </div>
          </div>
        </div>

        {/* In Progress */}
        <div style={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(245, 158, 11, 0.2)',
          color: 'white',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 16px 40px rgba(245, 158, 11, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 10px 30px rgba(245, 158, 11, 0.2)';
        }}
        >
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            zIndex: 0
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start',
              marginBottom: '16px'
            }}>
              <span style={{ fontSize: '12px', fontWeight: '600', opacity: 0.9 }}>In Progress</span>
              <span style={{ fontSize: '24px' }}>⚙️</span>
            </div>
            <div style={{
              fontSize: '40px',
              fontWeight: '800',
              marginBottom: '8px',
              letterSpacing: '-1px'
            }}>
              {stats.inProgress}
            </div>
            <div style={{
              fontSize: '12px',
              opacity: 0.9,
              fontWeight: '500'
            }}>
              Currently being worked on
            </div>
          </div>
        </div>

        {/* Overdue */}
        <div style={{
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(239, 68, 68, 0.2)',
          color: 'white',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 16px 40px rgba(239, 68, 68, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 10px 30px rgba(239, 68, 68, 0.2)';
        }}
        >
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            zIndex: 0
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start',
              marginBottom: '16px'
            }}>
              <span style={{ fontSize: '12px', fontWeight: '600', opacity: 0.9 }}>Overdue</span>
              <span style={{ fontSize: '24px' }}>🚨</span>
            </div>
            <div style={{
              fontSize: '40px',
              fontWeight: '800',
              marginBottom: '8px',
              letterSpacing: '-1px'
            }}>
              {stats.overdue}
            </div>
            <div style={{
              fontSize: '12px',
              opacity: 0.9,
              fontWeight: '500'
            }}>
              Past scheduled dates
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* RECENT SCHEDULES */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
        border: '1px solid #e5e7eb'
      }}>
        {/* Section Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #f3f4f6',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#111827',
              margin: 0,
              marginBottom: '4px'
            }}>
              Recent Schedules
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: 0,
              fontWeight: '500'
            }}>
              Latest maintenance activities
            </p>
          </div>
          <button
            onClick={() => navigate('/maintenance/list')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f3f4f6',
              color: '#111827',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
              transition: 'all 0.2s',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ea580c';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.color = '#111827';
            }}
          >
            View All →
          </button>
        </div>

        {/* Schedules List */}
        <div style={{
          padding: '24px'
        }}>
          {schedules.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#6b7280'
            }}>
              <p style={{ fontSize: '16px', margin: 0 }}>No schedules found</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {schedules.map((schedule) => (
                <div
                  key={schedule.id}
                  style={{
                    padding: '16px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0f9ff';
                    e.currentTarget.style.borderColor = '#ea580c';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div>
                    <h3 style={{
                      fontSize: '15px',
                      fontWeight: '700',
                      color: '#111827',
                      margin: '0 0 4px 0'
                    }}>
                      {schedule.truckName}
                    </h3>
                    <p style={{
                      fontSize: '13px',
                      color: '#6b7280',
                      margin: '0 0 8px 0'
                    }}>
                      {schedule.description}
                    </p>
                    <div style={{
                      display: 'flex',
                      gap: '12px',
                      fontSize: '12px',
                      color: '#4b5563'
                    }}>
                      <span>📅 {new Date(schedule.scheduledDate).toLocaleDateString()}</span>
                      <span>👤 {schedule.technician}</span>
                      <span>💰 ${schedule.cost}</span>
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '8px'
                  }}>
                    <span style={{
                      padding: '6px 12px',
                      backgroundColor: schedule.status === 'IN_PROGRESS' ? '#fef3c7' :
                        schedule.status === 'SCHEDULED' ? '#dbeafe' : '#dcfce7',
                      color: schedule.status === 'IN_PROGRESS' ? '#92400e' :
                        schedule.status === 'SCHEDULED' ? '#1e40af' : '#166534',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {schedule.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaintenanceDashboard;