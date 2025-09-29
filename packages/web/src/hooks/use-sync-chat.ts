import type { UIMessage } from "@convex-dev/agent";
import { useUIMessages } from "@convex-dev/agent/react";
import { useDeepCompareEffect } from "@react-hookz/web";
import type { ChatStatus } from "ai";
import type { UsePaginatedQueryResult } from "convex/react";
import type { FunctionReference } from "convex/server";
import { useCallback, useEffect, useMemo } from "react";
import { useChatInitialSyncDone } from "@/lib/convex-agent";
import { getAgentChatStore } from "../lib/convex-agent/store";

function deriveChatStatus<TMessage extends UIMessage = UIMessage>(
  messages: TMessage[],
): ChatStatus | undefined {
  if (messages.length === 0) return undefined;
  const lastMessage = messages.at(-1);
  switch (lastMessage?.status) {
    case "streaming":
      return "streaming";
    case "pending":
      return "submitted";
    case "failed":
      return "error";
    default:
      return "ready";
  }
}

export interface UseSyncChatOptions {
  storeId?: string;
  threadId?: string;
  listQuery: FunctionReference<"query">;
  initialNumItems?: number;
}

export function useSyncChat<TMessage extends UIMessage = UIMessage>(
  opts: UseSyncChatOptions,
) {
  const {
    storeId = "arcana-chat",
    threadId,
    listQuery,
    initialNumItems = 50,
  } = opts;
  const store = useMemo(() => getAgentChatStore<TMessage>(storeId), [storeId]);
  const initialSyncDone = useChatInitialSyncDone();

  const {
    results,
    status: queryStatus,
    loadMore,
  } = useUIMessages(
    listQuery,
    threadId
      ? {
          threadId,
        }
      : "skip",
    { initialNumItems, stream: !initialSyncDone },
  ) as UsePaginatedQueryResult<TMessage>;

  const resetSyncChat = useCallback(() => {
    // logWithTimestamp("resetting sync chat");
    store.setState({
      id: threadId,
      messages: [],
      queryStatus: "LoadingFirstPage",
      loadMore,
      initialSyncDone: false,
    });
  }, [threadId, store, loadMore]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset on mount and on threadId change
  useEffect(resetSyncChat, [threadId]);

  useDeepCompareEffect(() => {
    if (initialSyncDone && queryStatus !== "CanLoadMore") return;
    const derivedStatus = deriveChatStatus(results);
    // logWithTimestamp(
    //   `running sync hook, derivedStatus: ${derivedStatus}, queryStatus: ${queryStatus}, results: ${results.length}`,
    // );
    const baseState = {
      messages: results,
      queryStatus,
    };
    const newState = !initialSyncDone
      ? {
          ...baseState,
          status: derivedStatus,
          initialSyncDone: derivedStatus === "ready",
        }
      : baseState;
    store.getState()._syncState(newState, { source: "sync" });
  }, [results, queryStatus, initialSyncDone]);

  return {
    queryStatus,
  };
}
