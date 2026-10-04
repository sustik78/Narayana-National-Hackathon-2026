# SACH AI — Sample Voice Note Transcripts for Demo & Testing

These sample transcripts cover realistic financial misinformation across English, Hindi, and Bengali.

---

### Sample 1: Guaranteed Return & Telegram Pump (English)
> "URGENT VIP ALERT! Buy XYZ Power Ltd tomorrow at 9:15 AM. Big institutional buying confirmed. 100% guaranteed target of 300% profit in 5 days! No risk. Join our VIP Telegram group for daily jackpot calls."
- **Expected Assessment**: `POTENTIAL_RED_FLAGS`
- **Matched Flags**: Prohibited Guaranteed Return, Social Media Pump & Dump, Urgency/FOMO.

---

### Sample 2: Pre-IPO & Institutional Quota Scam (Hindi)
> "स्पेशल एफआईआई कोटा! आगामी मेगा आईपीओ में 40% छूट पर 100% गारंटीड अलॉटमेंट पाएं। सिर्फ 10 सीटें बाकी हैं। अलॉटमेंट अकाउंट में तुरंत ₹50,000 ट्रांसफर करें।"
- **Expected Assessment**: `POTENTIAL_RED_FLAGS`
- **Matched Flags**: Fake IPO Allotment Quota, Unauthorized Fund Solicitation, High-pressure Urgency.

---

### Sample 3: Multi-Bagger Penny Stock Forward (Bengali)
> "জরুরি ভিআইপি অ্যালার্ট! আগামীকাল সকাল ৯:১৫ তে XYZ পাওয়ার শেয়ার কিনুন। ১০০% নিশ্চিত ৩০০% লাভ মাত্র ৫ দিনে! কোনো ঝুঁকি নেই। প্রতিদিন নিশ্চিত জ্যাকপটের জন্য আমাদের ভিআইপি টেলিগ্রাম গ্রুপে যোগ দিন।"
- **Expected Assessment**: `POTENTIAL_RED_FLAGS`
- **Matched Flags**: Guaranteed Return (১০০% নিশ্চিত), Telegram Pump, Zero Risk claim.

---

### Sample 4: Official Regulatory Caution (Legitimate)
> "SEBI and NSE advise retail investors to remain vigilant against unregistered entities promising fixed returns in stock and derivatives trading. Investors are requested to verify registrations at sebi.gov.in."
- **Expected Assessment**: `NO_OBVIOUS_RED_FLAGS`
- **Matched Flags**: None (Legitimate Regulatory Guidance).
