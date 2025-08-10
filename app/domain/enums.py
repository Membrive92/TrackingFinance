from enum import Enum

class AssetType(str, Enum):
    ETF = "ETF"
    STOCK = "STOCK"
    CRYPTO = "CRYPTO"

class Currency(str, Enum):
    USD = "USD"
    EUR = "EUR"
