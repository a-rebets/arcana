import { useChat } from "@ai-sdk/react";
import { useAuthToken } from "@convex-dev/auth/react";
import { useToggle, useUpdateEffect } from "@react-hookz/web";
import { DefaultChatTransport } from "ai";
import { useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import {
  type ArcanaUIMessage,
  getAgentChatStore,
  useChatMessages,
} from "@/lib/convex-agent";

type UseLiveChatOptions = {
  storeId?: string;
  threadId?: string;
};

export function useLiveChat(opts: UseLiveChatOptions) {
  const { storeId = "arcana-chat", threadId } = opts;

  const token = useAuthToken();
  const [searchParams, setSearchParams] = useSearchParams();

  const store = useMemo(
    () => getAgentChatStore<ArcanaUIMessage>(storeId),
    [storeId],
  );
  const globalMessages = useChatMessages();
  const [liveChatEnabled, toggleLiveChat] = useToggle(false);

  const { messages, status, sendMessage, error } = useChat<ArcanaUIMessage>({
    id: threadId,
    transport: new DefaultChatTransport({
      api: `${import.meta.env.VITE_CONVEX_API_URL}/api/chat`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "omit",
      prepareSendMessagesRequest({ messages, body }) {
        const lastMessage = messages.at(-1);
        return { body: { message: lastMessage, ...body } };
      },
    }),
  });

  const actions = useMemo(() => {
    return {
      sendMessage: ({
        text,
        webSearch,
      }: {
        text?: string;
        webSearch?: boolean;
      }) => {
        toggleLiveChat(true);
        return sendMessage(text ? { text } : undefined, {
          body: {
            threadId,
            webSearch,
          },
        });
      },
    };
  }, [sendMessage, threadId, toggleLiveChat]);

  const resetLiveChat = useCallback(() => {
    // logWithTimestamp("resetting live chat");
    toggleLiveChat(false);
    store.setState({
      status: "ready",
      error: undefined,
      ...actions,
    });
  }, [actions, store, toggleLiveChat]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset on mount and on threadId change
  useEffect(resetLiveChat, [threadId]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: store is stable
  useEffect(() => {
    if (!liveChatEnabled || !threadId) return;
    /*     logWithTimestamp(
      `running live hook:
[status] ${status}
[last message id] ${lastMsg?.id}
[last part type] ${lastPart?.type}
[last text length] ${lastPart?.type === "text" ? lastPart.text?.length : "n/a"}`,
    ); */
    store.getState()._syncState(
      {
        messages,
        status,
        error,
      },
      { source: "live" },
    );
  }, [error, status, liveChatEnabled, messages, threadId]);

  // Pick up the global status to submit if we're in a new thread
  useUpdateEffect(() => {
    const search = searchParams.get("search");
    if (
      globalMessages.length === 1 &&
      globalMessages[0].role === "user" &&
      Boolean(token) &&
      Boolean(threadId)
    ) {
      actions.sendMessage({ webSearch: search === "true" });
    }
    if (search === "true") {
      setSearchParams({});
    }
  }, [globalMessages]);

  return {
    status,
  };
}
