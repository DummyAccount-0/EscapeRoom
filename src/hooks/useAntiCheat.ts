import { useEffect, useCallback, useRef } from 'react';

export const useAntiCheat = (onTabSwitch: () => void) => {
  const resetTimeoutRef = useRef<number | null>(null);
  const isResettingRef = useRef(false);

  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === 'hidden' && !isResettingRef.current) {
      isResettingRef.current = true;
      
      // Clear any existing timeout
      if (resetTimeoutRef.current) {
        window.clearTimeout(resetTimeoutRef.current);
      }
      
      // Set a new timeout
      resetTimeoutRef.current = window.setTimeout(() => {
        onTabSwitch();
        isResettingRef.current = false;
      }, 500);
    }
  }, [onTabSwitch]);

  const handleFullScreenChange = useCallback(() => {
    if (!document.fullscreenElement && !isResettingRef.current) {
      isResettingRef.current = true;
      
      // Clear any existing timeout
      if (resetTimeoutRef.current) {
        window.clearTimeout(resetTimeoutRef.current);
      }
      
      // Set a new timeout
      resetTimeoutRef.current = window.setTimeout(() => {
        onTabSwitch();
        isResettingRef.current = false;
      }, 500);
    }
  }, [onTabSwitch]);

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      
      // Clear timeout on cleanup
      if (resetTimeoutRef.current) {
        window.clearTimeout(resetTimeoutRef.current);
      }
    };
  }, [handleVisibilityChange, handleFullScreenChange]);

  const requestFullScreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    }
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(err => {
        console.error(`Error attempting to exit full-screen mode: ${err.message}`);
      });
    }
  };

  return { requestFullScreen, exitFullScreen };
};