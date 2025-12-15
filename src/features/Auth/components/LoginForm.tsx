// src/components/auth/LoginForm.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContextHooks';
import { AlertCircle, Loader2, Eye, EyeOff, Truck } from 'lucide-react';

interface LocationState {
  from?: {
    pathname?: string;
  };
}

const LoginForm: React.FC = () => {
  const { login, error, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);
  
  // Get the page the user was trying to access
  const from = (location.state as LocationState)?.from?.pathname || '/';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      // Redirect back to the page they were trying to access
      navigate(from, { replace: true });
    } catch (err) {
      // Error is handled in the auth context
      console.error('Login error:', err);
    }
  };
  
  const demoUsers = [
    { role: 'Super Admin', email: 'admin@cargotrackpro.com', password: 'password' },
    { role: 'Operations Manager', email: 'manager@cargotrackpro.com', password: 'password' },
    { role: 'Dispatcher', email: 'dispatcher@cargotrackpro.com', password: 'password' },
    { role: 'Driver', email: 'driver@cargotrackpro.com', password: 'password' },
    { role: 'Client', email: 'client@example.com', password: 'password' },
  ];
  
  const handleQuickLogin = async (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Quick login error:', err);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center bg-blue-600 p-3 rounded-full mb-4">
            <Truck className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            CargoTrack Pro
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>
        
        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm pr-10"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Demo Accounts Section */}
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
          <button
            className="text-sm text-blue-600 hover:text-blue-500 focus:outline-none font-medium"
            onClick={() => setShowDemoCredentials(!showDemoCredentials)}
          >
            {showDemoCredentials ? 'Hide Demo Accounts' : 'Show Demo Accounts'}
          </button>
          
          {showDemoCredentials && (
            <div className="mt-3 space-y-2">
              <p className="text-sm text-gray-500 mb-2">Quick access demo accounts:</p>
              <div className="grid grid-cols-1 gap-2">
                {demoUsers.map((user, index) => (
                  <button
                    key={index}
                    className="border border-gray-300 rounded-md p-2 text-left hover:bg-gray-100 transition-colors"
                    onClick={() => handleQuickLogin(user.email, user.password)}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{user.role}</span>
                      <span className="text-xs text-gray-500">{user.email}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <p className="text-center text-xs text-gray-500">
          This is a demo application. All data is reset periodically.
        </p>
      </div>
    </div>
  );
};

export default LoginForm;