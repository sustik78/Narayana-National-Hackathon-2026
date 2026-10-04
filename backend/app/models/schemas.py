from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class RiskLevel(str, Enum):
    RED_FLAG = "POTENTIAL_RED_FLAGS"
    NEEDS_VERIFICATION = "NEEDS_VERIFICATION"
    NO_OBVIOUS_RED_FLAGS = "NO_OBVIOUS_RED_FLAGS"

class Language(str, Enum):
    EN = "en"
    HI = "hi"
    BN = "bn"

class ClaimExtraction(BaseModel):
    claim_text: str
    is_suspicious: bool
    category: str
    trigger_words: List[str] = []
    explanation: str

class RedFlag(BaseModel):
    code: str
    title: str
    severity: str  # HIGH, MEDIUM, LOW, CRITICAL
    matched_phrases: List[str]
    description: str
    safe_action: str

class EvidenceSource(BaseModel):
    id: str
    name: str
    category: str
    description: str
    url: str
    relevance_explanation: str

class VerificationStep(BaseModel):
    step_number: int
    title: str
    action: str
    official_portal_url: Optional[str] = None

class AnalysisRequest(BaseModel):
    text: str = Field(..., min_length=2, description="The financial message or transcript to analyze")
    language: Language = Field(default=Language.EN, description="Preferred response language: en, hi, bn")
    source_type: Optional[str] = Field(default="text", description="Source type: audio_upload, live_mic, pasted_text")

class AnalysisResponse(BaseModel):
    id: str
    status: str
    overall_assessment: RiskLevel
    risk_score: int = Field(..., ge=0, le=100, description="Heuristic indicator score from 0 (safe) to 100 (high risk)")
    detected_language: str
    response_language: str
    original_text: str
    extracted_claims: List[ClaimExtraction]
    red_flags: List[RedFlag]
    plain_explanation: str
    evidence_sources: List[EvidenceSource]
    verification_steps: List[VerificationStep]
    missing_information_notes: List[str]
    limitations_and_disclaimer: str
    mode: str = Field(default="live_deterministic_rules_engine", description="Analysis mode info")
    tts_available: bool = True

class TranscribeResponse(BaseModel):
    transcript: str
    detected_language: str
    confidence: Optional[float] = None
    file_name: str
    file_size_bytes: int
    audio_duration_seconds: Optional[float] = None
    is_fallback_mode: bool = False
    notes: Optional[str] = None

class TTSRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=2000)
    language: Language = Field(default=Language.EN)

class TTSResponse(BaseModel):
    audio_base64: str
    mime_type: str = "audio/mp3"
    language: str

class QuizSubmission(BaseModel):
    question_id: str
    selected_index: int

class QuizResult(BaseModel):
    question_id: str
    is_correct: bool
    correct_index: int
    explanation: str

class HealthResponse(BaseModel):
    status: str
    version: str
    mode: str
    llm_configured: bool
    stt_configured: bool
    tts_configured: bool
    timestamp: str
