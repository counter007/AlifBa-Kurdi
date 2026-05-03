
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { KURDISH_ALPHABET } from './constants';
import { KurdishLetter, AppView, UserTheme } from './types';
import TracingBoard from './components/TracingBoard';
import AiAssistant from './components/AiAssistant';
import ExampleImage from './components/ExampleImage';
import LetterSoundButton from './components/LetterSoundButton';
import PracticeGame from './components/PracticeGame';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('theme-selection');
  const [userTheme, setUserTheme] = useState<UserTheme | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<KurdishLetter | null>(null);
  const [masteredLetters, setMasteredLetters] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  // Load progress and theme
  useEffect(() => {
    const savedMastery = localStorage.getItem('masteredLetters');
    if (savedMastery) {
      setMasteredLetters(JSON.parse(savedMastery));
    }
    
    const savedTheme = localStorage.getItem('userTheme') as UserTheme;
    if (savedTheme) {
      setUserTheme(savedTheme);
      setView('home');
    }
  }, []);

  const selectTheme = (theme: UserTheme) => {
    setUserTheme(theme);
    localStorage.setItem('userTheme', theme);
    setView('home');
  };

  const openLetter = (letter: KurdishLetter) => {
    setSelectedLetter(letter);
    setView('letter-detail');
  };

  const goHome = () => {
    setView('home');
    setSelectedLetter(null);
  };

  const toggleMastery = (char: string) => {
    const newMastered = masteredLetters.includes(char)
      ? masteredLetters.filter(c => c !== char)
      : [...masteredLetters, char];
    
    setMasteredLetters(newMastered);
    localStorage.setItem('masteredLetters', JSON.stringify(newMastered));
    
    if (!masteredLetters.includes(char)) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  const themeClasses = {
    bg: userTheme === 'girl' ? 'bg-pink-50' : 'bg-blue-50',
    primaryText: userTheme === 'girl' ? 'text-pink-800' : 'text-blue-800',
    secondaryText: userTheme === 'girl' ? 'text-pink-600' : 'text-blue-600',
    accentText: userTheme === 'girl' ? 'text-pink-400' : 'text-blue-400',
    border: userTheme === 'girl' ? 'border-pink-200' : 'border-blue-200',
    button: userTheme === 'girl' ? 'border-pink-600 text-pink-600 hover:bg-pink-50' : 'border-blue-600 text-blue-600 hover:bg-blue-50',
    cardBorder: userTheme === 'girl' ? 'border-pink-200 hover:border-pink-500' : 'border-blue-200 hover:border-blue-500',
    accentBg: userTheme === 'girl' ? 'bg-pink-100' : 'bg-blue-100',
    lightBg: userTheme === 'girl' ? 'bg-pink-50' : 'bg-blue-50',
    footer: userTheme === 'girl' ? 'text-pink-400 border-pink-100' : 'text-blue-400 border-blue-100'
  };

  const renderThemeSelection = () => (
    <div className="min-h-screen flex items-center justify-center bg-white p-6 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 text-8xl">🎨</div>
        <div className="absolute bottom-10 right-10 text-8xl">📚</div>
        <div className="absolute top-1/2 left-20 text-6xl">✨</div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl w-full text-center relative z-10 px-4"
      >
        <h1 className="text-3xl md:text-5xl font-black text-gray-800 mb-4">بخێر بێی بۆ دەفتەرا پیتان! 👋</h1>
        <p className="text-lg md:text-xl text-gray-500 mb-12">کى دێ فێری پیتان بیت؟ (Choose a profile)</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => selectTheme('boy')}
            className="bg-blue-50 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border-4 border-blue-200 hover:border-blue-500 transition-all shadow-xl group"
          >
            <div className="text-7xl md:text-9xl mb-4 md:mb-6 group-hover:animate-bounce">👦</div>
            <h2 className="text-2xl md:text-4xl font-bold text-blue-800">کور (Boy)</h2>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => selectTheme('girl')}
            className="bg-pink-50 p-10 rounded-[3rem] border-4 border-pink-200 hover:border-pink-500 transition-all shadow-xl group"
          >
            <div className="text-9xl mb-6 group-hover:animate-bounce">👧</div>
            <h2 className="text-4xl font-bold text-pink-800">کچ (Girl)</h2>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );

  const renderHome = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto p-6 relative"
    >
      {/* Background patterns */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
        {userTheme === 'boy' ? (
          <div className="text-6xl flex flex-wrap gap-20 p-10">
            <span>🚀</span> <span>🚗</span> <span>⚽</span> <span>🦁</span> <span>🦖</span> <span>🧩</span>
            <span>🚀</span> <span>🚗</span> <span>⚽</span> <span>🦁</span> <span>🦖</span> <span>🧩</span>
          </div>
        ) : (
          <div className="text-6xl flex flex-wrap gap-20 p-10">
            <span>🌸</span> <span>🦋</span> <span>💖</span> <span>🦄</span> <span>🎈</span> <span>🎀</span>
            <span>🌸</span> <span>🦋</span> <span>💖</span> <span>🦄</span> <span>🎈</span> <span>🎀</span>
          </div>
        )}
      </div>

      <header className="text-center mb-12 relative z-10">
        <div className="flex justify-between items-center mb-4">
           <button 
             onClick={() => { localStorage.removeItem('userTheme'); setUserTheme(null); setView('theme-selection'); }}
             className={`px-4 py-1 rounded-full text-sm font-bold border ${themeClasses.button}`}
           >
             گۆهرینا پروفایلی (Change Profile)
           </button>
        </div>
        <motion.h1 
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className={`text-3xl md:text-5xl lg:text-6xl font-extrabold ${themeClasses.primaryText} mb-4 whitespace-pre-wrap px-4`}
        >
          دەفتەرا فێربوونا پیتێن کوردى 🎨
        </motion.h1>
        <p className={`text-lg md:text-xl ${themeClasses.secondaryText} px-4`}>ئەلفبێیا کوردی ب کەیف و یاری فێرببە!</p>
        
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <div className={`bg-white px-6 py-2 rounded-full shadow-md border-2 border-yellow-200 flex items-center gap-2`}>
            <span className="text-2xl">🌟</span>
            <span className="font-bold text-yellow-700">پیتێن تو فێربووی (Progress): {masteredLetters.length} / {KURDISH_ALPHABET.length}</span>
          </div>
          <button 
            onClick={() => window.print()}
            className={`bg-white border-2 px-6 py-2 rounded-full font-bold transition shadow-md flex items-center gap-2 ${themeClasses.button}`}
          >
            <span>🖨️</span> چاپ بکە (Print All)
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-16 relative z-10">
        {KURDISH_ALPHABET.map((letter, idx) => (
          <motion.button
            key={letter.char}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.02 }}
            onClick={() => openLetter(letter)}
            className={`group relative bg-white p-8 rounded-3xl shadow-lg border-b-8 transform transition-all duration-300
              ${masteredLetters.includes(letter.char) ? 'border-yellow-400' : themeClasses.cardBorder}
            `}
          >
            {masteredLetters.includes(letter.char) && (
              <div className="absolute -top-3 -right-3 text-3xl animate-bounce">⭐</div>
            )}
            <span className={`text-6xl font-bold ${userTheme === 'girl' ? 'text-pink-900' : 'text-blue-900'} group-hover:scale-110 transition-transform block`}>
              {letter.char}
            </span>
          </motion.button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start mb-12 relative z-10">
        <PracticeGame theme={userTheme} />
        <div className="bg-yellow-100 p-8 rounded-[2rem] border-l-8 border-yellow-400 shadow-md">
          <h2 className="text-2xl font-bold text-yellow-800 mb-4">رێ نیشاندەر بۆ سەمیانان  (Parents) 👨‍👩‍👧‍👦</h2>
          <ul className="space-y-4 text-yellow-900">
            <li className="flex gap-3 items-start text-lg">
              <span className="bg-yellow-200 p-1 rounded">✅</span> هەر رۆژ زاروکێ خو فێرى پیتەکێ بکە.
            </li>
            <li className="flex gap-3 items-start text-lg">
              <span className="bg-yellow-200 p-1 rounded">✅</span> دگەل هەر پیتەکێ پەیڤەکا نوی بێژن.
            </li>
            <li className="flex gap-3 items-start text-lg">
              <span className="bg-yellow-200 p-1 rounded">✅</span> پاش تەمامکرنا هەر رۆپەلەکی، زارۆیێ خوە خەلات بکەن.
            </li>
            <li className="flex gap-3 items-start text-lg">
              <span className="bg-yellow-200 p-1 rounded">✅</span> ژ مامۆستایێ زیرەک (AI) پسیاران بکەن.
            </li>
          </ul>
        </div>
      </div>

      <AiAssistant theme={userTheme} />
    </motion.div>
  );

  const renderLetterDetail = () => {
    if (!selectedLetter) return null;
    const isMastered = masteredLetters.includes(selectedLetter.char);

    return (
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="max-w-4xl mx-auto p-6"
      >
        <button 
          onClick={goHome}
          className={`mb-8 flex items-center gap-2 ${themeClasses.secondaryText} font-bold hover:translate-x-[-10px] transition-transform`}
        >
          ⬅️ ڤەگەرە لاپەرێ سەرەکى (Back Home)
        </button>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-12 bg-white p-4 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-2xl relative overflow-hidden">
          <div className={`absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 ${themeClasses.accentBg} rounded-bl-[100%] z-0`}></div>
          
          <div className="relative z-10 flex flex-col">
            <div className="text-center mb-6 flex flex-col items-center">
              <h2 className={`text-7xl md:text-8xl font-black ${userTheme === 'girl' ? 'text-pink-900' : 'text-blue-900'} mb-2`}>{selectedLetter.char}</h2>
              <div className={`flex items-center gap-4 ${themeClasses.lightBg} px-6 py-2 rounded-full border ${themeClasses.border}`}>
                <LetterSoundButton 
                  char={selectedLetter.char} 
                  name={selectedLetter.name} 
                  audioUrl={selectedLetter.audioUrl} 
                />
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className={`${themeClasses.lightBg} p-4 md:p-6 rounded-2xl border-2 ${themeClasses.border} flex items-center justify-between gap-4`}>
                <div className="flex-1">
                  <p className="text-gray-500 text-sm mb-1">پەیڤەکا نوی (Example):</p>
                  <p className={`text-3xl md:text-4xl font-bold ${userTheme === 'girl' ? 'text-pink-800' : 'text-blue-800'} mb-1 md:mb-2`}>{selectedLetter.exampleWord}</p>
                  <p className="text-base text-gray-400 italic">Mane: {selectedLetter.exampleTranslation}</p>
                </div>
                <ExampleImage 
                  word={selectedLetter.exampleWord} 
                  translation={selectedLetter.exampleTranslation} 
                  customUrl={selectedLetter.imageUrl}
                  searchKeyword={selectedLetter.searchKeyword}
                />
              </div>

              {selectedLetter.examples?.map((ex, i) => (
                <div key={i} className={`${themeClasses.lightBg} p-4 md:p-6 rounded-2xl border-2 ${themeClasses.border} flex items-center justify-between gap-4`}>
                  <div className="flex-1">
                    <p className={`text-3xl md:text-4xl font-bold ${userTheme === 'girl' ? 'text-pink-800' : 'text-blue-800'} mb-1 md:mb-2`}>{ex.word}</p>
                    <p className="text-base text-gray-400 italic">Mane: {ex.translation}</p>
                  </div>
                  <ExampleImage 
                    word={ex.word} 
                    translation={ex.translation} 
                    customUrl={ex.imageUrl}
                    searchKeyword={ex.searchKeyword}
                  />
                </div>
              ))}
            </div>

            <div className="mt-auto md:hidden mb-6">
               <AiAssistant currentLetter={selectedLetter} theme={userTheme} />
            </div>
          </div>

          <div className="flex flex-col items-center justify-start pt-4 w-full">
            <h3 className="text-xl font-bold text-gray-700 mb-4">لڤێرێ بنڤیسە (Trace Here)</h3>
            <TracingBoard 
              letter={selectedLetter.char} 
              onComplete={() => toggleMastery(selectedLetter.char)} 
            />
            
            <AnimatePresence>
              {showCelebration && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 p-4 bg-yellow-100 border-2 border-yellow-400 rounded-2xl text-center w-full"
                >
                  <p className="text-xl md:text-2xl font-bold text-yellow-800">دەستخۆش! تو فێربووی 🌟</p>
                  <p className="text-xs md:text-sm text-yellow-600">Well done! You mastered this letter.</p>
                </motion.div>
              )}
            </AnimatePresence>

            {isMastered && !showCelebration && (
              <div className="mt-6 flex items-center gap-2 text-green-600 font-bold">
                <span>🌟</span> فێربوو (Learned)
              </div>
            )}
            
            <div className="hidden md:block w-full mt-8">
               <AiAssistant currentLetter={selectedLetter} theme={userTheme} />
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderPrintPages = () => (
    <div className="print-only hidden p-10 bg-white min-h-screen">
      {KURDISH_ALPHABET.map((letter, idx) => (
        <div key={idx} className="page-break-after border-2 border-gray-100 mb-10 p-10 rounded-xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-9xl font-bold text-gray-800">{letter.char}</h1>
            <div className="text-right">
              <p className="text-4xl font-bold text-gray-700 mt-2">{letter.exampleWord}</p>
            </div>
          </div>
          
          <div className="notebook-lines min-h-[500px] border-t-2 border-gray-200 mt-10">
            <div className="h-20 border-b border-gray-300 opacity-20"></div>
            <div className="h-20 border-b border-gray-300 opacity-20"></div>
            <div className="h-20 border-b border-gray-300 opacity-20"></div>
            <div className="h-20 border-b border-gray-300 opacity-20"></div>
            <div className="h-20 border-b border-gray-300 opacity-20"></div>
          </div>

          <div className="mt-12 border-4 border-dashed border-gray-300 rounded-3xl p-16 text-center text-gray-300 text-3xl font-bold">
             لڤێرێ وێنەیەکێ {letter.exampleWord} بکێشە <br/> (Draw here)
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={`min-h-screen pb-20 transition-colors duration-500 ${themeClasses.bg}`}>
      <div className="no-print">
        {view === 'theme-selection' ? renderThemeSelection() : 
         view === 'home' ? renderHome() : renderLetterDetail()}
      </div>
      {renderPrintPages()}
      
      <footer className={`no-print text-center mt-12 mb-6 border-t pt-8 pb-12 ${themeClasses.footer}`}>
        <p className="text-lg font-bold mb-2">© 2026 قوتابخانا کوردى بۆ زارۆکان</p>
        <div className="space-y-1 text-sm opacity-80">
          <p> دیزاین و پروگرامکرن: اسماعيل امين يوسف</p>
          <p dir="ltr">تەلەفون: 009647502118899</p>
          <p>ئیمێل: i.yousif1993@gmail.com</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
