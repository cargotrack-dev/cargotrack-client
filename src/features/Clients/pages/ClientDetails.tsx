// src/features/Clients/pages/ClientDetails.tsx
// 🎨 MODERN UI/UX - All Inline Styles, Zero Tailwind

import React, { useState, useMemo } from 'react';
import { ArrowLeft, Edit2, Plus, Package, FileText, Bell, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ==================== TYPES ====================
interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
  address?: Address;
}

// ==================== MOCK DATA ====================
const MOCK_CLIENT: Client = {
  id: '1',
  name: 'John Smith',
  email: 'john.smith@example.com',
  phone: '+234 801 234 5678',
  company: 'ABC Logistics Nigeria',
  status: 'active',
  createdAt: '2024-01-15',
  updatedAt: '2025-01-20',
  address: {
    street: '123 Lekki Expressway',
    city: 'Lagos',
    state: 'Lagos',
    postalCode: '106104',
    country: 'Nigeria'
  }
};

// ==================== STYLES & CONFIGS ====================
const STATUS_COLORS = {
  active: { bg: '#d1fae5', text: '#065f46', icon: '🟢' },
  pending: { bg: '#fef3c7', text: '#92400e', icon: '🟡' },
  inactive: { bg: '#f3f4f6', text: '#374151', icon: '⚪' }
};

const TAB_ICONS: Record<string, string> = {
  overview: '📋',
  shipments: '📦',
  quotes: '💰',
  invoices: '📄',
  portal: '🌐',
  preferences: '⚙️'
};

const TAB_LABELS: Record<string, string> = {
  overview: 'Overview',
  shipments: 'Shipments',
  quotes: 'Quotes',
  invoices: 'Invoices',
  portal: 'Client Portal',
  preferences: 'Preferences'
};

// ==================== MAIN COMPONENT ====================
const ClientDetails: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'shipments' | 'quotes' | 'invoices' | 'portal' | 'preferences'>('overview');
  const navigate = useNavigate();
  const client = MOCK_CLIENT;
  const statusColor = STATUS_COLORS[client.status];

  const stats = useMemo(() => ({
    activeShipments: 3,
    pendingQuotes: 2,
    openInvoices: 1,
    totalSpend: 12450.00
  }), []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      padding: '32px 24px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <button
              onClick={() => navigate('/clients')}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                backgroundColor: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              <ArrowLeft size={18} color="#6b7280" />
            </button>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', margin: 0 }}>
              {client.name}
            </h1>
          </div>
          {client.company && (
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 0 48px' }}>
              {client.company}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => navigate('/clients')}
            style={{
              padding: '10px 18px',
              backgroundColor: 'white',
              color: '#111827',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <button
            onClick={() => navigate(`/clients/edit/${client.id}`)}
            style={{
              padding: '10px 18px',
              background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
              boxShadow: '0 4px 6px rgba(234, 88, 12, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 12px rgba(234, 88, 12, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(234, 88, 12, 0.2)';
            }}
          >
            <Edit2 size={16} />
            Edit Client
          </button>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        {/* Contact Information */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '24px',
          borderLeft: '4px solid #ea580c'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', margin: '0 0 16px 0' }}>
            📧 Contact Info
          </h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div>
              <p style={{ fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', margin: 0 }}>
                Email
              </p>
              <p style={{ fontSize: '13px', color: '#111827', fontWeight: '500', margin: '4px 0 0 0' }}>
                {client.email}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', margin: 0 }}>
                Phone
              </p>
              <p style={{ fontSize: '13px', color: '#111827', fontWeight: '500', margin: '4px 0 0 0' }}>
                {client.phone}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', margin: 0 }}>
                Status
              </p>
              <span style={{
                display: 'inline-block',
                padding: '4px 10px',
                backgroundColor: statusColor.bg,
                color: statusColor.text,
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600',
                marginTop: '4px'
              }}>
                {statusColor.icon} {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Address */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '24px',
          borderLeft: '4px solid #3b82f6'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', margin: '0 0 16px 0' }}>
            📍 Address
          </h3>
          {client.address ? (
            <div style={{ display: 'grid', gap: '12px' }}>
              <div>
                <p style={{ fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', margin: 0 }}>
                  Street
                </p>
                <p style={{ fontSize: '13px', color: '#111827', fontWeight: '500', margin: '4px 0 0 0' }}>
                  {client.address.street}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', margin: 0 }}>
                  City, State, Zip
                </p>
                <p style={{ fontSize: '13px', color: '#111827', fontWeight: '500', margin: '4px 0 0 0' }}>
                  {client.address.city}, {client.address.state} {client.address.postalCode}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', margin: 0 }}>
                  Country
                </p>
                <p style={{ fontSize: '13px', color: '#111827', fontWeight: '500', margin: '4px 0 0 0' }}>
                  {client.address.country}
                </p>
              </div>
            </div>
          ) : (
            <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>
              No address information provided
            </p>
          )}
        </div>

        {/* Quick Actions */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '24px',
          borderLeft: '4px solid #10b981'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', margin: '0 0 16px 0' }}>
            ⚡ Quick Actions
          </h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            <button
              onClick={() => setActiveTab('quotes')}
              style={{
                padding: '10px 14px',
                background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Plus size={16} />
              Create Quote
            </button>
            <button
              onClick={() => navigate(`/shipments/new?clientId=${client.id}`)}
              style={{
                padding: '10px 14px',
                backgroundColor: '#f3f4f6',
                color: '#111827',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e5e7eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }}
            >
              <Package size={16} />
              New Shipment
            </button>
            <button
              onClick={() => navigate(`/invoices/new?clientId=${client.id}`)}
              style={{
                padding: '10px 14px',
                backgroundColor: '#f3f4f6',
                color: '#111827',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e5e7eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }}
            >
              <FileText size={16} />
              Generate Invoice
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {/* Tab Navigation */}
        <div style={{
          borderBottom: '1px solid #e5e7eb',
          padding: '0',
          display: 'flex',
          overflowX: 'auto'
        }}>
          {Object.keys(TAB_LABELS).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              style={{
                padding: '16px 20px',
                backgroundColor: activeTab === tab ? '#f9fafb' : 'transparent',
                border: 'none',
                borderBottom: activeTab === tab ? '3px solid #ea580c' : '3px solid transparent',
                color: activeTab === tab ? '#111827' : '#6b7280',
                fontSize: '13px',
                fontWeight: activeTab === tab ? '600' : '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab) {
                  e.currentTarget.style.color = '#111827';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab) {
                  e.currentTarget.style.color = '#6b7280';
                }
              }}
            >
              <span>{TAB_ICONS[tab]}</span>
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ padding: '24px' }}>
          {activeTab === 'overview' && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: '0 0 24px 0' }}>
                Account Summary
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px'
              }}>
                {[
                  { label: 'Active Shipments', value: stats.activeShipments, icon: '📦' },
                  { label: 'Pending Quotes', value: stats.pendingQuotes, icon: '💰' },
                  { label: 'Open Invoices', value: stats.openInvoices, icon: '📄' },
                  { label: 'Total Spend', value: `₦${stats.totalSpend.toLocaleString()}`, icon: '💵' }
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px',
                      padding: '16px',
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    <p style={{ fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', margin: 0 }}>
                      {item.label}
                    </p>
                    <p style={{ fontSize: '20px', fontWeight: '700', color: '#111827', margin: '8px 0 0 0' }}>
                      {item.icon} {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'shipments' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: 0 }}>
                  Client Shipments
                </h3>
                <button
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#f3f4f6',
                    color: '#111827',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Plus size={14} />
                  New Shipment
                </button>
              </div>
              <p style={{ color: '#6b7280', fontSize: '13px' }}>
                📦 Shipments associated with this client will appear here
              </p>
            </div>
          )}

          {activeTab === 'quotes' && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: '0 0 16px 0' }}>
                Quote Builder
              </h3>
              <p style={{ color: '#6b7280', fontSize: '13px' }}>
                💰 Create and manage custom quotes for this client
              </p>
            </div>
          )}

          {activeTab === 'invoices' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: 0 }}>
                  Client Invoices
                </h3>
                <button
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#f3f4f6',
                    color: '#111827',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Plus size={14} />
                  New Invoice
                </button>
              </div>
              <p style={{ color: '#6b7280', fontSize: '13px' }}>
                📄 View and manage invoices for this client
              </p>
            </div>
          )}

          {activeTab === 'portal' && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: '0 0 16px 0' }}>
                Client Portal Management
              </h3>
              <p style={{ color: '#6b7280', fontSize: '13px' }}>
                🌐 Manage this client's portal access and visibility settings
              </p>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: '0 0 16px 0' }}>
                Notification Preferences
              </h3>
              <p style={{ color: '#6b7280', fontSize: '13px' }}>
                ⚙️ Configure notification settings for this client
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '24px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        padding: '16px',
        fontSize: '12px',
        color: '#6b7280',
        display: 'flex',
        justifyContent: 'space-between',
        borderLeft: '4px solid #ea580c'
      }}>
        <span>Created: {new Date(client.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
        <span>Last updated: {new Date(client.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
      </div>
    </div>
  );
};

export default ClientDetails;