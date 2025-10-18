import { type MouseEvent, useCallback, useLayoutEffect, useRef } from "react";

export function useNoPropagationCallback<E extends HTMLElement>(
  callback: (e: MouseEvent<E>) => void | Promise<void>,
  preventDefault = true,
) {
  const callbackRef = useRef(callback);
  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  return useCallback(
    (e: MouseEvent<E>) => {
      if (preventDefault) {
        e.preventDefault();
      }
      e.stopPropagation();
      callbackRef.current(e);
    },
    [preventDefault],
  );
}

export type NoPropagationCallback<E extends HTMLElement = HTMLButtonElement> =
  ReturnType<typeof useNoPropagationCallback<E>>;
