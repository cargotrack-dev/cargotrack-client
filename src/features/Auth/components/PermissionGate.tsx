// src/components/auth/PermissionGate.tsx
import React, { ReactNode } from 'react';
import { ResourceType, PermissionAction, UserRole } from '../types/auth';
import { useAuth } from '../contexts/AuthContextHooks';

interface ContextValues {
  ownerId?: string;
  departmentId?: string;
  clientId?: string;
  value?: number;
  timestamp?: Date;
  [key: string]: unknown;
}

interface ResourcePermission {
  resource: ResourceType;
  action: PermissionAction;
  context?: ContextValues;
}

interface PermissionGateProps {
  /**
   * Permission requirements - either specific resource and action,
   * or an array of resource/action combinations
   */
  permissions?: ResourcePermission | ResourcePermission[];
  
  /**
   * Alternatively, require certain user roles
   */
  roles?: UserRole | UserRole[] | string | string[];
  
  /**
   * The component/content to render if user has permission
   */
  children: ReactNode;
  
  /**
   * The component/content to render if user doesn't have permission
   * If not provided, nothing will be rendered when access is denied
   */
  fallback?: ReactNode;
  
  /**
   * If true, user needs ALL permissions/roles in the array
   * If false (default), user needs ANY of the permissions/roles
   */
  requireAll?: boolean;
}

/**
 * A component that conditionally renders content based on user permissions or roles
 */
const PermissionGate: React.FC<PermissionGateProps> = ({
  permissions,
  roles,
  children,
  fallback = null,
  requireAll = false
}) => {
  const { hasPermission, hasRole, canAccess } = useAuth();
  
  // If neither permissions nor roles are provided, don't render anything
  if (!permissions && !roles) {
    console.warn('PermissionGate requires either permissions or roles prop');
    return null;
  }
  
  let hasAccess = false;
  
  // Check roles first if provided
  if (roles) {
    const rolesArray = Array.isArray(roles) ? roles : [roles];
    
    hasAccess = requireAll
      ? rolesArray.every(role => hasRole(role))
      : rolesArray.some(role => hasRole(role));
    
    // If user has required roles, no need to check permissions
    if (hasAccess) return <>{children}</>;
  }
  
  // Check permissions if roles check didn't pass
  if (permissions) {
    const permissionsArray = Array.isArray(permissions) ? permissions : [permissions];
    
    hasAccess = requireAll
      ? permissionsArray.every(({ resource, action, context }) => 
          context ? canAccess(resource, action, context) : hasPermission(resource, action)
        )
      : permissionsArray.some(({ resource, action, context }) => 
          context ? canAccess(resource, action, context) : hasPermission(resource, action)
        );
  }
  
  // Render children or fallback based on permissions/roles
  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

export default PermissionGate;