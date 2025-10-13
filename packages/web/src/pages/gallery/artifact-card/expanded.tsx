import { api } from "@convex/api";
import { convexQuery } from "@convex-dev/react-query";
import { ChatCircleTextIcon, DownloadSimpleIcon } from "@phosphor-icons/react";
import {
  useDeepCompareEffect,
  useDeepCompareMemo,
  useMountEffect,
} from "@react-hookz/web";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
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
  useArtifactsVersionActions,
  useVersionState,
} from "@/hooks/use-artifacts-store";
import { useVegaWithRef } from "@/hooks/use-vega-with-ref";
import { cn, formatRelativeTime } from "@/lib/utils";

export function ExpandedArtifact() {
  const { title, rootId, creationTime, isRoot } = useArtifactCard();
  const { setActiveChart, setSelectedIndex } = useArtifactsVersionActions();

  useMountEffect(() => {
    setActiveChart(rootId);
    setSelectedIndex(rootId, -1);
  });

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
        <MorphingDialogSubtitle className="text-muted-foreground text-sm w-fit">
          {isRoot ? "Created" : "Updated"} {formatRelativeTime(creationTime)}
        </MorphingDialogSubtitle>
      </section>
      <ExpandedArtifactChart />
      <ExpandedArtifactInfoRow className="pb-2" />
      <MorphingDialogClose className="right-4 top-4 bg-input/40 hover:bg-input/70 dark:bg-muted dark:hover:bg-muted/80 text-muted-foreground rounded-full" />
    </MorphingDialogContent>
  );
}

function ExpandedArtifactChart() {
  const { rootId, vegaSpec: initialSpec } = useArtifactCard();

  const versionState = useVersionState(rootId);
  const { syncVersionStates } = useArtifactsVersionActions();

  const { data: artifacts } = useQuery(
    convexQuery(api.artifacts.public.getArtifactChainById, {
      artifactId: rootId,
    }),
  );
  useDeepCompareEffect(() => {
    if (!artifacts) return;
    console.log("syncing version states", artifacts.versions.length);
    syncVersionStates({
      [rootId]: artifacts.versions.length,
    });
  }, [artifacts]);

  const versionSpec = useDeepCompareMemo(() => {
    if (!artifacts) return null;
    const [selectedIndex] = versionState || [artifacts.versions.length - 1, 0];
    const version = artifacts.versions[selectedIndex];
    return version.vegaSpec;
  }, [artifacts, versionState]);

  const ref = useVegaWithRef(versionSpec ?? initialSpec, {
    interactive: true,
  });

  return (
    <div
      className="w-full aspect-video border dark:border-none rounded-xl overflow-clip [&>form]:absolute [&>form]:bottom-2 [&>form]:right-2 relative [&>form]:rounded-xl [&>form:empty]:bg-transparent [&>form:not(:empty)]:bg-accent/50 [&>form]:py-2 [&>form]:px-3"
      ref={ref}
    />
  );
}

function ExpandedArtifactInfoRow({ className }: { className?: string }) {
  const { rootId } = useArtifactCard();

  return (
    <div className={cn("flex w-full justify-between items-center", className)}>
      <ArtifactVersionPicker />
      <div className="flex gap-2">
        <Button variant="outline" className="rounded-xl">
          <motion.div layoutId={`download-icon-${rootId}`}>
            <DownloadSimpleIcon />
          </motion.div>{" "}
          Download PNG
        </Button>
        <Button className="rounded-xl bg-linear-to-b from-primary to-ring">
          <motion.div layoutId={`chat-icon-${rootId}`}>
            <ChatCircleTextIcon weight="bold" />
          </motion.div>{" "}
          Open in chat
        </Button>
      </div>
    </div>
  );
}
