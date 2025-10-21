import React, { useState, useEffect, useCallback } from 'react';
import { 
  Award, 
  FileText, 
  Users, 
  Mail, 
  Plus,
  Download,
  Trash2,
  TrendingUp
} from 'lucide-react';
import { certificateAPI, templateAPI, analyticsAPI } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [certificates, setCertificates] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'overview') {
        const response = await analyticsAPI.getStats();
        setStats(response.data.data);
      } else if (activeTab === 'certificates') {
        const response = await certificateAPI.getAll();
        setCertificates(response.data.data);
      } else if (activeTab === 'templates') {
        const response = await templateAPI.getAll();
        setTemplates(response.data.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      showMessage('error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleCreateCertificate = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting certificate data:', formData);
      const response = await certificateAPI.create(formData);
      console.log('Certificate created successfully:', response.data);
      showMessage('success', 'Certificate created and sent successfully!');
      setShowModal(false);
      setFormData({});
      loadData();
    } catch (error) {
      console.error('Certificate creation error:', error);
      console.error('Error response:', error.response?.data);
      showMessage('error', error.response?.data?.message || error.response?.data?.error || 'Failed to create certificate');
    }
  };

  const handleCreateTemplate = async (e) => {
    e.preventDefault();
    try {
      await templateAPI.create(formData);
      showMessage('success', 'Template created successfully!');
      setShowModal(false);
      setFormData({});
      loadData();
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to create template');
    }
  };

  const handleDownload = async (id) => {
    try {
      const response = await certificateAPI.download(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      showMessage('error', 'Failed to download certificate');
    }
  };

  const handleResendEmail = async (id) => {
    try {
      await certificateAPI.resendEmail(id);
      showMessage('success', 'Email sent successfully!');
      loadData();
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to send email');
    }
  };

  const handleDeleteCertificate = async (id) => {
    if (window.confirm('Are you sure you want to delete this certificate? This action cannot be undone.')) {
      try {
        await certificateAPI.revoke(id);
        showMessage('success', 'Certificate deleted successfully');
        loadData();
      } catch (error) {
        showMessage('error', error.response?.data?.message || 'Failed to delete certificate');
      }
    }
  };

  const handleDeleteTemplate = async (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await templateAPI.delete(id);
        showMessage('success', 'Template deleted successfully');
        loadData();
      } catch (error) {
        showMessage('error', 'Failed to delete template');
      }
    }
  };

  const openModal = async (type) => {
    setModalType(type);
    setFormData({});
    
    // Load templates if opening certificate modal
    if (type === 'certificate' && templates.length === 0) {
      try {
        const response = await templateAPI.getAll();
        setTemplates(response.data.data);
      } catch (error) {
        console.error('Error loading templates:', error);
        showMessage('error', 'Failed to load templates');
      }
    }
    
    setShowModal(true);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage certificates, templates, and view analytics</p>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="dashboard-tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <TrendingUp size={18} />
          Overview
        </button>
        <button
          className={`tab ${activeTab === 'certificates' ? 'active' : ''}`}
          onClick={() => setActiveTab('certificates')}
        >
          <Award size={18} />
          Certificates
        </button>
        <button
          className={`tab ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          <FileText size={18} />
          Templates
        </button>
      </div>

      <div className="dashboard-content">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && stats && (
              <div className="overview-section">
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#dbeafe' }}>
                      <Award size={24} color="#3b82f6" />
                    </div>
                    <div className="stat-content">
                      <h3>{stats.overview.totalCertificates}</h3>
                      <p>Total Certificates</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#d1fae5' }}>
                      <TrendingUp size={24} color="#10b981" />
                    </div>
                    <div className="stat-content">
                      <h3>{stats.overview.certificatesThisMonth}</h3>
                      <p>This Month</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#fef3c7' }}>
                      <Users size={24} color="#f59e0b" />
                    </div>
                    <div className="stat-content">
                      <h3>{stats.overview.totalUsers}</h3>
                      <p>Total Users</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#e0e7ff' }}>
                      <Mail size={24} color="#6366f1" />
                    </div>
                    <div className="stat-content">
                      <h3>{stats.overview.emailDeliveryRate}</h3>
                      <p>Email Success Rate</p>
                    </div>
                  </div>
                </div>

                {stats.certificatesByMonth && stats.certificatesByMonth.length > 0 && (
                  <div className="card" style={{ marginTop: '24px' }}>
                    <h3>Certificate Issuance Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={stats.certificatesByMonth}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="_id.month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#667eea" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'certificates' && (
              <div className="certificates-section">
                <div className="section-header">
                  <h2>Certificates</h2>
                  <button className="btn btn-primary" onClick={() => openModal('certificate')}>
                    <Plus size={18} />
                    Issue Certificate
                  </button>
                </div>

                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Certificate ID</th>
                        <th>Recipient</th>
                        <th>Email</th>
                        <th>Course</th>
                        <th>Issue Date</th>
                        <th>Email Sent</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {certificates.map((cert) => (
                        <tr key={cert._id}>
                          <td><code>{cert.certificateId}</code></td>
                          <td>{cert.recipientName}</td>
                          <td>{cert.recipientEmail}</td>
                          <td>{cert.courseName || 'N/A'}</td>
                          <td>{new Date(cert.issueDate).toLocaleDateString()}</td>
                          <td>
                            <span className={`status ${cert.emailSent ? 'success' : 'pending'}`}>
                              {cert.emailSent ? 'Sent' : 'Pending'}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn-icon"
                              onClick={() => handleDownload(cert._id)}
                              title="Download"
                            >
                              <Download size={16} />
                            </button>
                            {!cert.emailSent && (
                              <button
                                className="btn-icon"
                                onClick={() => handleResendEmail(cert._id)}
                                title="Resend Email"
                                style={{ marginLeft: '8px' }}
                              >
                                <Mail size={16} />
                              </button>
                            )}
                            <button
                              className="btn-icon btn-danger"
                              onClick={() => handleDeleteCertificate(cert._id)}
                              title="Delete Certificate"
                              style={{ marginLeft: '8px' }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'templates' && (
              <div className="templates-section">
                <div className="section-header">
                  <h2>Certificate Templates</h2>
                  <button className="btn btn-primary" onClick={() => openModal('template')}>
                    <Plus size={18} />
                    Create Template
                  </button>
                </div>

                <div className="templates-grid">
                  {templates.map((template) => (
                    <div key={template._id} className="template-card">
                      <div className="template-header">
                        <h3>{template.name}</h3>
                        <div className="template-actions">
                          <button
                            className="btn-icon"
                            onClick={() => handleDeleteTemplate(template._id)}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <p className="template-description">{template.description || 'No description'}</p>
                      <div className="template-details">
                        <div className="detail-item">
                          <strong>Title:</strong> {template.title}
                        </div>
                        <div className="detail-item">
                          <strong>Organization:</strong> {template.organizationName}
                        </div>
                        <div className="detail-item">
                          <strong>Signatory:</strong> {template.signatoryName}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{modalType === 'certificate' ? 'Issue New Certificate' : 'Create Template'}</h2>
            
            {modalType === 'certificate' ? (
              <form onSubmit={handleCreateCertificate}>
                <div className="form-group">
                  <label>Recipient Name *</label>
                  <input
                    type="text"
                    value={formData.recipientName || ''}
                    onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Recipient Email *</label>
                  <input
                    type="email"
                    value={formData.recipientEmail || ''}
                    onChange={(e) => setFormData({...formData, recipientEmail: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Template *</label>
                  <select
                    value={formData.templateId || ''}
                    onChange={(e) => setFormData({...formData, templateId: e.target.value})}
                    required
                  >
                    <option value="">Select a template</option>
                    {templates.map((t) => (
                      <option key={t._id} value={t._id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Course/Achievement Name</label>
                  <input
                    type="text"
                    value={formData.courseName || ''}
                    onChange={(e) => setFormData({...formData, courseName: e.target.value})}
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Issue Certificate
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleCreateTemplate}>
                <div className="form-group">
                  <label>Template Name *</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Certificate Title *</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., Certificate of Achievement"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Body Text *</label>
                  <textarea
                    value={formData.bodyText || ''}
                    onChange={(e) => setFormData({...formData, bodyText: e.target.value})}
                    placeholder="e.g., This is to certify that"
                    rows="2"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Organization Name</label>
                  <input
                    type="text"
                    value={formData.organizationName || ''}
                    onChange={(e) => setFormData({...formData, organizationName: e.target.value})}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Signatory Name</label>
                    <input
                      type="text"
                      value={formData.signatoryName || ''}
                      onChange={(e) => setFormData({...formData, signatoryName: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label>Signatory Title</label>
                    <input
                      type="text"
                      value={formData.signatoryTitle || ''}
                      onChange={(e) => setFormData({...formData, signatoryTitle: e.target.value})}
                    />
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Template
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
