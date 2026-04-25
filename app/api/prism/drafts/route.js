import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { execSync } = require('child_process');
    const result = execSync('python3 /home/dusk/.hermes/agents/prism/run.py list 2>/dev/null || echo "[]"', {
      cwd: '/home/dusk/.hermes/agents/prism',
      timeout: 10000,
    });
    let drafts = [];
    try {
      drafts = JSON.parse(result.toString());
    } catch {
      drafts = [];
    }
    return NextResponse.json(drafts);
  } catch (e) {
    return NextResponse.json([], { error: e.message });
  }
}
