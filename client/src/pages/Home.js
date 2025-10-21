import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Mail, FileText, TrendingUp, Shield, Zap } from 'lucide-react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Certificate Management
            <span className="gradient-text"> Made Simple</span>
          </h1>
          <p className="hero-description">
            Automate certificate generation and delivery with our powerful, 
            secure, and user-friendly platform. Issue certificates in seconds, 
            not hours.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-large">
              Get Started Free
            </Link>
            <Link to="/login" className="btn btn-secondary btn-large">
              Sign In
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="floating-card">
            <Award size={48} color="#667eea" />
            <h3>Digital Certificates</h3>
            <p>Professional & Secure</p>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Powerful Features</h2>
        <p className="section-subtitle">
          Everything you need to manage certificates efficiently
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FileText size={32} />
            </div>
            <h3>Dynamic PDF Generation</h3>
            <p>
              Create beautiful, professional certificates automatically using 
              customizable templates with your branding.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Mail size={32} />
            </div>
            <h3>Automated Email Delivery</h3>
            <p>
              Certificates are automatically sent to recipients via email with 
              professional templates and attachments.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Shield size={32} />
            </div>
            <h3>Secure & Authenticated</h3>
            <p>
              Role-based access control ensures only authorized users can issue 
              certificates and manage templates.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <TrendingUp size={32} />
            </div>
            <h3>Analytics Dashboard</h3>
            <p>
              Track certificate issuance trends, email delivery rates, and user 
              engagement with detailed analytics.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Zap size={32} />
            </div>
            <h3>Lightning Fast</h3>
            <p>
              Generate and deliver certificates in seconds with our optimized 
              PDF generation and email delivery system.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Award size={32} />
            </div>
            <h3>Template Management</h3>
            <p>
              Create unlimited certificate templates with custom designs, colors, 
              and content for different occasions.
            </p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>
            Join thousands of organizations using our platform to automate 
            their certificate management
          </p>
          <Link to="/register" className="btn btn-primary btn-large">
            Create Free Account
          </Link>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <Award size={24} />
            <span>Certificate Management System</span>
          </div>
          <p>&copy; 2024 Certificate Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
