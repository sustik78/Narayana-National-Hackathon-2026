import json
import os
import re
from typing import List, Dict, Any, Tuple
from app.models.schemas import RiskLevel, RedFlag, ClaimExtraction

class NLPRulesEngine:
    def __init__(self):
        self.patterns_path = os.path.join(os.path.dirname(__file__), "..", "data", "scam_patterns.json")
        self.patterns = self._load_patterns()

    def _load_patterns(self) -> List[Dict[str, Any]]:
        try:
            if os.path.exists(self.patterns_path):
                with open(self.patterns_path, "r", encoding="utf-8") as f:
                    return json.load(f)
        except Exception as e:
            print(f"Error loading scam patterns: {e}")
        return []

    def _clean_text(self, text: str) -> str:
        return re.sub(r'\s+', ' ', text.lower().strip())

    def analyze_text(self, text: str, target_lang: str = "en") -> Tuple[List[RedFlag], List[ClaimExtraction], int, RiskLevel]:
        cleaned = self._clean_text(text)
        detected_flags: List[RedFlag] = []
        extracted_claims: List[ClaimExtraction] = []
        total_risk_points = 0
        
        # Split text into candidate claim sentences
        sentences = [s.strip() for s in re.split(r'[.!?\n\u0964]+', text) if len(s.strip()) > 3]
        if not sentences:
            sentences = [text.strip()]

        for pattern in self.patterns:
            code = pattern.get("code")
            name = pattern.get("name")
            severity = pattern.get("severity", "HIGH")
            
            # Combine all keywords across languages for detection
            all_keywords = (
                pattern.get("keywords_en", []) +
                pattern.get("keywords_hi", []) +
                pattern.get("keywords_bn", [])
            )
            
            matched_phrases = []
            for kw in all_keywords:
                # regex word boundary or direct inclusion
                kw_clean = kw.lower()
                if kw_clean in cleaned:
                    if kw not in matched_phrases:
                        matched_phrases.append(kw)

            if matched_phrases:
                # Determine explanation based on target language
                expl = pattern.get(f"explanation_{target_lang}") or pattern.get("explanation_en", "")
                safe_act = pattern.get(f"safe_action_{target_lang}") or pattern.get("safe_action_en", "")
                
                flag = RedFlag(
                    code=code,
                    title=name,
                    severity=severity,
                    matched_phrases=matched_phrases,
                    description=expl,
                    safe_action=safe_act
                )
                detected_flags.append(flag)
                
                # Weight score by severity
                if severity == "CRITICAL":
                    total_risk_points += 40
                elif severity == "HIGH":
                    total_risk_points += 25
                else:
                    total_risk_points += 15

        # Heuristic scoring bound
        risk_score = min(100, total_risk_points)

        # Build claim-level breakdown
        for sent in sentences:
            sent_clean = sent.lower()
            sent_triggers = []
            sent_suspicious = False
            sent_cat = "General Statement"
            sent_expl = ""
            
            for pattern in self.patterns:
                all_keywords = (
                    pattern.get("keywords_en", []) +
                    pattern.get("keywords_hi", []) +
                    pattern.get("keywords_bn", [])
                )
                for kw in all_keywords:
                    if kw.lower() in sent_clean:
                        sent_triggers.append(kw)
                        sent_suspicious = True
                        sent_cat = pattern.get("name")
                        sent_expl = pattern.get(f"explanation_{target_lang}") or pattern.get("explanation_en")
                        break
                if sent_suspicious:
                    break

            if not sent_suspicious:
                if target_lang == "hi":
                    sent_expl = "इस वाक्य में कोई सीधा चेतावनी संकेत नहीं मिला, लेकिन वित्तीय दावों की स्वतंत्र पुष्टि आवश्यक है।"
                elif target_lang == "bn":
                    sent_expl = "এই বাক্যে কোনো প্রত্যক্ষ সতর্কবার্তা পাওয়া যায়নি, তবে আর্থিক তথ্যের সত্যতা যাচাই করা উচিত।"
                else:
                    sent_expl = "No explicit fraudulent trigger words detected in this statement, but verify independently."

            extracted_claims.append(ClaimExtraction(
                claim_text=sent,
                is_suspicious=sent_suspicious,
                category=sent_cat,
                trigger_words=sent_triggers,
                explanation=sent_expl
            ))

        # Determine overall category
        if risk_score >= 40 or any(f.severity == "CRITICAL" for f in detected_flags):
            overall_assessment = RiskLevel.RED_FLAG
        elif risk_score > 0 or len(detected_flags) > 0:
            overall_assessment = RiskLevel.NEEDS_VERIFICATION
        else:
            overall_assessment = RiskLevel.NO_OBVIOUS_RED_FLAGS

        return detected_flags, extracted_claims, risk_score, overall_assessment

nlp_rules_engine = NLPRulesEngine()
