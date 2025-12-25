// src/features/Clients/pages/ClientEdit.tsx
// 🎨 MODERN UI/UX - Edit Client Form with Inline Styles

import React, { useState, useMemo } from 'react';
import { ArrowLeft, Save, AlertCircle, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

// ==================== TYPES ====================
interface FormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  status: 'active' | 'inactive' | 'pending';
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

interface FormErrors {
  [key: string]: string;
}

// ==================== TYPES ====================
interface ClientAddress {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt?: string;
  updatedAt?: string;
  address?: ClientAddress;
}

// ==================== MOCK DATA ====================
const MOCK_CLIENTS: Record<string, Client> = {
  '1': {
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
  }
};

// ==================== VALIDATION ====================
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /\d{10,}/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

const validateForm = (data: FormData): FormErrors => {
  const errors: FormErrors = {};

  if (!data.name.trim()) {
    errors.name = 'Client name is required';
  }

  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.phone.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!validatePhone(data.phone)) {
    errors.phone = 'Please enter a valid phone number (at least 10 digits)';
  }

  return errors;
};

// ==================== MAIN COMPONENT ====================
const ClientEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Get client from localStorage or mock data
  const getClientData = () => {
    if (id) {
      const localStorageClientsJSON = localStorage.getItem('cargotrack_clients');
      if (localStorageClientsJSON) {
        try {
          const localStorageClients = JSON.parse(localStorageClientsJSON);
          if (localStorageClients[id]) {
            return localStorageClients[id];
          }
        } catch (error) {
          console.error('Error reading from localStorage:', error);
        }
      }
    }
    return MOCK_CLIENTS[id || '1'];
  };

  const mockClient = getClientData();

  const [formData, setFormData] = useState<FormData>({
    name: mockClient?.name || '',
    email: mockClient?.email || '',
    phone: mockClient?.phone || '',
    company: mockClient?.company || '',
    status: mockClient?.status || 'pending',
    street: mockClient?.address?.street || '',
    city: mockClient?.address?.city || '',
    state: mockClient?.address?.state || '',
    postalCode: mockClient?.address?.postalCode || '',
    country: mockClient?.address?.country || 'Nigeria'
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(!!mockClient?.address);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isFormDirty = useMemo(() => {
    return formData.name !== mockClient?.name ||
      formData.email !== mockClient?.email ||
      formData.phone !== mockClient?.phone ||
      formData.company !== mockClient?.company ||
      formData.status !== mockClient?.status ||
      formData.street !== (mockClient?.address?.street || '') ||
      formData.city !== (mockClient?.address?.city || '') ||
      formData.state !== (mockClient?.address?.state || '') ||
      formData.postalCode !== (mockClient?.address?.postalCode || '') ||
      formData.country !== (mockClient?.address?.country || 'Nigeria');
  }, [formData, mockClient]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = validateForm(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      // Update client in localStorage if it exists there
      const localStorageClientsJSON = localStorage.getItem('cargotrack_clients');
      if (localStorageClientsJSON && id) {
        try {
          const localStorageClients = JSON.parse(localStorageClientsJSON);
          if (localStorageClients[id]) {
            // Update existing client in localStorage
            localStorageClients[id] = {
              ...localStorageClients[id],
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              company: formData.company,
              status: formData.status,
              address: {
                street: formData.street,
                city: formData.city,
                state: formData.state,
                postalCode: formData.postalCode,
                country: formData.country
              },
              updatedAt: new Date().toISOString().split('T')[0]
            };
            localStorage.setItem('cargotrack_clients', JSON.stringify(localStorageClients));
          }
        } catch (error) {
          console.error('Error updating localStorage:', error);
        }
      }

      console.log('✅ Client updated:', formData);
      setSuccessMessage('✅ Client updated successfully!');
      
      setTimeout(() => {
        navigate(`/clients/${id}`);
      }, 1500);
    }, 1000);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    
    setTimeout(() => {
      // Delete from localStorage if it exists
      const localStorageClientsJSON = localStorage.getItem('cargotrack_clients');
      if (localStorageClientsJSON && id) {
        try {
          const localStorageClients = JSON.parse(localStorageClientsJSON);
          if (localStorageClients[id]) {
            delete localStorageClients[id];
            localStorage.setItem('cargotrack_clients', JSON.stringify(localStorageClients));
          }
        } catch (error) {
          console.error('Error deleting from localStorage:', error);
        }
      }

      console.log('🗑️ Client deleted:', id);
      navigate('/clients');
    }, 1000);
  };

  if (!mockClient) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        padding: '32px 24px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: '#6b7280' }}>
          <p style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 16px 0' }}>
            Client not found
          </p>
          <button
            onClick={() => navigate('/clients')}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Back to Clients
          </button>
        </div>
      </div>
    );
  }

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
        alignItems: 'center',
        gap: '16px'
      }}>
        <button
          onClick={() => navigate(`/clients/${id}`)}
          style={{
            width: '40px',
            height: '40px',
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
          <ArrowLeft size={20} color="#6b7280" />
        </button>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', margin: 0 }}>
            Edit Client
          </h1>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
            {mockClient.name}
          </p>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div style={{
          backgroundColor: '#d1fae5',
          borderLeft: '4px solid #10b981',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
          color: '#065f46',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          {successMessage}
        </div>
      )}

      {/* Form Container */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        padding: '32px',
        maxWidth: '800px'
      }}>
        <form onSubmit={handleSubmit}>
          {/* Section: Basic Information */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: '0 0 20px 0' }}>
              📋 Basic Information
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              {/* Name */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#111827', display: 'block', marginBottom: '6px' }}>
                  Client Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: errors.name ? '2px solid #ef4444' : '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    if (!errors.name) {
                      e.currentTarget.style.borderColor = '#ea580c';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(234, 88, 12, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.name) {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                />
                {errors.name && (
                  <p style={{ fontSize: '12px', color: '#ef4444', margin: '4px 0 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={14} />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Company */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#111827', display: 'block', marginBottom: '6px' }}>
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
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

            {/* Email & Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#111827', display: 'block', marginBottom: '6px' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: errors.email ? '2px solid #ef4444' : '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    if (!errors.email) {
                      e.currentTarget.style.borderColor = '#ea580c';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(234, 88, 12, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.email) {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                />
                {errors.email && (
                  <p style={{ fontSize: '12px', color: '#ef4444', margin: '4px 0 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={14} />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#111827', display: 'block', marginBottom: '6px' }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: errors.phone ? '2px solid #ef4444' : '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    if (!errors.phone) {
                      e.currentTarget.style.borderColor = '#ea580c';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(234, 88, 12, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.phone) {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                />
                {errors.phone && (
                  <p style={{ fontSize: '12px', color: '#ef4444', margin: '4px 0 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={14} />
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section: Status */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: '0 0 20px 0' }}>
              🏷️ Client Status
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {['pending', 'active', 'inactive'].map(status => (
                <label
                  key={status}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    backgroundColor: formData.status === status ? '#eff6ff' : '#f9fafb',
                    border: formData.status === status ? '2px solid #ea580c' : '1px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (formData.status !== status) {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (formData.status !== status) {
                      e.currentTarget.style.backgroundColor = '#f9fafb';
                    }
                  }}
                >
                  <input
                    type="radio"
                    name="status"
                    value={status}
                    checked={formData.status === status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    style={{ marginRight: '8px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#111827', textTransform: 'capitalize' }}>
                    {status === 'pending' && '🟡 Pending'}
                    {status === 'active' && '🟢 Active'}
                    {status === 'inactive' && '⚪ Inactive'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Section: Address (Collapsible) */}
          <div style={{ marginBottom: '24px' }}>
            <button
              type="button"
              onClick={() => setShowAddressForm(!showAddressForm)}
              style={{
                padding: '12px 16px',
                backgroundColor: showAddressForm ? '#eff6ff' : '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#111827',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                width: '100%',
                justifyContent: 'flex-start'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = showAddressForm ? '#eff6ff' : '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = showAddressForm ? '#eff6ff' : '#f9fafb';
              }}
            >
              <span>{showAddressForm ? '▼' : '▶'}</span>
              📍 Address Information
            </button>

            {showAddressForm && (
              <div style={{ marginTop: '16px', display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#111827', display: 'block', marginBottom: '6px' }}>
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={formData.street}
                    onChange={(e) => handleInputChange('street', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#111827', display: 'block', marginBottom: '6px' }}>
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#111827', display: 'block', marginBottom: '6px' }}>
                      State
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#111827', display: 'block', marginBottom: '6px' }}>
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#111827', display: 'block', marginBottom: '6px' }}>
                    Country
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontFamily: 'inherit'
                    }}
                  >
                    <option value="Nigeria">Nigeria</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Kenya">Kenya</option>
                    <option value="South Africa">South Africa</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr', gap: '12px', marginTop: '32px' }}>
            {!showDeleteConfirm ? (
              <>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  style={{
                    padding: '12px 16px',
                    backgroundColor: '#fee2e2',
                    color: '#dc2626',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fecaca';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#fee2e2';
                  }}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/clients/${id}`)}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: '#f3f4f6',
                    color: '#111827',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
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
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !isFormDirty}
                  style={{
                    padding: '12px 20px',
                    background: isSubmitting || !isFormDirty ? '#d1d5db' : 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: isSubmitting || !isFormDirty ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 6px rgba(234, 88, 12, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting && isFormDirty) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 12px rgba(234, 88, 12, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting && isFormDirty) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 6px rgba(234, 88, 12, 0.2)';
                    }
                  }}
                >
                  <Save size={18} />
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <>
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{
                    backgroundColor: '#fee2e2',
                    borderLeft: '4px solid #dc2626',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '12px'
                  }}>
                    <p style={{ color: '#991b1b', fontSize: '14px', fontWeight: '600', margin: 0 }}>
                      ⚠️ Are you sure you want to delete this client?
                    </p>
                    <p style={{ color: '#7f1d1d', fontSize: '13px', margin: '4px 0 0 0' }}>
                      This action cannot be undone.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  style={{
                    padding: '12px 16px',
                    backgroundColor: '#f3f4f6',
                    color: '#111827',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/clients')}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: '#f3f4f6',
                    color: '#111827',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Keep Client
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleDelete}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: isDeleting ? '#991b1b' : '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: isDeleting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (!isDeleting) {
                      e.currentTarget.style.backgroundColor = '#991b1b';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isDeleting) {
                      e.currentTarget.style.backgroundColor = '#dc2626';
                    }
                  }}
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete Client'}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientEdit;