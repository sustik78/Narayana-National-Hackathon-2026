import React, { useState, useEffect } from 'react';
import { BookOpen, AlertOctagon, PhoneCall, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';
import ScamQuiz from './ScamQuiz';
import { fetchEducationApi } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function EducationHub() {
  const { language, t } = useLanguage();
  const [eduData, setEduData] = useState({ modules: [], quiz: [], reporting_steps: [] });
  const [activeTab, setActiveTab] = useState('patterns');

  useEffect(() => {
    fetchEducationApi()
      .then(data => setEduData(data))
      .catch(err => console.error("Education load error:", err));
  }, []);

  const getModuleTitle = (mod) => {
    if (language === 'hi') return mod.title_hi || mod.title_en;
    if (language === 'bn') return mod.title_bn || mod.title_en;
    return mod.title_en;
  };

  const getModuleSummary = (mod) => {
    if (language === 'hi') return mod.summary_hi || mod.summary_en;
    if (language === 'bn') return mod.summary_bn || mod.summary_en;
    return mod.summary_en;
  };

  const getStepTitle = (st) => {
    if (language === 'hi') return st.title_hi || st.title_en;
    if (language === 'bn') return st.title_bn || st.title_en;
    return st.title_en;
  };

  const getStepDesc = (st) => {
    if (language === 'hi') return st.desc_hi || st.desc_en;
    if (language === 'bn') return st.desc_bn || st.desc_en;
    return st.desc_en;
  };

  return (
    <section id="education-section" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-left">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-950/60 border border-teal-800 text-teal-300 text-xs font-bold mb-3">
          <BookOpen className="w-3.5 h-3.5 text-teal-400" />
          <span>Investor Protection Education</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {t('education.title')}
        </h2>
        <p className="text-slate-400 text-sm sm:text-base mt-2 font-light">
          {t('education.subtitle')}
        </p>
      </div>

      {/* Hub Navigation Tabs */}
      <div className="flex justify-center gap-2 mb-8">
        <button
          onClick={() => setActiveTab('patterns')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'patterns'
              ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
              : 'bg-[#0b1222] border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Common Scam Patterns
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'quiz'
              ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
              : 'bg-[#0b1222] border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Interactive Quiz
        </button>

        <button
          onClick={() => setActiveTab('reporting')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'reporting'
              ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
              : 'bg-[#0b1222] border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Fraud Reporting Guide (1930)
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'patterns' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {eduData.modules && eduData.modules.map((mod, idx) => (
            <div
              key={idx}
              className="bg-[#0b1222] border border-slate-800 rounded-3xl p-6 shadow-xl hover:border-teal-500/50 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-950 text-teal-300 border border-teal-800 flex items-center justify-center font-bold text-sm mb-4">
                0{idx + 1}
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-white mb-2">
                {getModuleTitle(mod)}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                {getModuleSummary(mod)}
              </p>

              <div className="space-y-2 pt-3 border-t border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 block">
                  Key Red Flags:
                </span>
                {mod.key_points && mod.key_points.map((pt, pidx) => (
                  <div key={pidx} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'quiz' && (
        <div>
          <ScamQuiz quizList={eduData.quiz} />
        </div>
      )}

      {activeTab === 'reporting' && (
        <div className="bg-[#0b1222] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl mx-auto shadow-2xl space-y-6">
          <div className="p-5 bg-red-950/60 border border-red-800 rounded-2xl flex items-start gap-3">
            <PhoneCall className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-base text-red-200">
                Immediate Action for Financial Loss: Call 1930
              </h4>
              <p className="text-xs sm:text-sm text-red-300 mt-1 leading-relaxed">
                If money has been defrauded within the "Golden Hour" (initial 2-4 hours), dial 1930 immediately so Indian cyber authorities can alert recipient banks to freeze fund transfers.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {eduData.reporting_steps && eduData.reporting_steps.map((st, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-[#070b14] border border-slate-800">
                <div className="w-8 h-8 rounded-xl bg-teal-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-md">
                  {st.step}
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-white">
                    {getStepTitle(st)}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                    {getStepDesc(st)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </section>
  );
}
