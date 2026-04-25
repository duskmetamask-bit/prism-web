'use client';
export default function Schedule() {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '900' }}>Schedule</h1>
        <p style={{ color: '#666', marginTop: '0.25rem' }}>Upcoming posts queued for publication</p>
      </div>
      <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '3rem', textAlign: 'center' }}>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>No posts scheduled yet</p>
        <p style={{ color: '#444', fontSize: '0.8rem', marginTop: '0.5rem' }}>Approve drafts to add them to the queue</p>
      </div>
    </div>
  );
}
