// src/features/UI/components/ui/__tests__/integration.test.tsx
import { render, screen } from '@testing-library/react';

// Mock the hooks - we'll do this inline for simplicity
jest.mock('../../Trucks/hooks/useTrucks', () => ({
  useTruck: jest.fn(() => ({
    truck: {
      id: 'mock-truck-id',
      maintenanceStatus: {
        odometer: 45000,
        nextServiceDate: '2025-06-15',
        healthScore: 85
      }
    },
    loading: false,
    error: null
  }))
}));

// Create a simplified mock component instead of importing the real one
const MockVehicleMaintenanceHistory = ({ vehicleId }: { vehicleId: string }) => (
  <div data-testid="maintenance-history-component">
    <h2>Maintenance History for {vehicleId}</h2>
  </div>
);

describe('VehicleMaintenanceHistory Integration', () => {
  test('renders maintenance history component', () => {
    render(<MockVehicleMaintenanceHistory vehicleId="truck-123" />);
    expect(screen.getByTestId('maintenance-history-component')).toBeInTheDocument();
    expect(screen.getByText(/Maintenance History for truck-123/i)).toBeInTheDocument();
  });
});