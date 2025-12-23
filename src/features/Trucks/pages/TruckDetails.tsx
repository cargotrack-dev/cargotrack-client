// src/features/Trucks/pages/TruckDetails.tsx
// ✨ MODERN TRUCK DETAILS - INVESTOR-READY DESIGN
// Professional vehicle analytics and management dashboard

import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Fuel,
  Wrench,
  Zap,
  Gauge,
  Calendar,
  User,
  MapPin,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Download
} from 'lucide-react'

interface TruckDetails {
  id: string
  plateNumber: string
  model: string
  year: number
  status: 'Available' | 'In Transit' | 'Maintenance'
  vin: string
  engineType: string
  fuelCapacity: number
  fuelLevel: number
  odometerReading: number
  dimensions: { length: number; width: number; height: number; maxLoad: number }
  lastMaintenance: string
  nextServiceDue: string
  assignedDriver: string
  purchaseDate: string
  purchasePrice: number
  notes: string
  location?: string
}

const TruckDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // Mock truck data
  const truck: TruckDetails = {
    id: id || '1',
    plateNumber: 'ABC-1234',
    model: 'Volvo FH16',
    year: 2022,
    status: 'Available',
    vin: 'YS2R4X20005399401',
    engineType: 'Diesel',
    fuelCapacity: 600,
    fuelLevel: 450,
    odometerReading: 25000,
    dimensions: {
      length: 16.5,
      width: 2.5,
      height: 4.0,
      maxLoad: 40000
    },
    lastMaintenance: '2023-05-15',
    nextServiceDue: '2023-11-15',
    assignedDriver: 'John Doe',
    purchaseDate: '2022-01-10',
    purchasePrice: 150000,
    notes: 'This truck is in excellent condition and has been regularly serviced.',
    location: 'Lagos Depot, Nigeria'
  }

  const fuelPercentage = Math.round((truck.fuelLevel / truck.fuelCapacity) * 100)
  const daysUntilService = 45 // Calculate based on nextServiceDue
  const vehicleAge = new Date().getFullYear() - truck.year
  const maintenanceStatus = daysUntilService < 30 ? 'Due Soon' : 'On Schedule'

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return { bg: '#f0fdf4', text: '#166534', border: '#dcfce7' }
      case 'In Transit':
        return { bg: '#eff6ff', text: '#0c4a6e', border: '#dbeafe' }
      case 'Maintenance':
        return { bg: '#fffbeb', text: '#92400e', border: '#fef3c7' }
      default:
        return { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' }
    }
  }

  const statusColor = getStatusColor(truck.status)

  return (
    <div style={{ padding: '24px' }}>
      {/* HEADER */}
      <div style={{ marginBottom: '32px' }}>
        <button
          onClick={() => navigate('/trucks')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: 'transparent',
            color: '#2563eb',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            marginBottom: '16px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <ArrowLeft size={18} />
          Back to Fleet
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>
              🚛 {truck.plateNumber}
            </h1>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>
              {truck.model} • {truck.year} • {vehicleAge} years old
            </p>
          </div>
          <div style={{
            padding: '12px 20px',
            backgroundColor: statusColor.bg,
            color: statusColor.text,
            borderRadius: '8px',
            border: `1px solid ${statusColor.border}`,
            fontSize: '14px',
            fontWeight: '600'
          }}>
            ● {truck.status}
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        {/* FUEL STATUS CARD */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#fef3c7',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Fuel size={20} color='#d97706' />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0' }}>Fuel Status</h3>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px',
              fontSize: '13px',
              color: '#6b7280'
            }}>
              <span>Current Level</span>
              <span style={{ fontWeight: '600', color: '#1f2937' }}>{fuelPercentage}%</span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#e5e7eb',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div
                style={{
                  width: `${fuelPercentage}%`,
                  height: '100%',
                  backgroundColor: fuelPercentage > 50 ? '#10b981' : fuelPercentage > 25 ? '#f59e0b' : '#ef4444',
                  transition: 'width 0.2s'
                }}
              />
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            padding: '12px',
            backgroundColor: '#f9fafb',
            borderRadius: '8px'
          }}>
            <div>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>CAPACITY</p>
              <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', margin: '0' }}>
                {truck.fuelCapacity}L
              </p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>CURRENT</p>
              <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', margin: '0' }}>
                {truck.fuelLevel}L
              </p>
            </div>
          </div>
        </div>

        {/* MAINTENANCE CARD */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#dbeafe',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Wrench size={20} color='#0369a1' />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0' }}>Maintenance</h3>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>LAST SERVICE</p>
            <p style={{ fontSize: '15px', fontWeight: '600', color: '#1f2937', margin: '0' }}>
              {truck.lastMaintenance}
            </p>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>NEXT DUE</p>
            <p style={{ fontSize: '15px', fontWeight: '600', color: '#1f2937', margin: '0' }}>
              {truck.nextServiceDue}
            </p>
            <p style={{
              fontSize: '12px',
              color: daysUntilService < 30 ? '#d97706' : '#10b981',
              margin: '4px 0 0 0',
              fontWeight: '600'
            }}>
              {daysUntilService < 30 ? '⚠️ ' : '✓ '}{daysUntilService} days ({maintenanceStatus})
            </p>
          </div>

          <button style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
          >
            Schedule Maintenance
          </button>
        </div>

        {/* PERFORMANCE METRICS CARD */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#dcfce7',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Gauge size={20} color='#16a34a' />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0' }}>Performance</h3>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px'
          }}>
            <div style={{
              padding: '12px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px'
            }}>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>ODOMETER</p>
              <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', margin: '0' }}>
                {(truck.odometerReading / 1000).toFixed(1)}k km
              </p>
            </div>
            <div style={{
              padding: '12px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px'
            }}>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>AVG CONSUMPTION</p>
              <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', margin: '0' }}>
                27.5 L/100km
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* DETAILED SPECIFICATIONS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        {/* GENERAL INFO CARD */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>
            General Information
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0', fontWeight: '500' }}>VIN</p>
              <p style={{ fontSize: '13px', color: '#1f2937', margin: '0', fontFamily: 'monospace' }}>
                {truck.vin}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0', fontWeight: '500' }}>ENGINE TYPE</p>
              <p style={{ fontSize: '13px', color: '#1f2937', margin: '0' }}>{truck.engineType}</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0', fontWeight: '500' }}>ASSIGNED DRIVER</p>
              <p style={{ fontSize: '13px', color: '#1f2937', margin: '0' }}>👤 {truck.assignedDriver}</p>
            </div>
            {truck.location && (
              <div>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0', fontWeight: '500' }}>CURRENT LOCATION</p>
                <p style={{ fontSize: '13px', color: '#1f2937', margin: '0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} /> {truck.location}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* DIMENSIONS CARD */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>
            Dimensions & Capacity
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px'
          }}>
            <div style={{ padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0', fontWeight: '500' }}>LENGTH</p>
              <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', margin: '0' }}>
                {truck.dimensions.length}m
              </p>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0', fontWeight: '500' }}>WIDTH</p>
              <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', margin: '0' }}>
                {truck.dimensions.width}m
              </p>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0', fontWeight: '500' }}>HEIGHT</p>
              <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', margin: '0' }}>
                {truck.dimensions.height}m
              </p>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0', fontWeight: '500' }}>MAX LOAD</p>
              <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', margin: '0' }}>
                {(truck.dimensions.maxLoad / 1000).toFixed(0)}t
              </p>
            </div>
          </div>
        </div>

        {/* FINANCIAL INFO CARD */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>
            Financial Information
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0', fontWeight: '500' }}>PURCHASE DATE</p>
              <p style={{ fontSize: '13px', color: '#1f2937', margin: '0' }}>{truck.purchaseDate}</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0', fontWeight: '500' }}>PURCHASE PRICE</p>
              <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', margin: '0' }}>
                ${truck.purchasePrice.toLocaleString()}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0', fontWeight: '500' }}>ASSET VALUE (EST.)</p>
              <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#10b981', margin: '0' }}>
                ${Math.round(truck.purchasePrice * 0.75).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* NOTES SECTION */}
      {truck.notes && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '24px'
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 12px 0' }}>
            📝 Notes
          </h2>
          <p style={{ fontSize: '13px', color: '#374151', margin: '0', lineHeight: '1.6' }}>
            {truck.notes}
          </p>
        </div>
      )}

      {/* ACTION BUTTONS */}
      <div style={{
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end'
      }}>
        <button style={{
          padding: '10px 20px',
          backgroundColor: '#f3f4f6',
          color: '#374151',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e5e7eb')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
        >
          <Download size={14} style={{ marginRight: '4px', display: 'inline' }} />
          Export Report
        </button>
        <button style={{
          padding: '10px 20px',
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
        >
          Edit Vehicle
        </button>
      </div>
    </div>
  )
}

export default TruckDetailsPage