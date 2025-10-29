import { api } from "@convex/api";
import { convexQuery } from "@convex-dev/react-query";
import { PlusIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { MainNavigationSection } from "@/components/navigation";
import { useArtifactsPanelActions } from "@/hooks/use-artifacts-store";
import { ThreadsBox } from "./combobox";

export function Threads({ threadId }: { threadId: string | undefined }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { open: openArtifactsPanel } = useArtifactsPanelActions();

  const { data: threadMetadata } = useQuery(
    convexQuery(
      api.ai.threads.public.getThreadMetadata,
      threadId ? { threadId } : "skip",
    ),
  );

  useEffect(() => {
    if (threadMetadata === null) {
      navigate("/", { replace: true });
      return;
    }
    document.title = `Arcana - ${threadMetadata?.title ?? "New chat"}`;
    if (searchParams.get("artifact")) {
      openArtifactsPanel();
    }
  }, [threadMetadata, navigate, searchParams, openArtifactsPanel]);

  return (
    <MainNavigationSection className="md:pt-3.5 overflow-visible">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 grid-rows-1">
        <ThreadsBox title={threadMetadata?.title} />
        <Button
          className="h-[2.4rem] w-20 rounded-xl border dark:border-0 shrink-0"
          variant="accent"
          hoverScale={1}
          tapScale={0.9}
          onClick={() => navigate("/")}
        >
          <PlusIcon weight="bold" />
        </Button>
      </div>
    </MainNavigationSection>
  );
}
