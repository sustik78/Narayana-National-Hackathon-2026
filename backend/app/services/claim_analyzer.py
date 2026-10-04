import uuid
import json
import os
from typing import List, Dict, Any
import httpx
from app.config import settings
from app.models.schemas import (
    AnalysisRequest, AnalysisResponse, RiskLevel,
    EvidenceSource, VerificationStep, Language
)
from app.services.nlp_rules import nlp_rules_engine

class ClaimAnalyzerService:
    def __init__(self):
        self.sources_path = os.path.join(os.path.dirname(__file__), "..", "data", "official_sources.json")
        self.official_sources = self._load_sources()

    def _load_sources(self) -> List[Dict[str, Any]]:
        try:
            if os.path.exists(self.sources_path):
                with open(self.sources_path, "r", encoding="utf-8") as f:
                    return json.load(f)
        except Exception as e:
            print(f"Error loading official sources: {e}")
        return []

    def _detect_language(self, text: str) -> str:
        # Heuristic script detection
        # Devanagari script range: \u0900-\u097F
        # Bengali script range: \u0980-\u09FF
        devanagari_count = sum(1 for c in text if '\u0900' <= c <= '\u097F')
        bengali_count = sum(1 for c in text if '\u0980' <= c <= '\u09FF')
        total = len(text)
        
        if bengali_count > 3 or (total > 0 and bengali_count / total > 0.1):
            return "bn"
        if devanagari_count > 3 or (total > 0 and devanagari_count / total > 0.1):
            return "hi"
        return "en"

    def _select_relevant_sources(self, red_flags: list, target_lang: str) -> List[EvidenceSource]:
        selected = []
        codes = [f.code for f in red_flags]
        
        for src in self.official_sources:
            src_id = src.get("id")
            rel_expl = ""
            
            if "GUARANTEED_RETURN" in codes or "TELEGRAM_WHATSAPP_PUMP" in codes:
                if src_id in ["sebi_scores", "nse_investors", "sebi_saarthi"]:
                    if target_lang == "hi":
                        rel_expl = f"SEBI/NSE के दिशा-निर्देशों के अनुसार किसी भी अनधिकृत एडवाइजर या रिटर्न वादे की जांच {src.get('name')} पर करें।"
                    elif target_lang == "bn":
                        rel_expl = f"SEBI/NSE এর নির্দেশিকা অনুযায়ী কোনো অননুমোদিত উপদেষ্টার সত্যতা {src.get('name')}-এ যাচাই করুন।"
                    else:
                        rel_expl = f"Verify registered advisory status and guidelines against guaranteed returns via {src.get('name')}."
                    
                    selected.append(EvidenceSource(
                        id=src.get("id"),
                        name=src.get("name"),
                        category=src.get("category"),
                        description=src.get("description"),
                        url=src.get("url"),
                        relevance_explanation=rel_expl
                    ))
            elif "FAKE_IPO_ALLOTMENT" in codes:
                if src_id in ["nsdl_investor", "sebi_scores", "bse_investors"]:
                    if target_lang == "hi":
                        rel_expl = "असली आईपीओ अलॉटमेंट और डिमैट शेयर क्रेडिट की पुष्टि NSDL/BSE पर सीधे करें।"
                    elif target_lang == "bn":
                        rel_expl = "প্রকৃত আইপিও শেয়ার বরাদ্দের তথ্য NSDL/BSE পোর্টালে সরাসরি যাচাই করুন।"
                    else:
                        rel_expl = "Confirm legitimate ASBA retail allotment and Demat credits via official depository and exchange records."
                    
                    selected.append(EvidenceSource(
                        id=src.get("id"),
                        name=src.get("name"),
                        category=src.get("category"),
                        description=src.get("description"),
                        url=src.get("url"),
                        relevance_explanation=rel_expl
                    ))
            elif "CREDENTIAL_FUND_SOLICITATION" in codes or "IMPERSONATION_REGULATOR" in codes:
                if src_id in ["cybercrime_portal", "rbi_kehta_hai", "sebi_scores"]:
                    if target_lang == "hi":
                        rel_expl = "वित्तीय धोखाधड़ी या व्यक्तिगत खाते में पैसे मांगने की तुरंत शिकायत 1930/साइबर पोर्टल पर करें।"
                    elif target_lang == "bn":
                        rel_expl = "আর্থিক জালিয়াতি বা ব্যক্তিগত অ্যাকাউন্টে অর্থ লেনদেনের অভিযোগ অবিলম্বে ১৯৩০/সাইবার ক্রাইম পোর্টালে জানান।"
                    else:
                        rel_expl = "Report unauthorized fund solicitation, phishing links, and regulator impersonation directly to cyber law enforcement."
                    
                    selected.append(EvidenceSource(
                        id=src.get("id"),
                        name=src.get("name"),
                        category=src.get("category"),
                        description=src.get("description"),
                        url=src.get("url"),
                        relevance_explanation=rel_expl
                    ))

        # Fallback default sources if none matched
        if not selected:
            for src in self.official_sources[:2]:
                selected.append(EvidenceSource(
                    id=src.get("id"),
                    name=src.get("name"),
                    category=src.get("category"),
                    description=src.get("description"),
                    url=src.get("url"),
                    relevance_explanation="Official investor protection portal for general financial literacy and registration verification."
                ))
        return selected

    def _build_verification_steps(self, red_flags: list, target_lang: str) -> List[VerificationStep]:
        steps = []
        if target_lang == "hi":
            steps.append(VerificationStep(
                step_number=1,
                title="SEBI पंजीकरण नंबर की जांच करें",
                action="दावा करने वाले व्यक्ति या संस्था का SEBI रजिस्ट्रेशन नंबर (INH... या INA...) sebi.gov.in पर सर्च करें।",
                official_portal_url="https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognisedFpi=yes&intmId=13"
            ))
            steps.append(VerificationStep(
                step_number=2,
                title="व्यक्तिगत UPI या बैंक ट्रांसफर से बचें",
                action="कभी भी किसी व्यक्ति के निजी बैंक खाते या अनवेरिफाइड UPI पर निवेश राशि ट्रांसफर न करें।",
                official_portal_url="https://scores.sebi.gov.in"
            ))
            steps.append(VerificationStep(
                step_number=3,
                title="एक्सचेंज की आधिकारिक वेबसाइट पर क्रॉस-चेक करें",
                action="कंपनी के कॉर्पोरेट खुलासे और स्टॉक घोषणाओं की पुष्टि BSE या NSE की आधिकारिक वेबसाइट पर करें।",
                official_portal_url="https://www.bseindia.com"
            ))
        elif target_lang == "bn":
            steps.append(VerificationStep(
                step_number=1,
                title="SEBI রেজিস্ট্রেশন নম্বর যাচাই করুন",
                action="পরামর্শদাতা বা সংস্থার SEBI রেজিস্ট্রেশন নম্বর sebi.gov.in পোর্টালে মিলিয়ে নিন।",
                official_portal_url="https://www.sebi.gov.in"
            ))
            steps.append(VerificationStep(
                step_number=2,
                title="ব্যক্তিগত অ্যাকাউন্টে অর্থ লেনদেন বন্ধ রাখুন",
                action="কোনো ব্যক্তির ব্যক্তিগত ব্যাংক অ্যাকাউন্ট বা কিউআর কোডে সরাসরি টাকা পাঠাবেন না।",
                official_portal_url="https://scores.sebi.gov.in"
            ))
            steps.append(VerificationStep(
                step_number=3,
                title="অফিসিয়াল এক্সচেঞ্জে নোটিশ পরীক্ষা করুন",
                action="শেয়ারের তথ্য ও নোটিশ BSE বা NSE-এর অফিসিয়াল ওয়েবসাইটে চেক করুন।",
                official_portal_url="https://www.nseindia.com"
            ))
        else:
            steps.append(VerificationStep(
                step_number=1,
                title="Verify SEBI Intermediary Registration",
                action="Search the advisor's SEBI registration number (RA or RIA license) on the official SEBI directory.",
                official_portal_url="https://www.sebi.gov.in"
            ))
            steps.append(VerificationStep(
                step_number=2,
                title="Never Transfer Funds to Personal Accounts",
                action="Legitimate investment deposits occur strictly through registered broker clearing accounts or bank ASBA, never private UPI IDs.",
                official_portal_url="https://scores.sebi.gov.in"
            ))
            steps.append(VerificationStep(
                step_number=3,
                title="Cross-Reference with BSE/NSE Corporate Announcements",
                action="Verify any claims of upcoming corporate actions, mergers, or institutional deals on exchange disclosures.",
                official_portal_url="https://www.bseindia.com"
            ))
        return steps

    def _generate_plain_explanation(self, red_flags: list, overall: RiskLevel, target_lang: str) -> str:
        if overall == RiskLevel.RED_FLAG:
            if target_lang == "hi":
                return (
                    "चेतावनी: इस संदेश में वित्तीय धोखाधड़ी (स्कैम) के गंभीर संकेत पाए गए हैं। "
                    "इसमें अवास्तविक या गारंटीड मुनाफे, तत्काल पैसे भेजने का दबाव, अथवा अनधिकृत सलाह के लक्षण हैं। "
                    "कृपया किसी भी प्रकार का भुगतान न करें और अपने बैंक या डीमैट क्रेडेंशियल्स साझा न करें।"
                )
            elif target_lang == "bn":
                return (
                    "সতর্কতা: এই বার্তায় আর্থিক প্রতারণার গুরুতর লক্ষণ পাওয়া গেছে। "
                    "এতে অবাস্তব নিশ্চিত মুনাফার প্রতিশ্রুতি, দ্রুত অর্থ পাঠানোর চাপ অথবা অননুমোদিত পরামর্শের ইঙ্গিত রয়েছে। "
                    "অনুগ্রহ করে কোনো অর্থ স্থানান্তর করবেন না এবং ব্যক্তিগত তথ্য সুরক্ষিত রাখুন।"
                )
            else:
                return (
                    "Caution: This message contains strong indicators of financial misinformation or fraud. "
                    "It displays promises of guaranteed/risk-free profits, artificial urgency, or unauthorized group tips. "
                    "Do not transfer any money, share OTPs, or act on unverified financial advice."
                )
        elif overall == RiskLevel.NEEDS_VERIFICATION:
            if target_lang == "hi":
                return (
                    "ध्यान दें: इस संदेश में कुछ ऐसे वित्तीय दावे हैं जिनकी आधिकारिक स्रोतों से पुष्टि आवश्यक है। "
                    "बिना SEBI-रजिस्टर्ड सलाहकार की सलाह अथवा एक्सचेंज नोटिफिकेशन देखे कोई फैसला न लें।"
                )
            elif target_lang == "bn":
                return (
                    "দৃষ্টি আকর্ষণ: এই বার্তায় উল্লিখিত কিছু আর্থিক তথ্য স্বাধীন ও সরকারি উৎস থেকে যাচাই করা প্রয়োজন। "
                    "অনুমোদিত আর্থিক পরামর্শদাতার পরামর্শ ব্যতীত কোনো লেনদেন করবেন না।"
                )
            else:
                return (
                    "Attention: This message makes financial statements that require independent verification. "
                    "While not explicitly fraudulent, unbacked assertions should be verified against official regulator filings."
                )
        else:
            if target_lang == "hi":
                return (
                    "इस संदेश में कोई सीधा धोखाधड़ी या भ्रामक संकेत नहीं पाया गया। "
                    "यह सामान्य सूचना या वैधानिक डिस्क्लेमर प्रतीत होता है। फिर भी, हमेशा अपने जोखिम का आंकलन स्वयं करें।"
                )
            elif target_lang == "bn":
                return (
                    "এই বার্তায় প্রত্যক্ষ কোনো প্রতারণামূলক তথ্য বা সতর্কবার্তা পাওয়া যায়নি। "
                    "এটি সাধারণ তথ্যমূলক বার্তা হতে পারে। তবে বিনিয়োগের পূর্বে নিজস্ব বিচারবুদ্ধি প্রয়োগ করুন।"
                )
            else:
                return (
                    "No obvious red flags or high-risk scam patterns were detected in this message. "
                    "It appears to be informational or standard market awareness. Always verify independent disclosures."
                )

    def _get_missing_info_notes(self, target_lang: str) -> List[str]:
        if target_lang == "hi":
            return [
                "संदेश भेजने वाले का आधिकारिक SEBI रजिस्ट्रेशन नंबर (RIA/RA) अनुपस्थित है।",
                "स्टॉक एक्सचेंज (NSE/BSE) पर फाइल किए गए सार्वजनिक खुलासे का कोई प्रमाण नहीं है।",
                "निवेश में शामिल जोखिमों (Market Risks) का कोई वैधानिक डिस्क्लेमर नहीं दिया गया है।"
            ]
        elif target_lang == "bn":
            return [
                "বার্তা প্রেরকের অফিশিয়াল SEBI রেজিস্ট্রেশন নম্বর অনুপস্থিত।",
                "স্টক এক্সচেঞ্জে পেশ করা কোনো সরকারি বিজ্ঞপ্তির উল্লেখ নেই।",
                "বিনিয়োগের সাথে জড়িত বাজার ঝুঁকির কোনো বিধিবদ্ধ সতর্কীকরণ নেই।"
            ]
        else:
            return [
                "No official SEBI registration identifier (RIA / RA license) provided by the claimant.",
                "Absence of verifiable links to exchange disclosures or statutory prospectus filings.",
                "Lack of mandatory risk disclosures regarding capital volatility in financial markets."
            ]

    async def analyze(self, req: AnalysisRequest) -> AnalysisResponse:
        detected_lang = self._detect_language(req.text)
        target_lang = req.language.value
        
        # 1. Core Rule & NLP Engine Execution
        red_flags, extracted_claims, risk_score, overall_assessment = nlp_rules_engine.analyze_text(
            req.text, target_lang=target_lang
        )
        
        # 2. Select contextual evidence sources and verification steps
        evidence_sources = self._select_relevant_sources(red_flags, target_lang)
        verification_steps = self._build_verification_steps(red_flags, target_lang)
        missing_info = self._get_missing_info_notes(target_lang)
        
        # 3. Plain language explanation synthesis
        plain_expl = self._generate_plain_explanation(red_flags, overall_assessment, target_lang)
        
        mode = "deterministic_nlp_rule_engine"
        
        # 4. Optional LLM refinement if API keys exist
        if settings.OPENAI_API_KEY and settings.LLM_PROVIDER == "openai":
            try:
                # Call OpenAI asynchronously to augment explanation
                async with httpx.AsyncClient(timeout=8.0) as client:
                    prompt = (
                        f"You are SACH AI, an investor protection assistant for Indian financial literacy. "
                        f"Analyze this message for financial fraud/misinformation: '{req.text}'. "
                        f"Target language: {target_lang}. Provide a concise 2-sentence plain-language safety explanation."
                    )
                    resp = await client.post(
                        "https://api.openai.com/v1/chat/completions",
                        headers={"Authorization": f"Bearer {settings.OPENAI_API_KEY}"},
                        json={
                            "model": settings.LLM_MODEL or "gpt-4o-mini",
                            "messages": [{"role": "user", "content": prompt}],
                            "max_tokens": 150
                        }
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        llm_text = data["choices"][0]["message"]["content"].strip()
                        if llm_text:
                            plain_expl = f"{plain_expl}\n\n[AI Insight]: {llm_text}"
                            mode = "hybrid_openai_nlp_engine"
            except Exception as e:
                print(f"LLM call fallback to deterministic engine: {e}")
        
        disclaimer = (
            "DISCLAIMER: SACH AI is strictly an educational tool for financial literacy and misinformation detection, "
            "developed for the SANGYAN Hackathon. It does NOT provide stock recommendations, investment advice, or financial guarantees. "
            "Always consult certified SEBI-registered professionals before making financial decisions."
        )

        return AnalysisResponse(
            id=str(uuid.uuid4()),
            status="success",
            overall_assessment=overall_assessment,
            risk_score=risk_score,
            detected_language=detected_lang,
            response_language=target_lang,
            original_text=req.text,
            extracted_claims=extracted_claims,
            red_flags=red_flags,
            plain_explanation=plain_expl,
            evidence_sources=evidence_sources,
            verification_steps=verification_steps,
            missing_information_notes=missing_info,
            limitations_and_disclaimer=disclaimer,
            mode=mode,
            tts_available=True
        )

claim_analyzer_service = ClaimAnalyzerService()
