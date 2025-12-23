// src/features/Auth/pages/Login.tsx
// ✅ RECONCILED - Your professional UI + AuthProvider-compatible demo accounts

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface DemoAccount {
  id: string;
  role: string;
  email: string;
  password: string;
  icon: string;
  description: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // ✅ FIXED: Updated demo accounts to match AuthProvider mock data
  // Email: corrected spelling from "cargottrack" → "cargotrackpro"
  // Password: changed from "demo123" → "password" (matches AuthProvider)
  const demoAccounts: DemoAccount[] = [
    {
      id: 'admin',
      role: 'Super Admin',
      email: 'admin@cargotrackpro.com',  // ✅ FIXED: was "cargottrack"
      password: 'password',               // ✅ FIXED: was "demo123"
      icon: '👤',
      description: 'Full system access'
    },
    {
      id: 'manager',
      role: 'Operations Manager',
      email: 'manager@cargotrackpro.com', // ✅ FIXED
      password: 'password',               // ✅ FIXED
      icon: '🎯',
      description: '₦1M budget limit'
    },
    {
      id: 'dispatcher',
      role: 'Dispatcher',
      email: 'dispatcher@cargotrackpro.com', // ✅ FIXED
      password: 'password',                  // ✅ FIXED
      icon: '📦',
      description: 'Lagos/Ogun/Oyo regions'
    },
    {
      id: 'driver',
      role: 'Driver',
      email: 'driver@cargotrackpro.com',  // ✅ FIXED
      password: 'password',               // ✅ FIXED
      icon: '🚗',
      description: 'Lagos/Ogun regions'
    },
    {
      id: 'client',
      role: 'Client',
      email: 'client@example.com',        // Already correct
      password: 'password',               // ✅ FIXED
      icon: '👥',
      description: '₦500K budget limit'
    }
  ];

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // ✅ Call login function with proper error handling
      await login(email, password);
      
      // ✅ Success - redirect to dashboard
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid email or password';
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (account: DemoAccount) => {
    try {
      setLoading(true);
      setError(null);
      setEmail(account.email);
      setPassword(account.password);
      
      // ✅ Login with demo account
      await login(account.email, account.password);
      
      // ✅ Success - redirect to dashboard
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to login as ${account.role}`;
      setError(errorMessage);
      console.error('Demo login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f3f4f6', position: 'relative' }}>
      
      {/* ════════════════════════════════════════════════════════════════ */}
      {/* BACK TO HOME BUTTON - TOP LEFT */}
      {/* ════════════════════════════════════════════════════════════════ */}
      
      <button
        onClick={() => navigate('/')}
        style={{
          position: 'fixed',
          top: '24px',
          left: '24px',
          zIndex: '100',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#14b8a6',
          background: 'white',
          border: '1px solid #d1d5db',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          transition: 'all 0.2s',
          padding: '8px 16px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#0d9488';
          e.currentTarget.style.borderColor = '#14b8a6';
          e.currentTarget.style.background = '#f0fdfa';
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(20, 184, 166, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#14b8a6';
          e.currentTarget.style.borderColor = '#d1d5db';
          e.currentTarget.style.background = 'white';
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        }}
        title="Go back to landing page"
      >
        <span style={{ fontSize: '18px' }}>←</span>
        <span>Back to Home</span>
      </button>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* LEFT SIDE - BRANDING */}
      {/* ════════════════════════════════════════════════════════════════ */}
      
      <div
        style={{
          flex: 1,
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 25%, #0d9488 100%)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '48px',
          minWidth: '400px'
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          {/* Logo */}
          <div
            style={{
              background: 'linear-gradient(135deg, #14b8a6 0%, #fbbf24 100%)',
              borderRadius: '16px',
              padding: '16px',
              width: '96px',
              height: '96px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 32px',
              fontSize: '48px',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
            }}
          >
            🚛
          </div>

          {/* Title */}
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '12px' }}>
            CargoTrack Pro
          </h1>
          <p style={{ fontSize: '14px', color: '#e0f2fe', marginBottom: '32px', fontWeight: '500' }}>
            ENTERPRISE LOGISTICS
          </p>

          {/* Tagline */}
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px', lineHeight: '1.3' }}>
            Transform Your Logistics Operations
          </h2>

          {/* Description */}
          <p style={{ fontSize: '15px', color: '#bfdbfe', marginBottom: '32px', lineHeight: '1.6' }}>
            Real-time tracking, intelligent routing, and complete visibility for African logistics
          </p>

          {/* Features */}
          <div style={{ textAlign: 'left', maxWidth: '350px', margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'flex-start' }}>
              <span style={{ color: '#67e8f9', fontSize: '10px', marginTop: '4px' }}>●</span>
              <span style={{ fontSize: '14px' }}>Real-time Shipment Tracking</span>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'flex-start' }}>
              <span style={{ color: '#67e8f9', fontSize: '10px', marginTop: '4px' }}>●</span>
              <span style={{ fontSize: '14px' }}>Intelligent Route Optimization</span>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ color: '#67e8f9', fontSize: '10px', marginTop: '4px' }}>●</span>
              <span style={{ fontSize: '14px' }}>Advanced Analytics Dashboard</span>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* RIGHT SIDE - LOGIN FORM */}
      {/* ════════════════════════════════════════════════════════════════ */}
      
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '48px',
          minWidth: '400px',
          background: 'white'
        }}
      >
        <div style={{ maxWidth: '400px', margin: '0 auto', width: '100%' }}>
          {/* Welcome Section */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
              Welcome Back
            </h2>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>
              Sign in to your CargoTrack account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                marginBottom: '24px',
                padding: '16px',
                background: '#fee2e2',
                border: '1px solid #fecaca',
                borderRadius: '8px'
              }}
            >
              <p style={{ color: '#991b1b', fontSize: '14px', margin: 0 }}>
                <span style={{ fontSize: '16px', marginRight: '8px' }}>⚠️</span>
                {error}
              </p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} style={{ marginBottom: '32px' }}>
            {/* Email Field */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box',
                  color: '#111827',
                  backgroundColor: loading ? '#f3f4f6' : 'white'
                }}
                onFocus={(e) => {
                  if (!loading) {
                    e.currentTarget.style.borderColor = '#14b8a6';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(20, 184, 166, 0.1)';
                  }
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box',
                  color: '#111827',
                  backgroundColor: loading ? '#f3f4f6' : 'white'
                }}
                onFocus={(e) => {
                  if (!loading) {
                    e.currentTarget.style.borderColor = '#14b8a6';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(20, 184, 166, 0.1)';
                  }
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                  style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                />
                <span style={{ fontSize: '14px', color: '#374151' }}>Remember me</span>
              </label>
              <a 
                href="#" 
                onClick={(e) => e.preventDefault()}
                style={{ fontSize: '14px', color: '#14b8a6', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#0d9488'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#14b8a6'}
              >
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: loading ? '#9ca3af' : 'linear-gradient(90deg, #14b8a6 0%, #fbbf24 100%)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '16px',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 2px 8px rgba(20, 184, 166, 0.2)'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.opacity = '0.9';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(20, 184, 166, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(20, 184, 166, 0.2)';
              }}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '16px',
                      height: '16px',
                      border: '2px solid white',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 0.6s linear infinite'
                    }}
                  />
                  Signing in...
                </>
              ) : (
                <>SIGN IN →</>
              )}
            </button>
          </form>

          {/* Demo Accounts Section */}
          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '32px' }}>
            <button
              onClick={() => setShowDemoAccounts(!showDemoAccounts)}
              style={{
                width: '100%',
                padding: '16px',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                color: '#1e40af',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#dbeafe';
                e.currentTarget.style.borderColor = '#93c5fd';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#eff6ff';
                e.currentTarget.style.borderColor = '#bfdbfe';
              }}
            >
              <span>👨‍💼 {showDemoAccounts ? 'Hide' : 'Show'} Demo Accounts</span>
              <span style={{ transition: 'transform 0.2s', transform: showDemoAccounts ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
            </button>

            {/* Demo Accounts List - SCROLLABLE */}
            {showDemoAccounts && (
              <div
                style={{
                  marginTop: '16px',
                  maxHeight: '384px',
                  overflowY: 'auto',
                  padding: '8px',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {demoAccounts.map((account) => (
                    <button
                      key={account.id}
                      onClick={() => handleDemoLogin(account)}
                      disabled={loading}
                      style={{
                        width: '100%',
                        padding: '16px',
                        background: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        textAlign: 'left',
                        opacity: loading ? 0.6 : 1
                      }}
                      onMouseEnter={(e) => {
                        if (!loading) {
                          e.currentTarget.style.background = '#eff6ff';
                          e.currentTarget.style.borderColor = '#93c5fd';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'white';
                        e.currentTarget.style.borderColor = '#e5e7eb';
                      }}
                    >
                      <div style={{ fontSize: '24px' }}>{account.icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: '600', color: '#111827', fontSize: '14px' }}>
                          {account.role}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {account.email}
                        </div>
                        <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                          {account.description}
                        </div>
                      </div>
                      <span style={{ color: '#9ca3af' }}>→</span>
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: '11px', color: '#6b7280', textAlign: 'center', paddingTop: '8px', margin: 0 }}>
                  Demo credentials provided for testing purposes
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '12px', color: '#6b7280' }}>
            <p style={{ margin: 0, marginBottom: '8px' }}>
              By signing in, you agree to our{' '}
              <a href="#" style={{ color: '#14b8a6', textDecoration: 'none', fontWeight: '500' }}>
                Terms of Service
              </a>
              {' '}and{' '}
              <a href="#" style={{ color: '#14b8a6', textDecoration: 'none', fontWeight: '500' }}>
                Privacy Policy
              </a>
            </p>
            <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af' }}>
              🔒 This is a demo application. All data is reset periodically.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        /* Smooth scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default Login;