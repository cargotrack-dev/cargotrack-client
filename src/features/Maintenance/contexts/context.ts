// src/features/Maintenance/contexts/context.ts
import { createContext } from 'react';
import { MaintenanceContextType } from './types';

// Create the context with a default undefined value
export const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);