import { GlobeSimpleIcon } from "@phosphor-icons/react";
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
import { useChatId, useChatStatus } from "@/lib/convex-agent";
import { ArtifactsToggleButton } from "@/pages/main/artifacts";

export const ChatInput = ({ className }: { className?: string }) => {
  const threadId = useChatId();

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
            <GlobeSimpleIcon weight="bold" />
            <span>Search</span>
          </PromptInputButton>
          <ArtifactsToggleButton />
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
