from datetime import date, datetime
from typing import List, Optional
from sqlmodel import SQLModel, Field, Relationship

class Asset(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)  # Primary key, auto-generated
    ticker: str                                              # Asset symbol (e.g., 'MSTY', 'BTC')
    asset_type: str                                          # Type of asset (e.g., 'ETF', 'Crypto')
    current_price: float                                     # Current price in specified currency
    currency: str = Field(default="EUR", max_length=3)     # Currency code, default 'EUR'
    created_at: datetime = Field(default_factory=datetime.now)  # Timestamp when record was created

    # One-to-many relationship: Asset -> Transaction
    transactions: List["Transaction"] = Relationship(back_populates="asset")


class Transaction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)  # Primary key, auto-generated
    asset_id: int = Field(foreign_key="asset.id")            # Foreign key to Asset table
    date: date                                                # Date of the transaction
    transaction_type: str                                     # 'buy', 'sell', 'dividend'
    quantity: float                                           # Quantity of units or shares
    unit_price: float                                         # Price per unit in the transaction currency
    currency: str                                             # Currency of the transaction
    recorded_at: datetime = Field(default_factory=datetime.now)  # Timestamp when transaction was recorded

    # Many-to-one relationship: Transaction -> Asset
    asset: Optional[Asset] = Relationship(back_populates="transactions")
    # One-to-many relationship: Transaction -> Retention
    retentions: List["Retention"] = Relationship(back_populates="transaction")


class Retention(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)  # Primary key, auto-generated
    transaction_id: Optional[int] = Field(foreign_key="transaction.id")  # FK to Transaction table
    month: date                                               # Month of the retention (e.g., 2025-06-01)
    gross_amount: float                                       # Gross amount before retention
    retention_pct: float                                      # Retention percentage (e.g., 0.15)
    origin_retention: float                                   # Retention amount at source
    net_amount: float                                         # Net amount after retention
    recorded_at: datetime = Field(default_factory=datetime.now)  # Timestamp when retention was recorded

    # Many-to-one relationship: Retention -> Transaction
    transaction: Optional[Transaction] = Relationship(back_populates="retentions")


class ExchangeRate(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)  # Primary key, auto-generated
    from_currency: str = Field(max_length=3)                   # Source currency code
    to_currency: str = Field(max_length=3)                     # Target currency code
    rate_date: date                                            # Date of the exchange rate
    rate: float                                                # Exchange rate value


class Configuration(SQLModel, table=True):
    key: str = Field(primary_key=True, max_length=50)          # Configuration key (e.g., 'default_currency')
    value: str                                                # Configuration value (e.g., 'EUR')