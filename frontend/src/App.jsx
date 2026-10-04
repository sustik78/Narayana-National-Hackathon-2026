import React, { useState, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ClaimInput from './components/ClaimInput';
import AnalysisDashboard from './components/AnalysisDashboard';
import EducationHub from './components/EducationHub';
import Footer from './components/Footer';
import { useLanguage } from './context/LanguageContext';

export default function App() {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState('home');
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleStartVerification = () => {
    setActiveSection('workspace');
    const elem = document.getElementById('workspace-section');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenEducation = () => {
    setActiveSection('education');
    const elem = document.getElementById('education-section');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAnalysisComplete = (data) => {
    setAnalysisResult(data);
    setTimeout(() => {
      const elem = document.getElementById('results-dashboard');
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const handleResetAnalysis = () => {
    setAnalysisResult(null);
    const elem = document.getElementById('workspace-section');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050811] text-slate-100">
      
      {/* Top Navigation */}
      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Hero Section */}
        <Hero
          onStartVerification={handleStartVerification}
          onOpenEducation={handleOpenEducation}
        />

        {/* Verification Workspace & Results */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
          <ClaimInput
            onAnalysisComplete={handleAnalysisComplete}
          />

          {analysisResult && (
            <AnalysisDashboard
              result={analysisResult}
              onReset={handleResetAnalysis}
            />
          )}

        </div>

        {/* Education Section */}
        <div className="bg-[#080d1a] border-t border-slate-800/80 mt-16">
          <EducationHub />
        </div>

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
