#!/usr/bin/env python3
"""Log improvement script — called by Next.js API routes."""
import sys
import json
sys.path.insert(0, '/home/dusk/.hermes/agents/prism')
from database.prism_db import log_improvement

body = json.loads(sys.argv[1])
log_improvement({
    'category': body.get('category', 'content'),
    'change_type': body.get('change_type', ''),
    'description': body.get('description', ''),
    'impact_score': body.get('impact_score', 5),
    'source': 'manual'
})
print("OK")