#!/usr/bin/env python3

import os
import asyncio
import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import uvicorn

# Load environment
load_dotenv()

app = FastAPI(title="Insight API - Simple Working Version", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VideoRequest(BaseModel):
    url: str

@app.get("/")
async def root():
    return {"message": "Insight API is running - Simple Working Version"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/api/v1/video/summarize")
async def summarize_video(request: VideoRequest):
    try:
        api_key = os.getenv("GUMLOOP_API_KEY")
        user_id = os.getenv("USER_ID")
        saved_item_id = os.getenv("FLOW_VIDEO_ID")
        
        print(f"🎬 Starting video summarization for: {request.url}")
        
        payload = {
            "user_id": user_id,
            "saved_item_id": saved_item_id
        }
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                "https://api.gumloop.com/api/v1/start_pipeline",
                json=payload,
                headers=headers
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=500, detail=f"Gumloop API error: {response.text}")
            
            result = response.json()
            run_id = result.get("run_id")
            gumloop_url = result.get("url")
            
            print(f"✅ Pipeline started! Run ID: {run_id}")
            
            # Return immediate response with instructions
            summary = f"""# ✅ Video Summarization Started!

Your YouTube video is being processed by AI.

**Run ID:** `{run_id}`

**Status:** Processing started successfully

**Next Steps:**
1. Click the link below to view real-time progress
2. The summary will appear automatically when complete (usually 2-3 minutes)
3. You can bookmark this page and return later

**Track Progress:** [{gumloop_url}]({gumloop_url})

---

*Your video: {request.url}*

*Note: This is a working demo. The AI is currently analyzing your video and will generate a comprehensive summary with key insights, main points, and actionable takeaways.*"""
            
            return {
                "url": request.url,
                "summary": summary,
                "metadata": {
                    "run_id": run_id,
                    "status": "started",
                    "gumloop_url": gumloop_url,
                    "estimated_completion": "2-3 minutes"
                }
            }
            
    except Exception as e:
        print(f"❌ Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/channel/analyze")
async def analyze_channel(request: VideoRequest):
    try:
        api_key = os.getenv("GUMLOOP_API_KEY")
        user_id = os.getenv("USER_ID")
        saved_item_id = os.getenv("FLOW_CHANNEL_ID")
        
        print(f"📺 Starting channel analysis for: {request.url}")
        
        payload = {
            "user_id": user_id,
            "saved_item_id": saved_item_id
        }
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                "https://api.gumloop.com/api/v1/start_pipeline",
                json=payload,
                headers=headers
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=500, detail=f"Gumloop API error: {response.text}")
            
            result = response.json()
            run_id = result.get("run_id")
            gumloop_url = result.get("url")
            
            print(f"✅ Channel analysis started! Run ID: {run_id}")
            
            analysis_summary = f"""# 📊 Channel Analysis Started!

Your YouTube channel is being analyzed by AI for competitive intelligence.

**Run ID:** `{run_id}`

**Analysis includes:**
- Content themes and patterns
- Video frequency and length analysis  
- Topic gaps and opportunities
- Competitive positioning insights

**Track Progress:** [{gumloop_url}]({gumloop_url})

---

*Channel: {request.url}*

*Estimated completion: 3-5 minutes*"""
            
            return {
                "url": request.url,
                "analysis": {"summary": analysis_summary},
                "content_gaps": ["Analysis in progress - check the Gumloop link above"],
                "metadata": {
                    "run_id": run_id,
                    "status": "started",
                    "gumloop_url": gumloop_url,
                    "estimated_completion": "3-5 minutes"
                }
            }
            
    except Exception as e:
        print(f"❌ Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    print("🚀 Starting Simple Working Insight Backend...")
    print(f"API Key: {'✅' if os.getenv('GUMLOOP_API_KEY') else '❌'}")
    print(f"User ID: {os.getenv('USER_ID')}")
    print(f"Video Flow ID: {os.getenv('FLOW_VIDEO_ID')}")
    print(f"Channel Flow ID: {os.getenv('FLOW_CHANNEL_ID')}")
    print("\n📝 This version starts the AI processing and provides a link to track progress.")
    print("🔗 Users can follow the Gumloop link to see real-time results.")
    
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")