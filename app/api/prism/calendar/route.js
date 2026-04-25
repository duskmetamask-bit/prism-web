import { NextResponse } from 'next/server';
import { execSync } from 'child_process';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start') || '';
    const limit = searchParams.get('limit') || '30';
    
    const result = execSync(
      `python3 -c "
import sys; sys.path.insert(0, '/home/dusk/.hermes/agents/prism')
from database.prism_db import get_calendar
import json
entries = get_calendar(start_date='${start}', limit=${limit})
print(json.dumps(entries))
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
      `python3 /home/dusk/.hermes/agents/prism/web/api-scripts/calendar_add.py '${JSON.stringify(body)}'`,
      { cwd: '/home/dusk/.hermes/agents/prism', timeout: 10000 }
    );
    return NextResponse.json({ id: parseInt(result.toString().trim()) });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}