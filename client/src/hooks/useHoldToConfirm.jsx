import { useState, useRef, useCallback } from 'react';

export const useHoldToConfirm = (onConfirm, holdDuration = 2500) => {
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const progressIntervalRef = useRef(null);
  const decreaseIntervalRef = useRef(null);
  const hasExecutedRef = useRef(false); // Add this to prevent double execution

  const clearHoldOperation = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    if (decreaseIntervalRef.current) {
      clearInterval(decreaseIntervalRef.current);
      decreaseIntervalRef.current = null;
    }
    setHoldProgress(0);
    setIsHolding(false);
    setIsCompleted(false);
    hasExecutedRef.current = false; // Reset execution flag
  }, []);

  const startDecreaseProgress = useCallback(() => {
    if (decreaseIntervalRef.current) {
      clearInterval(decreaseIntervalRef.current);
    }
    
    decreaseIntervalRef.current = setInterval(() => {
      setHoldProgress((prev) => {
        if (prev <= 0) {
          clearInterval(decreaseIntervalRef.current);
          decreaseIntervalRef.current = null;
          return 0;
        }
        return prev - 2; // Decrease by 2% every 50ms
      });
    }, 50);
  }, []);

  const handleStart = useCallback(() => {
    if (isCompleted || hasExecutedRef.current) return; // Prevent starting if already executed
    
    setIsHolding(true);
    
    // Clear any ongoing decrease
    if (decreaseIntervalRef.current) {
      clearInterval(decreaseIntervalRef.current);
      decreaseIntervalRef.current = null;
    }

    // Calculate increment based on hold duration
    const increment = (100 / holdDuration) * 100; // 100ms intervals

    // Progress animation
    progressIntervalRef.current = setInterval(() => {
      setHoldProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
          setIsCompleted(true);
          setIsHolding(false);
          
          // Prevent double execution
          if (!hasExecutedRef.current) {
            hasExecutedRef.current = true;
            // Execute callback when 100% is reached
            setTimeout(() => {
              onConfirm();
              // Don't clear immediately, let the parent handle the cleanup
            }, 100);
          }
          return 100;
        }
        return prev + increment;
      });
    }, 100);
  }, [isCompleted, holdDuration, onConfirm]);

  const handleEnd = useCallback(() => {
    if (isCompleted || hasExecutedRef.current) return; // Prevent ending if already executed
    
    setIsHolding(false);
    
    // Clear progress interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    
    // Start decrease only if progress > 0
    if (holdProgress > 0) {
      startDecreaseProgress();
    }
  }, [isCompleted, holdProgress, startDecreaseProgress]);

  const reset = useCallback(() => {
    clearHoldOperation();
  }, [clearHoldOperation]);

  return {
    holdProgress,
    isHolding,
    isCompleted,
    handleStart,
    handleEnd,
    reset,
    clearHoldOperation
  };
};