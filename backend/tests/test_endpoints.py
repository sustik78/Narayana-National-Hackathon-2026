import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["project"] == "SACH AI"

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data

def test_analyze_endpoint():
    payload = {
        "text": "Get 200% return in 10 days! Guaranteed profit. Join VIP group now.",
        "language": "en",
        "source_type": "text"
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["overall_assessment"] == "POTENTIAL_RED_FLAGS"
    assert len(data["red_flags"]) > 0
    assert len(data["verification_steps"]) > 0

def test_analyze_endpoint_empty_input():
    payload = {
        "text": "",
        "language": "en"
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 422  # Unprocessable Entity for validation failure

def test_education_endpoint():
    response = client.get("/api/education")
    assert response.status_code == 200
    data = response.json()
    assert "modules" in data
    assert "quiz" in data
    assert len(data["modules"]) > 0

def test_quiz_submit_endpoint():
    payload = {
        "question_id": "q1",
        "selected_index": 2
    }
    response = client.post("/api/education/quiz-submit?lang=en", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["is_correct"] is True

def test_sources_endpoint():
    response = client.get("/api/sources")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 5
    assert any(s["id"] == "sebi_scores" for s in data)

def test_samples_endpoint():
    response = client.get("/api/samples")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 3
