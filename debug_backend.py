#!/usr/bin/env python3

import os
import sys
from pathlib import Path

# Change to backend directory
backend_dir = Path("/Users/jeffaxelrod/content_miner/backend")
os.chdir(backend_dir)
sys.path.insert(0, str(backend_dir))

print(f"🔍 Current directory: {os.getcwd()}")
print(f"🔍 Python path: {sys.path[0]}")

# Load environment
from dotenv import load_dotenv
load_dotenv()

print("\n📋 Environment Variables:")
print(f"GUMLOOP_API_KEY: {os.getenv('GUMLOOP_API_KEY')[:10]}..." if os.getenv('GUMLOOP_API_KEY') else "❌ Missing")
print(f"USER_ID: {os.getenv('USER_ID')}")
print(f"FLOW_VIDEO_ID: {os.getenv('FLOW_VIDEO_ID')}")

# Test imports
print("\n🔧 Testing imports...")
try:
    from app.main import app
    print("✅ FastAPI app imported")
except Exception as e:
    print(f"❌ FastAPI import failed: {e}")
    sys.exit(1)

try:
    from app.services.gumloop_service import GumloopService
    service = GumloopService()
    print("✅ GumloopService created")
except Exception as e:
    print(f"❌ GumloopService failed: {e}")
    sys.exit(1)

# Start server manually
print("\n🚀 Starting server...")
import uvicorn

try:
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="debug")
except KeyboardInterrupt:
    print("\n👋 Server stopped")
except Exception as e:
    print(f"❌ Server failed: {e}")