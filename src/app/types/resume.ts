import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  id: String,
  personalInfo: {
    fullName: String,
    email: String,
    phone: String,
    linkedIn: String,
    github: String,
    portfolio: String,
    location: String,
  },
  summary: String,
  education: [{
    id: String,
    institution: String,
    degree: String,
    field: String,
    startDate: String,
    endDate: String,
    gpa: String,
    description: String,
  }],
  experience: [{
    id: String,
    company: String,
    position: String,
    location: String,
    startDate: String,
    endDate: String,
    current: Boolean,
    description: [String],
  }],
  projects: [{
    id: String,
    name: String,
    description: String,
    technologies: [String],
    link: String,
    github: String,
  }],
  skills: [String],
  certifications: [{
    id: String,
    name: String,
    issuer: String,
    date: String,
    credentialId: String,
  }],
  achievements: [String],
  languages: [String],
  hobbies: [String],
  template: String,
  atsScore: Number,
}, { timestamps: true });

export default mongoose.model('Resume', resumeSchema);
