// src/features/auth/index.ts

// Export components
export { default as LoginForm } from './components/LoginForm';
export { default as PermissionGate } from './components/PermissionGate';
export { default as ProtectedRoute } from './components/ProtectedRoute';

// Export pages
export { default as LoginPage } from './pages/Login';
export { default as UnauthorizedPage } from './pages/UnauthorizedPage';

// Export context-related items
export { AuthContext } from './contexts/AuthContextInstance';
export { AuthProvider } from './contexts/AuthProvider';
export * from './contexts/AuthContextTypes';

// Export hooks
export { useAuth } from './hooks/useAuth';

// Export types
export * from './types/auth';
