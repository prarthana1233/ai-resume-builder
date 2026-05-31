# API Documentation

This document describes the API structure currently implemented as mock functions. Use this as a reference when building the real backend.

## Base URL
```
Production: https://api.resumeai.com/v1
Development: http://localhost:3000/api/v1
```

## Authentication

All protected endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe",
    "resumes": []
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe",
    "resumes": []
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST /auth/google
Login with Google OAuth.

**Request Body:**
```json
{
  "idToken": "google-oauth-token"
}
```

**Response:** Same as login

### GET /auth/me
Get current authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "user-123",
  "email": "user@example.com",
  "name": "John Doe",
  "resumes": []
}
```

### POST /auth/logout
Logout current user (invalidate token).

---

## Resume Endpoints

### GET /resumes
Get all resumes for authenticated user.

**Response:**
```json
[
  {
    "id": "resume-123",
    "personalInfo": {
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "+1 555-1234",
      "linkedIn": "linkedin.com/in/johndoe",
      "github": "github.com/johndoe",
      "portfolio": "johndoe.com",
      "location": "San Francisco, CA"
    },
    "summary": "Professional summary...",
    "education": [...],
    "experience": [...],
    "projects": [...],
    "skills": ["JavaScript", "React", "Node.js"],
    "certifications": [...],
    "achievements": [...],
    "languages": ["English", "Spanish"],
    "hobbies": ["Photography"],
    "template": "classic",
    "atsScore": 85,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T00:00:00Z"
  }
]
```

### GET /resumes/:id
Get specific resume by ID.

**Response:** Single resume object (same structure as above)

### POST /resumes
Create a new resume.

**Request Body:**
```json
{
  "personalInfo": { ... },
  "summary": "...",
  "education": [...],
  "experience": [...],
  "projects": [...],
  "skills": [...],
  "certifications": [...],
  "achievements": [...],
  "languages": [...],
  "hobbies": [...],
  "template": "classic"
}
```

**Response:** Created resume object

### PUT /resumes/:id
Update existing resume.

**Request Body:** Same as POST /resumes

**Response:** Updated resume object

### DELETE /resumes/:id
Delete a resume.

**Response:**
```json
{
  "message": "Resume deleted successfully"
}
```

---

## AI Endpoints

### POST /ai/chat
Send message to AI chatbot.

**Request Body:**
```json
{
  "message": "My name is John Doe",
  "conversationHistory": [
    {
      "role": "assistant",
      "content": "Hello! What's your name?"
    }
  ]
}
```

**Response:**
```json
{
  "message": "Great to meet you, John! What's your email address?",
  "extractedData": {
    "personalInfo": {
      "fullName": "John Doe"
    }
  }
}
```

### POST /ai/enhance
Enhance resume content with AI.

**Request Body:**
```json
{
  "content": "Worked on website",
  "context": "experience description"
}
```

**Response:**
```json
{
  "enhanced": "Developed and maintained responsive web applications, improving user experience and site performance"
}
```

### POST /ai/generate-summary
Generate professional summary.

**Request Body:**
```json
{
  "resumeData": {
    "experience": [...],
    "education": [...],
    "skills": [...]
  }
}
```

**Response:**
```json
{
  "summary": "Results-driven software engineer with 5+ years of experience..."
}
```

### POST /ai/optimize-job
Optimize resume for specific job.

**Request Body:**
```json
{
  "resume": { ... },
  "jobDescription": "We are looking for a senior software engineer...",
  "jobTitle": "Senior Software Engineer",
  "company": "Tech Corp"
}
```

**Response:**
```json
{
  "optimizedResume": { ... },
  "suggestions": [
    "Add keywords: microservices, Docker, Kubernetes",
    "Emphasize cloud experience in AWS",
    "Quantify achievements with metrics"
  ]
}
```

### POST /ai/calculate-ats-score
Calculate ATS compatibility score.

**Request Body:**
```json
{
  "resume": { ... }
}
```

**Response:**
```json
{
  "score": 85,
  "breakdown": {
    "formatting": 20,
    "keywords": 18,
    "sections": 20,
    "content": 17,
    "completeness": 10
  },
  "suggestions": [
    "Add more technical keywords",
    "Include measurable achievements",
    "Add certifications section"
  ]
}
```

### POST /ai/generate-cover-letter
Generate cover letter.

**Request Body:**
```json
{
  "resume": { ... },
  "jobTitle": "Software Engineer",
  "company": "Tech Corp",
  "jobDescription": "..."
}
```

**Response:**
```json
{
  "coverLetter": "Dear Hiring Manager,\n\nI am writing to express..."
}
```

---

## File Upload Endpoints

### POST /upload/resume
Upload and parse resume file.

**Request:**
```
Content-Type: multipart/form-data

file: <PDF or DOCX file>
```

**Response:**
```json
{
  "parsedData": {
    "personalInfo": { ... },
    "experience": [...],
    "education": [...],
    "skills": [...]
  },
  "confidence": 0.92
}
```

### POST /upload/asset
Upload image or document.

**Request:**
```
Content-Type: multipart/form-data

file: <image file>
type: "profile" | "project" | "certification"
```

**Response:**
```json
{
  "url": "https://cdn.resumeai.com/uploads/file-123.jpg",
  "id": "asset-123"
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Invalid request",
  "message": "Email is required",
  "code": "VALIDATION_ERROR"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token",
  "code": "AUTH_ERROR"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "You don't have permission to access this resource",
  "code": "PERMISSION_ERROR"
}
```

### 404 Not Found
```json
{
  "error": "Not found",
  "message": "Resume not found",
  "code": "NOT_FOUND"
}
```

### 429 Too Many Requests
```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests, please try again later",
  "retryAfter": 60
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred",
  "code": "INTERNAL_ERROR"
}
```

---

## Data Models

### User
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  password: string; // hashed
  googleId?: string;
  resumes: string[]; // Resume IDs
  createdAt: Date;
  updatedAt: Date;
}
```

### Resume
```typescript
interface Resume {
  id: string;
  userId: string;
  personalInfo: PersonalInfo;
  summary?: string;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: string[];
  certifications: Certification[];
  achievements: string[];
  languages: string[];
  hobbies: string[];
  template: string;
  atsScore?: number;
  createdAt: Date;
  updatedAt: Date;
}
```

See `src/app/types/resume.ts` for complete TypeScript interfaces.

---

## Rate Limits

- Auth endpoints: 10 requests per minute per IP
- Resume CRUD: 100 requests per minute per user
- AI endpoints: 20 requests per minute per user
- File uploads: 10 requests per minute per user

---

## Webhooks (Optional)

### resume.created
Triggered when a new resume is created.

```json
{
  "event": "resume.created",
  "userId": "user-123",
  "resumeId": "resume-456",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### resume.updated
Triggered when a resume is updated.

### resume.deleted
Triggered when a resume is deleted.

---

## WebSocket Events (Optional)

For real-time AI chat experience:

```javascript
// Connect
socket.emit('chat:join', { resumeId: 'resume-123' });

// Send message
socket.emit('chat:message', { 
  message: 'Tell me about your experience',
  conversationId: 'conv-123'
});

// Receive response
socket.on('chat:response', (data) => {
  console.log(data.message);
});
```

---

## Implementation Notes

### Security
- Use bcrypt for password hashing (cost factor 12)
- Implement JWT with short expiration (15 min) + refresh tokens
- Use rate limiting middleware (express-rate-limit)
- Validate all inputs with Joi or Zod
- Sanitize user inputs to prevent XSS
- Use parameterized queries to prevent SQL injection
- Implement CORS with whitelist

### File Upload
- Use Multer for file handling
- Implement file type validation
- Limit file size (10MB for resumes)
- Scan files for malware
- Store in cloud storage (AWS S3, Cloudinary)
- Generate unique filenames

### AI Integration
- Use OpenAI GPT-4 or Claude API
- Implement prompt engineering for best results
- Cache common AI responses
- Implement fallback for API failures
- Monitor API costs

### Database
- Use MongoDB with Mongoose ODM
- Implement proper indexing for queries
- Use transactions for critical operations
- Implement soft deletes for resumes
- Regular backups

### Performance
- Implement Redis caching for common queries
- Use pagination for list endpoints
- Compress responses with gzip
- Use CDN for static assets
- Implement database connection pooling

---

## Testing

Each endpoint should have:
- Unit tests for business logic
- Integration tests for API endpoints
- End-to-end tests for critical flows
- Load testing for performance
- Security testing for vulnerabilities

Example test structure:
```javascript
describe('POST /auth/register', () => {
  it('should create a new user with valid data', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User'
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
  });

  it('should return 400 with invalid email', async () => {
    // Test implementation
  });
});
```

---

## Monitoring & Logging

Implement logging for:
- All API requests/responses
- Authentication attempts
- Error occurrences
- AI API usage and costs
- File uploads
- Database queries

Use structured logging (JSON format) and integrate with services like:
- Sentry for error tracking
- LogRocket for user session replay
- AWS CloudWatch or Datadog for metrics
