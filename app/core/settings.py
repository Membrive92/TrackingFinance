from typing import List
import json

from pydantic import ValidationError
from pydantic_settings import BaseSettings, SettingsConfigDict  # v2: import here

class Settings(BaseSettings):
    # DB (required)
    PG_USER: str
    PG_PASSWORD: str
    PG_HOST: str
    PG_PORT: int
    PG_DB: str

    # Misc
    DEBUG: bool = False
    CORS_ORIGINS: List[str] = ["http://localhost:4200"]  # can be overridden via .env

    # Pydantic v2 style config (replaces "class Config")
    model_config = SettingsConfigDict(env_file=".env")

    # Allow CORS_ORIGINS to be provided as a JSON string or single URL
    @staticmethod
    def _parse_cors(value):
        if isinstance(value, list):
            return value
        if isinstance(value, str):
            try:
                return json.loads(value)  # e.g., '["http://localhost:4200"]'
            except Exception:
                return [value]
        return ["http://localhost:4200"]

    def __init__(self, **values):
        super().__init__(**values)
        self.CORS_ORIGINS = self._parse_cors(self.CORS_ORIGINS)

try:
    settings = Settings()
except ValidationError as e:
    # Fail fast at startup if required env vars are missing or invalid
    raise RuntimeError(f"Config error: {e}")