import { GlobeSimpleIcon, PresentationChartIcon } from "@phosphor-icons/react";
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
import {
  useArtifactsPanelActions,
  useArtifactsPanelState,
} from "@/hooks/use-artifacts-store";
import { useAsanaRefresh } from "@/hooks/use-asana-refresh";
import { useChatInput } from "@/hooks/use-chat-input";
import { useChatStatus } from "@/lib/convex-agent";

export const ChatInput = ({ className }: { className?: string }) => {
  const { threadId } = useParams();

  const { ready: asanaReady } = useAsanaRefresh();
  const inputHelpers = useChatInput(threadId);
  const status = useChatStatus();

  const isArtifactsPanelOpen = useArtifactsPanelState();
  const { toggle: toggleArtifactsPanel } = useArtifactsPanelActions();

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
          <PromptInputButton
            variant={isArtifactsPanelOpen ? "default" : "ghost"}
            onClick={toggleArtifactsPanel}
            hoverScale={1}
          >
            <PresentationChartIcon weight="bold" />
            <span>Artifacts</span>
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
