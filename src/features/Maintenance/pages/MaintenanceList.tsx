// src/features/Maintenance/pages/MaintenanceList.tsx
// 🎨 FULLY MODERNIZED - Professional UI/UX with inline styles

import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface MaintenanceRecord {
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

const MOCK_RECORDS: MaintenanceRecord[] = [
  {
    id: '1',
    truckId: 'TRUCK-001',
    truckName: 'Mercedes Actros',
    type: 'ROUTINE',
    status: 'SCHEDULED',
    scheduledDate: '2024-01-28',
    estimatedDuration: 4,
    cost: 1500,
    description: 'Regular maintenance - oil change, filter replacement',
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
    description: 'Engine repair - alternator replacement',
    technician: 'Mike Johnson'
  },
  {
    id: '3',
    truckId: 'TRUCK-003',
    truckName: 'Scania R440',
    type: 'INSPECTION',
    status: 'COMPLETED',
    scheduledDate: '2024-01-20',
    estimatedDuration: 2,
    cost: 800,
    description: 'Safety inspection - brakes, lights, tires',
    technician: 'Sarah Davis'
  },
  {
    id: '4',
    truckId: 'TRUCK-004',
    truckName: 'DAF XF',
    type: 'ROUTINE',
    status: 'SCHEDULED',
    scheduledDate: '2024-01-30',
    estimatedDuration: 3,
    cost: 1200,
    description: 'Preventive maintenance - cooling system flush',
    technician: 'John Smith'
  }
];

const STATUS_STYLES = {
  SCHEDULED: { icon: '📅', bgColor: '#eff6ff', textColor: '#1e40af', badgeBg: '#dbeafe', gradientBg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' },
  IN_PROGRESS: { icon: '⚙️', bgColor: '#fffbeb', textColor: '#92400e', badgeBg: '#fef3c7', gradientBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
  COMPLETED: { icon: '✅', bgColor: '#f0fdf4', textColor: '#166534', badgeBg: '#dcfce7', gradientBg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
  CANCELLED: { icon: '❌', bgColor: '#f3f4f6', textColor: '#374151', badgeBg: '#e5e7eb', gradientBg: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)' }
};

export const MaintenanceList: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'cost'>('date');
  const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredRecords = useMemo(() => {
    const result = MOCK_RECORDS.filter(record => {
      const matchesSearch = searchQuery.toLowerCase() === '' ||
        record.truckName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.technician.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || record.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    result.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime();
      } else {
        return b.cost - a.cost;
      }
    });

    return result;
  }, [searchQuery, statusFilter, sortBy]);

  const stats = useMemo(() => {
    const total = MOCK_RECORDS.length;
    const scheduled = MOCK_RECORDS.filter(r => r.status === 'SCHEDULED').length;
    const inProgress = MOCK_RECORDS.filter(r => r.status === 'IN_PROGRESS').length;
    const overdue = MOCK_RECORDS.filter(r => 
      r.status !== 'COMPLETED' && new Date(r.scheduledDate) < new Date()
    ).length;
    const totalCost = MOCK_RECORDS.reduce((sum, r) => sum + r.cost, 0);

    return { total, scheduled, inProgress, overdue, totalCost };
  }, []);

  return (
    <div style={{
      padding: '32px',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #f0f2f7 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* ════════════════════════════════════════════════════════════════ */}
      {/* HEADER WITH TITLE & ACTIONS */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '12px'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              boxShadow: '0 10px 28px rgba(234, 88, 12, 0.3)',
              color: 'white'
            }}>
              🔧
            </div>
            <div>
              <h1 style={{
                fontSize: '36px',
                fontWeight: '900',
                color: '#111827',
                margin: 0,
                letterSpacing: '-0.8px'
              }}>
                Maintenance Management
              </h1>
              <p style={{
                fontSize: '15px',
                color: '#6b7280',
                margin: '6px 0 0 0',
                fontWeight: '500'
              }}>
                Track and manage all maintenance schedules
              </p>
            </div>
          </div>
        </div>

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
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '14px',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#ea580c';
              e.currentTarget.style.color = '#ea580c';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(234, 88, 12, 0.15)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.color = '#111827';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            🔄 Refresh
          </button>

          <button
            onClick={() => navigate('/maintenance/scheduler')}
            style={{
              padding: '12px 28px',
              background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '800',
              fontSize: '14px',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 10px 28px rgba(234, 88, 12, 0.35)',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 14px 36px rgba(234, 88, 12, 0.45)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 28px rgba(234, 88, 12, 0.35)';
            }}
          >
            ➕ New Maintenance
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* KPI STATISTICS CARDS */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '24px',
        marginBottom: '40px'
      }}>
        {[
          { label: 'Total Records', value: stats.total, icon: '📋', gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', shadow: 'rgba(59, 130, 246, 0.25)' },
          { label: 'Scheduled', value: stats.scheduled, icon: '📅', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', shadow: 'rgba(139, 92, 246, 0.25)' },
          { label: 'In Progress', value: stats.inProgress, icon: '⚙️', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', shadow: 'rgba(245, 158, 11, 0.25)' },
          { label: 'Overdue', value: stats.overdue, icon: '🚨', gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', shadow: 'rgba(239, 68, 68, 0.25)' },
          { label: 'Total Cost', value: `$${stats.totalCost.toLocaleString()}`, icon: '💰', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', shadow: 'rgba(16, 185, 129, 0.25)' }
        ].map((stat, i) => (
          <div key={i} style={{
            background: stat.gradient,
            padding: '28px',
            borderRadius: '14px',
            boxShadow: `0 12px 32px ${stat.shadow}`,
            color: 'white',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-6px)';
            e.currentTarget.style.boxShadow = `0 18px 48px ${stat.shadow}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = `0 12px 32px ${stat.shadow}`;
          }}
          >
            {/* Background accent */}
            <div style={{
              position: 'absolute',
              top: '-60px',
              right: '-60px',
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              zIndex: 0
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: '18px'
              }}>
                <span style={{
                  fontSize: '13px',
                  fontWeight: '700',
                  opacity: 0.95,
                  letterSpacing: '0.5px'
                }}>
                  {stat.label.toUpperCase()}
                </span>
                <span style={{ fontSize: '32px' }}>{stat.icon}</span>
              </div>
              <div style={{
                fontSize: '44px',
                fontWeight: '900',
                marginBottom: '10px',
                letterSpacing: '-1.5px',
                lineHeight: '1'
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '13px',
                opacity: 0.92,
                fontWeight: '600'
              }}>
                {stat.label.toLowerCase()} metrics
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* FILTERS & SEARCH */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
        marginBottom: '28px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        border: '1px solid #e5e7eb'
      }}>
        <input
          type="text"
          placeholder="🔍 Search trucks, technician, description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: '12px 16px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'inherit',
            outline: 'none',
            transition: 'all 0.3s',
            backgroundColor: '#f8fafc'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#ea580c';
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(234, 88, 12, 0.1)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.backgroundColor = '#f8fafc';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '12px 16px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'inherit',
            outline: 'none',
            transition: 'all 0.3s',
            backgroundColor: '#f8fafc',
            cursor: 'pointer'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#ea580c';
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(234, 88, 12, 0.1)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.backgroundColor = '#f8fafc';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <option value="all">All Status</option>
          <option value="SCHEDULED">📅 Scheduled</option>
          <option value="IN_PROGRESS">⚙️ In Progress</option>
          <option value="COMPLETED">✅ Completed</option>
          <option value="CANCELLED">❌ Cancelled</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'date' | 'cost')}
          style={{
            padding: '12px 16px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'inherit',
            outline: 'none',
            transition: 'all 0.3s',
            backgroundColor: '#f8fafc',
            cursor: 'pointer'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#ea580c';
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(234, 88, 12, 0.1)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.backgroundColor = '#f8fafc';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <option value="date">Sort by Date</option>
          <option value="cost">Sort by Cost</option>
        </select>
      </div>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* RECORDS LIST */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '16px'
      }}>
        {filteredRecords.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            padding: '60px 40px',
            borderRadius: '12px',
            textAlign: 'center',
            color: '#6b7280',
            border: '2px dashed #e5e7eb'
          }}>
            <p style={{ fontSize: '18px', margin: 0, fontWeight: '600' }}>No records found</p>
          </div>
        ) : (
          filteredRecords.map((record) => {
            const status = STATUS_STYLES[record.status];
            return (
              <div
                key={record.id}
                onClick={() => {
                  setSelectedRecord(record);
                  setIsDetailOpen(true);
                }}
                style={{
                  background: 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '2px solid #e5e7eb',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '20px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(234, 88, 12, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = '#ea580c';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '10px'
                  }}>
                    <span style={{ fontSize: '24px' }}>{status.icon}</span>
                    <h3 style={{
                      fontSize: '17px',
                      fontWeight: '800',
                      color: '#111827',
                      margin: 0
                    }}>
                      {record.truckName}
                    </h3>
                    <span style={{
                      background: status.badgeBg,
                      color: status.textColor,
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '700',
                      letterSpacing: '0.3px'
                    }}>
                      {record.status}
                    </span>
                  </div>
                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    margin: '0 0 12px 0',
                    fontWeight: '500'
                  }}>
                    {record.description}
                  </p>
                  <div style={{
                    display: 'flex',
                    gap: '20px',
                    fontSize: '13px',
                    color: '#4b5563',
                    flexWrap: 'wrap'
                  }}>
                    <span>📅 {new Date(record.scheduledDate).toLocaleDateString()}</span>
                    <span>⏱️ {record.estimatedDuration}h</span>
                    <span>👤 {record.technician}</span>
                  </div>
                </div>
                <div style={{
                  textAlign: 'right',
                  minWidth: '120px',
                  padding: '16px',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f3f4f6 100%)',
                  borderRadius: '10px'
                }}>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: '900',
                    color: status.textColor,
                    marginBottom: '4px',
                    letterSpacing: '-0.5px'
                  }}>
                    ${record.cost}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    fontWeight: '600'
                  }}>
                    Total cost
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* DETAIL MODAL */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {isDetailOpen && selectedRecord && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 40,
          backdropFilter: 'blur(4px)'
        }} onClick={() => setIsDetailOpen(false)}>
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '40px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '85vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
              animation: 'slideUp 0.3s ease'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              paddingBottom: '16px',
              borderBottom: '2px solid #f3f4f6'
            }}>
              <h2 style={{
                margin: 0,
                fontSize: '24px',
                fontWeight: '900',
                color: '#111827'
              }}>
                Maintenance Details
              </h2>
              <button
                onClick={() => setIsDetailOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '28px',
                  cursor: 'pointer',
                  color: '#6b7280',
                  transition: 'all 0.2s',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.color = '#111827';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#6b7280';
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
              <div style={{
                padding: '16px',
                backgroundColor: '#f8fafc',
                borderRadius: '10px',
                borderLeft: '4px solid #ea580c'
              }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#6b7280',
                  marginBottom: '6px',
                  letterSpacing: '0.5px'
                }}>
                  TRUCK
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '800',
                  color: '#111827'
                }}>
                  {selectedRecord.truckName}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '10px'
                }}>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#6b7280',
                    marginBottom: '6px'
                  }}>
                    TYPE
                  </div>
                  <div style={{
                    fontSize: '15px',
                    fontWeight: '700',
                    color: '#111827'
                  }}>
                    {selectedRecord.type}
                  </div>
                </div>
                <div style={{
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '10px'
                }}>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#6b7280',
                    marginBottom: '6px'
                  }}>
                    STATUS
                  </div>
                  <div style={{
                    fontSize: '15px',
                    fontWeight: '700',
                    color: STATUS_STYLES[selectedRecord.status].textColor
                  }}>
                    {selectedRecord.status}
                  </div>
                </div>
              </div>

              <div style={{
                padding: '16px',
                backgroundColor: '#f8fafc',
                borderRadius: '10px'
              }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#6b7280',
                  marginBottom: '6px'
                }}>
                  DESCRIPTION
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#111827',
                  lineHeight: '1.6'
                }}>
                  {selectedRecord.description}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '10px'
                }}>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#6b7280',
                    marginBottom: '6px'
                  }}>
                    TECHNICIAN
                  </div>
                  <div style={{
                    fontSize: '15px',
                    fontWeight: '700',
                    color: '#111827'
                  }}>
                    {selectedRecord.technician}
                  </div>
                </div>
                <div style={{
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '10px'
                }}>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#6b7280',
                    marginBottom: '6px'
                  }}>
                    COST
                  </div>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: '800',
                    color: '#ea580c'
                  }}>
                    ${selectedRecord.cost.toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '10px'
                }}>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#6b7280',
                    marginBottom: '6px'
                  }}>
                    SCHEDULED DATE
                  </div>
                  <div style={{
                    fontSize: '15px',
                    fontWeight: '700',
                    color: '#111827'
                  }}>
                    {new Date(selectedRecord.scheduledDate).toLocaleDateString()}
                  </div>
                </div>
                <div style={{
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '10px'
                }}>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#6b7280',
                    marginBottom: '6px'
                  }}>
                    DURATION
                  </div>
                  <div style={{
                    fontSize: '15px',
                    fontWeight: '700',
                    color: '#111827'
                  }}>
                    {selectedRecord.estimatedDuration} hours
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginTop: '32px',
              paddingTop: '24px',
              borderTop: '2px solid #f3f4f6'
            }}>
              <button
                style={{
                  padding: '14px 20px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '14px',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(59, 130, 246, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.2)';
                }}
              >
                ✏️ Edit
              </button>
              <button
                style={{
                  padding: '14px 20px',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '14px',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(239, 68, 68, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.2)';
                }}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      )}

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

export default MaintenanceList;