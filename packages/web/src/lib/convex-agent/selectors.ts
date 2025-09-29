import type { UIMessage as AIUIMessage } from "ai";
import { useStore } from "zustand";
import { useShallow } from "zustand/shallow";
import { type AgentChatStore, getAgentChatStore } from "./store";

export function useChatStoreSelector<
  TMessage extends AIUIMessage = AIUIMessage,
  T = unknown,
>(selector: (s: AgentChatStore<TMessage>) => T, storeId = "default"): T {
  const store = getAgentChatStore<TMessage>(storeId);
  return useStore(store, useShallow(selector));
}

function createFieldSelector<K extends keyof AgentChatStore>(field: K) {
  return (storeId = "arcana-chat") => {
    return useChatStoreSelector((s) => s[field], storeId);
  };
}

// Field selectors
export const useChatMessages = createFieldSelector("messages");
export const useChatStatus = createFieldSelector("status");
export const useChatQueryStatus = createFieldSelector("queryStatus");
export const useChatInitialSyncDone = createFieldSelector("initialSyncDone");

// Derived selectors
export function useChatMessagesCount(storeId = "arcana-chat"): number {
  return useChatStoreSelector((s) => s.messages.length, storeId);
}

export function useChatActions(storeId = "arcana-chat") {
  return useChatStoreSelector(
    (s) => ({
      sendMessage: s.sendMessage,
      regenerate: s.regenerate,
      loadMore: s.loadMore,
    }),
    storeId,
  );
}
