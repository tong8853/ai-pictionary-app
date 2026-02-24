"use client";

import { useRef, useEffect, useState, useCallback } from "react";

interface CanvasProps {
  onSubmit: (imageData: string, accessCode: string) => void;
  isLoading: boolean;
}

export default function Canvas({ onSubmit, isLoading }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasContent, setHasContent] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [accessError, setAccessError] = useState("");
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      
      ctx.scale(dpr, dpr);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#00ff88";
      ctx.lineWidth = 4;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const getCoordinates = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  }, []);

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (isLoading) return;
    e.preventDefault();
    
    const coords = getCoordinates(e);
    lastPos.current = coords;
    setIsDrawing(true);
    setHasContent(true);
  }, [getCoordinates, isLoading]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || isLoading) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    const coords = getCoordinates(e);
    
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    
    lastPos.current = coords;
  }, [isDrawing, getCoordinates, isLoading]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    setHasContent(false);
  }, []);

  const submitGuess = useCallback(() => {
    if (!accessCode.trim()) {
      setAccessError("请输入访问码");
      return;
    }
    setAccessError("");
    
    const canvas = canvasRef.current;
    if (!canvas || !hasContent || isLoading) return;

    const imageData = canvas.toDataURL("image/png");
    onSubmit(imageData, accessCode);
  }, [hasContent, isLoading, onSubmit, accessCode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && hasContent && !isLoading) {
        submitGuess();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasContent, isLoading, submitGuess]);

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="relative flex-1 bg-canvas rounded-lg border-2 border-border overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 touch-none cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        {!hasContent && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-text-secondary text-sm">在这里绘画...</p>
          </div>
        )}
      </div>
      
      <div>
        <input
          type="password"
          value={accessCode}
          onChange={(e) => {
            setAccessCode(e.target.value);
            setAccessError("");
          }}
          placeholder="请输入访问码"
          className="w-full px-4 py-3 bg-surface border-2 border-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary transition-colors"
        />
        {accessError && (
          <p className="text-error text-sm mt-1">{accessError}</p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={clearCanvas}
          disabled={!hasContent || isLoading}
          className="flex-1 px-4 py-3 bg-surface border-2 border-primary text-primary rounded-lg font-medium transition-all duration-200 hover:bg-primary/10 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18"/>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
          </svg>
          清空
        </button>
        <button
          onClick={submitGuess}
          disabled={!hasContent || isLoading}
          className="flex-1 px-4 py-3 bg-primary text-background rounded-lg font-medium transition-all duration-200 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              识别中...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              提交猜测
            </>
          )}
        </button>
      </div>
    </div>
  );
}
