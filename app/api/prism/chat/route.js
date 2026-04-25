import { NextResponse } from 'next/server';
import { execSync } from 'child_process';

export async function POST(request) {
  try {
    const { message } = await request.json();
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    const result = execSync(
      `python3 -c "
import sys
sys.path.insert(0, '/home/dusk/.hermes/agents/prism')
from prism.chat_agent import chat
print(chat('''${message.replace(/'/g, "\\'")}'''))
"`,
      {
        cwd: '/home/dusk/.hermes/agents/prism',
        timeout: 30000,
        maxBuffer: 1024 * 512
      }
    );

    const text = result.toString().trim();
    return NextResponse.json({ response: text });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { execSync } = require('child_process');
    const result = execSync(
      `python3 -c "
import sys
sys.path.insert(0, '/home/dusk/.hermes/agents/prism')
from prism.chat_agent import ensure_profile, get_next_setup_question
profile = ensure_profile()
q, f = get_next_setup_question(profile)
print('PROFILE_OK')
print(f'NAME:{profile.get(\"name\",\"\")}')
print(f'HANDLE:{profile.get(\"x_handle\",\"\")}')
print(f'GOALS:{profile.get(\"goals\",\"\")}')
print(f'AUDIENCE:{profile.get(\"target_audience\",\"\")}')
print(f'CADENCE:{profile.get(\"posting_cadence\",\"\")}')
print(f'FOLLOWERS:{profile.get(\"follower_count\",0)}')
print(f'NEXT_Q:{q or \"DONE\"}')
print(f'NEXT_FIELD:{f or \"\"}')
"`,
      {
        cwd: '/home/dusk/.hermes/agents/prism',
        timeout: 10000
      }
    );
    const text = result.toString().trim();
    const lines = text.split('\n');
    const data = {};
    for (const line of lines) {
      const [key, ...vals] = line.split(':');
      data[key] = vals.join(':');
    }
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}