"use client";

import { useState } from "react";
import Canvas from "@/components/Canvas";
import ControlPanel from "@/components/ControlPanel";
import ConfettiWrapper from "@/components/ConfettiWrapper";
import { GuessResult } from "@/lib/types";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GuessResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleSubmit = async (imageData: string) => {
    setIsLoading(true);
    setError(null);
    setShowConfetti(false);

    try {
      const response = await fetch("/api/guess", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageData }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get prediction");
      }

      setResult(data);

      if (data.confidence >= 80) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ConfettiWrapper trigger={showConfetti} />
      
      <header className="h-16 px-6 flex items-center justify-center border-b border-border bg-surface/50 backdrop-blur-sm sticky top-0 z-10">
        <h1 className="text-xl font-bold text-primary flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19l7-7 3 3-7 7-3-3z"/>
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
            <path d="M2 2l7.586 7.586"/>
            <circle cx="11" cy="11" r="2"/>
          </svg>
          AI Pictionary
          <span className="text-xs text-text-secondary font-normal px-2 py-1 bg-background rounded">
            你画我猜
          </span>
        </h1>
      </header>

      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <div className="lg:col-span-2 h-full min-h-[400px]">
              <Canvas onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
            <div className="lg:col-span-1">
              <ControlPanel result={result} isLoading={isLoading} error={error} />
            </div>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-text-secondary text-xs border-t border-border">
        <p>Powered by Gemini 2.0 Flash</p>
      </footer>
    </div>
  );
}
