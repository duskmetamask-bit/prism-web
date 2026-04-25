'use client';
import { useState, useEffect, useRef } from 'react';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [setupMode, setSetupMode] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    fetch('/api/prism/profile')
      .then(r => r.json())
      .then(d => {
        if (d.NEXT_Q && d.NEXT_Q !== 'DONE') {
          setSetupMode(true);
        }
        setProfile(d);
      });
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput('');
    setMessages(m => [...m, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/prism/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setMessages(m => [...m, { role: 'prism', text: data.response || data.error || 'No response' }]);
    } catch (e) {
      setMessages(m => [...m, { role: 'prism', text: `Error: ${e.message}` }]);
    }
    setLoading(false);
  };

  const updateProfile = async (field, value) => {
    await fetch('/api/prism/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field, value }),
    });
    const res = await fetch('/api/prism/profile');
    const d = await res.json();
    setProfile(d);
    if (!d.NEXT_Q || d.NEXT_Q === 'DONE') setSetupMode(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 4rem)' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '900' }}>Chat with PRISM</h1>
        <p style={{ color: '#666', marginTop: '0.25rem', fontSize: '0.85rem' }}>
          Your AI social strategy agent. Ask anything about content, growth, positioning.
        </p>
      </div>

      {/* Setup Banner */}
      {setupMode && profile && profile.NEXT_Q && (
        <div style={{ background: '#1a1a2e', border: '1px solid #6366f1', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.85rem', fontWeight: '600', color: '#a5b4fc', marginBottom: '0.5rem' }}>
            📋 Complete your profile
          </p>
          <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.75rem' }}>{profile.NEXT_Q}</p>
          <input
            autoFocus
            style={{ width: '100%', padding: '0.5rem 0.75rem', background: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '0.85rem' }}
            placeholder="Type your answer and press Enter..."
            onKeyDown={e => {
              if (e.key === 'Enter') {
                updateProfile(profile.NEXT_FIELD, e.target.value);
                setMessages(m => [...m, { role: 'user', text: e.target.value }]);
                setMessages(m => [...m, { role: 'prism', text: `Got it. ${e.target.value}. Moving to the next question...` }]);
              }
            }}
          />
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem', paddingRight: '0.5rem' }}>
        {messages.length === 0 && !setupMode && (
          <div style={{ color: '#555', fontSize: '0.9rem', padding: '2rem 0', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔮</div>
            <p>Ask PRISM anything about your social content strategy.</p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>Try: "What should I post about today?" or "How's my content looking?"</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
          }}>
            <div style={{
              maxWidth: '75%',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              background: m.role === 'user' ? '#6366f1' : '#1a1a1a',
              color: '#fff',
              fontSize: '0.875rem',
              lineHeight: '1.5',
              whiteSpace: 'pre-wrap',
            }}>
              {m.role === 'prism' && <span style={{ opacity: 0.6, fontSize: '0.7rem', marginRight: '0.5rem' }}>PRISM</span>}
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ padding: '0.75rem 1rem', background: '#1a1a1a', borderRadius: '12px', color: '#666', fontSize: '0.875rem' }}>
              PRISM is thinking...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={send} style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask PRISM anything..."
          style={{ flex: 1, padding: '0.75rem 1rem', background: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', color: '#fff', fontSize: '0.9rem' }}
          disabled={loading}
        />
        <button type='submit' disabled={loading || !input.trim()} style={{ padding: '0.75rem 1.5rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer' }}>
          Send
        </button>
      </form>
    </div>
  );
}