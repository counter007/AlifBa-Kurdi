
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ChatMessage, KurdishLetter, UserTheme } from '../types';

interface AiAssistantProps {
  currentLetter?: KurdishLetter;
  theme?: UserTheme | null;
}

const AiAssistant: React.FC<AiAssistantProps> = ({ currentLetter, theme }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const themeColors = {
    primary: theme === 'girl' ? 'text-pink-800' : 'text-blue-800',
    bubble: theme === 'girl' ? 'bg-pink-100 text-pink-900' : 'bg-blue-100 text-blue-900',
    button: theme === 'girl' ? 'bg-pink-600 hover:bg-pink-700' : 'bg-blue-600 hover:bg-blue-700',
    inputBorder: theme === 'girl' ? 'border-pink-200 focus:border-pink-400' : 'border-blue-200 focus:border-blue-400',
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const keys = [
      process.env.GEMINI_API_KEY,
      process.env.GEMINI_API_KEY_2,
      process.env.GEMINI_API_KEY_3,
      process.env.API_KEY
    ].filter(Boolean) as string[];

    if (keys.length === 0) {
      setMessages(prev => [...prev, { role: 'model', text: "ئاریشەیەک هەبوو: کلیلێ API نەدیارە. (API Key missing.)" }]);
      setIsTyping(false);
      return;
    }

    let success = false;
    for (const apiKey of keys) {
      if (success) break;
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `Hûn mamosteyekî kurdî yê bi zaravayê Badînî (Behdîni) ne. 
          Bi tenê bi zaravayê Badînî û bi tîpên erebî (ئەلفبێی ئارامی) bersiv bidin.
          Current letter context: ${currentLetter ? currentLetter.char + ' (' + currentLetter.name + ')' : 'None'}.
          User asks: ${input}. 
          Bersivên we bila kurt, hander û bi zaravayێ devera Behdînan bin.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
          config: {
            systemInstruction: "Tu mamosteyekî دلۆڤان و زیرەک یێ زمانێ کوردی ب زارۆڤێ بادینی يی. تو دێ ب شێوازەکێ سادە و خۆش دگەل زارۆکان ئاخڤی. هەمی بەرسڤێن تە دێ ب کوردییا بادینی بن.",
            temperature: 0.7,
          }
        });

        const aiText = response.text || "ببورە، من فێم نەکرد. (ببۆره‌، من نه‌زانی)";
        setMessages(prev => [...prev, { role: 'model', text: aiText }]);
        success = true;
      } catch (error) {
        console.warn("API Key failed in Assistant, trying next...");
      }
    }

    if (!success) {
      setMessages(prev => [...prev, { role: 'model', text: "ئاریشەیەک د پەیوەندیێ دا هەبوو دگەل ماموستای. (Connection error with AI Teacher.)" }]);
    }
    setIsTyping(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 flex flex-col h-[350px] md:h-[400px]">
      <h3 className={`text-xl font-bold ${themeColors.primary} mb-2 border-b pb-2 flex items-center gap-2`}>
        <span className="text-2xl">🎓</span> مامۆستایێ زیرەک (AI Teacher)
      </h3>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 p-2"
      >
        {messages.length === 0 && (
          <p className="text-gray-500 text-center italic mt-4">
            پرسيارێن خوە ل سەر پيتان بکە! (Ask in Badini!)
          </p>
        )}
        {messages.map((m, i) => (
          <div 
            key={i} 
            className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}
          >
            <div 
              className={`max-w-[80%] p-3 rounded-2xl ${
                m.role === 'user' 
                  ? `${themeColors.bubble} rounded-tr-none` 
                  : 'bg-green-100 text-green-900 rounded-tl-none'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="text-left text-gray-400 animate-pulse">مامۆستا دنڤيسيت...</div>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="تشتەکی بپرسە..."
          className={`flex-1 border-2 ${themeColors.inputBorder} rounded-full px-4 py-2 focus:outline-none`}
        />
        <button 
          onClick={handleSend}
          className={`${themeColors.button} text-white p-2 rounded-full w-10 h-10 flex items-center justify-center shadow-md`}
        >
          ➜
        </button>
      </div>
    </div>
  );
};

export default AiAssistant;
