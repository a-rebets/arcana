import {
  useDebouncedState,
  useDeepCompareEffect,
  useUpdateEffect,
} from "@react-hookz/web";
import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { useCarousel } from "@/components/ui/carousel";
import type { ArtifactData } from "@/lib/types/artifacts";
import {
  useActiveChart,
  useArtifactsVersionActions,
} from "./use-artifacts-store";

export function useArtifactsCarousel(
  threadId: string,
  artifacts: ArtifactData[] | undefined,
) {
  const [isReady, setReady] = useDebouncedState(false, 300);

  const [searchParams, setSearchParams] = useSearchParams();
  const actions = useArtifactsVersionActions();
  const activeChart = useActiveChart();

  const {
    index: carouselIndex,
    setIndex: setCarouselIndex,
    setItemsCount,
  } = useCarousel();
  const { reset, syncVersionStates, setActiveChart } = actions;

  // biome-ignore lint/correctness/useExhaustiveDependencies: have to react only to thread change
  useEffect(() => {
    reset();
    setReady(false);
    setCarouselIndex(0);
    setItemsCount(artifacts?.length ?? 0);
  }, [threadId]);

  useDeepCompareEffect(() => {
    if (!artifacts?.length) return;

    const openedChartId = searchParams.get("artifact");
    const currentChartId = activeChart?.rootId ?? openedChartId;
    const versionMap = Object.fromEntries(
      artifacts.map((a) => [a.rootId, a.versions.length]),
    );
    syncVersionStates(versionMap);

    if (openedChartId) setSearchParams({});
    if (currentChartId) {
      const newIndex = artifacts.findIndex((a) => a.rootId === currentChartId);
      if (newIndex !== -1) {
        setCarouselIndex(newIndex);
        setReady(true);
      }
      return;
    }

    setCarouselIndex(artifacts.length - 1);
    setReady(true);
  }, [artifacts]);

  // Update active chart when user navigates (clicks prev/next, swipes)
  useUpdateEffect(() => {
    if (!artifacts?.length) return;
    const next = artifacts[carouselIndex];
    if (activeChart?.rootId !== next.rootId) {
      setActiveChart({ rootId: next.rootId, title: next.title });
    }
  }, [carouselIndex]);

  // Update carousel index when active chart is changed externally
  useUpdateEffect(() => {
    if (!activeChart || !artifacts?.length) return;
    const switchedChartIndex = artifacts.findIndex(
      (a) => a.rootId === activeChart.rootId,
    );
    if (switchedChartIndex < 0) return;
    setCarouselIndex(switchedChartIndex);
  }, [activeChart]);

  return { isReady };
}
