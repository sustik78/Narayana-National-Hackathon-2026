# SACH AI — Threat Model, Privacy & Safety Guidelines

**SANGYAN Hackathon (SNTC, IIT BHU Varanasi • SEBI • NSDL)**  
*Track E: Misinformation & Content Literacy*

---

## 1. Investor Protection Principles

1. **Non-Advisory Mandate**: SACH AI is strictly an educational fact-checking and misinformation detection platform. It is programmatically constrained from providing stock recommendations, buy/sell/hold targets, portfolio allocations, or investment projections.
2. **Zero False Guarantees**: SACH AI never guarantees the financial viability or returns of any legitimate instrument. When no red flags are found, it clearly reminds users of statutory market risk.
3. **Evidence-First Verification**: Every warning is contextualized with real regulatory authorities (SEBI, NSDL, RBI, Stock Exchanges, Cybercrime 1930).

---

## 2. Privacy & Data Handling Architecture

| Data Type | Storage Policy | Encryption / Security Measure |
|---|---|---|
| Microphone Audio Streams | **Ephemeral Only (Zero Storage)** | Processed in-memory or volatile `/tmp` files; purged immediately after transcription. |
| User Queries / Pasted Text | **No User PII Logging** | Only anonymized aggregated counts and risk category tallies logged. |
| Financial Credentials / OTPs | **Strict Blacklisting** | System warns user never to input OTPs or Demat passwords. |

---

## 3. Threat Model & Abuse Resistance

- **Adversarial Jailbreaks & Reverse Engineering**: System prompts and rule matchers filter out attempts to force SACH AI to act as a financial tipster.
- **DDoS & Flooding**: Configurable rate limiters and payload size ceilings (15MB for audio, 2,000 characters for text) protect server resources.
- **Hallucination Mitigation**: Hybrid architecture pairs rule-backed deterministic indicators with LLMs to prevent fabricated evidence.
