
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Music, Sparkles } from 'lucide-react';

interface MagicPianoGameProps {
  onBack: () => void;
}

const PIANO_KEYS = [
  { note: 'C', freq: 261.63, color: '#FF6B6B', emoji: '🍎' },
  { note: 'D', freq: 293.66, color: '#FFD93D', emoji: '🐥' },
  { note: 'E', freq: 329.63, color: '#6BCB77', emoji: '🌳' },
  { note: 'F', freq: 349.23, color: '#4D96FF', emoji: '🌊' },
  { note: 'G', freq: 392.00, color: '#9B59B6', emoji: '🍇' },
  { note: 'A', freq: 440.00, color: '#F368E0', emoji: '🌸' },
  { note: 'B', freq: 493.88, color: '#FF9F43', emoji: '🦊' },
  { note: 'C2', freq: 523.25, color: '#1DD1A1', emoji: '🐢' },
];

const MagicPianoGame: React.FC<MagicPianoGameProps> = ({ onBack }) => {
  const [activeKeys, setActiveKeys] = useState<Set<number>>(new Set());
  const [visualEffects, setVisualEffects] = useState<{ id: number; x: number; y: number; color: string }[]>([]);

  const playNote = useCallback((freq: number, index: number) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 1.5);

      // Visual feedback
      setActiveKeys(prev => {
        const next = new Set(prev);
        next.add(index);
        return next;
      });
      
      const newEffect = {
        id: Date.now(),
        x: (index / PIANO_KEYS.length) * 100 + (100 / PIANO_KEYS.length / 2),
        y: 60 + Math.random() * 20,
        color: PIANO_KEYS[index].color
      };
      
      setVisualEffects(v => [...v.slice(-10), newEffect]);

      setTimeout(() => {
        setActiveKeys(prev => {
          const next = new Set(prev);
          next.delete(index);
          return next;
        });
      }, 300);

    } catch (e) {}
  }, []);

  return (
    <div className="max-w-5xl mx-auto select-none touch-none overflow-hidden rounded-[3.5rem] relative shadow-2xl border-8 border-indigo-400 bg-white"
         style={{ height: '75vh' }}>
      
      {/* ── HEADER ── */}
      <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-30">
        <button 
          onClick={onBack}
          className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-100 transition-colors shadow-sm"
        >
          <ArrowLeft size={28} />
        </button>
        
        <div className="flex flex-col items-center">
            <h2 className="text-3xl font-black text-indigo-800 flex items-center gap-3">
               <Music className="text-indigo-500" />
               بیانۆیا من یا رەنگین
               <Sparkles className="text-orange-400" />
            </h2>
            <p className="text-gray-400 font-bold text-sm uppercase tracking-widest mt-1">ل سەر رەنگان بدە و ئاوازان دروست بکە</p>
        </div>
        
        <div className="w-14" /> {/* Spacer */}
      </div>

      {/* ── VISUAL EFFECTS ── */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <AnimatePresence>
          {visualEffects.map(fx => (
            <motion.div
              key={fx.id}
              initial={{ opacity: 1, y: 0, scale: 0.5 }}
              animate={{ opacity: 0, y: -250, scale: 2, rotate: Math.random() * 90 }}
              exit={{ opacity: 0 }}
              className="absolute text-5xl"
              style={{ left: `${fx.x}%`, bottom: '40%', color: fx.color }}
            >
              ✨
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── PIANO KEYS ── */}
      <div className="absolute bottom-0 left-0 right-0 h-2/3 flex px-4 pb-8 gap-3">
        {PIANO_KEYS.map((key, i) => (
          <motion.button
            key={i}
            onPointerDown={() => playNote(key.freq, i)}
            whileTap={{ scale: 0.95, y: 15 }}
            className="flex-1 relative flex flex-col items-center justify-end pb-8 rounded-[2rem] shadow-xl border-b-[12px] transition-all"
            style={{ 
              backgroundColor: key.color,
              borderColor: 'rgba(0,0,0,0.15)',
              boxShadow: activeKeys.has(i) ? 'none' : `0 10px 20px -5px ${key.color}80`
            }}
          >
            <div className="absolute top-8 text-4xl mb-4 group-active:scale-125 transition-transform">{key.emoji}</div>
            <div className="text-white font-black text-2xl drop-shadow-md">{key.note}</div>
            
            {/* Glossy Overlay */}
            <div className="absolute inset-x-4 top-4 h-1/3 bg-white/20 rounded-t-full pointer-events-none" />
          </motion.button>
        ))}
      </div>

      {/* ── GROUND / DECOR ── */}
      <div className="absolute top-[15%] left-0 right-0 h-[20%] pointer-events-none flex justify-around items-center px-20">
        <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="text-7xl">🐱</motion.div>
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} className="text-7xl">🐰</motion.div>
        <motion.div animate={{ rotate: [0, -5, 5, 0] }} transition={{ repeat: Infinity, duration: 3.5 }} className="text-7xl">🐶</motion.div>
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 5 }} className="text-7xl">🐘</motion.div>
      </div>

      <style>{`
        body { overflow: hidden; }
      `}</style>
    </div>
  );
};

export default MagicPianoGame;
