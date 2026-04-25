#!/usr/bin/env python3
"""Profile update script — called by Next.js API routes."""
import sys
import json
sys.path.insert(0, '/home/dusk/.hermes/agents/prism')
from database.prism_db import get_user_profile, set_user_profile

if len(sys.argv) < 3:
    print("Usage: profile_update.py <field> <value_json>")
    sys.exit(1)

field = sys.argv[1]
value = json.loads(sys.argv[2])

profile = get_user_profile() or {}
profile[field] = value
set_user_profile(profile)
print("OK")