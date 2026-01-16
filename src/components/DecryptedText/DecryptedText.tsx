import { useState, useEffect } from 'react';

interface DecryptedTextProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
const REVEAL_PROBABILITY = 0.3;
const PROGRESS_PROBABILITY = 0.7;

const DecryptedText = ({
  text,
  speed = 50,
  className = '',
  onComplete,
}: DecryptedTextProps) => {
  const [displayText, setDisplayText] = useState<string>('');
  const [isDecrypting, setIsDecrypting] = useState(true);
  const [revealedIndex, setRevealedIndex] = useState(0);

  useEffect(() => {
    setDisplayText('');
    setRevealedIndex(0);
    setIsDecrypting(true);
  }, [text]);

  useEffect(() => {
    if (!isDecrypting || revealedIndex >= text.length) {
      if (revealedIndex >= text.length && isDecrypting) {
        setIsDecrypting(false);
        setDisplayText(text);
        onComplete?.();
      }
      return;
    }

    const interval = setInterval(() => {
      const revealed = text.slice(0, revealedIndex);
      const remaining = text.slice(revealedIndex);
      const scrambled = remaining
        .split('')
        .map((char, index) => {
          if (index === 0) {
            return Math.random() > REVEAL_PROBABILITY 
              ? text[revealedIndex] 
              : CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
          }
          return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
        })
        .join('');

      setDisplayText(revealed + scrambled);

      if (Math.random() > PROGRESS_PROBABILITY || revealedIndex === 0) {
        setRevealedIndex((prev) => prev + 1);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, revealedIndex, isDecrypting, onComplete]);

  const initialText = text.split('').map(() => 
    CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]
  ).join('');

  return (
    <span className={`font-mono ${className}`} style={{ fontFamily: 'monospace' }}>
      {displayText || initialText}
    </span>
  );
};

export default DecryptedText;
