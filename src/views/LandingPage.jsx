// Cursor and ChatGPT helped write this code
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  const [visibleElements, setVisibleElements] = useState(new Set());

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleElements((prev) => new Set([...prev, entry.target.id]));
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const handleRipple = useCallback((e) => {
    const ripple = document.createElement('span');
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    Object.assign(ripple.style, {
      width: `${size}px`,
      height: `${size}px`,
      left: `${x}px`,
      top: `${y}px`,
      position: 'absolute',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.5)',
      transform: 'scale(0)',
      animation: 'ripple 0.6s linear',
      pointerEvents: 'none',
    });

    const btn = e.currentTarget;
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  }, []);

  const companies = [
    'Goldman Sachs',
    'JP Morgan',
    'Morgan Stanley',
    'BlackRock',
    'Citi',
    'Bank of America',
    'Wells Fargo',
    'Deutsche Bank',
    'Barclays',
    'Credit Suisse',
    'UBS',
    'McKinsey & Co',
    'Bain & Company',
    'BCG',
    'Deloitte',
    'PwC',
    'KPMG',
    'EY',
  ];

  return (
    <div>

      {/* Header */}
      <header>
        <div className="container">
          <nav>
            <div className="logo">Financy</div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Master Your Finance Career Journey</h1>
              <p>
                The all-in-one CRM platform.
                Track applications, manage networking contacts, and never miss a follow-up opportunity.
              </p>
              <div className="hero-buttons">
                <Link to="/signup" className="cta-button" onClick={handleRipple}>
                  Sign Up
                </Link>
                <Link
                  to="/signin"
                  className="cta-button2"
                  style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}
                  onClick={handleRipple}
                >
                  Sign In
                </Link>
              </div>
              <div className="trust-indicator">
                <span>⭐⭐⭐⭐⭐</span>
                <span>Trusted by 10,000+ finance students</span>
              </div>
            </div>
            <div className="hero-visual">
              <div className="dashboard-mockup">
                <h3 style={{ color: 'white', marginBottom: '1rem' }}>
                  Your Finance Career Dashboard
                </h3>
                <div className="feature-cards">
                  <div className="feature-card">
                    <strong>📞 5 Upcoming Calls</strong><br />
                    Goldman Sachs, JP Morgan...
                  </div>
                  <div className="feature-card">
                    <strong>📋 12 Active Applications</strong><br />
                    IB Summer Analyst positions
                  </div>
                  <div className="feature-card">
                    <strong>🎯 8 Target Companies</strong><br />
                    Next actions scheduled
                  </div>
                  <div className="feature-card">
                    <strong>📧 3 Follow-ups Due</strong><br />
                    Networking contacts
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="logo-company">
        <div className="logo-track">
          {companies.concat(companies).map((company, index) => (
            <div key={index} className="logo-item">
              {company}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta">
        <div className="container">
          <div className="final-cta-content">
            <h2>Ready to Accelerate Your Finance Career?</h2>
            <p>
              Join thousands of finance students who are already using Financy to land offers at
              Goldman Sachs, JP Morgan, McKinsey, and other top firms.
            </p>
            <Link
              to="/signup"
              className="cta-button"
              onClick={handleRipple}
            >
              Sign Up Today
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

export default LandingPage;
