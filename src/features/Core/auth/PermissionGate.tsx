// src/features/Core/auth/PermissionGate.tsx
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Permission, UserRole } from '../types/auth';

interface PermissionGateProps {
  children: React.ReactNode;
  permissions?: Permission | string[] | string;
  roles?: UserRole[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

/**
 * A component that conditionally renders its children based on user permissions or roles
 * 
 * @param children - Content to render when user has permission
 * @param permissions - Required permission or list of permissions
 * @param roles - List of required roles
 * @param requireAll - If true, user must have all permissions/roles; if false, any one is sufficient
 * @param fallback - Content to render when user doesn't have permission
 */
const PermissionGate: React.FC<PermissionGateProps> = ({
  children,
  permissions,
  roles = [],
  requireAll = true,
  fallback = null
}) => {
  const auth = useAuth();
  const { user, hasPermission } = auth;

  // If no permissions or roles are specified, always render children
  if (!permissions && roles.length === 0) {
    return <>{children}</>;
  }

  // Check if user is logged in
  if (!user) {
    return <>{fallback}</>;
  }

  // Check permissions
  let hasRequiredPermissions = true;
  if (permissions) {
    if (Array.isArray(permissions)) {
      if (requireAll) {
        hasRequiredPermissions = permissions.every(permission => hasPermission(permission));
      } else {
        hasRequiredPermissions = permissions.some(permission => hasPermission(permission));
      }
    } else {
      hasRequiredPermissions = hasPermission(permissions);
    }
  }

  // Check roles (if we implement role checking in the future)
  let hasRequiredRoles = true;
  if (roles.length > 0) {
    // This would require changes to the AuthContextType to include role checking
    // For now, we'll keep this placeholder
    hasRequiredRoles = true;
  }

  // Return children or fallback based on permission/role check
  const hasAccess = (permissions ? hasRequiredPermissions : true) &&
                    (roles.length > 0 ? hasRequiredRoles : true);

  return <>{hasAccess ? children : fallback}</>;
};

export default PermissionGate;