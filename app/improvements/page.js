'use client';
import { useState, useEffect } from 'react';

export default function ImprovementsPage() {
  const [improvements, setImprovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: 'content', change_type: '', description: '', impact_score: 5 });

  useEffect(() => {
    fetch('/api/prism/improvements')
      .then(r => r.json())
      .then(d => { setImprovements(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await fetch('/api/prism/improvements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ category: 'content', change_type: '', description: '', impact_score: 5 });
    setShowForm(false);
    const res = await fetch('/api/prism/improvements');
    setImprovements(await res.json());
  };

  const categories = ['content', 'format', 'timing', 'voice', 'strategy', 'pillar'];
  const changeTypes = ['add', 'remove', 'optimize', 'prefer', 'avoid', 'note'];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '900' }}>Improvements Log</h1>
          <p style={{ color: '#666', marginTop: '0.25rem', fontSize: '0.85rem' }}>
            What PRISM has learned about content, style, and strategy
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '0.6rem 1.25rem', background: showForm ? '#333' : '#6366f1', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '0.85rem' }}>
          {showForm ? 'Cancel' : '+ Log Improvement'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#888', display: 'block', marginBottom: '0.35rem' }}>Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ width: '100%', padding: '0.5rem', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#888', display: 'block', marginBottom: '0.35rem' }}>Change Type</label>
              <select value={form.change_type} onChange={e => setForm({ ...form, change_type: e.target.value })} style={{ width: '100%', padding: '0.5rem', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}>
                <option value="">Select...</option>
                {changeTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#888', display: 'block', marginBottom: '0.35rem' }}>Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required rows={3} style={{ width: '100%', padding: '0.5rem', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff', resize: 'vertical', fontSize: '0.85rem' }} placeholder="What did you learn or change?" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type='submit' style={{ padding: '0.5rem 1.5rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Save</button>
          </div>
        </form>
      )}

      {loading ? (
        <div style={{ color: '#555', textAlign: 'center', padding: '3rem' }}>Loading...</div>
      ) : improvements.length === 0 ? (
        <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '3rem', textAlign: 'center', color: '#555' }}>
          No improvements logged yet. PRISM is still learning.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {improvements.map(imp => (
            <div key={imp.id} style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '1rem 1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span style={{ padding: '0.2rem 0.6rem', background: '#1a1a2e', color: '#a5b4fc', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase' }}>{imp.category}</span>
                <span style={{ padding: '0.2rem 0.6rem', background: imp.change_type === 'avoid' ? '#3f1a1a' : '#1a1a1a', color: imp.change_type === 'avoid' ? '#f87171' : '#888', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '600' }}>{imp.change_type}</span>
                <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: '#555' }}>{new Date(imp.created_at).toLocaleDateString()}</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#ccc', lineHeight: '1.5' }}>{imp.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}