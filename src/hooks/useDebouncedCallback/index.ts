import { useCallback } from 'react';

/**
 * Subsequent calls to the debounced function `debounced.callback` return the result of the last func invocation.
 * Note, that if there are no previous invocations it's mean you will get undefined. You should check it in your code properly.
 */
export interface DebouncedState<T extends (...args: never[]) => ReturnType<T>> {
  (...args: Parameters<T>): ReturnType<T> | undefined;
}

export function useDebouncedCallback<T extends (...args: never[]) => ReturnType<T>>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  // the `useCallback` hook will return a memoized version of the callback
  // that only changes if one of the dependencies has changed.
  return useCallback(
    (...args: Parameters<T>) => {
      const handler = setTimeout(() => {
        callback(...args);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    },
    [callback, delay] // if either callback or delay changes, recreate the debounced callback
  );
}
