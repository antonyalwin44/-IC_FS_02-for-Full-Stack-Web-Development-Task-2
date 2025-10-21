# Changelog

## [Latest Updates] - 2025-10-21

### Added
- ✅ **Delete Certificate Feature**: Added delete icon (trash) next to email icon in certificates table
  - Delete button appears in the Actions column for all certificates
  - Confirmation dialog before deletion
  - Red hover effect to indicate danger action
  - Success/error messages after deletion

### Fixed
- ✅ **Email Service Configuration**: Fixed "Failed to send email" error
  - Added proper Gmail SMTP configuration with TLS support
  - Added email transporter verification on startup
  - Added better error handling and logging
  - Added checks for missing email credentials
  - Added PDF file existence validation before sending

### Improved
- Email service now shows clear status messages on server startup
- Better error messages for email failures
- Non-blocking email sending (certificate creation succeeds even if email fails)

## Features

### Certificate Management
- **Download**: Download certificate as PDF
- **Resend Email**: Resend certificate email (only shown if email not sent)
- **Delete**: Delete/revoke certificate with confirmation

### Email Configuration
- Supports Gmail, Outlook, Yahoo, and custom SMTP servers
- Requires App Password for Gmail (2FA required)
- Automatic verification on server startup
- Graceful degradation if email not configured

## Files Modified

### Frontend
- `client/src/pages/AdminDashboard.js`
  - Added `handleDeleteCertificate` function
  - Added delete button with Trash2 icon in certificates table
  
- `client/src/pages/Dashboard.css`
  - Added `.btn-icon.btn-danger:hover` styling for delete button

### Backend
- `server/services/emailService.js`
  - Enhanced email transporter configuration
  - Added TLS/SSL support
  - Added verification on startup
  - Added better error handling
  - Added PDF existence check

### Documentation
- `EMAIL_CONFIGURATION_GUIDE.md` - Complete email setup guide
- `EMAIL_SETUP_GUIDE.md` - Quick setup reference
- `CHANGELOG.md` - This file

## Usage

### Deleting a Certificate
1. Navigate to Admin Dashboard → Certificates tab
2. Find the certificate you want to delete
3. Click the trash icon (🗑️) in the Actions column
4. Confirm the deletion in the dialog
5. Certificate will be marked as revoked and removed from the list

### Configuring Email
1. Follow the guide in `EMAIL_CONFIGURATION_GUIDE.md`
2. Generate Gmail App Password
3. Update `.env` file with credentials
4. Restart server
5. Look for "✅ Email service is ready" message

## API Endpoints

### Certificates
- `DELETE /api/certificates/:id` - Delete/revoke certificate (Admin only)
- `POST /api/certificates/:id/resend-email` - Resend certificate email (Admin only)
- `GET /api/certificates/:id/download` - Download certificate PDF

## Security Notes
- Delete action requires admin role
- Confirmation dialog prevents accidental deletion
- Deleted certificates are marked as "revoked" in database
- Email credentials stored securely in `.env` file (not in version control)
