import React, { useState, useRef, useEffect } from 'react';
import { Music, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { BACKGROUND_MUSIC_TRACKS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

const BackgroundMusic: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.15); // Default low volume
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = BACKGROUND_MUSIC_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(err => {
        console.log("Autoplay blocked or audio missing:", err);
        setIsPlaying(false);
      });
    }
  }, [currentTrackIndex]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.log("Error playing audio:", err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % BACKGROUND_MUSIC_TRACKS.length);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + BACKGROUND_MUSIC_TRACKS.length) % BACKGROUND_MUSIC_TRACKS.length);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-end gap-3 group">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        loop
        onEnded={nextTrack}
      />
      
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.9 }}
            className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-2xl border-2 border-purple-200 flex items-center gap-3 mb-2"
          >
            <button
              onClick={prevTrack}
              className="p-2 hover:bg-purple-100 rounded-full transition-colors text-purple-600"
              title="Previous"
            >
              <SkipBack size={20} />
            </button>
            
            <button
              onClick={togglePlay}
              className="p-3 bg-purple-600 hover:bg-purple-700 rounded-full transition-all shadow-lg text-white transform active:scale-95"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
            </button>
            
            <button
              onClick={nextTrack}
              className="p-2 hover:bg-purple-100 rounded-full transition-colors text-purple-600"
              title="Next"
            >
              <SkipForward size={20} />
            </button>

            <div className="h-8 w-px bg-purple-100 mx-1" />

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 hover:bg-purple-100 rounded-full transition-colors text-purple-500"
            >
              {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            
            <input
              type="range"
              min="0"
              max="0.5"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                setIsMuted(false);
              }}
              className="w-20 h-1.5 bg-purple-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowControls(!showControls)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all border-4 ${
          isPlaying 
            ? 'bg-purple-600 border-purple-300 text-white animate-pulse' 
            : 'bg-white border-purple-200 text-purple-400'
        }`}
      >
        <Music size={28} />
      </motion.button>
    </div>
  );
};

export default BackgroundMusic;
