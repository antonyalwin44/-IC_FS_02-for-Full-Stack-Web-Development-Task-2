const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  certificateId: {
    type: String,
    unique: true
  },
  recipientName: {
    type: String,
    required: [true, 'Please provide recipient name'],
    trim: true
  },
  recipientEmail: {
    type: String,
    required: [true, 'Please provide recipient email'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
    required: true
  },
  courseName: {
    type: String,
    trim: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  customFields: {
    type: Map,
    of: String
  },
  pdfPath: {
    type: String
  },
  emailSent: {
    type: Boolean,
    default: false
  },
  emailSentAt: {
    type: Date
  },
  issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'issued', 'revoked'],
    default: 'issued'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate unique certificate ID
certificateSchema.pre('save', async function(next) {
  if (!this.certificateId) {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.certificateId = `CERT-${timestamp}-${randomStr}`;
  }
  next();
});

module.exports = mongoose.model('Certificate', certificateSchema);
