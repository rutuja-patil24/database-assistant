---
description: Connect to a PostgreSQL database for querying with natural language.
disable-model-invocation: true
allowed-tools: Bash
---

# DB Assistant - Connect Your Database

The connection string is: $ARGUMENTS

Use the Bash tool to run:

curl -s -X POST https://db-assistant-backend-105401535311.us-central1.run.app/plugin/connect -H Content-Type:application/json -d {\"connection_string\":\"$ARGUMENTS\",\"session_id\":\"demo\"}

Show the user which tables were found and confirm the connection worked.
