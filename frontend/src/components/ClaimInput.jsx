import React, { useState } from 'react';
import { Mic, Upload, FileText, Sparkles, Send, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import VoiceRecorder from './VoiceRecorder';
import SampleScenarios from './SampleScenarios';
import { transcribeAudioApi, analyzeClaimApi } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function ClaimInput({ onAnalysisComplete }) {
  const { language, setLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('voice');
  const [claimText, setClaimText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [sourceType, setSourceType] = useState('voice_mic');

  const handleTranscriptReady = (transcript, detectedLang) => {
    setClaimText(transcript);
    setSourceType('voice_mic');
    if (detectedLang && ['en', 'hi', 'bn'].includes(detectedLang)) {
      setLanguage(detectedLang);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg("File exceeds 15MB limit. Please upload a smaller audio recording.");
      return;
    }

    setSelectedFile(file);
    setIsUploading(true);
    setErrorMsg(null);
    setSourceType('audio_upload');

    try {
      const data = await transcribeAudioApi(file, file.name);
      if (data.transcript) {
        setClaimText(data.transcript);
        if (data.detected_language && ['en', 'hi', 'bn'].includes(data.detected_language)) {
          setLanguage(data.detected_language);
        }
      } else if (data.notes) {
        setErrorMsg(data.notes);
      }
    } catch (err) {
      console.error("Audio upload transcription error:", err);
      setErrorMsg("Failed to transcribe the uploaded audio. You can paste the message text manually below.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSampleSelected = (sampleText) => {
    setClaimText(sampleText);
    setSourceType('sample_scenario');
    setActiveTab('text');
  };

  const handleSubmitAnalysis = async (e) => {
    if (e) e.preventDefault();
    if (!claimText.trim() || claimText.trim().length < 3) {
      setErrorMsg("Please enter or record a financial claim to analyze (at least 3 characters).");
      return;
    }

    setErrorMsg(null);
    setIsAnalyzing(true);

    try {
      const result = await analyzeClaimApi({
        text: claimText.trim(),
        language: language,
        source_type: sourceType
      });
      onAnalysisComplete(result);
    } catch (err) {
      console.error("Analysis failure:", err);
      setErrorMsg(err.message || "Failed to analyze claim. Please check your network connection.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div id="workspace-section" className="bg-[#0b1222]/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/80 border border-slate-800 p-6 sm:p-8 max-w-4xl mx-auto -mt-10 relative z-20">
      
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {t('workspace.title')}
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-lg mx-auto font-light">
          {t('workspace.subtitle')}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-[#070b14] border border-slate-800/80 rounded-2xl mb-6 max-w-2xl mx-auto">
        <button
          onClick={() => setActiveTab('voice')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'voice'
              ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>{t('workspace.tabVoice')}</span>
        </button>

        <button
          onClick={() => setActiveTab('upload')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'upload'
              ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>{t('workspace.tabUpload')}</span>
        </button>

        <button
          onClick={() => setActiveTab('text')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'text'
              ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{t('workspace.tabText')}</span>
        </button>

        <button
          onClick={() => setActiveTab('samples')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'samples'
              ? 'bg-gradient-to-r from-sky-600 to-teal-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{t('workspace.tabSamples')}</span>
        </button>
      </div>

      {/* Tab Content Panels */}
      <div className="mb-6">
        {activeTab === 'voice' && (
          <VoiceRecorder
            onTranscriptReady={handleTranscriptReady}
            onError={(msg) => setErrorMsg(msg)}
          />
        )}

        {activeTab === 'upload' && (
          <div className="border-2 border-dashed border-slate-700 hover:border-teal-400 rounded-2xl p-8 text-center bg-[#070b14]/70 transition-colors">
            <input
              type="file"
              id="audio-upload-input"
              accept=".wav,.mp3,.m4a,.webm,.ogg,.flac"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label
              htmlFor="audio-upload-input"
              className="cursor-pointer flex flex-col items-center justify-center space-y-3"
            >
              <div className="w-14 h-14 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center">
                <Upload className="w-7 h-7" />
              </div>
              <div>
                <span className="font-bold text-white text-sm block">
                  {t('workspace.uploadPrompt')}
                </span>
                <span className="text-xs text-slate-400 mt-1 block">
                  {t('workspace.uploadHelp')}
                </span>
              </div>
            </label>

            {isUploading && (
              <div className="mt-4 flex items-center justify-center gap-2 text-teal-300 text-xs font-medium bg-teal-950/50 border border-teal-800 p-2.5 rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
                <span>Uploading & Transcribing audio...</span>
              </div>
            )}

            {selectedFile && !isUploading && (
              <div className="mt-3 text-xs text-slate-300 font-medium">
                Uploaded: <span className="font-bold text-teal-300">{selectedFile.name}</span> ({(selectedFile.size / 1024).toFixed(1)} KB)
              </div>
            )}
          </div>
        )}

        {activeTab === 'samples' && (
          <div className="p-4 bg-[#070b14]/80 rounded-2xl border border-slate-800">
            <p className="text-xs font-semibold text-slate-400 mb-3 text-left">
              Click any realistic financial simulation below to auto-populate and test:
            </p>
            <SampleScenarios onSelectSample={handleSampleSelected} />
          </div>
        )}
      </div>

      {/* Editable Transcript / Claim Text Input Area */}
      <form onSubmit={handleSubmitAnalysis} className="space-y-4 text-left">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="claim-text-input" className="text-xs font-bold uppercase tracking-wider text-slate-300">
              {t('workspace.transcriptLabel')}
            </label>
            <span className="text-[11px] text-slate-500 font-mono">
              {claimText.length} characters
            </span>
          </div>

          <textarea
            id="claim-text-input"
            rows={4}
            value={claimText}
            onChange={(e) => {
              setClaimText(e.target.value);
              setSourceType('pasted_text');
            }}
            placeholder={t('workspace.textPlaceholder')}
            className="w-full rounded-2xl border border-slate-700/80 focus:border-teal-400 focus:ring-4 focus:ring-teal-500/20 p-4 text-sm text-slate-100 bg-[#070b14] placeholder-slate-500 transition-all resize-y shadow-inner font-normal"
          />
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 bg-red-950/50 border border-red-800 text-red-300 rounded-xl text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Controls: Language + Submit */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
              {t('workspace.selectLang')}
            </span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-[#070b14] border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none cursor-pointer"
            >
              <option value="en">English (India)</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="bn">বাংলা (Bengali)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isAnalyzing || !claimText.trim()}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all ${
              isAnalyzing || !claimText.trim()
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-teal-500/25 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>{t('workspace.btnAnalyzing')}</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-white" />
                <span>{t('workspace.btnAnalyze')}</span>
              </>
            )}
          </button>

        </div>
      </form>

    </div>
  );
}
