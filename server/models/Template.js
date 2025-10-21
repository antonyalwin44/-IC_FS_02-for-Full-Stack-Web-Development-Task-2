const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a template name'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a certificate title'],
    default: 'Certificate of Achievement'
  },
  bodyText: {
    type: String,
    required: [true, 'Please provide certificate body text'],
    default: 'This is to certify that'
  },
  footerText: {
    type: String,
    default: 'Awarded on'
  },
  backgroundColor: {
    type: String,
    default: '#ffffff'
  },
  textColor: {
    type: String,
    default: '#000000'
  },
  borderColor: {
    type: String,
    default: '#4F46E5'
  },
  organizationName: {
    type: String,
    default: 'Organization Name'
  },
  signatoryName: {
    type: String,
    default: 'Authorized Signatory'
  },
  signatoryTitle: {
    type: String,
    default: 'Director'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Template', templateSchema);
