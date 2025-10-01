import { useCallback, useRef } from "react";

export function useScroll<T extends HTMLElement = HTMLElement>(
  callback: (e: Event) => void,
  options: AddEventListenerOptions = { passive: true },
) {
  const cleanupRef = useRef<(() => void) | null>(null);

  return useCallback(
    (el: T | null) => {
      cleanupRef.current?.();
      if (!el) return;
      el.addEventListener("scroll", callback, options);
      cleanupRef.current = () =>
        el.removeEventListener("scroll", callback, options);
    },
    [callback, options],
  );
}
