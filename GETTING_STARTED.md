# Getting Started with ResumeAI

Welcome to ResumeAI! This guide will help you understand and use the application.

## Quick Start

### For Users

The application is already running! Access it through the preview panel.

#### Creating Your First Resume

**Option 1: AI Chatbot (Recommended)**
1. Click "Get Started Free" or "Sign Up"
2. Create an account with your email
3. From the dashboard, click "AI Resume Builder"
4. Answer the AI's questions about your background
5. Click "Continue to Editor" when done
6. Customize your resume further if needed
7. Click "Preview" to see the final result
8. Click "Print / Save as PDF" to download

**Option 2: Manual Builder**
1. From dashboard, click "Build from Scratch"
2. Fill in your personal information
3. Use the sidebar to navigate between sections
4. Click "+" to add experiences, education, projects
5. Click "Save" to save your progress
6. Click "Preview" to see your resume
7. Export as PDF when ready

**Option 3: Upload Existing**
1. From dashboard, click "Upload Existing"
2. Drag and drop your current resume (PDF or DOCX)
3. Wait for parsing to complete
4. Review and edit the extracted information
5. Apply professional formatting
6. Export the enhanced version

### For Developers

#### Project Structure
```
src/app/
├── components/         # All React components
│   ├── forms/         # Resume form components
│   ├── LandingPage.tsx
│   ├── Dashboard.tsx
│   ├── AIChatbot.tsx
│   ├── ResumeBuilder.tsx
│   └── ...
├── context/           # State management
│   ├── AuthContext.tsx
│   └── ResumeContext.tsx
├── types/             # TypeScript definitions
├── utils/             # Helper functions
└── App.tsx            # Main app with routing
```

#### Key Technologies
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **React Router 7** - Navigation
- **React Context** - State management

#### Running the Application
The Vite dev server is already running in this Figma Make environment. Just use the preview URL.

#### Making Changes

**Adding a New Resume Section:**
1. Add interface to `src/app/types/resume.ts`
2. Create form component in `src/app/components/forms/`
3. Add update methods to `ResumeContext.tsx`
4. Add section to `ResumeBuilder.tsx` sidebar
5. Update `ResumePreview.tsx` template

**Modifying Styles:**
- Edit `src/styles/theme.css` for global styles
- Use Tailwind classes inline for component styles
- Modify resume template in `ResumePreview.tsx`

**Connecting to Backend:**
1. Replace functions in `src/app/utils/mockApi.ts`
2. Add environment variables for API URL
3. Implement real JWT authentication
4. Add error handling for network failures

## Features Guide

### Dashboard
- **View all resumes** - See all your saved resumes
- **Quick actions** - Three ways to create resumes
- **Edit resumes** - Click edit icon on any resume
- **Delete resumes** - Remove unwanted resumes
- **ATS scores** - View resume scores (when available)

### AI Chatbot
- **Natural conversation** - Chat naturally with AI
- **Smart extraction** - AI extracts your information
- **Flexible input** - Answer in your own words
- **Skip options** - Skip optional fields by typing "skip"
- **Continue editing** - Move to full editor anytime

### Resume Builder
- **Section navigation** - Use sidebar to switch sections
- **Real-time updates** - Changes save locally immediately
- **CRUD operations** - Add, edit, delete entries
- **Multiple entries** - Add multiple jobs, degrees, projects
- **Validation** - Required fields marked with *
- **Auto-save** - Click save to persist changes

### Resume Templates
- **ATS-friendly** - Optimized for Applicant Tracking Systems
- **Single-page** - Content fits on one page
- **Black & white** - Professional, printable design
- **Standard sections** - Industry-standard formatting
- **Clean layout** - Easy to read and scan

## User Flows

### First-Time User
```
Landing Page → Sign Up → Dashboard → AI Chatbot 
→ Answer Questions → Continue to Editor → Customize 
→ Preview → Export PDF → Download
```

### Returning User
```
Login → Dashboard → Select Resume → Edit 
→ Update Sections → Save → Preview → Export
```

### Upload Flow
```
Login → Dashboard → Upload → Drop File 
→ Wait for Parsing → Review Data → Edit 
→ Apply Template → Export
```

## Tips & Best Practices

### For Best ATS Results
✅ Use standard section headings
✅ Include relevant keywords from job description
✅ Use bullet points for experience
✅ Quantify achievements with numbers
✅ Keep formatting simple (no images/graphics)
✅ Use standard fonts
✅ Include contact information
✅ List skills explicitly

### Content Writing Tips
✅ Start bullets with action verbs
✅ Focus on achievements, not just duties
✅ Use metrics (%, $, #) when possible
✅ Tailor content to target job
✅ Keep language professional
✅ Proofread carefully
✅ Be concise and clear

### Using AI Effectively
✅ Provide complete information
✅ Be specific in your descriptions
✅ Include dates and details
✅ Review AI suggestions
✅ Customize auto-generated content
✅ Add personal touches

## Troubleshooting

### Can't see my saved resumes
- Make sure you're logged in
- Check you're using the same account
- Resumes are stored in browser memory (resets on refresh in mock version)

### Resume won't export
- Click "Preview" first
- Use browser print (Ctrl/Cmd + P)
- Select "Save as PDF" as destination
- Check print settings

### Form won't save
- Fill in all required fields (marked with *)
- Check for validation errors
- Try saving individual sections
- Ensure you're logged in

### Upload not working
- Check file format (PDF or DOCX only)
- Ensure file size is under 10MB
- Try a different browser
- Check file isn't corrupted

## Keyboard Shortcuts

- `Enter` - Submit chat message
- `Shift + Enter` - New line in chat
- `Ctrl/Cmd + P` - Print/Save PDF (in preview)
- `Esc` - Close modals
- `Tab` - Navigate between form fields

## Mobile Usage

The application is fully responsive:
- ✅ Works on phones and tablets
- ✅ Touch-friendly interface
- ✅ Simplified navigation on mobile
- ✅ Full feature parity
- ✅ Optimized forms for small screens

## FAQ

**Q: Is my data saved permanently?**
A: Currently, data is stored in memory and resets on refresh. Connect to a real backend for permanent storage.

**Q: Can I have multiple resumes?**
A: Yes! Create as many resumes as you need for different jobs.

**Q: How do I customize the template?**
A: Currently one template is available. More templates coming soon. You can modify content and sections.

**Q: Can I export to Word?**
A: Export as PDF using browser print. For DOCX, you would need backend integration.

**Q: Is the AI real?**
A: Currently uses mock responses. Integrate OpenAI/Claude API for real AI.

**Q: Can I share my resume?**
A: Export as PDF and share the file. Link sharing requires backend.

**Q: How do I delete my account?**
A: Account management requires backend implementation.

## Support

### Documentation
- **README.md** - Full setup and feature guide
- **API_DOCUMENTATION.md** - API specifications
- **ARCHITECTURE.md** - Technical architecture
- **PROJECT_SUMMARY.md** - Features and statistics

### Code References
- Check TypeScript interfaces for data structures
- Read component comments for functionality
- Review mock API for expected behaviors
- Examine contexts for state management

## What's Next?

### Phase 1: Backend (Recommended)
1. Set up Express.js server
2. Connect MongoDB database
3. Implement JWT authentication
4. Add real file upload to S3

### Phase 2: AI Integration
1. Integrate OpenAI/Claude API
2. Add real resume parsing
3. Implement smart suggestions
4. Real-time content enhancement

### Phase 3: Additional Features
1. Multiple resume templates
2. Cover letter builder
3. Job application tracker
4. Chrome extension
5. Mobile app

## Resources

### Learn More
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Router](https://reactrouter.com/)

### Design Inspiration
- Professional resume templates
- ATS-friendly formatting guides
- UI/UX best practices

### Deployment
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Guide](https://docs.netlify.com)
- [AWS Amplify](https://docs.amplify.aws)

---

## Quick Commands Reference

```bash
# Install dependencies
pnpm install

# Development server (already running)
pnpm dev

# Build for production (Note: Not needed in Figma Make)
pnpm build

# Type check
pnpm tsc --noEmit

# Lint code
pnpm eslint src/
```

---

**Need Help?** Check the other documentation files for detailed information:
- Technical details → ARCHITECTURE.md
- API reference → API_DOCUMENTATION.md  
- Setup guide → README.md
- Feature list → PROJECT_SUMMARY.md

**Happy resume building! 🎉**
