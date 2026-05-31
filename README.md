# ResumeAI - AI-Powered Resume Builder

A comprehensive full-stack web application for creating professional, ATS-friendly resumes with AI assistance. Built with React, TypeScript, and Tailwind CSS.

## Features

### 🎯 Core Features

- **AI-Powered Resume Builder** - Interactive chatbot that guides users through resume creation
- **Smart Resume Parser** - Upload existing resumes (PDF/DOCX) and extract information automatically
- **ATS-Friendly Templates** - Professional black-and-white single-page resume templates optimized for Applicant Tracking Systems
- **Multi-Format Export** - Download resumes as PDF or print-ready formats
- **User Dashboard** - Manage multiple resumes with edit, delete, and preview capabilities
- **Real-time Preview** - See your resume as you build it
- **Responsive Design** - Works seamlessly on desktop and mobile devices

### 📝 Resume Sections Supported

- Personal Information (Name, Email, Phone, LinkedIn, GitHub, Portfolio)
- Professional Summary
- Work Experience with detailed descriptions
- Education with GPA and achievements
- Projects with technologies and links
- Technical Skills
- Certifications
- Achievements
- Languages
- Hobbies & Interests

### 🤖 AI Features (Mock Implementation)

- AI-enhanced content suggestions
- Grammar and clarity optimization
- ATS score calculation
- Resume optimization for specific job descriptions
- Cover letter generation
- Interview question preparation

### 🔐 Authentication

- Email/Password registration and login
- Google OAuth integration (mock)
- Protected routes and user sessions
- Password recovery functionality

## Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **React Router 7** - Navigation
- **React Hook Form** - Form management
- **Sonner** - Toast notifications
- **Lucide React** - Icons
- **React Dropzone** - File uploads
- **@react-pdf/renderer** - PDF generation
- **date-fns** - Date formatting

### Backend (Mock)
The application currently uses mock API calls for demonstration. In production, you would connect to:
- Node.js + Express.js server
- MongoDB database
- JWT authentication
- OpenAI/Claude API for AI features

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── LandingPage.tsx          # Marketing landing page
│   │   ├── Login.tsx                # Login form
│   │   ├── Register.tsx             # Registration form
│   │   ├── Dashboard.tsx            # User dashboard
│   │   ├── AIChatbot.tsx            # AI chatbot interface
│   │   ├── ResumeBuilder.tsx        # Main resume editor
│   │   ├── ResumeUpload.tsx         # Resume upload and parsing
│   │   ├── ResumePreview.tsx        # Resume preview with templates
│   │   └── forms/
│   │       ├── PersonalInfoForm.tsx # Personal information form
│   │       ├── ExperienceForm.tsx   # Work experience form
│   │       ├── EducationForm.tsx    # Education form
│   │       ├── ProjectsForm.tsx     # Projects form
│   │       ├── SkillsForm.tsx       # Skills form
│   │       └── CertificationsForm.tsx # Certifications form
│   ├── context/
│   │   ├── AuthContext.tsx          # Authentication state management
│   │   └── ResumeContext.tsx        # Resume data management
│   ├── types/
│   │   └── resume.ts                # TypeScript interfaces
│   ├── utils/
│   │   └── mockApi.ts               # Mock API functions
│   └── App.tsx                      # Main app with routing
└── styles/
    ├── theme.css                    # Theme variables
    └── fonts.css                    # Font imports
```

## Installation

### Prerequisites
- Node.js 18+ or compatible runtime
- pnpm (recommended) or npm

### Setup

1. Clone the repository
```bash
git clone <repository-url>
cd resume-builder
```

2. Install dependencies
```bash
pnpm install
```

3. Start the development server
```bash
# The Vite dev server is already running in this environment
# Just access the preview URL
```

## Usage Guide

### Creating a Resume with AI Chatbot

1. Register or log in to your account
2. Click "AI Resume Builder" from the dashboard
3. Answer the chatbot's questions about your:
   - Personal information
   - Work experience
   - Education
   - Skills
   - Projects
4. Click "Continue to Editor" to customize further
5. Preview and export as PDF

### Building from Scratch

1. Click "Build from Scratch" from dashboard
2. Fill in each section using the sidebar navigation
3. Add multiple entries for experience, education, projects
4. Preview your resume in real-time
5. Export when ready

### Uploading Existing Resume

1. Click "Upload Existing" from dashboard
2. Drag and drop your PDF or DOCX file
3. Review extracted information
4. Edit and enhance with AI
5. Apply professional templates

### Exporting Your Resume

1. Click "Preview" in the resume builder
2. Review the formatted resume
3. Click "Print / Save as PDF"
4. Use browser's print dialog (Ctrl/Cmd+P)
5. Select "Save as PDF" as destination
6. Download your professional resume

## Key Features Explained

### ATS-Friendly Design

- Clean, single-column layout
- Standard section headings
- No images, graphics, or complex formatting
- Black and white color scheme
- Standard fonts
- Optimized for parsing by Applicant Tracking Systems

### Mock API Structure

All API calls are simulated with realistic delays and responses:

```typescript
// Example: Saving a resume
const savedResume = await mockApi.saveResume(resumeData);

// Example: AI enhancement
const enhanced = await mockApi.enhanceResumeContent(content, context);

// Example: ATS score
const score = await mockApi.calculateATSScore(resume);
```

### Context API State Management

- **AuthContext**: User authentication and session management
- **ResumeContext**: Resume CRUD operations and real-time updates

### Form Validation

- Required fields marked with asterisks
- Real-time validation feedback
- Toast notifications for success/error states
- Prevents incomplete submissions

## Connecting to Real Backend

To connect this frontend to a real backend:

1. **Replace Mock API calls** in `src/app/utils/mockApi.ts` with actual API endpoints:

```typescript
// Example: Replace mock with real API
async login(email: string, password: string) {
  const response = await fetch('https://your-api.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
}
```

2. **Add environment variables** for API endpoints:
```
VITE_API_URL=https://your-api.com
VITE_OPENAI_API_KEY=your-key-here
```

3. **Implement authentication** with JWT tokens:
```typescript
// Store token in localStorage
localStorage.setItem('token', response.token);

// Add to API requests
headers: {
  'Authorization': `Bearer ${token}`
}
```

4. **Set up file upload** to cloud storage (AWS S3, Cloudinary)

5. **Integrate real AI APIs** (OpenAI GPT-4, Claude API)

## Customization

### Changing Resume Templates

Edit `src/app/components/ResumePreview.tsx` to modify:
- Layout and spacing
- Section order
- Typography
- Styling

### Adding New Sections

1. Add to TypeScript interface in `src/app/types/resume.ts`
2. Create form component in `src/app/components/forms/`
3. Add context methods in `src/app/context/ResumeContext.tsx`
4. Update preview template in `ResumePreview.tsx`

### Styling

The application uses Tailwind CSS v4. Customize:
- Colors and themes in `src/styles/theme.css`
- Fonts in `src/styles/fonts.css`
- Tailwind utilities inline in components

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Printing & PDF Export

The resume preview is optimized for printing:
- A4/Letter paper size
- Proper margins for printing
- Print-specific CSS styles
- Single-page optimization

## Performance

- Code splitting with React Router
- Lazy loading of routes
- Optimized bundle size
- Fast development with Vite

## Security Considerations

When deploying to production:

- ✅ Use HTTPS only
- ✅ Implement CORS policies
- ✅ Sanitize user inputs
- ✅ Use secure authentication (JWT with httpOnly cookies)
- ✅ Implement rate limiting
- ✅ Validate file uploads (type, size, content)
- ✅ Use environment variables for secrets
- ✅ Implement CSP headers
- ✅ Regular security audits

## Future Enhancements

- [ ] Real backend integration
- [ ] Multiple resume templates
- [ ] AI-powered job matching
- [ ] Resume version history
- [ ] Collaborative editing
- [ ] Cover letter builder
- [ ] LinkedIn profile import
- [ ] Browser extension
- [ ] Mobile app
- [ ] Advanced analytics

## Contributing

This is a demonstration project. For production use:

1. Replace mock APIs with real backend
2. Add proper error handling
3. Implement comprehensive testing
4. Add logging and monitoring
5. Set up CI/CD pipeline

## License

This project is for educational and demonstration purposes.

## Support

For issues or questions:
- Review the code documentation
- Check the TypeScript interfaces for data structures
- Examine the mock API for expected behaviors

---

Built with ❤️ using React, TypeScript, and Tailwind CSS
