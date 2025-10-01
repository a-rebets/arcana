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

function createFieldSelector<K extends keyof AgentChatStore<AIUIMessage>>(
  field: K,
) {
  return <TMessage extends AIUIMessage = AIUIMessage>(
    storeId = "arcana-chat",
  ) => {
    return useChatStoreSelector<TMessage, AgentChatStore<TMessage>[K]>(
      (s) => s[field],
      storeId,
    );
  };
}

// Field selectors
export const useChatMessages = createFieldSelector("messages");
export const useChatStatus = createFieldSelector("status");
export const useChatQueryStatus = createFieldSelector("queryStatus");
export const useChatInitialSyncDone = createFieldSelector("initialSyncDone");

// Derived selectors
export function useChatMessagesCount<
  TMessage extends AIUIMessage = AIUIMessage,
>(storeId = "arcana-chat"): number {
  return useChatStoreSelector<TMessage, number>(
    (s) => s.messages.length,
    storeId,
  );
}

export function useChatActions<TMessage extends AIUIMessage = AIUIMessage>(
  storeId = "arcana-chat",
) {
  return useChatStoreSelector<
    TMessage,
    Pick<AgentChatStore<TMessage>, "sendMessage" | "regenerate" | "loadMore">
  >(
    (s) => ({
      sendMessage: s.sendMessage,
      regenerate: s.regenerate,
      loadMore: s.loadMore,
    }),
    storeId,
  );
}
