import { type RefObject, useCallback, useEffect, useRef } from "react";

type UseScrollOptions = AddEventListenerOptions & {
  passive?: boolean;
};

// Overload 1: No ref provided - returns callback ref
export function useScroll<T extends HTMLElement = HTMLElement>(
  callback: (e: Event) => void,
  options?: UseScrollOptions,
): (el: T | null) => void;

// Overload 2: Ref provided - returns void, handles cleanup internally
export function useScroll<T extends HTMLElement = HTMLElement>(
  callback: (e: Event) => void,
  options: UseScrollOptions | undefined,
  ref: RefObject<T | null>,
): void;

export function useScroll<T extends HTMLElement = HTMLElement>(
  callback: (e: Event) => void,
  options: UseScrollOptions = { passive: true },
  ref?: RefObject<T | null>,
) {
  const cleanupRef = useRef<(() => void) | null>(null);

  const attachListener = useCallback(
    (el: T | null) => {
      cleanupRef.current?.();
      if (!el) return;
      el.addEventListener("scroll", callback, options);
      cleanupRef.current = () =>
        el.removeEventListener("scroll", callback, options);
    },
    [callback, options],
  );

  useEffect(() => {
    if (!ref) return;
    attachListener(ref.current);
    return () => cleanupRef.current?.();
  }, [ref, attachListener]);

  return ref ? undefined : attachListener;
}
