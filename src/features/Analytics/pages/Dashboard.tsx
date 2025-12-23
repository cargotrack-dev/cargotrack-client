import React, { useState } from 'react';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7days');

  const stats = [
    {
      title: 'Total Revenue',
      value: '₦45,678',
      change: '+12.5%',
      icon: '💰',
      color: '#10b981',
      trend: 'up'
    },
    {
      title: 'Shipments',
      value: '2,847',
      change: '+8.2%',
      icon: '📦',
      color: '#3b82f6',
      trend: 'up'
    },
    {
      title: 'Active Routes',
      value: '156',
      change: '+5.3%',
      icon: '🗺️',
      color: '#8b5cf6',
      trend: 'up'
    },
    {
      title: 'Avg Delivery Time',
      value: '2.4h',
      change: '-3.1%',
      icon: '⏱️',
      color: '#f59e0b',
      trend: 'down'
    }
  ];

  const monthlyData = [
    { month: 'Jan', revenue: 85000, shipments: 245 },
    { month: 'Feb', revenue: 92000, shipments: 268 },
    { month: 'Mar', revenue: 88000, shipments: 253 },
    { month: 'Apr', revenue: 95000, shipments: 275 },
    { month: 'May', revenue: 102000, shipments: 292 },
    { month: 'Jun', revenue: 98000, shipments: 280 }
  ];

  const statusData = [
    { status: 'In Transit', percentage: 45, color: '#14b8a6' },
    { status: 'Delivered', percentage: 35, color: '#10b981' },
    { status: 'Pending', percentage: 15, color: '#f59e0b' },
    { status: 'Delayed', percentage: 5, color: '#ef4444' }
  ];

  const topRoutes = [
    { name: 'Lagos → Abuja', shipments: 324, revenue: '₦12.4M', efficiency: '94%' },
    { name: 'Lagos → Kano', shipments: 287, revenue: '₦11.2M', efficiency: '92%' },
    { name: 'Abuja → Port Harcourt', shipments: 256, revenue: '₦9.8M', efficiency: '88%' },
    { name: 'Lagos → Ibadan', shipments: 198, revenue: '₦7.6M', efficiency: '91%' }
  ];

  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));

  return (
    <div style={{ padding: '24px', maxWidth: '1400px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
          Analytics Dashboard
        </h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
            Real-time logistics performance metrics
          </p>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '13px',
              cursor: 'pointer',
              background: 'white'
            }}
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="1year">Last year</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}
      >
        {stats.map((stat) => (
          <div
            key={stat.title}
            style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ fontSize: '32px' }}>{stat.icon}</div>
              <span
                style={{
                  fontSize: '12px',
                  color: stat.trend === 'up' ? '#10b981' : '#ef4444',
                  fontWeight: '600',
                  background: stat.trend === 'up' ? '#ecfdf5' : '#fef2f2',
                  padding: '4px 8px',
                  borderRadius: '4px'
                }}
              >
                {stat.trend === 'up' ? '↑' : '↓'} {stat.change}
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#9ca3af', margin: '0 0 8px', fontWeight: '500' }}>
              {stat.title}
            </p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '32px' }}>
        {/* Revenue Chart */}
        <div
          style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '20px', marginTop: 0 }}>
            Monthly Revenue Trend
          </h2>
          <div style={{ height: '240px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: '12px', paddingBottom: '20px', borderBottom: '1px solid #e5e7eb' }}>
            {monthlyData.map((item, idx) => (
              <div key={item.month} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <div
                  style={{
                    height: `${(item.revenue / maxRevenue) * 200}px`,
                    width: '100%',
                    background: `linear-gradient(180deg, #14b8a6 0%, #0d9488 100%)`,
                    borderRadius: '6px 6px 0 0',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                  title={`${item.month}: ₦${(item.revenue / 1000).toFixed(0)}K`}
                />
                <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600', marginTop: '8px' }}>
                  {item.month}
                </span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '16px', fontSize: '12px', color: '#6b7280' }}>
            <p style={{ margin: '0' }}>Total: ₦561K | Average: ₦93.5K</p>
          </div>
        </div>

        {/* Status Distribution */}
        <div
          style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '20px', marginTop: 0 }}>
            Shipment Status
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {statusData.map((item) => (
              <div key={item.status}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>
                    {item.status}
                  </span>
                  <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: '600' }}>
                    {item.percentage}%
                  </span>
                </div>
                <div style={{ height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      background: item.color,
                      width: `${item.percentage}%`,
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Routes Table */}
      <div
        style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
            Top Performing Routes
          </h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>
                  Route
                </th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>
                  Shipments
                </th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>
                  Revenue
                </th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>
                  Efficiency
                </th>
              </tr>
            </thead>
            <tbody>
              {topRoutes.map((route, idx) => (
                <tr
                  key={route.name}
                  style={{
                    borderBottom: idx < topRoutes.length - 1 ? '1px solid #e5e7eb' : 'none',
                    background: idx % 2 === 0 ? 'white' : '#f9fafb'
                  }}
                >
                  <td style={{ padding: '16px 24px', fontSize: '13px', color: '#111827', fontWeight: '500' }}>
                    {route.name}
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '13px', color: '#6b7280' }}>
                    {route.shipments.toLocaleString()}
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '13px', color: '#111827', fontWeight: '600' }}>
                    {route.revenue}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div
                      style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        background: '#ecfdf5',
                        color: '#047857',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}
                    >
                      {route.efficiency}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;