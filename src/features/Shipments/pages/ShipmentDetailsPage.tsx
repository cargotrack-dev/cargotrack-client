// src/features/Shipments/pages/ShipmentDetailsPage.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Truck, Calendar, User, Phone, AlertCircle, CheckCircle } from 'lucide-react';

interface TrackingEvent {
  id: string;
  timestamp: string;
  status: string;
  location: string;
  notes: string;
}

const mockShipmentDetails = {
  id: '1',
  reference: 'SHIP-2024-001',
  status: 'IN_TRANSIT',
  priority: 'HIGH',
  createdAt: '2024-01-15',
  estimatedDelivery: '2024-01-20',
  
  // Origin
  origin: {
    name: 'ABC Warehouse',
    address: '123 Warehouse Street, Lagos',
    phone: '+234-706-000-0001',
    contact: 'Mr. Adekunle',
  },
  
  // Destination
  destination: {
    name: 'XYZ Store',
    address: '456 Commerce Avenue, Abuja',
    phone: '+234-706-000-0002',
    contact: 'Miss Chioma',
  },
  
  // Shipment Details
  items: [
    { id: 1, description: 'Electronics Box A', quantity: 5, weight: '15kg' },
    { id: 2, description: 'Electronics Box B', quantity: 3, weight: '9kg' },
    { id: 3, description: 'Accessories Pack', quantity: 10, weight: '5kg' },
  ],
  totalWeight: '29kg',
  totalValue: '₦450,000',
  
  // Driver
  driver: {
    name: 'John Doe',
    phone: '+234-706-123-4567',
    license: 'DRV-2024-001',
    rating: 4.8,
  },
  
  // Vehicle
  vehicle: {
    number: 'ABC-123-XY',
    type: 'Truck',
    capacity: '5 tons',
    lastMaintenance: '2024-01-10',
  },
  
  // Tracking Events
  trackingEvents: [
    {
      id: '1',
      timestamp: '2024-01-22 14:30',
      status: 'DELIVERED',
      location: 'Lagos - Warehouse',
      notes: 'Shipment picked up successfully',
    },
    {
      id: '2',
      timestamp: '2024-01-22 18:45',
      location: 'Ogun State - Highway',
      status: 'IN_TRANSIT',
      notes: 'Crossed Ogun state border',
    },
    {
      id: '3',
      timestamp: '2024-01-23 08:00',
      location: 'Kwara State - Transit Point',
      status: 'IN_TRANSIT',
      notes: 'Routine stop at transit point',
    },
    {
      id: '4',
      timestamp: '2024-01-23 15:30',
      location: 'Abuja - Near Destination',
      status: 'IN_TRANSIT',
      notes: 'Entering final destination city',
    },
  ],
};

const ShipmentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
  const shipment = mockShipmentDetails;
  
  const getStatusColor = (status: string) => {
    const configs: Record<string, any> = {
      'PENDING': { bg: '#fef3c7', text: '#92400e', icon: '📋' },
      'IN_TRANSIT': { bg: '#bfdbfe', text: '#1e40af', icon: '🚚' },
      'DELIVERED': { bg: '#dcfce7', text: '#166534', icon: '✓' },
      'DELAYED': { bg: '#fee2e2', text: '#991b1b', icon: '⚠️' },
    };
    return configs[status] || configs['PENDING'];
  };

  const statusColor = getStatusColor(shipment.status);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      padding: '32px',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Back Button */}
        <button
          onClick={() => navigate('/shipments')}
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
            marginBottom: '24px',
          }}
        >
          <ArrowLeft size={20} />
          Back to Shipments
        </button>

        {/* Header */}
        <div style={{
          padding: '32px',
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          marginBottom: '32px',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#1e293b', margin: 0, marginBottom: '8px' }}>
                {shipment.reference}
              </h1>
              <p style={{ color: '#64748b', fontSize: '16px', margin: 0 }}>
                High-priority electronics shipment from Lagos to Abuja
              </p>
            </div>
            <div style={{
              padding: '16px 24px',
              borderRadius: '12px',
              background: statusColor.bg,
              color: statusColor.text,
              fontWeight: '600',
              fontSize: '18px',
              textAlign: 'center',
            }}>
              {statusColor.icon} {shipment.status.replace('_', ' ')}
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}>
            {[
              { label: 'Created Date', value: shipment.createdAt, icon: '📅' },
              { label: 'Estimated Delivery', value: shipment.estimatedDelivery, icon: '⏰' },
              { label: 'Total Weight', value: shipment.totalWeight, icon: '⚖️' },
              { label: 'Shipment Value', value: shipment.totalValue, icon: '💰' },
            ].map((item, i) => (
              <div key={i} style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', margin: 0, marginBottom: '4px' }}>
                  {item.icon} {item.label}
                </p>
                <p style={{ color: '#1e293b', fontSize: '16px', fontWeight: '600', margin: 0 }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '32px',
          marginBottom: '32px',
        }}>
          {/* Left Column - Location & Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Origin & Destination */}
            {[
              { title: 'Origin', data: shipment.origin, icon: '📍', color: '#3b82f6' },
              { title: 'Destination', data: shipment.destination, icon: '🎯', color: '#10b981' },
            ].map((section, i) => (
              <div key={i} style={{
                padding: '24px',
                background: 'white',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '24px' }}>{section.icon}</span>
                  {section.title}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', margin: 0 }}>FACILITY</p>
                    <p style={{ color: '#1e293b', fontSize: '16px', fontWeight: '600', margin: 0 }}>{section.data.name}</p>
                  </div>
                  <div>
                    <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', margin: 0 }}>ADDRESS</p>
                    <p style={{ color: '#1e293b', fontSize: '14px', margin: 0 }}>{section.data.address}</p>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', margin: 0 }}>CONTACT</p>
                      <p style={{ color: '#1e293b', fontSize: '14px', margin: 0 }}>{section.data.contact}</p>
                    </div>
                    <div>
                      <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', margin: 0 }}>PHONE</p>
                      <p style={{ color: '#1e293b', fontSize: '14px', margin: 0 }}>{section.data.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Items */}
            <div style={{
              padding: '24px',
              background: 'white',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '24px' }}>📦</span>
                Shipment Items
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ padding: '12px 0', textAlign: 'left', color: '#94a3b8', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Item</th>
                      <th style={{ padding: '12px 0', textAlign: 'right', color: '#94a3b8', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Qty</th>
                      <th style={{ padding: '12px 0', textAlign: 'right', color: '#94a3b8', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shipment.items.map((item, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '12px 0', color: '#1e293b', fontSize: '14px' }}>{item.description}</td>
                        <td style={{ padding: '12px 0', textAlign: 'right', color: '#1e293b', fontSize: '14px' }}>{item.quantity}</td>
                        <td style={{ padding: '12px 0', textAlign: 'right', color: '#1e293b', fontSize: '14px' }}>{item.weight}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - Driver & Vehicle */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Driver */}
            <div style={{
              padding: '24px',
              background: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%)',
              borderRadius: '12px',
              border: '1px solid #dbeafe',
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '24px' }}>👤</span>
                Driver Information
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', margin: 0 }}>NAME</p>
                  <p style={{ color: '#1e293b', fontSize: '16px', fontWeight: '600', margin: 0 }}>{shipment.driver.name}</p>
                </div>
                <div>
                  <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', margin: 0 }}>LICENSE</p>
                  <p style={{ color: '#1e293b', fontSize: '14px', margin: 0 }}>{shipment.driver.license}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', margin: 0 }}>PHONE</p>
                    <p style={{ color: '#1e293b', fontSize: '14px', margin: 0 }}>{shipment.driver.phone}</p>
                  </div>
                  <div>
                    <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', margin: 0 }}>RATING</p>
                    <p style={{ color: '#1e293b', fontSize: '14px', margin: 0 }}>⭐ {shipment.driver.rating}/5</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle */}
            <div style={{
              padding: '24px',
              background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
              borderRadius: '12px',
              border: '1px solid #bbf7d0',
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '24px' }}>🚗</span>
                Vehicle Information
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', margin: 0 }}>PLATE NUMBER</p>
                  <p style={{ color: '#1e293b', fontSize: '16px', fontWeight: '600', margin: 0 }}>{shipment.vehicle.number}</p>
                </div>
                <div>
                  <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', margin: 0 }}>TYPE</p>
                  <p style={{ color: '#1e293b', fontSize: '14px', margin: 0 }}>{shipment.vehicle.type}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', margin: 0 }}>CAPACITY</p>
                    <p style={{ color: '#1e293b', fontSize: '14px', margin: 0 }}>{shipment.vehicle.capacity}</p>
                  </div>
                  <div>
                    <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', margin: 0 }}>LAST SERVICE</p>
                    <p style={{ color: '#1e293b', fontSize: '14px', margin: 0 }}>{shipment.vehicle.lastMaintenance}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div style={{
          padding: '32px',
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', margin: 0, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>📍</span>
            Tracking Timeline
          </h3>

          <div style={{ position: 'relative' }}>
            {shipment.trackingEvents.map((event, index) => (
              <div key={event.id} style={{
                display: 'flex',
                marginBottom: index < shipment.trackingEvents.length - 1 ? '32px' : '0',
              }}>
                {/* Timeline Line */}
                <div style={{ marginRight: '24px', position: 'relative', width: '40px' }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: '#3b82f6',
                    border: '4px solid white',
                    boxShadow: '0 0 0 1px #e2e8f0',
                    position: 'relative',
                    top: '8px',
                  }} />
                  {index < shipment.trackingEvents.length - 1 && (
                    <div style={{
                      position: 'absolute',
                      top: '32px',
                      left: '7px',
                      width: '2px',
                      height: '32px',
                      background: '#cbd5e1',
                    }} />
                  )}
                </div>

                {/* Event Content */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <p style={{ color: '#1e293b', fontSize: '14px', fontWeight: '600', margin: 0 }}>
                      {event.timestamp}
                    </p>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: '#bfdbfe',
                      color: '#1e40af',
                      fontSize: '11px',
                      fontWeight: '600',
                    }}>
                      {event.status}
                    </span>
                  </div>
                  <p style={{ color: '#64748b', fontSize: '13px', margin: 0, marginBottom: '4px' }}>
                    📍 {event.location}
                  </p>
                  <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>
                    {event.notes}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetailsPage;