import { useEffect, useRef, useState, useCallback } from "react";

export interface WindowInterface {
  innerWidth: number;
  innerHeight: number;
}

/**
 * Returns the current window size (width and height), with a debounced
 * listener for the 'resize' event.
 *
 * @param debounceMs Number of milliseconds to wait after the last resize event
 * before updating state.
 */
export default function useWindowSize(debounceMs = 300): WindowInterface {
  const [windowSize, setWindowSize] = useState<WindowInterface>({
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Create a stable callback for handling resize, debounced by `debounceMs`.
  const handleResize = useCallback(() => {
    // Clear any pending timer so we don't update multiple times
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set a new debounce timer
    timerRef.current = setTimeout(() => {
      setWindowSize({
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
      });
    }, debounceMs);
  }, [debounceMs]);

  useEffect(() => {
    // Attach the event listener
    window.addEventListener("resize", handleResize);

    // Initial check in case the window size changed between mount and now
    handleResize();

    return () => {
      // Cleanup on unmount
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  return windowSize;
}
