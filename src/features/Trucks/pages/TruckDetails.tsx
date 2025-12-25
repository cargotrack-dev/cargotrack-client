// src/features/Trucks/pages/TruckDetails.tsx
// ✨ TRUCK DETAILS - Professional view integrated with Maintenance module
// ✅ UPDATED: Uses vehicleId query param for MaintenanceScheduleForm

import React, { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Fuel,
  Wrench,
  Gauge,
  MapPin
} from 'lucide-react'

interface TruckDetails {
  id: string
  plateNumber?: string
  licensePlate?: string
  model: string
  year: number
  status: 'Available' | 'In Transit' | 'Maintenance'
  vin?: string
  engineType?: string
  fuelCapacity: number
  fuelLevel: number
  odometerReading: number
  dimensions?: {
    length: number
    width: number
    height: number
    maxLoad: number
  }
  lastMaintenance: string
  nextServiceDue?: string
  assignedDriver?: string
  driverName?: string
  purchaseDate?: string
  purchasePrice?: number
  notes?: string
  location?: string
  createdAt?: string
  updatedAt?: string
}

// Mock truck data - outside component to avoid dependency issues
const MOCK_TRUCK: TruckDetails = {
  id: '1',
  plateNumber: 'ABC-1234',
  licensePlate: 'ABC-1234',
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
  driverName: 'John Doe',
  purchaseDate: '2022-01-10',
  purchasePrice: 150000,
  notes: 'This truck is in excellent condition and has been regularly serviced.',
  location: 'Lagos Depot, Nigeria'
}

const TruckDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // ✅ GET TRUCK DATA - localStorage first, then mock
  const truck = useMemo(() => {
    if (!id) return MOCK_TRUCK

    try {
      const localStorageTrucksJSON = localStorage.getItem('cargotrack_trucks')
      if (localStorageTrucksJSON) {
        const localStorageTrucks = JSON.parse(localStorageTrucksJSON)
        if (localStorageTrucks[id]) {
          return {
            ...MOCK_TRUCK,
            ...localStorageTrucks[id],
            id
          }
        }
      }
    } catch (error) {
      console.error('Error reading truck from localStorage:', error)
    }

    return { ...MOCK_TRUCK, id }
  }, [id])

  const plateNumber = truck.plateNumber || truck.licensePlate || `Truck-${truck.id}`
  const driverName = truck.assignedDriver || truck.driverName || 'Unassigned'
  const fuelPercentage = Math.round((truck.fuelLevel / truck.fuelCapacity) * 100)

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* HEADER */}
      <div style={{ marginBottom: '32px' }}>
        <button
          onClick={() => navigate('/trucks')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#2563eb',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            marginBottom: '16px',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#1d4ed8')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#2563eb')}
        >
          <ArrowLeft size={18} />
          Back to Fleet
        </button>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: '0 0 8px 0'
            }}>
              🚛 {plateNumber}
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: '0',
              marginBottom: '12px'
            }}>
              {truck.model} • {truck.year}
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              <span style={{
                display: 'inline-block',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                backgroundColor:
                  truck.status === 'Available'
                    ? '#f0fdf4'
                    : truck.status === 'In Transit'
                    ? '#eff6ff'
                    : '#fef3c7',
                color:
                  truck.status === 'Available'
                    ? '#166534'
                    : truck.status === 'In Transit'
                    ? '#0c4a6e'
                    : '#92400e'
              }}>
                {truck.status === 'Available' ? '✓ Available' :
                 truck.status === 'In Transit' ? '→ In Transit' :
                 '⚙️ Maintenance'}
              </span>
              {truck.location && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  color: '#6b7280'
                }}>
                  <MapPin size={16} />
                  {truck.location}
                </div>
              )}
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            justifyContent: 'flex-end'
          }}>
            {/* ✅ UPDATED: Link to MaintenanceScheduleForm with vehicleId param */}
            <button
              onClick={() => navigate(`/maintenance/new?vehicleId=${truck.id}&plate=${plateNumber}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                backgroundColor: '#fef3c7',
                color: '#92400e',
                border: '1px solid #fcd34d',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fde68a'
                e.currentTarget.style.borderColor = '#fbbf24'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fef3c7'
                e.currentTarget.style.borderColor = '#fcd34d'
              }}
            >
              <Wrench size={18} />
              Schedule Maintenance
            </button>

            {/* EDIT VEHICLE BUTTON */}
            <button
              onClick={() => navigate(`/trucks/edit/${truck.id}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)'
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.4)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              ✏️ Edit Vehicle
            </button>
          </div>
        </div>
      </div>

      {/* FUEL & STATUS CARDS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* Fuel Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Fuel size={18} style={{ color: 'white' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', margin: '0' }}>FUEL LEVEL</h3>
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0' }}>Current capacity</p>
            </div>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: '0' }}>
                {fuelPercentage}%
              </p>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '0' }}>
                {truck.fuelLevel}L / {truck.fuelCapacity}L
              </p>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#e5e7eb',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${fuelPercentage}%`,
                height: '100%',
                background: fuelPercentage > 50 ? 'linear-gradient(90deg, #10b981, #34d399)' : fuelPercentage > 25 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : 'linear-gradient(90deg, #ef4444, #f87171)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
          <p style={{
            fontSize: '11px',
            color: fuelPercentage > 50 ? '#166534' : fuelPercentage > 25 ? '#92400e' : '#991b1b',
            margin: '0',
            fontWeight: '500'
          }}>
            {fuelPercentage > 50 ? '✓ Sufficient fuel' : fuelPercentage > 25 ? '⚠️ Refueling needed soon' : '🚨 Critical - Refuel immediately'}
          </p>
        </div>

        {/* Odometer Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Gauge size={18} style={{ color: 'white' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', margin: '0' }}>ODOMETER</h3>
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0' }}>Total distance</p>
            </div>
          </div>
          <p style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: '0'
          }}>
            {(truck.odometerReading / 1000).toFixed(1)}k km
          </p>
        </div>

        {/* Last Maintenance Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Wrench size={18} style={{ color: 'white' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', margin: '0' }}>LAST MAINTENANCE</h3>
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0' }}>Service date</p>
            </div>
          </div>
          <p style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: '0'
          }}>
            {truck.lastMaintenance}
          </p>
          {truck.nextServiceDue && (
            <p style={{
              fontSize: '12px',
              color: '#6b7280',
              margin: '8px 0 0 0'
            }}>
              Next: {truck.nextServiceDue}
            </p>
          )}
        </div>
      </div>

      {/* DETAILED SECTIONS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {/* General Information */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#1f2937',
            margin: '0 0 16px 0'
          }}>
            📋 General Information
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {truck.vin && (
              <div>
                <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', margin: '0' }}>VIN</p>
                <p style={{ fontSize: '14px', color: '#1f2937', margin: '0', marginTop: '4px' }}>
                  {truck.vin}
                </p>
              </div>
            )}
            {truck.engineType && (
              <div>
                <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', margin: '0' }}>ENGINE TYPE</p>
                <p style={{ fontSize: '14px', color: '#1f2937', margin: '0', marginTop: '4px' }}>
                  {truck.engineType}
                </p>
              </div>
            )}
            <div>
              <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', margin: '0' }}>ASSIGNED DRIVER</p>
              <p style={{ fontSize: '14px', color: '#1f2937', margin: '0', marginTop: '4px' }}>
                👤 {driverName}
              </p>
            </div>
            {truck.location && (
              <div>
                <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', margin: '0' }}>CURRENT LOCATION</p>
                <p style={{ fontSize: '14px', color: '#1f2937', margin: '0', marginTop: '4px' }}>
                  📍 {truck.location}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Dimensions & Capacity */}
        {truck.dimensions && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <h2 style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#1f2937',
              margin: '0 0 16px 0'
            }}>
              📐 Dimensions & Capacity
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px'
            }}>
              <div>
                <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', margin: '0' }}>LENGTH</p>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: '0', marginTop: '4px' }}>
                  {truck.dimensions.length}m
                </p>
              </div>
              <div>
                <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', margin: '0' }}>WIDTH</p>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: '0', marginTop: '4px' }}>
                  {truck.dimensions.width}m
                </p>
              </div>
              <div>
                <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', margin: '0' }}>HEIGHT</p>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: '0', marginTop: '4px' }}>
                  {truck.dimensions.height}m
                </p>
              </div>
              <div>
                <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', margin: '0' }}>MAX LOAD</p>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: '0', marginTop: '4px' }}>
                  {truck.dimensions.maxLoad}t
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Financial Information */}
        {(truck.purchaseDate || truck.purchasePrice) && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <h2 style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#1f2937',
              margin: '0 0 16px 0'
            }}>
              💰 Financial Information
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {truck.purchaseDate && (
                <div>
                  <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', margin: '0' }}>PURCHASE DATE</p>
                  <p style={{ fontSize: '14px', color: '#1f2937', margin: '0', marginTop: '4px' }}>
                    {truck.purchaseDate}
                  </p>
                </div>
              )}
              {truck.purchasePrice && (
                <div>
                  <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', margin: '0' }}>PURCHASE PRICE</p>
                  <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: '0', marginTop: '4px' }}>
                    ₦{truck.purchasePrice.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* NOTES */}
      {truck.notes && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          marginTop: '20px'
        }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#1f2937',
            margin: '0 0 12px 0'
          }}>
            📝 Notes
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            lineHeight: '1.6',
            margin: '0'
          }}>
            {truck.notes}
          </p>
        </div>
      )}
    </div>
  )
}

export default TruckDetailsPage