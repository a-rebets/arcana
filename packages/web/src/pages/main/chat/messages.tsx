import { ArrowsClockwiseIcon, CopyIcon } from "@phosphor-icons/react";
import { asanaToolLabels } from "asana-tools";
import { Fragment, useCallback, useEffect } from "react";
import { useStickToBottomContext } from "use-stick-to-bottom";
import { Action, Actions } from "@/components/ai-elements/actions";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Response } from "@/components/ai-elements/response";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
import { EyeLoader } from "@/components/ui/loaders";
import {
  useChatActions,
  useChatMessages,
  useChatQueryStatus,
  useChatStatus,
} from "@/lib/convex-agent";
import type {
  ArcanaReasoningUIPart,
  ArcanaTextUIPart,
  ArcanaToolUIPart,
  ArcanaUIMessage,
  ArcanaUIMessagePart,
} from "@/lib/convex-agent/types";
import type { ExtractToolName, RawArcanaUIToolType } from "@/lib/tool-labels";
import { cn } from "@/lib/utils";

export const ChatMessages = () => {
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
        return (
          <div key={message.id}>
            <MessageSources message={message} />
            <MessageParts message={message} isLastMessage={isLastMessage} />
          </div>
        );
      })}
      {status === "submitted" && <EyeLoader />}
    </>
  );
};

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
          try {
            const { fullName } = parseToolType(part.type);
            return <ToolCall part={part} fullToolName={fullName} key={key} />;
          } catch {
            return null;
          }
        }
        return null;
    }
  });
}

function MessageSources({ message }: { message: ArcanaUIMessage }) {
  const sources = message.parts.filter((part) => part.type === "source-url");

  return (
    message.role === "assistant" &&
    sources.length > 0 && (
      <Sources>
        <SourcesTrigger count={sources.length} />
        {sources.map((part, i) => (
          <SourcesContent key={`${message.id}-${i}`}>
            <Source
              key={`${message.id}-${i}`}
              href={part.url}
              title={part.url}
            />
          </SourcesContent>
        ))}
      </Sources>
    )
  );
}

function MessageText({
  role,
  part,
  isLast,
}: {
  role: ArcanaUIMessage["role"];
  part: ArcanaTextUIPart;
  isLast: boolean;
}) {
  const { regenerate } = useChatActions();
  return (
    <Fragment>
      <Message from={role} className={cn(role === "assistant" && "py-0")}>
        <MessageContent className="rounded-2xl">
          <Response>{part.text}</Response>
        </MessageContent>
      </Message>
      {role === "assistant" && isLast && (
        <Actions className="mt-2">
          <Action onClick={() => regenerate()} label="Retry">
            <ArrowsClockwiseIcon className="size-4" />
          </Action>
          <Action
            onClick={() => navigator.clipboard.writeText(part.text)}
            label="Copy"
          >
            <CopyIcon className="size-4" />
          </Action>
        </Actions>
      )}
    </Fragment>
  );
}

function MessageReasoning({
  part,
  isLast,
}: {
  part: ArcanaReasoningUIPart;
  isLast: boolean;
}) {
  return (
    <Reasoning
      className="w-full"
      isStreaming={part.state === "streaming" && isLast}
      defaultOpen={false}
    >
      <ReasoningTrigger />
      <ReasoningContent>{part.text}</ReasoningContent>
    </Reasoning>
  );
}

function ToolCall({
  part,
  fullToolName,
}: {
  part: ArcanaToolUIPart;
  fullToolName: ExtractToolName<ArcanaToolUIPart["type"]>;
}) {
  const isAsana = fullToolName.includes("asana");
  return (
    <Tool>
      <ToolHeader
        labels={
          isAsana
            ? asanaToolLabels[fullToolName]
            : {
                "input-streaming": `Using "${fullToolName}" tool...`,
                "output-available": `Got results from "${fullToolName}" tool`,
              }
        }
        state={part.state}
        isAsana={isAsana}
      />
      <ToolContent>
        <ToolInput input={part.input} />
        <ToolOutput output={part.output} errorText={part.errorText} />
      </ToolContent>
    </Tool>
  );
}

function parseToolType(toolType: ArcanaToolUIPart["type"]) {
  const match = toolType.match(/^tool-([^_]+)_(.+)$/);
  if (!match) {
    throw new Error(`Invalid tool type format: ${toolType}`);
  }
  return {
    package: match[1],
    fullName: `${match[1]}_${match[2]}` as RawArcanaUIToolType,
  };
}

function isToolPart(part: ArcanaUIMessagePart): part is ArcanaToolUIPart {
  return part.type.startsWith("tool-");
}

function makePartKeyFactory(messageKey: string) {
  const counters: Record<string, number> = {};
  return (partType: ArcanaUIMessagePart["type"]) => {
    const typePrefix =
      partType === "text"
        ? "text"
        : partType === "reasoning"
          ? "reasoning"
          : partType.startsWith("tool-")
            ? "tool"
            : "other";
    counters[typePrefix] ??= 0;
    const idx = counters[typePrefix]++;
    return `${messageKey}-${typePrefix}-${idx}`;
  };
}
