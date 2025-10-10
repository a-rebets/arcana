import type { UIMessage } from "@convex-dev/agent";
import type { UIMessage as AIUIMessage } from "ai";

export function mergeLiveMessages<T extends AIUIMessage>(
  current: ReadonlyArray<T>,
  incoming: ReadonlyArray<T>,
): Array<T> | null {
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
      if (messages[lastIndex] !== msg) {
        messages[lastIndex] = msg;
        changed = true;
      }
      continue;
    }
    if (!knownIds.has(msg.id)) {
      messages.push(msg);
      changed = true;
    }
  }

  return changed ? (messages as Array<T>) : null;
}

function isConvexUIMessageArray<T extends AIUIMessage>(
  messages: Array<T>,
): messages is Array<T & UIMessage> {
  return "_creationTime" in messages[0];
}

export function mergeSyncMessages<T extends AIUIMessage>(
  current: Array<T>,
  incoming: Array<T>,
  isInitialSync: boolean,
): Array<T> | null {
  if (current.length === 0 || isInitialSync) {
    return [...incoming];
  }

  if (!isConvexUIMessageArray(current) || !isConvexUIMessageArray(incoming)) {
    return null;
  }

  // Only accept messages strictly older than the first (oldest) current message
  const olderMessages = incoming.filter(
    (m) => m._creationTime < current[0]._creationTime,
  );

  if (olderMessages.length === 0) {
    return null;
  }

  return [...olderMessages, ...current].sort(
    (a, b) => a._creationTime - b._creationTime,
  );
}
