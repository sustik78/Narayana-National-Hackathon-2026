import React from 'react';
import { Shield, Lock, ExternalLink, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-navy-950 text-slate-400 border-t border-navy-800 text-left pt-12 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Col 1: Identity */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white">
                <Shield className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                SACH AI
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md">
              {t('fullName')} — An accessible, voice-first multilingual misinformation and content literacy assistant engineered for the SANGYAN Hackathon.
            </p>
            <div className="text-xs text-teal-400 font-semibold italic">
              "{t('tagline')}"
            </div>
          </div>

          {/* Col 2: Regulatory Resources */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200 mb-3">
              Official Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="https://scores.sebi.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 flex items-center gap-1 transition-colors">
                  <span>SEBI SCORES</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://investor.sebi.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 flex items-center gap-1 transition-colors">
                  <span>SEBI Saarthi</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://nsdl.co.in/investors.php" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 flex items-center gap-1 transition-colors">
                  <span>NSDL Depository</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 flex items-center gap-1 transition-colors">
                  <span>National Cyber Crime (1930)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: SANGYAN Track */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200 mb-3">
              Hackathon Track
            </h4>
            <div className="text-xs space-y-1.5 text-slate-300">
              <div><strong>Event:</strong> SANGYAN Hackathon</div>
              <div><strong>Organizers:</strong> SNTC, IIT (BHU) Varanasi</div>
              <div><strong>Collaborators:</strong> SEBI & NSDL</div>
              <div className="text-teal-300 font-semibold">Track E: Misinformation & Content Literacy</div>
            </div>
          </div>

        </div>

        {/* Disclaimer Bar */}
        <div className="border-t border-navy-800 pt-6 text-[11px] text-slate-500 leading-relaxed flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © 2026 SACH AI. Built for SANGYAN Hackathon. Strictly for investor education and financial literacy. Never provides stock recommendations or buy/sell calls.
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 shrink-0">
            <Lock className="w-3.5 h-3.5 text-teal-400" />
            <span>Privacy First — No Permanent Audio Retention</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
