# SACH AI — SANGYAN Hackathon Pitch Deck Content

**Track E — Misinformation & Content Literacy**  
*Organized by SNTC, IIT (BHU) Varanasi in collaboration with SEBI and NSDL*

---

## Slide 1: Title & Team
- **Title**: SACH AI (Smart Assistant for Checking Honesty in Financial Information)
- **Tagline**: *"Suniye, Samajhiye, Sachai pe Bharosa Kijiye."*
- **Track**: Track E — Misinformation & Content Literacy
- **Organizers**: SNTC, IIT (BHU) Varanasi • SEBI • NSDL
- **Mission**: A voice-first, multilingual AI shield protecting retail investors from fraudulent tips, fake IPO quotas, and financial misinformation.

---

## Slide 2: Problem Statement
- **Surge in Retail Demat Accounts**: Over 150 Million retail accounts in India, with rapid growth across Tier-2/3 cities.
- **Proliferation of Unregulated Financial Tips**: Fraudulent WhatsApp groups, VIP Telegram channels, fake pre-IPO allotments, and AI deepfake celebrity videos.
- **The Vulnerability Gap**: Elderly and first-time investors lack quick, accessible tools to verify outrageous 300% return claims in their native languages.
- **Financial Toll**: Thousands of crores lost annually to cyber fraud and unregistered advisory syndicates.

---

## Slide 3: Target Users & Core Challenges
1. **First-Time Retail Investors**: Susceptible to FOMO, unrealistic multibagger promises, and operator penny stock pumps.
2. **Elderly & Senior Citizens**: Targeted by high-pressure phishing links and fake Demat KYC suspension threats.
3. **Regional Language Users**: Millions who communicate primarily in Hindi, Bengali, or local dialects with zero access to English-dominated regulatory portals.
4. **Voice-Note Consumers**: Users who consume financial advice via audio clips rather than written prospectuses.

---

## Slide 4: Proposed Solution — SACH AI
- **Voice-First Interaction**: Speak or upload audio notes directly via browser microphone without requiring complex typing.
- **Multilingual Intelligence**: Native support for English, हिन्दी (Hindi), and বাংলা (Bengali).
- **Hybrid AI & NLP Rule Base**: Transparent detection of regulatory violation patterns (guaranteed returns, dabba trading, fake IPO allocations).
- **Plain-Language Spoken Explanation**: Converts technical regulatory disclosures into clear spoken voice guidance.
- **Evidence-Aware Linking**: Contextually connects users to official SEBI SCORES, NSDL Depository, and Cybercrime 1930.

---

## Slide 5: System Architecture & Workflow Pipeline
1. **Ingestion**: Microphone audio stream, audio file upload (.wav, .mp3, .webm), or pasted WhatsApp text.
2. **Transcription Engine**: High-fidelity speech recognition with automatic language identification.
3. **NLP Analysis Engine**: Segmental claim extraction, trigger-word matching, and heuristic risk scoring (0–100).
4. **Evidence Retrieval**: Maps claims against official SEBI, NSDL, RBI, and Exchange regulatory databases.
5. **Multilingual Response & TTS**: Delivers visual cards and spoken audio explanations via gTTS / Web Speech.

---

## Slide 6: Technology Stack & Implementation
- **Frontend**: React.js 18, Vite, Tailwind CSS, Lucide Icons, Mobile-first responsive layout.
- **Backend**: Python 3.12, FastAPI, Pydantic data schemas, Uvicorn asynchronous server.
- **AI & Speech**: Multi-lingual NLP pattern matcher, configurable OpenAI/Gemini integration, SpeechRecognition, gTTS.
- **Storage & Telemetry**: SQLite with zero personal audio retention (Privacy by Design).
- **Deployment**: Multi-container Docker & Docker Compose architecture.

---

## Slide 7: Accessibility, Privacy & Safety by Design
- **Accessibility Modes**: Large Text mode (A+) and High-Contrast mode for low-vision and elderly users.
- **Zero Persistent Audio Storage**: Audio streams are processed in-memory or volatile buffers and purged immediately.
- **Strict Non-Advisory Guardrail**: SACH AI never gives stock recommendations, buy/sell targets, or price predictions.
- **No False Guarantees**: Reminds users of statutory market risk even on safe informational statements.

---

## Slide 8: Regulatory & Investor Protection Integration
- **SEBI SCORES**: Direct grievance redressal linking for unregistered tipsters.
- **SEBI Saa₹thi**: Educational foundation for retail mutual fund and equity awareness.
- **NSDL Investor Services**: Demat credit & CAS verification against unlisted share fraud.
- **Helpline 1930 & CyberCrime.gov.in**: 4-step emergency action plan to freeze defrauded transactions within the golden hour.

---

## Slide 9: Expected Impact & Scalability
- **Democratizing Investor Literacy**: Reaching the next 100M+ vernacular investors across India.
- **Reducing Cyber Fraud Losses**: Empowering users to detect red flags in seconds before transferring money.
- **Lightweight & Modular**: Deployable as a web app, Progressive Web App (PWA), or API microservice for fintech brokers.

---

## Slide 10: Future Roadmap & Conclusion
- **Phase 1 (Current)**: Web application with Voice-in / Voice-out in English, Hindi, and Bengali.
- **Phase 2**: Official WhatsApp & Telegram Bot integration for inline forward analysis.
- **Phase 3**: Multimodal deepfake video & screenshot OCR verification.
- **Phase 4**: Real-time integration with SEBI Intermediary Registry API & Exchange feeds.
- **Conclusion**: *"Suniye, Samajhiye, Sachai pe Bharosa Kijiye."*
