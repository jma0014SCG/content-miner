import asyncio
from typing import Dict, Any
from app.services.gumloop_service import GumloopService

class PollingService:
    def __init__(self, poll_interval: int = 2, max_wait_time: int = 600):
        self.poll_interval = poll_interval
        self.max_wait_time = max_wait_time
        self.gumloop_service = GumloopService()
    
    async def poll_for_result(self, job_id: str) -> Dict[str, Any]:
        """
        Poll Gumloop for job completion with exponential backoff.
        """
        print(f"🔄 POLLING START: job_id = {job_id}")
        start_time = asyncio.get_event_loop().time()
        current_interval = self.poll_interval
        
        while True:
            elapsed = asyncio.get_event_loop().time() - start_time
            
            if elapsed > self.max_wait_time:
                raise Exception(f"Job {job_id} timed out after {self.max_wait_time} seconds")
            
            try:
                status_response = await self.gumloop_service.get_job_status(job_id)
                state = status_response.get("state")
                
                if state == "DONE":
                    # Extract the content from outputs
                    outputs = status_response.get("outputs", {})
                    
                    # Try "summary" first (for video analysis), then "output" (for channel analysis)
                    content = outputs.get("summary") or outputs.get("output", "No content available")
                    
                    return {
                        "summary": content,
                        "analysis": content,  # For channel analysis compatibility
                        "metadata": {
                            "run_id": job_id,
                            "state": state,
                            "finished_ts": status_response.get("finished_ts"),
                            "credit_cost": status_response.get("credit_cost"),
                            "duration": None  # Can calculate from timestamps if needed
                        }
                    }
                elif state == "FAILED":
                    raise Exception(f"Pipeline {job_id} failed")
                elif state in ["RUNNING", "PENDING", None]:
                    await asyncio.sleep(current_interval)
                    # Exponential backoff with max of 10 seconds
                    current_interval = min(current_interval * 1.5, 10)
                else:
                    raise Exception(f"Unknown pipeline state: {state}")
                    
            except Exception as e:
                if "timed out" in str(e) or "failed" in str(e):
                    raise
                # For other errors, wait and retry
                await asyncio.sleep(current_interval)
                current_interval = min(current_interval * 1.5, 10)