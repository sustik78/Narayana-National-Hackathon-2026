import React, { useState } from 'react';
import { HelpCircle, CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { submitQuizApi } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function ScamQuiz({ quizList }) {
  const { language } = useLanguage();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (!quizList || quizList.length === 0) return null;

  const currentQ = quizList[currentIdx];

  const getQuestionText = (q) => {
    if (language === 'hi') return q.question_hi || q.question_en;
    if (language === 'bn') return q.question_bn || q.question_en;
    return q.question_en;
  };

  const getOptionsList = (q) => {
    if (language === 'hi') return q.options_hi || q.options_en;
    if (language === 'bn') return q.options_bn || q.options_en;
    return q.options_en;
  };

  const handleSelectOption = async (optIdx) => {
    if (evaluation) return;
    setSelectedOpt(optIdx);

    try {
      const res = await submitQuizApi({
        question_id: currentQ.id,
        selected_index: optIdx,
        lang: language
      });
      setEvaluation(res);
      setAnsweredCount(prev => prev + 1);
      if (res.is_correct) {
        setScore(prev => prev + 1);
      }
    } catch (err) {
      const isCorrect = (optIdx === currentQ.correct_index);
      setEvaluation({
        is_correct: isCorrect,
        correct_index: currentQ.correct_index,
        explanation: currentQ[`explanation_${language}`] || currentQ.explanation_en
      });
      setAnsweredCount(prev => prev + 1);
      if (isCorrect) setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < quizList.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOpt(null);
      setEvaluation(null);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setEvaluation(null);
    setScore(0);
    setAnsweredCount(0);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <div className="p-8 bg-[#0b1222] border border-slate-800 rounded-3xl text-center space-y-4 max-w-xl mx-auto shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-400 flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white">Quiz Completed!</h3>
        <p className="text-sm text-slate-300">
          You scored <span className="font-extrabold text-teal-400 text-lg">{score}</span> out of <span className="font-bold text-white">{quizList.length}</span> on financial scam awareness.
        </p>
        <button
          onClick={handleRestart}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold text-xs flex items-center gap-2 mx-auto transition-colors shadow-lg shadow-teal-500/20"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retake Quiz</span>
        </button>
      </div>
    );
  }

  const options = getOptionsList(currentQ);

  return (
    <div className="bg-[#0b1222] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto shadow-xl text-left">
      
      {/* Quiz Header */}
      <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-800 mb-5">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-teal-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Question {currentIdx + 1} of {quizList.length}
          </span>
        </div>
        <div className="text-xs font-bold text-teal-300 font-mono">
          Score: {score}
        </div>
      </div>

      {/* Question */}
      <h3 className="text-base sm:text-lg font-bold text-white mb-6 leading-relaxed">
        {getQuestionText(currentQ)}
      </h3>

      {/* Options List */}
      <div className="space-y-3">
        {options.map((optText, optIdx) => {
          let btnStyle = "bg-[#070b14] border-slate-800 text-slate-200 hover:border-teal-400 hover:bg-slate-900";
          
          if (evaluation) {
            if (optIdx === evaluation.correct_index) {
              btnStyle = "bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold shadow-md shadow-emerald-950/50";
            } else if (optIdx === selectedOpt && !evaluation.is_correct) {
              btnStyle = "bg-red-950/60 border-red-500 text-red-200 font-semibold shadow-md shadow-red-950/50";
            } else {
              btnStyle = "bg-[#070b14] border-slate-800 text-slate-500 opacity-40";
            }
          }

          return (
            <button
              key={optIdx}
              disabled={Boolean(evaluation)}
              onClick={() => handleSelectOption(optIdx)}
              className={`w-full p-4 rounded-xl border text-xs sm:text-sm text-left transition-all flex items-start justify-between gap-3 ${btnStyle}`}
            >
              <span>{optText}</span>
              {evaluation && optIdx === evaluation.correct_index && (
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              )}
              {evaluation && optIdx === selectedOpt && !evaluation.is_correct && (
                <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Evaluation Explanation */}
      {evaluation && (
        <div className="mt-6 pt-5 border-t border-slate-800 space-y-4 animate-fadeIn">
          <div className={`p-4 rounded-xl border text-xs sm:text-sm ${
            evaluation.is_correct 
              ? 'bg-emerald-950/50 border-emerald-700 text-emerald-200' 
              : 'bg-amber-950/50 border-amber-700 text-amber-200'
          }`}>
            <div className="font-bold mb-1">
              {evaluation.is_correct ? '✓ Correct Answer!' : '✗ Incorrect'}
            </div>
            <p className="leading-relaxed">{evaluation.explanation}</p>
          </div>

          <div className="text-right">
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs inline-flex items-center gap-2 transition-colors shadow-lg shadow-teal-600/30"
            >
              <span>{currentIdx < quizList.length - 1 ? 'Next Question' : 'View Final Score'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
