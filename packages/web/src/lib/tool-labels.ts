import { asanaToolLabels } from "asana-tools";
import type { ArcanaToolUIPart } from "@/lib/convex-agent/types";

const artifactsToolLabels = {
  artifacts_listDatasetsTool: {
    "input-streaming": "Listing available datasets...",
    "output-available": "Datasets loaded",
  },
  artifacts_createDatasetTool: {
    "input-streaming": "Creating a dataset...",
    "output-available": "Dataset saved",
  },
  artifacts_createOrUpdateChartTool: {
    "input-streaming": "Generating the chart, may take a minute...",
    "output-available": "Chart created successfully",
  },
};

export const toolLabels = {
  ...asanaToolLabels,
  ...artifactsToolLabels,
};

export type ToolLabels = Record<"input-streaming" | "output-available", string>;

export type ExtractToolName<T extends string> = T extends `tool-${infer U}`
  ? U
  : never;

export type ExtractPackageName<T extends string> =
  T extends `tool-${infer Package}_${string}` ? Package : never;

export type RawArcanaUIToolType = ExtractToolName<ArcanaToolUIPart["type"]>;

export type RawArcanaUIToolPackage = ExtractPackageName<
  ArcanaToolUIPart["type"]
>;
