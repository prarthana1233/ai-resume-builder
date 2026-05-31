import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useResume } from '../context/ResumeContext';
import { FileText, Plus, Edit, Trash2, LogOut, MessageSquare, Upload, Briefcase, X, Check, History, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';

const professions = {
  IT: [
    'Software Engineer', 'Frontend Developer', 'Backend Developer',
    'Full Stack Developer', 'Data Scientist', 'Machine Learning Engineer',
    'DevOps Engineer', 'Cloud Architect', 'Cybersecurity Analyst',
    'Mobile App Developer', 'UI/UX Designer', 'Database Administrator',
    'Network Engineer', 'AI Engineer', 'QA Engineer'
  ],
  'Non-IT': [
    'Mechanical Engineer', 'Civil Engineer', 'Electrical Engineer',
    'Chemical Engineer', 'Biomedical Engineer', 'Aerospace Engineer',
    'Automotive Engineer', 'Industrial Engineer', 'Environmental Engineer',
    'Product Manager', 'Business Analyst', 'Marketing Manager',
    'HR Manager', 'Financial Analyst', 'Operations Manager'
  ],
  Arts: [
    'Graphic Designer', 'Content Writer', 'Journalist',
    'Photographer', 'Video Editor', 'Animator',
    'Fashion Designer', 'Interior Designer', 'Architect',
    'Sketching', 'Lawyer', 'Art Director',
    'Copywriter', 'Social Media Manager', 'Event Planner'
  ]
};

const resumeTemplates = [
  {
    id: 'classic', name: 'Classic', description: 'Clean and professional black & white layout',
    preview: (
      <div className="w-full h-full bg-white p-3 text-xs">
        <div className="text-center border-b-2 border-black pb-2 mb-2">
          <div className="font-bold text-sm">JOHN DOE</div>
          <div className="text-gray-500">john@email.com • +1 234 567 890</div>
        </div>
        <div className="font-bold border-b border-black mb-1">EXPERIENCE</div>
        <div className="mb-1">
          <div className="flex justify-between"><span className="font-semibold">Software Engineer</span><span>2020-2024</span></div>
          <div className="text-gray-500">Tech Corp</div>
        </div>
        <div className="font-bold border-b border-black mb-1">EDUCATION</div>
        <div className="flex justify-between"><span className="font-semibold">B.Tech CS</span><span>2016-2020</span></div>
        <div className="text-gray-500">University of Tech</div>
      </div>
    )
  },
  {
    id: 'modern', name: 'Modern', description: 'Two-column layout with sidebar',
    preview: (
      <div className="w-full h-full bg-white text-xs flex">
        <div className="w-1/3 bg-gray-900 text-white p-3">
          <div className="font-bold text-sm mb-2">JOHN DOE</div>
          <div className="text-gray-300 text-xs mb-3">john@email.com</div>
          <div className="font-bold mb-1 text-xs">SKILLS</div>
          <div className="text-gray-300 text-xs">React • Node.js • Python • SQL</div>
        </div>
        <div className="w-2/3 p-3">
          <div className="font-bold border-b border-gray-300 mb-1">EXPERIENCE</div>
          <div className="mb-1">
            <div className="font-semibold">Software Engineer</div>
            <div className="text-gray-500">Tech Corp • 2020-2024</div>
          </div>
          <div className="font-bold border-b border-gray-300 mb-1">EDUCATION</div>
          <div className="font-semibold">B.Tech CS</div>
          <div className="text-gray-500">University • 2020</div>
        </div>
      </div>
    )
  },
  {
    id: 'minimal', name: 'Minimal', description: 'Simple and elegant single column',
    preview: (
      <div className="w-full h-full bg-white p-3 text-xs">
        <div className="mb-3">
          <div className="font-bold text-lg">John Doe</div>
          <div className="text-gray-400 text-xs">john@email.com • +1 234 567 890 • New York</div>
        </div>
        <div className="text-gray-400 uppercase text-xs tracking-widest mb-1">Experience</div>
        <div className="border-l-2 border-gray-200 pl-2 mb-2">
          <div className="font-semibold">Software Engineer</div>
          <div className="text-gray-400">Tech Corp • 2020 — 2024</div>
        </div>
        <div className="text-gray-400 uppercase text-xs tracking-widest mb-1">Education</div>
        <div className="border-l-2 border-gray-200 pl-2">
          <div className="font-semibold">B.Tech CS</div>
          <div className="text-gray-400">University • 2020</div>
        </div>
      </div>
    )
  },
  {
    id: 'bold', name: 'Bold', description: 'Strong headers with accent colors',
    preview: (
      <div className="w-full h-full bg-white p-3 text-xs">
        <div className="bg-black text-white p-2 mb-2">
          <div className="font-bold text-sm">JOHN DOE</div>
          <div className="text-gray-300 text-xs">Software Engineer</div>
        </div>
        <div className="flex gap-2 mb-2">
          <div className="flex-1">
            <div className="bg-gray-100 px-2 py-1 font-bold text-xs mb-1">EXPERIENCE</div>
            <div className="font-semibold">Tech Corp</div>
            <div className="text-gray-500">2020 - 2024</div>
          </div>
          <div className="flex-1">
            <div className="bg-gray-100 px-2 py-1 font-bold text-xs mb-1">SKILLS</div>
            <div className="text-gray-600">React, Node.js Python, SQL</div>
          </div>
        </div>
        <div className="bg-gray-100 px-2 py-1 font-bold text-xs mb-1">EDUCATION</div>
        <div className="font-semibold">B.Tech CS • University • 2020</div>
      </div>
    )
  },
  {
    id: 'elegant', name: 'Elegant', description: 'Sophisticated layout with fine lines',
    preview: (
      <div className="w-full h-full bg-white p-3 text-xs">
        <div className="text-center mb-2">
          <div className="font-bold text-sm tracking-widest uppercase">John Doe</div>
          <div className="flex justify-center gap-2 text-gray-400 text-xs mt-1">
            <span>john@email.com</span><span>•</span><span>New York</span>
          </div>
          <div className="border-t border-b border-gray-300 py-1 mt-1 text-gray-500 italic text-xs">Software Engineer</div>
        </div>
        <div className="text-center text-gray-400 uppercase text-xs tracking-widest mb-1">Experience</div>
        <div className="text-center mb-2">
          <div className="font-semibold">Tech Corp</div>
          <div className="text-gray-400">Software Engineer • 2020–2024</div>
        </div>
        <div className="text-center text-gray-400 uppercase text-xs tracking-widest mb-1">Education</div>
        <div className="text-center">
          <div className="font-semibold">B.Tech Computer Science</div>
          <div className="text-gray-400">University of Tech • 2020</div>
        </div>
      </div>
    )
  },
  {
    id: 'creative', name: 'Creative', description: 'Unique design for creative professionals',
    preview: (
      <div className="w-full h-full bg-gray-50 p-3 text-xs">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-bold text-sm">J</div>
          <div>
            <div className="font-bold">John Doe</div>
            <div className="text-gray-400 text-xs">Graphic Designer</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="font-bold text-xs uppercase mb-1 text-gray-400">Experience</div>
            <div className="bg-white p-1 rounded shadow-sm">
              <div className="font-semibold">Design Co</div>
              <div className="text-gray-400">2020-2024</div>
            </div>
          </div>
          <div>
            <div className="font-bold text-xs uppercase mb-1 text-gray-400">Skills</div>
            <div className="flex flex-wrap gap-1">
              {['Figma', 'PS', 'AI'].map(s => (
                <span key={s} className="bg-black text-white px-1 rounded text-xs">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  },

{
    id: 'pinkfloral',
    name: 'Pink Floral',
    description: 'Elegant floral design with pink accents',
    preview: (
      <div className="w-full h-full bg-pink-50 p-3 text-xs">
        <div
          className="p-3 mb-2 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #f9a8d4, #fbcfe8)' }}
        >
          <div
            className="absolute top-0 right-0 w-12 h-12 rounded-full opacity-40"
            style={{ background: 'radial-gradient(circle, #ec4899, transparent)', transform: 'translate(30%, -30%)' }}
          />
          <div className="font-bold text-sm text-pink-900 relative z-10">YOUR NAME</div>
          <div className="text-pink-700 text-xs relative z-10">your@email.com • Phone</div>
        </div>
        <div className="flex gap-2">
          <div className="w-1/2">
            <div className="text-pink-500 font-bold text-xs uppercase mb-1 border-b border-pink-200 pb-0.5">About Me</div>
            <div className="text-gray-500 text-xs">Dedicated professional with strong skills.</div>
          </div>
          <div className="w-1/2">
            <div className="text-pink-500 font-bold text-xs uppercase mb-1 border-b border-pink-200 pb-0.5">Skills</div>
            <div className="flex flex-wrap gap-0.5">
              {['Skill 1', 'Skill 2'].map(s => (
                <span key={s} className="bg-pink-100 text-pink-700 px-1 rounded text-xs">{s}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-2">
          <div className="text-pink-500 font-bold text-xs uppercase mb-1 border-b border-pink-200 pb-0.5">Experience</div>
          <div className="font-semibold text-xs">Job Title</div>
          <div className="text-gray-400 text-xs">Company • 2020–2024</div>
        </div>
      </div>
    )
  },
{
    id: 'cubist', name: 'Cubist', description: 'Green sidebar with skill bars',
    preview: (
      <div className="w-full h-full flex text-xs">
        <div className="w-1/3 p-2" style={{ background: '#2d6a4f', color: 'white' }}>
          <div className="w-10 h-10 rounded mx-auto mb-1 flex items-center justify-center font-bold text-sm" style={{ background: '#52b788' }}>YN</div>
          <div className="font-bold text-center text-xs mb-2">NAME HERE</div>
          <div className="text-xs mb-1" style={{ color: '#74c69d' }}>SKILLS</div>
          {['Skill 1','Skill 2','Skill 3'].map((s,i) => (
            <div key={s} className="mb-1">
              <div className="text-xs mb-0.5" style={{ color: '#d8f3dc' }}>{s}</div>
              <div className="h-1 rounded" style={{ background: '#1b4332' }}>
                <div className="h-1 rounded" style={{ background: '#74c69d', width: `${70+(i*10)}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="w-2/3 p-2 bg-white">
          <div className="font-bold border-b-2 mb-1 text-xs" style={{ color: '#2d6a4f', borderColor: '#2d6a4f' }}>EDUCATION</div>
          <div className="text-xs font-semibold mb-1">B.Tech CS</div>
          <div className="font-bold border-b-2 mb-1 text-xs" style={{ color: '#2d6a4f', borderColor: '#2d6a4f' }}>WORK EXPERIENCE</div>
          <div className="text-xs font-semibold">Software Engineer</div>
          <div className="text-xs" style={{ color: '#6b7280' }}>Tech Corp</div>
        </div>
      </div>
    )
  },
  {
    id: 'playful', name: 'Playful', description: 'Navy sidebar with colorful blob accents',
    preview: (
      <div className="w-full h-full flex text-xs">
        <div className="w-1/3 p-2 relative overflow-hidden" style={{ background: '#1e2d4a', color: 'white' }}>
          <div className="absolute top-0 left-0 w-8 h-8 rounded-full opacity-50" style={{ background: '#f7c59f', transform: 'translate(-30%,-30%)' }} />
          <div className="relative z-10">
            <div className="font-bold text-xs text-white leading-tight">FIRST</div>
            <div className="font-bold text-xs mb-2" style={{ color: '#a8d8ea' }}>SURNAME</div>
            <div className="text-xs mb-1" style={{ color: '#f7c59f' }}>SKILLS</div>
            {['Skill 1','Skill 2'].map((s,i) => (
              <div key={s} className="mb-1">
                <div className="text-xs mb-0.5" style={{ color: '#e2e8f0' }}>{s}</div>
                <div className="h-1 rounded" style={{ background: '#2d3f5e' }}>
                  <div className="h-1 rounded" style={{ background: ['#f7c59f','#a8d8ea'][i], width: `${70+(i*15)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-2/3 p-2" style={{ background: '#f8f9fa' }}>
          <div className="font-bold border-b-2 mb-1 text-xs" style={{ color: '#1e2d4a', borderColor: '#a8d8ea' }}>ABOUT ME</div>
          <div className="text-xs text-gray-500 mb-1">Professional summary here</div>
          <div className="font-bold border-b-2 mb-1 text-xs" style={{ color: '#1e2d4a', borderColor: '#f7c59f' }}>EXPERIENCE</div>
          <div className="text-xs font-semibold">Software Engineer</div>
          <div className="text-xs" style={{ color: '#4b6cb7' }}>Tech Corp</div>
        </div>
      </div>
    )
  },

];
const getTemplate = (profession: string) => {
  const templates: Record<string, any> = {
    'Software Engineer': { summary: 'Passionate Software Engineer with experience building scalable applications using modern technologies.', skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL', 'Git', 'REST APIs'] },
    'Frontend Developer': { summary: 'Creative Frontend Developer specialized in building responsive and user-friendly web applications.', skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Vue.js', 'Tailwind CSS', 'TypeScript', 'Figma'] },
    'Data Scientist': { summary: 'Analytical Data Scientist with expertise in machine learning, statistical analysis, and data visualization.', skills: ['Python', 'R', 'Machine Learning', 'TensorFlow', 'Pandas', 'NumPy', 'SQL', 'Tableau'] },
    'Mechanical Engineer': { summary: 'Detail-oriented Mechanical Engineer with hands-on experience in product design and manufacturing.', skills: ['AutoCAD', 'SolidWorks', 'CATIA', 'FEA Analysis', 'GD&T', 'MATLAB', 'Six Sigma'] },
    'Graphic Designer': { summary: 'Creative Graphic Designer with a strong eye for aesthetics and expertise in visual communication.', skills: ['Adobe Photoshop', 'Illustrator', 'InDesign', 'Figma', 'After Effects', 'Typography'] },
    'Content Writer': { summary: 'Skilled Content Writer with expertise in creating engaging content across multiple platforms and industries.', skills: ['SEO Writing', 'Copywriting', 'WordPress', 'Content Strategy', 'Social Media', 'Editing'] },
    'DevOps Engineer': { summary: 'Experienced DevOps Engineer skilled in CI/CD pipelines, cloud infrastructure, and automation.', skills: ['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Terraform', 'Linux', 'Python', 'Git'] },
    'UI/UX Designer': { summary: 'User-centered UI/UX Designer with expertise in creating intuitive digital experiences.', skills: ['Figma', 'Adobe XD', 'Sketch', 'User Research', 'Wireframing', 'Prototyping', 'Usability Testing'] },
  };
  return templates[profession] || { summary: `Dedicated ${profession} with strong professional skills and a passion for excellence.`, skills: [] };
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { resumes, loadResumes, deleteResume, createNewResume, updateSummary, updateSkills } = useResume();
  const [loading, setLoading] = useState(true);
  const [showProfessions, setShowProfessions] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [activeTab, setActiveTab] = useState<'IT' | 'Non-IT' | 'Arts'>('IT');
  const [selectedProfession, setSelectedProfession] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('classic');
  const [showAllHistory, setShowAllHistory] = useState(false);

  useEffect(() => {
    if (user) {
      loadResumes(user.id).finally(() => setLoading(false));
    }
  }, [user]);

  const handleLogout = () => { logout(); navigate('/'); };
  const handleCreateNew = () => { createNewResume(); navigate('/builder/new'); };
  const handleSelectProfession = () => { if (!selectedProfession) return; setShowProfessions(false); setShowTemplates(true); };
  const handleUseTemplate = () => {
  if (!selectedProfession) return;
  const template = getTemplate(selectedProfession);
  createNewResume();
  setTimeout(() => {
    if (template.summary) updateSummary(template.summary);
    if (template.skills.length) updateSkills(template.skills);
    sessionStorage.setItem('selectedTemplate', selectedTemplate);
    sessionStorage.setItem('selectedTemplateId', selectedTemplate); // ← add this
  }, 300);
  setShowTemplates(false);
  navigate('/builder/new');
};

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #ede9fe 0%, #e0f2fe 50%, #fce7f3 100%)' }}>
      {/* Header */}
      <header className="px-6 py-4 bg-white" style={{ borderBottom: '1px solid #e5e7eb' }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-gray-900" />
            <span className="font-bold text-xl text-gray-900">ResumeAI</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-500">Welcome, {user?.name}</span>
            <button onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 transition-colors border border-gray-300 hover:bg-gray-100">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Quick Actions</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <button onClick={() => navigate('/ai-builder')}
              className="p-6 text-left group transition-all rounded-xl"
              style={{ background: '#16a34a', border: 'none' }}
              onMouseOver={e => (e.currentTarget.style.background = '#15803d')}
              onMouseOut={e => (e.currentTarget.style.background = '#16a34a')}>
              <MessageSquare className="w-8 h-8 mb-4 text-white" />
              <h3 className="font-bold text-lg mb-2 text-white">AI Resume Builder</h3>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>Create resume using AI chatbot</p>
            </button>

            <button onClick={handleCreateNew}
              className="p-6 text-left group transition-all rounded-xl"
              style={{ background: '#7c3aed', border: 'none' }}
              onMouseOver={e => (e.currentTarget.style.background = '#6d28d9')}
              onMouseOut={e => (e.currentTarget.style.background = '#7c3aed')}>
              <Plus className="w-8 h-8 mb-4 text-white" />
              <h3 className="font-bold text-lg mb-2 text-white">Build from Scratch</h3>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>Start with a blank template</p>
            </button>

            <button onClick={() => navigate('/upload')}
              className="p-6 text-left group transition-all rounded-xl"
              style={{ background: '#2563eb', border: 'none' }}
              onMouseOver={e => (e.currentTarget.style.background = '#1d4ed8')}
              onMouseOut={e => (e.currentTarget.style.background = '#2563eb')}>
              <Upload className="w-8 h-8 mb-4 text-white" />
              <h3 className="font-bold text-lg mb-2 text-white">Upload Existing</h3>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>Upload and enhance your resume</p>
            </button>

            <button onClick={() => setShowProfessions(true)}
              className="p-6 text-left group transition-all rounded-xl"
              style={{ background: '#ea580c', border: 'none' }}
              onMouseOver={e => (e.currentTarget.style.background = '#c2410c')}
              onMouseOut={e => (e.currentTarget.style.background = '#ea580c')}>
              <Briefcase className="w-8 h-8 mb-4 text-white" />
              <h3 className="font-bold text-lg mb-2 text-white">Browse by Profession</h3>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>IT, Non-IT & Arts templates</p>
            </button>
          </div>
        </div>

        
        {/* Resume History */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl" style={{ background: '#7c3aed' }}>
                <History className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Resume History</h2>
            </div>
            {resumes.length > 3 && (
              <button
                onClick={() => setShowAllHistory(p => !p)}
                className="flex items-center gap-1 text-sm font-medium px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-gray-600"
              >
                {showAllHistory ? <><ChevronUp className="w-4 h-4" /> Show Less</> : <><ChevronDown className="w-4 h-4" /> View All ({resumes.length})</>}
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading history...</div>
          ) : resumes.length === 0 ? (
            <div className="rounded-xl bg-white border border-gray-200 p-8 text-center">
              <Clock className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">No resume history yet. Start creating to see your activity here.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100" style={{ background: '#f9fafb' }}>
              <div className="col-span-4">Resume Name</div>
              <div className="col-span-2">Template</div>
              <div className="col-span-3">Sections</div>
              <div className="col-span-2">Last Edited</div>
              <div className="col-span-1">Actions</div>
              </div>

              {/* Table Rows */}
              {(showAllHistory ? resumes : resumes.slice(0, 3)).map((resume, idx) => (
                <div
                  key={resume.id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-purple-50 transition-colors"
                  style={{ borderBottom: idx < (showAllHistory ? resumes.length : Math.min(3, resumes.length)) - 1 ? '1px solid #f3f4f6' : 'none' }}
                >
                  {/* Name */}
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#ede9fe' }}>
                      <FileText className="w-4 h-4" style={{ color: '#7c3aed' }} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{resume.personalInfo.fullName || 'Untitled Resume'}</p>
                      <p className="text-xs text-gray-400">{resume.personalInfo.email || '—'}</p>
                    </div>
                  </div>

                  {/* Template */}
                  <div className="col-span-2">
                    <span className="text-xs px-2 py-1 rounded-full font-medium capitalize" style={{ background: '#ede9fe', color: '#7c3aed' }}>
                      {(resume as any).template || 'Classic'}
                    </span>
                  </div>

                  {/* Sections */}
                  <div className="col-span-3">
                    <p className="text-sm text-gray-600">{resume.experience.length} exp · {resume.education.length} edu</p>
                    <p className="text-xs text-gray-400">{resume.skills.length} skills</p>
                  </div>

                  {/* Last Edited */}
                  <div className="col-span-2 flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    {format(new Date(resume.updatedAt), 'MMM d, yyyy')}
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex items-center gap-1">
                    <button
                      onClick={() => navigate(`/builder/${resume.id}`)}
                      className="p-1.5 rounded-lg hover:bg-purple-100 transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" style={{ color: '#7c3aed' }} />
                    </button>
                    <button
                      onClick={() => window.confirm('Delete this resume?') && deleteResume(resume.id)}
                      className="p-1.5 rounded-lg hover:bg-red-100 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Profession Modal */}
      {showProfessions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-black">
              <h2 className="text-2xl font-bold">Browse by Profession
              </h2>

              

              <button onClick={() => { setShowProfessions(false); setSelectedProfession(null); }}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex border-b border-black">
              {(['IT', 'Non-IT', 'Arts'] as const).map((tab) => (
                <button key={tab}
                  onClick={() => { setActiveTab(tab); setSelectedProfession(null); }}
                  className={`flex-1 py-3 font-medium transition-colors ${activeTab === tab ? 'bg-black text-white' : 'hover:bg-gray-100'}`}>
                  {tab} (15)
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto p-6 min-h-0">
              <div className="grid grid-cols-3 gap-3">
                {professions[activeTab].map((profession) => (
                  <button key={profession}
                    onClick={() => setSelectedProfession(profession)}
                    className={`p-3 border text-left text-sm transition-colors ${selectedProfession === profession ? 'bg-black text-white border-black' : 'border-black hover:bg-gray-50'}`}>
                    {profession}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-black flex justify-between items-center">
              <p className="text-gray-600">{selectedProfession ? `Selected: ${selectedProfession}` : 'Select a profession to continue'}</p>
              <button onClick={handleSelectProfession} disabled={!selectedProfession}
                className="px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
                Choose Template →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Template Selection Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-black">
              <div>
                <h2 className="text-2xl font-bold">Choose a Template</h2>
                <p className="text-gray-600 text-sm mt-1">For: {selectedProfession}</p>
              </div>
              <button onClick={() => setShowTemplates(false)}><X className="w-6 h-6" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-3 gap-6">
  {resumeTemplates
    .filter((template) => {
      const nonItArtsOnly = ['pinkfloral', 'cubist', 'playful'];
      if (nonItArtsOnly.includes(template.id)) {
        return activeTab === 'Non-IT' || activeTab === 'Arts';
      }
      return true;
    })
    .map((template) => (
                  <div key={template.id} onClick={() => setSelectedTemplate(template.id)}
                    className={`cursor-pointer border-2 transition-all ${selectedTemplate === template.id ? 'border-black shadow-lg' : 'border-gray-200 hover:border-gray-400'}`}>
                    <div className="h-48 overflow-hidden border-b border-gray-200 relative">
                      {template.preview}
                      {selectedTemplate === template.id && (
                        <div className="absolute top-2 right-2 bg-black text-white rounded-full p-1">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold">{template.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">{template.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-black flex justify-between items-center">
              <button onClick={() => { setShowTemplates(false); setShowProfessions(true); }}
                className="px-6 py-3 border border-black hover:bg-gray-100 transition-colors">
                ← Back
              </button>
              <button onClick={handleUseTemplate}
                className="px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors">
                Use {resumeTemplates.find(t => t.id === selectedTemplate)?.name} Template →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}