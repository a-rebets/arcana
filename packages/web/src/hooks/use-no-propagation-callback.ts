import { type MouseEvent, useCallback } from "react";

export function useNoPropagationCallback<E extends HTMLElement>(
  callback: (e: MouseEvent<E>) => void,
  deps = [],
) {
  return useCallback(
    (e: MouseEvent<E>) => {
      e.preventDefault();
      e.stopPropagation();
      callback(e);
    },
    [...deps, callback],
  );
}
