// src/features/Maintenance/pages/MaintenanceHistory.tsx
// 🎨 FULLY MODERNIZED - Professional UI/UX with inline styles

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMaintenance } from '../contexts/useMaintenance';
import { 
  Calendar,
  Truck as TruckIcon,
  User,
  Search,
  FileText,
  DollarSign,
  Clock
} from 'lucide-react';
import { 
  MaintenanceHistory as MaintenanceHistoryType,
  MaintenanceType,
  MAINTENANCE_TYPE_LABELS
} from '../types/maintenance';

const mockVehicles = [
  { id: 'v1', name: 'Truck 101', type: 'Heavy Duty Truck' },
  { id: 'v2', name: 'Truck 102', type: 'Heavy Duty Truck' },
  { id: 'v3', name: 'Truck 103', type: 'Medium Duty Truck' },
  { id: 'v4', name: 'Truck 104', type: 'Medium Duty Truck' },
  { id: 'v5', name: 'Van 201', type: 'Delivery Van' },
  { id: 'v6', name: 'Van 202', type: 'Delivery Van' },
];

const MaintenanceHistory: React.FC = () => {
  const { vehicleId } = useParams<{ vehicleId?: string }>();
  const navigate = useNavigate();
  const { history, loadHistory, isLoading } = useMaintenance();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<MaintenanceType | 'all'>('all');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: ''
  });
  
  useEffect(() => {
    loadHistory(vehicleId);
  }, [loadHistory, vehicleId]);
  
  const vehicleName = vehicleId
    ? mockVehicles.find(v => v.id === vehicleId)?.name || 'Unknown Vehicle'
    : undefined;
  
  const filteredHistory = history.filter((entry: MaintenanceHistoryType) => {
    const matchesSearch = 
      searchTerm === '' || 
      entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.technician.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || entry.type === filterType;
    
    let matchesDateRange = true;
    if (dateRange.start) {
      matchesDateRange = matchesDateRange && new Date(entry.date) >= new Date(dateRange.start);
    }
    if (dateRange.end) {
      matchesDateRange = matchesDateRange && new Date(entry.date) <= new Date(dateRange.end);
    }
    
    return matchesSearch && matchesType && matchesDateRange;
  });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  const groupedHistory: Record<string, MaintenanceHistoryType[]> = {};
  filteredHistory.forEach((entry: MaintenanceHistoryType) => {
    const date = new Date(entry.date);
    const month = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    
    if (!groupedHistory[month]) {
      groupedHistory[month] = [];
    }
    
    groupedHistory[month].push(entry);
  });
  
  const sortedMonths = Object.keys(groupedHistory).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateB.getTime() - dateA.getTime();
  });
  
  const costsByMonth: Record<string, number> = {};
  Object.entries(groupedHistory).forEach(([month, entries]) => {
    costsByMonth[month] = entries.reduce((sum, entry) => sum + entry.cost, 0);
  });
  
  const viewScheduleDetails = (scheduleId: string) => {
    navigate(`/maintenance/schedule/${scheduleId}`);
  };
  
  // Calculate statistics
  const totalCost = filteredHistory.reduce((sum, entry) => sum + entry.cost, 0);
  const totalRecords = filteredHistory.length;
  const avgCost = totalRecords > 0 ? totalCost / totalRecords : 0;

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
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <button
            onClick={() => navigate('/maintenance')}
            style={{
              padding: '10px 16px',
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
              gap: '6px',
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
            ← Back
          </button>

          <div>
            <h1 style={{
              fontSize: '36px',
              fontWeight: '900',
              color: '#111827',
              margin: 0,
              letterSpacing: '-0.8px'
            }}>
              Maintenance History
            </h1>
            <p style={{
              fontSize: '15px',
              color: '#6b7280',
              margin: '6px 0 0 0',
              fontWeight: '500'
            }}>
              {vehicleName ? `All records for ${vehicleName}` : 'Complete maintenance records'}
            </p>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* STATISTICS CARDS */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {totalRecords > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          {[
            { label: 'Total Records', value: totalRecords, icon: '📋', gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', shadow: 'rgba(59, 130, 246, 0.25)' },
            { label: 'Total Cost', value: `$${totalCost.toLocaleString('en-US', { maximumFractionDigits: 2 })}`, icon: '💰', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', shadow: 'rgba(16, 185, 129, 0.25)' },
            { label: 'Average Cost', value: `$${avgCost.toLocaleString('en-US', { maximumFractionDigits: 2 })}`, icon: '📊', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', shadow: 'rgba(245, 158, 11, 0.25)' }
          ].map((stat, i) => (
            <div key={i} style={{
              background: stat.gradient,
              padding: '24px',
              borderRadius: '12px',
              boxShadow: `0 10px 30px ${stat.shadow}`,
              color: 'white',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = `0 16px 40px ${stat.shadow}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 10px 30px ${stat.shadow}`;
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
                  marginBottom: '12px'
                }}>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    opacity: 0.95,
                    letterSpacing: '0.5px'
                  }}>
                    {stat.label.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '28px' }}>{stat.icon}</span>
                </div>
                <div style={{
                  fontSize: '28px',
                  fontWeight: '900',
                  lineHeight: '1'
                }}>
                  {stat.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* FILTERS SECTION */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <div style={{
        backgroundColor: 'white',
        padding: '28px',
        borderRadius: '14px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        marginBottom: '32px',
        border: '1px solid #e5e7eb'
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '700',
          color: '#111827',
          margin: '0 0 20px 0'
        }}>
          🔍 Filters & Search
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px'
        }}>
          {/* Search Input */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '8px',
              letterSpacing: '0.5px'
            }}>
              SEARCH
            </label>
            <div style={{ position: 'relative' }}>
              <Search style={{
                position: 'absolute',
                left: '12px',
                top: '12px',
                width: '18px',
                height: '18px',
                color: '#9ca3af',
                pointerEvents: 'none'
              }} />
              <input
                type="text"
                placeholder="Search by description or technician..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
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
            </div>
          </div>

          {/* Maintenance Type */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '8px',
              letterSpacing: '0.5px'
            }}>
              MAINTENANCE TYPE
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as MaintenanceType | 'all')}
              style={{
                width: '100%',
                padding: '12px 12px',
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
              <option value="all">All Types</option>
              {Object.entries(MAINTENANCE_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* From Date */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '8px',
              letterSpacing: '0.5px'
            }}>
              FROM DATE
            </label>
            <div style={{ position: 'relative' }}>
              <Calendar style={{
                position: 'absolute',
                left: '12px',
                top: '12px',
                width: '18px',
                height: '18px',
                color: '#9ca3af',
                pointerEvents: 'none'
              }} />
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
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
            </div>
          </div>

          {/* To Date */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '8px',
              letterSpacing: '0.5px'
            }}>
              TO DATE
            </label>
            <div style={{ position: 'relative' }}>
              <Calendar style={{
                position: 'absolute',
                left: '12px',
                top: '12px',
                width: '18px',
                height: '18px',
                color: '#9ca3af',
                pointerEvents: 'none'
              }} />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
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
            </div>
          </div>
        </div>

        {vehicleId && (
          <button
            onClick={() => navigate('/dashboard/maintenance/history')}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
              transition: 'all 0.3s',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.2)';
            }}
          >
            📊 View All Vehicles
          </button>
        )}
      </div>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* HISTORY RECORDS */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {isLoading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #f0f0f0',
            borderTop: '4px solid #ea580c',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      ) : filteredHistory.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 40px',
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '2px dashed #e5e7eb',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
        }}>
          <p style={{
            fontSize: '18px',
            color: '#6b7280',
            margin: 0,
            fontWeight: '500'
          }}>
            📭 No maintenance history found matching your criteria
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '24px' }}>
          {sortedMonths.map(month => (
            <div key={month} style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e5e7eb',
              overflow: 'hidden'
            }}>
              {/* Month Header */}
              <div style={{
                padding: '24px',
                background: 'linear-gradient(135deg, #f8fafc 0%, #f3f4f6 100%)',
                borderBottom: '2px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#111827',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Clock size={18} />
                  {month}
                </h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '18px',
                  fontWeight: '800',
                  color: '#10b981'
                }}>
                  <DollarSign size={20} />
                  {costsByMonth[month].toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </div>
              </div>

              {/* History Entries */}
              <div style={{ padding: '20px' }}>
                {groupedHistory[month].map((entry, idx) => (
                  <div
                    key={entry.id}
                    style={{
                      padding: '20px',
                      backgroundColor: idx % 2 === 0 ? '#f8fafc' : '#ffffff',
                      borderRadius: '10px',
                      border: '1px solid #e5e7eb',
                      marginBottom: idx < groupedHistory[month].length - 1 ? '16px' : '0',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(234, 88, 12, 0.12)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.borderColor = '#ea580c';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 0px 0px rgba(0, 0, 0, 0)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = '#e5e7eb';
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      marginBottom: '12px',
                      gap: '16px'
                    }}>
                      <div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          marginBottom: '8px'
                        }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '6px 12px',
                            backgroundColor: '#dbeafe',
                            color: '#1e40af',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '700',
                            letterSpacing: '0.3px'
                          }}>
                            {MAINTENANCE_TYPE_LABELS[entry.type]}
                          </span>
                          <span style={{
                            fontSize: '13px',
                            color: '#6b7280',
                            fontWeight: '500'
                          }}>
                            {formatDate(entry.date)}
                          </span>
                        </div>
                        <h4 style={{
                          fontSize: '16px',
                          fontWeight: '700',
                          color: '#111827',
                          margin: '8px 0'
                        }}>
                          {entry.description}
                        </h4>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: '12px',
                          marginTop: '10px'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '13px',
                            color: '#4b5563'
                          }}>
                            <TruckIcon size={16} />
                            <span>Mileage: {entry.mileage.toLocaleString()} mi</span>
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '13px',
                            color: '#4b5563'
                          }}>
                            <User size={16} />
                            <span>{entry.technician}</span>
                          </div>
                        </div>

                        {entry.notes && (
                          <p style={{
                            fontSize: '13px',
                            color: '#6b7280',
                            marginTop: '10px',
                            fontStyle: 'italic'
                          }}>
                            {entry.notes}
                          </p>
                        )}

                        {entry.partsReplaced.length > 0 && (
                          <div style={{ marginTop: '12px' }}>
                            <h5 style={{
                              fontSize: '12px',
                              fontWeight: '700',
                              color: '#111827',
                              marginBottom: '8px'
                            }}>
                              Parts Replaced:
                            </h5>
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                              gap: '8px'
                            }}>
                              {entry.partsReplaced.map((part, idx) => (
                                <div key={idx} style={{
                                  padding: '8px 12px',
                                  backgroundColor: '#f3f4f6',
                                  borderRadius: '6px',
                                  border: '1px solid #e5e7eb',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center'
                                }}>
                                  <span style={{
                                    fontSize: '12px',
                                    color: '#111827',
                                    fontWeight: '600'
                                  }}>
                                    {part.partName} (×{part.quantity})
                                  </span>
                                  <span style={{
                                    fontSize: '11px',
                                    color: '#6b7280',
                                    fontWeight: '700'
                                  }}>
                                    ${part.cost.toFixed(2)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div style={{
                        textAlign: 'right',
                        minWidth: '120px',
                        padding: '12px 16px',
                        background: 'linear-gradient(135deg, #f0fdf4 0%, #f0fdf4 100%)',
                        borderRadius: '10px',
                        border: '1px solid #dcfce7'
                      }}>
                        <div style={{
                          fontSize: '12px',
                          color: '#6b7280',
                          marginBottom: '4px',
                          fontWeight: '600'
                        }}>
                          Total Cost
                        </div>
                        <div style={{
                          fontSize: '22px',
                          fontWeight: '900',
                          color: '#10b981',
                          marginBottom: '12px'
                        }}>
                          ${entry.cost.toFixed(2)}
                        </div>
                        <button
                          onClick={() => viewScheduleDetails(entry.scheduleId)}
                          style={{
                            padding: '8px 12px',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '12px',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            width: '100%',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.2)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.2)';
                          }}
                        >
                          <FileText size={14} />
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default MaintenanceHistory;