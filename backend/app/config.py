import os
from typing import Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Gumloop API Configuration
    gumloop_api_key: str
    user_id: str
    flow_video_id: str
    flow_channel_id: str
    
    # API Configuration
    api_host: str = "localhost"
    api_port: int = 8000
    frontend_url: str = "http://localhost:3000"
    
    # Environment
    environment: str = "development"
    
    # Analytics
    posthog_api_key: Optional[str] = None
    posthog_host: str = "https://app.posthog.com"
    
    # Monitoring
    otel_exporter_otlp_endpoint: Optional[str] = None
    
    # Polling Configuration
    polling_interval: int = 2  # seconds
    max_polling_time: int = 600  # 10 minutes
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()