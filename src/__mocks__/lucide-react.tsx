// src/__mocks__/lucide-react.tsx
// import React from 'react';

// Create a mock component for each icon
const createMockIcon = (name: string) => {
  // Use a simpler approach that doesn't try to spread props
  const Icon = () => <div data-testid={`icon-${name}`}>{name}</div>;
  
  // Add size and color props that match the Lucide React API
  Icon.defaultProps = {
    size: 24,
    color: 'currentColor',
    strokeWidth: 2
  };
  
  return Icon;
};

// Export mock icons used in your components
export const Calendar = createMockIcon('calendar');
export const DollarSign = createMockIcon('dollar-sign');
export const User = createMockIcon('user');
export const Wrench = createMockIcon('wrench');
export const Clock = createMockIcon('clock');
export const MapPin = createMockIcon('map-pin');
export const Settings = createMockIcon('settings');
export const Truck = createMockIcon('truck');
export const FileText = createMockIcon('file-text');
export const CheckCircle2 = createMockIcon('check-circle-2');
export const AlertTriangle = createMockIcon('alert-triangle');
export const Navigation = createMockIcon('navigation');
export const TrendingUp = createMockIcon('trending-up');
export const Edit = createMockIcon('edit');
export const ChevronLeft = createMockIcon('chevron-left');
export const Tool = createMockIcon('tool');