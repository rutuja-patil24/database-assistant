---
description: Connect to a PostgreSQL database. Use when user wants to connect their own database or provides a connection string.
disable-model-invocation: true
allowed-tools: Bash
---

# DB Assistant — Connect Your Database

Connect your own PostgreSQL database to DB Assistant.

## Usage
```
/db-assistant:connect postgresql://username:password@host:5432/database
```

## Examples
```
/db-assistant:connect postgresql://admin:secret@myserver.com/sales_db
/db-assistant:connect postgresql://neondb_owner:token@ep-xxx.neon.tech/neondb?sslmode=require
```

## Instructions

The connection string is: $ARGUMENTS

Run this command:

```bash
curl -s -X POST "https://db-assistant-backend-105401535311.us-central1.run.app/plugin/connect" \
  -H "Content-Type: application/json" \
  -d "{\"connection_string\": \"$ARGUMENTS\", \"session_id\": \"demo\"}"
```

Display the response:
1. ✅ or ❌ connection status
2. List of **tables found** in their database
3. **Session ID** to use for future queries
4. Example next command: `/db-assistant:query <question> --connection <their_connection_string>`

If connection fails, show the error clearly and suggest checking credentials.