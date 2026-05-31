import { User, ResumeData } from '../types/resume';

const USERS_KEY = 'mock_users';
const SESSION_KEY = 'mock_session';

function getUsers(): (User & { password: string })[] {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

function saveUsers(users: (User & { password: string })[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getSession(): User | null {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

function saveSession(user: User) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const mockApi = {
  getCurrentUser: async (): Promise<User | null> => {
    await delay(100);
    return getSession();
  },

  login: async (email: string, password: string): Promise<{ user: User }> => {
    await delay(500);
    const users = getUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) throw new Error('Invalid email or password');
    const { password: _p, ...user } = found;
    saveSession(user);
    return { user };
  },

  register: async (email: string, password: string, name: string): Promise<{ user: User }> => {
    await delay(500);
    const users = getUsers();
    if (users.find(u => u.email === email)) throw new Error('Email already exists');
    const user: User = {
      id: crypto.randomUUID(),
      email,
      name,
      createdAt: new Date().toISOString(),
    };
    saveUsers([...users, { ...user, password }]);
    saveSession(user);
    return { user };
  },

  googleLogin: async (): Promise<{ user: User }> => {
    await delay(500);
    const users = getUsers();
    const email = 'google@example.com';

    // Check if Google user already exists — reuse same id
    const existing = users.find(u => u.email === email);
    if (existing) {
      const { password: _p, ...user } = existing;
      saveSession(user);
      return { user };
    }

    // First time — create with fixed id
    const user: User = {
      id: 'google-user-fixed-id',
      email,
      name: 'Google User',
      createdAt: new Date().toISOString(),
    };
    saveUsers([...users, { ...user, password: '' }]);
    saveSession(user);
    return { user };
  },
  
  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  getResumes: async (userId: string): Promise<ResumeData[]> => {
    await delay(300);
    try {
      const stored = localStorage.getItem(`resumes_${userId}`);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  },

  saveResume: async (userId: string, resume: ResumeData): Promise<ResumeData> => {
    await delay(300);
    const resumes = await mockApi.getResumes(userId);
    const index = resumes.findIndex(r => r.id === resume.id);
    if (index >= 0) resumes[index] = resume;
    else resumes.push(resume);
    localStorage.setItem(`resumes_${userId}`, JSON.stringify(resumes));
    return resume;
  },

  deleteResume: async (userId: string, resumeId: string): Promise<void> => {
    await delay(300);
    const resumes = await mockApi.getResumes(userId);
    const filtered = resumes.filter(r => r.id !== resumeId);
    localStorage.setItem(`resumes_${userId}`, JSON.stringify(filtered));
  },
};