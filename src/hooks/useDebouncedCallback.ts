import { useRef, useEffect, useCallback } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDebouncedCallback<T extends (...args: any) => ReturnType<T>>(
  func: T,
  delay = 500,
) {
  const funcRef = useRef(func);
  useEffect(() => {
    funcRef.current = func;
  }, [func]);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const delayedAction = useCallback(
    (...args: Parameters<T>) => {
      if (timeout.current !== null) {
        clearTimeout(timeout.current);
      }
      timeout.current = setTimeout(() => {
        console.log(args);
        funcRef.current(...args);
      }, delay);
    },
    [delay],
  );

  return delayedAction;
}
