// src/features/Auth/pages/Login.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AlertCircle, Loader2, Eye, EyeOff, Truck, ArrowRight, ChevronDown } from 'lucide-react';
import './Login.css';

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
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState('');

  // Get the page the user was trying to access
  const from = (location.state as LocationState)?.from?.pathname || '/dashboard';

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  // Demo user accounts with roles
  const demoUsers = [
    { role: '👑 Super Admin', email: 'admin@cargotrackpro.com', password: 'password', color: 'from-purple-500 to-pink-500' },
    { role: '🎯 Operations Manager', email: 'manager@cargotrackpro.com', password: 'password', color: 'from-blue-500 to-cyan-500' },
    { role: '📦 Dispatcher', email: 'dispatcher@cargotrackpro.com', password: 'password', color: 'from-orange-500 to-red-500' },
    { role: '🚗 Driver', email: 'driver@cargotrackpro.com', password: 'password', color: 'from-green-500 to-emerald-500' },
    { role: '🛍️ Client', email: 'client@example.com', password: 'password', color: 'from-indigo-500 to-blue-500' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(authError || 'Login failed. Please try again.');
      console.error('Login error:', err);
    }
  };

  const handleQuickLogin = async (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
    setError('');

    try {
      await login(userEmail, userPassword);
      navigate(from, { replace: true });
    } catch (err) {
      setError(authError || 'Login failed. Please try again.');
      console.error('Quick login error:', err);
    }
  };

  const displayError = error || authError;

  return (
    <div className="login-container">
      {/* Animated Background Elements */}
      <div className="background-gradient"></div>
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      {/* Main Content */}
      <div className={`login-content ${isAnimating ? 'animate-in' : ''}`}>
        {/* Left Section - Branding */}
        <div className="branding-section">
          <div className="brand-content">
            <div className={`logo-wrapper ${isAnimating ? 'fade-in-down' : ''}`}>
              <div className="logo-icon">
                <Truck size={48} />
              </div>
              <h1 className="brand-title">CargoTrack Pro</h1>
              <p className="brand-subtitle">Enterprise Logistics</p>
            </div>

            <div className={`tagline ${isAnimating ? 'fade-in-up' : ''}`}>
              <p className="main-tagline">
                Transform Your Logistics Operations
              </p>
              <p className="sub-tagline">
                Real-time tracking, intelligent routing, and complete visibility for African logistics
              </p>
            </div>

            {/* Features List */}
            <div className={`features-list ${isAnimating ? 'fade-in-up' : ''}`}>
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
          <div className={`form-wrapper ${isAnimating ? 'fade-in-right' : ''}`}>
            <h2 className="form-title">Welcome Back</h2>
            <p className="form-description">
              Sign in to your CargoTrack account
            </p>

            <form onSubmit={handleSubmit} className="login-form">
              {/* Error Message */}
              {displayError && (
                <div className="error-message">
                  <AlertCircle size={18} />
                  <span>{displayError}</span>
                </div>
              )}

              {/* Email Input */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
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

              {/* Password Input */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`submit-button ${isLoading ? 'loading' : ''}`}
              >
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

              {/* Remember Me & Forgot Password */}
              <div className="form-footer">
                <label className="remember-me">
                  <input type="checkbox" disabled={isLoading} />
                  <span>Remember me</span>
                </label>
                <a href="#forgot" className="forgot-link">
                  Forgot password?
                </a>
              </div>
            </form>

            {/* Demo Accounts Section */}
            <div className="demo-section">
              <button
                onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                className="demo-toggle-button"
              >
                <span className="demo-toggle-text">
                  {showDemoAccounts ? '🎭 Hide Demo Accounts' : '🎭 Show Demo Accounts'}
                </span>
                <ChevronDown
                  size={18}
                  className={`demo-toggle-icon ${showDemoAccounts ? 'rotate' : ''}`}
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
                      title={`${user.role}: ${user.email}`}
                    >
                      <div className={`demo-account-icon bg-gradient-to-br ${user.color}`}>
                        {user.role.split(' ')[0]}
                      </div>
                      <div className="demo-account-info">
                        <div className="demo-account-role">{user.role}</div>
                        <div className="demo-account-email">{user.email}</div>
                      </div>
                      <ArrowRight size={16} className="demo-account-arrow" />
                    </button>
                  ))}
                </div>
              )}

              <p className="demo-note">
                Demo credentials provided for testing purposes
              </p>
            </div>

            {/* Footer */}
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

      {/* Top Accent Line */}
      <div className="accent-line"></div>
    </div>
  );
};

export default Login;