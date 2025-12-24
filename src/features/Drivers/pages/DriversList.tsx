// src/features/Drivers/pages/DriversList.tsx
// 🚀 Modern Drivers List with Add Driver Button

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';

// ==================== TYPES ====================
interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
  hireDate: string;
  licenseNumber: string;
  licenseExpiry: string;
  totalShipments: number;
  totalRevenue: number;
  averageRating: number;
  address: string;
  profileImage?: string;
}

// ==================== MOCK DATA ====================
const MOCK_DRIVERS: Driver[] = [
  {
    id: 'drv1',
    name: 'John David Smith',
    email: 'john.smith@cargotrack.com',
    phone: '+1 (555) 234-5678',
    status: 'ACTIVE',
    hireDate: '2020-03-15',
    licenseNumber: 'DL-1234567-CA',
    licenseExpiry: '2026-05-20',
    totalShipments: 248,
    totalRevenue: 125000,
    averageRating: 4.8,
    address: '123 Oak Street, Los Angeles, CA 90001',
    profileImage: '👨‍💼'
  },
  {
    id: 'drv2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@cargotrack.com',
    phone: '+1 (555) 345-6789',
    status: 'ACTIVE',
    hireDate: '2019-07-20',
    licenseNumber: 'DL-0987654-NY',
    licenseExpiry: '2025-10-15',
    totalShipments: 312,
    totalRevenue: 156000,
    averageRating: 4.9,
    address: '456 Main Ave, New York, NY 10001',
    profileImage: '👩‍💼'
  },
  {
    id: 'drv3',
    name: 'Michael Rodriguez',
    email: 'michael.rodriguez@cargotrack.com',
    phone: '+1 (555) 456-7890',
    status: 'ACTIVE',
    hireDate: '2021-01-10',
    licenseNumber: 'DL-5555555-TX',
    licenseExpiry: '2027-03-22',
    totalShipments: 156,
    totalRevenue: 78000,
    averageRating: 4.6,
    address: '789 Tech Drive, Houston, TX 77001',
    profileImage: '👨‍💼'
  },
  {
    id: 'drv4',
    name: 'Emily Watson',
    email: 'emily.watson@cargotrack.com',
    phone: '+1 (555) 567-8901',
    status: 'ON_LEAVE',
    hireDate: '2020-11-05',
    licenseNumber: 'DL-6666666-FL',
    licenseExpiry: '2025-12-10',
    totalShipments: 189,
    totalRevenue: 94000,
    averageRating: 4.7,
    address: '321 Beach Road, Miami, FL 33101',
    profileImage: '👩‍💼'
  },
  {
    id: 'drv5',
    name: 'James Chen',
    email: 'james.chen@cargotrack.com',
    phone: '+1 (555) 678-9012',
    status: 'ACTIVE',
    hireDate: '2022-05-18',
    licenseNumber: 'DL-7777777-WA',
    licenseExpiry: '2028-06-20',
    totalShipments: 92,
    totalRevenue: 46000,
    averageRating: 4.5,
    address: '654 Pine Street, Seattle, WA 98101',
    profileImage: '👨‍💼'
  }
];

// ==================== UTILITY FUNCTIONS ====================
const formatCurrency = (amount: number): string => `$${(amount / 1000).toFixed(1)}K`;

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return { bgColor: '#dcfce7', textColor: '#166534', label: 'Active' };
    case 'ON_LEAVE':
      return { bgColor: '#fef3c7', textColor: '#92400e', label: 'On Leave' };
    case 'INACTIVE':
      return { bgColor: '#f3f4f6', textColor: '#374151', label: 'Inactive' };
    default:
      return { bgColor: '#f3f4f6', textColor: '#374151', label: status };
  }
};

// ==================== DRIVER CARD ====================
interface DriverCardProps {
  driver: Driver;
  onView: (id: string) => void;
  onEdit: (driver: Driver) => void;
  onDelete: (id: string) => void;
}

const DriverCard: React.FC<DriverCardProps> = ({ driver, onView, onEdit, onDelete }) => {
  const statusColor = getStatusColor(driver.status);

  return (
    <div
      style={{
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
      onClick={() => onView(driver.id)}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.15)';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '8px',
              backgroundColor: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}
          >
            {driver.profileImage}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: '0 0 4px 0' }}>
              {driver.name}
            </h3>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>Driver ID: {driver.id}</p>
          </div>
        </div>

        {/* Status Badge */}
        <span
          style={{
            backgroundColor: statusColor.bgColor,
            color: statusColor.textColor,
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            whiteSpace: 'nowrap'
          }}
        >
          {statusColor.label}
        </span>
      </div>

      {/* Info Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '16px',
          paddingBottom: '16px',
          borderBottom: '1px solid #e5e7eb'
        }}
      >
        <div>
          <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0', fontWeight: '600' }}>Email</p>
          <a
            href={`mailto:${driver.email}`}
            style={{
              fontSize: '13px',
              color: '#2563eb',
              textDecoration: 'none',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#1d4ed8')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#2563eb')}
          >
            {driver.email}
          </a>
        </div>

        <div>
          <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0', fontWeight: '600' }}>Phone</p>
          <a
            href={`tel:${driver.phone}`}
            style={{
              fontSize: '13px',
              color: '#2563eb',
              textDecoration: 'none'
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#1d4ed8')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#2563eb')}
          >
            {driver.phone}
          </a>
        </div>

        <div>
          <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0', fontWeight: '600' }}>Shipments</p>
          <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827', margin: 0 }}>{driver.totalShipments}</p>
        </div>

        <div>
          <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0', fontWeight: '600' }}>Rating</p>
          <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#16a34a', margin: 0 }}>
            {driver.averageRating}⭐
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(driver);
          }}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '8px 12px',
            border: '1px solid #e5e7eb',
            backgroundColor: 'white',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500',
            color: '#374151',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
            e.currentTarget.style.borderColor = '#2563eb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.borderColor = '#e5e7eb';
          }}
        >
          <Edit2 size={14} />
          Edit
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(driver.id);
          }}
          style={{
            width: '36px',
            height: '36px',
            padding: '0',
            border: '1px solid #fee2e2',
            backgroundColor: '#fef2f2',
            borderRadius: '6px',
            cursor: 'pointer',
            color: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#fecaca';
            e.currentTarget.style.borderColor = '#dc2626';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#fef2f2';
            e.currentTarget.style.borderColor = '#fee2e2';
          }}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================
const DriversList: React.FC = () => {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState<Driver[]>(MOCK_DRIVERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  const filteredDrivers = useMemo(() => {
    return drivers.filter(driver =>
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone.includes(searchTerm) ||
      driver.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [drivers, searchTerm]);

  const handleAddDriver = () => {
    setEditingDriver(null);
    setShowForm(true);
  };

  const handleEditDriver = (driver: Driver) => {
    setEditingDriver(driver);
    setShowForm(true);
  };

  const handleDeleteDriver = (id: string) => {
    if (confirm('Are you sure you want to delete this driver?')) {
      setDrivers(drivers.filter(d => d.id !== id));
    }
  };

  const handleSaveDriver = (driverData: Partial<Driver>) => {
    if (editingDriver) {
      // Update existing
      setDrivers(drivers.map(d => d.id === editingDriver.id ? { ...d, ...driverData } : d));
    } else {
      // Add new
      const newDriver: Driver = {
        id: `drv${Date.now()}`,
        name: driverData.name || '',
        email: driverData.email || '',
        phone: driverData.phone || '',
        status: driverData.status || 'ACTIVE',
        hireDate: driverData.hireDate || new Date().toISOString().split('T')[0],
        licenseNumber: driverData.licenseNumber || '',
        licenseExpiry: driverData.licenseExpiry || '',
        totalShipments: driverData.totalShipments || 0,
        totalRevenue: driverData.totalRevenue || 0,
        averageRating: driverData.averageRating || 0,
        address: driverData.address || '',
        profileImage: '👨‍💼'
      };
      setDrivers([...drivers, newDriver]);
    }
    setShowForm(false);
  };

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
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Drivers</h1>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '8px 0 0 0' }}>
              Manage your logistics team
            </p>
          </div>

          <button
            onClick={handleAddDriver}
            style={{
              display: 'flex',
              alignItems: 'center',
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
            <Plus size={18} />
            Add Driver
          </button>
        </div>

        {/* Search */}
        <div style={{ marginBottom: '24px', maxWidth: '400px' }}>
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '12px',
                color: '#9ca3af',
                pointerEvents: 'none'
              }}
            />
            <input
              type="text"
              placeholder="Search drivers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px 10px 40px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#2563eb';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
              }}
            />
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'Total Drivers', value: drivers.length, icon: '👥' },
            { label: 'Active', value: drivers.filter(d => d.status === 'ACTIVE').length, icon: '✅' },
            { label: 'On Leave', value: drivers.filter(d => d.status === 'ON_LEAVE').length, icon: '⏸️' },
            { label: 'Total Shipments', value: drivers.reduce((sum, d) => sum + d.totalShipments, 0), icon: '📦' }
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '16px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.icon}</div>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>{stat.label}</p>
              <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: 0 }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Drivers Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filteredDrivers.map(driver => (
            <DriverCard
              key={driver.id}
              driver={driver}
              onView={(id) => navigate(`/drivers/${id}`)}
              onEdit={handleEditDriver}
              onDelete={handleDeleteDriver}
            />
          ))}
        </div>

        {filteredDrivers.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
              No drivers found
            </h3>
            <p style={{ color: '#6b7280' }}>Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div
          style={{
            position: 'fixed',
            inset: '0',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setShowForm(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
              padding: '32px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: '0 0 24px 0' }}>
              {editingDriver ? 'Edit Driver' : 'Add New Driver'}
            </h2>

            <DriversForm
              driver={editingDriver}
              onSave={(data) => {
                handleSaveDriver(data);
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== DRIVERS FORM ====================
interface DriversFormProps {
  driver?: Driver | null;
  onSave: (driverData: Partial<Driver>) => void;
  onCancel: () => void;
}

const DriversForm: React.FC<DriversFormProps> = ({ driver, onSave, onCancel }) => {
  const [formData, setFormData] = React.useState({
    name: driver?.name || '',
    email: driver?.email || '',
    phone: driver?.phone || '',
    status: driver?.status || 'ACTIVE',
    address: driver?.address || '',
    licenseNumber: driver?.licenseNumber || '',
    licenseExpiry: driver?.licenseExpiry || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Name */}
      <div>
        <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>
          Full Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="John David Smith"
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box',
            outline: 'none',
            transition: 'all 0.2s'
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = '#2563eb')}
          onBlur={(e) => (e.currentTarget.style.borderColor = '#d1d5db')}
        />
      </div>

      {/* Email */}
      <div>
        <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>
          Email *
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="john@cargotrack.com"
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box',
            outline: 'none',
            transition: 'all 0.2s'
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = '#2563eb')}
          onBlur={(e) => (e.currentTarget.style.borderColor = '#d1d5db')}
        />
      </div>

      {/* Phone */}
      <div>
        <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>
          Phone *
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          placeholder="+1 (555) 234-5678"
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box',
            outline: 'none',
            transition: 'all 0.2s'
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = '#2563eb')}
          onBlur={(e) => (e.currentTarget.style.borderColor = '#d1d5db')}
        />
      </div>

      {/* Address */}
      <div>
        <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>
          Address
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="123 Oak Street, Los Angeles, CA 90001"
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box',
            outline: 'none',
            transition: 'all 0.2s'
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = '#2563eb')}
          onBlur={(e) => (e.currentTarget.style.borderColor = '#d1d5db')}
        />
      </div>

      {/* License */}
      <div>
        <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>
          License Number
        </label>
        <input
          type="text"
          name="licenseNumber"
          value={formData.licenseNumber}
          onChange={handleChange}
          placeholder="DL-1234567-CA"
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box',
            outline: 'none',
            transition: 'all 0.2s'
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = '#2563eb')}
          onBlur={(e) => (e.currentTarget.style.borderColor = '#d1d5db')}
        />
      </div>

      {/* License Expiry */}
      <div>
        <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>
          License Expiry
        </label>
        <input
          type="date"
          name="licenseExpiry"
          value={formData.licenseExpiry}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box',
            outline: 'none',
            transition: 'all 0.2s'
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = '#2563eb')}
          onBlur={(e) => (e.currentTarget.style.borderColor = '#d1d5db')}
        />
      </div>

      {/* Status */}
      <div>
        <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>
          Status
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box',
            outline: 'none',
            transition: 'all 0.2s',
            cursor: 'pointer'
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = '#2563eb')}
          onBlur={(e) => (e.currentTarget.style.borderColor = '#d1d5db')}
        >
          <option value="ACTIVE">Active</option>
          <option value="ON_LEAVE">On Leave</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        <button
          type="submit"
          style={{
            flex: 1,
            padding: '10px 16px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
        >
          Save Driver
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            flex: 1,
            padding: '10px 16px',
            backgroundColor: '#f3f4f6',
            color: '#374151',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e5e7eb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default DriversList;