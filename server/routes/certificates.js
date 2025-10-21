const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Certificate = require('../models/Certificate');
const Template = require('../models/Template');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const pdfService = require('../services/pdfService');
const emailService = require('../services/emailService');
const path = require('path');

// @route   GET /api/certificates
// @desc    Get all certificates (Admin) or user's certificates
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = { status: { $ne: 'revoked' } }; // Exclude revoked certificates

    // If not admin, only show user's certificates
    if (req.user.role !== 'admin') {
      query.userId = req.user.id;
    }

    const certificates = await Certificate.find(query)
      .populate('templateId', 'name title')
      .populate('issuedBy', 'name email')
      .populate('userId', 'name email')
      .sort('-createdAt');

    res.json({
      success: true,
      count: certificates.length,
      data: certificates
    });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/certificates/my
// @desc    Get current user's certificates
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const certificates = await Certificate.find({ 
      userId: req.user.id,
      status: { $ne: 'revoked' } // Exclude revoked certificates
    })
      .populate('templateId', 'name title')
      .populate('issuedBy', 'name')
      .sort('-createdAt');

    res.json({
      success: true,
      count: certificates.length,
      data: certificates
    });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/certificates/:id
// @desc    Get single certificate
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('templateId')
      .populate('issuedBy', 'name email')
      .populate('userId', 'name email');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    // Check authorization
    if (req.user.role !== 'admin' && certificate.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this certificate'
      });
    }

    res.json({
      success: true,
      data: certificate
    });
  } catch (error) {
    console.error('Error fetching certificate:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/certificates
// @desc    Create and issue new certificate
// @access  Private/Admin
router.post('/', [
  protect,
  authorize('admin'),
  body('recipientName').trim().notEmpty().withMessage('Recipient name is required'),
  body('recipientEmail').isEmail().withMessage('Valid email is required'),
  body('templateId').notEmpty().withMessage('Template is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { recipientName, recipientEmail, templateId, courseName, customFields } = req.body;
    console.log('Creating certificate with data:', { recipientName, recipientEmail, templateId, courseName });

    // Check if template exists
    const template = await Template.findById(templateId);
    if (!template) {
      console.log('Template not found:', templateId);
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }
    console.log('Template found:', template.name);

    // Find or create user for recipient
    let recipientUser = await User.findOne({ email: recipientEmail });
    console.log('Recipient user:', recipientUser ? recipientUser.email : 'Not found');

    // Create certificate
    console.log('Creating certificate in database...');
    const certificate = await Certificate.create({
      recipientName,
      recipientEmail,
      userId: recipientUser ? recipientUser._id : null,
      templateId,
      courseName,
      customFields,
      issuedBy: req.user.id
    });
    console.log('Certificate created with ID:', certificate.certificateId);

    // Generate PDF
    console.log('Generating PDF...');
    const pdfPath = await pdfService.generateCertificate(
      {
        certificateId: certificate.certificateId,
        recipientName,
        courseName,
        issueDate: certificate.issueDate
      },
      template
    );
    console.log('PDF generated at:', pdfPath);

    // Update certificate with PDF path
    certificate.pdfPath = pdfPath;
    await certificate.save();
    console.log('Certificate updated with PDF path');

    // Send email (non-blocking - don't fail if email fails)
    let emailSent = false;
    try {
      const emailResult = await emailService.sendCertificate(
        recipientEmail,
        recipientName,
        certificate.certificateId,
        pdfPath,
        courseName
      );

      if (emailResult.success) {
        certificate.emailSent = true;
        certificate.emailSentAt = new Date();
        await certificate.save();
        emailSent = true;
      }
    } catch (emailError) {
      console.error('Email sending failed (non-critical):', emailError);
      // Continue even if email fails
    }

    // Populate fields for response
    await certificate.populate('templateId', 'name title');
    await certificate.populate('issuedBy', 'name email');

    res.status(201).json({
      success: true,
      data: certificate,
      emailSent: emailSent
    });
  } catch (error) {
    console.error('Error creating certificate:', error);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error creating certificate',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/certificates/:id/download
// @desc    Download certificate PDF
// @access  Private
router.get('/:id/download', protect, async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    // Check authorization
    if (req.user.role !== 'admin' && certificate.userId && certificate.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to download this certificate'
      });
    }

    const filePath = pdfService.getCertificatePath(certificate.certificateId);

    if (!pdfService.certificateExists(certificate.certificateId)) {
      return res.status(404).json({
        success: false,
        message: 'Certificate file not found'
      });
    }

    res.download(filePath, `Certificate_${certificate.certificateId}.pdf`);
  } catch (error) {
    console.error('Error downloading certificate:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/certificates/:id/resend-email
// @desc    Resend certificate email
// @access  Private/Admin
router.post('/:id/resend-email', protect, authorize('admin'), async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    if (!certificate.pdfPath) {
      return res.status(400).json({
        success: false,
        message: 'Certificate PDF not found'
      });
    }

    // Send email
    const emailResult = await emailService.sendCertificate(
      certificate.recipientEmail,
      certificate.recipientName,
      certificate.certificateId,
      certificate.pdfPath,
      certificate.courseName
    );

    if (emailResult.success) {
      certificate.emailSent = true;
      certificate.emailSentAt = new Date();
      await certificate.save();

      res.json({
        success: true,
        message: 'Email sent successfully',
        data: certificate
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send email',
        error: emailResult.error
      });
    }
  } catch (error) {
    console.error('Error resending email:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   DELETE /api/certificates/:id
// @desc    Revoke certificate
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    certificate.status = 'revoked';
    await certificate.save();

    res.json({
      success: true,
      message: 'Certificate revoked successfully'
    });
  } catch (error) {
    console.error('Error revoking certificate:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
