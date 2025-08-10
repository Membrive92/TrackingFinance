from __future__ import annotations
from typing import Optional
from pydantic import BaseModel, Field
from app.domain.enums import AssetType, Currency

class AssetCreate(BaseModel):
    ticker: str = Field(min_length=1, max_length=20)
    asset_type: AssetType
    current_price: float
    currency: Currency = Currency.EUR

class AssetRead(BaseModel):
    id: int
    ticker: str
    asset_type: AssetType
    current_price: float
    currency: Currency

class AssetUpdate(BaseModel):
    ticker: Optional[str] = Field(default=None, min_length=1, max_length=20)
    asset_type: Optional[AssetType] = None
    current_price: Optional[float] = None
    currency: Optional[Currency] = None
