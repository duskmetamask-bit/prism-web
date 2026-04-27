'use client';
import { useState, useEffect } from 'react';

export default function Drafts() {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Browser calls VPS directly — CORS enabled on Flask
    fetch('http://194.163.136.244:8000/api/drafts?status=pending')
      .then(r => r.json())
      .then(d => { setDrafts(Array.isArray(d) ? d : []); setLoading(false); })
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

  function parseContent(content) {
    try {
      const parsed = typeof content === 'string' ? JSON.parse(content) : content;
      return {
        selected: parsed.selected || '',
        posts: parsed.posts || [],
        story_title: parsed.story_title || '',
        story_url: parsed.story_url || '',
        story_source: parsed.story_source || '',
        hook: parsed.hook || '',
        quality_score: parsed.quality_score || null,
        quality_rank: parsed.quality_rank || null,
      };
    } catch {
      return { selected: content || '', posts: [], story_title: '', story_url: '', story_source: '', hook: '', quality_score: null, quality_rank: null };
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '900' }}>Pending Drafts</h1>
        <p style={{ color: '#666', marginTop: '0.25rem' }}>{drafts.length} awaiting review</p>
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
          {drafts.map(draft => {
            const parsed = parseContent(draft.content);
            return (
              <div key={draft.id} style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#555', marginRight: '1rem' }}>DRAFT #{draft.id}</span>
                    <span style={{ fontSize: '0.7rem', color: '#888', background: '#1a1a1a', padding: '0.15rem 0.5rem', borderRadius: '4px', marginRight: '0.5rem' }}>{parsed.story_source}</span>
                    {parsed.hook && <span style={{ fontSize: '0.7rem', color: '#10b981' }}>{parsed.hook}</span>}
                  </div>
                  {parsed.quality_score && (
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: parsed.quality_score >= 7 ? '#10b981' : parsed.quality_score >= 5 ? '#f59e0b' : '#ef4444' }}>
                      {parsed.quality_score}/10
                    </span>
                  )}
                </div>

                {parsed.story_title && (
                  <a href={parsed.story_url} target='_blank' rel='noopener noreferrer' style={{ fontSize: '0.8rem', color: '#666', textDecoration: 'none', display: 'block', marginBottom: '0.75rem' }}>
                    {parsed.story_title} →
                  </a>
                )}

                <p style={{ fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1rem', color: '#e5e5e5', whiteSpace: 'pre-wrap' }}>{parsed.selected}</p>

                {parsed.posts.length > 1 && (
                  <details style={{ marginBottom: '1rem' }}>
                    <summary style={{ fontSize: '0.75rem', color: '#555', cursor: 'pointer' }}>{parsed.posts.length} alternatives</summary>
                    <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {parsed.posts.map((p, i) => (
                        <div key={i} style={{ fontSize: '0.8rem', color: '#666', padding: '0.5rem', background: '#0a0a0a', borderRadius: '6px', whiteSpace: 'pre-wrap' }}>{p}</div>
                      ))}
                    </div>
                  </details>
                )}

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => approve(draft.id)}
                    style={{ padding: '0.5rem 1rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
                  >
                    Approve
                  </button>
                  <a href='/generate' style={{ padding: '0.5rem 1rem', background: 'transparent', color: '#666', border: '1px solid #333', borderRadius: '6px', fontSize: '0.8rem', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                    Regenerate
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
