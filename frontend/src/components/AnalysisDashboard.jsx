import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Volume2, RefreshCw, AlertCircle, FileText, ChevronDown } from 'lucide-react';
import RedFlagsCard from './RedFlagsCard';
import EvidenceCard from './EvidenceCard';
import AudioPlayer from './AudioPlayer';
import { useLanguage } from '../context/LanguageContext';

export default function AnalysisDashboard({ result, onReset }) {
  const { language, t } = useLanguage();

  if (!result) return null;

  const getStatusConfig = (assessment) => {
    switch (assessment) {
      case 'POTENTIAL_RED_FLAGS':
        return {
          title: t('status.RED_FLAG'),
          bg: 'bg-red-950/40 border-red-800 text-red-200',
          badgeBg: 'bg-red-600 text-white shadow-lg shadow-red-600/30',
          icon: ShieldAlert,
          scoreColor: 'bg-red-500',
          desc: 'High probability of fraudulent solicitation, fake returns, or unauthorized pump schemes.'
        };
      case 'NEEDS_VERIFICATION':
        return {
          title: t('status.NEEDS_VERIFICATION'),
          bg: 'bg-amber-950/40 border-amber-800 text-amber-200',
          badgeBg: 'bg-amber-500 text-white shadow-lg shadow-amber-500/30',
          icon: AlertTriangle,
          scoreColor: 'bg-amber-500',
          desc: 'Content contains unverified financial claims that require confirmation on official portals.'
        };
      default:
        return {
          title: t('status.NO_OBVIOUS_RED_FLAGS'),
          bg: 'bg-emerald-950/40 border-emerald-800 text-emerald-200',
          badgeBg: 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30',
          icon: CheckCircle2,
          scoreColor: 'bg-emerald-500',
          desc: 'No obvious fraudulent trigger words detected, but all investments carry market risk.'
        };
    }
  };

  const statusConfig = getStatusConfig(result.overall_assessment);
  const StatusIcon = statusConfig.icon;

  return (
    <div id="results-dashboard" className="bg-[#0b1222]/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/90 border border-slate-800 p-6 sm:p-8 max-w-4xl mx-auto mt-8 text-left space-y-8 animate-fadeIn">
      
      {/* Top Bar: Assessment & Reset */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            {t('results.title')}
          </span>
          <div className="flex items-center gap-2">
            <span className={`px-3.5 py-1 rounded-full text-xs sm:text-sm font-extrabold ${statusConfig.badgeBg}`}>
              {statusConfig.title}
            </span>
          </div>
        </div>

        <button
          onClick={onReset}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700"
        >
          <RefreshCw className="w-3.5 h-3.5 text-teal-400" />
          <span>{t('results.btnNewCheck')}</span>
        </button>
      </div>

      {/* Assessment Summary Card with Risk Meter */}
      <div className={`p-6 rounded-2xl border ${statusConfig.bg}`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-[#070b14] border border-slate-800 rounded-xl shadow-inner">
              <StatusIcon className="w-8 h-8 text-current" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg sm:text-xl text-white">
                {statusConfig.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
                {statusConfig.desc}
              </p>
            </div>
          </div>

          {/* Risk Score Indicator */}
          <div className="bg-[#070b14] p-4 rounded-xl shadow-inner border border-slate-800 shrink-0 w-full md:w-48 text-center">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t('results.riskScore')}
            </div>
            <div className="text-3xl font-black text-white mt-1">
              {result.risk_score}<span className="text-xs font-normal text-slate-500">/100</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full mt-2 overflow-hidden border border-slate-800">
              <div
                className={`h-full ${statusConfig.scoreColor} transition-all duration-500`}
                style={{ width: `${result.risk_score}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Spoken Plain-Language Explanation */}
      <div className="bg-[#070b14] border border-slate-800 text-white p-6 sm:p-7 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h4 className="font-bold text-base text-teal-300 flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-teal-400" />
            {t('results.plainExplanation')}
          </h4>

          {/* Voice Audio Readout */}
          <AudioPlayer
            text={result.plain_explanation}
            language={result.response_language || language}
            label={t('results.listenAudio')}
          />
        </div>

        <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal whitespace-pre-line">
          {result.plain_explanation}
        </p>
      </div>

      {/* Original Analyzed Text */}
      <div className="p-4 bg-[#070b14]/90 rounded-2xl border border-slate-800 text-xs text-slate-300">
        <span className="font-bold text-slate-200 uppercase tracking-wider block mb-1">
          {t('results.originalInput')}:
        </span>
        <div className="p-3 bg-[#050811] rounded-xl border border-slate-800/80 italic font-mono text-teal-200">
          "{result.original_text}"
        </div>
      </div>

      {/* Claim-by-Claim Breakdown */}
      {result.extracted_claims && result.extracted_claims.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            {t('results.claimsBreakdown')} ({result.extracted_claims.length})
          </h4>
          <div className="space-y-2">
            {result.extracted_claims.map((claim, cidx) => (
              <div
                key={cidx}
                className={`p-3.5 rounded-xl border text-xs text-left ${
                  claim.is_suspicious 
                    ? 'bg-red-950/20 border-red-800 text-slate-200' 
                    : 'bg-[#070b14] border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-semibold text-white">
                    "{claim.claim_text}"
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    claim.is_suspicious ? 'bg-red-900/60 text-red-300 border border-red-700' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {claim.category}
                  </span>
                </div>
                <p className="text-slate-400 mt-1">
                  {claim.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Red Flags Card */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          {t('results.redFlagsTitle')} ({result.red_flags ? result.red_flags.length : 0})
        </h4>
        <RedFlagsCard redFlags={result.red_flags} />
      </div>

      {/* Official Evidence & Verification Steps */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          {t('results.evidenceTitle')}
        </h4>
        <EvidenceCard
          sources={result.evidence_sources}
          verificationSteps={result.verification_steps}
          missingInfo={result.missing_information_notes}
        />
      </div>

      {/* Statutory Disclaimer */}
      <div className="p-4 bg-[#070b14] rounded-2xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-300 font-semibold">{t('results.disclaimerTitle')}: </strong>
          {result.limitations_and_disclaimer}
        </div>
      </div>

    </div>
  );
}
