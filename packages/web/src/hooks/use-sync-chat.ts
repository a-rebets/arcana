import { useUIMessages } from "@convex-dev/agent/react";
import { useDeepCompareEffect } from "@react-hookz/web";
import type { ChatStatus } from "ai";
import type { UsePaginatedQueryResult } from "convex/react";
import type { FunctionReference } from "convex/server";
import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  type ArcanaUIMessage,
  type ChatSyncStatus,
  useChatInitialSyncDone,
} from "@/lib/convex-agent";
import { getAgentChatStore } from "../lib/convex-agent/store";

function deriveChatStatus(messages: ArcanaUIMessage[]): ChatStatus | undefined {
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

export function useSyncChat(opts: UseSyncChatOptions) {
  const {
    storeId = "arcana-chat",
    threadId,
    listQuery,
    initialNumItems = 50,
  } = opts;
  const store = useMemo(
    () => getAgentChatStore<ArcanaUIMessage>(storeId),
    [storeId],
  );
  const initialSyncDone = useChatInitialSyncDone();
  const prevQueryStatusRef = useRef<ChatSyncStatus | null>(null);

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
  ) as UsePaginatedQueryResult<ArcanaUIMessage>;

  const resetSyncChat = useCallback(() => {
    store.setState({
      id: threadId,
      messages: [],
      queryStatus: "LoadingFirstPage",
      initialSyncDone: false,
    });
  }, [threadId, store]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset on mount and on threadId change
  useEffect(resetSyncChat, [threadId]);

  useDeepCompareEffect(() => {
    if (!threadId) return;
    const prevQueryStatus = prevQueryStatusRef.current;
    const derivedStatus = deriveChatStatus(results);

    if (
      initialSyncDone &&
      queryStatus === prevQueryStatus &&
      queryStatus !== "LoadingMore"
    ) {
      prevQueryStatusRef.current = queryStatus;
      return;
    }

    //     logWithTimestamp(
    //       `running sync hook:
    // [status] ${derivedStatus}
    // [query status] ${queryStatus}
    // [messages count] ${results.length}
    // [initial sync done] ${initialSyncDone}
    // [prev query status] ${prevQueryStatus}`,
    //     );

    const baseState = {
      messages: results,
      queryStatus,
      loadMore,
    };
    const newState = !initialSyncDone
      ? {
          ...baseState,
          status: derivedStatus,
          initialSyncDone: derivedStatus === "ready",
        }
      : baseState;
    store.getState()._syncState(newState, { source: "sync" });

    prevQueryStatusRef.current = queryStatus;
  }, [results, queryStatus, initialSyncDone, loadMore, threadId]);

  return {
    queryStatus,
  };
}
