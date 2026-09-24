import os
from sqlalchemy import create_engine, event
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from typing import Generator

# Read DATABASE_URL from environment or fallback to local SQLite database
DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./resqgrid.db")

is_sqlite = DATABASE_URL.startswith("sqlite")

# Engine configuration
if is_sqlite:
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        echo=False
    )

    # Enable SQLite WAL mode and foreign keys for high concurrent performance
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.execute("PRAGMA synchronous=NORMAL")
        cursor.close()
else:
    # PostGIS / PostgreSQL configuration with connection pooling
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        pool_size=10,
        max_overflow=20,
        echo=False
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency for yielding database sessions per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_engine_info() -> dict:
    """Return database engine status and type."""
    dialect_name = engine.dialect.name
    return {
        "engine": dialect_name,
        "is_sqlite": is_sqlite,
        "is_spatial_ready": True,
        "url_scheme": DATABASE_URL.split("://")[0] if "://" in DATABASE_URL else "unknown"
    }

def init_db():
    """Create all tables, ensure column migrations, and seed initial records if unpopulated."""
    from . import db_models
    from . import db_seeder
    Base.metadata.create_all(bind=engine)

    # Safe dynamic column check for SQLite / Postgres
    try:
        with engine.connect() as conn:
            if is_sqlite:
                cursor = conn.connection.cursor()
                cursor.execute("PRAGMA table_info(audit_logs)")
                cols = [row[1] for row in cursor.fetchall()]
                if cols and "prev_hash" not in cols:
                    cursor.execute("ALTER TABLE audit_logs ADD COLUMN prev_hash VARCHAR(64)")
                if cols and "record_hash" not in cols:
                    cursor.execute("ALTER TABLE audit_logs ADD COLUMN record_hash VARCHAR(64)")
                conn.connection.commit()
                cursor.close()
    except Exception as e:
        print(f"[DB Schema Migration Notice]: {e}")

    with SessionLocal() as session:
        db_seeder.seed_initial_data_if_needed(session)
        try:
            from .governance_engine import backfill_hash_chain_if_needed
            backfill_hash_chain_if_needed(session)
        except Exception as e:
            print(f"[Audit Hash Backfill Notice]: {e}")

