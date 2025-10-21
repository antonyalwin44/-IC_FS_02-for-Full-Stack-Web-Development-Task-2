import React, { useState, useEffect } from 'react';
import { Award, Download, Calendar, Mail, Search } from 'lucide-react';
import { certificateAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const UserDashboard = () => {
  const [certificates, setCertificates] = useState([]);
  const [filteredCertificates, setFilteredCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const { user } = useAuth();

  useEffect(() => {
    loadCertificates();
  }, []);

  useEffect(() => {
    filterCertificates();
  }, [searchTerm, certificates]);

  const loadCertificates = async () => {
    setLoading(true);
    try {
      const response = await certificateAPI.getMy();
      setCertificates(response.data.data);
      setFilteredCertificates(response.data.data);
    } catch (error) {
      console.error('Error loading certificates:', error);
      showMessage('error', 'Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  const filterCertificates = () => {
    if (!searchTerm) {
      setFilteredCertificates(certificates);
      return;
    }

    const filtered = certificates.filter(cert =>
      cert.certificateId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.courseName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCertificates(filtered);
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleDownload = async (id, certificateId) => {
    try {
      const response = await certificateAPI.download(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Certificate_${certificateId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showMessage('success', 'Certificate downloaded successfully!');
    } catch (error) {
      showMessage('error', 'Failed to download certificate');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user?.name}!</h1>
          <p>View and download your certificates</p>
        </div>
        <div className="user-stats">
          <div className="stat-badge">
            <Award size={20} />
            <span>{certificates.length} Certificates</span>
          </div>
        </div>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="search-bar">
        <Search size={20} />
        <input
          type="text"
          placeholder="Search certificates by ID or course name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="dashboard-content">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : filteredCertificates.length === 0 ? (
          <div className="empty-state">
            <Award size={64} color="#d1d5db" />
            <h3>No Certificates Found</h3>
            <p>
              {searchTerm
                ? 'No certificates match your search criteria'
                : 'You haven\'t received any certificates yet'}
            </p>
          </div>
        ) : (
          <div className="certificates-grid">
            {filteredCertificates.map((cert) => (
              <div key={cert._id} className="certificate-card">
                <div className="certificate-icon">
                  <Award size={32} color="#667eea" />
                </div>
                
                <div className="certificate-info">
                  <h3>{cert.courseName || 'Certificate'}</h3>
                  <div className="certificate-meta">
                    <div className="meta-item">
                      <Calendar size={14} />
                      <span>{new Date(cert.issueDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="meta-item">
                      <Mail size={14} />
                      <span className={cert.emailSent ? 'text-success' : 'text-warning'}>
                        {cert.emailSent ? 'Email Sent' : 'Email Pending'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="certificate-id">
                    <code>{cert.certificateId}</code>
                  </div>

                  {cert.templateId && (
                    <div className="certificate-template">
                      Template: {cert.templateId.name}
                    </div>
                  )}
                </div>

                <button
                  className="btn btn-primary"
                  onClick={() => handleDownload(cert._id, cert.certificateId)}
                >
                  <Download size={18} />
                  Download PDF
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
