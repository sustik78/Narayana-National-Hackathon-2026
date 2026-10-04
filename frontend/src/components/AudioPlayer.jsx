import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Square, Loader2 } from 'lucide-react';
import { synthesizeSpeechApi } from '../services/api';

export default function AudioPlayer({ text, language = 'en', label = "Listen to Explanation" }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioSrc, setAudioSrc] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // Reset if text changes
    stopAudio();
    setAudioSrc(null);
  }, [text, language]);

  const handlePlayAudio = async () => {
    if (isPlaying) {
      pauseAudio();
      return;
    }

    if (audioSrc && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
      return;
    }

    setIsLoading(true);
    try {
      // 1. Attempt Backend gTTS synthesis
      const res = await synthesizeSpeechApi({ text, language });
      if (res.audio_base64) {
        const src = `data:audio/mp3;base64,${res.audio_base64}`;
        setAudioSrc(src);
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play();
            setIsPlaying(true);
          }
        }, 100);
      }
    } catch (err) {
      console.warn("Backend TTS failed, trying Web Speech API fallback:", err);
      // Fallback: Browser Web Speech API
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language === 'hi' ? 'hi-IN' : language === 'bn' ? 'bn-IN' : 'en-IN';
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
    setIsPlaying(false);
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  return (
    <div className="inline-flex items-center gap-2">
      {audioSrc && (
        <audio
          ref={audioRef}
          src={audioSrc}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      )}

      <button
        onClick={handlePlayAudio}
        disabled={isLoading || !text}
        className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all shadow-sm ${
          isPlaying
            ? 'bg-teal-600 text-white shadow-teal-600/30'
            : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
        }`}
        aria-label={isPlaying ? "Pause voice playback" : "Play voice readout"}
      >
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" />
        ) : isPlaying ? (
          <Pause className="w-3.5 h-3.5" />
        ) : (
          <Volume2 className="w-3.5 h-3.5 text-teal-600" />
        )}
        <span>{isPlaying ? 'Pause Voice' : label}</span>
      </button>

      {isPlaying && (
        <button
          onClick={stopAudio}
          className="p-1.5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors"
          title="Stop Audio"
          aria-label="Stop Audio"
        >
          <Square className="w-3 h-3 fill-current" />
        </button>
      )}

      {isPlaying && (
        <div className="flex items-center gap-1 h-3 px-1">
          <span className="w-1 h-2 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1 h-3 bg-teal-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1 h-1.5 bg-teal-400 rounded-full animate-bounce" />
        </div>
      )}
    </div>
  );
}
