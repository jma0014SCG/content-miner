import httpx
import os
from typing import Dict, Any
import json

class GumloopService:
    def __init__(self):
        # Use the API key and IDs from the provided code
        self.api_key = os.getenv("GUMLOOP_API_KEY", "b29a51e34c8d475b9a936d9dbc078d24")
        self.user_id = "BOJsm756awOuwFoccac3ISyK4cV2"
        self.video_flow_id = "3Vpp129QhZwNEnuhbQPGz2"
        self.channel_flow_id = "nt6xZYT6ap9kqVh5MR1kyz"
        self.base_url = "https://api.gumloop.com"
        
        print(f"Gumloop API Key: {self.api_key}")
        print(f"Video Flow ID: {self.video_flow_id}")
        print(f"Channel Flow ID: {self.channel_flow_id}")
        
        if not self.api_key:
            raise ValueError("Missing Gumloop API key")
    
    async def start_video_summary(self, video_url: str) -> str:
        """
        Start a video summarization job with Gumloop.
        Returns run_id for polling.
        """
        async with httpx.AsyncClient() as client:
            # Video URL goes in the payload as "link"
            payload = {
                "link": video_url
            }
            
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            # Use the specific video flow ID and user ID from provided code
            video_flow_id = "3Vpp129QhZwNEnuhbQPGz2"  # Video flow ID
            user_id = "BOJsm756awOuwFoccac3ISyK4cV2"  # User ID from provided code
            
            # Parameters go in URL query string
            url = f"{self.base_url}/api/v1/start_pipeline?user_id={user_id}&saved_item_id={video_flow_id}"
            
            response = await client.post(
                url,
                json=payload,
                headers=headers
            )
            
            if response.status_code != 200:
                raise Exception(f"Failed to start video summary: {response.text}")
            
            result = response.json()
            return result.get("run_id")
    
    async def start_channel_analysis(self, channel_url: str) -> str:
        """
        Start a channel analysis job with Gumloop.
        Returns run_id for polling.
        """
        async with httpx.AsyncClient() as client:
            # Use the correct pipeline_inputs format for channel analysis
            payload = {
                "saved_item_id": "nt6xZYT6ap9kqVh5MR1kyz",
                "user_id": "BOJsm756awOuwFoccac3ISyK4cV2",
                "pipeline_inputs": [
                    {
                        "input_name": "link",
                        "value": channel_url
                    }
                ]
            }
            
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            # Use the base URL without query parameters
            url = f"{self.base_url}/api/v1/start_pipeline"
            
            response = await client.post(
                url,
                json=payload,
                headers=headers
            )
            
            if response.status_code != 200:
                raise Exception(f"Failed to start channel analysis: {response.text}")
            
            result = response.json()
            new_run_id = result.get("run_id")
            print(f"🚀 GUMLOOP: Started new channel analysis with run_id: {new_run_id}")
            print(f"🚀 GUMLOOP: Channel URL: {channel_url}")
            return new_run_id
    
    async def get_job_status(self, run_id: str) -> Dict[str, Any]:
        """
        Get the status of a Gumloop pipeline run.
        """
        async with httpx.AsyncClient() as client:
            headers = {
                "Authorization": f"Bearer {self.api_key}"
            }
            
            # Use the specific user ID from the provided code
            user_id = "BOJsm756awOuwFoccac3ISyK4cV2"
            
            # Use query parameters for the get_pl_run endpoint
            params = {
                "run_id": run_id,
                "user_id": user_id
            }
            
            response = await client.get(
                f"{self.base_url}/api/v1/get_pl_run",
                headers=headers,
                params=params
            )
            
            if response.status_code != 200:
                raise Exception(f"Failed to get run status: {response.text}")
            
            result = response.json()
            print(f"📊 POLLING: Querying run_id: {run_id}")
            print(f"📊 POLLING: State: {result.get('state')}")
            print(f"📊 POLLING: Input URL: {result.get('inputs', {}).get('link', 'No URL')}")
            
            return result