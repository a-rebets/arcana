import { api } from "@convex/api";
import { useDeepCompareEffect, useUpdateEffect } from "@react-hookz/web";
import { useQuery } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import { useMemo, useRef } from "react";
import { useVegaEmbed } from "react-vega";
import type { EmbedOptions } from "vega-embed";
import {
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel";
import {
  useArtifactsVersionActions,
  useVersionState,
} from "@/hooks/use-artifacts-store";
import { useChatId } from "@/lib/convex-agent";

const options: EmbedOptions = {
  actions: false,
};

type ArtifactData = FunctionReturnType<
  typeof api.artifacts.public.listArtifactChainsForThread
>[number];

export function ArtifactsContent() {
  const threadId = useChatId();
  const artifacts = useQuery(
    api.artifacts.public.listArtifactChainsForThread,
    threadId ? { threadId } : "skip",
  );
  const { syncVersionStates, setActiveChart, reset } =
    useArtifactsVersionActions();
  const carousel = useCarousel();

  useDeepCompareEffect(() => {
    if (!artifacts) return;
    const versionMap = Object.fromEntries(
      artifacts.map((a) => [a.rootId, a.versions.length]),
    );
    syncVersionStates(versionMap);
  }, [artifacts]);

  useDeepCompareEffect(() => {
    const activeArtifact = artifacts?.[carousel.index];
    if (activeArtifact) {
      setActiveChart(activeArtifact.rootId);
    }
  }, [artifacts, carousel.index]);

  useUpdateEffect(reset, [threadId]);

  return (
    <CarouselContent>
      {artifacts?.map((chain) => (
        <CarouselItem className="p-4 aspect-video" key={chain.rootId}>
          <Artifact data={chain} />
        </CarouselItem>
      ))}
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
