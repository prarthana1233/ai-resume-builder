import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useResume } from '../context/ResumeContext';
import { ArrowLeft, TrendingUp, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

interface ATSResult {
  overallScore: number;
  sections: {
    name: string;
    score: number;
    maxScore: number;
    status: 'good' | 'warning' | 'bad';
    feedback: string;
  }[];
  missingKeywords: string[];
  suggestions: string[];
  strengths: string[];
}

export default function ATSScore() {
  const navigate = useNavigate();
  const { currentResume } = useResume();
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<ATSResult | null>(null);

  const analyzeResume = async () => {
    if (!currentResume) return;
    setAnalyzing(true);

    try {
      const resumeText = `
        Name: ${currentResume.personalInfo.fullName}
        Email: ${currentResume.personalInfo.email}
        Phone: ${currentResume.personalInfo.phone}
        Location: ${currentResume.personalInfo.location}
        Summary: ${currentResume.summary}
        Skills: ${currentResume.skills.join(', ')}
        Experience: ${currentResume.experience.map(e => `${e.position} at ${e.company} - ${e.description.join('. ')}`).join('\n')}
        Education: ${currentResume.education.map(e => `${e.degree} in ${e.field} from ${e.institution}`).join('\n')}
        Projects: ${currentResume.projects.map(p => `${p.name}: ${p.description}`).join('\n')}
        Certifications: ${currentResume.certifications.map(c => c.name).join(', ')}
        Achievements: ${currentResume.achievements.join(', ')}
      `;

      const response = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: `You are an ATS (Applicant Tracking System) expert. Analyze the resume and return ONLY a valid JSON object with no extra text:
{
  "overallScore": <number 0-100>,
  "sections": [
    { "name": "Contact Information", "score": <0-15>, "maxScore": 15, "status": <"good"|"warning"|"bad">, "feedback": "<string>" },
    { "name": "Professional Summary", "score": <0-15>, "maxScore": 15, "status": <"good"|"warning"|"bad">, "feedback": "<string>" },
    { "name": "Work Experience", "score": <0-25>, "maxScore": 25, "status": <"good"|"warning"|"bad">, "feedback": "<string>" },
    { "name": "Education", "score": <0-15>, "maxScore": 15, "status": <"good"|"warning"|"bad">, "feedback": "<string>" },
    { "name": "Skills", "score": <0-15>, "maxScore": 15, "status": <"good"|"warning"|"bad">, "feedback": "<string>" },
    { "name": "Action Verbs", "score": <0-10>, "maxScore": 10, "status": <"good"|"warning"|"bad">, "feedback": "<string>" },
    { "name": "Quantified Achievements", "score": <0-5>, "maxScore": 5, "status": <"good"|"warning"|"bad">, "feedback": "<string>" }
  ],
  "missingKeywords": ["<keyword1>", "<keyword2>"],
  "suggestions": ["<suggestion1>", "<suggestion2>", "<suggestion3>"],
  "strengths": ["<strength1>", "<strength2>"]
}`,
          messages: [{ role: 'user', content: `Analyze this resume for ATS compatibility:\n\n${resumeText}` }]
        })
      });

      const data = await response.json();
      const clean = data.content.replace(/```json|```/g, '').trim();
      const parsed: ATSResult = JSON.parse(clean);
      setResult(parsed);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return '#22c55e';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const getStatusIcon = (status: 'good' | 'warning' | 'bad') => {
    if (status === 'good')    return <CheckCircle className="w-5 h-5" style={{ color: '#22c55e' }} />;
    if (status === 'warning') return <AlertCircle className="w-5 h-5" style={{ color: '#f59e0b' }} />;
    return <XCircle className="w-5 h-5" style={{ color: '#ef4444' }} />;
  };

  const circumference = 2 * Math.PI * 54;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 shadow-sm">
        <button onClick={() => navigate('/dashboard')}
          className="p-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div>
          <h1 className="font-bold text-xl text-gray-900">ATS Score Checker</h1>
          <p className="text-sm text-gray-500">Analyze your resume's ATS compatibility</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* No resume warning */}
        {!currentResume?.personalInfo.fullName && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <p className="text-yellow-800 text-sm">
              Your resume looks empty. <button onClick={() => navigate('/builder/new')} className="underline font-medium">Fill in your resume</button> first for accurate results.
            </p>
          </div>
        )}

        {/* Analyze button — before results */}
        {!result && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <TrendingUp className="w-10 h-10 text-gray-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your ATS Score</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Our AI will analyze your resume against ATS criteria and give you a detailed compatibility report.
            </p>
            <button
              onClick={analyzeResume}
              disabled={analyzing}
              className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 inline-flex items-center gap-2 font-medium"
            >
              {analyzing ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</>
              ) : (
                <><TrendingUp className="w-5 h-5" /> Analyze My Resume</>
              )}
            </button>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6">

            {/* Overall Score Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 flex flex-col md:flex-row items-center gap-8">
              {/* Circle score */}
              <div className="flex-shrink-0">
                <svg width="140" height="140" viewBox="0 0 140 140">
                  <circle cx="70" cy="70" r="54" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                  <circle
                    cx="70" cy="70" r="54"
                    fill="none"
                    stroke={getScoreColor(result.overallScore)}
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - (result.overallScore / 100) * circumference}
                    transform="rotate(-90 70 70)"
                    style={{ transition: 'stroke-dashoffset 1s ease' }}
                  />
                  <text x="70" y="65" textAnchor="middle" fontSize="28" fontWeight="bold" fill={getScoreColor(result.overallScore)}>
                    {result.overallScore}
                  </text>
                  <text x="70" y="85" textAnchor="middle" fontSize="12" fill="#9ca3af">out of 100</text>
                </svg>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {result.overallScore >= 75 ? '🎉 Great Score!' : result.overallScore >= 50 ? '⚠️ Needs Improvement' : '❌ Low ATS Score'}
                </h2>
                <p className="text-gray-500 mb-4">
                  {result.overallScore >= 75
                    ? 'Your resume is well-optimized for ATS systems.'
                    : result.overallScore >= 50
                    ? 'Your resume passes basic ATS checks but has room for improvement.'
                    : 'Your resume may get filtered out by ATS systems. Follow the suggestions below.'}
                </p>
                <button
                  onClick={() => { setResult(null); analyzeResume(); }}
                  className="px-5 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  Re-analyze
                </button>
              </div>
            </div>

            {/* Section Breakdown */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-5">Section Breakdown</h3>
              <div className="space-y-4">
                {result.sections.map((section, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(section.status)}
                        <span className="font-medium text-gray-800">{section.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-600">{section.score}/{section.maxScore}</span>
                    </div>
                    {/* Progress bar */}
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${(section.score / section.maxScore) * 100}%`,
                          background: section.status === 'good' ? '#22c55e' : section.status === 'warning' ? '#f59e0b' : '#ef4444'
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">{section.feedback}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Two column: Strengths + Missing Keywords */}
            <div className="grid md:grid-cols-2 gap-6">

              {/* Strengths */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-4">✅ Strengths</h3>
                <ul className="space-y-2">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Missing Keywords */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-4">🔍 Missing Keywords</h3>
                {result.missingKeywords.length === 0 ? (
                  <p className="text-sm text-gray-500">No major missing keywords found!</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {result.missingKeywords.map((kw, i) => (
                      <span key={i} className="px-2 py-1 bg-red-50 border border-red-200 text-red-700 rounded text-xs font-medium">
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4">💡 Suggestions to Improve</h3>
              <ul className="space-y-3">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Go fix it button */}
            <div className="text-center pb-6">
              <button
                onClick={() => navigate('/builder/new')}
                className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Go Fix My Resume →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}