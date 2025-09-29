import type { UIMessage as AIUIMessage, ChatStatus } from "ai";
import { create, type StoreApi } from "zustand";
import { mergeLiveMessages, mergeSyncMessages } from "./merging";
import type { ChatSyncStatus } from "./types";

type StoreMap<T> = Map<string, T>;

declare global {
  interface Window {
    __AGENT_STORE_INSTANCES__?: StoreMap<unknown>;
  }

  var __AGENT_STORE_INSTANCES__: StoreMap<unknown>;
}

const getGlobalStoreInstances = <T>(): StoreMap<T> => {
  if (typeof window !== "undefined") {
    if (!window.__AGENT_STORE_INSTANCES__) {
      window.__AGENT_STORE_INSTANCES__ = new Map();
    }
    return window.__AGENT_STORE_INSTANCES__ as StoreMap<T>;
  }
  if (!globalThis.__AGENT_STORE_INSTANCES__) {
    globalThis.__AGENT_STORE_INSTANCES__ = new Map();
  }
  return globalThis.__AGENT_STORE_INSTANCES__ as StoreMap<T>;
};

export interface AgentChatActions {
  sendMessage: (args: { text: string; webSearch?: boolean }) => Promise<void>;
  regenerate: () => Promise<void>;
  loadMore: (numItems: number) => void;
}

export interface AgentChatStore<TMessage extends AIUIMessage = AIUIMessage>
  extends AgentChatActions {
  id: string;
  messages: TMessage[];
  error?: Error;
  status?: ChatStatus;
  queryStatus: ChatSyncStatus;
  initialSyncDone: boolean;
}

export interface AgentChatStoreWithSync<
  TMessage extends AIUIMessage = AIUIMessage,
> extends AgentChatStore<TMessage> {
  _syncState: (
    partial: Partial<AgentChatStore<TMessage>>,
    options?: { source?: "sync" | "live" },
  ) => void;
}

function createAgentChatStore<TMessage extends AIUIMessage = AIUIMessage>() {
  return create<AgentChatStoreWithSync<TMessage>>()((set) => ({
    id: "",
    messages: [] as TMessage[],
    error: undefined,
    status: undefined,
    queryStatus: "LoadingFirstPage",
    initialSyncDone: false,
    loadMore: () => {},
    sendMessage: async () => undefined,
    regenerate: async () => {},
    _syncState: (partial, options = {}) => {
      const { source } = options;
      set((previous) => {
        const { messages: incoming, ...otherFields } = partial;

        // No incoming messages: only merge non-message fields
        if (!incoming || incoming.length === 0) {
          return { ...previous, ...otherFields };
        }

        // Delegate to the appropriate merge function
        const merged =
          source === "live"
            ? mergeLiveMessages(previous.messages, incoming)
            : mergeSyncMessages(
                previous.messages,
                incoming,
                !previous.initialSyncDone,
              );

        // No changes from merge: keep current messages
        if (!merged) {
          return { ...previous, ...otherFields };
        }

        // Update messages
        return {
          ...previous,
          ...otherFields,
          messages: merged,
        };
      });
    },
  }));
}

function mapGetOrCreate<K, V>(map: Map<K, V>, key: K, create: () => V): V {
  if (!map.has(key)) {
    map.set(key, create());
  }
  return map.get(key) as V;
}

export function getAgentChatStore<TMessage extends AIUIMessage = AIUIMessage>(
  storeId = "default",
) {
  const map =
    getGlobalStoreInstances<StoreApi<AgentChatStoreWithSync<TMessage>>>();
  return mapGetOrCreate(map, storeId, () => createAgentChatStore<TMessage>());
}

export function clearAgentChatStore(storeId = "default"): void {
  const map = getGlobalStoreInstances<unknown>();
  map.delete(storeId);
}

export function clearAllAgentChatStores(): void {
  const map = getGlobalStoreInstances<unknown>();
  map.clear();
}
