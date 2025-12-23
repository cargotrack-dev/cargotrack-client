import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', () => setIsScrolled(window.scrollY > 50));
    return () => window.removeEventListener('scroll', () => {});
  }, []);

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 25%, #0d9488 100%)',
    color: '#fff',
    overflow: 'hidden',
  };

  const headerStyle: React.CSSProperties = {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    background: isScrolled ? 'rgba(15, 23, 42, 0.95)' : 'transparent',
    backdropFilter: isScrolled ? 'blur(10px)' : 'none',
    borderBottom: isScrolled ? '1px solid rgba(51, 197, 207, 0.2)' : 'none',
    padding: '1rem 2rem',
    transition: 'all 0.3s ease',
  };

  const logoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    marginBottom: 0,
  };

  const logoBadgeStyle: React.CSSProperties = {
    width: '2.5rem',
    height: '2.5rem',
    background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
    borderRadius: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    boxShadow: '0 4px 15px rgba(20, 184, 166, 0.3)',
  };

  const heroSectionStyle: React.CSSProperties = {
    position: 'relative',
    padding: '5rem 2rem',
    maxWidth: '100%',
    margin: '0 auto',
    overflow: 'hidden',
  };

  const heroBgCircle1: React.CSSProperties = {
    position: 'absolute',
    width: '20rem',
    height: '20rem',
    background: 'rgba(20, 184, 166, 0.1)',
    borderRadius: '50%',
    filter: 'blur(80px)',
    top: '-10rem',
    right: '-5rem',
    animation: 'pulse 4s ease-in-out infinite',
  };

  const heroBgCircle2: React.CSSProperties = {
    position: 'absolute',
    width: '20rem',
    height: '20rem',
    background: 'rgba(30, 58, 138, 0.15)',
    borderRadius: '50%',
    filter: 'blur(80px)',
    bottom: '-10rem',
    left: '-5rem',
    animation: 'pulse 5s ease-in-out infinite',
    animationDelay: '1s',
  };

  const badgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    background: 'rgba(30, 58, 138, 0.4)',
    border: '1px solid rgba(20, 184, 166, 0.5)',
    borderRadius: '2rem',
    marginBottom: '2rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#67e8f9',
  };

  const headingStyle: React.CSSProperties = {
    fontSize: '3.5rem',
    fontWeight: 'bold',
    lineHeight: '1.2',
    marginBottom: '1.5rem',
    background: 'linear-gradient(to right, #67e8f9, #06b6d4, #0d9488)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: '1.125rem',
    color: '#bfdbfe',
    lineHeight: '1.6',
    maxWidth: '28rem',
    marginBottom: '2rem',
  };

  const buttonPrimaryStyle: React.CSSProperties = {
    padding: '1rem 2rem',
    background: 'linear-gradient(90deg, #14b8a6 0%, #06b6d4 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 8px 16px rgba(20, 184, 166, 0.3)',
  };

  const buttonSecondaryStyle: React.CSSProperties = {
    padding: '1rem 2rem',
    border: '2px solid #67e8f9',
    background: 'transparent',
    color: '#67e8f9',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  const statsStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem',
    padding: '2rem',
    marginTop: '3rem',
    borderTop: '1px solid rgba(20, 184, 166, 0.2)',
  };

  const statCardStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '1.5rem',
  };

  const statNumberStyle: React.CSSProperties = {
    fontSize: '2rem',
    fontWeight: 'bold',
    background: 'linear-gradient(to right, #67e8f9, #06b6d4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '0.5rem',
  };

  const statLabelStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    color: '#9ca3af',
  };

  const featuresSectionStyle: React.CSSProperties = {
    padding: '4rem 2rem',
    maxWidth: '80rem',
    margin: '0 auto',
  };

  const sectionHeadingStyle: React.CSSProperties = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '1rem',
    background: 'linear-gradient(to right, #67e8f9, #06b6d4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  const featureGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
    marginTop: '3rem',
  };

  const featureCardStyle: React.CSSProperties = {
    padding: '2rem',
    background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.4), rgba(13, 148, 136, 0.1))',
    border: '1px solid rgba(20, 184, 166, 0.3)',
    borderRadius: '1rem',
    transition: 'all 0.3s',
    cursor: 'pointer',
  };

  const pricingSectionStyle: React.CSSProperties = {
    padding: '4rem 2rem',
    background: 'linear-gradient(180deg, rgba(30, 58, 138, 0.1) 0%, transparent 100%)',
    borderTop: '1px solid rgba(20, 184, 166, 0.2)',
    borderBottom: '1px solid rgba(20, 184, 166, 0.2)',
  };

  const priceGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
    maxWidth: '80rem',
    margin: '0 auto',
    marginTop: '3rem',
  };

  const priceCardStyle: React.CSSProperties = {
    padding: '2rem',
    background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.4), rgba(13, 148, 136, 0.1))',
    border: '1px solid rgba(20, 184, 166, 0.3)',
    borderRadius: '1rem',
  };

  const popularBadgeStyle: React.CSSProperties = {
    display: 'inline-block',
    background: 'linear-gradient(90deg, #06b6d4, #14b8a6)',
    padding: '0.25rem 0.75rem',
    borderRadius: '2rem',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  };

  const ctaSectionStyle: React.CSSProperties = {
    padding: '4rem 2rem',
    textAlign: 'center',
    background: 'linear-gradient(90deg, rgba(20, 184, 166, 0.1), rgba(6, 182, 212, 0.1))',
  };

  const footerStyle: React.CSSProperties = {
    padding: '3rem 2rem',
    borderTop: '1px solid rgba(20, 184, 166, 0.2)',
    background: 'rgba(15, 23, 42, 0.5)',
  };

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        * {
          box-sizing: border-box;
        }
      `}</style>

      {/* HEADER */}
      <header style={headerStyle}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={logoStyle} onClick={() => navigate('/')}>
            <div style={logoBadgeStyle}>🚛</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>CargoTrack</h1>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                ...buttonSecondaryStyle,
                padding: '0.5rem 1.5rem',
                fontSize: '0.875rem',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(103, 232, 249, 0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              style={{
                ...buttonPrimaryStyle,
                padding: '0.5rem 1.5rem',
                fontSize: '0.875rem',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section style={heroSectionStyle}>
        <div style={heroBgCircle1} />
        <div style={heroBgCircle2} />

        <div style={{ maxWidth: '80rem', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={badgeStyle}>
            ✓ Trusted by 500+ African Companies
          </div>

          <h2 style={headingStyle}>
            Transform Your<br />Logistics Operations
          </h2>

          <p style={descriptionStyle}>
            Real-time tracking, intelligent routing, and complete visibility for African logistics operators.
            Enterprise-grade, African-built.
          </p>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
            <button
              style={buttonPrimaryStyle}
              onClick={() => navigate('/register')}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Start Free Trial →
            </button>
            <button
              style={buttonSecondaryStyle}
              onClick={() => navigate('/login')}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(103, 232, 249, 0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              Sign In
            </button>
          </div>

          <div style={statsStyle}>
            <div style={statCardStyle}>
              <div style={statNumberStyle}>500+</div>
              <div style={statLabelStyle}>Active Companies</div>
            </div>
            <div style={statCardStyle}>
              <div style={statNumberStyle}>2.5M+</div>
              <div style={statLabelStyle}>Shipments Managed</div>
            </div>
            <div style={statCardStyle}>
              <div style={statNumberStyle}>98%</div>
              <div style={statLabelStyle}>On-Time Delivery</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section style={featuresSectionStyle}>
        <h2 style={sectionHeadingStyle}>Powerful Features</h2>
        <p style={{ textAlign: 'center', color: '#bfdbfe', marginBottom: '3rem' }}>
          Everything you need in one powerful platform
        </p>

        <div style={featureGridStyle}>
          {[
            { emoji: '📍', title: 'Real-Time Tracking', desc: 'GPS-powered live tracking' },
            { emoji: '🗺️', title: 'Route Optimization', desc: 'AI algorithms for efficiency' },
            { emoji: '📊', title: 'Advanced Analytics', desc: 'Deep business insights' },
            { emoji: '👥', title: 'Team Collaboration', desc: 'Manage your entire team' },
            { emoji: '📈', title: 'Performance Metrics', desc: 'Monitor KPIs in real-time' },
            { emoji: '🔒', title: 'Enterprise Security', desc: 'Bank-level protection' },
          ].map((feature, i) => (
            <div
              key={i}
              style={featureCardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.borderColor = 'rgba(20, 184, 166, 0.8)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(20, 184, 166, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(20, 184, 166, 0.3)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{feature.emoji}</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {feature.title}
              </h3>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING SECTION */}
      <section style={pricingSectionStyle}>
        <h2 style={sectionHeadingStyle}>Simple Pricing</h2>
        <p style={{ textAlign: 'center', color: '#bfdbfe', marginBottom: '3rem' }}>
          Choose your plan. No hidden fees.
        </p>

        <div style={priceGridStyle}>
          {[
            { name: 'Starter', price: '₦499', features: ['Track 50+ shipments', 'Basic analytics', 'Email support', '1 user'], popular: false },
            { name: 'Professional', price: '₦1,499', features: ['Unlimited shipments', 'Advanced analytics', 'Priority support', '10 users', 'API access'], popular: true },
            { name: 'Enterprise', price: 'Custom', features: ['Everything in Pro', '24/7 support', 'Custom integration', 'Dedicated manager'], popular: false },
          ].map((plan, i) => (
            <div key={i} style={{ ...priceCardStyle, transform: plan.popular ? 'scale(1.05)' : 'scale(1)' }}>
              {plan.popular && <div style={popularBadgeStyle}>⭐ MOST POPULAR</div>}
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {plan.name}
              </h3>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#67e8f9', marginBottom: '1.5rem' }}>
                {plan.price}
                {plan.price !== 'Custom' && <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>/month</span>}
              </div>
              <button
                style={{
                  ...buttonPrimaryStyle,
                  width: '100%',
                  marginBottom: '1.5rem',
                  background: plan.popular ? 'linear-gradient(90deg, #14b8a6 0%, #06b6d4 100%)' : 'transparent',
                  border: plan.popular ? 'none' : '2px solid #67e8f9',
                  color: plan.popular ? '#fff' : '#67e8f9',
                }}
                onClick={() => navigate(plan.name === 'Enterprise' ? '/login' : '/register')}
              >
                Get Started
              </button>
              {plan.features.map((feature, j) => (
                <div key={j} style={{ marginBottom: '0.75rem', color: '#d1d5db', fontSize: '0.875rem' }}>
                  ✓ {feature}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={ctaSectionStyle}>
        <h2 style={{ ...headingStyle, marginBottom: '1.5rem' }}>Ready to Transform Your Logistics?</h2>
        <p style={{ ...descriptionStyle, maxWidth: '40rem', margin: '0 auto 2rem' }}>
          Join hundreds of African logistics operators using CargoTrack to scale their business.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            style={buttonPrimaryStyle}
            onClick={() => navigate('/register')}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Start Your Free Trial →
          </button>
          <button
            style={buttonSecondaryStyle}
            onClick={() => navigate('/login')}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(103, 232, 249, 0.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            Sign In
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={footerStyle}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <h4 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Product</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Features</a></li>
                <li><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Company</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>About</a></li>
                <li><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Legal</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Privacy</a></li>
                <li><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Terms</a></li>
              </ul>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(20, 184, 166, 0.2)', paddingTop: '2rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>
            <p>© 2025 CargoTrack Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;