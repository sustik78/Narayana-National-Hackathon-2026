import React from 'react';
import { ShieldCheck, Mic, ArrowRight, BookOpen, AlertTriangle, CheckCircle2, Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Hero({ onStartVerification, onOpenEducation }) {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-navy-950 via-navy-900 to-slate-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-navy-800">
      
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[250px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto text-center relative z-10">
        
        {/* Track Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-800/80 border border-teal-500/30 text-teal-300 text-xs sm:text-sm font-medium mb-6 backdrop-blur-md shadow-sm">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          <span>SANGYAN Hackathon (SNTC, IIT BHU • SEBI • NSDL)</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-tight">
          {t('hero.title')}
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
          {t('hero.subtitle')}
        </p>

        {/* Tagline highlight */}
        <div className="mt-4 text-sm sm:text-base font-semibold text-teal-300 italic tracking-wide">
          "{t('tagline')}"
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartVerification}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold text-base shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Mic className="w-5 h-5" />
            <span>{t('hero.ctaCheck')}</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            onClick={onOpenEducation}
            className="w-full sm:w-auto px-7 py-4 rounded-xl bg-navy-850 hover:bg-navy-800 border border-slate-700 text-slate-200 font-semibold text-base flex items-center justify-center gap-2 transition-all hover:border-slate-500"
          >
            <BookOpen className="w-5 h-5 text-sky-400" />
            <span>{t('hero.ctaLearn')}</span>
          </button>
        </div>

        {/* 3-Step Simple Flow */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto">
          
          <div className="bg-navy-900/70 border border-navy-700/80 rounded-2xl p-5 backdrop-blur-sm hover:border-teal-500/40 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-sm mb-3">
              01
            </div>
            <h2 className="font-bold text-base text-white mb-1">
              {t('hero.step1')}
            </h2>
            <p className="text-xs text-slate-400">
              Record voice note in Hindi/English/Bengali or paste suspicious Telegram / WhatsApp investment tips.
            </p>
          </div>

          <div className="bg-navy-900/70 border border-navy-700/80 rounded-2xl p-5 backdrop-blur-sm hover:border-teal-500/40 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-sky-500/20 text-sky-300 flex items-center justify-center font-bold text-sm mb-3">
              02
            </div>
            <h2 className="font-bold text-base text-white mb-1">
              {t('hero.step2')}
            </h2>
            <p className="text-xs text-slate-400">
              NLP rule base checks guaranteed returns, fake IPO quotas, operator pumps, and impersonation.
            </p>
          </div>

          <div className="bg-navy-900/70 border border-navy-700/80 rounded-2xl p-5 backdrop-blur-sm hover:border-teal-500/40 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-sm mb-3">
              03
            </div>
            <h2 className="font-bold text-base text-white mb-1">
              {t('hero.step3')}
            </h2>
            <p className="text-xs text-slate-400">
              Receive verified official SEBI / NSDL resources and listen to plain-language audio explanations.
            </p>
          </div>

        </div>

        {/* Responsible AI & Privacy banner */}
        <div className="mt-10 inline-flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 border-t border-navy-800/80 pt-6">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-teal-400" />
            <span>Zero Persistent Audio Storage</span>
          </div>
          <span className="hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Educational & Investor Protection Only</span>
          </div>
          <span className="hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Never Provides Stock Advice or Buy/Sell Calls</span>
          </div>
        </div>

      </div>
    </section>
  );
}
