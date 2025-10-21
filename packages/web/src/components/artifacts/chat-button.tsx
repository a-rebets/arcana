import { CaretRightIcon, PresentationChartIcon } from "@phosphor-icons/react";
import { useCallback } from "react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import {
  useArtifactsPanelActions,
  useArtifactsVersionActions,
} from "@/hooks/use-artifacts-store";
import type { ArcanaChartToolResult } from "@/lib/convex-agent";
import { cn } from "@/lib/utils";

export function ArtifactChatButton({
  className,
  data,
}: {
  data: ArcanaChartToolResult["output"];
  className?: string;
}) {
  const { open } = useArtifactsPanelActions();
  const { setSelectedVersion, setActiveChart } = useArtifactsVersionActions();

  const handleClick = useCallback(() => {
    open();
    setActiveChart({ rootId: data.artifactId, title: data.title });
    setSelectedVersion(data.artifactId, data.version - 1);
  }, [data, open, setSelectedVersion, setActiveChart]);

  if (!data.title) return null;

  return (
    <Button
      onClick={handleClick}
      className={cn(
        "group h-auto gap-4 py-3 has-[>svg]:px-4 text-left rounded-2xl max-w-md",
        className,
      )}
      variant="outline"
      hoverScale={1.01}
      tapScale={0.99}
    >
      <PresentationChartIcon className="size-6" />
      <div className="space-y-1 min-w-0">
        <h3 className="truncate font-display font-normal">{data.title}</h3>
        <p className="rounded-full border border-primary/50 text-primary/60 px-2 py-0.5 text-xs w-fit font-semibold">
          Version {data.version}
        </p>
      </div>
      <CaretRightIcon
        className="opacity-60 transition-transform group-hover:translate-x-0.5"
        size={16}
        aria-hidden="true"
      />
    </Button>
  );
}
