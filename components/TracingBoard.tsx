
import React, { useRef, useEffect, useState, useCallback } from 'react';

interface TracingBoardProps {
  letter: string;
  onComplete?: () => void;
}

const COLORS = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Pink', value: '#f472b6' },
  { name: 'Green', value: '#10b981' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Orange', value: '#f59e0b' },
];

const TracingBoard: React.FC<TracingBoardProps> = ({ letter, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [brushColor, setBrushColor] = useState(COLORS[0].value);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.lineWidth = 12;
        context.strokeStyle = brushColor;
        setCtx(context);
        drawBackground(context, canvas.width, canvas.height);
      }
    }
  }, [letter]);

  useEffect(() => {
    if (ctx) {
      ctx.strokeStyle = brushColor;
    }
  }, [brushColor, ctx]);

  const drawBackground = (c: CanvasRenderingContext2D, w: number, h: number) => {
    c.clearRect(0, 0, w, h);
    c.fillStyle = '#ffffff';
    c.fillRect(0, 0, w, h);
    
    // Guidelines
    c.strokeStyle = '#e5e7eb';
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(0, h * 0.25); c.lineTo(w, h * 0.25);
    c.moveTo(0, h * 0.5); c.lineTo(w, h * 0.5);
    c.moveTo(0, h * 0.75); c.lineTo(w, h * 0.75);
    c.stroke();

    // Large letter in background
    c.font = 'bold 200px Vazirmatn';
    c.fillStyle = '#f3f4f6';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText(letter, w / 2, h / 2);
    
    // Reset brush settings
    c.strokeStyle = '#3b82f6';
    c.lineWidth = 10;
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const pos = getPos(e);
    ctx?.beginPath();
    ctx?.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !ctx) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    ctx?.closePath();
  };

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const clear = () => {
    if (ctx && canvasRef.current) {
      drawBackground(ctx, canvasRef.current.width, canvasRef.current.height);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-2 mb-4">
        {COLORS.map((color) => (
          <button
            key={color.value}
            onClick={() => setBrushColor(color.value)}
            className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${brushColor === color.value ? 'border-gray-800 scale-125' : 'border-transparent'}`}
            style={{ backgroundColor: color.value }}
            title={color.name}
          />
        ))}
      </div>
      
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="border-4 border-blue-200 rounded-3xl shadow-inner cursor-crosshair touch-none bg-white"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      
      <div className="flex gap-4 mt-6">
        <button
          onClick={clear}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-300 transition-colors"
        >
          فڕێبدە (Clear)
        </button>
        <button
          onClick={() => {
            if (onComplete) onComplete();
          }}
          className="px-8 py-2 bg-green-500 text-white rounded-full font-bold hover:bg-green-600 transition-colors shadow-lg flex items-center gap-2"
        >
          <span>✨</span> من بدووماهیک ئینا  (Done!)
        </button>
      </div>
    </div>
  );
};

export default TracingBoard;
