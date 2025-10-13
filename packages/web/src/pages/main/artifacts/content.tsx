import { api } from "@convex/api";
import { convexQuery } from "@convex-dev/react-query";
import { useDeepCompareEffect, useUpdateEffect } from "@react-hookz/web";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useRef } from "react";
import { useVegaEmbed } from "react-vega";
import type { EmbedOptions } from "vega-embed";
import PlaceholderIcon from "@/assets/charts-placeholder.svg?react";
import {
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel";
import { Spinner } from "@/components/ui/spinner";
import {
  useActiveChart,
  useArtifactsVersionActions,
  useVersionState,
} from "@/hooks/use-artifacts-store";
import { useChatId } from "@/lib/convex-agent";
import type { ArtifactData } from "@/lib/types/artifacts";

const options: EmbedOptions = {
  actions: false,
};

export function ArtifactsContent() {
  const threadId = useChatId();

  const { index: carouselIndex, setIndex: setCarouselIndex } = useCarousel();
  const { syncVersionStates, setActiveChart, reset } =
    useArtifactsVersionActions();
  const activeChart = useActiveChart();

  const { data: artifacts, isFetching } = useQuery(
    convexQuery(
      api.artifacts.public.listArtifactChainsForThread,
      threadId ? { threadId } : "skip",
    ),
  );

  const noArtifacts = !artifacts || artifacts.length === 0;

  useUpdateEffect(() => {
    reset();
    setCarouselIndex(0);
  }, [threadId]);

  useDeepCompareEffect(() => {
    if (noArtifacts) return;

    const versionMap = Object.fromEntries(
      artifacts.map((a) => [a.rootId, a.versions.length]),
    );
    syncVersionStates(versionMap);

    // Try to maintain position on the same chart
    if (activeChart) {
      const newIndex = artifacts.findIndex((a) => a.rootId === activeChart);
      if (newIndex !== -1 && newIndex !== carouselIndex) {
        setCarouselIndex(newIndex);
        return;
      }
      if (newIndex !== -1) return;
    }

    // Fallback: No active chart OR active chart was deleted
    setCarouselIndex(0);
    setActiveChart(artifacts[0].rootId);
  }, [artifacts]);

  // Update active chart when user navigates (clicks prev/next, swipes)
  useUpdateEffect(() => {
    if (noArtifacts) return;
    setActiveChart(artifacts[carouselIndex].rootId);
  }, [carouselIndex]);

  return (
    <CarouselContent>
      {noArtifacts ? (
        <Placeholder loading={isFetching} />
      ) : (
        artifacts.map((chain) => (
          <CarouselItem className="p-4 aspect-video" key={chain.rootId}>
            <Artifact data={chain} />
          </CarouselItem>
        ))
      )}
    </CarouselContent>
  );
}

function Artifact({ data }: { data: ArtifactData }) {
  const ref = useRef<HTMLDivElement>(null);
  const versionState = useVersionState(data.rootId);

  const spec = useMemo(() => {
    const [selectedIndex] = versionState || [data.versions.length - 1, 0];
    const version = data.versions[selectedIndex];
    return JSON.parse(version.vegaSpec);
  }, [data.versions, versionState]);

  useVegaEmbed({ ref, spec, options });

  return (
    <div className="flex size-full items-center justify-center" ref={ref} />
  );
}

function Placeholder({ loading }: { loading: boolean }) {
  return (
    <div className="flex w-full items-center flex-col gap-2 text-muted-foreground/60 dark:text-muted-foreground/80 pb-24 select-none">
      {loading ? (
        <Spinner
          variant="infinite"
          className="size-20 text-muted-foreground/50 dark:text-muted-foreground/30"
          strokeWidth={6}
        />
      ) : (
        <>
          <PlaceholderIcon className="md:size-64 size-36" />
          <h2 className="font-display md:text-3xl text-2xl md:font-medium mb-1">
            No artifacts found
          </h2>
          <p className="text-base font-light">
            Ask the agent to generate a chart, it will appear here
          </p>
        </>
      )}
    </div>
  );
}
