import { api } from "@convex/api";
import { useQuery } from "convex/react";
import { useRef } from "react";
import { useVegaEmbed } from "react-vega";
import type { EmbedOptions, VisualizationSpec } from "vega-embed";
import { CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useChatId } from "@/lib/convex-agent";

const options: EmbedOptions = {
  actions: false,
};

export function ArtifactsContent() {
  const threadId = useChatId();
  const artifacts = useQuery(
    api.artifacts.public.listArtifactsByThread,
    threadId
      ? {
          threadId: threadId,
        }
      : "skip",
  );

  return (
    <CarouselContent>
      {artifacts?.map((artifact) => (
        <CarouselItem className="p-4 aspect-video" key={artifact.id}>
          <Artifact spec={JSON.parse(artifact.vegaSpec)} />
        </CarouselItem>
      ))}
    </CarouselContent>
  );
}

function Artifact({ spec }: { spec: VisualizationSpec }) {
  const ref = useRef<HTMLDivElement>(null);
  useVegaEmbed({ ref, spec, options });

  return (
    <div className="flex size-full items-center justify-center" ref={ref} />
  );
}
