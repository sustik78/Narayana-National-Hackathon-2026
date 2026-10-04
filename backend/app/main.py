from datetime import datetime, timezone
from contextlib import asynccontextmanager
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config import settings
from app.models.schemas import (
    AnalysisRequest, AnalysisResponse, TranscribeResponse,
    TTSRequest, TTSResponse, QuizSubmission, QuizResult, HealthResponse, Language
)
from app.services.claim_analyzer import claim_analyzer_service
from app.services.transcription import transcription_service
from app.services.tts_service import tts_service
from app.services.education_service import education_service
from app.db.session import init_db, log_analysis_event

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="SACH AI - Smart Assistant for Checking Honesty in Financial Information (SANGYAN Hackathon Track E)",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Root"])
def root():
    return {
        "project": "SACH AI",
        "tagline": "Suniye, Samajhiye, Sachai pe Bharosa Kijiye.",
        "hackathon": "SANGYAN Track E - Misinformation & Content Literacy",
        "status": "active",
        "documentation": "/docs"
    }

@app.get("/api/health", response_model=HealthResponse, tags=["System"])
def health_check():
    return HealthResponse(
        status="healthy",
        version=settings.VERSION,
        mode=settings.LLM_PROVIDER,
        llm_configured=bool(settings.OPENAI_API_KEY or settings.GEMINI_API_KEY),
        stt_configured=True,
        tts_configured=True,
        timestamp=datetime.now(timezone.utc).isoformat()
    )

@app.post("/api/transcribe", response_model=TranscribeResponse, tags=["Audio & Speech"])
async def transcribe_audio(file: UploadFile = File(...)):
    """
    Upload an audio recording to extract financial claims text.
    Supports .wav, .mp3, .m4a, .webm, .ogg, .flac formats.
    """
    try:
        return await transcription_service.transcribe_audio(file)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription pipeline failure: {str(e)}")

@app.post("/api/analyze", response_model=AnalysisResponse, tags=["AI Financial Claim Analysis"])
async def analyze_claim(req: AnalysisRequest):
    """
    Analyze financial claims for scam red flags, verify against official sources,
    and generate plain-language explanations in English, Hindi, or Bengali.
    """
    try:
        res = await claim_analyzer_service.analyze(req)
        log_analysis_event(
            risk_level=res.overall_assessment.value,
            risk_score=res.risk_score,
            detected_lang=res.detected_language,
            red_flags_count=len(res.red_flags),
            source_type=req.source_type or "text"
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Claim analysis error: {str(e)}")

@app.post("/api/speech", response_model=TTSResponse, tags=["Audio & Speech"])
async def text_to_speech(req: TTSRequest):
    """
    Convert text results or explanations into spoken voice (English, Hindi, Bengali).
    """
    try:
        return tts_service.synthesize(req)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Speech synthesis error: {str(e)}")

@app.get("/api/education", tags=["Investor Education"])
def get_education_content():
    """
    Retrieve investor safety modules, common scam patterns, and fraud reporting steps.
    """
    return education_service.get_education_content()

@app.post("/api/education/quiz-submit", response_model=QuizResult, tags=["Investor Education"])
def submit_quiz_answer(submission: QuizSubmission, lang: str = "en"):
    """
    Submit and validate an interactive scam awareness quiz answer.
    """
    return education_service.evaluate_quiz_answer(submission, lang=lang)

@app.get("/api/sources", tags=["Official Sources"])
def get_official_sources():
    """
    List all official investor protection and regulatory portals (SEBI, NSDL, RBI, BSE, NSE).
    """
    return claim_analyzer_service.official_sources

@app.get("/api/samples", tags=["Investor Education"])
def get_sample_scenarios():
    """
    Retrieve pre-built simulated financial messages for one-click testing and demonstration.
    """
    content = education_service.get_education_content()
    return content.get("sample_scenarios", [])
