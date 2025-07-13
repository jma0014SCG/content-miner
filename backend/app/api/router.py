from fastapi import APIRouter
from app.api.endpoints import video, channel

api_router = APIRouter()

api_router.include_router(video.router, prefix="/video", tags=["video"])
api_router.include_router(channel.router, prefix="/channel", tags=["channel"])