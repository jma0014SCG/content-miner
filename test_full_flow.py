#!/usr/bin/env python3

import asyncio
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

class GumloopService:
    def __init__(self):
        self.api_key = os.getenv("GUMLOOP_API_KEY")
        self.user_id = os.getenv("USER_ID")
        self.video_flow_id = os.getenv("FLOW_VIDEO_ID")
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
            
            print(f"🚀 Starting pipeline...")
            print(f"Payload: {payload}")
            
            response = await client.post(
                f"{self.base_url}/api/v1/start_pipeline",
                json=payload,
                headers=headers
            )
            
            print(f"Status: {response.status_code}")
            print(f"Response: {response.text}")
            
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

async def test_complete_flow():
    print("🧪 Testing Complete Gumloop Flow")
    
    gumloop = GumloopService()
    
    try:
        # Step 1: Start pipeline
        run_id = await gumloop.start_pipeline(gumloop.video_flow_id)
        print(f"✅ Pipeline started! Run ID: {run_id}")
        
        # Step 2: Check status immediately
        status = await gumloop.get_run_status(run_id)
        print(f"📊 Initial Status: {status.get('state')}")
        
        # Step 3: Wait a bit and check again
        print("⏳ Waiting 10 seconds...")
        await asyncio.sleep(10)
        
        status = await gumloop.get_run_status(run_id)
        state = status.get('state')
        print(f"📊 Status after 10s: {state}")
        
        if state == "DONE":
            outputs = status.get("outputs", {})
            summary = outputs.get("summary", "No summary")
            print(f"🎉 DONE! Summary length: {len(summary)} chars")
            print(f"📝 Summary preview: {summary[:200]}...")
        else:
            print(f"⏳ Still running. Check manually at: https://gumloop.com/pipeline?run_id={run_id}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_complete_flow())