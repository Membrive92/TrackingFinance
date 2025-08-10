# app/main.py
from __future__ import annotations

# FastAPI & middleware
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# SQLModel / SQLAlchemy
from sqlmodel import SQLModel, Session, create_engine, select

# App config (reads .env) and models/schemas
from app.core.settings import settings
from app.models import Asset
from app.schemas.Asset import AssetCreate, AssetRead, AssetUpdate


# ---------------------------------------------------------------------
# Database engine (uses pg8000 driver) and session dependency
# ---------------------------------------------------------------------
DATABASE_URL = (
    f"postgresql+pg8000://{settings.PG_USER}:{settings.PG_PASSWORD}"
    f"@{settings.PG_HOST}:{settings.PG_PORT}/{settings.PG_DB}"
)

# Robust connection; SQL echo controlled by DEBUG in .env
engine = create_engine(DATABASE_URL, pool_pre_ping=True, echo=settings.DEBUG)


def get_session():
    """Yield a DB session for the duration of the request (no expiration on commit)."""
    with Session(engine, expire_on_commit=False) as session:
        yield session


# ---------------------------------------------------------------------
# FastAPI application & middleware
# ---------------------------------------------------------------------
app = FastAPI(title="TrackingFinance API", version="0.1.0")

# CORS so the Angular SPA (localhost:4200 by default) can call the API from the browser
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# TEMPORARY: create tables if they don't exist. We will switch to Alembic later.
SQLModel.metadata.create_all(engine)


# ---------------------------------------------------------------------
# Healthcheck
# ---------------------------------------------------------------------
@app.get("/v1/health")
def health():
    """Simple liveness endpoint."""
    return {"status": "ok"}


# ---------------------------------------------------------------------
# Assets endpoints (using Pydantic v2 schemas)
# ---------------------------------------------------------------------
@app.get("/v1/assets", response_model=list[AssetRead])
def list_assets(session: Session = Depends(get_session)):
    """Return all assets."""
    results = session.exec(select(Asset)).all()
    # Validate from ORM attributes to produce the response schema
    return [AssetRead.model_validate(a, from_attributes=True) for a in results]


@app.get("/v1/assets/{asset_id}", response_model=AssetRead)
def get_asset(asset_id: int, session: Session = Depends(get_session)):
    """Return a single asset by id."""
    asset = session.get(Asset, asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return AssetRead.model_validate(asset, from_attributes=True)


@app.post("/v1/assets", response_model=AssetRead, status_code=201)
def create_asset(payload: AssetCreate, session: Session = Depends(get_session)):
    """Create a new asset."""
    asset = Asset(**payload.model_dump())
    session.add(asset)
    session.commit()
    session.refresh(asset)
    return AssetRead.model_validate(asset, from_attributes=True)


@app.patch("/v1/assets/{asset_id}", response_model=AssetRead)
def update_asset(asset_id: int, payload: AssetUpdate, session: Session = Depends(get_session)):
    """Partially update an asset."""
    asset = session.get(Asset, asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(asset, k, v)

    session.commit()
    session.refresh(asset)
    return AssetRead.model_validate(asset, from_attributes=True)


@app.delete("/v1/assets/{asset_id}")
def delete_asset(asset_id: int, session: Session = Depends(get_session)):
    """Delete an asset."""
    asset = session.get(Asset, asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    session.delete(asset)
    session.commit()
    return {"ok": True}
