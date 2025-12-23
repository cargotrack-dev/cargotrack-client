// src/contexts/AuthProvider.tsx
import React, { createContext, useState, useContext, useEffect } from 'react'
import { 
  User, 
  Permission, 
  Role,
  UserRole,
  ResourceType,
  PermissionAction 
} from '../types/auth'

import { 
  MOCK_USERS, 
  MOCK_ROLES, 
  MOCK_PERMISSIONS,
  AUTH_STORAGE_KEY,
  ContextProperties,
  AuthContextType,
  AuthState
} from './AuthContextTypes'

// ═══════════════════════════════════════════════════════════════════════════════
// AUTHENTICATION CONTEXT
// ═══════════════════════════════════════════════════════════════════════════════

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTION #1: Get permissions for a user based on their roles
// ═══════════════════════════════════════════════════════════════════════════════

const getPermissionsForUser = (user: User): Permission[] => {
  const userPermissions: Permission[] = []
  
  for (const roleId of user.roles) {
    const role = MOCK_ROLES.find(r => r.id === roleId)
    if (role) {
      for (const permissionId of role.permissions) {
        const permission = MOCK_PERMISSIONS.find(p => p.id === permissionId)
        if (permission && !userPermissions.find(p => p.id === permission.id)) {
          userPermissions.push(permission)
        }
      }
    }
  }
  
  // Add direct permissions
  if (user.directPermissions) {
    for (const permId of user.directPermissions) {
      const permission = MOCK_PERMISSIONS.find(p => p.id === permId)
      if (permission && !userPermissions.find(p => p.id === permission.id)) {
        userPermissions.push(permission)
      }
    }
  }
  
  return userPermissions
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTION #2: Get roles for a user
// ═══════════════════════════════════════════════════════════════════════════════

const getRolesForUser = (user: User): Role[] => {
  return user.roles
    .map(roleId => MOCK_ROLES.find(r => r.id === roleId))
    .filter((role): role is Role => role !== undefined)
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTION #3: Check geofence boundary using Haversine formula
// ═══════════════════════════════════════════════════════════════════════════════

const checkGeofenceBoundary = (
  location: { lat: number; lng: number },
  geofence: { centerLat: number; centerLng: number; radiusKm: number }
): number => {
  const R = 6371 // Earth's radius in km
  const dLat = (geofence.centerLat - location.lat) * (Math.PI / 180)
  const dLng = (geofence.centerLng - location.lng) * (Math.PI / 180)
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(location.lat * (Math.PI / 180)) * 
    Math.cos(geofence.centerLat * (Math.PI / 180)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH PROVIDER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Try to restore from localStorage on initial load
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        return {
          user: parsed.user,
          isAuthenticated: parsed.isAuthenticated,
          isLoading: false,
          error: null,
          permissions: parsed.permissions || [],
          roles: parsed.roles || []
        }
      } catch (error) {
        console.error('Failed to restore auth state:', error)
      }
    }
    
    return {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      permissions: [],
      roles: []
    }
  })

  // ═════════════════════════════════════════════════════════════════════════════
  // LOGIN FUNCTION: Complete authentication with 7 steps
  // ═════════════════════════════════════════════════════════════════════════════

  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }))

      // Demo credentials - password is always 'password' for all demo accounts
      const demoCredentials: { [key: string]: string } = {
        'admin@cargotrackpro.com': 'password',
        'manager@cargotrackpro.com': 'password',
        'dispatcher@cargotrackpro.com': 'password',
        'driver@cargotrackpro.com': 'password',
        'client@example.com': 'password',
      }

      // Step 1: Validate credentials exist
      if (!(email in demoCredentials)) {
        throw new Error('User not found')
      }

      // Step 2: Validate password
      if (demoCredentials[email] !== password) {
        throw new Error('Invalid password')
      }

      // Step 3: Find user in MOCK_USERS
      const mockUser = MOCK_USERS.find(u => u.email === email)
      if (!mockUser) {
        throw new Error('User configuration error')
      }

      // Step 4: Create full User object from partial mock user
      const user: User = {
        id: mockUser.id || '',
        username: mockUser.username || '',
        email: mockUser.email || '',
        isActive: mockUser.isActive !== false,
        isEmailVerified: mockUser.isEmailVerified !== false,
        roles: mockUser.roles || [],
        directPermissions: mockUser.directPermissions || [],
        clientId: mockUser.clientId,
        passwordLastChanged: mockUser.passwordLastChanged || new Date(),
        passwordResetRequired: mockUser.passwordResetRequired === true,
        profile: mockUser.profile || {
          id: '',
          username: '',
          email: '',
          firstName: '',
          lastName: ''
        },
        settings: mockUser.settings || {
          userId: mockUser.id || '',
          preferences: {
            language: 'en',
            dateFormat: 'MM/DD/YYYY',
            timeFormat: '12h',
            timezone: 'America/New_York',
            theme: 'light',
            notificationPreferences: {
              email: true,
              sms: false,
              push: true,
              inApp: true
            }
          },
          mfaEnabled: false,
          failedLoginAttempts: 0,
          updatedAt: new Date()
        },
        driverProfile: mockUser.driverProfile,
        createdAt: mockUser.createdAt || new Date(),
        updatedAt: mockUser.updatedAt,
        lastLoginAt: new Date()
      }

      // Step 5: Get user permissions based on roles
      const userPermissions = getPermissionsForUser(user)
      const userRoles = getRolesForUser(user)

      // Step 6: Store in localStorage
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
        user,
        isAuthenticated: true,
        permissions: userPermissions,
        roles: userRoles,
        lastLoginAt: new Date().toISOString()
      }))

      // Step 7: Update auth state
      setAuthState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
        permissions: userPermissions,
        roles: userRoles,
        isLoading: false,
        error: null
      }))

      console.log('✅ Login successful!', {
        user: user.email,
        roles: userRoles.map(r => r.name),
        permissions: userPermissions.length,
        timestamp: new Date().toISOString()
      })

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      console.error('❌ Login error:', errorMessage)
      
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }))

      throw error
    }
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // LOGOUT FUNCTION: Clear all authentication
  // ═════════════════════════════════════════════════════════════════════════════

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      permissions: [],
      roles: []
    })
    console.log('✅ Logged out successfully')
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // HAS PERMISSION FUNCTION: Check if user has specific permission
  // ═════════════════════════════════════════════════════════════════════════════

  const hasPermission = (resource: ResourceType, action: PermissionAction): boolean => {
    return authState.permissions.some(
      p => p.resource === resource && p.action === action
    )
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // HAS ROLE FUNCTION: Check if user has specific role
  // ═════════════════════════════════════════════════════════════════════════════

  const hasRole = (role: UserRole | string): boolean => {
    return authState.roles.some(r => r.type === role || r.name === role)
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // CAN ACCESS FUNCTION: Complex access control with 15 custom restrictions
  // ═════════════════════════════════════════════════════════════════════════════

  const canAccess = (
    resource: ResourceType,
    action: PermissionAction,
    context?: ContextProperties
  ): boolean => {
    // If not authenticated, deny access
    if (!authState.isAuthenticated || !authState.user) {
      console.warn('⚠️ Access denied: User not authenticated')
      return false
    }

    // Check if user has the required permission
    const hasPerms = authState.permissions.some(
      p => p.resource === resource && p.action === action
    )

    if (!hasPerms) {
      console.warn(`⚠️ Access denied: No permission for ${resource}:${action}`)
      return false
    }

    // Get the permission with constraints
    const permission = authState.permissions.find(
      p => p.resource === resource && p.action === action
    )

    if (!permission || !permission.constraints) {
      return true // No constraints, grant access
    }

    const constraints = permission.constraints

    // ✅ CUSTOM RESTRICTION CHECKS START HERE
    
    // #1: Region Restriction
    if (constraints.regionRestriction && context?.shipmentRegion) {
      const allowedRegions = authState.user.profile?.allowedRegions || []
      if (allowedRegions.length > 0 && !allowedRegions.includes(context.shipmentRegion)) {
        console.warn(`⚠️ Access denied: Region '${context.shipmentRegion}' not allowed`)
        return false
      }
    }

    // #2: Vehicle Type Restriction
    if (constraints.vehicleTypeRestriction && context?.vehicleType) {
      const allowedVehicleTypes = authState.user.profile?.allowedVehicleTypes || []
      if (allowedVehicleTypes.length > 0 && !allowedVehicleTypes.includes(context.vehicleType)) {
        console.warn(`⚠️ Access denied: Vehicle type '${context.vehicleType}' not allowed`)
        return false
      }
    }

    // #3: Customer Restriction
    if (constraints.customerRestriction && context?.customerId) {
      const allowedCustomers = authState.user.profile?.allowedCustomers || []
      const blockedCustomers = authState.user.profile?.blockedCustomers || []
      
      if (blockedCustomers.includes(context.customerId)) {
        console.warn(`⚠️ Access denied: Customer '${context.customerId}' is blocked`)
        return false
      }
      
      if (allowedCustomers.length > 0 && !allowedCustomers.includes(context.customerId)) {
        console.warn(`⚠️ Access denied: Customer '${context.customerId}' not in allowed list`)
        return false
      }
    }

    // #4: Max Priority Level
    if (constraints.maxPriorityLevel && context?.shipmentPriority) {
      const priorityLevels = { standard: 0, express: 1, urgent: 2, critical: 3 }
      const maxLevel = priorityLevels[constraints.maxPriorityLevel] || 0
      const contextLevel = priorityLevels[context.shipmentPriority as keyof typeof priorityLevels] || 0
      
      if (contextLevel > maxLevel) {
        console.warn(`⚠️ Access denied: Priority level '${context.shipmentPriority}' exceeds max '${constraints.maxPriorityLevel}'`)
        return false
      }
    }

    // #5: Status Restriction
    if (constraints.allowedStatuses && context?.shipmentStatus) {
      if (!constraints.allowedStatuses.includes(context.shipmentStatus)) {
        console.warn(`⚠️ Access denied: Status '${context.shipmentStatus}' not allowed`)
        return false
      }
    }

    // #6: Budget Limit
    if (constraints.budgetLimit && context?.shipmentCost) {
      const budgetUsed = authState.user.profile?.budgetUsed || 0
      if (budgetUsed + context.shipmentCost > constraints.budgetLimit) {
        console.warn(`⚠️ Access denied: Budget limit exceeded (${budgetUsed} + ${context.shipmentCost} > ${constraints.budgetLimit})`)
        return false
      }
    }

    // #7: Max Weight
    if (constraints.maxWeight && context?.shipmentWeight) {
      if (context.shipmentWeight > constraints.maxWeight) {
        console.warn(`⚠️ Access denied: Weight ${context.shipmentWeight}kg exceeds max ${constraints.maxWeight}kg`)
        return false
      }
    }

    // #8: Max Distance
    if (constraints.maxDistance && context?.distanceKm) {
      if (context.distanceKm > constraints.maxDistance) {
        console.warn(`⚠️ Access denied: Distance ${context.distanceKm}km exceeds max ${constraints.maxDistance}km`)
        return false
      }
    }

    // #9: Working Hours
    if (constraints.workingHours && context?.timestamp) {
      const now = new Date(context.timestamp)
      const dayOfWeek = now.getDay()
      const hour = now.getHours()
      
      const allowedDays = constraints.workingHours.daysOfWeek || [0, 1, 2, 3, 4, 5, 6]
      const startHour = constraints.workingHours.startHour || 0
      const endHour = constraints.workingHours.endHour || 23
      
      if (!allowedDays.includes(dayOfWeek) || hour < startHour || hour > endHour) {
        console.warn(`⚠️ Access denied: Outside working hours`)
        return false
      }
    }

    // #10: Geofence Boundary
    if (constraints.geofence && context?.location) {
      const distance = checkGeofenceBoundary(context.location, constraints.geofence)
      if (distance > constraints.geofence.radiusKm) {
        console.warn(`⚠️ Access denied: Outside geofence boundary (${distance.toFixed(2)}km > ${constraints.geofence.radiusKm}km)`)
        return false
      }
    }

    // #11: Required Vehicle Status
    if (constraints.requiredVehicleStatus && context?.vehicleStatus) {
      if (context.vehicleStatus !== constraints.requiredVehicleStatus) {
        console.warn(`⚠️ Access denied: Vehicle status must be '${constraints.requiredVehicleStatus}'`)
        return false
      }
    }

    // #12: Temperature Control Required
    if (constraints.tempControlRequired && !context?.hasTemperatureControl) {
      console.warn(`⚠️ Access denied: Temperature control required but not available`)
      return false
    }

    // #13: Approval Level
    if (constraints.minApprovalLevel && context?.approvalLevel) {
      if (context.approvalLevel < constraints.minApprovalLevel) {
        console.warn(`⚠️ Access denied: Approval level ${context.approvalLevel} insufficient (min: ${constraints.minApprovalLevel})`)
        return false
      }
    }

    // #14: Company Restrictions
    if (constraints.allowedCompanies && context?.companyId) {
      if (!constraints.allowedCompanies.includes(context.companyId)) {
        console.warn(`⚠️ Access denied: Company '${context.companyId}' not allowed`)
        return false
      }
    }

    // #15: Required Documents
    if (constraints.requiredDocuments && context?.providedDocuments) {
      const missingDocs = constraints.requiredDocuments.filter(
        doc => !(context.providedDocuments as string[]).includes(doc)
      )
      if (missingDocs.length > 0) {
        console.warn(`⚠️ Access denied: Missing required documents: ${missingDocs.join(', ')}`)
        return false
      }
    }

    // ✅ CUSTOM RESTRICTION CHECKS END HERE

    // Existing constraints (keep for backwards compatibility)
    if (constraints.ownedOnly && context?.ownerId !== authState.user.id) {
      console.warn('⚠️ Access denied: Resource not owned by user')
      return false
    }

    if (constraints.valueLimit && context?.value && context.value > constraints.valueLimit) {
      console.warn(`⚠️ Access denied: Value ${context.value} exceeds limit ${constraints.valueLimit}`)
      return false
    }

    console.log(`✅ Access granted: ${resource}:${action}`)
    return true
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // CONTEXT VALUE
  // ═════════════════════════════════════════════════════════════════════════════

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    hasPermission,
    hasRole,
    canAccess
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// USE AUTH HOOK: Access auth context
// ═══════════════════════════════════════════════════════════════════════════════

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}