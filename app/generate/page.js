'use client';
import { useState } from 'react';

export default function Generate() {
  const [count, setCount] = useState(3);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);

  function handleGenerate() {
    setGenerating(true);
    setResult(null);
    fetch('/api/prism/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ count }),
    })
      .then(r => r.json())
      .then(d => { setResult(d); setGenerating(false); })
      .catch(e => { setResult({ error: e.message }); setGenerating(false); });
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '900' }}>Generate</h1>
        <p style={{ color: '#666', marginTop: '0.25rem' }}>Create new post drafts from your story brain</p>
      </div>

      <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '2rem', maxWidth: '600px' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#888', marginBottom: '0.5rem' }}>
            How many stories to generate for
          </label>
          <input
            type='number'
            min='1'
            max='10'
            value={count}
            onChange={e => setCount(parseInt(e.target.value))}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              background: '#0a0a0a',
              border: '1px solid #333',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '1rem',
            }}
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          style={{
            width: '100%',
            padding: '0.875rem',
            background: generating ? '#333' : '#fff',
            color: generating ? '#666' : '#000',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '700',
            fontSize: '0.9rem',
            cursor: generating ? 'not-allowed' : 'pointer',
          }}
        >
          {generating ? 'Generating...' : `Generate ${count} Post${count > 1 ? 's' : ''}`}
        </button>

        {result && (
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: result.error ? '#2a1010' : '#0a1a0a', borderRadius: '8px', fontSize: '0.85rem' }}>
            {result.error ? (
              <span style={{ color: '#ef4444' }}>Error: {result.error}</span>
            ) : (
              <span style={{ color: '#10b981' }}>{result.message || 'Posts generated successfully!'}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
