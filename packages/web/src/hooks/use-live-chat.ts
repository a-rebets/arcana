import { useChat } from "@ai-sdk/react";
import { useAuthToken } from "@convex-dev/auth/react";
import {
  useDeepCompareEffect,
  useToggle,
  useUpdateEffect,
} from "@react-hookz/web";
import type { UIMessage } from "ai";
import { DefaultChatTransport } from "ai";
import { useCallback, useEffect, useMemo } from "react";
import { getAgentChatStore, useChatMessages } from "@/lib/convex-agent";

type UseLiveChatOptions = {
  storeId?: string;
  threadId?: string;
};

export function useLiveChat<TMessage extends UIMessage = UIMessage>(
  opts: UseLiveChatOptions,
) {
  const { storeId = "arcana-chat", threadId } = opts;
  const token = useAuthToken();
  const store = useMemo(() => getAgentChatStore<TMessage>(storeId), [storeId]);
  const globalMessages = useChatMessages();
  const [liveChatEnabled, toggleLiveChat] = useToggle(false);

  const { messages, status, sendMessage, error } = useChat<TMessage>({
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

  useDeepCompareEffect(() => {
    if (!liveChatEnabled) return;
    // logWithTimestamp(
    //   `running live hook, status: ${status}, messages: ${messages.length}`,
    // );
    store.getState()._syncState(
      {
        messages,
        status,
        error,
      },
      { source: "live" },
    );
  }, [error, status, liveChatEnabled, messages]);

  // Pick up the global status to submit if we're in a new thread
  useUpdateEffect(() => {
    if (
      globalMessages.length === 1 &&
      globalMessages[0].role === "user" &&
      Boolean(token) &&
      Boolean(threadId)
    ) {
      actions.sendMessage({});
    }
  }, [globalMessages]);

  return {
    status,
  };
}
