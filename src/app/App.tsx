import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ResumeProvider } from './context/ResumeContext';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AIChatbot from './components/AIChatbot';
import ResumeBuilder from './components/ResumeBuilder';
import ResumeUpload from './components/ResumeUpload';
import ATSScore from './components/ATSScore';
import FloatingAssistant from './components/FloatingAssistant'; 
import ResumeFeedback from './components/ResumeFeedback';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
console.log('ProtectedRoute check:', { user, loading });
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl">Loading...</p>
        
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function ConditionalChatbot() {
  const { user, loading } = useAuth();
  if (loading || !user) return null;
  return <AIChatbot />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/builder/:id"
        element={
          <ProtectedRoute>
            <ResumeBuilder />
          </ProtectedRoute>
        }
      />
      <Route path="/ats-score" element={<ProtectedRoute><ATSScore /></ProtectedRoute>} />
      
      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <ResumeUpload />
          </ProtectedRoute>
        }
      />
      <Route path="/feedback" element={<ResumeFeedback />} />
      <Route path="/ai-builder" element={<ProtectedRoute><AIChatbot /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
      );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ResumeProvider>
          <div className="size-full">
  <AppRoutes />
  <FloatingAssistant />
  <Toaster position="top-right" />
</div>
        </ResumeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}