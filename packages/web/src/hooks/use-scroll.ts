import { useCallback, useRef } from "react";

export function useScroll(callback: (e: Event) => void) {
  const cleanupRef = useRef<(() => void) | null>(null);

  return useCallback(
    (el: HTMLDivElement | null) => {
      cleanupRef.current?.();
      if (!el) return;
      el.addEventListener("scroll", callback);
      cleanupRef.current = () => el.removeEventListener("scroll", callback);
    },
    [callback],
  );
}
