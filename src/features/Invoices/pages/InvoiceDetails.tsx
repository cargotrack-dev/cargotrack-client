// src/features/Invoices/pages/InvoiceDetails.tsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download, Mail, Share2, Edit2, Trash2, Printer } from 'lucide-react';

const InvoiceDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const invoice = {
    invoiceNumber: 'INV-2024-001',
    status: 'PAID' as const,
    issueDate: '2024-01-15',
    dueDate: '2024-02-15',
    paymentDate: '2024-02-10',
    company: {
      name: 'CargoTrack Enterprise',
      email: 'billing@cargotrack.com',
      phone: '+1 (555) 123-4567',
      address: '123 Business Ave, Lagos, Nigeria',
    },
    client: {
      name: 'Acme Corporation',
      email: 'accounts@acmecorp.com',
      phone: '+1 (555) 987-6543',
      address: '456 Corporate Blvd, Abuja, Nigeria',
    },
    lineItems: [
      {
        description: 'Shipment TRK-001 - Lagos to Abuja Express Delivery',
        quantity: 1,
        unitPrice: 2500,
        total: 2500,
      },
      {
        description: 'Shipment TRK-002 - Abuja to Port Harcourt Standard Delivery',
        quantity: 1,
        unitPrice: 3300.5,
        total: 3300.5,
      },
    ],
    subtotal: 5800.5,
    discount: 0,
    tax: 0,
    total: 5800.5,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'DRAFT': return { bg: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)', text: '#1e293b' };
      case 'PENDING': return { bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', text: '#1e293b' };
      case 'PAID': return { bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', text: '#1e293b' };
      case 'OVERDUE': return { bg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', text: '#1e293b' };
      default: return { bg: '#9ca3af', text: '#1e293b' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'DRAFT': return '📝';
      case 'PENDING': return '⏳';
      case 'PAID': return '✓';
      case 'OVERDUE': return '⚠';
      default: return '•';
    }
  };

  const statusColor = getStatusColor(invoice.status);
  const statusIcon = getStatusIcon(invoice.status);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      padding: '32px',
      position: 'relative',
    }}>
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header with buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <button
            onClick={() => navigate('/invoices')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#3b82f6',
              fontWeight: '600',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            <ArrowLeft size={20} />
            Back to Invoices
          </button>

          <div style={{ display: 'flex', gap: '12px' }}>
            {[
              { Icon: Printer, title: 'Print' },
              { Icon: Download, title: 'Download' },
              { Icon: Mail, title: 'Email' },
              { Icon: Share2, title: 'Share' },
            ].map(({ Icon, title }) => (
              <button
                key={title}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  color: '#64748b',
                  cursor: 'pointer',
                  transition: 'all 200ms',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title={title}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                }}
              >
                <Icon size={20} />
              </button>
            ))}
            <button
              style={{
                padding: '12px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 200ms',
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
              <Edit2 size={20} />
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              style={{
                padding: '12px',
                borderRadius: '12px',
                background: 'white',
                border: '1px solid #e2e8f0',
                color: '#64748b',
                cursor: 'pointer',
                transition: 'all 200ms',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#fecaca';
                (e.currentTarget as HTMLButtonElement).style.color = '#ef4444';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#e2e8f0';
                (e.currentTarget as HTMLButtonElement).style.color = '#64748b';
              }}
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        {/* Invoice Header */}
        <div style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '16px',
          padding: '32px',
          background: 'white',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          marginBottom: '32px',
        }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #e2e8f0' }}>
              <div>
                <h1 style={{ fontSize: '36px', fontWeight: 900, color: '#1e293b', margin: 0, marginBottom: '8px' }}>
                  {invoice.invoiceNumber}
                </h1>
                <p style={{ color: '#64748b', fontSize: '18px', margin: 0 }}>
                  {invoice.client.name}
                </p>
              </div>
              <div style={{
                padding: '16px 24px',
                borderRadius: '12px',
                background: statusColor.bg,
                color: 'white',
                fontWeight: 'bold',
                fontSize: '18px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}>
                {statusIcon} {invoice.status}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              <div>
                <p style={{ color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', marginBottom: '8px', margin: 0 }}>
                  Issued Date
                </p>
                <p style={{ color: '#1e293b', fontSize: '18px', fontWeight: '600', margin: 0 }}>
                  {formatDate(invoice.issueDate)}
                </p>
              </div>
              <div>
                <p style={{ color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', marginBottom: '8px', margin: 0 }}>
                  Due Date
                </p>
                <p style={{ color: '#1e293b', fontSize: '18px', fontWeight: '600', margin: 0 }}>
                  {formatDate(invoice.dueDate)}
                </p>
              </div>
              {invoice.paymentDate && (
                <div>
                  <p style={{ color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', marginBottom: '8px', margin: 0 }}>
                    Payment Date
                  </p>
                  <p style={{ color: '#10b981', fontSize: '18px', fontWeight: '600', margin: 0 }}>
                    {formatDate(invoice.paymentDate)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Company Info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          {/* From */}
          <div style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '16px',
            padding: '24px',
            background: 'white',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                padding: '8px',
                borderRadius: '8px',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
              }}>
                🏢
              </div>
              <h3 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', color: '#64748b', margin: 0 }}>
                From
              </h3>
            </div>
            <div>
              <p style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '18px', margin: 0, marginBottom: '8px' }}>
                {invoice.company.name}
              </p>
              <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>{invoice.company.address}</p>
              <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>{invoice.company.email}</p>
              <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>{invoice.company.phone}</p>
            </div>
          </div>

          {/* Bill To */}
          <div style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '16px',
            padding: '24px',
            background: 'white',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                padding: '8px',
                borderRadius: '8px',
                background: '#f0f9ff',
                border: '1px solid #cffafe',
              }}>
                👤
              </div>
              <h3 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', color: '#64748b', margin: 0 }}>
                Bill To
              </h3>
            </div>
            <div>
              <p style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '18px', margin: 0, marginBottom: '8px' }}>
                {invoice.client.name}
              </p>
              <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>{invoice.client.address}</p>
              <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>{invoice.client.email}</p>
              <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>{invoice.client.phone}</p>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '16px',
          background: 'white',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          marginBottom: '32px',
          overflowX: 'auto',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{
              background: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
            }}>
              <tr>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b' }}>
                  Description
                </th>
                <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b' }}>
                  Quantity
                </th>
                <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b' }}>
                  Unit Price
                </th>
                <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b' }}>
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems.map((item, index) => (
                <tr key={index} style={{
                  borderBottom: '1px solid #e2e8f0',
                  background: index % 2 === 0 ? '#ffffff' : '#f8fafc',
                }}>
                  <td style={{ padding: '16px 24px', color: '#1e293b' }}>{item.description}</td>
                  <td style={{ padding: '16px 24px', textAlign: 'right', color: '#1e293b' }}>{item.quantity}</td>
                  <td style={{ padding: '16px 24px', textAlign: 'right', color: '#1e293b' }}>{formatCurrency(item.unitPrice)}</td>
                  <td style={{ padding: '16px 24px', textAlign: 'right', fontWeight: '600', color: '#1e293b' }}>
                    {formatCurrency(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '32px' }}>
          <div style={{ width: '100%', maxWidth: '400px' }}>
            <div style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '16px',
              padding: '24px',
              background: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%)',
              border: '1px solid #dbeafe',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            }}>
              <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #dbeafe' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#1e293b', marginBottom: '12px' }}>
                  <span style={{ fontWeight: '500' }}>Subtotal</span>
                  <span style={{ fontWeight: '600' }}>{formatCurrency(invoice.subtotal)}</span>
                </div>
                {invoice.discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ef4444', marginBottom: '12px' }}>
                    <span style={{ fontWeight: '500' }}>Discount</span>
                    <span style={{ fontWeight: '600' }}>-{formatCurrency(invoice.discount)}</span>
                  </div>
                )}
                {invoice.tax > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#1e293b' }}>
                    <span style={{ fontWeight: '500' }}>Tax</span>
                    <span style={{ fontWeight: '600' }}>{formatCurrency(invoice.tax)}</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#1e293b', fontWeight: 'bold' }}>Total</span>
                <span style={{
                  fontSize: '36px',
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {formatCurrency(invoice.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
        }}>
          <div style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '16px',
            padding: '32px',
            background: 'white',
            border: '1px solid #e2e8f0',
            boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
            width: '384px',
          }}>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '12px', margin: 0 }}>
              Delete Invoice
            </h3>
            <p style={{ color: '#64748b', marginBottom: '32px', margin: 0, paddingTop: '12px' }}>
              Are you sure? This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  color: '#64748b',
                  background: 'white',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 200ms',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#f8fafc';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'white';
                }}
              >
                Cancel
              </button>
              <button style={{
                flex: 1,
                padding: '12px 16px',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 200ms',
              }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceDetails;