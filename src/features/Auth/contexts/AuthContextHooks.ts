// src/contexts/AuthContextHooks.ts
import { useContext } from 'react';
import { AuthContext } from './AuthContextInstance';
import { AuthContextType } from './AuthContextTypes';

/**
 * Custom hook to use the auth context in components
 * @returns The auth context with user, auth state and methods
 * @throws Error if used outside of AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};