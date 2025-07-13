from pydantic import BaseModel
from typing import Dict, Any, List, Optional, Union

class ChannelAnalysisRequest(BaseModel):
    url: str

class ChannelAnalysisResponse(BaseModel):
    url: str
    analysis: Union[str, Dict[str, Any]]  # Can be string or dict
    content_gaps: List[str]
    metadata: Dict[str, Any]
    
class ChannelJobStatus(BaseModel):
    job_id: str
    status: str
    progress: Optional[int] = None
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None