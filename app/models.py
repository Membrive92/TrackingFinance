from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import String
from sqlmodel import SQLModel, Field

from app.domain.enums import AssetType, Currency


class Asset(SQLModel, table=True):
    """
    Asset master record.
    - ticker: instrument symbol (e.g., 'MSTY')
    - asset_type: validated by Enum; stored as VARCHAR in the DB
    - currency: validated by Enum; stored as VARCHAR(3) in the DB
    """
    __tablename__ = "asset"

    id: Optional[int] = Field(default=None, primary_key=True)

    # Fast lookup by ticker (max_length validated at API/schema level)
    ticker: str = Field(index=True, max_length=20, description="Instrument symbol (e.g., 'MSTY')")

    # Validate with Enum; persist as generic VARCHAR (safe with existing schema)
    asset_type: AssetType = Field(
        sa_type=String,               # NOTE: pass the type, not an instance
        index=True,
        description="ETF/STOCK/CRYPTO",
    )

    # Current price (>= 0). A DB CHECK constraint can be added later via Alembic.
    current_price: float = Field(ge=0, description="Latest known price in 'currency'")

    # Validate with Enum; persist as VARCHAR(3) (ISO-4217)
    currency: Currency = Field(
        default=Currency.EUR,
        sa_type=String,               # store as text for now
        description="ISO-4217 currency",
    )

    # Store timezone-aware UTC timestamps
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
