
from typing import Optional
from pydantic import BaseModel, Field

# What the client sends to create an asset
class AssetCreate(BaseModel):
    ticker: str
    asset_type: str
    current_price: float
    currency: str = Field("EUR", min_length=3, max_length=3)

# What the API returns to the client
class AssetRead(BaseModel):
    id: int
    ticker: str
    asset_type: str
    current_price: float
    currency: str

# What the client can send to partially update an asset
class AssetUpdate(BaseModel):
    ticker: Optional[str] = None
    asset_type: Optional[str] = None
    current_price: Optional[float] = None
    currency: Optional[str] = None
