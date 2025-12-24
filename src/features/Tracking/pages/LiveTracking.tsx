// src/features/Tracking/pages/LiveTracking.tsx
// 🚀 FULLY MODERNIZED - 100% Inline Styles, Professional UI

import React, { useState, useCallback, useMemo } from 'react';
import {
  MapPin, Truck, Search, RefreshCw, Filter, Layers,
  Phone, AlertTriangle, Radio, ArrowRight, ChevronDown
} from 'lucide-react';

// ==================== TYPES ====================
interface Location {
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  lastUpdated: string;
  address?: string;
}

interface Waybill {
  id: string;
  origin: string;
  destination: string;
  cargo: string;
  client: string;
  estimatedArrival: string;
  progress: number;
}

interface TruckLocation {
  id: string;
  truckId: string;
  truckName: string;
  licensePlate: string;
  driverName: string;
  driverPhone: string;
  status: 'in_transit' | 'idle' | 'loading' | 'maintenance' | 'offline';
  fuel: number;
  temperature: number;
  location: Location;
  currentWaybill?: Waybill;
}

// ==================== MOCK DATA ====================
const MOCK_TRUCKS: TruckLocation[] = [
  {
    id: 'loc1', truckId: 't1', truckName: 'Truck-001', licensePlate: 'XYZ-1234',
    driverName: 'John Smith', driverPhone: '+1 (555) 234-5678', status: 'in_transit',
    fuel: 75, temperature: 82,
    location: {
      lat: 40.7128, lng: -74.0060, speed: 65, heading: 90,
      lastUpdated: new Date(Date.now() - 2 * 60000).toISOString(),
      address: 'I-95 N, New Jersey'
    },
    currentWaybill: {
      id: 'w1', origin: 'New York, NY', destination: 'Boston, MA',
      cargo: 'Electronics', client: 'TechCorp Inc.',
      estimatedArrival: new Date(Date.now() + 20 * 3600000).toISOString(), progress: 42
    }
  },
  {
    id: 'loc2', truckId: 't2', truckName: 'Truck-002', licensePlate: 'ABC-5678',
    driverName: 'Sarah Johnson', driverPhone: '+1 (555) 345-6789', status: 'idle',
    fuel: 90, temperature: 68,
    location: {
      lat: 37.7749, lng: -122.4194, speed: 0, heading: 0,
      lastUpdated: new Date(Date.now() - 5 * 60000).toISOString(),
      address: 'San Francisco Distribution Center'
    }
  },
  {
    id: 'loc3', truckId: 't3', truckName: 'Truck-003', licensePlate: 'DEF-9012',
    driverName: 'Robert Wilson', driverPhone: '+1 (555) 456-7890', status: 'in_transit',
    fuel: 45, temperature: 79,
    location: {
      lat: 34.0522, lng: -118.2437, speed: 55, heading: 180,
      lastUpdated: new Date(Date.now() - 3 * 60000).toISOString(),
      address: 'I-5 S, Los Angeles, CA'
    },
    currentWaybill: {
      id: 'w2', origin: 'Los Angeles, CA', destination: 'San Diego, CA',
      cargo: 'Furniture', client: 'HomeGoods Inc.',
      estimatedArrival: new Date(Date.now() + 4 * 3600000).toISOString(), progress: 75
    }
  },
  {
    id: 'loc4', truckId: 't4', truckName: 'Truck-004', licensePlate: 'GHI-3456',
    driverName: 'Michael Brown', driverPhone: '+1 (555) 567-8901', status: 'loading',
    fuel: 60, temperature: 71,
    location: {
      lat: 29.7604, lng: -95.3698, speed: 0, heading: 270,
      lastUpdated: new Date(Date.now() - 10 * 60000).toISOString(),
      address: 'Houston Distribution Hub'
    }
  },
  {
    id: 'loc5', truckId: 't5', truckName: 'Truck-005', licensePlate: 'JKL-7890',
    driverName: 'Jennifer Davis', driverPhone: '+1 (555) 678-9012', status: 'maintenance',
    fuel: 30, temperature: 65,
    location: {
      lat: 41.8781, lng: -87.6298, speed: 0, heading: 0,
      lastUpdated: new Date(Date.now() - 30 * 60000).toISOString(),
      address: 'Chicago Maintenance Center'
    }
  },
  {
    id: 'loc6', truckId: 't6', truckName: 'Truck-006', licensePlate: 'MNO-1234',
    driverName: 'David Martinez', driverPhone: '+1 (555) 789-0123', status: 'offline',
    fuel: 15, temperature: 60,
    location: {
      lat: 39.9526, lng: -75.1652, speed: 0, heading: 0,
      lastUpdated: new Date(Date.now() - 2 * 3600000).toISOString(),
      address: 'Philadelphia Depot'
    }
  }
];

// ==================== STATUS STYLES ====================
const STATUS_STYLES: Record<string, { icon: string; label: string; bgColor: string; textColor: string; borderColor: string; progressColor: string }> = {
  in_transit: { icon: '🚚', label: 'In Transit', bgColor: '#f0fdf4', textColor: '#166534', borderColor: '#dcfce7', progressColor: '#16a34a' },
  idle: { icon: '⏸️', label: 'Idle', bgColor: '#eff6ff', textColor: '#1e40af', borderColor: '#bfdbfe', progressColor: '#2563eb' },
  loading: { icon: '📦', label: 'Loading', bgColor: '#fffbeb', textColor: '#92400e', borderColor: '#fef3c7', progressColor: '#ea580c' },
  maintenance: { icon: '🔧', label: 'Maintenance', bgColor: '#fff7ed', textColor: '#92400e', borderColor: '#fed7aa', progressColor: '#ea580c' },
  offline: { icon: '⚠️', label: 'Offline', bgColor: '#f3f4f6', textColor: '#374151', borderColor: '#e5e7eb', progressColor: '#6b7280' }
};

// ==================== UTILITIES ====================
const formatTimeAgo = (date: Date | string): string => {
  const diffMs = Date.now() - new Date(date).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin === 1) return '1 min ago';
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  return diffHr === 1 ? '1 hour ago' : `${diffHr} hours ago`;
};

const getETAString = (date: Date | string): string => {
  const diffMs = new Date(date).getTime() - Date.now();
  const hours = Math.floor(diffMs / 3600000);
  if (hours < 1) {
    const mins = Math.floor(diffMs / 60000);
    return `${mins}m`;
  }
  return hours < 24 ? `${hours}h` : `${Math.ceil(hours / 24)}d`;
};

// ==================== TRUCK CARD ====================
interface TruckCardProps {
  truck: TruckLocation;
  isSelected: boolean;
  onClick: (truck: TruckLocation) => void;
}

const TruckCard: React.FC<TruckCardProps> = ({ truck, isSelected, onClick }) => {
  const style = STATUS_STYLES[truck.status];
  const timeAgo = formatTimeAgo(truck.location.lastUpdated);
  const isRecent = Date.now() - new Date(truck.location.lastUpdated).getTime() < 15 * 60000;

  return (
    <div
      onClick={() => onClick(truck)}
      style={{
        backgroundColor: style.bgColor,
        border: isSelected ? '3px solid #2563eb' : `2px solid ${style.borderColor}`,
        borderRadius: '12px',
        padding: '20px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: isSelected ? '0 20px 25px -5px rgba(37, 99, 235, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        transform: isSelected ? 'scale(1.05)' : 'scale(1)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.15)';
        if (!isSelected) e.currentTarget.style.transform = 'scale(1.02)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = isSelected ? '0 20px 25px -5px rgba(37, 99, 235, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        if (!isSelected) e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', gap: '12px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '24px' }}>{style.icon}</span>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
              {truck.truckName}
            </h3>
          </div>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>📍 {truck.licensePlate}</p>
        </div>
        <span
          style={{
            backgroundColor: 'white',
            color: style.textColor,
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            border: `2px solid ${style.textColor}`,
            whiteSpace: 'nowrap'
          }}
        >
          {style.label}
        </span>
      </div>

      {/* Driver Info */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '12px', marginBottom: '12px', borderLeft: `4px solid ${style.progressColor}` }}>
        <p style={{ fontSize: '11px', fontWeight: '600', color: style.textColor, margin: '0 0 6px 0' }}>👤 Driver</p>
        <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827', margin: '0 0 6px 0' }}>
          {truck.driverName}
        </p>
        <a
          href={`tel:${truck.driverPhone}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            color: '#2563eb',
            textDecoration: 'none',
            transition: 'color 0.2s'
          }}
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#1d4ed8')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#2563eb')}
        >
          <Phone size={14} />
          {truck.driverPhone}
        </a>
      </div>

      {/* Location */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '12px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: '600', color: '#6b7280' }}>📍 Location</span>
          <span
            style={{
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: isRecent ? '#16a34a' : '#ea580c'
            }}
          >
            <Radio size={10} style={{ flexShrink: 0 }} />
            {timeAgo}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <MapPin size={16} style={{ color: '#dc2626', flexShrink: 0, marginTop: '2px' }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '13px', fontWeight: '500', color: '#111827', margin: 0 }}>
              {truck.location.address}
            </p>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>
              Speed: {truck.location.speed} mph
            </p>
          </div>
        </div>
      </div>

      {/* Fuel & Temp */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '12px' }}>
          <p style={{ fontSize: '11px', fontWeight: '600', color: '#6b7280', margin: '0 0 8px 0' }}>⛽ Fuel</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                flex: 1,
                height: '6px',
                backgroundColor: '#e5e7eb',
                borderRadius: '3px',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${truck.fuel}%`,
                  backgroundColor: truck.fuel > 50 ? '#16a34a' : truck.fuel > 25 ? '#ea580c' : '#dc2626',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827', minWidth: '35px' }}>
              {truck.fuel}%
            </span>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '12px' }}>
          <p style={{ fontSize: '11px', fontWeight: '600', color: '#6b7280', margin: '0 0 8px 0' }}>🌡️ Temp</p>
          <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
            {truck.temperature}°F
          </p>
        </div>
      </div>

      {/* Waybill */}
      {truck.currentWaybill && (
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '12px',
            borderLeft: `4px solid ${style.progressColor}`
          }}
        >
          <p style={{ fontSize: '11px', fontWeight: '600', color: style.textColor, margin: '0 0 8px 0' }}>
            📋 Active Shipment
          </p>
          <div style={{ gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
              <span style={{ color: '#6b7280' }}>Waybill</span>
              <span style={{ fontWeight: 'bold', color: '#111827' }}>{truck.currentWaybill.id}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', marginBottom: '6px' }}>
              <span style={{ color: '#6b7280' }}>Route</span>
              <span style={{ fontWeight: 'bold', color: '#111827', flex: 1 }}>
                {truck.currentWaybill.origin.split(',')[0]}
              </span>
              <ArrowRight size={12} style={{ color: '#9ca3af' }} />
              <span style={{ fontWeight: 'bold', color: '#111827' }}>
                {truck.currentWaybill.destination.split(',')[0]}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
              <span style={{ color: '#6b7280' }}>ETA</span>
              <span style={{ fontWeight: 'bold', color: '#16a34a' }}>
                {getETAString(truck.currentWaybill.estimatedArrival)}
              </span>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                <span style={{ color: '#6b7280' }}>Progress</span>
                <span style={{ color: '#111827', fontWeight: 'bold' }}>{truck.currentWaybill.progress}%</span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '4px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${truck.currentWaybill.progress}%`,
                    backgroundColor: style.progressColor,
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== MAIN COMPONENT ====================
const LiveTracking: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'map' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState<TruckLocation | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  // Filter trucks
  const filteredTrucks = useMemo(() => {
    let result = [...MOCK_TRUCKS];

    if (statusFilter !== 'all') {
      result = result.filter(t => t.status === statusFilter);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t =>
        t.truckName.toLowerCase().includes(q) ||
        t.licensePlate.toLowerCase().includes(q) ||
        t.driverName.toLowerCase().includes(q) ||
        t.location.address?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [statusFilter, searchQuery]);

  // Refresh
  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setLastRefreshed(new Date());
      setIsLoading(false);
    }, 800);
  }, []);

  // Stats
  const stats = useMemo(() => ({
    total: MOCK_TRUCKS.length,
    inTransit: MOCK_TRUCKS.filter(t => t.status === 'in_transit').length,
    idle: MOCK_TRUCKS.filter(t => t.status === 'idle' || t.status === 'loading').length,
    issues: MOCK_TRUCKS.filter(t => t.status === 'maintenance' || t.status === 'offline').length,
    activeDrivers: MOCK_TRUCKS.filter(t => t.driverName).length
  }), []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #f8fafc, #f1f5f9)',
        padding: '24px 16px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#2563eb',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <MapPin size={24} style={{ color: 'white' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
              Live Tracking
            </h1>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
              Real-time fleet monitoring
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          padding: '20px',
          marginBottom: '24px'
        }}
      >
        {/* Search & Filters */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
                pointerEvents: 'none'
              }}
            />
            <input
              type="text"
              placeholder="Search trucks, drivers, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px 10px 40px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#2563eb';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Status Filter */}
          <div style={{ position: 'relative' }}>
            <Filter
              size={18}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
                pointerEvents: 'none'
              }}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px 10px 40px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                cursor: 'pointer',
                backgroundColor: 'white',
                transition: 'all 0.2s',
                appearance: 'none'
              }}
            >
              <option value="all">All Status</option>
              <option value="in_transit">In Transit</option>
              <option value="idle">Idle</option>
              <option value="loading">Loading</option>
              <option value="maintenance">Maintenance</option>
              <option value="offline">Offline</option>
            </select>
            <ChevronDown
              size={16}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
                pointerEvents: 'none'
              }}
            />
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
          >
            <RefreshCw size={16} style={{ animation: isLoading ? 'spin 1s linear infinite' : 'none' }} />
            Refresh
          </button>
        </div>

        {/* Last Updated */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '16px',
            borderTop: '1px solid #e5e7eb'
          }}
        >
          <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
            Last updated: <strong>{lastRefreshed.toLocaleTimeString()}</strong>
          </p>
          <select
            defaultValue="30"
            style={{
              padding: '6px 10px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '12px',
              cursor: 'pointer',
              backgroundColor: 'white',
              outline: 'none'
            }}
          >
            <option value="10">Every 10s</option>
            <option value="30">Every 30s</option>
            <option value="60">Every 1m</option>
            <option value="300">Every 5m</option>
            <option value="0">Manual</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          marginBottom: '24px',
          display: 'flex',
          gap: '12px',
          borderBottom: '2px solid #e5e7eb'
        }}
      >
        {['map', 'list'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as 'map' | 'list')}
            style={{
              padding: '12px 20px',
              border: 'none',
              backgroundColor: 'transparent',
              borderBottom: activeTab === tab ? '3px solid #2563eb' : 'none',
              color: activeTab === tab ? '#2563eb' : '#6b7280',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: activeTab === tab ? '600' : '500',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              textTransform: 'capitalize'
            }}
          >
            {tab === 'map' ? <MapPin size={16} /> : <Truck size={16} />}
            {tab} View
          </button>
        ))}
      </div>

      {/* Map Tab */}
      {activeTab === 'map' && (
        <>
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              marginBottom: '24px'
            }}
          >
            <div
              style={{
                height: '400px',
                background: 'linear-gradient(135deg, #e0f2fe 0%, #e0e7ff 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
            >
              <MapPin size={64} style={{ color: 'rgba(37, 99, 235, 0.3)', marginBottom: '16px' }} />
              <p style={{ fontSize: '18px', fontWeight: '600', color: '#1e40af', marginBottom: '8px' }}>
                Map Integration Ready
              </p>
              <p style={{ fontSize: '14px', color: '#1e40af', textAlign: 'center', maxWidth: '400px' }}>
                Google Maps, Mapbox, or Leaflet integration can be added here for real-time tracking visualization
              </p>

              {/* Map Controls */}
              <button
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#374151',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
              >
                <Layers size={14} />
                Layers
              </button>
            </div>
          </div>

          {/* Selected Truck Details */}
          {selectedTruck && (
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                padding: '24px',
                marginBottom: '24px'
              }}
            >
              <h2
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#111827',
                  margin: '0 0 16px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <MapPin size={20} style={{ color: '#2563eb' }} />
                {selectedTruck.truckName} Details
              </h2>
              <TruckCard truck={selectedTruck} isSelected={true} onClick={() => {}} />
            </div>
          )}
        </>
      )}

      {/* List Tab */}
      {activeTab === 'list' && (
        <div style={{ marginBottom: '24px' }}>
          {filteredTrucks.length === 0 ? (
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '60px 20px',
                textAlign: 'center'
              }}
            >
              <AlertTriangle size={48} style={{ color: '#d1d5db', margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
                No trucks found
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '16px'
              }}
            >
              {filteredTrucks.map(truck => (
                <TruckCard
                  key={truck.id}
                  truck={truck}
                  isSelected={selectedTruck?.id === truck.id}
                  onClick={(t) => {
                    setSelectedTruck(t);
                    setActiveTab('map');
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {[
          { label: 'Total Fleet', value: stats.total, icon: '🚚', color: '#2563eb' },
          { label: 'In Transit', value: stats.inTransit, icon: '📍', color: '#16a34a' },
          { label: 'Idle/Loading', value: stats.idle, icon: '⏸️', color: '#ea580c' },
          { label: 'Issues', value: stats.issues, icon: '⚠️', color: '#dc2626' }
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              transition: 'box-shadow 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)')}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>{stat.label}</p>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: stat.color, margin: '8px 0 0 0' }}>
                  {stat.value}
                </p>
              </div>
              <span style={{ fontSize: '40px', opacity: 0.2 }}>{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LiveTracking;