// src/features/Invoices/pages/InvoiceGenerator.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

const InvoiceGenerator: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    lineItems: [{ description: '', quantity: 1, unitPrice: 0 }],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLineItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.lineItems];
    (newItems[index] as any)[field] = value;
    setFormData(prev => ({ ...prev, lineItems: newItems }));
  };

  const addLineItem = () => {
    setFormData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, { description: '', quantity: 1, unitPrice: 0 }],
    }));
  };

  const removeLineItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter((_, i) => i !== index),
    }));
  };

  const totalAmount = formData.lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '24px', margin: 0 }}>
              Client Information
            </h2>
            <div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#475569', fontWeight: '600', marginBottom: '8px' }}>
                  Client Name *
                </label>
                <input
                  type="text"
                  name="clientName"
                  placeholder="Enter client name"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    color: '#1e293b',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#475569', fontWeight: '600', marginBottom: '8px' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="clientEmail"
                  placeholder="client@example.com"
                  value={formData.clientEmail}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    color: '#1e293b',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#475569', fontWeight: '600', marginBottom: '8px' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="clientPhone"
                  placeholder="+1 (555) 000-0000"
                  value={formData.clientPhone}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    color: '#1e293b',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#475569', fontWeight: '600', marginBottom: '8px' }}>
                  Issue Date *
                </label>
                <input
                  type="date"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    color: '#1e293b',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#475569', fontWeight: '600', marginBottom: '8px' }}>
                  Due Date *
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    color: '#1e293b',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '24px', margin: 0 }}>
              Line Items
            </h2>
            <div>
              {formData.lineItems.map((item, index) => (
                <div key={index} style={{
                  padding: '16px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  marginBottom: '16px',
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 120px 50px', gap: '12px', alignItems: 'flex-end' }}>
                    <div>
                      <label style={{ display: 'block', color: '#64748b', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
                        Description
                      </label>
                      <input
                        type="text"
                        placeholder="Item description"
                        value={item.description}
                        onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          background: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          color: '#1e293b',
                          fontSize: '14px',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', color: '#64748b', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
                        Qty
                      </label>
                      <input
                        type="number"
                        placeholder="1"
                        value={item.quantity}
                        onChange={(e) => handleLineItemChange(index, 'quantity', parseFloat(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          background: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          color: '#1e293b',
                          fontSize: '14px',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', color: '#64748b', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
                        Unit Price
                      </label>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={item.unitPrice}
                        onChange={(e) => handleLineItemChange(index, 'unitPrice', parseFloat(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          background: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          color: '#1e293b',
                          fontSize: '14px',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    <button
                      onClick={() => removeLineItem(index)}
                      style={{
                        padding: '8px 12px',
                        background: '#fee2e2',
                        border: '1px solid #fecaca',
                        borderRadius: '6px',
                        color: '#ef4444',
                        cursor: 'pointer',
                        transition: 'all 200ms',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = '#fecaca';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = '#fee2e2';
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={addLineItem}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#eff6ff',
                  border: '1px dashed #bfdbfe',
                  borderRadius: '8px',
                  color: '#3b82f6',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 200ms',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginBottom: '16px',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#dbeafe';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#eff6ff';
                }}
              >
                <Plus size={20} />
                Add Line Item
              </button>

              <div style={{
                padding: '16px',
                background: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%)',
                borderRadius: '8px',
                border: '1px solid #dbeafe',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#1e293b', fontWeight: '600' }}>Total Amount</span>
                  <span style={{
                    fontSize: '28px',
                    fontWeight: 900,
                    background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '24px', margin: 0 }}>
              Review & Confirm
            </h2>
            <div style={{
              padding: '24px',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
            }}>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', marginBottom: '12px', margin: 0 }}>
                  Client Details
                </h3>
                <p style={{ color: '#1e293b', fontSize: '16px', margin: 0, marginBottom: '4px' }}>
                  {formData.clientName}
                </p>
                <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                  {formData.clientEmail}
                </p>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', marginBottom: '12px', margin: 0 }}>
                  Dates
                </h3>
                <p style={{ color: '#1e293b', fontSize: '14px', margin: 0, marginBottom: '4px' }}>
                  Issue: {new Date(formData.issueDate).toLocaleDateString()}
                </p>
                <p style={{ color: '#1e293b', fontSize: '14px', margin: 0 }}>
                  Due: {new Date(formData.dueDate).toLocaleDateString()}
                </p>
              </div>

              <div>
                <h3 style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', marginBottom: '12px', margin: 0 }}>
                  Items ({formData.lineItems.length})
                </h3>
                {formData.lineItems.map((item, index) => (
                  <p key={index} style={{ color: '#475569', fontSize: '14px', margin: 0, marginBottom: '4px' }}>
                    {item.description} - ${(item.quantity * item.unitPrice).toFixed(2)}
                  </p>
                ))}
              </div>

              <div style={{
                padding: '16px',
                background: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%)',
                borderRadius: '8px',
                border: '1px solid #dbeafe',
                marginTop: '24px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#1e293b', fontWeight: '600' }}>Total Invoice Amount</span>
                  <span style={{
                    fontSize: '24px',
                    fontWeight: 900,
                    background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      padding: '32px',
      position: 'relative',
    }}>
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
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
            marginBottom: '32px',
          }}
        >
          <ArrowLeft size={20} />
          Back to Invoices
        </button>

        <h1 style={{ fontSize: '48px', fontWeight: 900, color: '#1e293b', marginBottom: '16px', margin: 0 }}>
          Create New Invoice
        </h1>
        <p style={{ color: '#64748b', fontSize: '18px', marginBottom: '32px', margin: 0, paddingTop: '8px' }}>
          Fill in the details to generate a professional invoice
        </p>

        {/* Progress Steps */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          marginBottom: '48px',
        }}>
          {[
            { num: 1, label: 'Client Info' },
            { num: 2, label: 'Line Items' },
            { num: 3, label: 'Review' },
          ].map(({ num, label }) => (
            <div
              key={num}
              style={{
                padding: '16px',
                borderRadius: '12px',
                background: step >= num ? 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' : 'white',
                border: '1px solid ' + (step >= num ? 'transparent' : '#e2e8f0'),
                color: step >= num ? 'white' : '#64748b',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 300ms',
              }}
              onClick={() => setStep(num)}
              onMouseEnter={(e) => {
                if (step < num) {
                  (e.currentTarget as HTMLDivElement).style.background = '#f1f5f9';
                }
              }}
              onMouseLeave={(e) => {
                if (step < num) {
                  (e.currentTarget as HTMLDivElement).style.background = 'white';
                }
              }}
            >
              <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', margin: 0, marginBottom: '4px' }}>
                Step {num} of 3
              </p>
              <p style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '16px',
          padding: '32px',
          background: 'white',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          marginBottom: '32px',
          minHeight: '400px',
        }}>
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'space-between' }}>
          <button
            onClick={() => step > 1 ? setStep(step - 1) : navigate('/invoices')}
            style={{
              padding: '12px 32px',
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              color: '#64748b',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 200ms',
              fontSize: '16px',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '#f8fafc';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'white';
            }}
          >
            {step > 1 ? '← Previous' : '← Cancel'}
          </button>

          <button
            onClick={() => {
              if (step < 3) {
                setStep(step + 1);
              } else {
                navigate('/invoices');
              }
            }}
            style={{
              padding: '12px 32px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 200ms',
              fontSize: '16px',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.3)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.2)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
            }}
          >
            {step < 3 ? 'Next →' : 'Create Invoice'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;