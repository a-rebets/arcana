import { useMemo, useRef } from "react";
import { useVegaEmbed } from "react-vega";
import type { VisualizationSpec } from "vega-embed";

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

  useVegaEmbed({
    ref,
    spec: currentSpec,
    options: embedOptions,
  });

  return ref;
}
