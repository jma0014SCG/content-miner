#!/usr/bin/env python3

import asyncio
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

async def test_get_run():
    api_key = os.getenv("GUMLOOP_API_KEY")
    user_id = os.getenv("USER_ID")
    
    # Use the run ID from the earlier successful test
    run_id = "JGDnHeZgCpgxvDXoCFbcEC"  # This should be completed
    
    print(f"🔍 Testing get_pl_run endpoint...")
    print(f"Run ID: {run_id}")
    print(f"User ID: {user_id}")
    
    headers = {
        "Authorization": f"Bearer {api_key}"
    }
    
    params = {
        "run_id": run_id,
        "user_id": user_id
    }
    
    url = "https://api.gumloop.com/api/v1/get_pl_run"
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            response = await client.get(
                url,
                headers=headers,
                params=params
            )
            
            print(f"\n📊 Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                state = result.get("state")
                print(f"🔄 State: {state}")
                
                if state == "DONE":
                    outputs = result.get("outputs", {})
                    summary = outputs.get("summary", "No summary found")
                    print(f"✅ SUCCESS! Summary length: {len(summary)} chars")
                    print(f"📝 Summary preview: {summary[:200]}...")
                    
                    # Show metadata
                    print(f"💰 Cost: {result.get('credit_cost', 'N/A')} credits")
                    print(f"⏱️  Finished: {result.get('finished_ts', 'N/A')}")
                else:
                    print(f"⏳ Status: {state}")
            else:
                print(f"❌ Error: {response.text}")
                
        except Exception as e:
            print(f"💥 Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_get_run())