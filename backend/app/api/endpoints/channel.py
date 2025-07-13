from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.gumloop_service import GumloopService
from app.services.polling_service import PollingService
from app.models.channel import ChannelAnalysisRequest, ChannelAnalysisResponse

router = APIRouter()

class ChannelURLRequest(BaseModel):
    url: str

@router.post("/analyze", response_model=ChannelAnalysisResponse)
async def analyze_channel(request: ChannelURLRequest):
    """
    Analyze a YouTube channel from URL.
    """
    try:
        gumloop_service = GumloopService()
        polling_service = PollingService()
        
        # Start Gumloop job
        job_id = await gumloop_service.start_channel_analysis(request.url)
        
        # Poll for results
        result = await polling_service.poll_for_result(job_id)
        
        # Debug logging
        print(f"🔍 DEBUG: job_id = {job_id}")
        print(f"🔍 DEBUG: result keys = {list(result.keys())}")
        print(f"🔍 DEBUG: metadata = {result.get('metadata', {})}")
        
        return ChannelAnalysisResponse(
            url=request.url,
            analysis=result.get("analysis") or result.get("summary", "No analysis available"),
            content_gaps=result.get("content_gaps", []),
            metadata=result.get("metadata", {})
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status/{job_id}")
async def get_job_status(job_id: str):
    """
    Get the status of a channel analysis job.
    """
    try:
        gumloop_service = GumloopService()
        status = await gumloop_service.get_job_status(job_id)
        return {"job_id": job_id, "status": status}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))