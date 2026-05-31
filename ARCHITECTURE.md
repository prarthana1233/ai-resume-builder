# Project Architecture

## Overview

ResumeAI is a single-page application (SPA) built with React and TypeScript. The architecture follows a component-based design with context APIs for state management and a modular folder structure for scalability.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    React App                          │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │           React Router (BrowserRouter)          │  │  │
│  │  │  ┌───────────────────────────────────────────┐  │  │  │
│  │  │  │        AuthProvider (Context)             │  │  │  │
│  │  │  │  ┌─────────────────────────────────────┐  │  │  │  │
│  │  │  │  │    ResumeProvider (Context)         │  │  │  │  │
│  │  │  │  │  ┌───────────────────────────────┐  │  │  │  │  │
│  │  │  │  │  │       Page Components         │  │  │  │  │  │
│  │  │  │  │  │  - Landing                    │  │  │  │  │  │
│  │  │  │  │  │  - Login/Register             │  │  │  │  │  │
│  │  │  │  │  │  - Dashboard                  │  │  │  │  │  │
│  │  │  │  │  │  - AI Chatbot                 │  │  │  │  │  │
│  │  │  │  │  │  - Resume Builder             │  │  │  │  │  │
│  │  │  │  │  │  - Resume Upload              │  │  │  │  │  │
│  │  │  │  │  └───────────────────────────────┘  │  │  │  │  │
│  │  │  │  └─────────────────────────────────────┘  │  │  │  │
│  │  │  └───────────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Mock API Calls
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Mock API Layer                            │
│  - Authentication simulation                                 │
│  - Resume CRUD operations                                    │
│  - AI response generation                                    │
│  - File parsing simulation                                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ (In Production)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Real Backend (Future)                       │
│  ┌───────────────┬──────────────┬──────────────────────┐   │
│  │   Express.js  │   MongoDB    │   OpenAI/Claude API  │   │
│  │   REST API    │   Database   │   AI Services        │   │
│  └───────────────┴──────────────┴──────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Core Technologies

### Frontend Stack
- **React 18.3.1** - Component-based UI library
- **TypeScript** - Static type checking
- **Tailwind CSS v4** - Utility-first CSS framework
- **Vite** - Build tool and dev server

### Routing & Navigation
- **React Router 7.13.0** - Client-side routing
- Protected routes with authentication guards
- Dynamic route parameters for resume editing

### State Management
- **React Context API** - Global state management
- Two main contexts:
  - `AuthContext` - User authentication state
  - `ResumeContext` - Resume data and CRUD operations

### Form Handling
- **React Hook Form 7.55.0** - Form validation and management
- Custom controlled components
- Real-time validation feedback

### UI Components & Libraries
- **Lucide React** - Icon library
- **Sonner** - Toast notifications
- **React Dropzone** - File upload interface
- **@react-pdf/renderer** - PDF generation
- **date-fns** - Date formatting and manipulation

## Folder Structure

```
resume-builder/
├── src/
│   ├── app/
│   │   ├── components/          # React components
│   │   │   ├── forms/          # Form components
│   │   │   ├── LandingPage.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── AIChatbot.tsx
│   │   │   ├── ResumeBuilder.tsx
│   │   │   ├── ResumeUpload.tsx
│   │   │   └── ResumePreview.tsx
│   │   ├── context/            # Context providers
│   │   │   ├── AuthContext.tsx
│   │   │   └── ResumeContext.tsx
│   │   ├── types/              # TypeScript interfaces
│   │   │   └── resume.ts
│   │   ├── utils/              # Utility functions
│   │   │   └── mockApi.ts
│   │   └── App.tsx             # Main app component
│   └── styles/
│       ├── theme.css           # CSS variables
│       └── fonts.css           # Font imports
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
├── API_DOCUMENTATION.md
└── ARCHITECTURE.md
```

## Data Flow

### Authentication Flow
```
User Input → Login Component → AuthContext.login()
    ↓
MockAPI.login() → Simulate API delay → Return user + token
    ↓
AuthContext updates state → User stored in context
    ↓
Navigate to Dashboard → ProtectedRoute checks auth
```

### Resume Creation Flow
```
Dashboard → Click "AI Resume Builder"
    ↓
Navigate to /chatbot → AIChatbot component
    ↓
User chats with AI → Messages stored in local state
    ↓
AI extracts data → Updates ResumeContext
    ↓
Click "Continue to Editor" → Navigate to /builder/new
    ↓
ResumeBuilder loads → Displays forms with current data
    ↓
User edits sections → Real-time updates to ResumeContext
    ↓
Click "Save" → ResumeContext.saveResume()
    ↓
MockAPI.saveResume() → Simulate save → Return saved resume
    ↓
Resume stored in context → Added to user's resume list
```

### Resume Upload Flow
```
Dashboard → Click "Upload Existing"
    ↓
Navigate to /upload → ResumeUpload component
    ↓
User drops file → React Dropzone handles upload
    ↓
MockAPI.parseResumeFile() → Simulate OCR/parsing
    ↓
Returns parsed data → Creates new resume in ResumeContext
    ↓
Navigate to /builder/new → Shows extracted data in forms
```

## State Management

### AuthContext
**Responsibilities:**
- User authentication state
- Login/logout functionality
- Session management
- User profile data

**API Methods:**
```typescript
{
  user: User | null,
  loading: boolean,
  login: (email, password) => Promise<void>,
  register: (email, password, name) => Promise<void>,
  googleLogin: () => Promise<void>,
  logout: () => void
}
```

### ResumeContext
**Responsibilities:**
- Current resume data
- List of user's resumes
- CRUD operations for resumes
- Section-specific update methods

**API Methods:**
```typescript
{
  currentResume: ResumeData | null,
  resumes: ResumeData[],
  loading: boolean,
  createNewResume: () => void,
  saveResume: (resume) => Promise<void>,
  deleteResume: (id) => Promise<void>,
  loadResumes: (userId) => Promise<void>,
  updatePersonalInfo: (info) => void,
  updateSummary: (summary) => void,
  addExperience: (exp) => void,
  addEducation: (edu) => void,
  addProject: (proj) => void,
  updateSkills: (skills) => void,
  // ... more update methods
}
```

## Component Architecture

### Page Components (Routes)
- **LandingPage** - Marketing page with features
- **Login/Register** - Authentication forms
- **Dashboard** - User's resume list and quick actions
- **AIChatbot** - Conversational resume builder
- **ResumeBuilder** - Main resume editor with forms
- **ResumeUpload** - File upload and parsing interface

### Form Components
- **PersonalInfoForm** - Contact information
- **ExperienceForm** - Work experience with CRUD
- **EducationForm** - Educational background
- **ProjectsForm** - Portfolio projects
- **SkillsForm** - Technical and soft skills
- **CertificationsForm** - Professional certifications

### Utility Components
- **ResumePreview** - Formatted resume display
- **ProtectedRoute** - Authentication guard

## Design Patterns

### 1. Container/Presentational Pattern
Components are split into:
- **Container components**: Handle logic and state (e.g., forms with CRUD)
- **Presentational components**: Pure display components (e.g., ResumePreview)

### 2. Context Provider Pattern
Global state is managed through context providers:
```tsx
<AuthProvider>
  <ResumeProvider>
    <App />
  </ResumeProvider>
</AuthProvider>
```

### 3. Protected Route Pattern
Authentication is enforced through route guards:
```tsx
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

### 4. Controlled Component Pattern
All forms use controlled components with state:
```tsx
<input
  value={formData.name}
  onChange={(e) => setFormData({...formData, name: e.target.value})}
/>
```

## Performance Optimizations

### 1. Code Splitting
- React Router automatically splits routes into separate chunks
- Lazy loading of route components (can be implemented)

### 2. Memoization
- Can use React.memo for expensive components
- useMemo for expensive calculations
- useCallback for function props

### 3. Virtual Scrolling
- For large lists of resumes (can be implemented with react-window)

### 4. Debouncing
- Auto-save functionality with debounced updates (can be added)

## Security Considerations

### Current Implementation
✅ Input validation in forms
✅ TypeScript type safety
✅ Protected routes
✅ Sanitized user inputs in preview

### Production Requirements
⚠️ Need JWT token management
⚠️ Need HTTPS enforcement
⚠️ Need CORS configuration
⚠️ Need XSS prevention
⚠️ Need CSRF protection
⚠️ Need rate limiting
⚠️ Need file upload validation

## Testing Strategy

### Unit Tests
- Context providers
- Utility functions
- Individual components
- Form validation logic

### Integration Tests
- Authentication flow
- Resume CRUD operations
- Form submissions
- Route navigation

### End-to-End Tests
- Complete resume creation flow
- Upload and edit flow
- Export functionality
- Multi-resume management

### Testing Tools (to be implemented)
- Jest for unit tests
- React Testing Library for component tests
- Cypress or Playwright for E2E tests

## Build & Deployment

### Development
```bash
pnpm install
pnpm dev
```

### Production Build
```bash
pnpm build
# Outputs to dist/
```

### Environment Variables
```env
VITE_API_URL=https://api.resumeai.com
VITE_OPENAI_API_KEY=sk-...
VITE_GOOGLE_CLIENT_ID=...
```

### Deployment Platforms
- **Frontend**: Vercel, Netlify, AWS Amplify
- **Backend**: Render, Railway, AWS, Heroku
- **Database**: MongoDB Atlas, AWS DocumentDB

## Scalability Considerations

### Current Limitations
- All state stored in memory (resets on refresh)
- No persistent storage
- No real authentication
- Limited to single user session

### Future Enhancements
- Implement Redux or Zustand for larger state
- Add IndexedDB for offline support
- Implement service workers for PWA
- Add real-time collaboration with WebSockets
- Implement caching strategies
- Add CDN for static assets

## Accessibility

### Current Implementation
- Semantic HTML
- Keyboard navigation support
- Focus management
- Form labels and ARIA attributes

### Future Improvements
- Screen reader testing
- Color contrast compliance (WCAG AA)
- Skip navigation links
- Announcement regions for dynamic content
- Reduced motion preferences

## Browser Compatibility

### Supported Browsers
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Chrome/Safari

### Polyfills
- Modern JavaScript features (ES2020+)
- CSS Grid and Flexbox
- Fetch API

## Error Handling

### Current Strategy
- Toast notifications for user feedback
- Try-catch blocks in async operations
- Form validation errors
- Console logging for debugging

### Production Requirements
- Error boundary components
- Sentry or similar error tracking
- User-friendly error pages
- Retry mechanisms for failed requests
- Offline detection and handling

## Monitoring & Analytics

### Recommended Tools
- **Analytics**: Google Analytics, Mixpanel
- **Error Tracking**: Sentry, LogRocket
- **Performance**: Lighthouse, Web Vitals
- **User Behavior**: Hotjar, FullStory

## Documentation

- **README.md** - Setup and usage instructions
- **API_DOCUMENTATION.md** - API endpoint specifications
- **ARCHITECTURE.md** - This document
- **Inline code comments** - Complex logic explanations
- **TypeScript interfaces** - Self-documenting types

## Future Roadmap

### Phase 1 - Backend Integration
- [ ] Set up Express.js server
- [ ] Implement MongoDB schemas
- [ ] Add JWT authentication
- [ ] Connect frontend to real APIs

### Phase 2 - AI Integration
- [ ] Integrate OpenAI/Claude API
- [ ] Implement resume parsing with OCR
- [ ] Add intelligent content suggestions
- [ ] Real-time ATS scoring

### Phase 3 - Advanced Features
- [ ] Multiple resume templates
- [ ] Cover letter generator
- [ ] Job application tracking
- [ ] Interview preparation tools
- [ ] Chrome extension
- [ ] Mobile app (React Native)

### Phase 4 - Enterprise Features
- [ ] Team collaboration
- [ ] Admin dashboard
- [ ] Analytics and insights
- [ ] White-label solution
- [ ] API for third-party integrations

---

**Last Updated:** May 23, 2026
**Version:** 1.0.0
**Maintainer:** Development Team
