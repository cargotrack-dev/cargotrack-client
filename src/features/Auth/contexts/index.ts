// src/contexts/auth/index.ts
// This file exports everything related to authentication
// so other files can import from one place

export { AuthProvider } from './AuthProvider';
export { useAuth } from '../hooks/useAuth';
// Don't export AuthContext directly - it should be accessed through the useAuth hook