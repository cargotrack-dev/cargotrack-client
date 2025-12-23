import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Role {
  id: string;
  icon: string;
  name: string;
  description: string;
  features: string[];
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  const roles: Role[] = [
    {
      id: 'admin',
      icon: '👤',
      name: 'System Administrator',
      description: 'Full access to all features and system management',
      features: ['User management', 'System settings', 'Access control', 'Reports'],
    },
    {
      id: 'manager',
      icon: '🎯',
      name: 'Operations Manager',
      description: 'Manage shipments, drivers, and fleet operations',
      features: ['Shipment management', 'Driver assignment', 'Route optimization', 'Analytics'],
    },
    {
      id: 'dispatcher',
      icon: '📦',
      name: 'Dispatcher',
      description: 'Handle shipment dispatch and delivery scheduling',
      features: ['Shipment dispatch', 'Delivery scheduling', 'Driver communication', 'Status tracking'],
    },
    {
      id: 'driver',
      icon: '🚗',
      name: 'Driver',
      description: 'Manage deliveries and view assigned shipments',
      features: ['View shipments', 'GPS tracking', 'Delivery confirmation', 'Route planning'],
    },
    {
      id: 'client',
      icon: '👥',
      name: 'Client',
      description: 'Track shipments and manage orders',
      features: ['Track shipments', 'View history', 'Request quotes', 'Manage account'],
    },
  ];

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 25%, #0d9488 100%)',
    color: '#fff',
    padding: '2rem',
  };

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '3rem',
  };

  const logoStyle: React.CSSProperties = {
    fontSize: '2.5rem',
    marginBottom: '1rem',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    color: '#bfdbfe',
    marginBottom: '1rem',
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    color: '#9ca3af',
  };

  const contentStyle: React.CSSProperties = {
    maxWidth: '70rem',
    margin: '0 auto',
  };

  const roleGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginTop: '2rem',
  };

  const roleCardStyle: React.CSSProperties = {
    padding: '1.5rem',
    background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.4), rgba(13, 148, 136, 0.1))',
    border: '2px solid rgba(20, 184, 166, 0.3)',
    borderRadius: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.3s',
  };

  const selectedRoleCardStyle: React.CSSProperties = {
    ...roleCardStyle,
    background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.3), rgba(6, 182, 212, 0.2))',
    border: '2px solid rgba(20, 184, 166, 0.8)',
    boxShadow: '0 8px 24px rgba(20, 184, 166, 0.3)',
    transform: 'scale(1.02)',
  };

  const roleIconStyle: React.CSSProperties = {
    fontSize: '2.5rem',
    marginBottom: '1rem',
  };

  const roleNameStyle: React.CSSProperties = {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  };

  const roleDescStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    color: '#bfdbfe',
    marginBottom: '1rem',
  };

  const featureListStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  };

  const featureItemStyle: React.CSSProperties = {
    fontSize: '0.8125rem',
    color: '#9ca3af',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  };

  const formStyle: React.CSSProperties = {
    marginTop: '3rem',
    padding: '2rem',
    background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.4), rgba(13, 148, 136, 0.1))',
    border: '1px solid rgba(20, 184, 166, 0.3)',
    borderRadius: '1rem',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    marginBottom: '1rem',
    background: 'rgba(15, 23, 42, 0.6)',
    border: '1px solid rgba(20, 184, 166, 0.3)',
    borderRadius: '0.5rem',
    color: '#fff',
    fontSize: '0.875rem',
    boxSizing: 'border-box',
  };

  const inputFocusStyle: React.CSSProperties = {
    ...inputStyle,
    borderColor: '#14b8a6',
    boxShadow: '0 0 0 3px rgba(20, 184, 166, 0.1)',
  };

  const buttonPrimaryStyle: React.CSSProperties = {
    padding: '0.875rem 1.5rem',
    background: 'linear-gradient(90deg, #14b8a6 0%, #06b6d4 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 12px rgba(20, 184, 166, 0.3)',
  };

  const buttonSecondaryStyle: React.CSSProperties = {
    padding: '0.875rem 1.5rem',
    background: 'transparent',
    border: '2px solid #67e8f9',
    color: '#67e8f9',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  const backButtonStyle: React.CSSProperties = {
    position: 'fixed',
    top: '1.5rem',
    left: '1.5rem',
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#14b8a6',
    background: 'rgba(15, 23, 42, 0.8)',
    border: '1px solid rgba(20, 184, 166, 0.3)',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'all 0.2s',
  };

  const selectedRole_ = roles.find(r => r.id === selectedRole);

  return (
    <div style={containerStyle}>
      <style>{`
        * {
          box-sizing: border-box;
        }
        input::placeholder {
          color: #6b7280;
        }
      `}</style>

      {/* Back to Home Button */}
      <button
        onClick={() => navigate('/')}
        style={backButtonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(15, 23, 42, 0.95)';
          e.currentTarget.style.borderColor = '#14b8a6';
          e.currentTarget.style.color = '#0d9488';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(15, 23, 42, 0.8)';
          e.currentTarget.style.borderColor = 'rgba(20, 184, 166, 0.3)';
          e.currentTarget.style.color = '#14b8a6';
        }}
      >
        <span>←</span>
        Back to Home
      </button>

      <div style={contentStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={logoStyle}>🚛</div>
          <h1 style={titleStyle}>CargoTrack Pro</h1>
          <p style={subtitleStyle}>Create Your Account</p>
          {step === 1 ? (
            <p style={descriptionStyle}>Choose Your Role</p>
          ) : (
            <p style={descriptionStyle}>Complete Your Profile</p>
          )}
        </div>

        {/* Step 1: Role Selection */}
        {step === 1 && (
          <div>
            <p style={{ textAlign: 'center', color: '#bfdbfe', marginBottom: '2rem' }}>
              Select the role that best describes your position
            </p>

            <div style={roleGridStyle}>
              {roles.map((role) => (
                <div
                  key={role.id}
                  style={selectedRole === role.id ? selectedRoleCardStyle : roleCardStyle}
                  onClick={() => setSelectedRole(role.id)}
                  onMouseEnter={(e) => {
                    if (selectedRole !== role.id) {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.borderColor = 'rgba(20, 184, 166, 0.6)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedRole !== role.id) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'rgba(20, 184, 166, 0.3)';
                    }
                  }}
                >
                  <div style={roleIconStyle}>{role.icon}</div>
                  <h3 style={roleNameStyle}>{role.name}</h3>
                  <p style={roleDescStyle}>{role.description}</p>
                  <div style={featureListStyle}>
                    {role.features.map((feature, i) => (
                      <div key={i} style={featureItemStyle}>
                        <span>✓</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '3rem' }}>
              <button
                style={buttonSecondaryStyle}
                onClick={() => navigate('/login')}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(103, 232, 249, 0.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                Sign In Instead
              </button>
              <button
                style={{
                  ...buttonPrimaryStyle,
                  opacity: selectedRole ? 1 : 0.5,
                  cursor: selectedRole ? 'pointer' : 'not-allowed',
                }}
                onClick={() => selectedRole && setStep(2)}
                disabled={!selectedRole}
                onMouseEnter={(e) => selectedRole && (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Form */}
        {step === 2 && selectedRole_ && (
          <div style={formStyle}>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                {selectedRole_.icon} {selectedRole_.name}
              </div>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                Complete the form below to create your account
              </p>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                Full Name
              </label>
              <input
                type="text"
                placeholder="Idris Alamutu"
                style={inputStyle}
                onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.currentTarget.style, inputStyle)}
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@company.com"
                style={inputStyle}
                onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.currentTarget.style, inputStyle)}
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                style={inputStyle}
                onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.currentTarget.style, inputStyle)}
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ cursor: 'pointer' }} />
                <span style={{ fontSize: '0.875rem' }}>I agree to the Terms of Service and Privacy Policy</span>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                style={buttonSecondaryStyle}
                onClick={() => setStep(1)}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(103, 232, 249, 0.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                ← Back
              </button>
              <button
                style={buttonPrimaryStyle}
                onClick={() => {
                  alert('Account created successfully! Demo purposes only.');
                  navigate('/login');
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                Create Account →
              </button>
            </div>

            <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem', marginTop: '2rem' }}>
              Already have an account?{' '}
              <a
                href="#"
                onClick={() => navigate('/login')}
                style={{ color: '#14b8a6', textDecoration: 'none', fontWeight: '500' }}
              >
                Sign In
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;