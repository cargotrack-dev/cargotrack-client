// src/hooks/useAuth.ts
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContextInstance';
import { AuthContextType } from '../contexts/AuthContextTypes';

// Re-export the hook that uses the context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// For backward compatibility if needed
export const useSimpleAuth = () => {
  // Use the context-based hook but simplify the interface
  const {
    user,
    isLoading: loading,
    login,
    logout
  } = useAuth();
  
  // Return a simplified interface matching your existing hook
  return {
    user: user ? {
      id: user.id,
      email: user.email || user.profile?.email || '',
      role: user.roles?.[0] || ''
    } : null,
    loading,
    login,
    logout
  };
};