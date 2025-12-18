// src/features/Auth/pages/Login.tsx
// Updated with better scrollable demo accounts

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AlertCircle, Loader2, Eye, EyeOff, Truck, ArrowRight, ChevronDown } from 'lucide-react';

interface LocationState {
  from?: {
    pathname?: string;
  };
}

const Login: React.FC = () => {
  const { login, error: authError, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);
  const [error, setError] = useState('');

  const from = (location.state as LocationState)?.from?.pathname || '/dashboard';

  const demoUsers = [
    { role: '👑 Super Admin', email: 'admin@cargotrackpro.com', password: 'password', color: '#a855f7' },
    { role: '🎯 Operations Manager', email: 'manager@cargotrackpro.com', password: 'password', color: '#3b82f6' },
    { role: '📦 Dispatcher', email: 'dispatcher@cargotrackpro.com', password: 'password', color: '#f97316' },
    { role: '🚗 Driver', email: 'driver@cargotrackpro.com', password: 'password', color: '#22c55e' },
    { role: '🛍️ Client', email: 'client@example.com', password: 'password', color: '#6366f1' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (_err) {
      setError(authError || 'Login failed. Please try again.');
    }
  };

  const handleQuickLogin = async (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
    setError('');
    try {
      await login(userEmail, userPassword);
      navigate(from, { replace: true });
    } catch (_err) {
      setError(authError || 'Login failed. Please try again.');
    }
  };

  const displayError = error || authError;

  return (
    <div className="login-container">
      <div className="accent-line"></div>

      <div className="login-content">
        {/* Left Section - Branding */}
        <div className="branding-section">
          <div className="brand-content">
            <div className="logo-wrapper">
              <div className="logo-icon">
                <Truck size={48} />
              </div>
              <h1 className="brand-title">CargoTrack Pro</h1>
              <p className="brand-subtitle">Enterprise Logistics</p>
            </div>

            <div className="tagline">
              <p className="main-tagline">Transform Your Logistics Operations</p>
              <p className="sub-tagline">
                Real-time tracking, intelligent routing, and complete visibility for African logistics
              </p>
            </div>

            <div className="features-list">
              <div className="feature-item">
                <div className="feature-dot"></div>
                <span>Real-time Shipment Tracking</span>
              </div>
              <div className="feature-item">
                <div className="feature-dot"></div>
                <span>Intelligent Route Optimization</span>
              </div>
              <div className="feature-item">
                <div className="feature-dot"></div>
                <span>Advanced Analytics Dashboard</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="form-section">
          <div className="form-wrapper">
            <h2 className="form-title">Welcome Back</h2>
            <p className="form-description">Sign in to your CargoTrack account</p>

            <form onSubmit={handleSubmit} className="login-form">
              {displayError && (
                <div className="error-message">
                  <AlertCircle size={18} />
                  <span>{displayError}</span>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <div className="input-wrapper">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="form-input"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="input-wrapper">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="form-input"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="submit-button">
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="spinner-icon" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="form-footer">
                <label className="remember-me">
                  <input type="checkbox" disabled={isLoading} />
                  <span>Remember me</span>
                </label>
                <a href="#forgot" className="forgot-link">Forgot password?</a>
              </div>
            </form>

            <div className="demo-section">
              <button
                onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                className="demo-toggle-button"
              >
                <span>{showDemoAccounts ? '🎭 Hide Demo Accounts' : '🎭 Show Demo Accounts'}</span>
                <ChevronDown
                  size={18}
                  style={{
                    transform: showDemoAccounts ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.3s'
                  }}
                />
              </button>

              {showDemoAccounts && (
                <div className="demo-accounts-grid">
                  {demoUsers.map((user, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickLogin(user.email, user.password)}
                      disabled={isLoading}
                      className="demo-account-card"
                    >
                      <div
                        className="demo-account-icon"
                        style={{
                          background: `linear-gradient(135deg, ${user.color}, ${user.color}dd)`,
                        }}
                      >
                        {user.role.split(' ')[0]}
                      </div>
                      <div className="demo-account-info">
                        <div className="demo-account-role">{user.role}</div>
                        <div className="demo-account-email">{user.email}</div>
                      </div>
                      <ArrowRight size={16} />
                    </button>
                  ))}
                </div>
              )}

              <p className="demo-note">Demo credentials provided for testing purposes</p>
            </div>

            <div className="form-bottom">
              <p className="terms-text">
                By signing in, you agree to our{' '}
                <a href="#terms">Terms of Service</a> and{' '}
                <a href="#privacy">Privacy Policy</a>
              </p>
              <p className="demo-disclaimer">
                🔔 This is a demo application. All data is reset periodically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;