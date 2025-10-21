const nodemailer = require('nodemailer');
const fs = require('fs');

class EmailService {
  constructor() {
    // Check if email configuration is present
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn('⚠️  Email configuration missing. Email functionality will be disabled.');
      this.transporter = null;
      return;
    }

    try {
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: false, // true for 465, false for other ports
        requireTLS: true, // Force TLS
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        },
        tls: {
          rejectUnauthorized: false // Allow self-signed certificates in development
        }
      });

      // Verify transporter configuration
      this.transporter.verify((error, success) => {
        if (error) {
          console.error('❌ Email transporter verification failed:', error.message);
          console.error('Please check your EMAIL_USER and EMAIL_PASSWORD in .env file');
        } else {
          console.log('✅ Email service is ready to send emails');
        }
      });
    } catch (error) {
      console.error('❌ Failed to create email transporter:', error.message);
      this.transporter = null;
    }
  }

  async sendCertificate(recipientEmail, recipientName, certificateId, pdfPath, courseName) {
    try {
      // Check if transporter is available
      if (!this.transporter) {
        console.error('Email transporter not configured. Please set EMAIL_USER and EMAIL_PASSWORD in .env file');
        return { 
          success: false, 
          error: 'Email service not configured. Please contact administrator to set up email credentials.' 
        };
      }

      // Check if PDF file exists
      if (!fs.existsSync(pdfPath)) {
        console.error('PDF file not found:', pdfPath);
        return { 
          success: false, 
          error: 'Certificate PDF file not found' 
        };
      }

      const mailOptions = {
        from: `"Certificate Management System" <${process.env.EMAIL_USER}>`,
        to: recipientEmail,
        subject: '🎓 Your Certificate is Ready!',
        html: this.getCertificateEmailTemplate(recipientName, certificateId, courseName),
        attachments: [
          {
            filename: `Certificate_${certificateId}.pdf`,
            path: pdfPath
          }
        ]
      };

      console.log(`Sending email to ${recipientEmail}...`);
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Error sending email:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to send email. Please check email configuration.' 
      };
    }
  }

  getCertificateEmailTemplate(recipientName, certificateId, courseName) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #f9fafb;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .certificate-box {
            background: white;
            padding: 20px;
            border-left: 4px solid #667eea;
            margin: 20px 0;
            border-radius: 5px;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎓 Congratulations!</h1>
        </div>
        <div class="content">
          <p>Dear <strong>${recipientName}</strong>,</p>
          
          <p>We are pleased to inform you that your certificate has been successfully generated and is now ready for download!</p>
          
          <div class="certificate-box">
            <h3 style="margin-top: 0; color: #667eea;">Certificate Details</h3>
            ${courseName ? `<p><strong>Course/Achievement:</strong> ${courseName}</p>` : ''}
            <p><strong>Certificate ID:</strong> ${certificateId}</p>
            <p><strong>Issue Date:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          
          <p>Your certificate is attached to this email as a PDF file. You can download it and share it on your professional profiles.</p>
          
          <p>Please keep this certificate safe for your records. The Certificate ID can be used for verification purposes.</p>
          
          <p style="margin-top: 30px;">Best regards,<br>
          <strong>Certificate Management Team</strong></p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply to this message.</p>
          <p>&copy; ${new Date().getFullYear()} Certificate Management System. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;
  }

  async sendWelcomeEmail(email, name) {
    try {
      // Check if transporter is available
      if (!this.transporter) {
        console.warn('Email transporter not configured. Skipping welcome email.');
        return { success: false, error: 'Email service not configured' };
      }

      const mailOptions = {
        from: `"Certificate Management System" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Welcome to Certificate Management System',
        html: `
          <h2>Welcome ${name}!</h2>
          <p>Thank you for registering with our Certificate Management System.</p>
          <p>You can now log in and access your certificates.</p>
          <p>Best regards,<br>Certificate Management Team</p>
        `
      };

      await this.transporter.sendMail(mailOptions);
      console.log('✅ Welcome email sent to:', email);
      return { success: true };
    } catch (error) {
      console.error('❌ Error sending welcome email:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
