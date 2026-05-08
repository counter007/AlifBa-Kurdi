import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, Heart, ArrowLeft, Play, RotateCcw, Zap } from 'lucide-react';
import { KURDISH_ALPHABET } from '../constants';

interface FallingLetter {
  id: number;
  char: string;
  x: number;
  y: number;
  speed: number;
  rotation: number;
  rotSpeed: number;
  isTarget: boolean;
  color: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  angle: number;
  dist: number;
}

interface CatchTheLetterGameProps {
  onBack: () => void;
}

const PALETTE = ['#FF6B6B','#FFD93D','#6BCB77','#4D96FF','#FF9F1C','#C77DFF','#00F5D4','#FF477E'];
const MAX_LIVES = 5;
const ENCOURAGE_MSGS = ['زۆر باشە 🌟', 'ئافەرین ⭐', 'بەردەوام بە 🔥', 'تۆ زیرەکیت 🧠', 'گەورە 💫'];

const playSound = (type: 'catch' | 'miss' | 'levelup' | 'gameover') => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const note = (freq: number, startAt: number, dur: number, vol = 0.2, oscType: OscillatorType = 'sine') => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = oscType;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startAt);
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(vol, ctx.currentTime + startAt);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startAt + dur);
      osc.start(ctx.currentTime + startAt);
      osc.stop(ctx.currentTime + startAt + dur);
    };
    if (type === 'catch') {
      note(523, 0, 0.1);
      note(784, 0.05, 0.15);
    } else if (type === 'miss') {
      note(150, 0, 0.4, 0.2, 'sawtooth');
    } else if (type === 'levelup') {
      [523, 659, 784, 1046].forEach((f, i) => note(f, i * 0.1, 0.2));
    } else if (type === 'gameover') {
      [392, 330, 262].forEach((f, i) => note(f, i * 0.15, 0.3));
    }
  } catch (e) {}
};

const CatchTheLetterGame: React.FC<CatchTheLetterGameProps> = ({ onBack }) => {
  const [gameState, setGameState] = useState<'start'|'countdown'|'playing'|'gameover'>('start');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [pointsToNextLevel, setPointsToNextLevel] = useState(5);
  const [highScore, setHighScore] = useState(() => {
    try { return parseInt(localStorage.getItem('kurdish_catch_hi') || '0'); } catch { return 0; }
  });
  const [lives, setLives] = useState(MAX_LIVES);
  const [targetLetter, setTargetLetter] = useState(KURDISH_ALPHABET[0]);
  const [fallingLetters, setFallingLetters] = useState<FallingLetter[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [basketX, setBasketX] = useState(50);
  const [streak, setStreak] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [catchFX, setCatchFX] = useState<{x:number;y:number;label:string;key:number}|null>(null);
  const [screenShake, setScreenShake] = useState(false);
  const [newRecord, setNewRecord] = useState(false);
  const [currentLevelProgress, setCurrentLevelProgress] = useState(0);
  const [theme, setTheme] = useState<'day' | 'sunset' | 'meadow'>('day');

  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number|null>(null);
  const lastSpawnRef = useRef(0);
  const idRef = useRef(0);
  const stateRef = useRef({
    gameState: 'start' as string,
    score: 0,
    lives: MAX_LIVES,
    basketX: 50,
    targetChar: '',
    streak: 0,
    targetLetter: KURDISH_ALPHABET[0],
    level: 1,
    progress: 0,
  });

  useEffect(() => { stateRef.current.gameState = gameState; }, [gameState]);
  useEffect(() => { stateRef.current.score = score; }, [score]);
  useEffect(() => { stateRef.current.lives = lives; }, [lives]);
  useEffect(() => { stateRef.current.basketX = basketX; }, [basketX]);
  useEffect(() => { stateRef.current.streak = streak; }, [streak]);
  useEffect(() => { stateRef.current.level = level; }, [level]);
  useEffect(() => { stateRef.current.progress = currentLevelProgress; }, [currentLevelProgress]);
  useEffect(() => {
    stateRef.current.targetChar = targetLetter.char;
    stateRef.current.targetLetter = targetLetter;
  }, [targetLetter]);

  // Generate background elements once
  const clouds = useMemo(() => Array.from({ length: 7 }, (_, i) => ({
    id: i,
    x: (i * (100 / 6)) + (Math.random() * 10), // More distributed X
    y: 5 + (i * 8) % 40, // More distributed Y
    s: 0.8 + Math.random() * 1.2,
    speed: 0.04 + Math.random() * 0.08,
  })), []);

  const hills = useMemo(() => [
    { id: 1, h: 100, color: '#4ade80', x: -15, delay: 0 },
    { id: 2, h: 140, color: '#22c55e', x: 25, delay: 0.5 },
    { id: 3, h: 120, color: '#16a34a', x: 65, delay: 1 },
    { id: 4, h: 90, color: '#4ade80', x: 85, delay: 1.5 },
  ], []);

  const spawnParticles = useCallback((x: number, y: number) => {
    const ps: Particle[] = Array.from({ length: 14 }, () => ({
      id: ++idRef.current, x, y,
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      angle: Math.random() * 360,
      dist: Math.random() * 80 + 30,
    }));
    setParticles(prev => [...prev, ...ps]);
    setTimeout(() => setParticles(prev => prev.filter(p => !ps.find(n => n.id === p.id))), 900);
  }, []);

  const pickTarget = useCallback(() => {
    const t = KURDISH_ALPHABET[Math.floor(Math.random() * KURDISH_ALPHABET.length)];
    setTargetLetter(t);
    try { new Audio(t.audioUrl).play().catch(() => {}); } catch {}
    return t;
  }, []);

  const spawnLetter = useCallback((target: typeof KURDISH_ALPHABET[0], sc: number) => {
    const isTarget = Math.random() > 0.55;
    const char = isTarget
      ? target.char
      : KURDISH_ALPHABET[Math.floor(Math.random() * KURDISH_ALPHABET.length)].char;
    setFallingLetters(prev => [...prev, {
      id: ++idRef.current, char,
      x: Math.random() * 80 + 10,
      y: -12,
      speed: 0.25 + sc / 250 + Math.random() * 0.1,
      rotation: Math.random() * 20 - 10,
      rotSpeed: (Math.random() - 0.5) * 1.5,
      isTarget,
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
    }]);
  }, []);

  const gameLoop = useCallback((time: number) => {
    const { gameState: gs, score: sc, basketX: bx, targetChar, targetLetter: tl, streak: str, level: currLevel, progress: currProg } = stateRef.current;
    if (gs !== 'playing') return;

    if (time - lastSpawnRef.current > Math.max(1000, 3200 - sc * 15 - currLevel * 100)) {
      spawnLetter(tl, sc);
      lastSpawnRef.current = time;
    }

    let frameScoreGained = 0;
    let frameLivesLost = 0;
    let frameNewStreak = str;
    let frameCatchPos: { x: number; y: number } | null = null;
    let frameLevelUp = false;

    // 1. Move the logic OUT of the functional setter to avoid double-processing side effects
    setFallingLetters(prevLetters => {
      const next: FallingLetter[] = [];
      const updated = prevLetters.map(l => ({ 
        ...l, 
        y: l.y + l.speed, 
        rotation: l.rotation + l.rotSpeed 
      }));

      updated.forEach(l => {
        // Precise collision: Trigger when letter center is inside the basket area
        // Basket rim is at approx y=82. Center at y=86 feels like "inside the middle"
        const caught = l.y > 84 && l.y < 92 && Math.abs(l.x - bx) < 7.5;
        const out = l.y > 104;

        if (caught) {
          if (l.char === targetChar) {
            frameNewStreak++;
            frameScoreGained += 1;
            frameCatchPos = { x: l.x, y: l.y };
          } else {
            frameLivesLost++; // This will be used in the closure, so it's fine as long as we don't increment it again
            frameNewStreak = 0;
          }
        } else if (out) {
          if (l.char === targetChar) {
            frameLivesLost++;
            frameNewStreak = 0;
          }
        } else {
          next.push(l);
        }
      });
      return next;
    });

    // 2. Wrap the side effects to only trigger if we actually had changes
    // This part runs once per frame.
    setTimeout(() => {
      if (frameScoreGained > 0 || frameLivesLost > 0) {
        if (frameScoreGained > 0) {
          setScore(s => s + frameScoreGained);
          setStreak(frameNewStreak);
          const newProg = currProg + frameScoreGained;
          
          if (newProg >= pointsToNextLevel) {
            setPointsToNextLevel(p => p + 2);
            setCurrentLevelProgress(0);
            setLevel(v => v + 1);
            
            const themes: ('day' | 'sunset' | 'meadow')[] = ['day', 'sunset', 'meadow'];
            setTheme(themes[Math.floor(Math.random() * themes.length)]);
            
            playSound('levelup' as any); 
            pickTarget();
          } else {
            setCurrentLevelProgress(newProg);
            playSound('catch');
          }

          if (frameCatchPos) {
            spawnParticles(frameCatchPos.x, frameCatchPos.y);
            setCatchFX({ 
              x: frameCatchPos.x, 
              y: frameCatchPos.y, 
              label: ENCOURAGE_MSGS[Math.floor(Math.random() * ENCOURAGE_MSGS.length)], 
              key: Date.now() 
            });
            setTimeout(() => setCatchFX(null), 1000);
          }
        }

        if (frameLivesLost > 0) {
          setLives(l => {
            const next = Math.max(0, l - frameLivesLost);
            if (next === 0) {
              setGameState('gameover');
              playSound('gameover');
            }
            return next;
          });
          setStreak(0);
          setScreenShake(true);
          playSound('miss');
          if (navigator.vibrate) navigator.vibrate(80);
          setTimeout(() => setScreenShake(false), 400);
        }
      }
    }, 0);

    rafRef.current = requestAnimationFrame(gameLoop);
  }, [spawnLetter, pickTarget, spawnParticles, pointsToNextLevel]);

  useEffect(() => {
    if (gameState === 'playing') rafRef.current = requestAnimationFrame(gameLoop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [gameState, gameLoop]);

  useEffect(() => {
    if (gameState !== 'countdown') return;
    setCountdown(3);
    const iv = setInterval(() => setCountdown(c => {
      if (c <= 1) { clearInterval(iv); setGameState('playing'); return 0; }
      return c - 1;
    }), 750);
    return () => clearInterval(iv);
  }, [gameState]);

  const startGame = () => {
    setScore(0); setLives(MAX_LIVES); setFallingLetters([]); setParticles([]);
    setStreak(0); setNewRecord(false); lastSpawnRef.current = 0;
    setLevel(1); setPointsToNextLevel(5); setCurrentLevelProgress(0);
    pickTarget(); setGameState('countdown');
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current || gameState !== 'playing') return;
    const r = containerRef.current.getBoundingClientRect();
    setBasketX(Math.min(Math.max(((e.clientX - r.left) / r.width) * 100, 7), 93));
  };

  // const level = Math.floor(score / 10) + 1; // Removed deprecated calculation

  const themeStyles = {
    day: { sky: 'linear-gradient(180deg, #87CEEB 0%, #E0F2F1 100%)', border: '#4CAF50', hills: ['#4ade80', '#22c55e', '#16a34a'] },
    sunset: { sky: 'linear-gradient(180deg, #FF7E5F 0%, #FEB47B 100%)', border: '#FF5722', hills: ['#fb923c', '#ea580c', '#9a3412'] },
    meadow: { sky: 'linear-gradient(180deg, #B2FEFA 0%, #0ED2F7 100%)', border: '#00BCD4', hills: ['#86efac', '#4ade80', '#16a34a'] },
  }[theme];

  return (
    <motion.div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      animate={screenShake ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : { x: 0 }}
      transition={{ duration: 0.45 }}
      className="max-w-4xl mx-auto select-none touch-none overflow-hidden rounded-3xl relative"
      style={{
        height: '82vh',
        background: themeStyles.sky,
        border: `8px solid ${themeStyles.border}`,
        boxShadow: '0 0 40px rgba(0,0,0,0.1), inset 0 0 60px rgba(255,255,255,0.4)',
        cursor: 'none',
        transition: 'all 1s ease',
      }}
    >
      {/* ── SUN / ORB ── */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-8 right-8 w-16 h-16 rounded-full blur-[1px]"
        style={{ 
          background: theme === 'sunset' ? '#fde047' : '#facc15',
          boxShadow: `0 0 40px ${theme === 'sunset' ? 'rgba(251,146,60,0.8)' : 'rgba(250,204,21,0.8)'}` 
        }}
      />

      {/* ── CLOUDS ── */}
      {clouds.map(c => (
        <motion.div 
          key={`${theme}-${c.id}`} // Force re-render on theme change for variety
          className="absolute text-white filter drop-shadow-md select-none pointer-events-none"
          initial={{ x: `${c.x}%` }}
          animate={{ x: ['-20%', '120%'] }}
          transition={{ duration: 60 / c.speed, repeat: Infinity, ease: 'linear', delay: -c.x * 2 }}
          style={{ top: `${c.y}%`, fontSize: `${c.s * 3}rem`, opacity: 0.85 }}
        >
          ☁️
        </motion.div>
      ))}

      {/* ── HILLS ── */}
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-[1]">
        {hills.map((h, i) => (
          <motion.div 
            key={h.id} 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="absolute bottom-0 rounded-t-[100%] shadow-lg"
            style={{ 
              left: `${h.x}%`, 
              width: '45%', 
              height: h.h, 
              backgroundColor: themeStyles.hills[i % 3],
              filter: 'brightness(0.95)',
              transition: 'background-color 1s ease, height 1s ease'
            }} 
          />
        ))}
      </div>

      {/* ── HEADER ── */}
      <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-20">
        <button onClick={onBack}
          className="p-2 rounded-full text-white/70 hover:text-white transition"
          style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)' }}>
          <ArrowLeft size={20} />
        </button>

        <div className="bg-white/40 backdrop-blur-md flex items-center gap-3 px-4 py-2 rounded-2xl border border-white/20 shadow-xl">
          <div className="flex items-center gap-1.5 font-bold text-orange-600 text-lg">
            <Star fill="currentColor" size={18} /><span>{score}</span>
          </div>
          <div style={{ width: 1, height: 16, background: 'rgba(0,0,0,0.1)' }} />
          <div className="flex gap-1.5">
            {[...Array(MAX_LIVES)].map((_, i) => (
              <motion.div key={i} animate={i < lives ? { scale: 1 } : { scale: 0.8, opacity: 0.4 }}>
                <Heart size={18} fill={i < lives ? 'currentColor' : 'none'}
                  className={i < lives ? 'text-red-500' : 'text-gray-400'} />
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div key={targetLetter.char}
          initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="text-center px-5 py-2 rounded-2xl shadow-xl"
          style={{
            background: 'linear-gradient(135deg,#FFD93D,#FFA500)',
            border: '3px solid #FFF',
          }}>
          <span className="text-orange-900/60 text-[10px] font-bold block uppercase tracking-wider">بگرە</span>
          <span className="text-orange-900 font-extrabold text-4xl leading-none">{targetLetter.char}</span>
        </motion.div>
      </div>

      {/* ── PROGRESS BAR ── */}
      <div className="absolute top-22 left-1/2 -translate-x-1/2 w-48 h-3 bg-white/30 rounded-full overflow-hidden border border-white/20 shadow-inner z-20">
        <motion.div 
          className="h-full bg-gradient-to-r from-green-400 to-emerald-600"
          animate={{ width: `${(currentLevelProgress / pointsToNextLevel) * 100}%` }}
        />
      </div>

      {/* ── LEVEL ── */}
      {gameState === 'playing' && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 z-10"
          style={{ background: 'rgba(0,0,0,0.1)', borderRadius: 20, padding: '2px 14px' }}>
          <span className="text-emerald-800 font-bold text-xs uppercase tracking-widest">ئاست {level}</span>
        </div>
      )}

      {/* ── FALLING LETTERS ── */}
      {fallingLetters.map(l => (
        <div key={l.id} className="absolute pointer-events-none z-[8]"
          style={{ left: `${l.x}%`, top: `${l.y}%`, transform: `translate(-50%,-50%) rotate(${l.rotation}deg)` }}>
          {l.isTarget ? (
            <div className="relative">
              <div className="absolute inset-0 rounded-full animate-ping"
                style={{ background: 'rgba(99,120,255,0.3)', transform: 'scale(1.6)', animationDuration: '1.2s' }} />
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold"
                style={{
                  background: 'linear-gradient(135deg,#7c5cfc,#4a2fd6)',
                  border: '3px solid rgba(200,180,255,0.8)',
                  boxShadow: '0 0 25px rgba(120,90,255,0.8), inset 0 1px 0 rgba(255,255,255,0.3)',
                  color: 'white',
                }}>
                {l.char}
              </div>
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg"
              style={{
                background: l.color,
                border: `3px solid rgba(255,255,255,0.4)`,
                color: `white`,
              }}>
              {l.char}
            </div>
          )}
        </div>
      ))}

      {/* ── PARTICLES ── */}
      {particles.map(p => (
        <motion.div key={p.id} className="absolute rounded-full pointer-events-none"
          style={{ width: 8, height: 8, left: `${p.x}%`, top: `${p.y}%`, background: p.color, boxShadow: `0 0 6px ${p.color}` }}
          initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          animate={{ opacity: 0, scale: 0, x: `${Math.cos(p.angle * Math.PI / 180) * p.dist}px`, y: `${Math.sin(p.angle * Math.PI / 180) * p.dist}px` }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
        />
      ))}

      {/* ── CATCH FX ── */}
      <AnimatePresence mode="popLayout">
        {catchFX && (
          <motion.div key={catchFX.key} className="absolute pointer-events-none z-50 font-black text-3xl"
            style={{ 
              left: `${catchFX.x}%`, 
              top: `${catchFX.y - 8}%`, 
              transform: 'translateX(-50%)', 
              color: '#FF6B6B', 
              textShadow: '2px 2px 0 #FFF, -2px -2px 0 #FFF, 2px -2px 0 #FFF, -2px 2px 0 #FFF, 0 5px 15px rgba(0,0,0,0.1)' 
            }}
            initial={{ opacity: 0, y: 20, scale: 0.5, rotate: -10 }} 
            animate={{ opacity: [0, 1, 1, 0], y: -100, scale: 1.2, rotate: 10 }}
            transition={{ duration: 1.2, ease: 'backOut' }}>
            {catchFX.label}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── GROUND ── */}
      <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none z-[10]" style={{ background: '#38a169', borderTop: '4px solid #2f855a' }}>
        <div className="flex justify-around items-end h-full px-4 pt-1 opacity-40">
           {[...Array(8)].map((_, i) => (
             <span key={i} className="text-2xl">🌱</span>
           ))}
        </div>
      </div>

      {/* ── BASKET ── */}
      <motion.div className="absolute pointer-events-none z-[15]"
        style={{ bottom: '10%', left: `${basketX}%`, x: '-50%' }}>
        <motion.div 
          className="text-6xl text-center mb-1" 
          animate={streak > 0 ? { y: [0, -10, 0], rotate: [0, -5, 5, 0] } : {}}
        >
          🐥
        </motion.div>
        <div className="w-[120px] h-[60px] bg-amber-700 rounded-b-3xl rounded-t-lg shadow-xl relative overflow-hidden"
          style={{ border: '4px solid #92400e', background: 'repeating-linear-gradient(45deg, #d97706, #d97706 10px, #b45309 10px, #b45309 20px)' }}>
          <div className="absolute top-0 left-0 right-0 h-2 bg-amber-900/30" />
        </div>
      </motion.div>

      {/* ══ START SCREEN ══ */}
      <AnimatePresence>
        {gameState === 'start' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(4,2,20,0.88)', backdropFilter: 'blur(10px)' }}>
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', bounce: 0.35, delay: 0.1 }}
              className="text-center px-8 py-10 rounded-3xl max-w-sm w-full mx-4"
              style={{
                background: 'linear-gradient(145deg,rgba(40,20,120,0.95),rgba(20,10,70,0.95))',
                border: '2px solid rgba(130,100,255,0.4)',
                boxShadow: '0 0 60px rgba(80,40,255,0.3)',
              }}>
              <motion.div animate={{ rotate: [0, 10, -10, 8, -8, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="text-7xl mb-4">🎯</motion.div>
              <h2 className="text-3xl font-bold text-white mb-2" style={{ textShadow: '0 0 20px rgba(160,130,255,0.8)' }}>
                نێچیرا پیتان
              </h2>
              <p className="text-purple-200 text-sm mb-1">
                پیتا <span className="text-yellow-300 font-bold text-xl">{targetLetter.char}</span> بگرە!
              </p>
              <p className="text-purple-300/70 text-xs mb-5">{targetLetter.name} — {targetLetter.exampleWord}</p>
              {highScore > 0 && (
                <div className="flex items-center justify-center gap-2 text-yellow-300 text-sm py-2 px-4 rounded-xl mb-5"
                  style={{ background: 'rgba(255,210,0,0.1)', border: '1px solid rgba(255,210,0,0.2)' }}>
                  <Trophy size={14} /> باشترین: {highScore}
                </div>
              )}
              <motion.button onClick={startGame} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                className="w-full py-4 rounded-2xl font-bold text-xl text-white"
                style={{
                  background: 'linear-gradient(135deg,#7c5cfc,#4a2fd6)',
                  boxShadow: '0 6px 0 #2a1490, 0 0 30px rgba(120,90,255,0.5)',
                  border: '1px solid rgba(200,180,255,0.3)',
                }}>
                <span className="flex items-center justify-center gap-2">
                  <Play fill="currentColor" size={20} /> دەستپێبکە
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* ══ COUNTDOWN ══ */}
        {gameState === 'countdown' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(4,2,20,0.65)' }}>
            <AnimatePresence mode="wait">
              <motion.div key={countdown}
                initial={{ scale: 2.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.3, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{ fontSize: 140, fontWeight: 900, color: 'white', lineHeight: 1, textShadow: '0 0 60px rgba(120,100,255,1)' }}>
                {countdown > 0 ? countdown : '🚀'}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        {/* ══ GAME OVER ══ */}
        {gameState === 'gameover' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(4,2,20,0.88)', backdropFilter: 'blur(10px)' }}>
            <motion.div initial={{ y: 40, opacity: 0, scale: 0.85 }} animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ type: 'spring', bounce: 0.4, delay: 0.1 }}
              className="text-center px-8 py-10 rounded-3xl max-w-sm w-full mx-4"
              style={{
                background: 'linear-gradient(145deg,rgba(40,20,120,0.95),rgba(20,10,70,0.95))',
                border: `2px solid ${newRecord ? 'rgba(255,210,0,0.6)' : 'rgba(130,100,255,0.4)'}`,
                boxShadow: `0 0 60px ${newRecord ? 'rgba(255,180,0,0.3)' : 'rgba(80,40,255,0.3)'}`,
              }}>
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <Trophy size={64} className="text-yellow-400 mx-auto mb-3" />
              </motion.div>
              {newRecord && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.3 }}
                  className="text-yellow-300 text-sm font-bold mb-2">🎉 تۆمارا نوێ!</motion.div>
              )}
              <h2 className="text-2xl font-bold text-white mb-1">دەم ب دوماهی هات!</h2>
              <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
                className="text-6xl font-bold text-yellow-300 mb-1">{score}</motion.div>
              <p className="text-purple-300 text-xs mb-4">باشترین: {highScore}</p>
              <div className="flex justify-center gap-3 mb-7">
                {[5, 10, 15].map((t, i) => (
                  <motion.div key={i} initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', delay: 0.4 + i * 0.15 }}>
                    <Star size={34} fill={score >= t ? 'currentColor' : 'none'}
                      className={score >= t ? 'text-yellow-400' : 'text-white/15'} />
                  </motion.div>
                ))}
              </div>
              <div className="space-y-3">
                <motion.button onClick={startGame} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="w-full py-3 rounded-2xl font-bold text-white"
                  style={{ background: 'linear-gradient(135deg,#7c5cfc,#4a2fd6)', boxShadow: '0 4px 0 #2a1490' }}>
                  <span className="flex items-center justify-center gap-2">
                    <RotateCcw size={18} /> دوبارە بکە
                  </span>
                </motion.button>
                <button onClick={onBack}
                  className="w-full py-3 rounded-2xl font-bold text-purple-300 hover:text-white transition"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  زڤرین بۆ لیستی
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes twinkle {
          0%,100% { opacity:0.3; transform:scale(1); }
          50% { opacity:1; transform:scale(1.5); }
        }
        .cloud-anim {
          animation: cloudFloating 60s linear infinite;
        }
        @keyframes cloudFloating {
          from { transform: translateX(-150%); }
          to { transform: translateX(500%); }
        }
      `}</style>
    </motion.div>
  );
};

export default CatchTheLetterGame;