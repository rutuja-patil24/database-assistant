import os
import psycopg2


def get_conn():
    host = os.getenv("DB_HOST", "127.0.0.1")
    password = os.getenv("DB_PASS", os.getenv("DB_PASSWORD", "da_pass"))
    # Unix socket path (Cloud Run Cloud SQL proxy)
    if host.startswith("/"):
        dsn = (
            f"host={host} "
            f"dbname={os.getenv('DB_NAME', 'da_db')} "
            f"user={os.getenv('DB_USER', 'da_user')} "
            f"password={password}"
        )
        return psycopg2.connect(dsn)
    return psycopg2.connect(
        host=host,
        port=int(os.getenv("DB_PORT", "5432")),
        dbname=os.getenv("DB_NAME", "da_db"),
        user=os.getenv("DB_USER", "da_user"),
        password=password,
    )
