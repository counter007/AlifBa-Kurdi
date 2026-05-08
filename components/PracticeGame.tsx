import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { KURDISH_ALPHABET } from '../constants';
import { KurdishLetter, UserTheme } from '../types';
import LetterSoundButton from './LetterSoundButton';
import { Star, X, Trophy } from 'lucide-react';

interface PracticeGameProps {
  theme?: UserTheme | null;
}

const shuffle = <T,>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const PracticeGame: React.FC<PracticeGameProps> = ({ theme }) => {
  const [currentLetter, setCurrentLetter] = useState<KurdishLetter | null>(null);
  const [options, setOptions] = useState<KurdishLetter[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [gameState, setGameState] = useState<'start' | 'playing'>('start');
  const [disabled, setDisabled] = useState(false);
  const [level, setLevel] = useState(1);
  const [stars, setStars] = useState(0);
  const [streak, setStreak] = useState(0);

  const wrongQueue = useRef<KurdishLetter[]>([]);

  const themeColors = {
    primary: theme === 'girl' ? 'text-pink-800' : 'text-blue-800',
    accent: theme === 'girl' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600',
    button: theme === 'girl' ? 'bg-gradient-to-r from-pink-500 to-rose-600' : 'bg-gradient-to-r from-blue-500 to-indigo-600',
    option: theme === 'girl' ? 'bg-white border-pink-100 hover:bg-pink-50 text-pink-900 shadow-[0_6px_0_#fce7f3]' : 'bg-white border-blue-100 hover:bg-blue-50 text-blue-900 shadow-[0_6px_0_#dbeafe]',
    optionCorrect: 'bg-green-500 border-green-600 text-white shadow-[0_6px_0_#166534]',
    optionWrong: 'bg-red-500 border-red-600 text-white shadow-[0_6px_0_#991b1b]',
  };

  const startNewRound = () => {
    // Pick letter: Prioritize wrong ones, otherwise random
    let correct: KurdishLetter;
    if (wrongQueue.current.length > 0 && Math.random() > 0.4) {
      correct = wrongQueue.current.shift()!;
    } else {
      correct = KURDISH_ALPHABET[Math.floor(Math.random() * KURDISH_ALPHABET.length)];
    }

    // Complexity increases with score
    let optionCount = 3;
    if (score >= 20) optionCount = 6;
    else if (score >= 10) optionCount = 4;

    const decoys = shuffle(KURDISH_ALPHABET.filter(l => l.char !== correct.char)).slice(0, optionCount - 1);
    const newOptions = shuffle([correct, ...decoys]);

    setCurrentLetter(correct);
    setOptions(newOptions);
    setFeedback(null);
    setDisabled(false);
  };

  const handleChoice = (letter: KurdishLetter) => {
    if (disabled) return;
    setDisabled(true);

    if (letter.char === currentLetter?.char) {
      setFeedback('correct');
      setScore(s => s + 1);
      setStreak(s => {
        const next = s + 1;
        if (next % 5 === 0) setStars(prev => prev + 1);
        if (next % 10 === 0) setLevel(prev => prev + 1);
        return next;
      });
      setTimeout(startNewRound, 1800);
    } else {
      setFeedback('wrong');
      setStreak(0);
      wrongQueue.current.push(currentLetter!);
      setTimeout(() => {
        setFeedback(null);
        setDisabled(false);
      }, 2000);
    }
  };

  if (gameState === 'start') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-12 rounded-[3.5rem] shadow-2xl text-center border-b-8 border-gray-100"
      >
        <div className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <Trophy size={64} className="text-yellow-500" />
        </div>
        <h2 className={`text-4xl font-black ${themeColors.primary} mb-4 tracking-tight`}>
          یاریا پیتان 🎮
        </h2>
        <p className="text-gray-500 mb-10 text-lg font-medium max-w-sm mx-auto">پیتێن کوردی بێ بژێرە و ستێران کۆم بکە!</p>
        <button 
          onClick={() => { setGameState('playing'); startNewRound(); }}
          className={`${themeColors.button} text-white px-14 py-5 rounded-[2rem] font-black text-2xl shadow-xl hover:scale-105 active:scale-95 transition-all outline-none`}
        >
          دەست پێ بکە
        </button>
      </motion.div>
    );
  }

  return (
    <div className="bg-slate-50 p-8 rounded-[3.5rem] shadow-2xl relative overflow-hidden max-w-2xl mx-auto border-4 border-white">
      {/* HUD */}
      <div className="flex justify-between items-center mb-10 relative z-10">
        <div className="flex flex-col gap-1">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                size={22} 
                className={i < stars ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} 
              />
            ))}
          </div>
          <div className={`font-black text-sm ${themeColors.primary} opacity-60 uppercase tracking-widest`}>
            ئێست {level} • خالێن تە: {score}
          </div>
        </div>
        <button 
          onClick={() => setGameState('start')}
          className="bg-white p-3 rounded-2xl shadow-md text-red-500 hover:bg-red-50 transition-colors border border-red-50"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex flex-col items-center gap-10 relative z-10">
        {/* The target sound */}
        <motion.div 
          key={currentLetter?.char}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`p-10 rounded-[3rem] ${themeColors.accent} shadow-inner border-2 border-white flex flex-col items-center gap-2`}
        >
          <div className="text-xs font-black opacity-60 uppercase tracking-wider mb-2">گوهێ خوە بدە دەنگی</div>
          {currentLetter && (
            <LetterSoundButton 
              char={currentLetter.char} 
              name={currentLetter.name} 
              audioUrl={currentLetter.audioUrl} 
              className="scale-150 hover:scale-[1.6] transition-transform"
            />
          )}
        </motion.div>

        {/* Options grid */}
        <div className={`grid gap-6 w-full ${options.length > 4 ? 'grid-cols-3' : options.length > 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
          {options.map((option) => (
            <motion.button
              key={option.char}
              whileHover={{ scale: disabled ? 1 : 1.05 }}
              whileTap={{ scale: disabled ? 1 : 0.95 }}
              onClick={() => handleChoice(option)}
              disabled={disabled}
              className={`p-8 rounded-[2.5rem] text-5xl font-black transition-all border-2
                ${feedback === 'correct' && option.char === currentLetter?.char 
                  ? themeColors.optionCorrect 
                  : feedback === 'wrong' && option.char === currentLetter?.char
                    ? themeColors.optionCorrect // Show correct one
                    : feedback === 'wrong' && option.char !== currentLetter?.char
                      ? 'opacity-30 grayscale filter'
                      : themeColors.option
                }
              `}
            >
              {option.char}
            </motion.button>
          ))}
        </div>

        {/* Feedback area */}
        <div className="min-h-[100px] w-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            {feedback === 'correct' && (
              <motion.div 
                key="correct"
                initial={{ scale: 0, y: 20 }} animate={{ scale: 1.2, y: 0 }} exit={{ scale: 0 }}
                className="text-4xl text-green-500 font-black flex items-center gap-3"
              >
                دەستخۆش! 🎉✨
              </motion.div>
            )}
            {feedback === 'wrong' && (
              <motion.div 
                key="wrong"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="text-red-500 font-black text-xl flex items-center gap-2">
                  دوبارە هەولبدە! ❌
                </div>
                <div className="text-sm font-bold text-gray-400">پیتی ڕاستە ئەڤە بوو:</div>
                <div className="text-6xl text-green-600 font-black">{currentLetter?.char}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Decorative Background */}
      <div className="absolute top-1/4 -left-12 w-48 h-48 bg-blue-100 rounded-full blur-3xl opacity-40 mix-blend-multiply pointer-events-none" />
      <div className="absolute bottom-1/4 -right-12 w-48 h-48 bg-pink-100 rounded-full blur-3xl opacity-40 mix-blend-multiply pointer-events-none" />
    </div>
  );
};

export default PracticeGame;
