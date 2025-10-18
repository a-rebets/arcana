import { api } from "@convex/api";
import { convexQuery } from "@convex-dev/react-query";
import { ChatCircleTextIcon, DownloadSimpleIcon } from "@phosphor-icons/react";
import {
  useDeepCompareEffect,
  useDeepCompareMemo,
  useMountEffect,
  useUnmountEffect,
} from "@react-hookz/web";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Link } from "react-router";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { ArtifactVersionPicker } from "@/components/artifacts/version-picker";
import {
  MorphingDialogClose,
  MorphingDialogContent,
  MorphingDialogSubtitle,
  MorphingDialogTitle,
} from "@/components/ui/morphing-dialog";
import { useArtifactCard } from "@/hooks/use-artifact-card";
import {
  useArtifactDownload,
  useArtifactsVersionActions,
  useVersionState,
} from "@/hooks/use-artifacts-store";
import { useVegaWithRef } from "@/hooks/use-vega-with-ref";
import { cn, formatRelativeTime } from "@/lib/utils";
import { ButtonWithChatPreview } from "./chat-preview";

export function ExpandedArtifactCard() {
  const { title, rootId, creationTime, isRoot } = useArtifactCard();
  const { setActiveChart, reset } = useArtifactsVersionActions();

  useMountEffect(() => {
    setActiveChart({ rootId, title });
  });
  useUnmountEffect(reset);

  return (
    <MorphingDialogContent
      style={{
        borderRadius: "24px",
        padding: "1rem",
        width: "50vw",
        aspectRatio: "4/3",
      }}
      className="pointer-events-auto relative flex flex-col border bg-card gap-y-4 justify-between"
    >
      <section className="px-0.5 space-y-1">
        <MorphingDialogTitle className="w-fit text-2xl">
          {title}
        </MorphingDialogTitle>
        <MorphingDialogSubtitle className="text-muted-foreground text-base w-fit">
          {isRoot ? "Created" : "Updated"} {formatRelativeTime(creationTime)}
        </MorphingDialogSubtitle>
      </section>
      <Chart />
      <ActionsRow className="pb-2" />
      <MorphingDialogClose className="right-4 top-4 bg-input/40 hover:bg-input/70 dark:bg-muted dark:hover:bg-muted/80 text-muted-foreground rounded-full" />
    </MorphingDialogContent>
  );
}

function Chart() {
  const { rootId, title, vegaSpec: initialSpec } = useArtifactCard();

  const versionState = useVersionState(rootId);
  const { syncVersionStates } = useArtifactsVersionActions();

  const { data: artifactChain } = useQuery(
    convexQuery(api.artifacts.public.getArtifactChainById, {
      artifactId: rootId,
    }),
  );
  useDeepCompareEffect(() => {
    if (!artifactChain) return;
    syncVersionStates({
      [rootId]: artifactChain.versions.length,
    });
  }, [artifactChain]);

  const versionSpec = useDeepCompareMemo(() => {
    if (!artifactChain) return null;
    const [selectedIndex] = versionState || [
      artifactChain.versions.length - 1,
      0,
    ];
    const version = artifactChain.versions[selectedIndex];
    return version.vegaSpec;
  }, [artifactChain, versionState]);

  const { ref } = useVegaWithRef(versionSpec ?? initialSpec, {
    interactive: true,
    metadata: {
      rootId,
      title,
    },
  });

  return (
    <div
      className="w-full aspect-video border dark:border-none rounded-xl overflow-clip [&>form]:absolute [&>form]:bottom-2 [&>form]:right-2 relative [&>form]:rounded-xl [&>form:empty]:bg-transparent [&>form:not(:empty)]:bg-accent/50 [&>form]:py-2 [&>form]:px-3"
      ref={ref}
    />
  );
}

type ActionsRowProps = {
  className?: string;
};

function ActionsRow({ className }: ActionsRowProps) {
  const { rootId, threadId } = useArtifactCard();
  const { toggle: toggleDownload } = useArtifactDownload();

  return (
    <div className={cn("flex w-full justify-between items-center", className)}>
      <ArtifactVersionPicker />
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="rounded-xl"
          onClick={toggleDownload}
        >
          <motion.div layoutId={`download-icon-${rootId}`}>
            <DownloadSimpleIcon />
          </motion.div>{" "}
          Download PNG
        </Button>
        <ButtonWithChatPreview
          side="bottom"
          align="end"
          sideOffset={10}
          threadId={threadId}
          className="rounded-xl"
        >
          <Button
            className="rounded-xl bg-linear-to-b from-primary to-ring"
            asChild
          >
            <Link to={`/chat/${threadId}?artifact=${rootId}`}>
              <motion.div layoutId={`chat-icon-${rootId}`}>
                <ChatCircleTextIcon weight="bold" />
              </motion.div>{" "}
              Open in chat
            </Link>
          </Button>
        </ButtonWithChatPreview>
      </div>
    </div>
  );
}
