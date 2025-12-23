// src/features/Invoices/pages/InvoiceList.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Eye,
  Download,
} from 'lucide-react';
import { Input } from '../../UI/components/ui/input';

interface Invoice {
  id: string;
  invoiceNumber: string;
  client: { id: string; name: string };
  status: 'DRAFT' | 'PENDING' | 'PAID' | 'OVERDUE';
  amount: number;
  currency: string;
  issueDate: string;
  dueDate: string;
  shipmentIds: string[];
  paymentDate?: string;
}

const InvoiceList: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const navigate = useNavigate();

  const mockInvoices: Invoice[] = useMemo(() => [
    {
      id: 'inv-001',
      invoiceNumber: 'INV-2024-001',
      client: { id: 'client-001', name: 'Acme Corporation' },
      status: 'PAID',
      amount: 5800.50,
      currency: 'USD',
      issueDate: '2024-01-15',
      dueDate: '2024-02-15',
      paymentDate: '2024-02-10',
      shipmentIds: ['ship-001', 'ship-002'],
    },
    {
      id: 'inv-002',
      invoiceNumber: 'INV-2024-002',
      client: { id: 'client-002', name: 'Globex Industries' },
      status: 'PENDING',
      amount: 3250.75,
      currency: 'USD',
      issueDate: '2024-01-20',
      dueDate: '2024-02-20',
      shipmentIds: ['ship-003'],
    },
    {
      id: 'inv-003',
      invoiceNumber: 'INV-2024-003',
      client: { id: 'client-003', name: 'Oceanic Shipping' },
      status: 'OVERDUE',
      amount: 12500.00,
      currency: 'USD',
      issueDate: '2024-01-10',
      dueDate: '2024-02-10',
      shipmentIds: ['ship-004', 'ship-005', 'ship-006'],
    },
    {
      id: 'inv-004',
      invoiceNumber: 'INV-2024-004',
      client: { id: 'client-001', name: 'Acme Corporation' },
      status: 'DRAFT',
      amount: 4200.00,
      currency: 'USD',
      issueDate: '2024-01-25',
      dueDate: '2024-02-25',
      shipmentIds: ['ship-007'],
    },
    {
      id: 'inv-005',
      invoiceNumber: 'INV-2024-005',
      client: { id: 'client-004', name: 'Pacific Logistics' },
      status: 'PAID',
      amount: 8750.25,
      currency: 'USD',
      issueDate: '2024-01-05',
      dueDate: '2024-02-05',
      paymentDate: '2024-02-03',
      shipmentIds: ['ship-008', 'ship-009'],
    },
  ], []);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 600));
        setInvoices(mockInvoices);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvoices();
  }, [mockInvoices]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter(invoice => {
      const matchesSearch =
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.client.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'ALL' || invoice.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [invoices, searchTerm, filterStatus]);

  const analytics = useMemo(() => {
    const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const paidAmount = invoices.filter(inv => inv.status === 'PAID').reduce((sum, inv) => sum + inv.amount, 0);
    const pendingAmount = invoices.filter(inv => inv.status === 'PENDING').reduce((sum, inv) => sum + inv.amount, 0);
    const overdueAmount = invoices.filter(inv => inv.status === 'OVERDUE').reduce((sum, inv) => sum + inv.amount, 0);
    return { totalAmount, paidAmount, pendingAmount, overdueAmount };
  }, [invoices]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, any> = {
      DRAFT: { gradient: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)', light: '#e2e8f0', badge: '#94a3b8', icon: '📝', label: 'Draft' },
      PENDING: { gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', light: '#fef3c7', badge: '#fbbf24', icon: '⏳', label: 'Pending' },
      PAID: { gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', light: '#d1fae5', badge: '#6ee7b7', icon: '✓', label: 'Paid' },
      OVERDUE: { gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', light: '#fee2e2', badge: '#fca5a5', icon: '⚠', label: 'Overdue' },
    };
    return configs[status] || configs.DRAFT;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      padding: '32px',
      position: 'relative',
    }}>
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '32px', marginBottom: '32px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <div style={{ fontSize: '48px' }}>💰</div>
                <div>
                  <h1 style={{ fontSize: '48px', fontWeight: 900, color: '#1e293b', letterSpacing: '-1px', margin: 0 }}>
                    Invoice Management
                  </h1>
                  <p style={{ color: '#64748b', fontSize: '18px', marginTop: '8px', margin: 0 }}>
                    Professional financial tracking & monitoring
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/invoices/new')}
              style={{
                padding: '16px 32px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                color: 'white',
                border: 'none',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(59, 130, 246, 0.2)',
                transition: 'all 300ms',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.transform = 'scale(1.05)';
                (e.target as HTMLButtonElement).style.boxShadow = '0 8px 12px rgba(59, 130, 246, 0.3)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.transform = 'scale(1)';
                (e.target as HTMLButtonElement).style.boxShadow = '0 4px 6px rgba(59, 130, 246, 0.2)';
              }}
            >
              <Plus size={24} />
              Create Invoice
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '48px',
        }}>
          {/* Total Revenue */}
          <div style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '16px',
            padding: '32px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            cursor: 'pointer',
            transition: 'all 300ms',
          }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 24px rgba(59, 130, 246, 0.25)';
              (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.15)';
              (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
            }}
          >
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', marginBottom: '12px', margin: 0 }}>
                    Total Revenue
                  </p>
                  <p style={{ fontSize: '48px', fontWeight: 900, color: 'white', marginBottom: '8px', margin: 0 }}>
                    ${(analytics.totalAmount / 1000).toFixed(1)}k
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.9)', fontWeight: 'bold' }}>
                    <TrendingUp size={16} />
                    <span>↑ 12.5% growth</span>
                  </div>
                </div>
                <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.3)' }}>
                  <DollarSign size={32} color="#e0f2fe" />
                </div>
              </div>
            </div>
          </div>

          {/* Paid Invoices */}
          <div style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '16px',
            padding: '32px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            cursor: 'pointer',
            transition: 'all 300ms',
          }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 24px rgba(16, 185, 129, 0.25)';
              (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.15)';
              (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
            }}
          >
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', marginBottom: '12px', margin: 0 }}>
                Paid Invoices
              </p>
              <p style={{ fontSize: '48px', fontWeight: 900, color: 'white', marginBottom: '8px', margin: 0 }}>
                {invoices.filter(i => i.status === 'PAID').length}
              </p>
              <p style={{ color: 'rgba(209, 250, 229, 1)', fontWeight: 'bold', margin: 0 }}>
                {formatCurrency(analytics.paidAmount)} collected
              </p>
              <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.3)', position: 'absolute', top: '32px', right: '32px' }}>
                <CheckCircle2 size={32} color="#d1fae5" />
              </div>
            </div>
          </div>

          {/* Pending Invoices */}
          <div style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '16px',
            padding: '32px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            cursor: 'pointer',
            transition: 'all 300ms',
          }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 24px rgba(245, 158, 11, 0.25)';
              (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.15)';
              (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
            }}
          >
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', marginBottom: '12px', margin: 0 }}>
                Pending Payment
              </p>
              <p style={{ fontSize: '48px', fontWeight: 900, color: 'white', marginBottom: '8px', margin: 0 }}>
                {invoices.filter(i => i.status === 'PENDING').length}
              </p>
              <p style={{ color: 'rgba(254, 243, 199, 1)', fontWeight: 'bold', margin: 0 }}>
                {formatCurrency(analytics.pendingAmount)} awaiting
              </p>
              <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.3)', position: 'absolute', top: '32px', right: '32px' }}>
                <Clock size={32} color="#fef3c7" />
              </div>
            </div>
          </div>

          {/* Overdue Invoices */}
          <div style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '16px',
            padding: '32px',
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            cursor: 'pointer',
            transition: 'all 300ms',
          }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 24px rgba(239, 68, 68, 0.25)';
              (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.15)';
              (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
            }}
          >
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', marginBottom: '12px', margin: 0 }}>
                Overdue Amount
              </p>
              <p style={{ fontSize: '48px', fontWeight: 900, color: 'white', marginBottom: '8px', margin: 0 }}>
                {invoices.filter(i => i.status === 'OVERDUE').length}
              </p>
              <p style={{ color: 'rgba(254, 226, 226, 1)', fontWeight: 'bold', margin: 0 }}>
                {formatCurrency(analytics.overdueAmount)} past due
              </p>
              <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.3)', position: 'absolute', top: '32px', right: '32px' }}>
                <AlertTriangle size={32} color="#fee2e2" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '40px', flexDirection: 'column' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '16px', top: '14px', width: '20px', height: '20px', color: '#cbd5e1' }} />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '48px',
                paddingRight: '16px',
                paddingTop: '14px',
                paddingBottom: '14px',
                background: 'white',
                border: '1px solid #e2e8f0',
                color: '#1e293b',
                borderRadius: '12px',
                fontSize: '16px',
                transition: 'all 200ms',
                boxSizing: 'border-box',
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
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '12px 24px',
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              color: '#1e293b',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '16px',
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
            <option value="ALL">All Status</option>
            <option value="DRAFT">📝 Draft</option>
            <option value="PENDING">⏳ Pending</option>
            <option value="PAID">✓ Paid</option>
            <option value="OVERDUE">⚠ Overdue</option>
          </select>
        </div>

        {/* Invoice Cards */}
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '128px' }}>
            <div style={{
              position: 'relative',
              width: '80px',
              height: '80px',
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                borderRadius: '50%',
                filter: 'blur(20px)',
                animation: 'pulse 2s infinite',
              }} />
              <div style={{
                position: 'absolute',
                inset: '8px',
                background: '#f8fafc',
                borderRadius: '50%',
              }} />
              <div style={{
                position: 'absolute',
                inset: '16px',
                border: '4px solid transparent',
                borderTopColor: '#3b82f6',
                borderRightColor: '#06b6d4',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }} />
            </div>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div style={{
            textAlign: 'center',
            paddingTop: '64px',
            paddingBottom: '64px',
            background: 'white',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
          }}>
            <p style={{ color: '#64748b', fontSize: '18px', fontWeight: '600' }}>
              No invoices found
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px',
          }}>
            {filteredInvoices.map((invoice) => {
              const config = getStatusConfig(invoice.status);
              return (
                <div
                  key={invoice.id}
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '16px',
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    transition: 'all 300ms',
                    cursor: 'pointer',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.border = '1px solid #cbd5e1';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
                    (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.border = '1px solid #e2e8f0';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                    (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
                  }}
                >
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #e2e8f0' }}>
                    <div>
                      <h3 style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '18px', marginBottom: '8px', margin: 0 }}>
                        {invoice.invoiceNumber}
                      </h3>
                      <p style={{ color: '#64748b', fontSize: '14px', fontWeight: '500', margin: 0 }}>
                        {invoice.client.name}
                      </p>
                    </div>
                    <span style={{
                      display: 'inline-block',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      border: `1px solid rgba(0,0,0,0.1)`,
                      background: config.gradient,
                      color: 'white',
                      whiteSpace: 'nowrap',
                    }}>
                      {config.icon} {config.label}
                    </span>
                  </div>

                  {/* Amount */}
                  <div style={{ marginBottom: '24px', flex: 1 }}>
                    <p style={{ color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', marginBottom: '8px', margin: 0 }}>
                      Invoice Amount
                    </p>
                    <p style={{
                      fontSize: '32px',
                      fontWeight: 900,
                      background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      margin: 0,
                    }}>
                      {formatCurrency(invoice.amount)}
                    </p>
                  </div>

                  {/* Dates */}
                  <div style={{ marginBottom: '24px', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                      <span style={{ color: '#64748b' }}>Issued</span>
                      <span style={{ color: '#1e293b', fontWeight: '600' }}>
                        {new Date(invoice.issueDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ color: '#64748b' }}>Due</span>
                      <span style={{ color: '#1e293b', fontWeight: '600' }}>
                        {new Date(invoice.dueDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => navigate(`/invoices/${invoice.id}`)}
                      style={{
                        flex: 1,
                        padding: '12px 16px',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'all 200ms',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                      }}
                    >
                      <Eye size={16} />
                      View
                    </button>
                    <button style={{
                      padding: '12px 16px',
                      background: '#f1f5f9',
                      color: '#64748b',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 200ms',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                      }}
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Stats */}
        {invoices.length > 0 && (
          <div style={{ marginTop: '48px', textAlign: 'center' }}>
            <p style={{ color: '#64748b', fontSize: '14px' }}>
              Displaying <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>{filteredInvoices.length}</span> of <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>{invoices.length}</span> invoices
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default InvoiceList;