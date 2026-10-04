import React from 'react';
import { AlertTriangle, ShieldX, CheckCircle, Tag, ArrowRight } from 'lucide-react';

export default function RedFlagsCard({ redFlags }) {
  if (!redFlags || redFlags.length === 0) {
    return (
      <div className="p-5 bg-emerald-950/40 border border-emerald-800 rounded-2xl flex items-start gap-3 text-left">
        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-sm text-emerald-200">No Common Fraud Trigger Phrases Found</h4>
          <p className="text-xs text-emerald-300 mt-1">
            The submitted statement does not match typical guaranteed return formulas or high-pressure solicitation phrases.
          </p>
        </div>
      </div>
    );
  }

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/30';
      case 'HIGH':
        return 'bg-orange-600 text-white border-orange-500 shadow-md shadow-orange-600/30';
      case 'MEDIUM':
        return 'bg-amber-600 text-white border-amber-500';
      default:
        return 'bg-slate-700 text-white border-slate-600';
    }
  };

  return (
    <div className="space-y-3">
      {redFlags.map((flag, idx) => (
        <div
          key={idx}
          className="p-4 sm:p-5 bg-[#070b14] border border-red-900/60 rounded-2xl shadow-lg text-left"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-red-950 text-red-400 flex items-center justify-center font-bold text-xs border border-red-800">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <h4 className="font-bold text-sm sm:text-base text-white">
                {flag.title}
              </h4>
            </div>
            <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getSeverityBadge(flag.severity)}`}>
              {flag.severity} RISK
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            {flag.description}
          </p>

          {/* Trigger words matched */}
          {flag.matched_phrases && flag.matched_phrases.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <Tag className="w-3 h-3 text-teal-400" /> Matched Triggers:
              </span>
              {flag.matched_phrases.map((phrase, pidx) => (
                <span
                  key={pidx}
                  className="bg-red-950/80 text-red-300 border border-red-800 text-[11px] font-medium px-2 py-0.5 rounded-md"
                >
                  "{phrase}"
                </span>
              ))}
            </div>
          )}

          {/* Safe Action */}
          {flag.safe_action && (
            <div className="mt-3 p-3 bg-[#0b1222] border border-slate-800 rounded-xl flex items-start gap-2">
              <ArrowRight className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300">
                <strong className="text-teal-300 font-semibold">Safe Action: </strong>
                {flag.safe_action}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
