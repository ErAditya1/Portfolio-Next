"use client";

import { useState, useEffect } from "react";

interface DynamicBioTextProps {
  text: string;
  speed?: number;
  className?: string;
  cursorClassName?: string;
}

export function DynamicBioText({
  text,
  speed = 18,
  className = "",
  cursorClassName = "",
}: DynamicBioTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Respect reduced motion accessibility setting
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setDisplayedText(text);
      setIsComplete(true);
      return;
    }

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className={`inline ${className}`}>
      <span>{displayedText}</span>
      <span
        aria-hidden="true"
        className={`inline-block ml-1 w-[2px] h-[1em] bg-indigo-500 align-middle ${
          isComplete ? "animate-pulse" : "opacity-100"
        } ${cursorClassName}`}
      />
    </span>
  );
}
