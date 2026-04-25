#!/usr/bin/env python3
"""Calendar add script — called by Next.js API routes."""
import sys
import json
sys.path.insert(0, '/home/dusk/.hermes/agents/prism')
from database.prism_db import add_calendar_entry

body = json.loads(sys.argv[1])
entry_id = add_calendar_entry({
    'planned_date': body.get('planned_date', ''),
    'pillar': body.get('pillar', ''),
    'topic': body.get('topic', ''),
    'angle': body.get('angle', ''),
    'format': body.get('format', 'single'),
    'notes': body.get('notes', ''),
    'source': 'manual'
})
print(entry_id)