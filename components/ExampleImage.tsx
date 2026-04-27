
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
  const fallbackUrl = `https://loremflickr.com/300/300/${query},cartoon,illustration/all`;
  
  const imageUrl = customUrl || fallbackUrl;

  return (
    <div className="w-32 h-32 bg-white rounded-2xl border-2 border-blue-100 shadow-inner flex items-center justify-center overflow-hidden relative group">
      <img 
        src={imageUrl} 
        alt={word} 
        onError={() => setError(true)}
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
