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
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useVegaWithRef } from "@/hooks/use-vega-with-ref";
import { cn, formatRelativeTime } from "@/lib/utils";
import { ButtonWithChatPreview } from "./chat-preview";

export function ExpandedArtifactCard() {
  const isMobile = useIsMobile();
  const { title, rootId, creationTime, isRoot } = useArtifactCard();
  const { setActiveChart, reset } = useArtifactsVersionActions();

  useMountEffect(() => {
    setActiveChart({ rootId, title });
  });
  useUnmountEffect(reset);

  return (
    <MorphingDialogContent
      style={{
        borderRadius: isMobile ? "20px" : "24px",
        padding: isMobile ? "1.1rem 0.75rem" : "1rem",
        aspectRatio: isMobile ? "4/6" : "4/3",
      }}
      className="pointer-events-auto relative flex flex-col border bg-card gap-y-4 justify-between w-full sm:w-[60vw] md:w-[70vw] xl:w-[50vw]"
    >
      <section className="px-0.5 space-y-1">
        <MorphingDialogTitle className="w-fit md:text-2xl text-xl">
          {title}
        </MorphingDialogTitle>
        <MorphingDialogSubtitle className="text-muted-foreground md:text-base text-sm w-fit">
          {isRoot ? "Created" : "Updated"} {formatRelativeTime(creationTime)}
        </MorphingDialogSubtitle>
      </section>
      <Chart />
      <ActionsRow />
      <MorphingDialogClose className="md:right-4 md:top-4 right-1/2 translate-x-1/2 md:translate-x-0 top-auto -bottom-16 md:bottom-auto md:bg-input/40 md:hover:bg-input/70 md:dark:bg-muted md:dark:hover:bg-muted/80 bg-accent text-accent-foreground md:text-accent-foreground/60 rounded-full" />
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
    <div className="relative w-full">
      <motion.div
        className="w-full aspect-[4/3] md:aspect-video border dark:border-0 rounded-xl overflow-clip [&>form]:absolute [&>form]:bottom-2 [&>form]:right-2 relative [&>form]:rounded-xl [&>form:empty]:bg-transparent [&>form:not(:empty)]:bg-accent/50 [&>form]:py-2 [&>form]:px-3"
        ref={ref}
      />
      {/* Hack to not use the target chart for layout animations */}
      <motion.div
        layoutId={`chart-${rootId}`}
        className="absolute opacity-0 pointer-events-none top-1/4 md:top-0 left-0 w-full aspect-video rounded-2xl"
      />
    </div>
  );
}

type ActionsRowProps = {
  className?: string;
};

function ActionsRow({ className }: ActionsRowProps) {
  const isMobile = useIsMobile();
  const { rootId, threadId } = useArtifactCard();
  const { toggle: toggleDownload } = useArtifactDownload();

  return (
    <section
      className={cn(
        "grid grid-cols-2 gap-y-6 gap-x-2 md:grid-cols-[1fr_auto_auto] w-full pb-1",
        className,
      )}
    >
      <ArtifactVersionPicker className="w-full md:w-48" />
      <Button
        variant="outline"
        className="rounded-xl col-start-1 md:col-start-2"
        onClick={toggleDownload}
      >
        <motion.div layoutId={isMobile ? undefined : `download-icon-${rootId}`}>
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
    </section>
  );
}
