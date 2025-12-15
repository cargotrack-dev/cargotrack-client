// src/contexts/AuthContextInstance.ts
import { createContext } from 'react';
import { AuthContextType } from './AuthContextTypes';

// Create context with a default value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
