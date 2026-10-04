import pytest
import asyncio
from app.models.schemas import AnalysisRequest, Language, RiskLevel
from app.services.claim_analyzer import claim_analyzer_service
from app.services.nlp_rules import nlp_rules_engine

def test_nlp_rule_engine_guaranteed_return():
    text = "Double your money in 7 days with 100% guarantee! Zero risk investment."
    red_flags, claims, risk_score, assessment = nlp_rules_engine.analyze_text(text, target_lang="en")
    
    assert len(red_flags) > 0
    assert risk_score >= 40
    assert assessment == RiskLevel.RED_FLAG
    codes = [f.code for f in red_flags]
    assert "GUARANTEED_RETURN" in codes

def test_nlp_rule_engine_hindi_detection():
    text = "100% गारंटी के साथ पैसा डबल करें। वीआईपी टेलीग्राम ग्रुप से जुड़ें।"
    red_flags, claims, risk_score, assessment = nlp_rules_engine.analyze_text(text, target_lang="hi")
    
    assert len(red_flags) >= 1
    assert assessment == RiskLevel.RED_FLAG
    assert any("गारंटी" in p for f in red_flags for p in f.matched_phrases)

def test_nlp_rule_engine_bengali_detection():
    text = "১০০% গ্যারান্টি সহ টাকা দ্বিগুণ করুন। কোনো ঝুঁকি নেই।"
    red_flags, claims, risk_score, assessment = nlp_rules_engine.analyze_text(text, target_lang="bn")
    
    assert len(red_flags) >= 1
    assert assessment == RiskLevel.RED_FLAG

def test_nlp_rule_engine_safe_message():
    text = "Please read the offer document carefully before investing in mutual funds. Returns are subject to market conditions."
    red_flags, claims, risk_score, assessment = nlp_rules_engine.analyze_text(text, target_lang="en")
    
    assert risk_score < 40
    assert assessment == RiskLevel.NO_OBVIOUS_RED_FLAGS

def test_claim_analyzer_service_end_to_end():
    req = AnalysisRequest(
        text="Special pre-IPO allotment 100% guarantee! Send money to UPI immediately. Only 5 slots left.",
        language=Language.EN
    )
    res = asyncio.run(claim_analyzer_service.analyze(req))
    
    assert res.status == "success"
    assert res.overall_assessment == RiskLevel.RED_FLAG
    assert len(res.evidence_sources) > 0
    assert len(res.verification_steps) > 0
    assert "DISCLAIMER" in res.limitations_and_disclaimer
