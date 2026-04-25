import { NextResponse } from 'next/server';
import { execSync } from 'child_process';

export async function GET() {
  try {
    const result = execSync(
      `python3 -c "
import sys; sys.path.insert(0, '/home/dusk/.hermes/agents/prism')
from database.prism_db import get_improvements
import json
improvements = get_improvements(limit=50)
print(json.dumps(improvements))
"`,
      { cwd: '/home/dusk/.hermes/agents/prism', timeout: 10000 }
    );
    return NextResponse.json(JSON.parse(result.toString()));
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const result = execSync(
      `python3 /home/dusk/.hermes/agents/prism/web/api-scripts/log_improvement.py '${JSON.stringify(body)}'`,
      { cwd: '/home/dusk/.hermes/agents/prism', timeout: 10000 }
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}