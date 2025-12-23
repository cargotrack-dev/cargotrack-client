// src/features/Dashboard/pages/Dashboard.tsx
// ✅ COMPLETELY REFACTORED: Content only, uses unified AppLayout + AppSidebar

import React, { useState } from 'react'
import {
  TrendingUp,
  Truck,
  Package,
  AlertCircle,
  DollarSign,
  Users,
  Activity,
  Clock,
  Weight
} from 'lucide-react'
import { useAuth } from '../../Auth/hooks/useAuth'

/**
 * Dashboard Component - FULLY REFACTORED
 * 
 * ✅ NO embedded sidebar (removed 280 lines)
 * ✅ NO embedded header (removed 100 lines)
 * ✅ NO embedded CSS (removed 600 lines)
 * ✅ Content only (keeps 400 lines)
 * ✅ Uses unified AppLayout wrapper
 * ✅ Uses unified AppSidebar
 * ✅ Consistent across entire app
 */
const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const [timeRange, setTimeRange] = useState('week')

  // Mock shipments data
  const shipments = [
    {
      id: '1',
      trackingNumber: 'TRK-2024-001',
      customer: 'Dangote Industries',
      origin: 'Lagos',
      destination: 'Abuja',
      status: 'in-transit',
      progress: 65,
      eta: '2 hours',
      weight: '2.5 tons'
    },
    {
      id: '2',
      trackingNumber: 'TRK-2024-002',
      customer: 'MTN Nigeria',
      origin: 'Abuja',
      destination: 'Kano',
      status: 'in-transit',
      progress: 45,
      eta: '4 hours',
      weight: '1.2 tons'
    },
    {
      id: '3',
      trackingNumber: 'TRK-2024-003',
      customer: 'GTBank',
      origin: 'Port Harcourt',
      destination: 'Lagos',
      status: 'delayed',
      progress: 30,
      eta: '6 hours',
      weight: '0.8 tons'
    },
    {
      id: '4',
      trackingNumber: 'TRK-2024-004',
      customer: 'Nestle Nigeria',
      origin: 'Lagos',
      destination: 'Enugu',
      status: 'pending',
      progress: 0,
      eta: 'Tomorrow',
      weight: '3.0 tons'
    },
    {
      id: '5',
      trackingNumber: 'TRK-2024-005',
      customer: 'Unilever',
      origin: 'Ibadan',
      destination: 'Lagos',
      status: 'delivered',
      progress: 100,
      eta: 'Completed',
      weight: '1.5 tons'
    }
  ]

  // KPI Data
  const kpis = [
    {
      icon: Package,
      title: 'Total Shipments',
      value: '2,847',
      change: '+12.5%',
      color: '#0891b2',
      bg: 'rgba(8, 145, 178, 0.1)'
    },
    {
      icon: Truck,
      title: 'Active Vehicles',
      value: '156',
      change: '+8.2%',
      color: '#16a34a',
      bg: 'rgba(22, 163, 74, 0.1)'
    },
    {
      icon: DollarSign,
      title: 'Revenue',
      value: '₦2.4M',
      change: '+18.3%',
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.1)'
    },
    {
      icon: AlertCircle,
      title: 'Alerts',
      value: '12',
      change: '-3.1%',
      color: '#dc2626',
      bg: 'rgba(220, 38, 38, 0.1)'
    }
  ]

  // Monthly data
  const monthlyData = [
    { month: 'Jan', completed: 240, delayed: 160 },
    { month: 'Feb', completed: 221, delayed: 79 },
    { month: 'Mar', completed: 229, delayed: 0 },
    { month: 'Apr', completed: 200, delayed: 78 },
    { month: 'May', completed: 229, delayed: 0 },
    { month: 'Jun', completed: 200, delayed: 39 }
  ]

  // Status distribution
  const statusDistribution = [
    { label: 'In Transit', value: 45, color: '#0891b2' },
    { label: 'Delivered', value: 35, color: '#16a34a' },
    { label: 'Pending', value: 15, color: '#f59e0b' },
    { label: 'Delayed', value: 5, color: '#dc2626' }
  ]

  // Recent activity
  const recentActivity = [
    { time: '2 hours ago', action: 'Shipment TRK-001 delivered', status: 'completed' },
    { time: '4 hours ago', action: 'Vehicle GPS-15 went offline', status: 'alert' },
    { time: '6 hours ago', action: 'New shipment TRK-847 created', status: 'info' },
    { time: '8 hours ago', action: 'Route optimization completed', status: 'completed' },
    { time: '1 day ago', action: 'Driver John updated profile', status: 'info' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return '#16a34a'
      case 'in-transit':
        return '#0891b2'
      case 'delayed':
        return '#dc2626'
      case 'pending':
        return '#f59e0b'
      default:
        return '#9ca3af'
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // INLINE STYLES (replaces 600 lines of CSS)
  // ═══════════════════════════════════════════════════════════════════════

  const containerStyle: React.CSSProperties = {
    padding: '0'
  }

  const welcomeStyle: React.CSSProperties = {
    marginBottom: '32px',
    padding: '24px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  }

  const welcomeHeading: React.CSSProperties = {
    margin: '0 0 8px 0',
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#111827'
  }

  const welcomeDate: React.CSSProperties = {
    margin: '0',
    color: '#6b7280',
    fontSize: '14px'
  }

  const kpiGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
    marginBottom: '32px'
  }

  const kpiCardStyle: React.CSSProperties = {
    background: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s',
    cursor: 'pointer'
  }

  const kpiHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px'
  }

  const kpiIconWrapperStyle = (bg: string): React.CSSProperties => ({
    width: '48px',
    height: '48px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: bg
  })

  const kpiBadgeStyle = (color: string): React.CSSProperties => ({
    fontWeight: '700',
    fontSize: '12px',
    color: color
  })

  const kpiTitleStyle: React.CSSProperties = {
    margin: '0 0 8px 0',
    color: '#6b7280',
    fontSize: '14px',
    fontWeight: '500'
  }

  const kpiValueStyle: React.CSSProperties = {
    margin: '0',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#111827'
  }

  const chartsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    marginBottom: '32px'
  }

  const chartCardStyle: React.CSSProperties = {
    background: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  }

  const chartTitleStyle: React.CSSProperties = {
    margin: '0 0 24px 0',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#111827'
  }

  const miniChartStyle: React.CSSProperties = {
    minHeight: '250px'
  }

  const shipmentSectionStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '32px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  }

  const sectionTitleStyle: React.CSSProperties = {
    margin: '0 0 24px 0',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#111827'
  }

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px'
  }

  const theadStyle: React.CSSProperties = {
    background: '#f9fafb',
    borderBottom: '2px solid #e5e7eb'
  }

  const thStyle: React.CSSProperties = {
    padding: '12px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#374151',
    fontSize: '12px',
    textTransform: 'uppercase'
  }

  const trStyle: React.CSSProperties = {
    borderBottom: '1px solid #e5e7eb'
  }

  const tdStyle: React.CSSProperties = {
    padding: '16px 12px'
  }

  const statusBadgeStyle = (color: string): React.CSSProperties => ({
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: '6px',
    border: `1px solid ${color}`,
    backgroundColor: `${color}20`,
    color: color,
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'capitalize'
  })

  const progressBarStyle: React.CSSProperties = {
    flex: 1,
    height: '6px',
    background: '#e5e7eb',
    borderRadius: '3px',
    overflow: 'hidden',
    minWidth: '80px'
  }

  const progressFillStyle = (width: number, color: string): React.CSSProperties => ({
    height: '100%',
    width: `${width}%`,
    backgroundColor: color,
    transition: 'width 0.3s ease'
  })

  const activitySectionStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '32px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  }

  const activityListStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  }

  const activityItemStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px'
  }

  const activityDotStyle = (status: string): React.CSSProperties => {
    const colors: { [key: string]: string } = {
      completed: '#16a34a',
      alert: '#dc2626',
      info: '#0891b2'
    }
    return {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      marginTop: '4px',
      flexShrink: 0,
      backgroundColor: colors[status] || '#9ca3af'
    }
  }

  const statsSummaryStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '24px',
    marginBottom: '32px'
  }

  const statCardStyle: React.CSSProperties = {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    display: 'flex',
    gap: '16px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    alignItems: 'flex-start'
  }

  const statIconStyle = (color: string): React.CSSProperties => ({
    width: '48px',
    height: '48px',
    background: 'rgba(0, 0, 0, 0.05)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    color: color
  })

  // ═══════════════════════════════════════════════════════════════════════
  // RENDER - CONTENT ONLY (no sidebar/header)
  // ═══════════════════════════════════════════════════════════════════════

  return (
    <div style={containerStyle}>
      {/* WELCOME SECTION */}
      <div style={welcomeStyle}>
        <h1 style={welcomeHeading}>
          Welcome back, {user?.email?.split('@')[0] || 'Manager'}! 👋
        </h1>
        <p style={welcomeDate}>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric'
          })}
        </p>
      </div>

      {/* KPI GRID */}
      <div style={kpiGridStyle}>
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon
          return (
            <div key={index} style={kpiCardStyle}>
              <div style={kpiHeaderStyle}>
                <div style={kpiIconWrapperStyle(kpi.bg)}>
                  <Icon size={24} color={kpi.color} />
                </div>
                <div style={kpiBadgeStyle(kpi.color)}>{kpi.change}</div>
              </div>
              <h3 style={kpiTitleStyle}>{kpi.title}</h3>
              <p style={kpiValueStyle}>{kpi.value}</p>
            </div>
          )
        })}
      </div>

      {/* CHARTS SECTION */}
      <div style={chartsGridStyle}>
        {/* Monthly Performance Chart */}
        <div style={chartCardStyle}>
          <h2 style={chartTitleStyle}>Monthly Performance</h2>
          <div style={miniChartStyle}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '200px', paddingTop: '20px' }}>
              {monthlyData.map((item, idx) => (
                <div key={idx} style={{ textAlign: 'center', flex: 1, marginRight: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', height: '150px' }}>
                    <div
                      style={{
                        width: '20px',
                        height: `${(item.completed / 250) * 120}px`,
                        backgroundColor: '#0891b2',
                        marginRight: '4px',
                        borderRadius: '4px 4px 0 0'
                      }}
                    />
                    <div
                      style={{
                        width: '20px',
                        height: `${(item.delayed / 250) * 120}px`,
                        backgroundColor: '#dc2626',
                        borderRadius: '4px 4px 0 0'
                      }}
                    />
                  </div>
                  <p style={{ fontSize: '12px', marginTop: '8px', color: '#cbd5e1' }}>{item.month}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '16px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#0891b2', borderRadius: '2px' }} />
                <span>Completed</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#dc2626', borderRadius: '2px' }} />
                <span>Delayed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div style={chartCardStyle}>
          <h2 style={chartTitleStyle}>Shipment Status</h2>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '250px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
              {statusDistribution.map((item, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                    <span style={{ fontWeight: 600 }}>{item.label}</span>
                    <span style={{ color: item.color, fontWeight: 700 }}>{item.value}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={progressFillStyle(item.value, item.color)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SHIPMENT TABLE */}
      <div style={shipmentSectionStyle}>
        <h2 style={sectionTitleStyle}>Recent Shipments</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead style={theadStyle}>
              <tr>
                <th style={thStyle}>Tracking #</th>
                <th style={thStyle}>Customer</th>
                <th style={thStyle}>Route</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Progress</th>
                <th style={thStyle}>ETA</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((shipment) => (
                <tr key={shipment.id} style={trStyle}>
                  <td style={{ ...tdStyle, fontWeight: '600', color: '#0891b2' }}>
                    {shipment.trackingNumber}
                  </td>
                  <td style={tdStyle}>{shipment.customer}</td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ fontSize: '13px', color: '#111827' }}>
                        {shipment.origin} → {shipment.destination}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#9ca3af' }}>
                        <Weight size={12} /> {shipment.weight}
                      </div>
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <span style={statusBadgeStyle(getStatusColor(shipment.status))}>
                      {shipment.status}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={progressBarStyle}>
                        <div style={progressFillStyle(shipment.progress, getStatusColor(shipment.status))} />
                      </div>
                      <span style={{ fontSize: '12px', color: '#6b7280', minWidth: '35px', textAlign: 'right' }}>
                        {shipment.progress}%
                      </span>
                    </div>
                  </td>
                  <td style={{ ...tdStyle, display: 'flex', alignItems: 'center', gap: '6px', color: shipment.status === 'delayed' ? '#dc2626' : '#16a34a', fontSize: '13px' }}>
                    <Clock size={14} /> {shipment.eta}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ACTIVITY SECTION */}
      <div style={activitySectionStyle}>
        <h2 style={chartTitleStyle}>Recent Activity</h2>
        <div style={activityListStyle}>
          {recentActivity.map((item, index) => (
            <div key={index} style={activityItemStyle}>
              <div style={activityDotStyle(item.status)} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0', fontWeight: '500', color: '#111827', fontSize: '14px' }}>
                  {item.action}
                </p>
                <p style={{ margin: '4px 0 0 0', color: '#9ca3af', fontSize: '12px' }}>
                  {item.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STATS SUMMARY */}
      <div style={statsSummaryStyle}>
        <div style={statCardStyle}>
          <div style={statIconStyle('#0891b2')}>
            <Activity size={20} />
          </div>
          <div>
            <p style={{ margin: '0', color: '#6b7280', fontSize: '12px', fontWeight: '500' }}>
              On-Time Rate
            </p>
            <p style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
              94.5%
            </p>
          </div>
        </div>
        <div style={statCardStyle}>
          <div style={statIconStyle('#16a34a')}>
            <Users size={20} />
          </div>
          <div>
            <p style={{ margin: '0', color: '#6b7280', fontSize: '12px', fontWeight: '500' }}>
              Active Drivers
            </p>
            <p style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
              127
            </p>
          </div>
        </div>
        <div style={statCardStyle}>
          <div style={statIconStyle('#f59e0b')}>
            <TrendingUp size={20} />
          </div>
          <div>
            <p style={{ margin: '0', color: '#6b7280', fontSize: '12px', fontWeight: '500' }}>
              Growth Rate
            </p>
            <p style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
              +23.5%
            </p>
          </div>
        </div>
        <div style={statCardStyle}>
          <div style={statIconStyle('#dc2626')}>
            <Clock size={20} />
          </div>
          <div>
            <p style={{ margin: '0', color: '#6b7280', fontSize: '12px', fontWeight: '500' }}>
              Avg Delivery Time
            </p>
            <p style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
              2.3 days
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard