import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { FileText, Mail, ArrowRight, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

type Step = 'email' | 'otp';

export default function Login() {
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success(`Code sent to ${email}!`);
      setStep('otp');
      startCountdown();
    } catch (error: any) {
      toast.error(error.message || 'Failed to send code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      // Save user to localStorage and context
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      await loginWithToken(data.user);
      
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setResending(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success('New code sent!');
      setOtp('');
      startCountdown();
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6"
      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' }}>

      {/* Floating elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="absolute rounded-full"
            style={{
              width: `${60 + i * 40}px`, height: `${60 + i * 40}px`,
              background: 'rgba(255,255,255,0.08)',
              top: `${15 + i * 20}%`, left: `${10 + i * 20}%`,
              animation: `float ${3 + i}s ease-in-out infinite alternate`
            }} />
        ))}
      </div>

      <style>{`
        @keyframes float {
          from { transform: translateY(0px); }
          to { transform: translateY(-15px); }
        }
        .otp-input:focus { border-color: #7c3aed !important; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }
      `}</style>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.2)' }}>
              <FileText className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">
            {step === 'email' ? 'Welcome Back' : 'Check Your Email'}
          </h1>
          <p className="mt-2" style={{ color: 'rgba(255,255,255,0.75)' }}>
            {step === 'email'
              ? 'Enter your email to receive a login code'
              : `We sent a 6-digit code to ${email}`}
          </p>
        </div>

        {/* Card */}
        <div className="p-8 rounded-3xl shadow-2xl" style={{ background: 'white' }}>

          {step === 'email' ? (
            <form onSubmit={handleSendOTP} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#9ca3af' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm outline-none transition-all"
                    style={{ border: '2px solid #e5e7eb', background: '#f9fafb' }}
                    onFocus={e => e.target.style.borderColor = '#7c3aed'}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-white text-lg flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                {loading ? 'Sending...' : <>Send Code <ArrowRight className="w-5 h-5" /></>}
              </button>
            </form>

          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              {/* OTP display */}
              <div className="text-center p-4 rounded-2xl mb-2"
                style={{ background: '#f3f0ff' }}>
                <div className="text-4xl mb-2">📧</div>
                <p className="text-sm font-medium" style={{ color: '#7c3aed' }}>
                  Code sent to <strong>{email}</strong>
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>
                  Enter 6-Digit Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  required
                  maxLength={6}
                  className="otp-input w-full px-4 py-4 rounded-xl text-center text-3xl font-bold tracking-widest outline-none transition-all"
                  style={{ border: '2px solid #e5e7eb', background: '#f9fafb', letterSpacing: '0.5em', color: '#7c3aed' }}
                />
              </div>

              <button type="submit" disabled={loading || otp.length !== 6}
                className="w-full py-4 rounded-xl font-bold text-white text-lg transition-all hover:-translate-y-0.5 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                {loading ? 'Verifying...' : 'Verify & Login'}
              </button>

              {/* Resend */}
              <div className="text-center">
                <button type="button" onClick={handleResend}
                  disabled={countdown > 0 || resending}
                  className="flex items-center gap-2 mx-auto text-sm font-medium transition-all disabled:opacity-50"
                  style={{ color: countdown > 0 ? '#9ca3af' : '#7c3aed' }}>
                  <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                </button>
              </div>

              {/* Back */}
              <button type="button" onClick={() => { setStep('email'); setOtp(''); }}
                className="w-full text-center text-sm"
                style={{ color: '#6b7280' }}>
                ← Change email
              </button>
            </form>
          )}

          <p className="text-center mt-6 text-sm" style={{ color: '#6b7280' }}>
            Don't have an account?{' '}
            <button onClick={() => navigate('/register')}
              className="font-semibold" style={{ color: '#7c3aed' }}>
              Sign up free
            </button>
          </p>
        </div>

        <button onClick={() => navigate('/')}
          className="block mx-auto mt-4 text-sm"
          style={{ color: 'rgba(255,255,255,0.6)' }}>
          ← Back to home
        </button>
      </div>
    </div>
  );
}