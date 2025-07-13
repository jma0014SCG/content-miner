from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.gumloop_service import GumloopService
from app.services.polling_service import PollingService
from app.models.video import VideoSummaryRequest, VideoSummaryResponse

router = APIRouter()

class VideoURLRequest(BaseModel):
    url: str

@router.post("/summarize", response_model=VideoSummaryResponse)
async def summarize_video(request: VideoURLRequest):
    """
    Summarize a YouTube video from URL.
    """
    try:
        gumloop_service = GumloopService()
        polling_service = PollingService()
        
        # Start Gumloop job
        job_id = await gumloop_service.start_video_summary(request.url)
        
        # Poll for results
        result = await polling_service.poll_for_result(job_id)
        
        return VideoSummaryResponse(
            url=request.url,
            summary=result.get("summary", ""),
            metadata=result.get("metadata", {})
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status/{job_id}")
async def get_job_status(job_id: str):
    """
    Get the status of a video summarization job.
    """
    try:
        gumloop_service = GumloopService()
        status = await gumloop_service.get_job_status(job_id)
        return {"job_id": job_id, "status": status}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))