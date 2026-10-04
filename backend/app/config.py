import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "SACH AI"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:80",
        "*"
    ]
    
    # AI and NLP providers
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "offline_demo")
    LLM_MODEL: str = os.getenv("LLM_MODEL", "gpt-4o-mini")
    
    # Speech
    STT_ENGINE: str = os.getenv("STT_ENGINE", "local_speech_recognition")
    TTS_ENGINE: str = os.getenv("TTS_ENGINE", "gtts")
    
    # Database and retention
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./sach_ai.db")
    ENABLE_AUDIO_STORAGE: bool = os.getenv("ENABLE_AUDIO_STORAGE", "false").lower() == "true"
    MAX_AUDIO_SIZE_MB: int = int(os.getenv("MAX_AUDIO_SIZE_MB", "15"))
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
