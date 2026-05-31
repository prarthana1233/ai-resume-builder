import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { MessageCircle, X, Send, Bot, Minimize2 } from 'lucide-react';

const ROUTE_CONTEXT: Record<string, string> = {
  '/dashboard': 'User is on the Dashboard. They can: 1) Use AI Resume Builder chatbot, 2) Build from Scratch, 3) Upload Existing resume, 4) Browse by Profession templates.',
  '/upload': 'User is on Upload Resume page. They can upload PDF, DOCX, or TXT resume files. AI will extract info and redirect to editor.',
  '/ai-builder': 'User is on AI Resume Builder chatbot page. They can chat to build resume or tailor it to a job description.',
  '/builder/new': 'User is in Resume Builder editor. They can fill: Personal Info, Summary, Experience, Education, Projects, Skills, Certifications, Additional sections. They can Preview, Save, Export, and choose Templates.',
};

const SYSTEM_PROMPT = `You are a friendly AI guide for ResumeAI, a resume building web app. 
You help users navigate and use the app. Keep responses SHORT (2-4 sentences max).

The app has these routes/features:
- Dashboard (/dashboard): 4 quick actions - AI Resume Builder, Build from Scratch, Upload Existing, Browse by Profession
- AI Resume Builder (/ai-builder): Chat with AI to build resume step by step or tailor to job description
- Upload Resume (/upload): Upload PDF/DOCX/TXT, AI extracts info, redirects to editor
- Resume Builder Editor (/builder/new): Fill sections - Personal Info, Summary, Experience, Education, Projects, Skills, Certifications, Additional. Has Preview, Save, Export, Templates buttons.
- Resume creation flow: Dashboard → choose action → fill editor → Preview → Export/Save as PDF

Give short, friendly, actionable guidance. If user asks how to do something, tell them exactly where to click.`;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function FloatingAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: "Hi! 👋 I'm your resume guide. Ask me anything about using this app!"
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open) {
      const context = ROUTE_CONTEXT[location.pathname];
      if (context) {
        const hint = getPageHint(location.pathname);
        if (hint && messages.length === 1) {
          setMessages(prev => [...prev, { role: 'assistant', content: hint }]);
        }
      }
    }
  }, [open, location.pathname]);

  const getPageHint = (path: string) => {
    const hints: Record<string, string> = {
      '/dashboard': "You're on the Dashboard! Choose from 4 options: AI Builder (chat-based), Build from Scratch, Upload Existing resume, or Browse by Profession.",
      '/upload': "Upload your resume here! Drag & drop or click to browse. Supports PDF, Word, and TXT files.",
      '/ai-builder': "Chat with AI to build your resume! Type your info naturally or paste a job description to tailor your resume.",
      '/builder/new': "You're in the editor! Fill each section from the left sidebar. Click Preview anytime to see how it looks.",
    };
    return hints[path] || null;
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: input };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const currentContext = ROUTE_CONTEXT[location.pathname] || 'User is navigating the app.';
      
      const response = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: `${SYSTEM_PROMPT}\n\nCurrent page context: ${currentContext}`,
          messages: updatedMessages
        })
      });

      const data = await response.json();
      const reply = data.content || "I'm not sure, but feel free to explore the app!";

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I couldn't connect. Try refreshing the page!"
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (location.pathname === '/ai-builder') return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {/* Chat Window */}
      {open && (
        <div
          className="w-80 flex flex-col shadow-2xl overflow-hidden"
          style={{
            height: '420px',
            borderRadius: '20px',
            background: '#1a1a2e',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
          >
            <div className="flex items-center gap-2">
              <div
                className="flex items-center justify-center"
                style={{
                  width: 32, height: 32,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                }}
              >
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-semibold text-sm text-white leading-tight">Resume Guide</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)' }}>AI-powered assistant</div>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <button onClick={() => setOpen(false)}>
                <Minimize2 className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.6)' }} />
              </button>
              <button onClick={() => {
                setOpen(false);
                setMessages([{
                  role: 'assistant',
                  content: "Hi! 👋 I'm your resume guide. Ask me anything about using this app!"
                }]);
              }}>
                <X className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.6)' }} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="max-w-[85%] px-3 py-2 text-sm"
                  style={msg.role === 'user' ? {
                    background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                    color: '#fff',
                    borderRadius: '14px 4px 14px 14px',
                  } : {
                    background: 'rgba(255,255,255,0.07)',
                    border: '0.5px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.88)',
                    borderRadius: '4px 14px 14px 14px',
                    lineHeight: 1.55,
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div
                  className="px-3 py-2 text-sm animate-pulse"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    border: '0.5px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.5)',
                    borderRadius: '4px 14px 14px 14px',
                  }}
                >
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div
            className="px-3 py-2 flex gap-2 overflow-x-auto"
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
          >
            {[
              { label: '🏠 Dashboard', path: '/dashboard' },
              { label: '📤 Upload', path: '/upload' },
              { label: '✏️ Editor', path: '/builder/new' },
            ].map(({ label, path }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className="whitespace-nowrap text-xs px-3 py-1 transition-all"
                style={{
                  borderRadius: '20px',
                  border: '0.5px solid rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.75)',
                  background: 'rgba(255,255,255,0.05)',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = 'rgba(124,58,237,0.4)';
                  e.currentTarget.style.borderColor = 'rgba(124,58,237,0.6)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div
            className="flex items-center gap-2 mx-3 mb-3 mt-1 px-3 py-2"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '0.5px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              disabled={loading}
              className="flex-1 bg-transparent text-sm focus:outline-none"
              style={{
                color: 'rgba(255,255,255,0.88)',
                caretColor: '#7c3aed',
              }}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="flex items-center justify-center transition-opacity"
              style={{
                width: 28, height: 28,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                opacity: loading || !input.trim() ? 0.4 : 1,
                flexShrink: 0,
              }}
            >
              <Send className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center justify-center shadow-lg transition-all"
        style={{
          width: 56, height: 56,
          borderRadius: '50%',
          background: open
            ? 'rgba(255,255,255,0.15)'
            : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
          border: '1px solid rgba(255,255,255,0.15)',
        }}
        onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.07)'; }}
        onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        {open ? <X className="w-5 h-5 text-white" /> : <MessageCircle className="w-5 h-5 text-white" />}
      </button>

    </div>
  );
}