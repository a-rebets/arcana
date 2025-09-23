import {
  useChatActions,
  useChatMessages,
  useChatStatus,
} from "@ai-sdk-tools/store";
import { ArrowsClockwiseIcon, CopyIcon } from "@phosphor-icons/react";
import { asanaToolLabels } from "asana-tools";
import { Fragment } from "react/jsx-runtime";
import { Action, Actions } from "@/components/ai-elements/actions";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
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
import type { ExtractToolName, RawArcanaUIToolType } from "@/lib/tool-labels";
import type {
  ArcanaReasoningUIPart,
  ArcanaTextUIPart,
  ArcanaToolUIPart,
  ArcanaUIMessage,
  ArcanaUIMessagePart,
} from "./types";

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

export const ConversationPanel = () => {
  const messages = useChatMessages<ArcanaUIMessage>();
  const status = useChatStatus();

  return (
    <Conversation className="flex-1 min-h-0">
      <ConversationContent>
        {messages.map((message) => (
          <div key={message.id}>
            <MessageSources message={message} />
            {message.parts.map((part, i) => {
              const isLast = i === message.parts.length - 1;
              const partType = part.type;
              switch (partType) {
                case "text":
                  return (
                    <MessageText
                      role={message.role}
                      part={part}
                      key={`${message.id}-${i}`}
                      isLast={isLast}
                    />
                  );
                case "reasoning":
                  return (
                    <MessageReasoning
                      part={part}
                      key={`${message.id}-${i}`}
                      isLast={isLast && message.id === messages.at(-1)?.id}
                    />
                  );
                default:
                  if (isToolPart(part)) {
                    try {
                      const { fullName } = parseToolType(part.type);
                      return (
                        <ToolCall
                          part={part}
                          fullToolName={fullName}
                          key={`${message.id}-${i}`}
                        />
                      );
                    } catch {
                      return null;
                    }
                  }
                  return null;
              }
            })}
          </div>
        ))}
        {status === "submitted" && <EyeLoader />}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
};

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
      <Message from={role}>
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
  const status = useChatStatus();
  return (
    <Reasoning
      className="w-full"
      isStreaming={status === "streaming" && isLast}
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
