import { ArrowsClockwiseIcon, CopyIcon } from "@phosphor-icons/react";
import { Action, Actions } from "@/components/ai-elements/actions";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";
import {
  type ArcanaTextUIPart,
  type ArcanaUIMessage,
  useChatActions,
  useChatStatus,
} from "@/lib/convex-agent";
import { cn } from "@/lib/utils";

export function MessageText({
  role,
  part,
  isLast,
}: {
  role: ArcanaUIMessage["role"];
  part: ArcanaTextUIPart;
  isLast: boolean;
}) {
  const status = useChatStatus();
  const { regenerate } = useChatActions();

  const showActions = role === "assistant" && isLast && status === "ready";
  return (
    <>
      <Message
        from={role}
        className={cn("mb-4", role === "assistant" && "py-0", isLast && "mb-0")}
      >
        <MessageContent className="rounded-2xl">
          <Response>{part.text}</Response>
        </MessageContent>
      </Message>
      {showActions && (
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
    </>
  );
}
