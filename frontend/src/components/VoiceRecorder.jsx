import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, RotateCcw, Play, Pause, Trash2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { transcribeAudioApi } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function VoiceRecorder({ onTranscriptReady, onError }) {
  const { t } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [micError, setMicError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);
  const audioPreviewRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    setMicError(null);
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        stream.getTracks().forEach(track => track.stop());
        handleAutoTranscribe(blob);
      };

      mediaRecorder.start(200);
      setIsRecording(true);
      setRecordDuration(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordDuration(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error("Microphone access error:", err);
      setMicError("Microphone access was denied or not available. Please allow microphone permission or type your query below.");
      if (onError) onError(err.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  const resetRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordDuration(0);
    setIsRecording(false);
    setIsPlayingPreview(false);
    setMicError(null);
  };

  const handleAutoTranscribe = async (blob) => {
    setIsTranscribing(true);
    try {
      const data = await transcribeAudioApi(blob, 'voice_query.webm');
      if (data.transcript) {
        onTranscriptReady(data.transcript, data.detected_language);
      } else if (data.notes) {
        setMicError(data.notes);
      }
    } catch (err) {
      console.error("Transcription error:", err);
      setMicError("Could not connect to speech transcription service. You can type or paste the message directly in the box below.");
    } finally {
      setIsTranscribing(false);
    }
  };

  const togglePlayPreview = () => {
    if (!audioPreviewRef.current) return;
    if (isPlayingPreview) {
      audioPreviewRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      audioPreviewRef.current.play();
      setIsPlayingPreview(true);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-[#070b14]/70 border border-slate-800 rounded-2xl p-6 text-center">
      
      <div className="flex flex-col items-center justify-center">
        
        {!isRecording && !audioBlob && (
          <div className="space-y-4">
            <button
              onClick={startRecording}
              className="w-20 h-20 rounded-full bg-gradient-to-tr from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white flex items-center justify-center shadow-xl shadow-teal-500/25 transition-all hover:scale-105 active:scale-95 mx-auto"
              aria-label="Start Voice Recording"
            >
              <Mic className="w-10 h-10" />
            </button>
            <p className="text-sm font-medium text-slate-200 max-w-sm mx-auto">
              {t('workspace.micReady')}
            </p>
            <p className="text-xs text-slate-400">
              Speak in Hindi (हिन्दी), English, or Bengali (বাংলা)
            </p>
          </div>
        )}

        {isRecording && (
          <div className="space-y-4">
            <div className="relative">
              <button
                onClick={stopRecording}
                className="w-20 h-20 rounded-full bg-red-600 text-white flex items-center justify-center pulse-record shadow-xl shadow-red-600/40 mx-auto transition-transform active:scale-95"
                aria-label="Stop Voice Recording"
              >
                <Square className="w-8 h-8 fill-current" />
              </button>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/80 border border-red-800 text-red-300 font-bold text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span>{formatTime(recordDuration)}</span>
              <span>— {t('workspace.micRecording')}</span>
            </div>

            <div>
              <button
                onClick={stopRecording}
                className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors shadow-sm"
              >
                {t('workspace.stopRecord')}
              </button>
            </div>
          </div>
        )}

        {audioBlob && !isRecording && (
          <div className="w-full max-w-md space-y-4">
            <div className="p-4 bg-[#0b1222] border border-slate-700 rounded-xl shadow-md flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlayPreview}
                  className="w-10 h-10 rounded-full bg-teal-600 hover:bg-teal-500 text-white flex items-center justify-center transition-colors shadow-sm"
                  aria-label={isPlayingPreview ? "Pause recording preview" : "Play recording preview"}
                >
                  {isPlayingPreview ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>
                <div className="text-left">
                  <div className="text-xs font-bold text-white">Voice Note Recorded</div>
                  <div className="text-[11px] text-slate-400 font-mono">{formatTime(recordDuration)} Duration</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={resetRecording}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Delete and re-record"
                  aria-label="Delete and re-record"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {audioUrl && (
                <audio
                  ref={audioPreviewRef}
                  src={audioUrl}
                  onEnded={() => setIsPlayingPreview(false)}
                  className="hidden"
                />
              )}
            </div>

            {isTranscribing && (
              <div className="flex items-center justify-center gap-2 text-teal-300 font-medium text-xs bg-teal-950/60 border border-teal-800 rounded-lg p-3">
                <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
                <span>{t('workspace.micProcessing')}</span>
              </div>
            )}
          </div>
        )}

        {micError && (
          <div className="mt-4 p-3 bg-amber-950/60 border border-amber-800 rounded-xl text-amber-200 text-xs flex items-start gap-2 text-left max-w-md">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>{micError}</span>
          </div>
        )}

      </div>
    </div>
  );
}
