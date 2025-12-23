// src/features/Shipments/pages/ShipmentListPage.tsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Eye, MapPin, Package, Calendar } from 'lucide-react';

interface Shipment {
  id: string;
  reference: string;
  status: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'DELAYED';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  origin: { city: string; country: string };
  destination: { city: string; country: string };
  description: string;
  createdAt: string;
  estimatedDelivery: string;
  currentLocation?: string;
  driver?: string;
  vehicle?: string;
}

interface ShipmentFilters {
  status: string;
  priority: string;
  search: string;
}

const mockShipments: Shipment[] = [
  {
    id: '1',
    reference: 'SHIP-2024-001',
    status: 'IN_TRANSIT',
    priority: 'HIGH',
    origin: { city: 'Lagos', country: 'Nigeria' },
    destination: { city: 'Abuja', country: 'Nigeria' },
    description: 'Electronics shipment',
    createdAt: '2024-01-15',
    estimatedDelivery: '2024-01-20',
    currentLocation: 'Ogun State',
    driver: 'John Doe',
    vehicle: 'ABC-123',
  },
  {
    id: '2',
    reference: 'SHIP-2024-002',
    status: 'DELIVERED',
    priority: 'NORMAL',
    origin: { city: 'Port Harcourt', country: 'Nigeria' },
    destination: { city: 'Lagos', country: 'Nigeria' },
    description: 'Food supplies',
    createdAt: '2024-01-10',
    estimatedDelivery: '2024-01-18',
    currentLocation: 'Lagos',
    driver: 'Jane Smith',
    vehicle: 'XYZ-789',
  },
  {
    id: '3',
    reference: 'SHIP-2024-003',
    status: 'PENDING',
    priority: 'URGENT',
    origin: { city: 'Kano', country: 'Nigeria' },
    destination: { city: 'Lagos', country: 'Nigeria' },
    description: 'Urgent medical supplies',
    createdAt: '2024-01-22',
    estimatedDelivery: '2024-01-25',
    currentLocation: 'Kano',
    driver: 'Mike Johnson',
    vehicle: 'DEF-456',
  },
  {
    id: '4',
    reference: 'SHIP-2024-004',
    status: 'DELAYED',
    priority: 'HIGH',
    origin: { city: 'Ibadan', country: 'Nigeria' },
    destination: { city: 'Abuja', country: 'Nigeria' },
    description: 'Manufacturing parts',
    createdAt: '2024-01-12',
    estimatedDelivery: '2024-01-19',
    currentLocation: 'Kwara State',
    driver: 'Sarah Lee',
    vehicle: 'GHI-012',
  },
];

const ShipmentListPage: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ShipmentFilters>({
    status: 'ALL',
    priority: 'ALL',
    search: '',
  });

  const filteredShipments = useMemo(() => {
    return mockShipments.filter(shipment => {
      const matchesStatus = filters.status === 'ALL' || shipment.status === filters.status;
      const matchesPriority = filters.priority === 'ALL' || shipment.priority === filters.priority;
      const matchesSearch = filters.search === '' || 
        shipment.reference.toLowerCase().includes(filters.search.toLowerCase()) ||
        shipment.description.toLowerCase().includes(filters.search.toLowerCase());
      
      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [filters]);

  const getStatusConfig = (status: string) => {
    const configs: Record<string, any> = {
      'PENDING': { bg: '#fef3c7', text: '#92400e', badge: '#f59e0b', icon: '📋' },
      'IN_TRANSIT': { bg: '#bfdbfe', text: '#1e40af', badge: '#3b82f6', icon: '🚚' },
      'DELIVERED': { bg: '#dcfce7', text: '#166534', badge: '#22c55e', icon: '✓' },
      'DELAYED': { bg: '#fee2e2', text: '#991b1b', badge: '#ef4444', icon: '⚠️' },
    };
    return configs[status] || configs['PENDING'];
  };

  const getPriorityConfig = (priority: string) => {
    const configs: Record<string, any> = {
      'LOW': { color: '#6b7280', icon: '📦' },
      'NORMAL': { color: '#3b82f6', icon: '📦' },
      'HIGH': { color: '#f59e0b', icon: '⚡' },
      'URGENT': { color: '#ef4444', icon: '🚨' },
    };
    return configs[priority] || configs['NORMAL'];
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      padding: '32px',
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 900, color: '#1e293b', margin: 0, marginBottom: '8px' }}>
            📦 Shipment Management
          </h1>
          <p style={{ color: '#64748b', fontSize: '16px', margin: 0 }}>
            Track and manage all your shipments in real-time
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}>
          {[
            { label: 'Total Shipments', value: mockShipments.length, icon: '📦', color: '#3b82f6' },
            { label: 'In Transit', value: mockShipments.filter(s => s.status === 'IN_TRANSIT').length, icon: '🚚', color: '#06b6d4' },
            { label: 'Delivered', value: mockShipments.filter(s => s.status === 'DELIVERED').length, icon: '✓', color: '#10b981' },
            { label: 'Delayed', value: mockShipments.filter(s => s.status === 'DELAYED').length, icon: '⚠️', color: '#ef4444' },
          ].map((stat, i) => (
            <div key={i} style={{
              padding: '20px',
              background: 'white',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ color: '#64748b', fontSize: '12px', fontWeight: '600', margin: 0, marginBottom: '8px' }}>
                    {stat.label}
                  </p>
                  <p style={{ fontSize: '32px', fontWeight: 900, color: stat.color, margin: 0 }}>
                    {stat.value}
                  </p>
                </div>
                <div style={{ fontSize: '32px' }}>{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{
          padding: '24px',
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          marginBottom: '32px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Filter size={20} color='#64748b' />
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
              Filter Shipments
            </h3>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
          }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '12px', color: '#cbd5e1', width: '20px', height: '20px' }} />
              <input
                type='text'
                placeholder='Search by reference or description'
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#1e293b',
                  boxSizing: 'border-box',
                  transition: 'all 200ms',
                }}
                onFocus={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = '#3b82f6';
                  (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = '#e2e8f0';
                  (e.target as HTMLInputElement).style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              style={{
                padding: '12px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#1e293b',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 200ms',
              }}
              onFocus={(e) => {
                (e.target as HTMLSelectElement).style.borderColor = '#3b82f6';
                (e.target as HTMLSelectElement).style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                (e.target as HTMLSelectElement).style.borderColor = '#e2e8f0';
                (e.target as HTMLSelectElement).style.boxShadow = 'none';
              }}
            >
              <option value='ALL'>All Statuses</option>
              <option value='PENDING'>📋 Pending</option>
              <option value='IN_TRANSIT'>🚚 In Transit</option>
              <option value='DELIVERED'>✓ Delivered</option>
              <option value='DELAYED'>⚠️ Delayed</option>
            </select>

            {/* Priority Filter */}
            <select
              value={filters.priority}
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
              style={{
                padding: '12px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#1e293b',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 200ms',
              }}
              onFocus={(e) => {
                (e.target as HTMLSelectElement).style.borderColor = '#3b82f6';
                (e.target as HTMLSelectElement).style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                (e.target as HTMLSelectElement).style.borderColor = '#e2e8f0';
                (e.target as HTMLSelectElement).style.boxShadow = 'none';
              }}
            >
              <option value='ALL'>All Priorities</option>
              <option value='LOW'>📦 Low</option>
              <option value='NORMAL'>📦 Normal</option>
              <option value='HIGH'>⚡ High</option>
              <option value='URGENT'>🚨 Urgent</option>
            </select>
          </div>
        </div>

        {/* Shipments Grid */}
        {filteredShipments.length === 0 ? (
          <div style={{
            padding: '64px 32px',
            textAlign: 'center',
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
          }}>
            <p style={{ color: '#64748b', fontSize: '16px' }}>
              No shipments found matching your filters
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '24px',
          }}>
            {filteredShipments.map((shipment) => {
              const statusConfig = getStatusConfig(shipment.status);
              const priorityConfig = getPriorityConfig(shipment.priority);

              return (
                <div
                  key={shipment.id}
                  style={{
                    padding: '24px',
                    background: 'white',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                    transition: 'all 300ms',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.border = '1px solid #cbd5e1';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
                    (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.border = '1px solid #e2e8f0';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
                    (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
                  }}
                >
                  {/* Header */}
                  <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                        {shipment.reference}
                      </h3>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '6px',
                        background: priorityConfig.color,
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}>
                        {priorityConfig.icon} {shipment.priority}
                      </span>
                    </div>
                    <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
                      {shipment.description}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div style={{
                    padding: '12px',
                    borderRadius: '8px',
                    background: statusConfig.bg,
                    marginBottom: '16px',
                    textAlign: 'center',
                  }}>
                    <span style={{
                      color: statusConfig.text,
                      fontWeight: '600',
                      fontSize: '14px',
                    }}>
                      {statusConfig.icon} {shipment.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Route Info */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <MapPin size={16} color='#3b82f6' />
                      <span style={{ color: '#1e293b', fontSize: '13px', fontWeight: '500' }}>
                        {shipment.origin.city} → {shipment.destination.city}
                      </span>
                    </div>
                    {shipment.currentLocation && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '24px', color: '#64748b', fontSize: '12px' }}>
                        📍 Now in: {shipment.currentLocation}
                      </div>
                    )}
                  </div>

                  {/* Details Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    marginBottom: '16px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid #e2e8f0',
                  }}>
                    {[
                      { label: 'Driver', value: shipment.driver, icon: '👤' },
                      { label: 'Vehicle', value: shipment.vehicle, icon: '🚗' },
                      { label: 'Created', value: shipment.createdAt, icon: '📅' },
                      { label: 'Est. Delivery', value: shipment.estimatedDelivery, icon: '⏰' },
                    ].map((item, i) => (
                      <div key={i}>
                        <p style={{ color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600', margin: 0, marginBottom: '4px' }}>
                          {item.icon} {item.label}
                        </p>
                        <p style={{ color: '#1e293b', fontSize: '13px', fontWeight: '500', margin: 0 }}>
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* View Button */}
                  <button
                    onClick={() => navigate(`/shipments/${shipment.id}`)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 200ms',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                      (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                      (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                    }}
                  >
                    <Eye size={16} />
                    View Details
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Results Count */}
        <div style={{ textAlign: 'center', marginTop: '32px', color: '#64748b' }}>
          <p>Showing {filteredShipments.length} of {mockShipments.length} shipments</p>
        </div>
      </div>
    </div>
  );
};

export default ShipmentListPage;