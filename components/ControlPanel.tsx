"use client";

import { GuessResult } from "@/lib/types";

interface ControlPanelProps {
  result: GuessResult | null;
  isLoading: boolean;
  error: string | null;
}

export default function ControlPanel({ result, isLoading, error }: ControlPanelProps) {
  return (
    <div className="flex flex-col gap-6 p-6 bg-surface rounded-lg border-2 border-border h-fit">
      <div className="text-center">
        <h2 className="text-xl font-bold text-primary flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/>
            <path d="M8.5 8.5v.01"/>
            <path d="M16 15.5v.01"/>
            <path d="M12 12v.01"/>
            <path d="M11 17v.01"/>
            <path d="M7 14v.01"/>
          </svg>
          AI 猜测结果
        </h2>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-border rounded-full"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-text-secondary text-sm">AI 正在识别你的画作...</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-error/10 border border-error/30 rounded-lg">
          <p className="text-error text-sm text-center">{error}</p>
        </div>
      )}

      {result && !isLoading && (
        <div className="flex flex-col gap-4">
          <div className="text-center">
            <p className="text-text-secondary text-sm mb-2">AI 认为是:</p>
            <p className="text-2xl font-bold text-secondary text-center">{result.guess}</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">置信度</span>
              <span className="text-primary font-medium">{result.confidence}%</span>
            </div>
            <div className="h-3 bg-background rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  result.confidence >= 80 
                    ? "bg-primary" 
                    : result.confidence >= 50 
                      ? "bg-secondary" 
                      : "bg-error"
                }`}
                style={{ width: `${result.confidence}%` }}
              />
            </div>
          </div>

          {result.confidence >= 80 && (
            <div className="text-center p-3 bg-primary/10 border border-primary/30 rounded-lg">
              <p className="text-primary text-sm font-medium">🎉 太棒了！AI 很有把握！</p>
            </div>
          )}
        </div>
      )}

      {!result && !isLoading && !error && (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary">
              <path d="M12 19l7-7 3 3-7 7-3-3z"/>
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
              <path d="M2 2l7.586 7.586"/>
              <circle cx="11" cy="11" r="2"/>
            </svg>
          </div>
          <p className="text-text-secondary text-sm">
            画点什么，然后点击&quot;提交猜测&quot;让 AI 猜猜看！
          </p>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-text-secondary text-center">
          按 Enter 快速提交
        </p>
      </div>
    </div>
  );
}
