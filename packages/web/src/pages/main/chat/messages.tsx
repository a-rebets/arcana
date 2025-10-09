import { useCallback, useEffect } from "react";
import { useStickToBottomContext } from "use-stick-to-bottom";
import { EyeLoader } from "@/components/ui/loaders";
import {
  useChatActions,
  useChatMessages,
  useChatQueryStatus,
  useChatStatus,
} from "@/lib/convex-agent";
import type { ArcanaUIMessage } from "@/lib/convex-agent/types";
import { MessageReasoning } from "./parts/reasoning";
import { MessageSources } from "./parts/sources";
import { MessageText } from "./parts/text";
import { isToolPart, ToolCall } from "./parts/tool";

export function ChatMessages() {
  const { scrollRef } = useStickToBottomContext();
  const { loadMore } = useChatActions();

  const status = useChatStatus();
  const queryStatus = useChatQueryStatus();
  const messages = useChatMessages<ArcanaUIMessage>();

  const scrollHandler = useCallback(
    (event: Event) => {
      const el = event.currentTarget as HTMLElement;
      if (el.scrollTop <= 300 && queryStatus === "CanLoadMore") {
        loadMore(10);
      }
    },
    [queryStatus, loadMore],
  );

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", scrollHandler);
    return () => {
      el.removeEventListener("scroll", scrollHandler);
    };
  }, [scrollRef, scrollHandler]);

  return (
    <>
      {messages.map((message) => {
        const isLastMessage = message.key === messages.at(-1)?.key;
        const sources = message.parts.filter(
          (part) => part.type === "source-url",
        );
        return (
          <div key={message.id}>
            {message.role === "assistant" && (
              <MessageSources sources={sources} id={message.id} />
            )}
            <MessageParts message={message} isLastMessage={isLastMessage} />
          </div>
        );
      })}
      {status === "submitted" && <EyeLoader />}
    </>
  );
}

function MessageParts({
  message,
  isLastMessage,
}: {
  message: ArcanaUIMessage;
  isLastMessage: boolean;
}) {
  const keyFor = makePartKeyFactory(message.key);
  return message.parts.map((part, i) => {
    const isLast = i === message.parts.length - 1;
    const key = keyFor(part.type);
    switch (part.type) {
      case "text": {
        return (
          <MessageText
            role={message.role}
            part={part}
            key={key}
            isLast={isLast}
          />
        );
      }
      case "reasoning": {
        return (
          <MessageReasoning
            part={part}
            key={key}
            isLast={isLast && isLastMessage}
          />
        );
      }
      default:
        if (isToolPart(part)) {
          return <ToolCall part={part} key={key} />;
        }
        return null;
    }
  });
}

function makePartKeyFactory(messageKey: string) {
  const counters: Record<string, number> = {};

  return (partType: string) => {
    const typePrefix = partType.startsWith("tool-") ? "tool" : partType;
    counters[typePrefix] ??= 0;
    const idx = counters[typePrefix]++;
    return `${messageKey}-${typePrefix}-${idx}`;
  };
}
