// src/features/Maintenance/contexts/useMaintenance.ts
// ✅ RECONCILED: Hook matching your existing context structure

import { useContext } from 'react';
import { MaintenanceContext } from './context';
import { MaintenanceContextType } from './types';

export const useMaintenance = (): MaintenanceContextType => {
  const context = useContext(MaintenanceContext);
  
  if (context === undefined) {
    throw new Error('useMaintenance must be used within a MaintenanceProvider');
  }
  
  return context;
};