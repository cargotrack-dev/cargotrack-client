// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw'; // Updated import for MSW v2
import { TruckStatus } from '../features/Trucks/types/truck.types';

export const handlers = [
  // Trucks API mocks
  http.get('/api/trucks', () => {
    return HttpResponse.json([
      {
        id: 'truck-1',
        make: 'Volvo',
        model: 'FH16',
        year: 2025,
        licensePlate: 'ABC123',
        status: TruckStatus.ACTIVE,
        currentLocation: 'New York, NY',
        vin: 'VIN123456789'
      },
      {
        id: 'truck-2',
        make: 'Mercedes',
        model: 'Actros',
        year: 2024,
        licensePlate: 'XYZ789',
        status: TruckStatus.MAINTENANCE,
        currentLocation: 'Los Angeles, CA',
        vin: 'VIN987654321'
      }
    ]);
  }),
  
  // Single truck API mock
  http.get('/api/trucks/:id', ({ params }) => {
    const { id } = params;
    
    if (id === 'truck-1') {
      return HttpResponse.json({
        id: 'truck-1',
        make: 'Volvo',
        model: 'FH16',
        year: 2025,
        licensePlate: 'ABC123',
        status: TruckStatus.ACTIVE,
        currentLocation: 'New York, NY',
        vin: 'VIN123456789',
        maintenanceStatus: {
          odometer: 45000,
          nextServiceDate: '2025-07-15',
          healthScore: 85
        }
      });
    }
    
    return new HttpResponse(
      JSON.stringify({ message: 'Truck not found' }),
      { status: 404 }
    );
  }),
  
  // Waybills API mocks
  http.get('/api/waybills', () => {
    return HttpResponse.json([
      {
        id: 'waybill-1',
        waybillNumber: 'WB2505010001',
        shipmentId: 'ship-1',
        createdAt: '2025-05-01T10:00:00Z',
        status: 'active',
        origin: {
          name: 'Warehouse A',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          postalCode: '10001'
        },
        destination: {
          name: 'Distribution Center B',
          address: '456 Oak Ave',
          city: 'Chicago',
          state: 'IL',
          country: 'USA',
          postalCode: '60601'
        },
        items: [
          {
            description: 'Electronics',
            quantity: 10,
            weight: 150,
            declaredValue: 5000
          }
        ]
      }
    ]);
  })
];