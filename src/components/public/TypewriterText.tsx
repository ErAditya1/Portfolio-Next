"use client";

import { useState, useEffect } from "react";

interface TypewriterTextProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
  textClassName?: string;
  cursorClassName?: string;
}

export function TypewriterText({
  words,
  typingSpeed = 65,
  deletingSpeed = 30,
  pauseDuration = 2200,
  className = "",
  textClassName = "",
  cursorClassName = "",
}: TypewriterTextProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // If reduced motion is requested, render static first word
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setCurrentText(words[0] || "");
      return;
    }

    const currentTarget = words[currentWordIndex] || "";
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      // Typing forward
      if (currentText.length < currentTarget.length) {
        timeout = setTimeout(() => {
          setCurrentText(currentTarget.slice(0, currentText.length + 1));
        }, typingSpeed);
      } else {
        // Finished typing word, wait before deleting
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      // Backspacing
      if (currentText.length > 0) {
        timeout = setTimeout(() => {
          setCurrentText(currentTarget.slice(0, currentText.length - 1));
        }, deletingSpeed);
      } else {
        // Finished deleting, move to next word
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className={`inline-flex items-center ${className}`}>
      <span className={textClassName}>{currentText}</span>
      <span
        aria-hidden="true"
        className={`inline-block ml-1 w-[3px] h-[0.9em] bg-indigo-500 rounded-full animate-pulse align-middle ${cursorClassName}`}
      />
    </span>
  );
}
