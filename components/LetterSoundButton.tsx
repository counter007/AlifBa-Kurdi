
import React, { useState } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";

interface LetterSoundButtonProps {
  char: string;
  name: string;
}

const LetterSoundButton: React.FC<LetterSoundButtonProps> = ({ char, name }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Manual base64 decode as per instructions
  const decodeBase64 = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  // Manual PCM decoding logic as per instructions
  const decodeAudioData = async (
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const playSound = async () => {
    if (isPlaying || isLoading) return;
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Say only the phonetic sound of the Kurdish character "${char}" once, clearly and slowly. Do not say any other words.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' }, // 'Kore' is friendly
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        setIsLoading(false);
        setIsPlaying(true);
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const bytes = decodeBase64(base64Audio);
        const audioBuffer = await decodeAudioData(bytes, audioContext, 24000, 1);
        
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.onended = () => setIsPlaying(false);
        source.start();
      } else {
        setIsLoading(false);
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("TTS failed:", error);
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  return (
    <button
      onClick={playSound}
      disabled={isLoading || isPlaying}
      className={`p-4 rounded-full shadow-lg transition-all transform hover:scale-110 active:scale-90 flex items-center justify-center
        ${isLoading ? 'bg-yellow-100 ring-4 ring-yellow-300' : 
          isPlaying ? 'bg-blue-100 ring-4 ring-blue-300' : 'bg-pink-400 hover:bg-pink-500 text-white'}`}
      aria-label="Listen to letter sound"
    >
      <span className={`text-2xl ${isPlaying || isLoading ? 'animate-bounce' : ''}`}>
        {isLoading ? '⏳' : isPlaying ? '🎵' : '🔊'}
      </span>
    </button>
  );
};

export default LetterSoundButton;
