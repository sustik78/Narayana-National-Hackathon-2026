import React from 'react';
import { Shield, Sparkles, Type, Eye, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAccessibility } from '../context/AccessibilityContext';

export default function Navbar({ activeSection, setActiveSection }) {
  const { language, setLanguage, t } = useLanguage();
  const { largeText, highContrast, toggleLargeText, toggleHighContrast } = useAccessibility();

  return (
    <header className="sticky top-0 z-50 bg-navy-950/95 backdrop-blur-md border-b border-navy-800 text-white transition-all shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Identity */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveSection('home')}
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-teal-600 to-sky-500 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-teal-200 bg-clip-text text-transparent">
                  SACH AI
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Track E
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                {t('tagline')}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => setActiveSection('workspace')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSection === 'workspace' 
                  ? 'bg-teal-600/20 text-teal-300 border border-teal-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-navy-800'
              }`}
            >
              {t('nav.verify')}
            </button>

            <button
              onClick={() => setActiveSection('education')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSection === 'education' 
                  ? 'bg-teal-600/20 text-teal-300 border border-teal-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-navy-800'
              }`}
            >
              {t('nav.education')}
            </button>

            <button
              onClick={() => setActiveSection('sources')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSection === 'sources' 
                  ? 'bg-teal-600/20 text-teal-300 border border-teal-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-navy-800'
              }`}
            >
              {t('nav.sources')}
            </button>
          </nav>

          {/* Controls: Language & Accessibility */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Selector */}
            <div className="relative flex items-center bg-navy-900 border border-navy-700 rounded-lg px-2 py-1">
              <Globe className="w-4 h-4 text-teal-400 mr-1.5 hidden sm:inline" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-xs sm:text-sm text-slate-200 focus:outline-none cursor-pointer font-medium"
                aria-label="Select Language"
              >
                <option value="en" className="bg-navy-900 text-white">English</option>
                <option value="hi" className="bg-navy-900 text-white">हिन्दी (Hindi)</option>
                <option value="bn" className="bg-navy-900 text-white">বাংলা (Bengali)</option>
              </select>
            </div>

            {/* Large Text Toggle */}
            <button
              onClick={toggleLargeText}
              className={`p-2 rounded-lg border transition-colors flex items-center gap-1 text-xs font-semibold ${
                largeText 
                  ? 'bg-sky-500/20 border-sky-400 text-sky-300' 
                  : 'bg-navy-900 border-navy-700 text-slate-300 hover:text-white hover:bg-navy-800'
              }`}
              title="Toggle Large Text Mode"
              aria-label="Toggle Large Text"
            >
              <Type className="w-4 h-4" />
              <span className="hidden lg:inline">A+</span>
            </button>

            {/* High Contrast Toggle */}
            <button
              onClick={toggleHighContrast}
              className={`p-2 rounded-lg border transition-colors flex items-center gap-1 text-xs font-semibold ${
                highContrast 
                  ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300' 
                  : 'bg-navy-900 border-navy-700 text-slate-300 hover:text-white hover:bg-navy-800'
              }`}
              title="Toggle High Contrast Mode"
              aria-label="Toggle High Contrast"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden lg:inline">Contrast</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
