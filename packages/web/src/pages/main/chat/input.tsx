import { GlobeSimpleIcon } from "@phosphor-icons/react";
import { useParams } from "react-router";
import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { useAsanaRefresh } from "@/hooks/use-asana-refresh";
import { useChatInput } from "@/hooks/use-chat-input";
import { useChatStatus } from "@/lib/convex-agent";

export const ChatInput = ({ className }: { className?: string }) => {
  const { threadId } = useParams<{ threadId: string }>();

  const { ready: asanaReady } = useAsanaRefresh();
  const inputHelpers = useChatInput(threadId);

  const status = useChatStatus();

  return (
    <PromptInput
      onSubmit={inputHelpers.handleSubmit}
      globalDrop
      multiple
      className={className}
    >
      <PromptInputBody>
        <PromptInputTextarea
          onChange={inputHelpers.handleInputChange}
          value={inputHelpers.input}
        />
      </PromptInputBody>
      <PromptInputToolbar>
        <PromptInputTools>
          <PromptInputButton
            variant={inputHelpers.webSearch ? "default" : "ghost"}
            onClick={inputHelpers.toggleWebSearch}
            hoverScale={1}
          >
            <GlobeSimpleIcon size={16} />
            <span>Search</span>
          </PromptInputButton>
        </PromptInputTools>
        <PromptInputSubmit
          disabled={
            !asanaReady || status === "submitted" || status === "streaming"
          }
          status={status}
        />
      </PromptInputToolbar>
    </PromptInput>
  );
};
