import { useMemo, useRef } from "react";
import { useVegaEmbed } from "react-vega";
import type { VisualizationSpec } from "vega-embed";
import { useNoPropagationCallback } from "./use-no-propagation-callback";

type VegaWithRefOptions = {
  interactive?: boolean;
};

export function useVegaWithRef(spec: string, options: VegaWithRefOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);

  const currentSpec = useMemo(() => {
    const rawSpec = JSON.parse(spec) as VisualizationSpec;
    rawSpec.title = undefined;
    return rawSpec;
  }, [spec]);

  const embedOptions = useMemo(
    () => ({
      actions: false,
      mode: "vega" as const,
      hover: options.interactive ?? false,
      tooltip: options.interactive ?? false,
    }),
    [options.interactive],
  );

  const result = useVegaEmbed({
    ref,
    spec: currentSpec,
    options: embedOptions,
  });

  const downloadPNG = useNoPropagationCallback<HTMLButtonElement>(async () => {
    if (!result) {
      console.error("Vega view not ready");
      return;
    }

    try {
      const imageUrl = await result.view.toImageURL("png", 2);
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = "chart.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to download chart:", error);
    }
  }, true);

  return { ref, downloadPNG };
}
