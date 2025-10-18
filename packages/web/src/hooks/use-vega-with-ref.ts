import { useUpdateEffect } from "@react-hookz/web";
import { useCallback, useMemo, useRef } from "react";
import { useVegaEmbed } from "react-vega";
import type { VisualizationSpec } from "vega-embed";
import type { RootArtifactData } from "@/lib/types/artifacts";
import { useActiveChart, useArtifactDownload } from "./use-artifacts-store";
import { useNoPropagationCallback } from "./use-no-propagation-callback";

type VegaWithRefOptions = {
  interactive?: boolean;
  withInternalTitle?: boolean;
  metadata: RootArtifactData;
};

export function useVegaWithRef(spec: string, options: VegaWithRefOptions) {
  const activeChart = useActiveChart();
  const { triggered: downloadTriggered, toggle: toggleDownload } =
    useArtifactDownload();

  const ref = useRef<HTMLDivElement>(null);
  const metadata = useRef(options.metadata);

  const currentSpec = useMemo(() => {
    const rawSpec = JSON.parse(spec) as VisualizationSpec;
    if (!options.withInternalTitle) {
      rawSpec.title = undefined;
    }
    return rawSpec;
  }, [spec, options.withInternalTitle]);

  const result = useVegaEmbed({
    ref,
    spec: currentSpec,
    options: {
      actions: false,
      mode: "vega" as const,
      hover: options.interactive ?? false,
      tooltip: options.interactive ?? false,
    },
  });

  const downloadPNG = useCallback(async () => {
    if (!result) {
      console.error("Vega view not ready");
      return;
    }

    try {
      const imageUrl = await result.view.toImageURL("png", 2);
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `${metadata.current.title.replace(/ /g, "_")}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to download chart:", error);
    }
  }, [result]);

  const handleDownload = useNoPropagationCallback<HTMLButtonElement>(
    downloadPNG,
    true,
  );

  useUpdateEffect(() => {
    if (downloadTriggered && activeChart?.rootId === metadata.current.rootId) {
      downloadPNG().finally(toggleDownload);
    }
  }, [downloadTriggered, activeChart]);

  return { ref, handleDownload };
}
