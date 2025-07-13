import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def mock_gumloop_response():
    return {
        "job_id": "test-job-123",
        "status": "completed",
        "result": {
            "summary": "Test summary content",
            "metadata": {"duration": "10:30", "views": "1000"}
        }
    }