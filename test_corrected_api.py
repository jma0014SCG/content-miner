#!/usr/bin/env python3

import asyncio
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

async def test_corrected_api():
    api_key = os.getenv("GUMLOOP_API_KEY")
    user_id = os.getenv("USER_ID")
    saved_item_id = os.getenv("FLOW_VIDEO_ID")
    
    print(f"🔑 API Key: {api_key[:10]}..." if api_key else "❌ No API key")
    print(f"👤 User ID: {user_id}")
    print(f"💾 Saved Item ID: {saved_item_id}")
    
    payload = {
        "user_id": user_id,
        "saved_item_id": saved_item_id
    }
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    print(f"\n📡 Testing Corrected Gumloop API...")
    print(f"URL: https://api.gumloop.com/api/v1/start_pipeline")
    print(f"Payload: {payload}")
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            response = await client.post(
                "https://api.gumloop.com/api/v1/start_pipeline",
                json=payload,
                headers=headers
            )
            
            print(f"\n📊 Status: {response.status_code}")
            print(f"📄 Response: {response.text}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Success! Run ID: {result.get('run_id')}")
                return result.get('run_id')
            else:
                print(f"❌ Failed: {response.text}")
                
        except Exception as e:
            print(f"💥 Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_corrected_api())