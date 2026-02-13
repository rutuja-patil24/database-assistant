import time

from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel

from app.core.sql_guard import ensure_safe_select
from app.services import connection_manager

router = APIRouter(prefix="/connections", tags=["connections"])


# ── Request / Response models ───────────────────────────────────────

class ConnectRequest(BaseModel):
    host: str
    port: int = 5432
    database: str
    username: str
    password: str


class ConnectionQueryRequest(BaseModel):
    sql: str
    limit: int = 100


# ── Endpoints ───────────────────────────────────────────────────────

@router.post("/connect")
def connect(body: ConnectRequest, x_user_id: str = Header(..., alias="X-User-Id")):
    try:
        server_version = connection_manager.connect(
            user_id=x_user_id,
            host=body.host,
            port=body.port,
            dbname=body.database,
            user=body.username,
            password=body.password,
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Connection failed: {e}")

    return {
        "connected": True,
        "server_version": server_version,
        "database": body.database,
    }


@router.post("/disconnect")
def disconnect(x_user_id: str = Header(..., alias="X-User-Id")):
    removed = connection_manager.disconnect(x_user_id)
    if not removed:
        raise HTTPException(status_code=404, detail="No active connection found")
    return {"disconnected": True}


@router.get("/status")
def status(x_user_id: str = Header(..., alias="X-User-Id")):
    return {"connected": connection_manager.is_connected(x_user_id)}


@router.post("/query")
def query(body: ConnectionQueryRequest, x_user_id: str = Header(..., alias="X-User-Id")):
    if not connection_manager.is_connected(x_user_id):
        raise HTTPException(status_code=400, detail="Not connected. Call /connections/connect first.")

    try:
        ensure_safe_select(body.sql)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Unsafe SQL: {e}")

    conn = connection_manager.get_connection(x_user_id)
    t0 = time.time()
    try:
        with conn.cursor() as cur:
            cur.execute(body.sql)
            rows = cur.fetchall()
            columns = [desc[0] for desc in cur.description] if cur.description else []
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query failed: {e}")
    finally:
        conn.close()

    elapsed_ms = int((time.time() - t0) * 1000)

    return {
        "columns": columns,
        "rows": [dict(r) for r in rows],
        "row_count": len(rows),
        "execution_time_ms": elapsed_ms,
    }
