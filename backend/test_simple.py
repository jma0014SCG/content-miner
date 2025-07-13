#!/usr/bin/env python3

import sys
import os
sys.path.append('/Users/jeffaxelrod/content_miner/backend')

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv()

print("Testing environment variables:")
print(f"GUMLOOP_API_KEY: {os.getenv('GUMLOOP_API_KEY')}")
print(f"USER_ID: {os.getenv('USER_ID')}")
print(f"FLOW_VIDEO_ID: {os.getenv('FLOW_VIDEO_ID')}")
print(f"FLOW_CHANNEL_ID: {os.getenv('FLOW_CHANNEL_ID')}")

# Test simple FastAPI import
try:
    from app.main import app
    print("✅ FastAPI app imported successfully")
except Exception as e:
    print(f"❌ Error importing FastAPI app: {e}")

# Test Gumloop service
try:
    from app.services.gumloop_service import GumloopService
    service = GumloopService()
    print("✅ GumloopService created successfully")
except Exception as e:
    print(f"❌ Error creating GumloopService: {e}")