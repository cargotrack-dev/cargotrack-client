// src/contexts/tracking/index.ts
// This file exports everything related to tracking
// so other files can import from one place

export { TrackingProvider } from './provider';
export { useTracking } from '../hooks/useTracking';
export * from './types';
// Don't export TrackingContext directly - it should be accessed through the useTracking hook