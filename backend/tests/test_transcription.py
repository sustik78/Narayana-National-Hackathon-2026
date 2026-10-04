import pytest
import io
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_transcribe_invalid_file_extension():
    fake_file = io.BytesIO(b"dummy fake content")
    response = client.post(
        "/api/transcribe",
        files={"file": ("malicious.exe", fake_file, "application/octet-stream")}
    )
    assert response.status_code == 400
    assert "Unsupported audio format" in response.json()["detail"]

def test_tts_endpoint():
    payload = {
        "text": "Hello, this is a test audio from SACH AI.",
        "language": "en"
    }
    response = client.post("/api/speech", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "audio_base64" in data
    assert len(data["audio_base64"]) > 100
