#!/usr/bin/env python3

import uvicorn
import sys
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    print("🚀 Starting Insight Backend Server...")
    print(f"Environment: {os.getenv('ENVIRONMENT', 'development')}")
    print(f"API Key configured: {'✅' if os.getenv('GUMLOOP_API_KEY') else '❌'}")
    
    try:
        uvicorn.run(
            "app.main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
    except Exception as e:
        print(f"❌ Failed to start server: {e}")
        sys.exit(1)