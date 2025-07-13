#!/usr/bin/env python3

import os
import sys
import asyncio
import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import uvicorn

# Load environment
load_dotenv()

app = FastAPI(title="Insight API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VideoRequest(BaseModel):
    url: str

class VideoResponse(BaseModel):
    url: str
    summary: str
    metadata: dict

class GumloopService:
    def __init__(self):
        self.api_key = os.getenv("GUMLOOP_API_KEY")
        self.user_id = os.getenv("USER_ID")
        self.video_flow_id = os.getenv("FLOW_VIDEO_ID")
        self.channel_flow_id = os.getenv("FLOW_CHANNEL_ID")
        self.base_url = "https://api.gumloop.com"
        
    async def start_pipeline(self, saved_item_id: str) -> str:
        async with httpx.AsyncClient(timeout=30.0) as client:
            payload = {
                "user_id": self.user_id,
                "saved_item_id": saved_item_id
            }
            
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            response = await client.post(
                f"{self.base_url}/api/v1/start_pipeline",
                json=payload,
                headers=headers
            )
            
            if response.status_code != 200:
                raise Exception(f"Failed to start pipeline: {response.text}")
            
            result = response.json()
            return result.get("run_id")
    
    async def get_run_status(self, run_id: str) -> dict:
        async with httpx.AsyncClient(timeout=30.0) as client:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            response = await client.get(
                f"{self.base_url}/api/v1/runs/{run_id}",
                headers=headers
            )
            
            if response.status_code != 200:
                raise Exception(f"Failed to get run status: {response.text}")
            
            return response.json()
    
    async def poll_for_completion(self, run_id: str, max_wait: int = 600) -> dict:
        start_time = asyncio.get_event_loop().time()
        current_interval = 3
        
        print(f"🔄 Polling for completion of run {run_id}...")
        
        while True:
            elapsed = asyncio.get_event_loop().time() - start_time
            
            if elapsed > max_wait:
                raise Exception(f"Pipeline {run_id} timed out after {max_wait} seconds")
            
            try:
                status_response = await self.get_run_status(run_id)
                state = status_response.get("state")
                
                print(f"⏱️  State: {state} (elapsed: {elapsed:.1f}s)")
                
                if state == "DONE":
                    outputs = status_response.get("outputs", {})
                    summary = outputs.get("summary", "No summary available")
                    
                    return {
                        "summary": summary,
                        "metadata": {
                            "run_id": run_id,
                            "state": state,
                            "finished_ts": status_response.get("finished_ts"),
                            "credit_cost": status_response.get("credit_cost")
                        }
                    }
                elif state == "FAILED":
                    raise Exception(f"Pipeline {run_id} failed")
                elif state in ["RUNNING", "PENDING", None]:
                    await asyncio.sleep(current_interval)
                    current_interval = min(current_interval * 1.2, 10)
                else:
                    raise Exception(f"Unknown pipeline state: {state}")
                    
            except Exception as e:
                if "timed out" in str(e) or "failed" in str(e):
                    raise
                print(f"⚠️  Error checking status: {e}")
                await asyncio.sleep(current_interval)

@app.get("/")
async def root():
    return {"message": "Insight API is running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/api/v1/video/summarize", response_model=VideoResponse)
async def summarize_video(request: VideoRequest):
    try:
        print(f"🎬 Starting video summarization for: {request.url}")
        
        gumloop = GumloopService()
        
        # Start the pipeline
        run_id = await gumloop.start_pipeline(gumloop.video_flow_id)
        print(f"✅ Pipeline started! Run ID: {run_id}")
        
        # Poll for completion
        result = await gumloop.poll_for_completion(run_id)
        
        print(f"🎉 Pipeline completed! Summary length: {len(result['summary'])} chars")
        
        return VideoResponse(
            url=request.url,
            summary=result["summary"],
            metadata=result["metadata"]
        )
        
    except Exception as e:
        print(f"❌ Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/channel/analyze")
async def analyze_channel(request: VideoRequest):
    try:
        print(f"📺 Starting channel analysis for: {request.url}")
        
        gumloop = GumloopService()
        
        # Start the pipeline
        run_id = await gumloop.start_pipeline(gumloop.channel_flow_id)
        print(f"✅ Channel pipeline started! Run ID: {run_id}")
        
        # Poll for completion
        result = await gumloop.poll_for_completion(run_id)
        
        return {
            "url": request.url,
            "analysis": {"summary": result["summary"]},
            "content_gaps": [],
            "metadata": result["metadata"]
        }
        
    except Exception as e:
        print(f"❌ Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    print("🚀 Starting Working Insight Backend...")
    print(f"API Key: {'✅' if os.getenv('GUMLOOP_API_KEY') else '❌'}")
    print(f"User ID: {os.getenv('USER_ID')}")
    print(f"Video Flow ID: {os.getenv('FLOW_VIDEO_ID')}")
    print(f"Channel Flow ID: {os.getenv('FLOW_CHANNEL_ID')}")
    
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")