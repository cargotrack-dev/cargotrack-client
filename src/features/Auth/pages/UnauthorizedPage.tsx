// src/pages/UnauthorizedPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Update this import path to match your new structure
import { ShieldOff, AlertTriangle, ArrowLeft, Home } from 'lucide-react';
import { Role } from '../types/auth'; // Add this import for type safety

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, roles } = useAuth(); // Get roles directly from the hook
  
  // Get the user role display name
  const getUserRoleDisplay = () => {
    if (!user || !user.roles || user.roles.length === 0) return 'User';
    
    const roleId = user.roles[0];
    // Use the roles from the hook context instead of calling useAuth() again
    const role = roles.find((r: Role) => r.id === roleId);
    
    return role ? role.name : 'User';
  };
  
  const handleGoBack = () => {
    // Go back to the previous page
    navigate(-1);
  };
  
  const handleGoToDashboard = () => {
    // Go to the dashboard
    navigate('/');
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <ShieldOff className="h-8 w-8 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
        
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start">
          <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
          <div className="text-left">
            <p className="text-sm text-amber-800">
              You don't have permission to access this page.
            </p>
            {user && (
              <p className="text-xs text-amber-700 mt-1">
                Your current role: <span className="font-medium">{getUserRoleDisplay()}</span>
              </p>
            )}
          </div>
        </div>
        
        <p className="text-gray-600">
          Please contact your administrator if you believe you should have access to this resource.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <button
            onClick={handleGoBack}
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </button>
          
          <button
            onClick={handleGoToDashboard}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Home className="mr-2 h-4 w-4" />
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;