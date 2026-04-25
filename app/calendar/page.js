'use client';
import { useState, useEffect } from 'react';

export default function CalendarPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ planned_date: '', pillar: '', topic: '', angle: '', format: 'single', notes: '' });
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch('/api/prism/profile').then(r => r.json()).then(d => setProfile(d));
    fetch('/api/prism/calendar')
      .then(r => r.json())
      .then(d => { setEntries(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await fetch('/api/prism/calendar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ planned_date: '', pillar: '', topic: '', angle: '', format: 'single', notes: '' });
    setShowForm(false);
    const res = await fetch('/api/prism/calendar');
    setEntries(await res.json());
  };

  const pillars = profile?.PILLARS || ['AI Agents', 'OpenClaw', 'Hermes', 'AI Model Updates', 'Workflows & Automations', 'Agents You Build', 'Setups & How-Tos', 'Educational', 'Tips & Tricks'];
  const formats = ['single', 'thread', 'carousels', 'video'];

  // Group by month
  const grouped = {};
  entries.forEach(e => {
    const month = e.planned_date?.substring(0, 7) || 'Unknown';
    if (!grouped[month]) grouped[month] = [];
    grouped[month].push(e);
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '900' }}>Content Calendar</h1>
          <p style={{ color: '#666', marginTop: '0.25rem', fontSize: '0.85rem' }}>
            What to post and when. Auto-generated from your pillars.
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '0.6rem 1.25rem', background: showForm ? '#333' : '#6366f1', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '0.85rem' }}>
          {showForm ? 'Cancel' : '+ Add Entry'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#888', display: 'block', marginBottom: '0.35rem' }}>Date</label>
              <input type='date' value={form.planned_date} onChange={e => setForm({ ...form, planned_date: e.target.value })} required style={{ width: '100%', padding: '0.5rem', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#888', display: 'block', marginBottom: '0.35rem' }}>Pillar</label>
              <select value={form.pillar} onChange={e => setForm({ ...form, pillar: e.target.value })} required style={{ width: '100%', padding: '0.5rem', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}>
                <option value="">Select pillar...</option>
                {pillars.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#888', display: 'block', marginBottom: '0.35rem' }}>Format</label>
              <select value={form.format} onChange={e => setForm({ ...form, format: e.target.value })} style={{ width: '100%', padding: '0.5rem', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}>
                {formats.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#888', display: 'block', marginBottom: '0.35rem' }}>Topic / Angle</label>
            <input value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} placeholder="What specifically?" style={{ width: '100%', padding: '0.5rem', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type='submit' style={{ padding: '0.5rem 1.5rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Add to Calendar</button>
          </div>
        </form>
      )}

      {loading ? (
        <div style={{ color: '#555', textAlign: 'center', padding: '3rem' }}>Loading...</div>
      ) : Object.keys(grouped).length === 0 ? (
        <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '3rem', textAlign: 'center', color: '#555' }}>
          No calendar entries yet. Add your first one above.
        </div>
      ) : (
        Object.entries(grouped).sort().map(([month, monthEntries]) => (
          <div key={month} style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '0.8rem', fontWeight: '700', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>{month}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {monthEntries.map(entry => (
                <div key={entry.id} style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#666', minWidth: '80px' }}>{entry.planned_date}</div>
                  <span style={{ padding: '0.2rem 0.6rem', background: '#1a1a2e', color: '#a5b4fc', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '600' }}>{entry.pillar}</span>
                  <span style={{ flex: 1, fontSize: '0.85rem', color: '#ccc' }}>{entry.topic || entry.angle || '—'}</span>
                  <span style={{ padding: '0.2rem 0.6rem', background: '#1a1a1a', color: '#888', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '600' }}>{entry.format}</span>
                  <span style={{ padding: '0.2rem 0.6rem', background: entry.status === 'posted' ? '#0a2e1a' : entry.status === 'approved' ? '#1a1a2e' : '#111', color: entry.status === 'posted' ? '#34d399' : '#888', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '600' }}>{entry.status}</span>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}