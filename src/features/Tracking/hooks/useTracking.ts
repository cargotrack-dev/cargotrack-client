// src/features/Tracking/hooks/useTracking.ts
import { useContext } from 'react';
import TrackingContext from '../contexts/TrackingContext';

/**
 * Custom hook to use the tracking context
 * @returns The tracking context
 */
export const useTracking = () => {
  const context = useContext(TrackingContext);
  if (context === undefined) {
    throw new Error('useTracking must be used within a TrackingProvider');
  }
  return context;
};

export default useTracking;