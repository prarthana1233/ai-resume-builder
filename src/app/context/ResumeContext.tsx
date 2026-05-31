import { createContext, useContext, useState, ReactNode } from 'react';
import { ResumeData, PersonalInfo, Education, Experience, Project, Certification } from '../types/resume';
import { toast } from 'sonner';

interface ResumeContextType {
  currentResume: ResumeData | null;
  resumes: ResumeData[];
  loading: boolean;
  setCurrentResume: (resume: ResumeData | null) => void;
  createNewResume: () => void;
  loadUploadedResume: (data: Partial<ResumeData>) => void;
  saveResume: (resume: ResumeData) => Promise<void>;
  deleteResume: (resumeId: string) => Promise<void>;
  loadResumes: (userId: string) => Promise<void>;
  loadResume: (resumeId: string) => Promise<void>;
  updatePersonalInfo: (info: PersonalInfo) => void;
  updateSummary: (summary: string) => void;
  addEducation: (education: Education) => void;
  updateEducation: (id: string, education: Education) => void;
  deleteEducation: (id: string) => void;
  addExperience: (experience: Experience) => void;
  updateExperience: (id: string, experience: Experience) => void;
  deleteExperience: (id: string) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Project) => void;
  deleteProject: (id: string) => void;
  updateSkills: (skills: string[]) => void;
  addCertification: (cert: Certification) => void;
  deleteCertification: (id: string) => void;
  updateAchievements: (achievements: string[]) => void;
  updateLanguages: (languages: string[]) => void;
  updateHobbies: (hobbies: string[]) => void;
  updateTemplate: (template: string) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

const createEmptyResume = (): ResumeData => ({
  id: `resume-${Date.now()}`,
  personalInfo: { fullName: '', email: '', phone: '' },
  education: [],
  experience: [],
  projects: [],
  skills: [],
  certifications: [],
  achievements: [],
  languages: [],
  hobbies: [],
  template: 'classic',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

// ── Helper: get current userId from localStorage session ─────────────
const getCurrentUserId = (): string => {
  try {
    const user = localStorage.getItem('user');
    if (user) return JSON.parse(user).id;
    const session = localStorage.getItem('mock_session');
    if (session) return JSON.parse(session).id;
    return '';
  } catch {
    return '';
  }
};

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [currentResume, setCurrentResume] = useState<ResumeData | null>(null);
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [loading, setLoading] = useState(false);

  const createNewResume = () => {
    setCurrentResume(createEmptyResume());
  };

  // ── Loads a fully parsed resume (from upload) in one atomic update ──
  const loadUploadedResume = (data: Partial<ResumeData>) => {
    const base = createEmptyResume();
    setCurrentResume({
      ...base,
      ...data,
      personalInfo: { ...base.personalInfo, ...(data.personalInfo || {}) },
      education:      data.education      || [],
      experience:     data.experience     || [],
      projects:       data.projects       || [],
      skills:         data.skills         || [],
      certifications: data.certifications || [],
      achievements:   data.achievements   || [],
      languages:      data.languages      || [],
      hobbies:        data.hobbies        || [],
    });
  };

  // ── Save: always attach userId so backend can filter by user ────────
  const saveResume = async (resume: ResumeData) => {
    try {
      setLoading(true);
      const userId = getCurrentUserId();
      const res = await fetch('http://localhost:5000/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...resume, userId })
      });
      const savedResume = await res.json();
      setCurrentResume(savedResume);
      setResumes(prev => {
        const index = prev.findIndex(r => r.id === savedResume.id);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = savedResume;
          return updated;
        }
        return [...prev, savedResume];
      });
      toast.success('Resume saved successfully!');
    } catch (error) {
      toast.error('Failed to save resume.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────
  const deleteResume = async (resumeId: string) => {
    try {
      setLoading(true);
      await fetch(`http://localhost:5000/api/resumes/${resumeId}`, { method: 'DELETE' });
      setResumes(prev => prev.filter(r => r.id !== resumeId));
      if (currentResume?.id === resumeId) setCurrentResume(null);
      toast.success('Resume deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete resume.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ── Load all: pass userId as query param so backend filters ─────────
  const loadResumes = async (userId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/resumes?userId=${userId}`);
      const userResumes = await res.json();
      setResumes(Array.isArray(userResumes) ? userResumes : []);
    } catch (error) {
      toast.error('Failed to load resumes.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ── Load single resume by id ─────────────────────────────────────────
  const loadResume = async (resumeId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/resumes/${resumeId}`);
      const resume = await res.json();
      setCurrentResume(resume);
    } catch (error) {
      toast.error('Failed to load resume.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePersonalInfo = (info: PersonalInfo) => {
    setCurrentResume(prev => prev
      ? { ...prev, personalInfo: info }
      : { ...createEmptyResume(), personalInfo: info }
    );
  };

  const updateSummary = (summary: string) => {
    setCurrentResume(prev => prev
      ? { ...prev, summary }
      : { ...createEmptyResume(), summary }
    );
  };

  const addEducation = (education: Education) => {
    setCurrentResume(prev => {
      const base = prev || createEmptyResume();
      return { ...base, education: [...base.education, education] };
    });
  };

  const updateEducation = (id: string, education: Education) => {
    setCurrentResume(prev => {
      if (!prev) return prev;
      return { ...prev, education: prev.education.map(e => e.id === id ? education : e) };
    });
  };

  const deleteEducation = (id: string) => {
    setCurrentResume(prev => {
      if (!prev) return prev;
      return { ...prev, education: prev.education.filter(e => e.id !== id) };
    });
  };

  const addExperience = (experience: Experience) => {
    setCurrentResume(prev => {
      const base = prev || createEmptyResume();
      return { ...base, experience: [...base.experience, experience] };
    });
  };

  const updateExperience = (id: string, experience: Experience) => {
    setCurrentResume(prev => {
      if (!prev) return prev;
      return { ...prev, experience: prev.experience.map(e => e.id === id ? experience : e) };
    });
  };

  const deleteExperience = (id: string) => {
    setCurrentResume(prev => {
      if (!prev) return prev;
      return { ...prev, experience: prev.experience.filter(e => e.id !== id) };
    });
  };

  const addProject = (project: Project) => {
    setCurrentResume(prev => {
      const base = prev || createEmptyResume();
      return { ...base, projects: [...base.projects, project] };
    });
  };

  const updateProject = (id: string, project: Project) => {
    setCurrentResume(prev => {
      if (!prev) return prev;
      return { ...prev, projects: prev.projects.map(p => p.id === id ? project : p) };
    });
  };

  const deleteProject = (id: string) => {
    setCurrentResume(prev => {
      if (!prev) return prev;
      return { ...prev, projects: prev.projects.filter(p => p.id !== id) };
    });
  };

  const updateSkills = (skills: string[]) => {
    setCurrentResume(prev => prev
      ? { ...prev, skills }
      : { ...createEmptyResume(), skills }
    );
  };

  const addCertification = (cert: Certification) => {
    setCurrentResume(prev => {
      const base = prev || createEmptyResume();
      return { ...base, certifications: [...base.certifications, cert] };
    });
  };

  const deleteCertification = (id: string) => {
    setCurrentResume(prev => {
      if (!prev) return prev;
      return { ...prev, certifications: prev.certifications.filter(c => c.id !== id) };
    });
  };

  const updateAchievements = (achievements: string[]) => {
    setCurrentResume(prev => prev
      ? { ...prev, achievements }
      : { ...createEmptyResume(), achievements }
    );
  };

  const updateLanguages = (languages: string[]) => {
    setCurrentResume(prev => prev
      ? { ...prev, languages }
      : { ...createEmptyResume(), languages }
    );
  };

  const updateHobbies = (hobbies: string[]) => {
    setCurrentResume(prev => prev
      ? { ...prev, hobbies }
      : { ...createEmptyResume(), hobbies }
    );
  };

  const updateTemplate = (template: string) => {
    setCurrentResume(prev => prev
      ? { ...prev, template }
      : { ...createEmptyResume(), template }
    );
  };

  return (
    <ResumeContext.Provider value={{
      currentResume,
      resumes,
      loading,
      setCurrentResume,
      createNewResume,
      loadUploadedResume,
      saveResume,
      deleteResume,
      loadResumes,
      loadResume,
      updatePersonalInfo,
      updateSummary,
      addEducation,
      updateEducation,
      deleteEducation,
      addExperience,
      updateExperience,
      deleteExperience,
      addProject,
      updateProject,
      deleteProject,
      updateSkills,
      addCertification,
      deleteCertification,
      updateAchievements,
      updateLanguages,
      updateHobbies,
      updateTemplate,
    }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}