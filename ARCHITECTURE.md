# 🏗️ System Architecture - Certificate Management System

## 📐 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    React Frontend                         │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐         │  │
│  │  │   Pages    │  │ Components │  │  Context   │         │  │
│  │  │  - Home    │  │  - Navbar  │  │  - Auth    │         │  │
│  │  │  - Login   │  │  - Private │  │            │         │  │
│  │  │  - Dashboard│  │   Route   │  │            │         │  │
│  │  └────────────┘  └────────────┘  └────────────┘         │  │
│  │                                                            │  │
│  │  ┌────────────────────────────────────────────┐          │  │
│  │  │         Services (API Layer)                │          │  │
│  │  │  - Axios HTTP Client                        │          │  │
│  │  │  - API Endpoints Configuration              │          │  │
│  │  └────────────────────────────────────────────┘          │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↕ HTTP/HTTPS
┌─────────────────────────────────────────────────────────────────┐
│                         SERVER LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  Express.js Backend                       │  │
│  │                                                            │  │
│  │  ┌────────────────────────────────────────────┐          │  │
│  │  │            Middleware Layer                 │          │  │
│  │  │  - CORS                                     │          │  │
│  │  │  - Body Parser                              │          │  │
│  │  │  - Authentication (JWT)                     │          │  │
│  │  │  - Authorization (Role-based)               │          │  │
│  │  └────────────────────────────────────────────┘          │  │
│  │                                                            │  │
│  │  ┌────────────────────────────────────────────┐          │  │
│  │  │              Routes Layer                   │          │  │
│  │  │  - /api/auth      (Authentication)          │          │  │
│  │  │  - /api/certificates (Certificates)         │          │  │
│  │  │  - /api/templates (Templates)               │          │  │
│  │  │  - /api/analytics (Analytics)               │          │  │
│  │  └────────────────────────────────────────────┘          │  │
│  │                                                            │  │
│  │  ┌────────────────────────────────────────────┐          │  │
│  │  │            Services Layer                   │          │  │
│  │  │  ┌──────────────┐  ┌──────────────┐        │          │  │
│  │  │  │ PDF Service  │  │Email Service │        │          │  │
│  │  │  │  - PDFKit    │  │  - Nodemailer│        │          │  │
│  │  │  │  - Generate  │  │  - Send Email│        │          │  │
│  │  │  │  - Save PDF  │  │  - Templates │        │          │  │
│  │  │  └──────────────┘  └──────────────┘        │          │  │
│  │  └────────────────────────────────────────────┘          │  │
│  │                                                            │  │
│  │  ┌────────────────────────────────────────────┐          │  │
│  │  │             Models Layer                    │          │  │
│  │  │  - User Model (Mongoose Schema)             │          │  │
│  │  │  - Certificate Model (Mongoose Schema)      │          │  │
│  │  │  - Template Model (Mongoose Schema)         │          │  │
│  │  └────────────────────────────────────────────┘          │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↕ Mongoose ODM
┌─────────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    MongoDB Database                       │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │  │
│  │  │    Users     │  │ Certificates │  │  Templates   │   │  │
│  │  │  Collection  │  │  Collection  │  │  Collection  │   │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                           │
│  ┌──────────────────┐              ┌──────────────────┐         │
│  │  Email Service   │              │  File System     │         │
│  │  (SMTP Server)   │              │  (PDF Storage)   │         │
│  │  - Gmail         │              │  /certificates/  │         │
│  │  - SendGrid      │              │                  │         │
│  └──────────────────┘              └──────────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Diagrams

### 1. User Registration Flow

```
┌──────────┐
│  User    │
└────┬─────┘
     │ 1. Submit registration form
     ↓
┌────────────────┐
│ React Frontend │
└────┬───────────┘
     │ 2. POST /api/auth/register
     ↓
┌────────────────┐
│ Express Server │
└────┬───────────┘
     │ 3. Validate input
     ↓
┌────────────────┐
│ User Model     │
└────┬───────────┘
     │ 4. Hash password (bcrypt)
     │ 5. Save to database
     ↓
┌────────────────┐
│ MongoDB        │
└────┬───────────┘
     │ 6. Return user data
     ↓
┌────────────────┐
│ Express Server │
└────┬───────────┘
     │ 7. Generate JWT token
     │ 8. Send response
     ↓
┌────────────────┐
│ React Frontend │
└────┬───────────┘
     │ 9. Store token in localStorage
     │ 10. Redirect to dashboard
     ↓
┌──────────┐
│  User    │
└──────────┘
```

### 2. Certificate Issuance Flow

```
┌──────────┐
│  Admin   │
└────┬─────┘
     │ 1. Fill certificate form
     ↓
┌────────────────┐
│ Admin Dashboard│
└────┬───────────┘
     │ 2. POST /api/certificates
     ↓
┌────────────────┐
│ Express Server │
└────┬───────────┘
     │ 3. Verify admin role
     │ 4. Validate input
     ↓
┌────────────────┐
│Certificate Model│
└────┬───────────┘
     │ 5. Generate unique ID
     │ 6. Save to database
     ↓
┌────────────────┐
│ MongoDB        │
└────┬───────────┘
     │ 7. Certificate saved
     ↓
┌────────────────┐
│  PDF Service   │
└────┬───────────┘
     │ 8. Fetch template
     │ 9. Generate PDF
     │ 10. Save to /certificates/
     ↓
┌────────────────┐
│  File System   │
└────┬───────────┘
     │ 11. PDF saved
     ↓
┌────────────────┐
│ Email Service  │
└────┬───────────┘
     │ 12. Create email with PDF
     │ 13. Send via SMTP
     ↓
┌────────────────┐
│  SMTP Server   │
└────┬───────────┘
     │ 14. Email delivered
     ↓
┌────────────────┐
│  Recipient     │
└────────────────┘
```

### 3. Authentication Flow

```
┌──────────┐
│  User    │
└────┬─────┘
     │ 1. Login with credentials
     ↓
┌────────────────┐
│ Login Page     │
└────┬───────────┘
     │ 2. POST /api/auth/login
     ↓
┌────────────────┐
│ Auth Route     │
└────┬───────────┘
     │ 3. Find user by email
     ↓
┌────────────────┐
│ User Model     │
└────┬───────────┘
     │ 4. Compare password (bcrypt)
     ↓
┌────────────────┐
│ Auth Route     │
└────┬───────────┘
     │ 5. Generate JWT token
     │ 6. Return token + user data
     ↓
┌────────────────┐
│ Auth Context   │
└────┬───────────┘
     │ 7. Store token in localStorage
     │ 8. Set user in context
     │ 9. Add token to axios headers
     ↓
┌────────────────┐
│ Protected Route│
└────┬───────────┘
     │ 10. Verify token on each request
     ↓
┌────────────────┐
│  Dashboard     │
└────────────────┘
```

---

## 🗄️ Database Schema Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                         USERS                                │
│  ┌────────────────────────────────────────────────────┐     │
│  │ _id (ObjectId)                                     │     │
│  │ name (String)                                      │     │
│  │ email (String, unique, indexed)                    │     │
│  │ password (String, hashed)                          │     │
│  │ role (String: 'user' | 'admin')                    │     │
│  │ createdAt (Date)                                   │     │
│  └────────────────────────────────────────────────────┘     │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ Referenced by
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ↓               ↓               ↓
┌───────────────┐ ┌──────────────┐ ┌──────────────┐
│ CERTIFICATES  │ │  TEMPLATES   │ │ CERTIFICATES │
│  (userId)     │ │ (createdBy)  │ │ (issuedBy)   │
└───────────────┘ └──────────────┘ └──────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      TEMPLATES                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │ _id (ObjectId)                                     │     │
│  │ name (String)                                      │     │
│  │ description (String)                               │     │
│  │ title (String)                                     │     │
│  │ bodyText (String)                                  │     │
│  │ footerText (String)                                │     │
│  │ backgroundColor (String)                           │     │
│  │ textColor (String)                                 │     │
│  │ borderColor (String)                               │     │
│  │ organizationName (String)                          │     │
│  │ signatoryName (String)                             │     │
│  │ signatoryTitle (String)                            │     │
│  │ isActive (Boolean)                                 │     │
│  │ createdBy (ObjectId → Users)                       │     │
│  │ createdAt (Date)                                   │     │
│  └────────────────────────────────────────────────────┘     │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ Referenced by
                        │
                        ↓
                ┌──────────────┐
                │ CERTIFICATES │
                │ (templateId) │
                └──────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     CERTIFICATES                             │
│  ┌────────────────────────────────────────────────────┐     │
│  │ _id (ObjectId)                                     │     │
│  │ certificateId (String, unique, auto-generated)     │     │
│  │ recipientName (String)                             │     │
│  │ recipientEmail (String)                            │     │
│  │ userId (ObjectId → Users, optional)                │     │
│  │ templateId (ObjectId → Templates)                  │     │
│  │ courseName (String)                                │     │
│  │ issueDate (Date)                                   │     │
│  │ customFields (Map<String, String>)                 │     │
│  │ pdfPath (String)                                   │     │
│  │ emailSent (Boolean)                                │     │
│  │ emailSentAt (Date)                                 │     │
│  │ issuedBy (ObjectId → Users)                        │     │
│  │ status (String: 'pending'|'issued'|'revoked')      │     │
│  │ createdAt (Date)                                   │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                           │
│                                                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │         Layer 1: Frontend Security                 │     │
│  │  - Input validation                                │     │
│  │  - XSS prevention (React)                          │     │
│  │  - Route protection (PrivateRoute)                 │     │
│  │  - Token storage (localStorage)                    │     │
│  └────────────────────────────────────────────────────┘     │
│                          ↓                                    │
│  ┌────────────────────────────────────────────────────┐     │
│  │         Layer 2: Network Security                  │     │
│  │  - HTTPS (production)                              │     │
│  │  - CORS configuration                              │     │
│  │  - Secure headers                                  │     │
│  └────────────────────────────────────────────────────┘     │
│                          ↓                                    │
│  ┌────────────────────────────────────────────────────┐     │
│  │         Layer 3: API Security                      │     │
│  │  - JWT token verification                          │     │
│  │  - Role-based authorization                        │     │
│  │  - Input validation (express-validator)            │     │
│  │  - Request sanitization                            │     │
│  └────────────────────────────────────────────────────┘     │
│                          ↓                                    │
│  ┌────────────────────────────────────────────────────┐     │
│  │         Layer 4: Data Security                     │     │
│  │  - Password hashing (bcrypt)                       │     │
│  │  - Secure password storage                         │     │
│  │  - MongoDB injection prevention                    │     │
│  └────────────────────────────────────────────────────┘     │
│                          ↓                                    │
│  ┌────────────────────────────────────────────────────┐     │
│  │         Layer 5: Database Security                 │     │
│  │  - Mongoose schema validation                      │     │
│  │  - Indexed fields for performance                  │     │
│  │  - Secure connection string                        │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔌 API Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      REST API STRUCTURE                      │
│                                                               │
│  /api                                                         │
│   │                                                           │
│   ├── /auth                                                   │
│   │    ├── POST   /register    (Public)                      │
│   │    ├── POST   /login        (Public)                     │
│   │    └── GET    /me           (Protected)                  │
│   │                                                           │
│   ├── /certificates                                           │
│   │    ├── GET    /             (Protected)                  │
│   │    ├── GET    /my           (Protected)                  │
│   │    ├── GET    /:id          (Protected)                  │
│   │    ├── POST   /             (Protected, Admin)           │
│   │    ├── GET    /:id/download (Protected)                  │
│   │    └── DELETE /:id          (Protected, Admin)           │
│   │                                                           │
│   ├── /templates                                              │
│   │    ├── GET    /             (Protected)                  │
│   │    ├── GET    /:id          (Protected)                  │
│   │    ├── POST   /             (Protected, Admin)           │
│   │    ├── PUT    /:id          (Protected, Admin)           │
│   │    └── DELETE /:id          (Protected, Admin)           │
│   │                                                           │
│   └── /analytics                                              │
│        ├── GET    /stats        (Protected, Admin)           │
│        └── GET    /user-stats   (Protected)                  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Frontend Component Hierarchy

```
App
│
├── AuthProvider (Context)
│   │
│   └── Router
│       │
│       ├── Navbar
│       │
│       └── Routes
│           │
│           ├── Home
│           │   └── (Landing page with features)
│           │
│           ├── Login
│           │   └── (Login form)
│           │
│           ├── Register
│           │   └── (Registration form)
│           │
│           └── PrivateRoute
│               │
│               └── Dashboard
│                   │
│                   ├── AdminDashboard (if admin)
│                   │   ├── Overview Tab
│                   │   │   ├── Stats Cards
│                   │   │   └── Charts
│                   │   ├── Certificates Tab
│                   │   │   ├── Data Table
│                   │   │   └── Issue Modal
│                   │   └── Templates Tab
│                   │       ├── Template Cards
│                   │       └── Create Modal
│                   │
│                   └── UserDashboard (if user)
│                       ├── Search Bar
│                       └── Certificate Cards
```

---

## 📦 Module Dependencies

```
Backend Dependencies:
┌─────────────────┐
│   Express.js    │ ← Web framework
└────────┬────────┘
         │
    ┌────┴────┬────────────┬──────────┬──────────┐
    ↓         ↓            ↓          ↓          ↓
┌────────┐ ┌──────┐ ┌──────────┐ ┌────────┐ ┌──────────┐
│Mongoose│ │ JWT  │ │ bcryptjs │ │PDFKit  │ │Nodemailer│
└────────┘ └──────┘ └──────────┘ └────────┘ └──────────┘
    │         │          │            │           │
    ↓         ↓          ↓            ↓           ↓
┌────────┐ ┌──────┐ ┌──────────┐ ┌────────┐ ┌──────────┐
│MongoDB │ │Token │ │Password  │ │PDF Gen │ │Email Send│
└────────┘ └──────┘ └──────────┘ └────────┘ └──────────┘

Frontend Dependencies:
┌─────────────────┐
│     React       │ ← UI framework
└────────┬────────┘
         │
    ┌────┴────┬────────────┬──────────┬──────────┐
    ↓         ↓            ↓          ↓          ↓
┌────────┐ ┌──────┐ ┌──────────┐ ┌────────┐ ┌──────────┐
│Router  │ │Axios │ │Recharts  │ │Lucide  │ │Context   │
└────────┘ └──────┘ └──────────┘ └────────┘ └──────────┘
    │         │          │            │           │
    ↓         ↓          ↓            ↓           ↓
┌────────┐ ┌──────┐ ┌──────────┐ ┌────────┐ ┌──────────┐
│Routing │ │HTTP  │ │Charts    │ │Icons   │ │State Mgmt│
└────────┘ └──────┘ └──────────┘ └────────┘ └──────────┘
```

---

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCTION DEPLOYMENT                     │
│                                                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │              CDN / Edge Network                    │     │
│  │              (CloudFlare, AWS CloudFront)          │     │
│  └───────────────────┬────────────────────────────────┘     │
│                      │                                        │
│         ┌────────────┴────────────┐                          │
│         ↓                         ↓                          │
│  ┌──────────────┐         ┌──────────────┐                  │
│  │   Frontend   │         │   Backend    │                  │
│  │   (Vercel/   │         │  (Heroku/    │                  │
│  │   Netlify)   │         │  DigitalOcean)│                 │
│  └──────────────┘         └──────┬───────┘                  │
│                                   │                          │
│                          ┌────────┴────────┐                 │
│                          ↓                 ↓                 │
│                   ┌──────────────┐  ┌──────────────┐        │
│                   │   MongoDB    │  │Email Service │        │
│                   │    Atlas     │  │  (SendGrid)  │        │
│                   └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Performance Optimization

```
┌─────────────────────────────────────────────────────────────┐
│                  OPTIMIZATION STRATEGIES                     │
│                                                               │
│  Frontend:                                                    │
│  ┌────────────────────────────────────────────────────┐     │
│  │ • Code splitting (lazy loading)                    │     │
│  │ • Component memoization                            │     │
│  │ • Optimized re-renders                             │     │
│  │ • Asset compression                                │     │
│  │ • Browser caching                                  │     │
│  └────────────────────────────────────────────────────┘     │
│                                                               │
│  Backend:                                                     │
│  ┌────────────────────────────────────────────────────┐     │
│  │ • Database indexing                                │     │
│  │ • Query optimization                               │     │
│  │ • Async/await patterns                             │     │
│  │ • Connection pooling                               │     │
│  │ • Response compression                             │     │
│  └────────────────────────────────────────────────────┘     │
│                                                               │
│  Database:                                                    │
│  ┌────────────────────────────────────────────────────┐     │
│  │ • Indexed fields (email, certificateId)            │     │
│  │ • Efficient queries                                │     │
│  │ • Pagination support                               │     │
│  │ • Aggregation pipelines                            │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

This architecture provides a **scalable**, **maintainable**, and **secure** foundation for the Certificate Management System! 🏗️✨
