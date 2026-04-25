'use client';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [stats, setStats] = useState({ stories: '-', pending: '-', approved: '-', scheduled: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/prism/status').then(r => r.json()).then(d => {
      setStats(d);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '900' }}>Dashboard</h1>
        <p style={{ color: '#666', marginTop: '0.25rem' }}>Your content engine at a glance</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Stories', value: stats.stories, sub: 'in brain', color: '#6366f1' },
          { label: 'Pending', value: stats.pending, sub: 'awaiting review', color: '#f59e0b' },
          { label: 'Approved', value: stats.approved, sub: 'ready to post', color: '#10b981' },
          { label: 'Scheduled', value: stats.scheduled || 0, sub: 'in queue', color: '#8b5cf6' },
        ].map(s => (
          <div key={s.label} style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '1.5rem' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: s.color, lineHeight: 1 }}>{loading ? '...' : s.value}</div>
            <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#e5e5e5', marginTop: '0.5rem' }}>{s.label}</div>
            <div style={{ fontSize: '0.7rem', color: '#555', marginTop: '0.125rem' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '1rem' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <a href='/generate' style={{ padding: '0.75rem 1rem', background: '#fff', color: '#000', borderRadius: '8px', fontWeight: '600', textAlign: 'center' }}>
              Generate Posts
            </a>
            <a href='/drafts' style={{ padding: '0.75rem 1rem', background: '#1a1a1a', color: '#fff', border: '1px solid #333', borderRadius: '8px', fontWeight: '600', textAlign: 'center' }}>
              Review Drafts
            </a>
          </div>
        </div>
        <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '1rem' }}>How it works</h3>
          <ol style={{ paddingLeft: '1.25rem', fontSize: '0.8rem', color: '#888', lineHeight: '2' }}>
            <li>Generate posts from your story brain</li>
            <li>Review and approve drafts</li>
            <li>Posts get scheduled automatically</li>
            <li>PRISM posts to X at optimal times</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
