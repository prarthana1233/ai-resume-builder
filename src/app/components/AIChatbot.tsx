import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Send, Bot, User, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { ChatMessage } from '../types/resume';
import { toast } from 'sonner';

export default function AIChatbot() {
  const navigate = useNavigate();
  const { createNewResume, currentResume, updatePersonalInfo, updateSkills,
    addExperience, addEducation, updateSummary } = useResume();
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: '1',
    role: 'assistant',
    content: "Hello! I'm your AI Resume Assistant. I can help you in two ways:\n\n1. **Build Resume** - Chat with me and I'll help you create a professional resume step by step.\n\n2. **Tailor to Job** - Paste a job description and I'll customize your resume to match.\n\nClick a button above or just start typing!",
    timestamp: new Date()
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'chat' | 'tailor'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentResume) createNewResume();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const buildSystemPrompt = () => {
    const resumeContext = currentResume ? `
Current resume data:
- Name: ${currentResume.personalInfo?.fullName || 'Not set'}
- Email: ${currentResume.personalInfo?.email || 'Not set'}
- Phone: ${currentResume.personalInfo?.phone || 'Not set'}
- Skills: ${currentResume.skills?.join(', ') || 'Not set'}
- Summary: ${currentResume.summary || 'Not set'}
- Experience: ${currentResume.experience?.length || 0} entries
- Education: ${currentResume.education?.length || 0} entries
` : '';

    if (mode === 'tailor') {
      return `You are an expert resume writer and career coach. The user will paste a job description and you will:
1. Analyze the key requirements, skills, and keywords
2. Suggest how to tailor their resume to match the job
3. Rewrite their professional summary to match the role
4. Suggest which skills to highlight
5. Give ATS optimization tips

${resumeContext}

When you identify specific resume updates, format them clearly like:
SUMMARY: [new summary text]
SKILLS: [comma separated skills to add]
Be conversational but actionable.`;
    }

    return `You are an expert resume writer helping build a professional resume through conversation.
${resumeContext}
Guide the user to provide their information naturally. Ask one section at a time.
Be encouraging and professional. Help improve their descriptions to sound more impactful.
After collecting all info (name, email, phone, location, summary, experience, education, skills),
output the complete resume data wrapped in <RESUME_DATA> tags as JSON with this structure:
<RESUME_DATA>
{
  "personalInfo": { "fullName": "", "email": "", "phone": "", "location": "", "linkedIn": "", "github": "", "portfolio": "" },
  "summary": "",
  "experience": [{ "id": "exp-1", "company": "", "position": "", "location": "", "startDate": "YYYY-MM", "endDate": "YYYY-MM", "current": false, "description": [] }],
  "education": [{ "id": "edu-1", "institution": "", "degree": "", "field": "", "startDate": "YYYY-MM", "endDate": "YYYY-MM", "gpa": "", "description": "" }],
  "skills": [],
  "projects": [],
  "certifications": [],
  "achievements": []
}
</RESUME_DATA>`;
  };

  const parseAndFillResume = (content: string) => {
    const match = content.match(/<RESUME_DATA>([\s\S]*?)<\/RESUME_DATA>/);
    if (!match) return false;
    try {
      const data = JSON.parse(match[1].trim());
      if (data.personalInfo && currentResume) {
        updatePersonalInfo({ ...currentResume.personalInfo, ...data.personalInfo });
      }
      if (data.summary) updateSummary(data.summary);
      if (data.skills?.length) updateSkills(data.skills);
      if (data.experience?.length) data.experience.forEach((exp: any) => addExperience(exp));
      if (data.education?.length) data.education.forEach((edu: any) => addEducation(edu));
      toast.success('Resume filled! Click "Continue to Editor" to review.');
      return true;
    } catch (e) {
      console.error('Parse error:', e);
      return false;
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const apiMessages = updatedMessages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      }));

      const response = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: buildSystemPrompt(),
          messages: apiMessages
        })
      });

      const data = await response.json();
      const aiResponse = data.content || 'Sorry, I could not generate a response.';

      if (mode === 'tailor') {
        const summaryMatch = aiResponse.match(/\*\*SUMMARY:\*\*\s*(.+?)(?=\n\n|\*\*|$)/s) ||
                             aiResponse.match(/SUMMARY:\s*(.+?)(?=\n\n|SKILLS:|$)/s);
        const skillsMatch = aiResponse.match(/\*\*SKILLS:\*\*\s*(.+?)(?=\n\n|\*\*|$)/s) ||
                            aiResponse.match(/SKILLS:\s*(.+?)(?=\n\n|$)/s);

        let updated = false;

        if (summaryMatch) {
          updateSummary(summaryMatch[1].trim());
          sessionStorage.setItem('ai_summary', summaryMatch[1].trim());
          updated = true;
        }

        if (skillsMatch) {
          const skills = skillsMatch[1].split(',').map((s: string) => s.trim()).filter(Boolean);
          updateSkills(skills);
          sessionStorage.setItem('ai_skills', JSON.stringify(skills));
          updated = true;
        }

        if (updated) {
          toast.success('✅ Resume tailored! Redirecting to editor...');
          setTimeout(() => navigate('/builder/new'), 2000);
        }
      } else {
        parseAndFillResume(aiResponse);
      }

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: aiResponse.replace(/<RESUME_DATA>[\s\S]*?<\/RESUME_DATA>/g,
          '\n✅ Resume data has been filled! Click "Continue to Editor" to review.'),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to get response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const switchMode = (newMode: 'chat' | 'tailor') => {
    setMode(newMode);
    const modeMessage = newMode === 'tailor'
      ? "Great! Paste the job description below and I'll analyze it and tailor your resume to match perfectly."
      : "Let's build your resume! Start by telling me your full name.";
    setMessages(prev => [...prev, {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: modeMessage,
      timestamp: new Date()
    }]);
  };

  return (
    <div className="h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #ede9fe 0%, #e0f2fe 50%, #fce7f3 100%)' }}>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 border border-gray-300 hover:bg-gray-100 transition-colors rounded"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div>
            <h1 className="font-bold text-xl text-gray-900">AI Resume Assistant</h1>
            <p className="text-sm text-gray-500">Powered by Groq</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => switchMode('chat')}
            className={`px-4 py-2 border transition-colors rounded ${
              mode === 'chat'
                ? 'bg-black text-white border-black'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            Build Resume
          </button>
          <button
            onClick={() => switchMode('tailor')}
            className={`px-4 py-2 border transition-colors flex items-center gap-2 rounded ${
              mode === 'tailor'
                ? 'bg-black text-white border-black'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Tailor to Job
          </button>
          <button
            onClick={() => navigate('/builder/new')}
            className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors rounded"
          >
            Continue to Editor
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8" style={{ background: 'transparent' }}>
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center flex-shrink-0 rounded-full">
                  <Bot className="w-5 h-5" />
                </div>
              )}
              <div className={`max-w-[70%] p-4 rounded-lg shadow-sm ${
                message.role === 'user'
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-800 border border-gray-200'
              }`}>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
              </div>
              {message.role === 'user' && (
                <div className="w-10 h-10 bg-gray-200 flex items-center justify-center flex-shrink-0 rounded-full">
                  <User className="w-5 h-5 text-gray-700" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-black text-white flex items-center justify-center flex-shrink-0 rounded-full">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 shadow-sm">
        <div className="max-w-3xl mx-auto flex gap-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={mode === 'tailor' ? 'Paste job description here...' : 'Type your response...'}
            disabled={loading}
            rows={3}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100 resize-none text-gray-900 placeholder-gray-400"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors disabled:bg-gray-300 flex items-center gap-2 self-end rounded-lg"
          >
            <Send className="w-5 h-5" />
            Send
          </button>
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">
          Press Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}