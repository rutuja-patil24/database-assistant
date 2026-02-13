import psycopg2
from psycopg2.extras import RealDictCursor


# In-memory store: user_id -> connection credentials dict
_connections: dict[str, dict] = {}


def connect(user_id: str, host: str, port: int, dbname: str, user: str, password: str) -> str:
    """
    Test a PostgreSQL connection with the given credentials.
    On success, store the credentials for later use and return the server version.
    Raises on failure.
    """
    conn = psycopg2.connect(
        host=host,
        port=port,
        dbname=dbname,
        user=user,
        password=password,
        connect_timeout=5,
    )
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT version();")
            version = cur.fetchone()[0]
    finally:
        conn.close()

    _connections[user_id] = {
        "host": host,
        "port": port,
        "dbname": dbname,
        "user": user,
        "password": password,
    }
    return version


def get_connection(user_id: str):
    """
    Create and return a new psycopg2 connection using stored credentials.
    Raises KeyError if the user hasn't connected yet.
    """
    creds = _connections.get(user_id)
    if creds is None:
        raise KeyError(f"No stored connection for user '{user_id}'. Call /connections/connect first.")
    return psycopg2.connect(
        host=creds["host"],
        port=creds["port"],
        dbname=creds["dbname"],
        user=creds["user"],
        password=creds["password"],
        cursor_factory=RealDictCursor,
        connect_timeout=5,
    )


def disconnect(user_id: str) -> bool:
    """Remove stored credentials. Returns True if there was a connection to remove."""
    return _connections.pop(user_id, None) is not None


def is_connected(user_id: str) -> bool:
    return user_id in _connections
