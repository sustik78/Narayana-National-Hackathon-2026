import React from 'react';
import { AlertOctagon, TrendingUp, ShieldAlert, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function SampleScenarios({ onSelectSample }) {
  const { language } = useLanguage();

  const scenarios = [
    {
      id: 'sample_1_guaranteed_pump',
      title: language === 'hi' ? 'गारंटीड 300% पेनी स्टॉक टिप (टेलीग्राम)' : language === 'bn' ? 'নিশ্চিত ৩০০% পেনি শেয়ারের টিপ (টেলিগ্রাম)' : 'Guaranteed 300% Penny Stock Tip (Telegram)',
      category: 'High Risk / Pump & Dump',
      badgeColor: 'bg-red-950/80 text-red-300 border-red-800',
      icon: AlertOctagon,
      text: language === 'hi' 
        ? 'अति आवश्यक वीआईपी अलर्ट! कल सुबह 9:15 बजे XYZ पावर खरीदें। 100% गारंटीड 300% मुनाफा सिर्फ 5 दिनों में! कोई रिस्क नहीं। रोजाना पक्के जैकपॉट कॉल के लिए हमारा वीआईपी टेलीग्राम ग्रुप जॉइन करें।'
        : language === 'bn'
        ? 'জরুরি ভিআইপি অ্যালার্ট! আগামীকাল সকাল ৯:১৫ তে XYZ পাওয়ার শেয়ার কিনুন। ১০০% নিশ্চিত ৩০০% লাভ মাত্র ৫ দিনে! কোনো ঝুঁকি নেই। প্রতিদিন নিশ্চিত জ্যাকপটের জন্য আমাদের ভিআইপি টেলিগ্রাম গ্রুপে যোগ দিন।'
        : 'URGENT VIP ALERT! Buy XYZ Power Ltd tomorrow at 9:15 AM. Big institutional buying confirmed. 100% guaranteed target of 300% profit in 5 days! No risk. Join our VIP Telegram group for daily jackpot calls.'
    },
    {
      id: 'sample_2_fake_ipo',
      title: language === 'hi' ? 'प्री-आईपीओ संस्थागत कोटा स्कीम' : language === 'bn' ? 'প্রি-আইপিও প্রাতিষ্ঠানিক কোটা স্কিম' : 'Pre-IPO Institutional Quota Allotment Scheme',
      category: 'High Risk / Fake Allotment',
      badgeColor: 'bg-red-950/80 text-red-300 border-red-800',
      icon: ShieldAlert,
      text: language === 'hi'
        ? 'स्पेशल एफआईआई कोटा! आगामी मेगा आईपीओ में 40% छूट पर 100% गारंटीड अलॉटमेंट पाएं। सिर्फ 10 सीटें बाकी हैं। अलॉटमेंट अकाउंट में तुरंत ₹50,000 ट्रांसफर करें।'
        : language === 'bn'
        ? 'বিশেষ এফআইআই কোটা! আসন্ন মেগা আইপিও-তে ৪০% ছাড়ে ১০০% নিশ্চিত অ্যালটমেন্ট পান। মাত্র ১০টি সিট বাকি। সরাসরি অ্যালটমেন্ট অ্যাকাউন্টে ₹৫০,০০০ ট্রান্সফার করুন।'
        : 'Special FII Institutional Window! Get 100% guaranteed allotment in upcoming Mega IPO at 40% discount before listing. Only 10 seats remaining. Transfer application amount of ₹50,000 to direct allotment account.'
    },
    {
      id: 'sample_3_genuine_notice',
      title: language === 'hi' ? 'आधिकारिक SEBI/NSE सावधानी नोटिस' : language === 'bn' ? 'অফিশিয়াল SEBI/NSE সতর্কতা বিজ্ঞপ্তি' : 'Official SEBI / NSE Regulatory Caution',
      category: 'Informational / Legitimate',
      badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-800',
      icon: CheckCircle,
      text: language === 'hi'
        ? 'SEBI और NSE खुदरा निवेशकों को शेयर और वायदा बाजार में निश्चित रिटर्न का वादा करने वाली अपंजीकृत संस्थाओं से सतर्क रहने की सलाह देते हैं। sebi.gov.in पर पंजीकरण की जांच अवश्य करें।'
        : language === 'bn'
        ? 'SEBI এবং NSE বিনিয়োগকারীদের শেয়ার বাজারে নির্দিষ্ট লাভের প্রতিশ্রুতি দেওয়া অনুমোদনহীন সংস্থাগুলি থেকে সতর্ক থাকার পরামর্শ দিচ্ছে। sebi.gov.in-এ রেজিস্ট্রেশন যাচাই করুন।'
        : 'SEBI and NSE advise retail investors to remain vigilant against unregistered entities promising fixed returns in stock and derivatives trading. Investors are requested to verify registrations at sebi.gov.in.'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {scenarios.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            onClick={() => onSelectSample(item.text)}
            className="p-4 bg-[#0b1222] border border-slate-800 rounded-xl hover:border-teal-400 hover:shadow-lg hover:shadow-teal-950/40 cursor-pointer transition-all flex flex-col justify-between text-left group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${item.badgeColor}`}>
                  {item.category}
                </span>
                <Icon className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition-colors" />
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-100 mb-1.5 group-hover:text-teal-300 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                "{item.text}"
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] font-semibold text-teal-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
              Load & Analyze →
            </div>
          </div>
        );
      })}
    </div>
  );
}
