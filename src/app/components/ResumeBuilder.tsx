import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useResume } from '../context/ResumeContext';
import { ArrowLeft, Save, Eye, Download, Plus, X, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import ResumePreview from './ResumePreview';
import PersonalInfoForm from './forms/PersonalInfoForm';
import ExperienceForm from './forms/ExperienceForm';
import EducationForm from './forms/EducationForm';
import ProjectsForm from './forms/ProjectsForm';
import SkillsForm from './forms/SkillsForm';
import CertificationsForm from './forms/CertificationsForm';

type Section = 'personal' | 'summary' | 'experience' | 'education' | 'projects' | 'skills' | 'certifications' | 'additional';

export default function ResumeBuilder() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentResume, saveResume, loadResume, createNewResume, setCurrentResume,
  updatePersonalInfo, updateSummary, updateSkills, addExperience, addEducation,
  addProject, addCertification, updateAchievements, updateLanguages, updateHobbies
} = useResume();
  const [activeSection, setActiveSection] = useState<Section>('personal');
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const [showTemplateModal, setShowTemplateModal] = useState(false);

 useEffect(() => {
  console.log('ResumeBuilder mounted, id:', id);
  
  const uploaded = sessionStorage.getItem('uploadedResume');
  const aiSummary = sessionStorage.getItem('ai_summary');
  const aiSkills = sessionStorage.getItem('ai_skills');

  if (uploaded) {
    const parsed = JSON.parse(uploaded);
    sessionStorage.removeItem('uploadedResume');
    setCurrentResume({
      id: `resume-${Date.now()}`,
      personalInfo: parsed.personalInfo || { fullName: '', email: '', phone: '' },
      summary: parsed.summary || '',
      education: parsed.education || [],
      experience: parsed.experience || [],
      projects: parsed.projects || [],
      skills: parsed.skills || [],
      certifications: parsed.certifications || [],
      achievements: parsed.achievements || [],
      languages: parsed.languages || [],
      hobbies: parsed.hobbies || [],
      template: 'classic',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } else if (aiSummary || aiSkills) {
    const newResume = {
      id: `resume-${Date.now()}`,
      personalInfo: { fullName: '', email: '', phone: '' },
      summary: aiSummary || '',
      education: [],
      experience: [],
      projects: [],
      skills: aiSkills ? JSON.parse(aiSkills) : [],
      certifications: [],
      achievements: [],
      languages: [],
      hobbies: [],
      template: 'classic',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    sessionStorage.removeItem('ai_summary');
    sessionStorage.removeItem('ai_skills');
    setCurrentResume(newResume);
  } else if (id && id !== 'new') {
    loadResume(id).then(() => {  
    });
  } else {
    createNewResume();
  }
}, []);

useEffect(() => {
    if (currentResume?.template) {
      setSelectedTemplate(currentResume.template);
    }
  }, [currentResume?.template]);

  const handleSave = async () => {
  if (!currentResume) return;
  if (!currentResume.personalInfo.fullName || !currentResume.personalInfo.email) {
    toast.error('Please fill in at least your name and email');
    return;
  }
  setSaving(true);
  try {
    // Save the currently selected template with the resume
    await saveResume({ ...currentResume, template: selectedTemplate });
  } catch (error) {
    console.error('Save error:', error);
  } finally {
    setSaving(false);
  }
};

  const handleExport = () => {
    setShowPreview(true);
    toast.success('Opening preview. Use browser print (Ctrl/Cmd+P) to save as PDF');
  };

  if (!currentResume) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  if (showPreview) {
    return (
      <div className="h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 40%, #16213e 70%, #0f3460 100%)' }}>
        <header className="border-b border-black px-6 py-4 flex items-center justify-between print:hidden">
          <button
  onClick={() => setShowPreview(false)}
  className="flex items-center gap-2 px-4 py-2 transition-colors"
  style={{ border: '1px solid rgba(255,255,255,0.5)', color: 'white', background: 'transparent' }}
  onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
  onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
>
  <ArrowLeft className="w-4 h-4" />
  Back to Editor
</button>
          <button
  onClick={() => {
    window.print();
    setTimeout(() => navigate('/feedback'), 1200);
  }}
  className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
>
  <Download className="w-4 h-4" />
  Print / Save as PDF
</button>
        </header>
        <div className="flex-1 overflow-auto bg-gray-100 p-8">
          <ResumePreview resume={currentResume} template={selectedTemplate} />
        </div>
      </div>
    );
  }

  const sections: { id: Section; label: string }[] = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'summary', label: 'Summary' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'additional', label: 'Additional' }
  ];

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="border-b border-black px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 border border-black hover:bg-black hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-xl">Resume Builder</h1>
            <p className="text-sm text-gray-700">
              {currentResume.personalInfo.fullName || 'New Resume'}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2 px-4 py-2 border border-black hover:bg-black hover:text-white transition-colors"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors disabled:bg-gray-400"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-black hover:bg-black hover:text-white transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => setShowTemplateModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-black hover:bg-black hover:text-white transition-colors"
          >
            Templates
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-black bg-gray-50 overflow-y-auto">
          <nav className="p-4 space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-4 py-3 border border-black transition-colors ${
                  activeSection === section.id
                    ? 'bg-black text-white'
                    : 'bg-white hover:bg-gray-100'
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            {activeSection === 'personal' && <PersonalInfoForm />}
            {activeSection === 'summary' && <SummaryForm />}
            {activeSection === 'experience' && <ExperienceForm />}
            {activeSection === 'education' && <EducationForm />}
            {activeSection === 'projects' && <ProjectsForm />}
            {activeSection === 'skills' && <SkillsForm />}
            {activeSection === 'certifications' && <CertificationsForm />}
            {activeSection === 'additional' && <AdditionalForm />}
          </div>
        </main>
      </div>

      
    
       {showTemplateModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div className="bg-white w-[900px] max-h-[90vh] overflow-y-auto p-8 border border-black">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Choose a Template</h2>
          <p className="text-gray-500 text-sm">For: {currentResume.personalInfo.fullName || 'Your Resume'}</p>
        </div>
        <button onClick={() => setShowTemplateModal(false)} className="p-2 hover:bg-gray-100 text-xl">✕</button>
      </div>

      <div className="grid grid-cols-4 gap-4 pb-4">
        {[
          { id: 'classic',    label: 'Classic',    desc: 'Clean and professional black & white layout' },
          { id: 'modern',     label: 'Modern',     desc: 'Two-column layout with dark sidebar' },
          { id: 'minimal',    label: 'Minimal',    desc: 'Simple and elegant single column' },
          { id: 'bold',       label: 'Bold',       desc: 'Strong black header with accent colors' },
          { id: 'elegant',    label: 'Elegant',    desc: 'Centered, fine lines, italic accents' },
          { id: 'creative',   label: 'Creative',   desc: 'Avatar initial, pill badges, two-column' },
          { id: 'pinkfloral', label: 'Pink Floral', desc: 'Elegant floral design with pink accents' },
          { id: 'cubist',  label: 'Cubist',  desc: 'Green sidebar with skill bars and photo placeholder' },
          { id: 'playful', label: 'Playful', desc: 'Navy sidebar with colorful blobs and accent bars' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTemplate(t.id)}
            className={`border-2 text-left transition-colors overflow-hidden ${
              selectedTemplate === t.id ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            {/* Mini Preview */}
            <div className="w-full overflow-hidden bg-white" style={{ height: '180px' }}>
              <div style={{ transform: 'scale(0.28)', transformOrigin: 'top left', width: '357%', pointerEvents: 'none' }}>
                <ResumePreview resume={currentResume} template={t.id} />
              </div>
            </div>

            {/* Label */}
            <div className="p-3 border-t border-gray-100">
              <div className="flex justify-between items-start">
                <p className="font-bold text-base">{t.label}</p>
                {selectedTemplate === t.id && <span>✓</span>}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={() => setShowTemplateModal(false)}
          className="px-6 py-2 border border-black hover:bg-gray-100"
        >
          ← Back
        
        </button>
        <button
          onClick={() => setShowTemplateModal(false)}
          className="px-6 py-2 bg-black text-white hover:bg-gray-800"
        >
          Use {selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)} Template →
        </button>
      </div>
    </div>
  </div>
)}

    </div>  
  );
}            

// ─── Summary Form Component ───────────────────────────────────────────
function SummaryForm() {
  const { currentResume, updateSummary } = useResume();
  const [summary, setSummary] = useState(currentResume?.summary || '');

  useEffect(() => {
    if (currentResume?.summary) setSummary(currentResume.summary);
  }, [currentResume?.summary]);

  const handleEnhance = () => {
    toast.success('AI enhancement coming soon!');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Professional Summary</h2>
      <div className="space-y-4">
        <div>
          <label className="block mb-2 font-medium">
            Summary
            <span className="text-sm text-gray-600 font-normal ml-2">
              2-3 sentences highlighting your professional background
            </span>
          </label>
          <textarea
            value={summary}
            onChange={(e) => {
              setSummary(e.target.value);
              updateSummary(e.target.value);
            }}
            rows={6}
            placeholder="Results-driven professional with expertise in..."
            className="w-full px-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <button
          onClick={handleEnhance}
          className="flex items-center gap-2 px-4 py-2 border border-black hover:bg-black hover:text-white transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          Enhance with AI
        </button>
      </div>
    </div>
  );
}

// ─── Additional Info Form Component ──────────────────────────────────
function AdditionalForm() {
  const { currentResume, updateAchievements, updateLanguages, updateHobbies, setCurrentResume } = useResume();
  const [achievements, setAchievements] = useState(currentResume?.achievements.join('\n') || '');
  const [languages, setLanguages] = useState(currentResume?.languages.join(', ') || '');
  const [hobbies, setHobbies] = useState(currentResume?.hobbies.join(', ') || '');
  const [declaration, setDeclaration] = useState((currentResume as any)?.declaration || '');

  useEffect(() => {
    if (currentResume?.achievements?.length) setAchievements(currentResume.achievements.join('\n'));
    if (currentResume?.languages?.length)    setLanguages(currentResume.languages.join(', '));
    if (currentResume?.hobbies?.length)      setHobbies(currentResume.hobbies.join(', '));
  }, [currentResume?.achievements, currentResume?.languages, currentResume?.hobbies]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Achievements</h2>
        <textarea
          value={achievements}
          onChange={(e) => {
            setAchievements(e.target.value);
            updateAchievements(e.target.value.split('\n').filter(a => a.trim()));
          }}
          rows={6}
          placeholder="One achievement per line&#10;Won 1st place in Hackathon 2023&#10;Published research paper in IEEE"
          className="w-full px-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Languages</h2>
        <input
          type="text"
          value={languages}
          onChange={(e) => {
            setLanguages(e.target.value);
            updateLanguages(e.target.value.split(',').map(l => l.trim()).filter(l => l));
          }}
          placeholder="English (Native), Spanish (Fluent), French (Conversational)"
          className="w-full px-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Hobbies & Interests</h2>
        <input
          type="text"
          value={hobbies}
          onChange={(e) => {
            setHobbies(e.target.value);
            updateHobbies(e.target.value.split(',').map(h => h.trim()).filter(h => h));
          }}
          placeholder="Photography, Open Source Contribution, Marathon Running"
          className="w-full px-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black"
        />
        <p className="text-sm text-gray-600 mt-2">
          Separate with commas. Optional section - include only if relevant to the position.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Declaration</h2>
        <textarea
          value={declaration}
          onChange={(e) => {
            setDeclaration(e.target.value);
            if (currentResume) {
              setCurrentResume({ ...currentResume, declaration: e.target.value } as any);
            }
          }}
          rows={4}
          placeholder="I hereby declare that all the information provided above is true and correct to the best of my knowledge and belief."
          className="w-full px-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black"
        />
        <p className="text-sm text-gray-600 mt-2">
          Optional but commonly required in Indian resumes. Placed at the end of the resume.
        </p>
      </div>
    </div>
  );
}