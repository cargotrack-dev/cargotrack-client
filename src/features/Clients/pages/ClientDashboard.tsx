// src/features/Clients/pages/ClientDashboard.tsx
// 🎨 MODERN UI/UX - All Inline Styles, Zero Tailwind

import React, { useState, useMemo } from 'react';
import { Plus, Search, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ==================== TYPES ====================
interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

// ==================== MOCK DATA ====================
const MOCK_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+234 801 234 5678',
    company: 'ABC Logistics Nigeria',
    status: 'active',
    createdAt: '2024-01-15',
    updatedAt: '2025-01-20'
  },
  {
    id: '2',
    name: 'Amara Johnson',
    email: 'amara.j@example.com',
    phone: '+234 802 987 6543',
    company: 'Express Transport Ltd',
    status: 'active',
    createdAt: '2024-02-10',
    updatedAt: '2025-01-18'
  },
  {
    id: '3',
    name: 'Chioma Okafor',
    email: 'chioma.okafor@example.com',
    phone: '+234 803 456 7890',
    company: 'Global Supply Chain',
    status: 'pending',
    createdAt: '2024-12-20',
    updatedAt: '2025-01-22'
  },
  {
    id: '4',
    name: 'David Mensah',
    email: 'david.mensah@example.com',
    phone: '+234 804 321 0987',
    company: 'Metro Freight Services',
    status: 'active',
    createdAt: '2024-03-05',
    updatedAt: '2025-01-19'
  },
  {
    id: '5',
    name: 'Zainab Ibrahim',
    email: 'zainab.i@example.com',
    phone: '+234 805 654 3210',
    status: 'inactive',
    createdAt: '2024-01-20',
    updatedAt: '2024-12-01'
  },
  {
    id: '6',
    name: 'Eze Nnamdi',
    email: 'eze.nnamdi@example.com',
    phone: '+234 806 789 0123',
    company: 'Coast Shipping Ltd',
    status: 'active',
    createdAt: '2024-04-12',
    updatedAt: '2025-01-21'
  }
];

// ==================== STYLES & CONFIGS ====================
const STATUS_COLORS = {
  active: { bg: '#d1fae5', text: '#065f46', icon: '🟢' },
  pending: { bg: '#fef3c7', text: '#92400e', icon: '🟡' },
  inactive: { bg: '#f3f4f6', text: '#374151', icon: '⚪' }
};

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// ==================== MAIN COMPONENT ====================
const ClientDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'pending' | 'inactive'>('all');
  const navigate = useNavigate();

  // Calculate statistics
  const stats = useMemo(() => ({
    total: MOCK_CLIENTS.length,
    active: MOCK_CLIENTS.filter(c => c.status === 'active').length,
    pending: MOCK_CLIENTS.filter(c => c.status === 'pending').length,
    inactive: MOCK_CLIENTS.filter(c => c.status === 'inactive').length
  }), []);

  // Filter clients
  const filteredClients = useMemo(() => {
    return MOCK_CLIENTS.filter(client => {
      if (activeTab !== 'all' && client.status !== activeTab) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          client.name.toLowerCase().includes(q) ||
          client.email.toLowerCase().includes(q) ||
          client.company?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [searchQuery, activeTab]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      padding: '32px 24px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#111827', margin: 0 }}>
            Client Dashboard
          </h1>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '8px 0 0 0' }}>
            Manage your clients and their information
          </p>
        </div>
        <button
          onClick={() => navigate('/clients/new')}
          style={{
            padding: '10px 20px',
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
          <Plus size={18} />
          Add New Client
        </button>
      </div>

      {/* Statistics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        {[
          { label: 'Total Clients', value: stats.total, icon: '👥', color: '#3b82f6' },
          { label: 'Active Clients', value: stats.active, icon: '🟢', color: '#10b981' },
          { label: 'Pending Clients', value: stats.pending, icon: '🟡', color: '#f59e0b' },
          { label: 'Inactive Clients', value: stats.inactive, icon: '⚪', color: '#6b7280' }
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              padding: '20px',
              borderLeft: `4px solid ${stat.color}`,
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                {stat.label}
              </span>
              <span style={{ fontSize: '24px' }}>{stat.icon}</span>
            </div>
            <p style={{ fontSize: '28px', fontWeight: '700', color: '#111827', margin: 0 }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        padding: '16px',
        marginBottom: '24px',
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: '16px',
        alignItems: 'center'
      }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'active', 'pending', 'inactive'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as 'all' | 'active' | 'pending' | 'inactive')}
              style={{
                padding: '8px 16px',
                backgroundColor: activeTab === tab ? '#ea580c' : '#f3f4f6',
                color: activeTab === tab ? 'white' : '#6b7280',
                border: 'none',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textTransform: 'capitalize'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab) {
                  e.currentTarget.style.backgroundColor = '#e5e7eb';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab) {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }
              }}
            >
              {tab === 'all' ? 'All Clients' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af'
          }} />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: '36px',
              paddingRight: '12px',
              padding: '8px 12px 8px 36px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '13px',
              fontFamily: 'inherit',
              transition: 'all 0.2s'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#ea580c';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(234, 88, 12, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>
      </div>

      {/* Clients Table */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#f9fafb',
          borderBottom: '1px solid #e5e7eb',
          padding: '16px 24px',
          display: 'grid',
          gridTemplateColumns: '2fr 1.5fr 1fr 1fr',
          gap: '16px',
          alignItems: 'center'
        }}>
          {['Client', 'Contact', 'Status', 'Actions'].map(header => (
            <div
              key={header}
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              {header}
            </div>
          ))}
        </div>

        {/* Body */}
        <div>
          {filteredClients.length === 0 ? (
            <div style={{
              padding: '48px 24px',
              textAlign: 'center',
              color: '#6b7280'
            }}>
              No clients found matching your criteria
            </div>
          ) : (
            filteredClients.map((client, idx) => {
              const statusColor = STATUS_COLORS[client.status];
              return (
                <div
                  key={client.id}
                  style={{
                    padding: '16px 24px',
                    borderBottom: idx !== filteredClients.length - 1 ? '1px solid #e5e7eb' : 'none',
                    display: 'grid',
                    gridTemplateColumns: '2fr 1.5fr 1fr 1fr',
                    gap: '16px',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  {/* Client */}
                  <div 
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                    onClick={() => navigate(`/clients/${client.id}`)}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      backgroundColor: '#ea580c',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}>
                      {getInitials(client.name)}
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0, textDecoration: 'underline' }}>
                        {client.name}
                      </p>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0 0 0' }}>
                        {client.company || 'Individual'}
                      </p>
                    </div>
                  </div>

                  {/* Contact */}
                  <div>
                    <p style={{ fontSize: '13px', color: '#111827', margin: '0 0 2px 0', fontWeight: '500' }}>
                      {client.email}
                    </p>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                      {client.phone}
                    </p>
                  </div>

                  {/* Status */}
                  <div>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      backgroundColor: statusColor.bg,
                      color: statusColor.text,
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {statusColor.icon} {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => navigate(`/clients/${client.id}`)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#f3f4f6',
                        color: '#111827',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#e5e7eb';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                      }}
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/clients/edit/${client.id}`)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#f3f4f6',
                        color: '#111827',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#e5e7eb';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ClientDashboard;