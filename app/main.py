import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from sqlmodel import SQLModel, Session, create_engine, select
from app.models import Asset

# Load .env
load_dotenv()
PG_USER     = os.getenv("PG_USER")
PG_PASSWORD = os.getenv("PG_PASSWORD")
PG_HOST     = os.getenv("PG_HOST", "localhost")
PG_PORT     = os.getenv("PG_PORT", "5432")
PG_DB       = os.getenv("PG_DB")

# Build a standard DSN string; pg8000 handles Unicode passwords correctly
DATABASE_URL = (
    f"postgresql+pg8000://"
    f"{PG_USER}:{PG_PASSWORD}@"
    f"{PG_HOST}:{PG_PORT}/{PG_DB}"
)

# Create the engine with pg8000
engine = create_engine(DATABASE_URL, echo=True)

# Auto-create tables
SQLModel.metadata.create_all(engine)

# Instantiate FastAPI
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
        return session.exec(select(Asset)).all()  # Fetch all Asset records

@app.get("/assets/{asset_id}", response_model=Asset)
def get_asset(asset_id: int):
    with Session(engine) as session:
        asset = session.get(Asset, asset_id)       # Retrieve Asset by primary key
        if not asset:
            raise HTTPException(status_code=404, detail="Asset not found")
        return asset

@app.patch("/assets/{asset_id}", response_model=Asset)
def update_asset(asset_id: int, asset: Asset):
    with Session(engine) as session:
        db_asset = session.get(Asset, asset_id)
        if not db_asset:
            raise HTTPException(status_code=404, detail="Asset not found")
        updated_data = asset.dict(exclude_unset=True)  # Only update provided fields
        for key, val in updated_data.items():
            setattr(db_asset, key, val)              # Apply updates
        session.add(db_asset)
        session.commit()                             # Commit updates to the database
        session.refresh(db_asset)                    # Refresh the instance with latest data
        return db_asset

@app.delete("/assets/{asset_id}")
def delete_asset(asset_id: int):
    with Session(engine) as session:
        asset = session.get(Asset, asset_id)         # Retrieve Asset to delete
        if not asset:
            raise HTTPException(status_code=404, detail="Asset not found")
        session.delete(asset)                        # Delete the Asset record from the database
        session.commit()                             # Commit the deletion
        return {"ok": True}                          # Return a success response
