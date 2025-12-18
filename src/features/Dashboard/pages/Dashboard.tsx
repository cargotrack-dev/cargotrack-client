// src/features/Dashboard/pages/Dashboard.tsx
// Main dashboard page using global CSS styling

import React, { useState } from 'react';
import { TrendingUp, Truck, Package, AlertCircle, DollarSign, Users, Activity, Calendar } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('week');

  // KPI Data
  const kpis = [
    {
      icon: Package,
      title: 'Total Shipments',
      value: '2,847',
      change: '+12.5%',
      color: '#0891b2',
      bg: 'rgba(8, 145, 178, 0.1)',
    },
    {
      icon: Truck,
      title: 'Active Vehicles',
      value: '156',
      change: '+8.2%',
      color: '#16a34a',
      bg: 'rgba(22, 163, 74, 0.1)',
    },
    {
      icon: DollarSign,
      title: 'Revenue',
      value: '₦2.4M',
      change: '+18.3%',
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.1)',
    },
    {
      icon: AlertCircle,
      title: 'Alerts',
      value: '12',
      change: '-3.1%',
      color: '#dc2626',
      bg: 'rgba(220, 38, 38, 0.1)',
    },
  ];

  // Monthly data
  const monthlyData = [
    { month: 'Jan', completed: 240, delayed: 160 },
    { month: 'Feb', completed: 221, delayed: 79 },
    { month: 'Mar', completed: 229, delayed: 0 },
    { month: 'Apr', completed: 200, delayed: 78 },
    { month: 'May', completed: 229, delayed: 0 },
    { month: 'Jun', completed: 200, delayed: 39 },
  ];

  // Status distribution
  const statusDistribution = [
    { label: 'In Transit', value: 45, color: '#0891b2' },
    { label: 'Delivered', value: 35, color: '#16a34a' },
    { label: 'Pending', value: 15, color: '#f59e0b' },
    { label: 'Delayed', value: 5, color: '#dc2626' },
  ];

  // Recent activity
  const recentActivity = [
    { time: '2 hours ago', action: 'Shipment TRK-001 delivered', status: 'completed' },
    { time: '4 hours ago', action: 'Vehicle GPS-15 went offline', status: 'alert' },
    { time: '6 hours ago', action: 'New shipment TRK-847 created', status: 'info' },
    { time: '8 hours ago', action: 'Route optimization completed', status: 'completed' },
    { time: '1 day ago', action: 'Driver John updated profile', status: 'info' },
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back! Here's your logistics overview</p>
        </div>
        <div className="header-actions">
          <select className="time-filter" value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="today">Today</option>
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
            <option value="quarter">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="kpi-card">
              <div className="kpi-header">
                <div className="kpi-icon-wrapper" style={{ backgroundColor: kpi.bg }}>
                  <Icon size={24} color={kpi.color} />
                </div>
                <div className="kpi-badge" style={{ color: kpi.color }}>
                  {kpi.change}
                </div>
              </div>
              <h3 className="kpi-title">{kpi.title}</h3>
              <p className="kpi-value">{kpi.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        {/* Performance Chart */}
        <div className="chart-card">
          <h2 className="chart-title">Monthly Performance</h2>
          <div className="mini-chart">
            <div className="chart-placeholder">
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
                          borderRadius: '4px 4px 0 0',
                        }}
                      />
                      <div
                        style={{
                          width: '20px',
                          height: `${(item.delayed / 250) * 120}px`,
                          backgroundColor: '#dc2626',
                          borderRadius: '4px 4px 0 0',
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
        </div>

        {/* Status Distribution */}
        <div className="chart-card">
          <h2 className="chart-title">Shipment Status</h2>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '250px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
              {statusDistribution.map((item, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                    <span style={{ fontWeight: 600 }}>{item.label}</span>
                    <span style={{ color: item.color, fontWeight: 700 }}>{item.value}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${item.value}%`,
                        backgroundColor: item.color,
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="activity-section">
        <h2 className="activity-title">Recent Activity</h2>
        <div className="activity-list">
          {recentActivity.map((item, index) => (
            <div key={index} className="activity-item">
              <div className={`activity-dot ${item.status}`}></div>
              <div className="activity-content">
                <p className="activity-action">{item.action}</p>
                <p className="activity-time">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="stats-summary">
        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#0891b2' }}>
            <Activity size={20} />
          </div>
          <div className="stat-content">
            <p className="stat-label">On-Time Rate</p>
            <p className="stat-value">94.5%</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#16a34a' }}>
            <Users size={20} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Active Drivers</p>
            <p className="stat-value">127</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#f59e0b' }}>
            <TrendingUp size={20} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Growth Rate</p>
            <p className="stat-value">+23.5%</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#dc2626' }}>
            <Calendar size={20} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Avg Delivery Time</p>
            <p className="stat-value">2.3 days</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;