// src/features/Trucks/pages/TruckList.tsx
// ✨ MODERN TRUCK MANAGEMENT - INVESTOR-READY UI/UX
// Enterprise-grade fleet management with stunning visuals

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Truck, 
  Plus, 
  Search, 
  MapPin, 
  TrendingUp
} from 'lucide-react'

interface TruckData {
  id: string
  plateNumber: string
  model: string
  status: 'Available' | 'In Transit' | 'Maintenance'
  year: number
  odometerReading: number
  lastMaintenance: string
  fuelLevel: number
  fuelCapacity: number
  driver?: string
  location?: string
}

const TruckList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Available' | 'In Transit' | 'Maintenance'>('All')

  // Mock truck data
  const trucks: TruckData[] = [
    {
      id: '1',
      plateNumber: 'ABC-1234',
      model: 'Volvo FH16',
      status: 'Available',
      year: 2022,
      odometerReading: 25000,
      lastMaintenance: '2023-05-15',
      fuelLevel: 450,
      fuelCapacity: 600,
      driver: 'John Doe',
      location: 'Lagos, Nigeria'
    },
    {
      id: '2',
      plateNumber: 'XYZ-5678',
      model: 'Mercedes Actros',
      status: 'In Transit',
      year: 2021,
      odometerReading: 45000,
      lastMaintenance: '2023-04-10',
      fuelLevel: 380,
      fuelCapacity: 600,
      driver: 'Jane Smith',
      location: 'Abuja, Nigeria'
    },
    {
      id: '3',
      plateNumber: 'DEF-9012',
      model: 'Scania R450',
      status: 'Maintenance',
      year: 2020,
      odometerReading: 65000,
      lastMaintenance: '2023-12-01',
      fuelLevel: 200,
      fuelCapacity: 600,
      driver: 'Mike Johnson',
      location: 'Port Harcourt, Nigeria'
    },
    {
      id: '4',
      plateNumber: 'GHI-3456',
      model: 'MAN TGX',
      status: 'Available',
      year: 2023,
      odometerReading: 12000,
      lastMaintenance: '2023-11-20',
      fuelLevel: 550,
      fuelCapacity: 600,
      driver: 'Sarah Wilson',
      location: 'Kano, Nigeria'
    }
  ]

  // Filter trucks
  const filteredTrucks = trucks.filter(truck => {
    const matchesSearch = 
      truck.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      truck.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      truck.driver?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'All' || truck.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Calculate fleet statistics
  const fleetStats = {
    total: trucks.length,
    available: trucks.filter(t => t.status === 'Available').length,
    inTransit: trucks.filter(t => t.status === 'In Transit').length,
    maintenance: trucks.filter(t => t.status === 'Maintenance').length,
    avgFuel: Math.round(trucks.reduce((sum, t) => sum + (t.fuelLevel / t.fuelCapacity * 100), 0) / trucks.length),
    totalDistance: trucks.reduce((sum, t) => sum + t.odometerReading, 0)
  }

  // Status color and icon mapping
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Available':
        return { bg: 'bg-emerald-50', text: 'text-emerald-700', badge: 'bg-emerald-100' }
      case 'In Transit':
        return { bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-100' }
      case 'Maintenance':
        return { bg: 'bg-amber-50', text: 'text-amber-700', badge: 'bg-amber-100' }
      default:
        return { bg: 'bg-gray-50', text: 'text-gray-700', badge: 'bg-gray-100' }
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Available':
        return '✓'
      case 'In Transit':
        return '→'
      case 'Maintenance':
        return '⚙️'
      default:
        return '○'
    }
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* HEADER SECTION */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>
              🚛 Fleet Management
            </h1>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>
              Manage and monitor your vehicle fleet in real-time
            </p>
          </div>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
          >
            <Plus size={18} />
            Add New Truck
          </button>
        </div>

        {/* FLEET STATISTICS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {/* Total Trucks Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 8px 0', fontWeight: '500' }}>
              TOTAL TRUCKS
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', margin: '0' }}>
                {fleetStats.total}
              </p>
              <p style={{ fontSize: '14px', color: '#10b981', margin: '0', fontWeight: '500' }}>
                ↑ 2 this month
              </p>
            </div>
          </div>

          {/* Available Card */}
          <div style={{
            backgroundColor: '#f0fdf4',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid #dcfce7',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <p style={{ fontSize: '12px', color: '#166534', margin: '0 0 8px 0', fontWeight: '500' }}>
              AVAILABLE
            </p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#15803d', margin: '0' }}>
              {fleetStats.available}
            </p>
          </div>

          {/* In Transit Card */}
          <div style={{
            backgroundColor: '#eff6ff',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid #dbeafe',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <p style={{ fontSize: '12px', color: '#0c4a6e', margin: '0 0 8px 0', fontWeight: '500' }}>
              IN TRANSIT
            </p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#0369a1', margin: '0' }}>
              {fleetStats.inTransit}
            </p>
          </div>

          {/* Avg Fuel Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 8px 0', fontWeight: '500' }}>
              AVG FUEL LEVEL
            </p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', margin: '0' }}>
              {fleetStats.avgFuel}%
            </p>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTER SECTION */}
      <div style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
        {/* Search Input */}
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search by plate number, model, or driver..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: '40px',
              paddingRight: '16px',
              paddingTop: '10px',
              paddingBottom: '10px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: 'white',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              transition: 'border-color 0.2s, box-shadow 0.2s'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#2563eb'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb'
              e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'
            }}
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          style={{
            padding: '10px 16px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: 'white',
            cursor: 'pointer',
            transition: 'border-color 0.2s'
          }}
        >
          <option>All</option>
          <option>Available</option>
          <option>In Transit</option>
          <option>Maintenance</option>
        </select>
      </div>

      {/* TRUCKS GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {filteredTrucks.map((truck) => {
          const statusStyle = getStatusStyle(truck.status)
          const fuelPercentage = Math.round((truck.fuelLevel / truck.fuelCapacity) * 100)
          
          return (
            <div
              key={truck.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              {/* Card Header */}
              <div style={{
                padding: '16px',
                backgroundColor: statusStyle.bg,
                borderBottom: `2px solid ${statusStyle.text}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: '0' }}>
                      {truck.plateNumber}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#6b7280', margin: '4px 0 0 0' }}>
                      {truck.model} • {truck.year}
                    </p>
                  </div>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    backgroundColor: statusStyle.badge,
                    color: statusStyle.text,
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {getStatusIcon(truck.status)} {truck.status}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '16px' }}>
                {/* Driver & Location */}
                {truck.driver && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '13px' }}>
                    <span style={{ color: '#6b7280' }}>👤 {truck.driver}</span>
                  </div>
                )}
                
                {truck.location && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '13px', color: '#6b7280' }}>
                    <MapPin size={16} />
                    {truck.location}
                  </div>
                )}

                {/* Fuel Gauge */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>FUEL</span>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#1f2937' }}>
                      {fuelPercentage}% ({truck.fuelLevel}L)
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${fuelPercentage}%`,
                      height: '100%',
                      backgroundColor: fuelPercentage > 50 ? '#10b981' : fuelPercentage > 25 ? '#f59e0b' : '#ef4444',
                      transition: 'width 0.2s'
                    }} />
                  </div>
                </div>

                {/* Odometer */}
                <div style={{ marginBottom: '12px', padding: '8px', backgroundColor: '#f3f4f6', borderRadius: '6px' }}>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 2px 0' }}>ODOMETER</p>
                  <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', margin: '0' }}>
                    {(truck.odometerReading / 1000).toFixed(1)}k km
                  </p>
                </div>

                {/* Last Maintenance */}
                <div style={{ marginBottom: '12px', fontSize: '12px', color: '#6b7280' }}>
                  <p style={{ margin: '0' }}>Last Service: {truck.lastMaintenance}</p>
                </div>

                {/* Actions */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '16px' }}>
                  <Link
                    to={`/trucks/${truck.id}`}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      textAlign: 'center',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '600',
                      textDecoration: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
                  >
                    View Details
                  </Link>
                  <button
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '600',
                      border: '1px solid #d1d5db',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e5e7eb')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredTrucks.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: '#f9fafb',
          borderRadius: '12px',
          border: '2px dashed #e5e7eb'
        }}>
          <Truck size={48} style={{ margin: '0 auto 16px', color: '#d1d5db' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#6b7280', margin: '0 0 8px 0' }}>
            No trucks found
          </h3>
          <p style={{ fontSize: '14px', color: '#9ca3af', margin: '0' }}>
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Fleet Summary */}
      <div style={{
        marginTop: '32px',
        padding: '16px',
        backgroundColor: '#f0fdf4',
        borderRadius: '8px',
        border: '1px solid #dcfce7'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#166534' }}>
          <TrendingUp size={18} />
          <strong>Fleet Status:</strong> {fleetStats.available} available, {fleetStats.inTransit} in transit, {fleetStats.maintenance} under maintenance
        </div>
      </div>
    </div>
  )
}

export default TruckList