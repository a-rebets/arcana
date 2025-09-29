import type { UIMessage as AIUIMessage } from "ai";

export function mergeLiveMessages<T extends AIUIMessage>(
  current: ReadonlyArray<T>,
  incoming: ReadonlyArray<T>,
): Array<T> | null {
  // LIVE: hydrate empty store or append/update tail-only
  if (current.length === 0) {
    return [...incoming] as Array<T>;
  }

  const lastIndex = current.length - 1;
  const lastId = current[lastIndex]?.id;
  const knownIds = new Set(current.map((m) => m.id));

  let changed = false;
  const messages = current.slice();

  for (const msg of incoming) {
    if (msg.id === lastId) {
      // Inclusive update for last message (multi-part streaming)
      if (messages[lastIndex] !== msg) {
        messages[lastIndex] = msg;
        changed = true;
      }
      continue;
    }
    if (!knownIds.has(msg.id)) {
      // New tail message
      messages.push(msg);
      changed = true;
    }
    // Ignore updates to earlier messages
  }

  return changed ? (messages as Array<T>) : null;
}

export function mergeSyncMessages<T extends AIUIMessage>(
  current: ReadonlyArray<T>,
  incoming: ReadonlyArray<T>,
  isInitialSync: boolean,
): Array<T> | null {
  // SYNC: hydrate empty store or prepend before first (inclusive)
  if (current.length === 0 || isInitialSync) {
    return [...incoming] as Array<T>;
  }

  const firstId = current[0].id;
  const boundary = incoming.findIndex((m) => m.id === firstId);

  // No overlap yet; wait for a page that contains the boundary
  if (boundary === -1) return null;

  // If no messages to prepend, it's a no-op (sync only handles older messages)
  if (boundary === 0) return null;

  // Prepending older messages: take everything up to and including boundary
  return [...incoming.slice(0, boundary + 1), ...current.slice(1)] as Array<T>;
}
