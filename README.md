# Database Assistant – Agentic NL-to-SQL System

## Overview
The **Database Assistant** is an agentic AI-powered backend system that enables users to query relational datasets using natural language. Users can upload CSV datasets, which are automatically ingested into a PostgreSQL database. The system then converts natural language questions into safe, executable SQL queries using a multi-agent architecture and a Large Language Model (Gemini).

The project focuses on **schema-aware query generation**, **multi-dataset reasoning**, and **safe execution**, aligning with modern agentic AI system design principles.

---

## Key Features
- 📁 CSV dataset ingestion (one CSV → one table)
- 🧠 Automatic schema discovery & metadata registry
- 🤖 Agentic NL → SQL generation using Gemini
- 🔗 Multi-dataset (multi-table) JOIN support
- 🛡️ Safety and validation layer before execution
- ⚡ SQL execution with result preview and timing
- 📊 Designed for extensibility (planner, verifier, governance)

---

## System Architecture
The system follows a **multi-agent pipeline**, where each agent has a focused responsibility:

1. **SchemaAgent**
   - Discovers table schemas for selected datasets
   - Loads schema metadata into shared agent state

2. **NLToSQLAgent**
   - Builds a schema-aware prompt across one or more tables
   - Generates SQL using Gemini
   - Supports JOIN queries across multiple datasets

3. **SafetyAgent**
   - Ensures generated SQL is read-only and safe
   - Blocks destructive queries (DROP, DELETE, etc.)

4. **ExecutionAgent**
   - Executes validated SQL against PostgreSQL
   - Returns results and execution metadata

5. **Orchestrator**
   - Coordinates agents in sequence
   - Maintains shared state across the pipeline

---

## Project Structure
```

database-assistant/
│
├── backend/
│ ├── app/
│ │ ├── agents/ # SchemaAgent, NLToSQLAgent, SafetyAgent, ExecutionAgent
│ │ ├── routes/ # FastAPI routes (datasets, query)
│ │ ├── services/ # NL-to-SQL helpers, schema prompt builder
│ │ ├── state/ # AgentState (shared memory)
│ │ ├── db.py # PostgreSQL connection utilities
│ │ └── main.py # FastAPI app entry point
│ │
│ └── requirements.txt
│
├── README.md
└── .gitignore

```


---

## Tech Stack
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL
- **LLM**: Google Gemini API
- **Data Processing**: Pandas
- **Architecture**: Agentic AI pipeline

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/rutuja-patil24/database-assistant.git
cd database-assistant
```

### 2. Create Virtual Environment
```
python -m venv venv
venv\Scripts\activate   # Windows
# source venv/bin/activate  # macOS/Linux
```
### 3. Install Dependencies

```
cd backend
pip install -r requirements.txt
```
### 4. Environment Variables

Create a .env file inside backend/:

```
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/<db_name>
GEMINI_API_KEY=your_gemini_api_key
ALLOW_MANUAL_SQL=1
```

### 5. Start PostgreSQL

Ensure PostgreSQL is running and the database exists.

Required metadata tables:

dataset_registry

dataset_columns

(These are created as part of the project setup.)

### 6. Run the Backend Server
```
uvicorn app.main:app --reload --port 8000
```
Open:

Swagger UI: http://127.0.0.1:8000/docs


## How to Use the System

### Step 1: Upload CSV Datasets

Upload datasets one at a time (each CSV becomes one table):
```
POST /datasets/upload
Header: X-User-Id: user1
Body: file=<csv file>
```

You can upload multiple CSVs sequentially under the same user.

### Step 2: Preview Dataset
```
GET /datasets/{dataset_id}/preview
```

### Step 3: Run Natural Language Queries

Single Dataset Query
```
{
  "dataset_id": "DATASET_ID",
  "question": "Show first 10 rows",
  "limit": 10
}
```
Multi-Dataset JOIN Query
```
{
  "dataset_ids": ["ORDERS_DATASET_ID", "CUSTOMERS_DATASET_ID"],
  "question": "What is total sales by region?",
  "limit": 50
}
```


The system automatically:

loads schemas

infers join keys

generates SQL

validates safety

executes the query

Example Output
```
{
  "sql": "SELECT c.region, SUM(o.total_amount) AS total_sales FROM ...",
  "count": 4,
  "data": [
    { "region": "West", "total_sales": 1800 },
    { "region": "East", "total_sales": 200 }
  ],
  "execution_time_ms": 39
}
```
