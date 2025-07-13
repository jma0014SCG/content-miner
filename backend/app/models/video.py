from pydantic import BaseModel
from typing import Dict, Any, Optional

class VideoSummaryRequest(BaseModel):
    url: str

class VideoSummaryResponse(BaseModel):
    url: str
    summary: str
    metadata: Dict[str, Any]
    
class VideoJobStatus(BaseModel):
    job_id: str
    status: str
    progress: Optional[int] = None
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None