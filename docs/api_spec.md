# SACH AI — REST API Specification

All backend endpoints are prefixed with `/api`. Interactive OpenAPI documentation is accessible at `/docs` and `/redoc`.

---

## Endpoints Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/health` | System health, version, and module statuses | None |
| `POST` | `/api/transcribe` | Ingest audio file and return speech transcript | None |
| `POST` | `/api/analyze` | AI & NLP financial claim verification | None |
| `POST` | `/api/speech` | Text-to-speech audio synthesis | None |
| `GET` | `/api/education` | Educational modules, quiz, and reporting steps | None |
| `POST` | `/api/education/quiz-submit` | Validate awareness quiz answers | None |
| `GET` | `/api/sources` | Directory of official regulatory portals | None |
| `GET` | `/api/samples` | Pre-built test scenarios for 1-click evaluation | None |

---

### 1. `GET /api/health`
**Response (200 OK):**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "mode": "offline_demo",
  "llm_configured": false,
  "stt_configured": true,
  "tts_configured": true,
  "timestamp": "2026-10-04T05:50:00.000000Z"
}
```

---

### 2. `POST /api/transcribe`
**Request:** `multipart/form-data` with `file` field (.wav, .mp3, .m4a, .webm, .ogg).  
**Response (200 OK):**
```json
{
  "transcript": "Double your money in 7 days with 100% guarantee!",
  "detected_language": "en",
  "confidence": 0.92,
  "file_name": "sample_recording.webm",
  "file_size_bytes": 124800,
  "is_fallback_mode": false,
  "notes": null
}
```

---

### 3. `POST /api/analyze`
**Request Body (`application/json`):**
```json
{
  "text": "Get 300% profit in 5 days! 100% guaranteed target. Join VIP Telegram group now.",
  "language": "en",
  "source_type": "text"
}
```

**Response (200 OK):**
```json
{
  "id": "c7f9d8a2-3b4e-4f1a-8e2b-1a2c3d4e5f6a",
  "status": "success",
  "overall_assessment": "POTENTIAL_RED_FLAGS",
  "risk_score": 65,
  "detected_language": "en",
  "response_language": "en",
  "original_text": "Get 300% profit in 5 days! 100% guaranteed target. Join VIP Telegram group now.",
  "extracted_claims": [
    {
      "claim_text": "Get 300% profit in 5 days",
      "is_suspicious": true,
      "category": "Guaranteed or Unrealistic Returns",
      "trigger_words": ["300% profit"],
      "explanation": "SEBI explicitly prohibits any market intermediary from promising assured or fixed guaranteed returns."
    }
  ],
  "red_flags": [
    {
      "code": "GUARANTEED_RETURN",
      "title": "Guaranteed or Unrealistic Returns",
      "severity": "CRITICAL",
      "matched_phrases": ["100% guaranteed"],
      "description": "SEBI prohibits promising assured returns in capital markets.",
      "safe_action": "Never transfer money for assured profit schemes."
    }
  ],
  "plain_explanation": "Caution: This message contains strong indicators of financial misinformation or fraud...",
  "evidence_sources": [
    {
      "id": "sebi_scores",
      "name": "SEBI SCORES",
      "category": "Regulator Portal",
      "url": "https://scores.sebi.gov.in",
      "relevance_explanation": "Verify registered advisory status and guidelines against guaranteed returns."
    }
  ],
  "verification_steps": [
    {
      "step_number": 1,
      "title": "Verify SEBI Intermediary Registration",
      "action": "Search the advisor's SEBI registration number on sebi.gov.in.",
      "official_portal_url": "https://www.sebi.gov.in"
    }
  ],
  "missing_information_notes": [
    "No official SEBI registration identifier provided."
  ],
  "limitations_and_disclaimer": "DISCLAIMER: SACH AI is strictly an educational tool...",
  "mode": "deterministic_nlp_rule_engine",
  "tts_available": true
}
```
