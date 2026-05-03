
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { KURDISH_ALPHABET } from '../constants';
import { KurdishLetter, UserTheme } from '../types';
import LetterSoundButton from './LetterSoundButton';

interface PracticeGameProps {
  theme?: UserTheme | null;
}

const PracticeGame: React.FC<PracticeGameProps> = ({ theme }) => {
  const [currentLetter, setCurrentLetter] = useState<KurdishLetter | null>(null);
  const [options, setOptions] = useState<KurdishLetter[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [gameState, setGameState] = useState<'start' | 'playing'>('start');

  const themeColors = {
    primary: theme === 'girl' ? 'text-pink-800' : 'text-blue-800',
    button: theme === 'girl' ? 'bg-pink-600 hover:bg-pink-700' : 'bg-blue-600 hover:bg-blue-700',
    option: theme === 'girl' ? 'bg-pink-50 border-pink-100 text-pink-900' : 'bg-blue-50 border-blue-100 text-blue-900'
  };

  const startNewRound = () => {
    const randomIndex = Math.floor(Math.random() * KURDISH_ALPHABET.length);
    const correct = KURDISH_ALPHABET[randomIndex];
    
    // Pick 3 random decoys
    const decoys = [...KURDISH_ALPHABET]
      .filter(l => l.char !== correct.char)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
      
    const newOptions = [correct, ...decoys].sort(() => 0.5 - Math.random());
    
    setCurrentLetter(correct);
    setOptions(newOptions);
    setFeedback(null);
  };

  const handleChoice = (letter: KurdishLetter) => {
    if (letter.char === currentLetter?.char) {
      setFeedback('correct');
      setScore(s => s + 1);
      setTimeout(startNewRound, 1500);
    } else {
      setFeedback('wrong');
    }
  };

  if (gameState === 'start') {
    return (
      <div className="bg-white p-8 rounded-[2rem] shadow-xl text-center">
        <h2 className={`text-3xl font-bold ${themeColors.primary} mb-4`}>یاریا پیتان (Letter Game) 🎮</h2>
        <p className="text-gray-600 mb-6">گوهێ خوە بدە دەنگی و پیتێ هەلبژێرە!</p>
        <button 
          onClick={() => { setGameState('playing'); startNewRound(); }}
          className={`${themeColors.button} text-white px-10 py-4 rounded-full font-bold text-xl transition shadow-lg`}
        >
          دەست پێ بکە (Start)
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-xl">
      <div className="flex justify-between items-center mb-8">
        <h2 className={`text-2xl font-bold ${themeColors.primary}`}>خالێن تە (Score): {score} 🌟</h2>
        <button 
          onClick={() => setGameState('start')}
          className="text-gray-400 hover:text-red-500 font-bold"
        >
          بدووماهی بینە (End)
        </button>
      </div>

      <div className="flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <p className="text-gray-500">گوهێ خوە بدە دەنگی (Listen):</p>
          {currentLetter && (
            <LetterSoundButton 
              char={currentLetter.char} 
              name={currentLetter.name} 
              audioUrl={currentLetter.audioUrl} 
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          {options.map((option) => (
            <motion.button
              key={option.char}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleChoice(option)}
              className={`p-6 rounded-2xl text-4xl font-bold shadow-md transition-colors border-2
                ${feedback === 'correct' && option.char === currentLetter?.char ? 'bg-green-100 border-green-500 text-green-700' : 
                  feedback === 'wrong' && option.char !== currentLetter?.char ? 'bg-red-50 border-gray-100' : `${themeColors.option}`}
              `}
            >
              {option.char}
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {feedback === 'correct' && (
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: 1.2 }} exit={{ scale: 0 }}
              className="text-4xl text-green-500 font-bold"
            >
              دەستخۆش! 🎉
            </motion.div>
          )}
          {feedback === 'wrong' && (
            <motion.div 
              initial={{ x: -10 }} animate={{ x: [10, -10, 0] }}
              className="text-xl text-red-500 font-bold"
            >
              دووبارە هەولبدە (Try Again) ❌
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PracticeGame;
