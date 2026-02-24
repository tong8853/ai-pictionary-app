"use client";

import { useEffect, useState } from "react";
import Confetti from "react-confetti";

interface ConfettiWrapperProps {
  trigger: boolean;
}

export default function ConfettiWrapper({ trigger }: ConfettiWrapperProps) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!trigger) return null;

  return (
    <Confetti
      width={windowSize.width}
      height={windowSize.height}
      recycle={false}
      numberOfPieces={200}
      gravity={0.2}
      colors={["#00ff88", "#00d4ff", "#ff4757", "#ffd700", "#ff69b4"]}
    />
  );
}
