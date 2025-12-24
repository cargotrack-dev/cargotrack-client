// src/features/Drivers/pages/DriverDetails.tsx
// 🚀 MODERNIZED with Working Edit & Message Functions

import React, { useState, useMemo } from 'react';
import {
  ArrowLeft, Mail, MapPin, Award, FileText, Truck,
  Download, Upload, Trash2, Edit2, TrendingUp, Phone as PhoneIcon, X
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

// ==================== TYPES ====================
interface License {
  type: string;
  number: string;
  expiryDate: string;
  status: 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED';
  restrictions: string[];
}

interface Document {
  id: string;
  name: string;
  type: string;
  uploadedDate: string;
  expiryDate?: string;
  status: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED';
  fileSize: string;
}

interface Shipment {
  id: string;
  trackingNumber: string;
  origin: string;
  destination: string;
  status: 'DELIVERED' | 'IN_TRANSIT' | 'CANCELLED';
  completedDate: string;
  revenue: number;
  clientRating: number;
}

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
  profileImage?: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
  };
  assignedTruck?: {
    id: string;
    name: string;
    licensePlate: string;
  };
  licenses: License[];
  documents: Document[];
  shipments: Shipment[];
}

// ==================== MOCK DATA ====================
const MOCK_DRIVER: Driver = {
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
  profileImage: '👨‍💼',
  address: '123 Oak Street, Los Angeles, CA 90001',
  emergencyContact: {
    name: 'Mary Smith',
    phone: '+1 (555) 234-5679'
  },
  assignedTruck: {
    id: 't1',
    name: 'Truck-001',
    licensePlate: 'XYZ-1234'
  },
  licenses: [
    { type: 'Class A CDL', number: 'DL-1234567-CA', expiryDate: '2026-05-20', status: 'ACTIVE', restrictions: [] },
    { type: 'Class B', number: 'DL-0987654-CA', expiryDate: '2024-12-15', status: 'EXPIRING_SOON', restrictions: ['No doubles'] }
  ],
  documents: [
    { id: 'doc1', name: 'Medical Certificate', type: 'Certificate', uploadedDate: '2024-01-10', expiryDate: '2025-01-10', status: 'VALID', fileSize: '2.3 MB' },
    { id: 'doc2', name: 'Background Check', type: 'Verification', uploadedDate: '2023-06-20', status: 'VALID', fileSize: '1.1 MB' },
    { id: 'doc3', name: 'Insurance Form', type: 'Insurance', uploadedDate: '2024-03-15', expiryDate: '2025-03-15', status: 'EXPIRING_SOON', fileSize: '0.8 MB' }
  ],
  shipments: [
    { id: 'ship1', trackingNumber: 'TRK-2024-001', origin: 'Los Angeles, CA', destination: 'San Francisco, CA', status: 'DELIVERED', completedDate: '2024-12-20', revenue: 450, clientRating: 5 },
    { id: 'ship2', trackingNumber: 'TRK-2024-002', origin: 'San Francisco, CA', destination: 'Sacramento, CA', status: 'DELIVERED', completedDate: '2024-12-18', revenue: 350, clientRating: 4.8 },
    { id: 'ship3', trackingNumber: 'TRK-2024-003', origin: 'Sacramento, CA', destination: 'Los Angeles, CA', status: 'DELIVERED', completedDate: '2024-12-15', revenue: 500, clientRating: 5 }
  ]
};

// ==================== UTILITY FUNCTIONS ====================
const formatDate = (date: string): string => new Date(date).toLocaleDateString('en-US', {
  month: 'long', day: 'numeric', year: 'numeric'
});

const formatCurrency = (amount: number): string => `$${amount.toLocaleString()}`;

const getDaysUntilExpiry = (expiryDate: string): number => {
  const diffMs = new Date(expiryDate).getTime() - Date.now();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

const getExpiryStatus = (expiryDate: string): 'VALID' | 'EXPIRING_SOON' | 'EXPIRED' => {
  const daysUntil = getDaysUntilExpiry(expiryDate);
  if (daysUntil < 0) return 'EXPIRED';
  if (daysUntil <= 30) return 'EXPIRING_SOON';
  return 'VALID';
};

const STATUS_COLORS = {
  ACTIVE: { bgColor: '#dcfce7', textColor: '#166534', label: 'Active' },
  ON_LEAVE: { bgColor: '#fef3c7', textColor: '#92400e', label: 'On Leave' },
  INACTIVE: { bgColor: '#f3f4f6', textColor: '#374151', label: 'Inactive' }
};

const DOCUMENT_STATUS_COLORS = {
  VALID: { icon: '✅', color: '#16a34a', bgColor: '#f0fdf4' },
  EXPIRING_SOON: { icon: '⚠️', color: '#ea580c', bgColor: '#fff7ed' },
  EXPIRED: { icon: '❌', color: '#dc2626', bgColor: '#fef2f2' }
};

// ==================== DOCUMENT CARD ====================
interface DocumentCardProps {
  document: Document;
  onDownload: () => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, onDownload }) => {
  const statusConfig = DOCUMENT_STATUS_COLORS[document.status];
  const daysUntil = document.expiryDate ? getDaysUntilExpiry(document.expiryDate) : null;

  return (
    <div
      style={{
        backgroundColor: statusConfig.bgColor,
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '12px',
        transition: 'box-shadow 0.3s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '24px' }}>{statusConfig.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h4 style={{ fontWeight: 'bold', color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {document.name}
              </h4>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>{document.type}</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
            <span>📤 {formatDate(document.uploadedDate)}</span>
            {document.expiryDate && (
              <span style={{ color: daysUntil !== null && daysUntil < 0 ? '#dc2626' : '#6b7280', fontWeight: daysUntil !== null && daysUntil < 0 ? 'bold' : 'normal' }}>
                📅 Expires: {formatDate(document.expiryDate)}
                {daysUntil !== null && daysUntil < 0 && ' (EXPIRED)'}
              </span>
            )}
            <span>💾 {document.fileSize}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={onDownload}
            style={{
              width: '32px',
              height: '32px',
              padding: '0',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '6px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <Download size={16} />
          </button>
          <button
            style={{
              width: '32px',
              height: '32px',
              padding: '0',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '6px',
              color: '#dc2626',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fee2e2')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== SHIPMENT ROW ====================
interface ShipmentRowProps {
  shipment: Shipment;
  onView: (shipment: Shipment) => void;
}

const ShipmentRow: React.FC<ShipmentRowProps> = ({ shipment, onView }) => {
  const statusConfig = {
    DELIVERED: { icon: '✅', bgColor: '#f0fdf4' },
    IN_TRANSIT: { icon: '🚚', bgColor: '#eff6ff' },
    CANCELLED: { icon: '❌', bgColor: '#f9fafb' }
  };

  const config = statusConfig[shipment.status];

  return (
    <div
      style={{
        backgroundColor: config.bgColor,
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '12px',
        cursor: 'pointer',
        transition: 'box-shadow 0.3s ease'
      }}
      onClick={() => onView(shipment)}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '20px' }}>{config.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h4 style={{ fontWeight: 'bold', color: '#111827', margin: 0 }}>{shipment.trackingNumber}</h4>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {shipment.origin} → {shipment.destination}
              </p>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827' }}>{shipment.clientRating}</span>
            <span>⭐</span>
          </div>
          <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#16a34a', margin: '0' }}>{formatCurrency(shipment.revenue)}</p>
          <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>{formatDate(shipment.completedDate)}</p>
        </div>
      </div>
    </div>
  );
};

// ==================== EDIT MODAL ====================
interface EditModalProps {
  driver: Driver;
  onClose: () => void;
  onSave: (updatedDriver: Driver) => void;
}

const EditModal: React.FC<EditModalProps> = ({ driver, onClose, onSave }) => {
  const [formData, setFormData] = React.useState(driver);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
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
      onClick={onClose}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
            Edit Driver
          </h2>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />
          </div>

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
                cursor: 'pointer'
              }}
            >
              <option value="ACTIVE">Active</option>
              <option value="ON_LEAVE">On Leave</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

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
                fontWeight: '600'
              }}
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '10px 16px',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==================== MESSAGE MODAL ====================
interface MessageModalProps {
  driver: Driver;
  onClose: () => void;
  onSend: (message: string) => void;
}

const MessageModal: React.FC<MessageModalProps> = ({ driver, onClose, onSend }) => {
  const [message, setMessage] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage('');
      onClose();
    }
  };

  return (
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
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
          padding: '32px',
          maxWidth: '500px',
          width: '90%'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
            Send Message to {driver.name}
          </h2>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              rows={4}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
                outline: 'none',
                fontFamily: 'inherit',
                resize: 'none'
              }}
            />
          </div>

          <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
            Message will be sent to {driver.email}
          </p>

          <div style={{ display: 'flex', gap: '12px' }}>
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
                fontWeight: '600'
              }}
            >
              Send Message
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '10px 16px',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================
const DriverDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [driver, setDriver] = React.useState<Driver>(MOCK_DRIVER);
  const [activeTab, setActiveTab] = React.useState('license');
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showMessageModal, setShowMessageModal] = React.useState(false);

  const statusConfig = STATUS_COLORS[driver.status];
  const licenseStatus = getExpiryStatus(driver.licenseExpiry);
  const licenseStatusConfig = DOCUMENT_STATUS_COLORS[licenseStatus];

  const stats = useMemo(() => ({
    totalShipments: driver.shipments.length,
    totalRevenue: driver.shipments.reduce((sum, s) => sum + s.revenue, 0),
    averageRating: driver.averageRating,
    expiringDocuments: driver.documents.filter(d => d.status === 'EXPIRING_SOON' || d.status === 'EXPIRED').length
  }), [driver]);

  const handleSaveDriver = (updatedDriver: Driver) => {
    setDriver(updatedDriver);
    alert('Driver updated successfully!');
  };

  const handleSendMessage = (message: string) => {
    console.log(`Message sent to ${driver.name}: ${message}`);
    alert(`Message sent to ${driver.name}!`);
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
      {/* Back Button */}
      <button
        onClick={() => navigate('/drivers')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#2563eb',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '24px',
          transition: 'color 0.2s'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#1d4ed8')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#2563eb')}
      >
        <ArrowLeft size={16} />
        Back to Drivers
      </button>

      {/* Header Card */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          marginBottom: '24px'
        }}
      >
        {/* Gradient Top */}
        <div
          style={{
            height: '96px',
            background: 'linear-gradient(to right, #3b82f6, #1d4ed8)'
          }}
        ></div>

        {/* Content */}
        <div style={{ padding: '24px', marginTop: '-48px', position: 'relative' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            {/* Profile Section */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px' }}>
              <div
                style={{
                  width: '128px',
                  height: '128px',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  border: '4px solid #2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  fontSize: '48px'
                }}
              >
                {driver.profileImage}
              </div>

              <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', margin: '0' }}>
                  {driver.name}
                </h1>
                <p style={{ color: '#6b7280', margin: '4px 0 0 0' }}>Driver ID: {driver.id}</p>

                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <span
                    style={{
                      backgroundColor: statusConfig.bgColor,
                      color: statusConfig.textColor,
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '500'
                    }}
                  >
                    {statusConfig.label}
                  </span>
                  <span
                    style={{
                      border: '1px solid #e5e7eb',
                      color: '#6b7280',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '500'
                    }}
                  >
                    Hired {formatDate(driver.hireDate)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setShowEditModal(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    border: '1px solid #e5e7eb',
                    backgroundColor: 'white',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
                >
                  <Edit2 size={16} />
                  Edit
                </button>
                <button
                  onClick={() => setShowMessageModal(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    border: '1px solid #e5e7eb',
                    backgroundColor: 'white',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
                >
                  <Mail size={16} />
                  Message
                </button>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div
            style={{
              paddingTop: '24px',
              borderTop: '1px solid #e5e7eb',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px'
            }}
          >
            <div>
              <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '4px' }}>Email</p>
              <a
                href={`mailto:${driver.email}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#2563eb',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#1d4ed8')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#2563eb')}
              >
                <Mail size={16} />
                {driver.email}
              </a>
            </div>

            <div>
              <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '4px' }}>Phone</p>
              <a
                href={`tel:${driver.phone}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#2563eb',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#1d4ed8')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#2563eb')}
              >
                <PhoneIcon size={16} />
                {driver.phone}
              </a>
            </div>

            <div>
              <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '4px' }}>Address</p>
              <p
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  fontSize: '14px',
                  color: '#374151',
                  margin: 0
                }}
              >
                <MapPin size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                {driver.address}
              </p>
            </div>

            <div>
              <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '4px' }}>Emergency Contact</p>
              <p style={{ fontSize: '14px', color: '#374151', fontWeight: '500', margin: 0 }}>
                {driver.emergencyContact.name}
              </p>
              <a
                href={`tel:${driver.emergencyContact.phone}`}
                style={{
                  color: '#2563eb',
                  textDecoration: 'none',
                  fontSize: '12px',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#1d4ed8')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#2563eb')}
              >
                {driver.emergencyContact.phone}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px',
          marginBottom: '24px'
        }}
      >
        {[
          { label: 'Total Shipments', value: stats.totalShipments, icon: '📦' },
          { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: '💰' },
          { label: 'Avg Rating', value: `${stats.averageRating}★`, icon: '⭐' },
          { label: 'Expiring Docs', value: stats.expiringDocuments, icon: '⚠️', highlight: stats.expiringDocuments > 0 }
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              backgroundColor: stat.highlight ? '#fef3c7' : 'white',
              border: stat.highlight ? '1px solid #fcd34d' : '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '16px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              transition: 'box-shadow 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)')}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>{stat.icon}</div>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: 0, marginBottom: '4px' }}>{stat.label}</p>
            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: 0 }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
        {/* Tab List */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb'
          }}
        >
          {[
            { id: 'license', label: 'License', icon: '🏆' },
            { id: 'vehicle', label: 'Vehicle', icon: '🚚' },
            { id: 'documents', label: 'Documents', icon: '📄' },
            { id: 'shipments', label: 'Shipments', icon: '📈' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: 'none',
                backgroundColor: activeTab === tab.id ? 'white' : 'transparent',
                color: activeTab === tab.id ? '#2563eb' : '#6b7280',
                fontSize: '14px',
                fontWeight: activeTab === tab.id ? '600' : '500',
                cursor: 'pointer',
                borderBottom: activeTab === tab.id ? '2px solid #2563eb' : 'none',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.color = '#374151';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.color = '#6b7280';
                }
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ padding: '24px' }}>
          {/* License Tab */}
          {activeTab === 'license' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                  <Award size={20} />
                  Driver License
                </h2>
                <span
                  style={{
                    backgroundColor: licenseStatusConfig.bgColor,
                    color: licenseStatusConfig.color,
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}
                >
                  {licenseStatusConfig.icon} {licenseStatus}
                </span>
              </div>

              {driver.licenses.map((license, i) => (
                <div
                  key={i}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '16px'
                  }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '16px',
                      marginBottom: '16px'
                    }}
                  >
                    <div>
                      <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '4px' }}>Type</p>
                      <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827', margin: 0 }}>{license.type}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '4px' }}>License Number</p>
                      <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827', margin: 0 }}>{license.number}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '4px' }}>Expiry Date</p>
                      <p style={{ fontSize: '14px', color: '#111827', margin: 0 }}>{formatDate(license.expiryDate)}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '4px' }}>Status</p>
                      <span
                        style={{
                          backgroundColor: DOCUMENT_STATUS_COLORS[getExpiryStatus(license.expiryDate)].bgColor,
                          color: DOCUMENT_STATUS_COLORS[getExpiryStatus(license.expiryDate)].color,
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '500',
                          display: 'inline-block'
                        }}
                      >
                        {getExpiryStatus(license.expiryDate)}
                      </span>
                    </div>
                  </div>

                  {license.restrictions.length > 0 && (
                    <div>
                      <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>Restrictions</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {license.restrictions.map((r, j) => (
                          <span
                            key={j}
                            style={{
                              border: '1px solid #e5e7eb',
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              color: '#6b7280'
                            }}
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Vehicle Tab */}
          {activeTab === 'vehicle' && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 24px 0' }}>
                <Truck size={20} />
                Assigned Vehicle
              </h2>

              {driver.assignedTruck ? (
                <div
                  style={{
                    backgroundColor: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '8px',
                    padding: '16px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px'
                  }}
                >
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '4px' }}>Truck Name</p>
                    <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827', margin: 0 }}>{driver.assignedTruck.name}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '4px' }}>License Plate</p>
                    <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827', margin: 0 }}>{driver.assignedTruck.licensePlate}</p>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>🚚</div>
                  <p style={{ color: '#6b7280', margin: 0 }}>No vehicle currently assigned</p>
                </div>
              )}
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                  <FileText size={20} />
                  Documents
                </h2>
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
                >
                  <Upload size={16} />
                  Upload
                </button>
              </div>

              {driver.documents.map(doc => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  onDownload={() => alert(`Downloading ${doc.name}...`)}
                />
              ))}
            </div>
          )}

          {/* Shipments Tab */}
          {activeTab === 'shipments' && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 24px 0' }}>
                <TrendingUp size={20} />
                Recent Shipments
              </h2>

              {driver.shipments.map(shipment => (
                <ShipmentRow
                  key={shipment.id}
                  shipment={shipment}
                  onView={(s) => alert(`Viewing shipment: ${s.trackingNumber}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditModal
          driver={driver}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveDriver}
        />
      )}

      {/* Message Modal */}
      {showMessageModal && (
        <MessageModal
          driver={driver}
          onClose={() => setShowMessageModal(false)}
          onSend={handleSendMessage}
        />
      )}
    </div>
  );
};

export default DriverDetails;