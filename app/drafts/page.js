'use client';
import { useState, useEffect } from 'react';

export default function Drafts() {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/prism/drafts')
      .then(r => r.json())
      .then(d => { setDrafts(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function approve(id) {
    fetch('/api/prism/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).then(() => {
      setDrafts(drafts.filter(d => d.id !== id));
    });
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '900' }}>Drafts</h1>
        <p style={{ color: '#666', marginTop: '0.25rem' }}>Review and approve posts before they go live</p>
      </div>

      {loading ? (
        <p style={{ color: '#666' }}>Loading...</p>
      ) : drafts.length === 0 ? (
        <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>No pending drafts</p>
          <a href='/generate' style={{ display: 'inline-block', marginTop: '1rem', padding: '0.5rem 1rem', background: '#fff', color: '#000', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600' }}>
            Generate some
          </a>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {drafts.map(draft => (
            <div key={draft.id} style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '1.5rem' }}>
              <div style={{ fontSize: '0.7rem', color: '#555', marginBottom: '0.5rem' }}>DRAFT #{draft.id}</div>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1rem', color: '#e5e5e5' }}>{draft.content || '(no content)'}</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => approve(draft.id)}
                  style={{ padding: '0.5rem 1rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
                >
                  Approve
                </button>
                <button
                  style={{ padding: '0.5rem 1rem', background: 'transparent', color: '#666', border: '1px solid #333', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
