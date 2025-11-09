import { useState, useEffect, useRef, useCallback } from 'react';

interface TimerOptions {
  initialTime: number;
  onEnd: () => void;
  onFiveMinutes: () => void;
  enabled: boolean;
}

export const useTimer = ({ initialTime, onEnd, onFiveMinutes, enabled }: TimerOptions) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  // FIX: Replaced NodeJS.Timeout with ReturnType<typeof setInterval> for browser compatibility.
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onEndRef = useRef(onEnd);
  const onFiveMinutesRef = useRef(onFiveMinutes);

  onEndRef.current = onEnd;
  onFiveMinutesRef.current = onFiveMinutes;

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prevTime => {
          if (prevTime <= 1) {
            stopTimer();
            onEndRef.current();
            return 0;
          }
          if (prevTime === 301) { // 5 minutes = 300s. Fire at 301 to ensure it triggers before 300.
            onFiveMinutesRef.current();
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      stopTimer();
    }

    return () => stopTimer();
  }, [enabled, stopTimer]);
  
  const resetTimer = (newTime: number) => {
    stopTimer();
    setTimeRemaining(newTime);
  };

  return { timeRemaining, resetTimer };
};
