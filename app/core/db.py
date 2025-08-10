from sqlmodel import create_engine, Session
from app.core.settings import settings

DATABASE_URL = (
    f"postgresql+pg8000://{settings.PG_USER}:{settings.PG_PASSWORD}"
    f"@{settings.PG_HOST}:{settings.PG_PORT}/{settings.PG_DB}"
)
engine = create_engine(DATABASE_URL, pool_pre_ping=True, echo=settings.DEBUG)

def get_session():
    with Session(engine, expire_on_commit=False) as session:
        yield session
