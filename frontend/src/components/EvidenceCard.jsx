import React from 'react';
import { ExternalLink, CheckCircle2, Shield, Landmark, Scale } from 'lucide-react';

export default function EvidenceCard({ sources, verificationSteps, missingInfo }) {
  const getSourceIcon = (category) => {
    switch (category) {
      case 'Regulator Portal':
      case 'Investor Education':
        return <Shield className="w-5 h-5 text-teal-400" />;
      case 'Depository':
      case 'Banking Regulator':
        return <Landmark className="w-5 h-5 text-sky-400" />;
      default:
        return <Scale className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Recommended Verification Steps */}
      {verificationSteps && verificationSteps.length > 0 && (
        <div className="bg-[#070b14] border border-slate-800 rounded-2xl p-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            Recommended Safe Verification Steps
          </h4>
          <div className="space-y-2.5">
            {verificationSteps.map((step, sidx) => (
              <div key={sidx} className="flex items-start gap-3 bg-[#0b1222] p-3.5 rounded-xl border border-slate-800">
                <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {step.step_number || sidx + 1}
                </span>
                <div className="flex-1">
                  <div className="text-xs sm:text-sm font-bold text-white">{step.title}</div>
                  <div className="text-xs text-slate-300 mt-0.5 leading-relaxed">{step.action}</div>
                  {step.official_portal_url && (
                    <a
                      href={step.official_portal_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-400 hover:text-teal-300 mt-1.5 hover:underline"
                    >
                      <span>Open Official Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Official Sources List */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300 mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-teal-400" />
          Curated Official Regulatory Sources
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sources && sources.map((src, idx) => (
            <div
              key={idx}
              className="p-4 bg-[#070b14] border border-slate-800 rounded-xl hover:border-teal-500 hover:shadow-lg hover:shadow-teal-950/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    {getSourceIcon(src.category)}
                    <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider">
                      {src.category}
                    </span>
                  </div>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded-md text-slate-400 hover:text-teal-300 hover:bg-slate-800 transition-colors"
                    title="Open official link"
                    aria-label={`Open ${src.name} portal`}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <h5 className="font-bold text-xs sm:text-sm text-white mb-1">
                  {src.name}
                </h5>
                <p className="text-xs text-slate-400 leading-relaxed mb-2">
                  {src.relevance_explanation || src.description}
                </p>
              </div>

              <a
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1 mt-2 pt-2 border-t border-slate-800"
              >
                <span>Verify on {src.id.replace('_', ' ').toUpperCase()}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Missing Information / Disclosures */}
      {missingInfo && missingInfo.length > 0 && (
        <div className="p-4 bg-amber-950/40 border border-amber-800 rounded-xl">
          <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
            Missing Statutory Disclosures in Claim:
          </h5>
          <ul className="space-y-1 text-xs text-amber-200/90 list-disc list-inside">
            {missingInfo.map((info, iidx) => (
              <li key={iidx}>{info}</li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}
