// src/features/Trucks/components/TruckForm.tsx
// ✨ MODERN TRUCK FORM - GRADIENT UI WITH INLINE STYLES
// Professional, responsive design with smooth animations

import React, { useState } from 'react'
import { Truck, User, MapPin, Package, Calendar, AlertCircle } from 'lucide-react'

export interface TruckFormData {
  licensePlate: string
  driverName: string
  driverLicense: string
  loadingLocation: string
  destination: string
  cargoType: string
  cargoWeight: string
  loadDate: string
  eta: string
  status: 'available' | 'in_transit' | 'loading' | 'maintenance'
}

interface TruckFormProps {
  onSubmit: (data: TruckFormData) => void
  onCancel?: () => void
  initialData?: TruckFormData
}

const TruckForm: React.FC<TruckFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState<TruckFormData>(
    initialData || {
      licensePlate: '',
      driverName: '',
      driverLicense: '',
      loadingLocation: '',
      destination: '',
      cargoType: '',
      cargoWeight: '',
      loadDate: '',
      eta: '',
      status: 'available',
    }
  )

  const [errors, setErrors] = useState<Partial<TruckFormData>>({})
  const [loading, setLoading] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Partial<TruckFormData> = {}
    if (!formData.licensePlate.trim()) newErrors.licensePlate = 'required'
    if (!formData.driverName.trim()) newErrors.driverName = 'required'
    if (!formData.driverLicense.trim()) newErrors.driverLicense = 'required'
    if (!formData.loadingLocation.trim()) newErrors.loadingLocation = 'required'
    if (!formData.destination.trim()) newErrors.destination = 'required'
    if (!formData.cargoType.trim()) newErrors.cargoType = 'required'
    if (!formData.cargoWeight.trim()) newErrors.cargoWeight = 'required'
    if (!formData.loadDate.trim()) newErrors.loadDate = 'required'
    if (!formData.eta.trim()) newErrors.eta = 'required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof TruckFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(() => resolve(undefined), 500))
      onSubmit(formData)
    } finally {
      setLoading(false)
    }
  }

  const FormInput = ({
    label,
    name,
    type = 'text',
    placeholder,
    value,
    icon: Icon,
    required = true
  }: {
    label: string
    name: keyof TruckFormData
    type?: string
    placeholder?: string
    value: string
    icon?: React.ElementType
    required?: boolean
  }) => {
    const hasError = errors[name]
    return (
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
          fontWeight: '600',
          color: '#374151',
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {Icon && <Icon size={16} style={{ color: '#2563eb' }} />}
          {label}
          {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
        <input
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: hasError ? '2px solid #ef4444' : '2px solid #e5e7eb',
            borderRadius: '10px',
            fontSize: '14px',
            fontFamily: 'inherit',
            backgroundColor: hasError ? '#fef2f2' : '#f9fafb',
            transition: 'all 0.3s ease',
            outline: 'none',
            boxShadow: hasError ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : 'none'
          }}
          onFocus={(e) => {
            if (!hasError) {
              e.currentTarget.style.borderColor = '#2563eb'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
              e.currentTarget.style.backgroundColor = '#ffffff'
            }
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = hasError ? '#ef4444' : '#e5e7eb'
            e.currentTarget.style.boxShadow = hasError ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : 'none'
            e.currentTarget.style.backgroundColor = hasError ? '#fef2f2' : '#f9fafb'
          }}
        />
        {hasError && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '6px',
            fontSize: '12px',
            color: '#ef4444',
            fontWeight: '500'
          }}>
            <AlertCircle size={14} />
            This field is required
          </div>
        )}
      </div>
    )
  }

  const FormSelect = ({
    label,
    name,
    options,
    value,
    icon: Icon,
    required = true
  }: {
    label: string
    name: keyof TruckFormData
    options: { value: string; label: string }[]
    value: string
    icon?: React.ElementType
    required?: boolean
  }) => {
    const hasError = errors[name]
    return (
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
          fontWeight: '600',
          color: '#374151',
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {Icon && <Icon size={16} style={{ color: '#2563eb' }} />}
          {label}
          {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
        <select
          name={name}
          value={value}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: hasError ? '2px solid #ef4444' : '2px solid #e5e7eb',
            borderRadius: '10px',
            fontSize: '14px',
            fontFamily: 'inherit',
            backgroundColor: hasError ? '#fef2f2' : '#f9fafb',
            color: '#1f2937',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            outline: 'none',
            boxShadow: hasError ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : 'none'
          }}
          onFocus={(e) => {
            if (!hasError) {
              e.currentTarget.style.borderColor = '#2563eb'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
              e.currentTarget.style.backgroundColor = '#ffffff'
            }
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = hasError ? '#ef4444' : '#e5e7eb'
            e.currentTarget.style.boxShadow = hasError ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : 'none'
            e.currentTarget.style.backgroundColor = hasError ? '#fef2f2' : '#f9fafb'
          }}
        >
          <option value="">Select {label}</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {hasError && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '6px',
            fontSize: '12px',
            color: '#ef4444',
            fontWeight: '500'
          }}>
            <AlertCircle size={14} />
            This field is required
          </div>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '100%' }}>
      {/* SECTION 1: TRUCK INFORMATION */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '28px',
        marginBottom: '24px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div style={{
            padding: '10px 14px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Truck size={20} style={{ color: 'white' }} />
          </div>
          <div>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#1f2937',
              margin: '0'
            }}>
              🚛 Truck Information
            </h2>
            <p style={{
              fontSize: '12px',
              color: '#6b7280',
              margin: '4px 0 0 0'
            }}>
              Enter basic truck details
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          <FormInput
            label="License Plate"
            name="licensePlate"
            placeholder="e.g., ABC-1234"
            value={formData.licensePlate}
            icon={Truck}
          />
          <FormSelect
            label="Status"
            name="status"
            value={formData.status}
            icon={AlertCircle}
            options={[
              { value: 'available', label: '✓ Available' },
              { value: 'in_transit', label: '→ In Transit' },
              { value: 'loading', label: '📦 Loading' },
              { value: 'maintenance', label: '⚙️ Maintenance' }
            ]}
          />
        </div>
      </div>

      {/* SECTION 2: DRIVER INFORMATION */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '28px',
        marginBottom: '24px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div style={{
            padding: '10px 14px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <User size={20} style={{ color: 'white' }} />
          </div>
          <div>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#1f2937',
              margin: '0'
            }}>
              👤 Driver Information
            </h2>
            <p style={{
              fontSize: '12px',
              color: '#6b7280',
              margin: '4px 0 0 0'
            }}>
              Driver details and license information
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          <FormInput
            label="Driver Name"
            name="driverName"
            placeholder="e.g., John Doe"
            value={formData.driverName}
            icon={User}
          />
          <FormInput
            label="Driver License Number"
            name="driverLicense"
            placeholder="e.g., DRV-001"
            value={formData.driverLicense}
            icon={User}
          />
        </div>
      </div>

      {/* SECTION 3: LOADING & DESTINATION */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '28px',
        marginBottom: '24px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div style={{
            padding: '10px 14px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MapPin size={20} style={{ color: 'white' }} />
          </div>
          <div>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#1f2937',
              margin: '0'
            }}>
              📍 Loading & Destination
            </h2>
            <p style={{
              fontSize: '12px',
              color: '#6b7280',
              margin: '4px 0 0 0'
            }}>
              Pickup and delivery locations
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          <FormInput
            label="Loading Location"
            name="loadingLocation"
            placeholder="e.g., Lagos Depot"
            value={formData.loadingLocation}
            icon={MapPin}
          />
          <FormInput
            label="Destination"
            name="destination"
            placeholder="e.g., Abuja"
            value={formData.destination}
            icon={MapPin}
          />
          <FormInput
            label="Loading Date"
            name="loadDate"
            type="date"
            value={formData.loadDate}
            icon={Calendar}
          />
          <FormInput
            label="Estimated Arrival Date"
            name="eta"
            type="date"
            value={formData.eta}
            icon={Calendar}
          />
        </div>
      </div>

      {/* SECTION 4: CARGO INFORMATION */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '28px',
        marginBottom: '24px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div style={{
            padding: '10px 14px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Package size={20} style={{ color: 'white' }} />
          </div>
          <div>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#1f2937',
              margin: '0'
            }}>
              📦 Cargo Information
            </h2>
            <p style={{
              fontSize: '12px',
              color: '#6b7280',
              margin: '4px 0 0 0'
            }}>
              What's being shipped
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          <FormInput
            label="Cargo Type"
            name="cargoType"
            placeholder="e.g., Electronics"
            value={formData.cargoType}
            icon={Package}
          />
          <FormInput
            label="Cargo Weight (kg)"
            name="cargoWeight"
            type="number"
            placeholder="e.g., 5000"
            value={formData.cargoWeight}
            icon={Package}
          />
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        marginTop: '32px'
      }}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              border: '2px solid #e5e7eb',
              backgroundColor: '#ffffff',
              color: '#374151',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6'
              e.currentTarget.style.borderColor = '#d1d5db'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff'
              e.currentTarget.style.borderColor = '#e5e7eb'
            }}
          >
            ← Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: '600',
            border: 'none',
            background: loading 
              ? 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)'
              : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: 'white',
            borderRadius: '10px',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            boxShadow: loading ? 'none' : '0 4px 12px rgba(37, 99, 235, 0.3)',
            gridColumn: onCancel ? 'auto' : 'span 2'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.background = 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)'
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.4)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)'
              e.currentTarget.style.transform = 'translateY(0)'
            }
          }}
        >
          {loading ? '⏳ Saving...' : '✓ Save Information'}
        </button>
      </div>

      {/* HELPFUL TIPS */}
      <div style={{
        marginTop: '28px',
        padding: '16px',
        backgroundColor: '#f0fdf4',
        borderRadius: '10px',
        border: '1px solid #dcfce7',
        fontSize: '12px',
        color: '#166534',
        lineHeight: '1.6'
      }}>
        <p style={{ margin: '0 0 8px 0', fontWeight: '600' }}>
          💡 Tips for adding a truck:
        </p>
        <ul style={{ margin: '0', paddingLeft: '20px' }}>
          <li>Use your truck's official license plate number</li>
          <li>Ensure driver information matches government ID</li>
          <li>Confirm loading and destination locations are valid</li>
          <li>Set realistic delivery timeframes</li>
        </ul>
      </div>
    </form>
  )
}

export default TruckForm