import { useState, useEffect, useCallback } from 'react';

export const useCountdown = (initialTime = 60) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) {
      if (timeLeft <= 0) setIsActive(false);
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [isActive, timeLeft]);

  const reset = useCallback((newTime = initialTime) => {
    setTimeLeft(newTime);
    setIsActive(true);
  }, [initialTime]);

  return { timeLeft, isActive, reset };
};
