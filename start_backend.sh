#!/bin/bash
cd /Users/jeffaxelrod/content_miner/backend
source venv/bin/activate
export PYTHONPATH="/Users/jeffaxelrod/content_miner/backend:$PYTHONPATH"
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000