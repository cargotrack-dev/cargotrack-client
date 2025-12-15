// src/features/Maintenance/hooks/useMaintenance.ts
import { useContext } from 'react';
import { MaintenanceContext } from '../contexts/context';

export const useMaintenance = () => {
  const context = useContext(MaintenanceContext);
  
  if (!context) {
    throw new Error('useMaintenance must be used within a MaintenanceProvider');
  }
  
  return context;
};