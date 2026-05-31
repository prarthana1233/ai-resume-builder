import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useResume } from '../context/ResumeContext';
import { toast } from 'sonner';
import { Upload, FileText, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ResumeUpload() {
  const navigate = useNavigate();
  const { createNewResume, updatePersonalInfo, updateSummary, updateSkills,
    addExperience, addEducation, currentResume } = useResume();
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string || '');
      reader.readAsText(file);
    });
  };

  const parseResumeWithAI = async (text: string) => {
    const response = await fetch('http://localhost:5000/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system: `You are a resume parser. Extract information from the resume text and return ONLY a valid JSON object with this exact structure, no other text:
{
  "personalInfo": {
    "fullName": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedIn": "",
    "github": "",
    "portfolio": ""
  },
  "summary": "",
  "education": [
    {
      "id": "edu-1",
      "institution": "",
      "degree": "",
      "field": "",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "gpa": "",
      "description": ""
    }
  ],
  "experience": [
    {
      "id": "exp-1",
      "company": "",
      "position": "",
      "location": "",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "current": false,
      "description": ["bullet point 1", "bullet point 2"]
    }
  ],
  "projects": [
    {
      "id": "proj-1",
      "name": "",
      "description": "",
      "technologies": ["tech1", "tech2"],
      "link": "",
      "github": ""
    }
  ],
  "skills": ["skill1", "skill2"],
  "certifications": [
    {
      "id": "cert-1",
      "name": "",
      "issuer": "",
      "date": "YYYY-MM",
      "credentialId": ""
    }
  ],
  "achievements": ["achievement1"],
  "languages": [],
  "hobbies": []
}`,
        messages: [{ role: 'user', content: `Parse this resume and return JSON only. Be concise, no extra text:\n\n${text}` }]
      })
    });
    const data = await response.json();
if (Array.isArray(data.content)) {
  return data.content.map((c: any) => c.text || '').join('');
}
return data.content;
  };

  const handleFile = async (file: File) => {
  if (!file) return;

  setFileName(file.name);
  setUploading(true);

  try {
    let text = '';
    console.log('Step 1: Reading file', file.name, file.type);

    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      text = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string || '');
        reader.readAsText(file);
      });
    } else {
      const formData = new FormData();
      formData.append('resume', file);
      const res = await fetch('http://localhost:5000/api/ai/extract', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('Extraction failed');
      const data = await res.json();
      text = typeof data.text === 'object' ? data.text.text : data.text;
      console.log('Extracted text preview:', text?.substring(0, 200));
    }

    console.log('Step 2: Text extracted, length:', text.length);

    if (!text || text.length < 10) {
      toast.error('Could not extract text. Please try a different file.');
      setUploading(false);
      return;
    }

    console.log('Step 3: Sending to AI...');
    const aiResponse = await parseResumeWithAI(text);
    console.log('Step 4: AI response:', aiResponse);

    const cleanJson = aiResponse.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleanJson);
    console.log('Step 5: Parsed JSON:', parsed);

    sessionStorage.setItem('uploadedResume', JSON.stringify(parsed));
    console.log('Step 6: Saved to sessionStorage');

    setUploaded(true);
    toast.success('Resume parsed! Redirecting to editor...');
    setTimeout(() => navigate('/builder/new'), 2000);

  } catch (error) {
    console.error('Error at step:', error);
    toast.error('Failed to parse resume. Please try again.');
  } finally {
    setUploading(false);
  }
};

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #ede9fe 0%, #e0f2fe 50%, #fce7f3 100%)' }}>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div>
            <h1 className="font-bold text-xl text-gray-900">Upload Resume</h1>
            <p className="text-sm text-gray-500">Upload your existing resume to auto-fill the editor</p>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-16">

        {/* Upload Area */}
        {!uploaded ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => !uploading && fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-16 text-center cursor-pointer transition-colors ${
              dragging
                ? 'border-black bg-gray-100'
                : 'border-gray-300 bg-white hover:border-black hover:bg-gray-50'
            }`}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
              className="hidden"
            />

            {uploading ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-gray-600" />
                <div>
                  <p className="font-bold text-lg text-gray-900">Analyzing {fileName}...</p>
                  <p className="text-gray-500 mt-1">AI is extracting your resume information</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-500" />
                </div>
                <div>
                  <p className="font-bold text-lg text-gray-900">Drop your resume here</p>
                  <p className="text-gray-500 mt-1">or click to browse files</p>
                  <p className="text-sm text-gray-400 mt-2">Supports PDF, Word (.doc, .docx), Text (.txt)</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="border-2 border-green-200 bg-green-50 rounded-xl p-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
              <div>
                <p className="font-bold text-lg text-gray-900">Resume parsed successfully!</p>
                <p className="text-gray-500 mt-1">Redirecting to editor...</p>
              </div>
            </div>
          </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          {[
            { icon: '📄', title: 'Upload', desc: 'Upload your existing resume file' },
            { icon: '🤖', title: 'AI Parses', desc: 'AI extracts all your information' },
            { icon: '✏️', title: 'Edit', desc: 'Edit and customize in the builder' }
          ].map((item) => (
            <div key={item.title} className="bg-white border border-gray-200 rounded-xl p-5 text-center shadow-sm">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Manual option */}
        <div className="mt-8 text-center">
          <p className="text-gray-500">Prefer to start fresh?</p>
          <button
            onClick={() => { createNewResume(); navigate('/builder/new'); }}
            className="mt-3 px-6 py-2 border border-gray-300 bg-white rounded hover:bg-black hover:text-white hover:border-black transition-colors text-gray-700"
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Build from Scratch
          </button>
        </div>
      </div>
    </div>
  );
}