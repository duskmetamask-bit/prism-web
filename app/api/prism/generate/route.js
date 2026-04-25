import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { count } = await request.json().catch(() => ({}));
    const { execSync } = require('child_process');
    const n = count || 1;
    const result = execSync(`python3 /home/dusk/.hermes/agents/prism/run.py generate ${n}`, {
      cwd: '/home/dusk/.hermes/agents/prism',
      timeout: 120000,
    });
    return NextResponse.json({ success: true, message: `Generated ${n} post draft${n > 1 ? 's' : ''}`, output: result.toString() });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
