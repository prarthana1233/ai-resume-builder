import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useResume } from '../context/ResumeContext';
import { toast } from 'sonner';

const RATINGS = [
  { value: 1, emoji: '😞', label: 'Poor',      color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
  { value: 2, emoji: '😕', label: 'Fair',      color: '#f97316', bg: '#fff7ed', border: '#fed7aa' },
  { value: 3, emoji: '😐', label: 'Average',   color: '#eab308', bg: '#fefce8', border: '#fef08a' },
  { value: 4, emoji: '😊', label: 'Good',      color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0' },
  { value: 5, emoji: '🤩', label: 'Excellent', color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe' },
];

export default function ResumeFeedback() {
  const navigate          = useNavigate();
  const { user }          = useAuth();
  const { currentResume } = useResume();

  const [selected,    setSelected]    = useState<number | null>(null);
  const [hovered,     setHovered]     = useState<number | null>(null);
  const [comment,     setComment]     = useState('');
  const [submitting,  setSubmitting]  = useState(false);
  const [submitted,   setSubmitted]   = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(false);
  const [checking,    setChecking]    = useState(true);

  // Check if user already submitted feedback
  useEffect(() => {
  (async () => {
    try {
      const userId = user?.id || user?._id || null;
      const resumeId = currentResume?.id || null;

      console.log('Checking feedback for userId:', userId, 'resumeId:', resumeId);

      if (!userId || !resumeId) {
        setChecking(false);
        return;
      }

      const res = await fetch(`http://localhost:5000/api/feedback/check/${userId}/${resumeId}`);
      const data = await res.json();
      console.log('Check result:', data);

      if (data.exists === true) setAlreadyDone(true);

    } catch (err) {
      console.error('Check failed:', err);
      setAlreadyDone(false);
    } finally {
      setChecking(false);
    }
  })();
}, [user, currentResume]);

  const handleSubmit = async () => {
    if (!selected) return;
    setSubmitting(true);

    // Resolve userId — handle both id and _id
    const userId   = user?.id || user?._id || 'guest';
    const userName = user?.name || user?.email || 'Guest';

    const payload = {
      userId,
      userName,
      resumeId:    currentResume?.id || '',
      resumeName:  currentResume?.personalInfo?.fullName || 'Untitled',
      rating:      selected,
      ratingLabel: RATINGS[selected - 1].label,
      comment:     comment.trim(),
      createdAt:   new Date().toISOString(),
    };

    console.log('Submitting feedback payload:', payload);

    try {
      const res = await fetch('http://localhost:5000/api/feedback', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });

      const data = await res.json();
      console.log('Server response:', res.status, data);

      if (res.status === 409) {
        // Already submitted — still show thank you
        console.log('Already submitted previously');
        setSubmitted(true);
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || 'Server error');
      }

      console.log('Feedback saved successfully, id:', data.id);
      toast.success('Feedback saved!');
      setSubmitted(true);

    } catch (err) {
      console.error('Submit error:', err);
      toast.error('Failed to save feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const active     = hovered ?? selected;
  const activeData = active ? RATINGS[active - 1] : null;

  /* ── Checking ── */
  if (checking) return (
    <div style={S.page}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <div style={S.card}>
        <div style={S.spinner} />
        <p style={{ color: '#6b7280', fontSize: 14, marginTop: 12 }}>Checking...</p>
      </div>
    </div>
  );

  /* ── Already submitted ── */
  if (alreadyDone) return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>✅</div>
        <h2 style={S.title}>Already Submitted</h2>
        <p style={S.sub}>You've already given your feedback. Thank you!</p>
        <button style={S.btn('#111827')} onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </button>
      </div>
    </div>
  );

  /* ── Thank you screen ── */
  if (submitted) {
    const r = RATINGS[(selected ?? 1) - 1];
    return (
      <div style={S.page}>
        <div style={{ ...S.card, background: r.bg, border: `2px solid ${r.border}` }}>
          <div style={{ fontSize: 80, marginBottom: 8 }}>{r.emoji}</div>
          <h2 style={{ ...S.title, color: r.color }}>Thank you!</h2>
          <p style={S.sub}>
            You rated your experience as <strong>{r.label}</strong>.
          </p>
          {comment && (
            <p style={{
              marginTop: 12, padding: '10px 14px',
              background: '#fff', borderRadius: 10,
              fontSize: 13, color: '#374151',
              border: `1px solid ${r.border}`,
              maxWidth: 320, textAlign: 'left',
            }}>
              "{comment}"
            </p>
          )}
          <button
            style={{ ...S.btn(r.color), marginTop: 24 }}
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  /* ── Main feedback page ── */
  return (
    <div style={S.page}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        .emoji-btn { transition: transform 0.15s, filter 0.15s, opacity 0.15s; }
        .emoji-btn:hover { transform: scale(1.3) !important; }
      `}</style>

      <div style={{
        ...S.card,
        ...(activeData ? {
          background: activeData.bg,
          border:     `2px solid ${activeData.border}`,
          transition: 'background 0.3s ease, border 0.3s ease',
        } : {}),
      }}>

        <h1 style={S.title}>How was your experience?</h1>
        <p style={S.sub}>Tap an emoji to rate your resume building experience</p>

        {/* Big emoji preview */}
        <div style={{
          fontSize:   88,
          lineHeight: 1,
          margin:     '28px 0 6px',
          filter:     activeData ? 'none'        : 'grayscale(1)',
          opacity:    activeData ? 1             : 0.25,
          transform:  activeData ? 'scale(1.05)' : 'scale(1)',
          transition: 'all 0.25s ease',
          userSelect: 'none',
        }}>
          {activeData ? activeData.emoji : '😶'}
        </div>

        {/* Label */}
        <div style={{
          height:       30,
          fontSize:     17,
          fontWeight:   700,
          color:        activeData?.color ?? '#9ca3af',
          transition:   'color 0.2s',
          marginBottom: 6,
        }}>
          {activeData?.label ?? ''}
        </div>

        {/* Emoji row */}
        <div style={{ display: 'flex', gap: 14, margin: '16px 0 28px', justifyContent: 'center' }}>
          {RATINGS.map((r) => {
            const isSelected = selected === r.value;
            const isActive   = (hovered ?? selected ?? 0) >= r.value;
            return (
              <button
                key={r.value}
                className="emoji-btn"
                onMouseEnter={() => setHovered(r.value)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setSelected(r.value)}
                aria-label={r.label}
                style={{
                  fontSize:       40,
                  background:     isSelected ? r.bg : 'rgba(255,255,255,0.6)',
                  border:         isSelected ? `2px solid ${r.color}` : '2px solid transparent',
                  borderRadius:   16,
                  width:          60,
                  height:         60,
                  cursor:         'pointer',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  transform:      isSelected ? 'scale(1.2)' : 'scale(1)',
                  filter:         isActive   ? 'none'       : 'grayscale(0.6)',
                  opacity:        isActive   ? 1            : 0.5,
                  outline:        'none',
                  boxShadow:      isSelected ? `0 4px 16px ${r.color}40` : 'none',
                  transition:     'all 0.15s ease',
                }}
              >
                {r.emoji}
              </button>
            );
          })}
        </div>

        {/* Comment */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Any comments? (optional)"
          maxLength={300}
          rows={3}
          style={{
            width:        '100%',
            padding:      '11px 14px',
            borderRadius: 10,
            border:       `1.5px solid ${activeData?.border ?? '#e5e7eb'}`,
            fontSize:     14,
            color:        '#374151',
            background:   '#fff',
            resize:       'none',
            outline:      'none',
            fontFamily:   'inherit',
            lineHeight:   1.6,
            boxSizing:    'border-box',
            transition:   'border 0.2s',
          }}
        />
        <div style={{ fontSize: 11, color: '#9ca3af', textAlign: 'right', marginTop: 3 }}>
          {comment.length}/300
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!selected || submitting}
          style={{
            ...S.btn(selected ? (activeData?.color ?? '#111827') : '#d1d5db'),
            marginTop:  18,
            cursor:     selected && !submitting ? 'pointer' : 'not-allowed',
            transition: 'background 0.25s',
          }}
        >
          {submitting ? 'Saving...' : 'Submit Feedback'}
        </button>

        {/* Skip */}
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            marginTop:      10,
            background:     'none',
            border:         'none',
            color:          '#9ca3af',
            fontSize:       13,
            cursor:         'pointer',
            textDecoration: 'underline',
            padding:        '4px 0',
          }}
        >
          Skip
        </button>

      </div>
    </div>
  );
}

const S = {
  page: {
    minHeight:      '100vh',
    background:     'linear-gradient(135deg,#0f0f0f 0%,#1a1a2e 40%,#16213e 70%,#0f3460 100%)',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    padding:        24,
  } as React.CSSProperties,

  card: {
    background:    '#fff',
    borderRadius:  20,
    padding:       '40px 36px',
    width:         '100%',
    maxWidth:      420,
    textAlign:     'center',
    border:        '2px solid #e5e7eb',
    boxShadow:     '0 24px 64px rgba(0,0,0,0.28)',
    display:       'flex',
    flexDirection: 'column',
    alignItems:    'center',
  } as React.CSSProperties,

  title: {
    fontSize:   22,
    fontWeight: 800,
    color:      '#111827',
    margin:     '0 0 6px',
  } as React.CSSProperties,

  sub: {
    fontSize:   14,
    color:      '#6b7280',
    margin:     0,
    lineHeight: 1.6,
  } as React.CSSProperties,

  btn: (bg: string) => ({
    width:         '100%',
    padding:       '13px 0',
    background:    bg,
    color:         '#fff',
    border:        'none',
    borderRadius:  10,
    fontSize:      15,
    fontWeight:    700,
    cursor:        'pointer',
    letterSpacing: 0.3,
  } as React.CSSProperties),

  spinner: {
    width:        36,
    height:       36,
    border:       '3px solid #e5e7eb',
    borderTop:    '3px solid #6366f1',
    borderRadius: '50%',
    animation:    'spin 0.8s linear infinite',
    margin:       '40px auto',
  } as React.CSSProperties,
};