import { NextResponse } from 'next/server';
import { execSync } from 'child_process';

export async function POST(request) {
  try {
    const { field, value } = await request.json();
    const result = execSync(
      `python3 /home/dusk/.hermes/agents/prism/web/api-scripts/profile_update.py "${field}" '${JSON.stringify(value)}'`,
      { cwd: '/home/dusk/.hermes/agents/prism', timeout: 10000 }
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = execSync(
      `python3 -c "
import sys; sys.path.insert(0, '/home/dusk/.hermes/agents/prism')
from database.prism_db import get_user_profile
import json, sys
profile = get_user_profile()
print(json.dumps(profile or {}))
"`,
      { cwd: '/home/dusk/.hermes/agents/prism', timeout: 10000 }
    );
    return NextResponse.json(JSON.parse(result.toString()));
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}