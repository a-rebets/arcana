import { api } from "@convex/api";
import { convexQuery } from "@convex-dev/react-query";
import { useDeepCompareEffect, useUpdateEffect } from "@react-hookz/web";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useSearchParams } from "react-router";
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
import { useVegaWithRef } from "@/hooks/use-vega-with-ref";
import { useChatId } from "@/lib/convex-agent";
import type { ArtifactData } from "@/lib/types/artifacts";
import { cn } from "@/lib/utils";

export function ArtifactsContent({
  itemClassName,
  mobile,
}: {
  itemClassName?: string;
  mobile?: boolean;
}) {
  const threadId = useChatId();
  const [searchParams, setSearchParams] = useSearchParams();

  const { index: carouselIndex, setIndex: setCarouselIndex } = useCarousel();
  const { syncVersionStates, setActiveChart, reset } =
    useArtifactsVersionActions();
  const activeChart = useActiveChart();

  const { data: artifacts, isLoading } = useQuery(
    convexQuery(
      api.artifacts.public.listArtifactChainsForThread,
      threadId ? { threadId } : "skip",
    ),
  );

  useUpdateEffect(() => {
    reset();
    setCarouselIndex(0);
  }, [threadId]);

  useDeepCompareEffect(() => {
    if (!artifacts?.length) return;

    const currentChart = activeChart ?? {
      rootId: searchParams.get("artifact"),
    };
    const versionMap = Object.fromEntries(
      artifacts.map((a) => [a.rootId, a.versions.length]),
    );
    syncVersionStates(versionMap);

    // Try to maintain position on the same chart
    if (currentChart.rootId) {
      setSearchParams({});
      const newIndex = artifacts.findIndex(
        (a) => a.rootId === currentChart.rootId,
      );
      if (newIndex !== -1 && newIndex !== carouselIndex) {
        setCarouselIndex(newIndex);
        return;
      }
      if (newIndex !== -1) return;
    }

    const { rootId, title } = artifacts[0];
    setCarouselIndex(0);
    setActiveChart({ rootId, title });
  }, [artifacts]);

  // Update active chart when user navigates (clicks prev/next, swipes)
  useUpdateEffect(() => {
    if (!artifacts?.length) return;
    const next = artifacts[carouselIndex];
    if (activeChart?.rootId !== next.rootId) {
      setActiveChart({ rootId: next.rootId, title: next.title });
    }
  }, [carouselIndex, artifacts, activeChart]);

  return (
    <CarouselContent>
      {!artifacts?.length ? (
        <Placeholder loading={isLoading} />
      ) : (
        artifacts.map((chain) => (
          <Artifact
            key={chain.rootId}
            data={chain}
            className={itemClassName}
            withTitle={mobile}
          />
        ))
      )}
    </CarouselContent>
  );
}

type ArtifactProps = {
  data: ArtifactData;
  className?: string;
  withTitle?: boolean;
};

function Artifact({ data, className, withTitle }: ArtifactProps) {
  const versionState = useVersionState(data.rootId);

  const spec = useMemo(() => {
    const [selectedIndex] = versionState || [data.versions.length - 1, 0];
    const version = data.versions[selectedIndex];
    return version.vegaSpec;
  }, [data.versions, versionState]);

  const { ref } = useVegaWithRef(spec, {
    interactive: true,
    withInternalTitle: withTitle,
    metadata: { rootId: data.rootId, title: data.title },
  });

  return (
    <CarouselItem className={cn("p-4 aspect-video", className)}>
      <div
        className="size-full [&>form]:absolute [&>form]:bottom-2 [&>form]:right-2 relative [&>form]:rounded-xl [&>form:empty]:bg-transparent [&>form:not(:empty)]:bg-accent/50 [&>form]:py-2 [&>form]:px-3"
        ref={ref}
      />
    </CarouselItem>
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
          <p className="text-base font-light md:max-w-none max-w-64 text-pretty text-center">
            Ask the agent to generate a chart, it will appear here
          </p>
        </>
      )}
    </div>
  );
}
