
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

interface ExampleImageProps {
  word: string;
  translation: string;
  customUrl?: string;
  searchKeyword?: string;
}

const ExampleImage: React.FC<ExampleImageProps> = ({ word, translation, customUrl, searchKeyword }) => {
  const [error, setError] = useState(false);

  // Use searchKeyword if provided, otherwise fallback to translation
  const searchTerm = searchKeyword || translation;
  
  // Improve search query with descriptive tags if no manual URL is provided
  // We use lowercase and remove special characters for better matching
  const query = searchTerm.toLowerCase().replace(/[^a-z0-9]/g, ',');
  const localUrl = searchKeyword ? `/images/${searchKeyword.toLowerCase().replace(/\s+/g, '_')}.png` : null;
  const fallbackUrl = `https://loremflickr.com/300/300/${query},cartoon,illustration/all`;
  
  // State to track if local image fails
  const [useFallback, setUseFallback] = useState(false);
  const imageUrl = customUrl || (localUrl && !useFallback ? localUrl : fallbackUrl);

  return (
    <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-2xl border-2 border-blue-100 shadow-inner flex items-center justify-center overflow-hidden relative group shrink-0">
      <img 
        src={imageUrl} 
        alt={word} 
        onError={() => {
          if (imageUrl === localUrl) {
            setUseFallback(true);
          } else {
            setError(true);
          }
        }}
        className="w-full h-full object-cover animate-in fade-in duration-500" 
      />
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-300 text-4xl">
          🖼️
        </div>
      )}
    </div>
  );
};

export default ExampleImage;
