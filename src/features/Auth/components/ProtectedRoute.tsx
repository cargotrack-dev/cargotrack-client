// src/components/auth/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
// Update import to get useAuth from hooks directory instead of context
import { useAuth } from '../hooks/useAuth';
import { ResourceType, PermissionAction } from '../types/auth';

interface ProtectedRouteProps {
  resource?: ResourceType;
  action?: PermissionAction;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  resource = ResourceType.SETTING, 
  action = PermissionAction.READ,
  requiredRole 
}) => {
  const { isAuthenticated, isLoading, hasPermission, hasRole } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Check role if specified
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  // Check permission if no role is specified or if both checks are required
  if (resource && action && !hasPermission(resource, action)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;