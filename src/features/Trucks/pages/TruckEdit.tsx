// src/features/Trucks/pages/TruckEdit.tsx
// ✨ EDIT TRUCK - Fixed ESLint warnings

import React, { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import TruckForm, { TruckFormData } from '../components/TruckForm'

interface Truck extends TruckFormData {
  id: string
  createdAt: string
  updatedAt: string
}

// ✅ MOCK_TRUCK moved outside component - fixes exhaustive-deps
const MOCK_TRUCK: Truck = {
  id: '1',
  licensePlate: 'ABC-1234',
  driverName: 'John Doe',
  driverLicense: 'DRV-001',
  loadingLocation: 'Lagos Depot',
  destination: 'Abuja',
  cargoType: 'Electronics',
  cargoWeight: '5000',
  loadDate: '2025-01-20',
  eta: '2025-01-22',
  status: 'available',
  createdAt: '2025-01-15',
  updatedAt: '2025-01-15'
}

const TruckEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // ✅ Get truck data from localStorage
  const truck = useMemo(() => {
    if (!id) return MOCK_TRUCK
    
    try {
      const localStorageTrucksJSON = localStorage.getItem('cargotrack_trucks')
      if (localStorageTrucksJSON) {
        const localStorageTrucks = JSON.parse(localStorageTrucksJSON)
        if (localStorageTrucks[id]) {
          return {
            ...localStorageTrucks[id],
            createdAt: localStorageTrucks[id].createdAt || new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0]
          }
        }
      }
    } catch (error) {
      console.error('Error reading truck from localStorage:', error)
    }
    
    return { ...MOCK_TRUCK, id }
  }, [id])

  const [successMessage, setSuccessMessage] = useState(false)

  const handleSubmit = async (data: TruckFormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Update localStorage
      const localStorageTrucksJSON = localStorage.getItem('cargotrack_trucks')
      const localStorageTrucks = localStorageTrucksJSON ? JSON.parse(localStorageTrucksJSON) : {}
      
      const updatedTruck = {
        ...data,
        id: id,
        createdAt: truck.createdAt,
        updatedAt: new Date().toISOString().split('T')[0]
      }
      
      localStorageTrucks[id as string] = updatedTruck
      localStorage.setItem('cargotrack_trucks', JSON.stringify(localStorageTrucks))

      console.log('✅ Truck updated:', updatedTruck)

      // Show success message
      setSuccessMessage(true)
      setTimeout(() => {
        navigate(`/trucks/${id}`)
      }, 1500)
    } catch (error) {
      console.error('❌ Error updating truck:', error)
    }
  }

  const handleCancel = () => {
    navigate(`/trucks/${id}`)
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* HEADER */}
      <div style={{ marginBottom: '32px' }}>
        <button
          onClick={() => navigate(`/trucks/${id}`)}
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
          Back to Details
        </button>

        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#1f2937',
          margin: '0 0 8px 0'
        }}>
          ✏️ Edit Truck
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#6b7280',
          margin: '0'
        }}>
          Update truck information and details
        </p>
      </div>

      {/* SUCCESS MESSAGE */}
      {successMessage && (
        <div style={{
          padding: '16px',
          backgroundColor: '#f0fdf4',
          borderLeft: '4px solid #10b981',
          borderRadius: '8px',
          marginBottom: '24px',
          animation: 'slideIn 0.3s ease'
        }}>
          <p style={{
            margin: '0',
            color: '#166534',
            fontWeight: '500'
          }}>
            ✅ Truck updated successfully! Redirecting...
          </p>
        </div>
      )}

      {/* FORM */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <TruckForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          initialData={{
            licensePlate: truck.licensePlate || '',
            driverName: truck.driverName || '',
            driverLicense: truck.driverLicense || '',
            loadingLocation: truck.loadingLocation || '',
            destination: truck.destination || '',
            cargoType: truck.cargoType || '',
            cargoWeight: truck.cargoWeight || '',
            loadDate: truck.loadDate || '',
            eta: truck.eta || '',
            status: (truck.status as 'available' | 'in_transit' | 'loading' | 'maintenance') || 'available'
          }}
        />
      </div>

      {/* INLINE STYLES FOR ANIMATIONS */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default TruckEdit