// src/features/Clients/pages/ClientNew.tsx
// 🎨 MODERN UI/UX - Create New Client Form with Inline Styles

import React, { useState } from 'react';
import { ArrowLeft, Plus, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ==================== TYPES ====================
interface Address {
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
  createdAt: string;
  updatedAt: string;
  address?: Address;
}

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

// ==================== VALIDATION ====================
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
  // Simple phone validation - at least 10 digits
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
const ClientNew: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'pending',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Nigeria'
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field when user starts typing
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
    
    // Validate form
    const newErrors = validateForm(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Generate new client ID (use timestamp)
      const newClientId = Date.now().toString();
      
      // Create new client object
      const newClient = {
        id: newClientId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        status: formData.status,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country
        }
      };

      // Get existing clients from localStorage
      const existingClientsJSON = localStorage.getItem('cargotrack_clients');
      let existingClients: Record<string, Client> = {};
      
      if (existingClientsJSON) {
        try {
          existingClients = JSON.parse(existingClientsJSON);
        } catch (error) {
          console.error('Error parsing localStorage:', error);
        }
      }

      // Add new client
      existingClients[newClientId] = newClient;

      // Save back to localStorage
      localStorage.setItem('cargotrack_clients', JSON.stringify(existingClients));

      console.log('✅ New client created and saved to localStorage:', newClient);
      setSuccessMessage('✅ Client created successfully!');
      
      // Redirect to new client details page
      setTimeout(() => {
        navigate(`/clients/${newClientId}`);
      }, 1500);
    }, 1000);
  };

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
          onClick={() => navigate('/clients')}
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
            Create New Client
          </h1>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
            Add a new client to your CargoTrack system
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
                  placeholder="e.g. John Smith"
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
                  placeholder="e.g. ABC Logistics Nigeria"
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
              {/* Email */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#111827', display: 'block', marginBottom: '6px' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="e.g. john@example.com"
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

              {/* Phone */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#111827', display: 'block', marginBottom: '6px' }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="e.g. +234 801 234 5678"
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
                {/* Street */}
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#111827', display: 'block', marginBottom: '6px' }}>
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={formData.street}
                    onChange={(e) => handleInputChange('street', e.target.value)}
                    placeholder="e.g. 123 Lekki Expressway"
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

                {/* City, State, Zip */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#111827', display: 'block', marginBottom: '6px' }}>
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="e.g. Lagos"
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
                      placeholder="e.g. Lagos"
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
                      placeholder="e.g. 106104"
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

                {/* Country */}
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '32px' }}>
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
              disabled={isSubmitting}
              style={{
                padding: '12px 20px',
                background: isSubmitting ? '#d1d5db' : 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 6px rgba(234, 88, 12, 0.2)'
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 12px rgba(234, 88, 12, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(234, 88, 12, 0.2)';
                }
              }}
            >
              <Plus size={18} />
              {isSubmitting ? 'Creating...' : 'Create Client'}
            </button>
          </div>
        </form>
      </div>

      {/* Form Tips */}
      <div style={{
        marginTop: '24px',
        backgroundColor: '#eff6ff',
        borderLeft: '4px solid #3b82f6',
        borderRadius: '8px',
        padding: '16px',
        fontSize: '13px',
        color: '#1e40af'
      }}>
        <p style={{ margin: 0, fontWeight: '600', marginBottom: '8px' }}>
          💡 Form Tips:
        </p>
        <ul style={{ margin: '0', paddingLeft: '20px' }}>
          <li>Fields marked with * are required</li>
          <li>Email must be a valid format (e.g., user@example.com)</li>
          <li>Phone number must have at least 10 digits</li>
          <li>Address information is optional</li>
          <li>New clients are created with 'Pending' status by default</li>
        </ul>
      </div>

      <style>{`
        input:-webkit-autofill,
        select:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px white inset !important;
        }
      `}</style>
    </div>
  );
};

export default ClientNew;