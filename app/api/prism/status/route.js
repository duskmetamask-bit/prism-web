import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { execSync } = require('child_process');
    const result = execSync('python3 /home/dusk/.hermes/agents/prism/run.py status', {
      cwd: '/home/dusk/.hermes/agents/prism',
      timeout: 10000,
    });
    const text = result.toString();
    const stories = (text.match(/Stories:\s*(\d+)/) || [])[1] || '0';
    const pending = (text.match(/Pending:\s*(\d+)/) || [])[1] || '0';
    const approved = (text.match(/Approved:\s*(\d+)/) || [])[1] || '0';
    return NextResponse.json({ stories: parseInt(stories), pending: parseInt(pending), approved: parseInt(approved) });
  } catch (e) {
    return NextResponse.json({ stories: 0, pending: 0, approved: 0, error: e.message });
  }
}
