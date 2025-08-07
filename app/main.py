from fastapi import FastAPI, HTTPException
from sqlmodel import SQLModel, Session, create_engine, select
from app.models import Asset

import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Read variables (with defaults where appropriate)
PG_USER     = os.getenv("PG_USER")
PG_PASSWORD = os.getenv("PG_PASSWORD")
PG_HOST     = os.getenv("PG_HOST", "localhost")
PG_PORT     = os.getenv("PG_PORT", "5432")
PG_DB       = os.getenv("PG_DB")

# Build the database URL dynamically
DATABASE_URL = (
    f"postgresql://{PG_USER}:{PG_PASSWORD}"
    f"@{PG_HOST}:{PG_PORT}/{PG_DB}"
)

# Create the SQLAlchemy engine (echo=True logs all SQL statements)
engine = create_engine(DATABASE_URL, echo=True)

# Create database tables based on the models defined above
SQLModel.metadata.create_all(engine)

# Instantiate the FastAPI application
app = FastAPI(title="Investment Tracker API")

# --- CRUD endpoints for Asset ---

@app.post("/assets/", response_model=Asset)
def create_asset(asset: Asset):
    with Session(engine) as session:
        session.add(asset)        # Prepare the new Asset record
        session.commit()          # Persist the record in the database
        session.refresh(asset)    # Refresh the instance with generated values (e.g., id)
        return asset              # Return the created Asset to the client

@app.get("/assets/", response_model=list[Asset])
def list_assets():
    with Session(engine) as session:
        return session.exec(select(Asset)).all()  # Fetch all Asset records from the database

@app.get("/assets/{asset_id}", response_model=Asset)
def get_asset(asset_id: int):
    with Session(engine) as session:
        asset = session.get(Asset, asset_id)       # Retrieve Asset by primary key
        if not asset:
            raise HTTPException(status_code=404, detail="Asset not found")  # Raise 404 if not found
        return asset

@app.patch("/assets/{asset_id}", response_model=Asset)
def update_asset(asset_id: int, asset: Asset):
    with Session(engine) as session:
        db_asset = session.get(Asset, asset_id)
        if not db_asset:
            raise HTTPException(status_code=404, detail="Asset not found")
        updated_data = asset.dict(exclude_unset=True)   # Only update provided fields
        for key, val in updated_data.items():
            setattr(db_asset, key, val)                # Apply updates to the model instance
        session.add(db_asset)
        session.commit()                              # Commit updates to the database
        session.refresh(db_asset)                     # Refresh the instance with latest data
        return db_asset

@app.delete("/assets/{asset_id}")
def delete_asset(asset_id: int):
    with Session(engine) as session:
        asset = session.get(Asset, asset_id)         # Retrieve Asset to delete
        if not asset:
            raise HTTPException(status_code=404, detail="Asset not found")
        session.delete(asset)      # Delete the Asset record from the database
        session.commit()           # Commit the deletion
        return {"ok": True}       # Return a success response