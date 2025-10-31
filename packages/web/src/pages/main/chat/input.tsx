import { api } from "@convex/api";
import { convexQuery } from "@convex-dev/react-query";
import { GlobeSimpleIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import type { ChatStatus } from "ai";
import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { StaticGradientBackground } from "@/components/ui/gradient-background";
import { useAsanaRefresh } from "@/hooks/use-asana-refresh";
import { useChatInput } from "@/hooks/use-chat-input";
import type { Gradient } from "@/lib/colors";
import { useChatId, useChatStatus } from "@/lib/convex-agent";
import { cn } from "@/lib/utils";
import { ArtifactsToggleButton } from "@/pages/main/artifacts";

export const ChatInput = ({ className }: { className?: string }) => {
  const threadId = useChatId();
  const status = useChatStatus();
  const { data: userData } = useQuery(
    convexQuery(api.core.accounts.getUser, {}),
  );
  const inputHelpers = useChatInput(threadId);

  const bgGradient =
    (userData?.profileColors as Gradient) || (["fuchsia", "amber"] as const);
  const bgDimmed = !status || status !== "ready";

  return (
    <div className="relative">
      <StaticGradientBackground
        gradient={bgGradient}
        className={cn(
          "blur-sm -inset-1 rounded-[1.25rem] saturate-200 dark:saturate-100 z-20",
          bgDimmed && "blur-xs opacity-50",
        )}
      />
      <PromptInput
        onSubmit={inputHelpers.handleSubmit}
        globalDrop
        multiple
        className={cn(
          "relative rounded-2xl shadow-none z-30 border-none",
          className,
        )}
      >
        <PromptInputBody>
          <PromptInputTextarea
            onChange={inputHelpers.handleInputChange}
            value={inputHelpers.input}
            placeholder="Type your question here..."
          />
        </PromptInputBody>
        <PromptInputToolbar>
          <PromptInputTools>
            <PromptInputButton
              variant={inputHelpers.withWebSearch ? "default" : "ghost"}
              onClick={inputHelpers.toggleWebSearch}
              hoverScale={1}
            >
              <GlobeSimpleIcon weight="bold" />
              <span>Search</span>
            </PromptInputButton>
            <ArtifactsToggleButton />
          </PromptInputTools>
          <ChatSubmitButton status={status} />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
};

function ChatSubmitButton({ status }: { status?: ChatStatus }) {
  const { ready: asanaReady } = useAsanaRefresh();

  return (
    <PromptInputSubmit
      disabled={!asanaReady || status === "submitted" || status === "streaming"}
      status={status}
      className="rounded-br-xl"
    />
  );
}
