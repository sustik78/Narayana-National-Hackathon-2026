# SACH AI — System Architecture & Design Specification

**Smart Assistant for Checking Honesty in Financial Information**  
*SANGYAN Hackathon (SNTC, IIT BHU Varanasi • SEBI • NSDL) — Track E: Misinformation & Content Literacy*

---

## 1. High-Level Architecture Overview

SACH AI is an end-to-end voice-first multilingual financial misinformation analysis assistant. It is purposefully engineered to protect retail investors, first-time market entrants, elderly citizens, and regional language speakers from financial fraud, unauthorized advice, and deceptive investment promises.

```
+-----------------------------------------------------------------------------------+
|                                  USER CLIENT                                      |
|  (Microphone Voice Notes / Upload Audio / Pasted WhatsApp Tips / Multilingual UI) |
+------------------------------------------+----------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------+
|                        REACT + VITE + TAILWIND CSS FRONTEND                       |
|   - MediaRecorder Audio Capture & Audio Preview                                   |
|   - Multilingual Context Provider (English, Hindi हिन्दी, Bengali বাংলা)          |
|   - Accessibility Engine (Large Text A+, High-Contrast Mode)                      |
|   - Audio Playback Controls for Spoken Results                                    |
|   - Interactive Scam Awareness Quiz & 1930 Emergency Reporting Workflow           |
+------------------------------------------+----------------------------------------+
                                           |  REST API (JSON / Multipart Audio)
                                           v
+-----------------------------------------------------------------------------------+
|                            FASTAPI BACKEND SERVICES                               |
|   +-------------------+  +--------------------+  +----------------------------+   |
|   | /api/transcribe   |  | /api/analyze       |  | /api/speech                |   |
|   | Speech-to-Text    |  | NLP Pattern Engine |  | gTTS Text-to-Speech Base64 |   |
|   | & File Validation |  | & LLM Synthesizer  |  | Audio Synthesis            |   |
|   +-------------------+  +--------------------+  +----------------------------+   |
|   +-------------------+  +--------------------+  +----------------------------+   |
|   | /api/education    |  | /api/sources       |  | SQLite Audit Logger        |   |
|   | Modules & Quiz    |  | SEBI/NSDL Registry |  | (Aggregated, Zero PII)     |   |
|   +-------------------+  +--------------------+  +----------------------------+   |
+-----------------------------------------------------------------------------------+
                                           |
                   +-----------------------+-----------------------+
                   |                                               |
                   v                                               v
+-------------------------------------+         +-------------------------------------+
|      VERIFIED OFFICIAL EVIDENCE     |         |         SCAM PATTERN DATABASE       |
|  - SEBI SCORES (scores.sebi.gov.in) |         |  - Guaranteed / Assured Returns     |
|  - SEBI Saa₹thi (investor.sebi.gov) |         |  - Fake IPO & VIP Quota Claims      |
|  - NSDL Depository CAS              |         |  - Telegram / WhatsApp Pump & Dump  |
|  - RBI Kehta Hai (rbikehtahai.rbi)  |         |  - Impersonation & AI Deepfakes     |
|  - CyberCrime 1930 Helpline         |         |  - Urgency & Credential Harvesting  |
|  - BSE & NSE Investor Protection    |         |                                     |
+-------------------------------------+         +-------------------------------------+
```

---

## 2. Core Subsystems

### A. Speech-to-Text & Audio Ingestion Subsystem
- **Format Validation**: Supports `.wav`, `.mp3`, `.m4a`, `.webm`, `.ogg`, `.flac` with an enforced 15MB size ceiling.
- **Audio Preprocessing**: Converts variable bitrates and channels into standardized 16kHz mono WAV streams using `pydub`.
- **Speech Recognition**: Leverages `SpeechRecognition` multi-language recognition with fallback pipelines across Indian English (`en-IN`), Hindi (`hi-IN`), and Bengali (`bn-IN`).
- **Privacy Assurance**: Audio files exist solely in memory / temporary volatile buffers and are purged immediately upon transcription completion.

### B. NLP Rule & Claim Analysis Engine
- **Deterministic Pattern Layer**: Matches phrases against categorized scam signatures (Guaranteed Returns, Fake IPO Allotments, Operator Penny Stock Pumps, Phishing / Credential Solicitation, Regulator Impersonation).
- **Claim Extraction**: Segments input statements into atomic sentences and tags triggers, category classification, and severity.
- **Heuristic Risk Scoring**: Calculates a transparent 0–100 risk indicator score without black-box bias.
- **Evidence Linking**: Automatically maps identified red flags to legitimate statutory mechanisms (e.g., ASBA for IPOs, SCORES for broker complaints, 1930 for immediate cyber fraud freeze).

### C. Multilingual Text-to-Speech (TTS) Subsystem
- Synthesizes plain-language explanations into natural spoken audio via `gTTS` in English, Hindi, and Bengali.
- Features base64 caching and seamless fallback to the browser's native `window.speechSynthesis` Web API.

---

## 3. Data Flow

1. **Submission**: User records voice note or pastes message.
2. **Transcription**: Backend transcribes audio and returns editable transcript.
3. **User Inspection**: User verifies or edits the text.
4. **Analysis Pipeline**:
   - Linguistic Tokenization & Scam Pattern Detection
   - Claim-by-Claim Breakdown
   - Severity & Risk Score Computation
   - Plain-Language Explanation in target language
   - Official Verification Evidence Mapping
5. **Presentation**: Results Dashboard displays Risk Meter, Red Flags, Evidence links, and Spoken Audio Readout.
