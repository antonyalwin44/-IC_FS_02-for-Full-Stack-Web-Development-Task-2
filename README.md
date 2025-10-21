# 💼 Certificate Management System

A robust, full-stack Certificate Management System that automates the generation and delivery of digital certificates with secure authentication, role-based access control, and automated email delivery.

## ✨ Features

- 🔐 **Secure Authentication**: JWT-based authentication with role-based access control
- 📄 **Dynamic PDF Generation**: Automated certificate generation with customizable templates
- 📧 **Email Automation**: Automatic email delivery of certificates using Nodemailer
- 👨‍💼 **Admin Dashboard**: Manage templates, issue certificates, and view analytics
- 👤 **User Dashboard**: View and download personal certificates
- 📊 **Analytics**: Track certificate issuance trends and email delivery stats
- 🎨 **Modern UI**: Responsive design with beautiful user interface

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router for navigation
- Axios for API calls
- Recharts for analytics visualization
- Lucide React for icons

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- PDFKit for PDF generation
- Nodemailer for email delivery

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd certificate-management-system
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your configuration:
   - MongoDB connection string
   - JWT secret key
   - Email service credentials (Gmail App Password recommended)

4. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on your system
   mongod
   ```

5. **Run the application**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend React app on `http://localhost:3000`

## 📧 Email Configuration

For Gmail:
1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password: Google Account → Security → App Passwords
3. Use the generated password in your `.env` file

## 👥 Default Users

After first run, you can register as admin or user:
- Admin users can create templates and issue certificates
- Regular users can view and download their certificates

## 📁 Project Structure

```
certificate-management-system/
├── server/
│   ├── config/          # Database and configuration
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication middleware
│   ├── services/        # PDF and Email services
│   └── index.js         # Server entry point
├── client/
│   ├── public/
│   └── src/
│       ├── components/  # React components
│       ├── pages/       # Page components
│       ├── services/    # API services
│       ├── context/     # Auth context
│       └── App.js       # Main app component
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Certificates
- `GET /api/certificates` - Get all certificates (Admin)
- `GET /api/certificates/my` - Get user's certificates
- `POST /api/certificates` - Create new certificate (Admin)
- `GET /api/certificates/:id/download` - Download certificate

### Templates
- `GET /api/templates` - Get all templates
- `POST /api/templates` - Create template (Admin)
- `PUT /api/templates/:id` - Update template (Admin)
- `DELETE /api/templates/:id` - Delete template (Admin)

### Analytics
- `GET /api/analytics/stats` - Get system statistics (Admin)

## 🎨 Features in Detail

### Certificate Generation
- Customizable templates with dynamic fields
- Professional PDF output with company branding
- Unique certificate IDs for verification

### Email Delivery
- Automated email sending upon certificate creation
- Professional email templates
- Attachment of PDF certificates

### Admin Dashboard
- Create and manage certificate templates
- Issue certificates to users
- View analytics and statistics
- Track email delivery status

### User Dashboard
- View all received certificates
- Download certificates as PDF
- Search and filter certificates

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based access control
- Protected API routes
- Input validation and sanitization

## 📊 Analytics

Track important metrics:
- Total certificates issued
- Email delivery success rate
- User registration trends
- Certificate issuance over time

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`

### Email Not Sending
- Verify email credentials
- Check if 2FA is enabled and App Password is used
- Ensure firewall allows SMTP connections

### Port Already in Use
- Change PORT in `.env` file
- Kill process using the port

## 📚 Documentation

This project includes comprehensive documentation:

- **[QUICKSTART.md](QUICKSTART.md)** - Get started in 5 minutes
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Detailed installation and configuration
- **[FEATURES.md](FEATURES.md)** - Complete feature documentation
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Full API reference
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture and design
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Complete project overview
- **[INDEX.md](INDEX.md)** - Documentation navigation guide
- **[PROJECT_STRUCTURE.txt](PROJECT_STRUCTURE.txt)** - File structure reference

## 🎯 Quick Links

- **New to the project?** Start with [QUICKSTART.md](QUICKSTART.md)
- **Need detailed setup help?** Read [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **Want to understand the system?** Check [ARCHITECTURE.md](ARCHITECTURE.md)
- **Looking for API docs?** See [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Need navigation help?** Visit [INDEX.md](INDEX.md)

## 📞 Support

For issues and questions:
- Check the [SETUP_GUIDE.md](SETUP_GUIDE.md) troubleshooting section
- Review the comprehensive documentation files
- Examine console logs for error messages
