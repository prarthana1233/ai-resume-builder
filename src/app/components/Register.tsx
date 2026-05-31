import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { FileText, Mail, Lock, User, Chrome } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { register, googleLogin } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(email, password, name);
      navigate('/dashboard');
    } catch (error) {
      console.error('Register error:', error);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await googleLogin();
      navigate('/dashboard');
    } catch (error) {
      console.error('Google login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12"
      style={{ background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 40%, #16213e 70%, #0f3460 100%)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FileText className="w-8 h-8 text-white" />
            <span className="font-bold text-2xl text-white">ResumeAI</span>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-white">Create Account</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>Start building your professional resume today</p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-6 p-8 bg-white border border-black">
          {error && (
            <div className="p-3 border border-red-500 bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block mb-2 font-medium">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full pl-10 pr-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full pl-10 pr-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-black text-white hover:bg-gray-800 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3 border border-black hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-100"
          >
            <Chrome className="w-5 h-5" />
            Google
          </button>
        </form>

        <p className="text-center mt-6" style={{ color: 'rgba(255,255,255,0.7)' }}>
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="font-medium hover:underline text-white"
          >
            Log in
          </button>
        </p>

        <button
          onClick={() => navigate('/')}
          className="block mx-auto mt-4 hover:underline"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          Back to home
        </button>
      </div>
    </div>
  );
}