// src/features/Auth/pages/Login.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AlertCircle, Loader2, Eye, EyeOff, Truck, ArrowRight, ChevronDown } from 'lucide-react';

interface LocationState {
  from?: {
    pathname?: string;
  };
}

const loginStyles = `
  :root {
    --primary-dark: #0f172a;
    --primary-blue: #1e3a8a;
    --accent-teal: #0891b2;
    --accent-gold: #f59e0b;
    --accent-orange: #fb923c;
    --white: #ffffff;
    --light-gray: #f8fafc;
    --medium-gray: #cbd5e1;
    --dark-gray: #334155;
    --transition-base: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .login-container {
    position: relative;
    width: 100%;
    height: 100vh;
    display: flex;
    overflow: hidden;
    background: linear-gradient(135deg, var(--primary-dark) 0%, #1a1f3a 100%);
  }

  .accent-line {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--accent-teal), var(--accent-gold));
    z-index: 100;
  }

  .background-gradient {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(15, 23, 42, 1) 0%, rgba(30, 58, 138, 0.1) 50%, rgba(8, 145, 178, 0.05) 100%);
    pointer-events: none;
  }

  .login-content {
    display: flex;
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 10;
  }

  .branding-section {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 40px;
    background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 58, 138, 0.2) 100%);
    border-right: 1px solid rgba(8, 145, 178, 0.1);
  }

  .brand-content {
    max-width: 400px;
    text-align: center;
  }

  .logo-icon {
    width: 100px;
    height: 100px;
    margin: 0 auto 30px;
    background: linear-gradient(135deg, var(--accent-teal), var(--accent-gold));
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 20px 40px rgba(8, 145, 178, 0.3);
  }

  .brand-title {
    font-size: 48px;
    font-weight: 800;
    letter-spacing: -1px;
    background: linear-gradient(135deg, var(--white), var(--accent-teal));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 8px;
  }

  .brand-subtitle {
    font-size: 14px;
    color: var(--medium-gray);
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: 600;
  }

  .tagline {
    margin: 50px 0;
  }

  .main-tagline {
    font-size: 28px;
    font-weight: 700;
    color: var(--white);
    margin-bottom: 16px;
    line-height: 1.3;
  }

  .sub-tagline {
    font-size: 14px;
    color: var(--medium-gray);
    line-height: 1.6;
  }

  .features-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    text-align: left;
  }

  .feature-item {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 13px;
    color: var(--medium-gray);
    transition: all var(--transition-base);
  }

  .feature-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--accent-teal), var(--accent-gold));
    flex-shrink: 0;
  }

  .form-section {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 40px;
    background: linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(241, 245, 250, 1) 100%);
  }

  .form-wrapper {
    width: 100%;
    max-width: 420px;
  }

  .form-title {
    font-size: 32px;
    font-weight: 800;
    color: var(--primary-dark);
    margin-bottom: 8px;
    letter-spacing: -0.5px;
  }

  .form-description {
    font-size: 14px;
    color: var(--medium-gray);
    margin-bottom: 40px;
    font-weight: 500;
  }

  .login-form {
    margin-bottom: 40px;
  }

  .form-group {
    margin-bottom: 24px;
  }

  .form-label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: var(--primary-dark);
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .form-input {
    width: 100%;
    padding: 14px 16px;
    border: 2px solid var(--light-gray);
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    background: var(--white);
    color: var(--primary-dark);
    transition: all var(--transition-base);
    outline: none;
  }

  .form-input::placeholder {
    color: var(--medium-gray);
  }

  .form-input:hover {
    border-color: var(--accent-teal);
    background: rgba(8, 145, 178, 0.02);
  }

  .form-input:focus {
    border-color: var(--accent-teal);
    background: rgba(8, 145, 178, 0.05);
    box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.1);
  }

  .password-toggle {
    position: absolute;
    right: 16px;
    background: none;
    border: none;
    color: var(--medium-gray);
    cursor: pointer;
    transition: color var(--transition-base);
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .password-toggle:hover {
    color: var(--accent-teal);
  }

  .error-message {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 8px;
    color: #dc2626;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 24px;
  }

  .submit-button {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, var(--accent-teal), var(--accent-gold));
    color: var(--white);
    border: none;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: all var(--transition-base);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow: 0 10px 30px rgba(8, 145, 178, 0.3);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 20px;
  }

  .submit-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 15px 40px rgba(8, 145, 178, 0.4);
  }

  .submit-button:disabled {
    opacity: 0.8;
    cursor: not-allowed;
  }

  .spinner-icon {
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .form-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    gap: 16px;
  }

  .remember-me {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--medium-gray);
    cursor: pointer;
  }

  .remember-me input {
    width: 16px;
    height: 16px;
    cursor: pointer;
    accent-color: var(--accent-teal);
  }

  .forgot-link {
    color: var(--accent-teal);
    text-decoration: none;
    font-weight: 600;
  }

  .demo-section {
    margin: 40px 0;
    padding-top: 24px;
    border-top: 1px solid var(--light-gray);
  }

  .demo-toggle-button {
    width: 100%;
    padding: 12px 16px;
    background: rgba(8, 145, 178, 0.08);
    border: 2px solid rgba(8, 145, 178, 0.2);
    border-radius: 10px;
    color: var(--accent-teal);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-base);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .demo-toggle-button:hover:not(:disabled) {
    background: rgba(8, 145, 178, 0.15);
    border-color: var(--accent-teal);
  }

  .demo-accounts-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
    margin-top: 16px;
    margin-bottom: 16px;
    max-height: 400px;
    overflow-y: auto;
  }

  .demo-account-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: var(--white);
    border: 2px solid var(--light-gray);
    border-radius: 10px;
    cursor: pointer;
    transition: all var(--transition-base);
    text-align: left;
  }

  .demo-account-card:hover:not(:disabled) {
    border-color: var(--accent-teal);
    background: rgba(8, 145, 178, 0.04);
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(8, 145, 178, 0.15);
  }

  .demo-account-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 12px;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .demo-account-info {
    flex: 1;
    min-width: 0;
  }

  .demo-account-role {
    font-size: 13px;
    font-weight: 600;
    color: var(--primary-dark);
  }

  .demo-account-email {
    font-size: 11px;
    color: var(--medium-gray);
    margin-top: 2px;
  }

  .demo-note {
    font-size: 11px;
    color: var(--medium-gray);
    text-align: center;
    margin-top: 12px;
  }

  .form-bottom {
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid var(--light-gray);
  }

  .terms-text {
    font-size: 11px;
    color: var(--medium-gray);
    text-align: center;
    line-height: 1.6;
  }

  .demo-disclaimer {
    font-size: 11px;
    color: var(--medium-gray);
    text-align: center;
    margin-top: 4px;
  }

  @media (max-width: 1024px) {
    .login-content {
      flex-direction: column;
    }
    .branding-section {
      padding: 40px 30px;
      border-right: none;
      border-bottom: 1px solid rgba(8, 145, 178, 0.1);
      min-height: 35vh;
    }
    .form-section {
      padding: 40px 30px;
      min-height: 65vh;
    }
  }

  @media (max-width: 768px) {
    .branding-section {
      display: none;
    }
    .form-section {
      padding: 30px 20px;
      width: 100%;
    }
    .form-wrapper {
      max-width: 100%;
    }
    .form-input {
      font-size: 16px;
    }
  }
`;

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
    <>
      <style>{loginStyles}</style>
      <div className="login-container">
        <div className="background-gradient"></div>

        <div className="login-content">
          {/* Left Section - Branding */}
          <div className="branding-section">
            <div className="brand-content">
              <div className="logo-icon">
                <Truck size={48} />
              </div>
              <h1 className="brand-title">CargoTrack Pro</h1>
              <p className="brand-subtitle">Enterprise Logistics</p>

              <div className="tagline">
                <p className="main-tagline">
                  Transform Your Logistics Operations
                </p>
                <p className="sub-tagline">
                  Real-time tracking, intelligent routing, and complete visibility
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
              <p className="form-description">
                Sign in to your CargoTrack account
              </p>

              <form onSubmit={handleSubmit} className="login-form">
                {displayError && (
                  <div className="error-message">
                    <AlertCircle size={18} />
                    <span>{displayError}</span>
                  </div>
                )}

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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="submit-button"
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

              <div className="demo-section">
                <button
                  onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                  className="demo-toggle-button"
                >
                  <span>
                    {showDemoAccounts ? '🎭 Hide Demo Accounts' : '🎭 Show Demo Accounts'}
                  </span>
                  <ChevronDown
                    size={18}
                    style={{ transform: showDemoAccounts ? 'rotate(180deg)' : 'rotate(0)' }}
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
                            background: user.color === 'from-purple-500 to-pink-500' ? 'linear-gradient(135deg, #a855f7, #ec4899)' :
                                       user.color === 'from-blue-500 to-cyan-500' ? 'linear-gradient(135deg, #3b82f6, #06b6d4)' :
                                       user.color === 'from-orange-500 to-red-500' ? 'linear-gradient(135deg, #f97316, #ef4444)' :
                                       user.color === 'from-green-500 to-emerald-500' ? 'linear-gradient(135deg, #22c55e, #10b981)' :
                                       'linear-gradient(135deg, #6366f1, #3b82f6)'
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

                <p className="demo-note">
                  Demo credentials provided for testing purposes
                </p>
              </div>

              <div className="form-bottom">
                <p className="terms-text">
                  By signing in, you agree to our{' '}
                  <a href="#terms" style={{ color: 'var(--accent-teal)', textDecoration: 'none' }}>
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#privacy" style={{ color: 'var(--accent-teal)', textDecoration: 'none' }}>
                    Privacy Policy
                  </a>
                </p>
                <p className="demo-disclaimer">
                  🔔 This is a demo application. All data is reset periodically.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="accent-line"></div>
      </div>
    </>
  );
};

export default Login;
