import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from typing import List
from sqlmodel import SQLModel, Session, create_engine, select
from app.models import Asset, Transaction, Retention, ExchangeRate, Configuration

# Load environment variables from .env
load_dotenv()

# Read database credentials from environment (no hardcoding)
PG_USER = os.environ["PG_USER"]
PG_PASSWORD = os.environ["PG_PASSWORD"]
PG_HOST = os.environ["PG_HOST"]
PG_PORT = int(os.environ["PG_PORT"])
PG_DB = os.environ["PG_DB"]

# Create database engine using connect_args to avoid credentials in URL
engine = create_engine(
    "postgresql+pg8000://",
    echo=True,
    connect_args={
        "user": PG_USER,
        "password": PG_PASSWORD,
        "host": PG_HOST,
        "port": PG_PORT,
        "database": PG_DB,
    },
)

# Auto-create tables based on SQLModel metadata
SQLModel.metadata.create_all(engine)

# Instantiate FastAPI application
app = FastAPI(title="Investment Tracker API")


# --- CRUD endpoints for Asset ---


@app.post("/assets/", response_model=Asset)
def create_asset(asset: Asset):
    with Session(engine) as session:
        session.add(asset)
        session.commit()
        session.refresh(asset)
        return asset


@app.get("/assets/", response_model=List[Asset])
def list_assets():
    with Session(engine) as session:
        return session.exec(select(Asset)).all()


@app.get("/assets/{asset_id}", response_model=Asset)
def get_asset(asset_id: int):
    with Session(engine) as session:
        asset = session.get(Asset, asset_id)
        if not asset:
            raise HTTPException(status_code=404, detail="Asset not found")
        return asset


@app.patch("/assets/{asset_id}", response_model=Asset)
def update_asset(asset_id: int, asset: Asset):
    with Session(engine) as session:
        db_asset = session.get(Asset, asset_id)
        if not db_asset:
            raise HTTPException(status_code=404, detail="Asset not found")
        updates = asset.model_dump(exclude_unset=True)  # use model_dump instead of dict
        for key, val in updates.items():
            setattr(db_asset, key, val)
        session.add(db_asset)
        session.commit()
        session.refresh(db_asset)
        return db_asset


@app.delete("/assets/{asset_id}")
def delete_asset(asset_id: int):
    with Session(engine) as session:
        asset = session.get(Asset, asset_id)
        if not asset:
            raise HTTPException(status_code=404, detail="Asset not found")
        session.delete(asset)
        session.commit()
        return {"ok": True}


# --- CRUD endpoints for Transaction ---
@app.post("/transactions/", response_model=Transaction)
def create_transaction(transaction: Transaction):
    with Session(engine) as session:
        session.add(transaction)
        session.commit()
        session.refresh(transaction)
        return transaction


@app.get("/transactions/", response_model=List[Transaction])
def list_transactions():
    with Session(engine) as session:
        return session.exec(select(Transaction)).all()


@app.get("/transactions/{transaction_id}", response_model=Transaction)
def get_transaction(transaction_id: int):
    with Session(engine) as session:
        txn = session.get(Transaction, transaction_id)
        if not txn:
            raise HTTPException(status_code=404, detail="Transaction not found")
        return txn


@app.patch("/transactions/{transaction_id}", response_model=Transaction)
def update_transaction(transaction_id: int, transaction: Transaction):
    with Session(engine) as session:
        db_txn = session.get(Transaction, transaction_id)
        if not db_txn:
            raise HTTPException(status_code=404, detail="Transaction not found")
        updates = transaction.model_dump(exclude_unset=True)  # use model_dump
        for key, val in updates.items():
            setattr(db_txn, key, val)
        session.add(db_txn)
        session.commit()
        session.refresh(db_txn)
        return db_txn


@app.delete("/transactions/{transaction_id}")
def delete_transaction(transaction_id: int):
    with Session(engine) as session:
        txn = session.get(Transaction, transaction_id)
        if not txn:
            raise HTTPException(status_code=404, detail="Transaction not found")
        session.delete(txn)
        session.commit()
        return {"ok": True}


# Further endpoints for Retention, ExchangeRate, Configuration can be added similarly
