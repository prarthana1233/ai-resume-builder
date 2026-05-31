import { FileText, Sparkles, Download, ArrowRight, Zap, Shield, Star, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useEffect, useRef, useState } from 'react';

function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

export default function LandingPage() {
  const navigate = useNavigate();

  const featuresReveal = useScrollReveal();
  const stepsReveal    = useScrollReveal();
  const benefitsReveal = useScrollReveal();

  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'AI-Powered Resume Builder',
      description: 'Our intelligent chatbot guides you through creating a professional resume with AI-enhanced content.'
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'ATS-Friendly Templates',
      description: 'Clean, professional single-page templates optimized for Applicant Tracking Systems.'
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: 'Multiple Export Formats',
      description: 'Download your resume in PDF or DOCX format, perfectly formatted for printing.'
    }
  ];

  const steps = [
    'Create an account or log in',
    'Chat with our AI to build your resume',
    'Choose from professional templates',
    'Download and apply with confidence'
  ];

  const benefits = [
    { icon: <Zap className="w-5 h-5" />,     text: 'AI-powered content enhancement',                   iconBg: '#F48FB1', card: '#F06292' },
    { icon: <FileText className="w-5 h-5" />, text: 'Professional resume template designs',              iconBg: '#A5D6A7', card: '#2E7D32' },
    { icon: <Rocket className="w-5 h-5" />,   text: 'Resume optimization for specific job descriptions', iconBg: '#FFE082', card: '#F9A825' },
    { icon: <Star className="w-5 h-5" />,     text: 'Cover letter assistance',                           iconBg: '#80DEEA', card: '#00ACC1' },
    { icon: <Shield className="w-5 h-5" />,   text: 'Unlimited resume creation and editing',             iconBg: '#CE93D8', card: '#7B1FA2' },
    { icon: <Download className="w-5 h-5" />, text: 'Multiple export formats (PDF, DOCX)',               iconBg: '#FFAB91', card: '#E64A19' },
  ];

  const featureAnims = ['anim-bounce', 'anim-jump', 'anim-slide', 'anim-flip'];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' }}>

      <style>{`
        @keyframes bounce-in {
          0%   { transform: scale(0.3);   opacity: 0; }
          50%  { transform: scale(1.08);  opacity: 1; }
          70%  { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        @keyframes jump-in {
          0%   { transform: translateY(80px);  opacity: 0; }
          60%  { transform: translateY(-12px); opacity: 1; }
          80%  { transform: translateY(4px); }
          100% { transform: translateY(0); }
        }
        @keyframes slide-right {
          0%   { transform: translateX(80px); opacity: 0; }
          100% { transform: translateX(0);    opacity: 1; }
        }
        @keyframes flip-drop {
          0%   { transform: rotateX(-90deg) translateY(40px); opacity: 0; }
          100% { transform: rotateX(0deg)   translateY(0);    opacity: 1; }
        }
        @keyframes fade-up {
          0%   { transform: translateY(50px); opacity: 0; }
          100% { transform: translateY(0);    opacity: 1; }
        }
        @keyframes slide-left {
          0%   { transform: translateX(-60px); opacity: 0; }
          100% { transform: translateX(0);     opacity: 1; }
        }
        @keyframes float {
          from { transform: translateY(0px) rotate(0deg); }
          to   { transform: translateY(-20px) rotate(10deg); }
        }

        .anim-bounce { animation: bounce-in   0.7s cubic-bezier(.36,.07,.19,.97) both; }
        .anim-jump   { animation: jump-in     0.7s ease-out 0.15s both; }
        .anim-slide  { animation: slide-right 0.7s ease-out 0.3s  both; }
        .anim-flip   { animation: flip-drop   0.7s ease-out 0.45s both; perspective: 600px; }

        .anim-fade-up-0 { animation: fade-up 0.6s ease-out 0s    both; }
        .anim-fade-up-1 { animation: fade-up 0.6s ease-out 0.2s  both; }
        .anim-fade-up-2 { animation: fade-up 0.6s ease-out 0.4s  both; }
        .anim-fade-up-3 { animation: fade-up 0.6s ease-out 0.6s  both; }

        .anim-sleft-0 { animation: slide-left 0.5s ease-out 0s    both; }
        .anim-sleft-1 { animation: slide-left 0.5s ease-out 0.1s  both; }
        .anim-sleft-2 { animation: slide-left 0.5s ease-out 0.2s  both; }
        .anim-sleft-3 { animation: slide-left 0.5s ease-out 0.3s  both; }
        .anim-sleft-4 { animation: slide-left 0.5s ease-out 0.4s  both; }
        .anim-sleft-5 { animation: slide-left 0.5s ease-out 0.5s  both; }

        .scroll-hidden { opacity: 0; }

        .card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .card-hover:hover { transform: translateY(-8px) scale(1.03); box-shadow: 0 16px 40px rgba(255,255,255,0.25); }

        .benefit-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .benefit-card:hover { transform: translateY(-6px) scale(1.02); box-shadow: 0 16px 40px rgba(0,0,0,0.25); }

        .nav-btn-outline:hover { background: rgba(255,255,255,0.15) !important; }
        .btn-white:hover { background: #f3e8ff !important; }
      `}</style>

      {/* Floating background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="absolute rounded-full"
            style={{
              width: `${80 + i * 60}px`,
              height: `${80 + i * 60}px`,
              background: i % 2 === 0 ? 'rgba(255,255,255,0.08)' : 'rgba(253,230,138,0.1)',
              top: `${10 + i * 16}%`,
              left: `${5 + i * 18}%`,
              animation: `float ${3 + i}s ease-in-out infinite alternate`
            }} />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #FFD700, #FF9F43)', boxShadow: '0 4px 15px rgba(255,215,0,0.4)' }}>
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-white">
              Resume<span style={{ color: '#FFD700' }}>AI</span>
            </span>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/login')}
              className="nav-btn-outline px-5 py-2.5 rounded-xl font-medium text-white transition-all"
              style={{ border: '1px solid rgba(255,255,255,0.3)', background: 'transparent' }}>
              Log In
            </button>
            <button onClick={() => navigate('/register')}
              className="btn-white px-5 py-2.5 rounded-xl font-bold transition-all"
              style={{ background: 'white', color: '#7c3aed' }}>
              Sign Up Free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full text-sm font-medium"
          style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
          <Sparkles className="w-4 h-4" />
          AI-Powered Resume Builder
        </div>
        <h1 className="text-6xl font-bold mb-6 leading-tight text-white">
          Build Your Perfect<br />
          <span style={{ background: 'linear-gradient(90deg, #fde68a, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Resume with AI
          </span>
        </h1>
        <p className="text-xl mb-10 max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.8)' }}>
          Create professional, ATS-friendly resumes in minutes with our AI-powered platform.
          Stand out from the competition and land your dream job.
        </p>
        <div className="flex gap-4 justify-center">
          <button onClick={() => navigate('/register')}
            className="btn-white px-8 py-4 rounded-2xl text-lg font-bold inline-flex items-center gap-2 transition-all hover:-translate-y-1 hover:shadow-2xl"
            style={{ background: 'white', color: '#7c3aed' }}>
            Get Started Free <ArrowRight className="w-5 h-5" />
          </button>
          <button onClick={() => navigate('/login')}
            className="nav-btn-outline px-8 py-4 rounded-2xl text-lg font-bold text-white transition-all"
            style={{ border: '1px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.1)' }}>
            Log In
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 py-20"
        style={{ background: 'rgba(255,255,255,0.1)', borderTop: '1px solid rgba(255,255,255,0.2)', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Why Choose ResumeAI?</h2>
          <div ref={featuresReveal.ref} className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index}
                className={`p-6 rounded-2xl card-hover ${featuresReveal.visible ? featureAnims[index] : 'scroll-hidden'}`}
                style={{
                  background: 'rgba(255,255,255,0.22)',
                  border: '1.5px solid rgba(255,255,255,0.35)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                }}>
                <div className="mb-4" style={{ color: 'white' }}>{feature.icon}</div>
                <h3 className="font-bold text-lg mb-2 text-white">{feature.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.75)' }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">How It Works</h2>
        <div ref={stepsReveal.ref} className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index}
              className={`text-center ${stepsReveal.visible ? `anim-fade-up-${index}` : 'scroll-hidden'}`}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4"
                style={{ background: 'white', color: '#7c3aed', boxShadow: '0 8px 20px rgba(255,255,255,0.3)' }}>
                {index + 1}
              </div>
              <p className="font-semibold text-white">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What You Get */}
      <section className="relative z-10 py-20"
        style={{ background: 'rgba(255,255,255,0.1)', borderTop: '1px solid rgba(255,255,255,0.2)', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4 text-white">What You Get</h2>
          <p className="text-center mb-12" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Everything you need to land your dream job
          </p>
          <div ref={benefitsReveal.ref} className="grid md:grid-cols-3 gap-5">
            {benefits.map((benefit, index) => (
              <div key={index}
                className={`benefit-card rounded-2xl p-5 flex flex-col items-start gap-4 ${benefitsReveal.visible ? `anim-sleft-${index}` : 'scroll-hidden'}`}
                style={{
                  background: benefit.card,
                  border: 'none',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: benefit.iconBg }}>
                  <div style={{ color: benefit.card }}>{benefit.icon}</div>
                </div>
                <p className="font-bold text-white text-base leading-snug"
                  style={{ textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
                  {benefit.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="p-12 rounded-3xl"
          style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.25)' }}>
          <h2 className="text-4xl font-bold mb-4 text-white">Ready to Build Your Resume?</h2>
          <p className="text-xl mb-10" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Join thousands of professionals who have landed their dream jobs with ResumeAI.
          </p>
          <button onClick={() => navigate('/register')}
            className="btn-white px-10 py-4 rounded-2xl text-lg font-bold inline-flex items-center gap-2 transition-all hover:-translate-y-1 hover:shadow-2xl"
            style={{ background: 'white', color: '#7c3aed' }}>
            Start Building Now <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8"
        style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}>
        <div className="max-w-7xl mx-auto px-6 text-center"
          style={{ color: 'rgba(255,255,255,0.6)' }}>
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #FFD700, #FF9F43)' }}>
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">
              Resume<span style={{ color: '#FFD700' }}>AI</span>
            </span>
          </div>
          <p>&copy; 2026 ResumeAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}