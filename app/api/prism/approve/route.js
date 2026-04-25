import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { id } = await request.json();
    const { execSync } = require('child_process');
    execSync(`python3 /home/dusk/.hermes/agents/prism/run.py approve ${id}`, {
      cwd: '/home/dusk/.hermes/agents/prism',
      timeout: 10000,
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
