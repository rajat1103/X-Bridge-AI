"""
X-Bridge AI - Core Config
Reads settings from environment variables with sensible defaults.
"""

import os


class Settings:
    APP_NAME: str = "X-Bridge AI"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "production")
    ALLOWED_ORIGINS: list = [
        o.strip()
        for o in os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
        if o.strip()
    ]
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-1.5-pro")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "xbridge-secret")


settings = Settings()
