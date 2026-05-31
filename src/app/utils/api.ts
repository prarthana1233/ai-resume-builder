const BASE_URL = 'http://localhost:5000/api';

export const api = {
  // Auth
  async register(name: string, email: string, password: string) {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    if (!res.ok) throw new Error('Registration failed');
    return res.json();
  },

  async login(email: string, password: string) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },

  // Resumes
  async getResumes(token: string) {
    const res = await fetch(`${BASE_URL}/resumes`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  async saveResume(resumeData: any, token: string) {
    const res = await fetch(`${BASE_URL}/resumes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(resumeData)
    });
    return res.json();
  }
};