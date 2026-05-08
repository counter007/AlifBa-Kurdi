
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Trophy, RefreshCw, Zap } from 'lucide-react';

interface CandyCrushGameProps {
  onBack: () => void;
}

const GRID_SIZE = 7;
const LETTER_POOL = ['ئـ', 'ب', 'پ', 'ت', 'ج', 'چ', 'ح', 'خ', 'د', 'ر', 'ز', 'ژ', 'س', 'ش', 'ڤ', 'ق', 'ک', 'گ', 'ل', 'م', 'ن', 'و', 'ھ', 'ی'];
const CANDY_COLORS = [
  'bg-red-500', 'bg-blue-500', 'bg-green-500', 
  'bg-yellow-400', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500',
  'bg-sky-500', 'bg-rose-500', 'bg-indigo-500'
];

const playCandySound = (type: 'match' | 'swap' | 'pop' | 'cascade') => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    if (type === 'match') {
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
    } else if (type === 'pop') {
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.05);
    } else {
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
    }
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch (e) {}
};

const CandyCrushGame: React.FC<CandyCrushGameProps> = ({ onBack }) => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<{r: number, c: number} | null>(null);
  const [moves, setMoves] = useState(25);
  const [level, setLevel] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPool, setCurrentPool] = useState<string[]>([]);

  const targetScore = level * 500;

  const initGrid = useCallback((targetLevel: number) => {
    // Pick a subset of letters for this level
    const shuffled = [...LETTER_POOL].sort(() => Math.random() - 0.5);
    const pool = shuffled.slice(0, Math.min(6 + Math.floor(targetLevel/5), 10));
    setCurrentPool(pool);

    const newGrid: string[][] = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      newGrid[r] = [];
      for (let c = 0; c < GRID_SIZE; c++) {
        newGrid[r][c] = pool[Math.floor(Math.random() * pool.length)];
      }
    }
    setGrid(newGrid);
    setScore(0);
    setMoves(25 - Math.min(Math.floor(targetLevel/2), 10));
  }, []);

  useEffect(() => {
    initGrid(level);
  }, [level, initGrid]);

  const checkMatches = (currentGrid: string[][]) => {
    const toRemove = new Set<string>();

    // Horizontal
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE - 2; c++) {
        const type = currentGrid[r][c];
        if (type && type === currentGrid[r][c+1] && type === currentGrid[r][c+2]) {
          toRemove.add(`${r}-${c}`);
          toRemove.add(`${r}-${c+1}`);
          toRemove.add(`${r}-${c+2}`);
        }
      }
    }

    // Vertical
    for (let c = 0; c < GRID_SIZE; c++) {
      for (let r = 0; r < GRID_SIZE - 2; r++) {
        const type = currentGrid[r][c];
        if (type && type === currentGrid[r+1][c] && type === currentGrid[r+2][c]) {
          toRemove.add(`${r}-${c}`);
          toRemove.add(`${r+1}-${c}`);
          toRemove.add(`${r+2}-${c}`);
        }
      }
    }

    return Array.from(toRemove).map(s => {
      const [r, c] = s.split('-').map(Number);
      return { r, c };
    });
  };

  const processGrid = async (currentGrid: string[][]) => {
    let matches = checkMatches(currentGrid);
    if (matches.length === 0) {
      setIsProcessing(false);
      // Check for level up
      if (score >= targetScore) {
        setTimeout(() => {
          setLevel(l => l + 1);
        }, 1200);
      }
      return;
    }

    setIsProcessing(true);
    const newGrid = currentGrid.map(row => [...row]);
    
    // Remove matches
    matches.forEach(({r, c}) => {
      newGrid[r][c] = '';
    });
    setScore(s => s + matches.length * 15);
    setGrid([...newGrid]);
    playCandySound('pop');

    await new Promise(res => setTimeout(res, 300));

    // Drop down
    for (let c = 0; c < GRID_SIZE; c++) {
      let emptyRow = GRID_SIZE - 1;
      for (let r = GRID_SIZE - 1; r >= 0; r--) {
        if (newGrid[r][c] !== '') {
          newGrid[emptyRow][c] = newGrid[r][c];
          if (emptyRow !== r) newGrid[r][c] = '';
          emptyRow--;
        }
      }
      // Fill new
      for (let r = emptyRow; r >= 0; r--) {
        newGrid[r][c] = currentPool[Math.floor(Math.random() * currentPool.length)];
      }
    }
    
    setGrid([...newGrid]);
    await new Promise(res => setTimeout(res, 300));
    
    // Recursive check for cascades
    processGrid(newGrid);
  };

  const handleSwap = async (r1: number, c1: number, r2: number, c2: number) => {
    if (isProcessing || moves <= 0) return;

    const newGrid = grid.map(row => [...row]);
    const temp = newGrid[r1][c1];
    newGrid[r1][c1] = newGrid[r2][c2];
    newGrid[r2][c2] = temp;

    // Check if move is valid
    const matches = checkMatches(newGrid);
    if (matches.length > 0) {
      setMoves(m => m - 1);
      setGrid(newGrid);
      playCandySound('match');
      processGrid(newGrid);
    } else {
      playCandySound('swap');
      setGrid([...grid]); // Trigger UI refresh if needed
    }
    setSelected(null);
  };

  const handleClick = (r: number, c: number) => {
    if (isProcessing) return;

    if (!selected) {
      setSelected({r, c});
    } else {
      const {r: r1, c: c1} = selected;
      const isAdjacent = (Math.abs(r - r1) === 1 && c === c1) || (Math.abs(c - c1) === 1 && r === r1);
      
      if (isAdjacent) {
        handleSwap(r1, c1, r, c);
      } else {
        setSelected({r, c});
      }
    }
  };

  const getColorClass = (char: string) => {
    const idx = LETTER_POOL.indexOf(char);
    return CANDY_COLORS[idx % CANDY_COLORS.length];
  };

  return (
    <div className="max-w-2xl mx-auto p-4 select-none">
      <div className="bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border-8 border-purple-200">
        
        {/* Header */}
        <div className="p-8 bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <Trophy size={100} />
          </div>
          <button onClick={onBack} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors relative z-10 backdrop-blur-sm">
            <ArrowLeft size={28} />
          </button>
          
          <div className="flex flex-col items-center relative z-10">
             <div className="text-xs font-black bg-yellow-400 text-purple-900 px-3 py-1 rounded-full mb-1 uppercase tracking-tighter">ئاست: {level}</div>
             <div className="flex gap-4">
                <div className="flex flex-col items-center">
                   <div className="text-[10px] opacity-60 font-bold uppercase">پێنگاڤ</div>
                   <div className="text-2xl font-black">{moves}</div>
                </div>
                <div className="w-px h-8 bg-white/20 self-center" />
                <div className="flex flex-col items-center">
                   <div className="text-[10px] opacity-60 font-bold uppercase">کۆم</div>
                   <div className="text-2xl font-black">{score}<span className="text-sm opacity-50">/{targetScore}</span></div>
                </div>
             </div>
          </div>

          <div className="w-12" />
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-purple-100 relative">
           <motion.div 
             initial={{ width: 0 }}
             animate={{ width: `${Math.min((score/targetScore) * 100, 100)}%` }}
             className="absolute inset-y-0 left-0 bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]"
           />
        </div>

        {/* Game Grid */}
        <div className="p-8 bg-purple-50/50">
          <div className="grid grid-cols-7 gap-3 aspect-square max-w-sm mx-auto bg-purple-100/50 p-3 rounded-[2rem] shadow-inner">
            {grid.map((row, r) => row.map((char, c) => (
              <motion.div
                key={`${r}-${c}`}
                layout
                onClick={() => handleClick(r, c)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                className={`
                  aspect-square rounded-xl shadow-lg flex items-center justify-center text-2xl font-black cursor-pointer transition-all border-b-4 border-black/20 text-white
                  ${char === '' ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}
                  ${selected?.r === r && selected?.c === c ? 'ring-4 ring-yellow-400 scale-110 z-10 translate-y-[-4px]' : ''}
                  ${getColorClass(char)}
                `}
              >
                {char}
              </motion.div>
            )))}
          </div>
        </div>

        {/* Level Result / Footer */}
        <div className="p-10 text-center bg-white border-t-2 border-purple-50">
          <AnimatePresence mode="wait">
            {moves === 0 && score < targetScore && !isProcessing ? (
              <motion.div key="gameover" initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-2">
                <h3 className="text-4xl font-black text-red-500 mb-2">یاری ب دووماهی هات! 😢</h3>
                <p className="text-gray-400 font-bold mb-8 italic">تە نەماینە چ پێنگاڤێن دی...</p>
                <button 
                  onClick={() => {
                    if (level === 1) initGrid(1);
                    else setLevel(1);
                  }}
                  className="bg-purple-600 text-white px-12 py-4 rounded-[2rem] font-black text-xl flex items-center gap-3 mx-auto hover:bg-purple-700 transition-all shadow-xl active:scale-95"
                >
                  <RefreshCw size={24} /> دوبارە بکە
                </button>
              </motion.div>
            ) : score >= targetScore && !isProcessing ? (
               <motion.div key="win" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <h3 className="text-4xl font-black text-green-500 mb-2">دەستخۆش! 🎉✨</h3>
                  <p className="text-gray-400 font-bold mb-8">تو بەرەڤ ئاستێ دی چووی {level + 1}</p>
                  <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity }} className="text-7xl mb-6">🏆</motion.div>
               </motion.div>
            ) : (
              <div key="status" className="flex flex-col items-center gap-2">
                 <p className="text-purple-300 font-black uppercase tracking-widest text-sm">
                   {isProcessing ? 'چاڤەرێ بە، پیت دبەزن...' : 'سێ پیتێن وەکی ئێک رێز بکە'}
                 </p>
                 <div className="flex gap-2 opacity-30">
                    {currentPool.slice(0, 5).map(p => <span key={p} className="text-xl font-black">{p}</span>)}
                 </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CandyCrushGame;
