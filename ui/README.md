# Database Assistant – UI

Julius-style UI for the Database Assistant: chat with your data using natural language.

## Run locally

1. **Backend** must be running (e.g. `uvicorn app.main:app --reload --port 8000` from `backend/`).

2. **Install and start the UI:**
   ```bash
   cd ui
   npm install
   npm run dev
   ```
3. Open **http://localhost:5173**.

In dev, the UI proxies API requests from `/api` to `http://localhost:8000`, so you can use the app without CORS issues.

## Features

- **Sidebar**: Upload CSV/Excel, list datasets, select one or more for querying. User ID (X-User-Id) is configurable in the footer.
- **Chat**: Type a question in plain English; the backend converts it to SQL and returns a table. Messages show the generated SQL and result set.

## Build for production

```bash
npm run build
```

Static files are in `dist/`. Point your backend or a static server at `dist/`, or set `VITE_API_URL` to your API origin before building.
