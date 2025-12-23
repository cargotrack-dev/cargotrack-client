// src/features/Auth/hooks/useAuth.ts
// ✅ FIXED - Proper hook export avoiding circular dependencies

import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthProvider'

/**
 * useAuth Hook
 * Returns authentication context with user data and auth functions
 * 
 * IMPORTANT: Must be used within <AuthProvider>
 * 
 * @returns AuthContext with:
 *   - isAuthenticated: boolean
 *   - user: User object or null
 *   - login(email, password): Login function
 *   - logout(): Logout function
 *   - hasPermission(resource, action): Check permission
 *   - hasRole(role): Check role
 *   - canAccess(resource, action, context?): Check access with constraints
 *   - permissions: Array of permissions
 *   - roles: Array of roles
 * 
 * @throws Error if used outside of AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider\n\n' +
      'Make sure your App is wrapped with <AuthProvider> at the root level:\n\n' +
      'main.tsx:\n' +
      '  <AuthProvider>\n' +
      '    <App />\n' +
      '  </AuthProvider>'
    )
  }
  
  return context
}

export default useAuth