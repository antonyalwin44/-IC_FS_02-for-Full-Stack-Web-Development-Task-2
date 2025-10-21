# 📡 API Documentation - Certificate Management System

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### Register User
**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user" // or "admin"
}
```

**Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Validation:**
- `name`: Required, non-empty string
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters
- `role`: Optional, defaults to "user"

---

### Login User
**POST** `/auth/login`

Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### Get Current User
**GET** `/auth/me`

Get the currently authenticated user's information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

## 📜 Certificate Endpoints

### Get All Certificates
**GET** `/certificates`

Get all certificates. Admins see all certificates, users see only their own.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "certificateId": "CERT-lx5y2z-ABC123",
      "recipientName": "Jane Smith",
      "recipientEmail": "jane@example.com",
      "userId": "64f1a2b3c4d5e6f7g8h9i0j2",
      "templateId": {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j3",
        "name": "Course Completion",
        "title": "Certificate of Completion"
      },
      "courseName": "Web Development Bootcamp",
      "issueDate": "2024-01-15T10:30:00.000Z",
      "emailSent": true,
      "emailSentAt": "2024-01-15T10:30:05.000Z",
      "issuedBy": {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j4",
        "name": "Admin User",
        "email": "admin@example.com"
      },
      "status": "issued",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Get My Certificates
**GET** `/certificates/my`

Get certificates for the currently authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "certificateId": "CERT-lx5y2z-ABC123",
      "recipientName": "Jane Smith",
      "courseName": "Web Development Bootcamp",
      "issueDate": "2024-01-15T10:30:00.000Z",
      "templateId": {
        "name": "Course Completion",
        "title": "Certificate of Completion"
      }
    }
  ]
}
```

---

### Get Single Certificate
**GET** `/certificates/:id`

Get details of a specific certificate.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "certificateId": "CERT-lx5y2z-ABC123",
    "recipientName": "Jane Smith",
    "recipientEmail": "jane@example.com",
    "courseName": "Web Development Bootcamp",
    "issueDate": "2024-01-15T10:30:00.000Z",
    "emailSent": true,
    "status": "issued",
    "templateId": { /* full template object */ },
    "issuedBy": { /* issuer details */ }
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Certificate not found"
}
```

---

### Create Certificate
**POST** `/certificates`

Issue a new certificate. **Admin only.**

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "recipientName": "Jane Smith",
  "recipientEmail": "jane@example.com",
  "templateId": "64f1a2b3c4d5e6f7g8h9i0j3",
  "courseName": "Web Development Bootcamp",
  "customFields": {
    "grade": "A+",
    "instructor": "John Doe"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "certificateId": "CERT-lx5y2z-ABC123",
    "recipientName": "Jane Smith",
    "recipientEmail": "jane@example.com",
    "courseName": "Web Development Bootcamp",
    "issueDate": "2024-01-15T10:30:00.000Z",
    "pdfPath": "/path/to/certificate.pdf",
    "emailSent": true,
    "status": "issued"
  },
  "emailSent": true
}
```

**Validation:**
- `recipientName`: Required, non-empty string
- `recipientEmail`: Required, valid email
- `templateId`: Required, valid template ID
- `courseName`: Optional string
- `customFields`: Optional object

---

### Download Certificate
**GET** `/certificates/:id/download`

Download a certificate as PDF.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
- Content-Type: `application/pdf`
- File download with name: `Certificate_<certificateId>.pdf`

---

### Revoke Certificate
**DELETE** `/certificates/:id`

Revoke a certificate. **Admin only.**

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Certificate revoked successfully"
}
```

---

## 📋 Template Endpoints

### Get All Templates
**GET** `/templates`

Get all active certificate templates.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j3",
      "name": "Course Completion",
      "description": "Template for course completion certificates",
      "title": "Certificate of Completion",
      "bodyText": "This is to certify that",
      "footerText": "Awarded on",
      "backgroundColor": "#ffffff",
      "textColor": "#000000",
      "borderColor": "#4F46E5",
      "organizationName": "Tech Academy",
      "signatoryName": "Dr. John Smith",
      "signatoryTitle": "Director",
      "isActive": true,
      "createdBy": {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j4",
        "name": "Admin User",
        "email": "admin@example.com"
      },
      "createdAt": "2024-01-10T08:00:00.000Z"
    }
  ]
}
```

---

### Get Single Template
**GET** `/templates/:id`

Get details of a specific template.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j3",
    "name": "Course Completion",
    "title": "Certificate of Completion",
    /* ... all template fields ... */
  }
}
```

---

### Create Template
**POST** `/templates`

Create a new certificate template. **Admin only.**

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Course Completion",
  "description": "Template for course completion certificates",
  "title": "Certificate of Completion",
  "bodyText": "This is to certify that",
  "footerText": "Awarded on",
  "backgroundColor": "#ffffff",
  "textColor": "#000000",
  "borderColor": "#4F46E5",
  "organizationName": "Tech Academy",
  "signatoryName": "Dr. John Smith",
  "signatoryTitle": "Director"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j3",
    "name": "Course Completion",
    /* ... all template fields ... */
  }
}
```

**Validation:**
- `name`: Required, non-empty string
- `title`: Required, non-empty string
- All other fields: Optional with defaults

---

### Update Template
**PUT** `/templates/:id`

Update an existing template. **Admin only.**

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Updated Template Name",
  "title": "Updated Certificate Title"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    /* updated template object */
  }
}
```

---

### Delete Template
**DELETE** `/templates/:id`

Soft delete a template (sets isActive to false). **Admin only.**

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Template deleted successfully"
}
```

---

## 📊 Analytics Endpoints

### Get System Statistics
**GET** `/analytics/stats`

Get system-wide statistics and analytics. **Admin only.**

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalCertificates": 150,
      "certificatesThisMonth": 25,
      "totalUsers": 50,
      "activeTemplates": 5,
      "emailDeliveryRate": "98.50%"
    },
    "recentCertificates": [
      /* last 5 certificates */
    ],
    "certificatesByMonth": [
      {
        "_id": { "year": 2024, "month": 1 },
        "count": 25
      }
    ],
    "certificatesByTemplate": [
      {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j3",
        "name": "Course Completion",
        "count": 75
      }
    ]
  }
}
```

---

### Get User Statistics
**GET** `/analytics/user-stats`

Get statistics for the current user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalCertificates": 5,
    "certificatesByMonth": [
      {
        "_id": { "year": 2024, "month": 1 },
        "count": 3
      }
    ]
  }
}
```

---

## 🏥 Health Check

### Health Check
**GET** `/health`

Check if the API is running.

**Response (200):**
```json
{
  "success": true,
  "message": "Certificate Management System API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## ⚠️ Error Responses

### Common Error Codes

**400 Bad Request**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

**401 Unauthorized**
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

**403 Forbidden**
```json
{
  "success": false,
  "message": "User role user is not authorized to access this route"
}
```

**404 Not Found**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "message": "Server error"
}
```

---

## 🔒 Authorization Levels

| Endpoint | Public | User | Admin |
|----------|--------|------|-------|
| POST /auth/register | ✅ | ✅ | ✅ |
| POST /auth/login | ✅ | ✅ | ✅ |
| GET /auth/me | ❌ | ✅ | ✅ |
| GET /certificates | ❌ | ✅* | ✅ |
| GET /certificates/my | ❌ | ✅ | ✅ |
| POST /certificates | ❌ | ❌ | ✅ |
| GET /certificates/:id/download | ❌ | ✅* | ✅ |
| DELETE /certificates/:id | ❌ | ❌ | ✅ |
| GET /templates | ❌ | ✅ | ✅ |
| POST /templates | ❌ | ❌ | ✅ |
| PUT /templates/:id | ❌ | ❌ | ✅ |
| DELETE /templates/:id | ❌ | ❌ | ✅ |
| GET /analytics/stats | ❌ | ❌ | ✅ |
| GET /analytics/user-stats | ❌ | ✅ | ✅ |

*Users can only access their own certificates

---

## 📝 Rate Limiting

Currently, there is no rate limiting implemented. For production use, consider implementing rate limiting to prevent abuse.

**Recommended limits:**
- Authentication endpoints: 5 requests per minute
- Certificate creation: 10 requests per minute
- Other endpoints: 100 requests per minute

---

## 🧪 Testing with cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "admin"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Certificates (with token)
```bash
curl -X GET http://localhost:5000/api/certificates \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Certificate
```bash
curl -X POST http://localhost:5000/api/certificates \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "recipientName": "Jane Doe",
    "recipientEmail": "jane@example.com",
    "templateId": "TEMPLATE_ID_HERE",
    "courseName": "Web Development"
  }'
```

---

## 🔗 Postman Collection

You can import these endpoints into Postman for easier testing. Create a new collection and add the endpoints with the appropriate headers and request bodies.

**Environment Variables:**
- `base_url`: http://localhost:5000/api
- `token`: Your JWT token after login

---

**Happy API Testing!** 🚀
