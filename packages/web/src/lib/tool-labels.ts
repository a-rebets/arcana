import { asanaToolLabels } from "asana-tools";
import type { ArcanaToolUIPart } from "@/lib/convex-agent/types";

const artifactsToolLabels = {
  datasets_listDatasetsTool: {
    "input-streaming": "Checking existing datasets...",
    "output-available": "Checked your datasets",
    "output-error": "Failed to check your datasets",
  },
  datasets_createDatasetTool: {
    "input-streaming": "Creating a dataset...",
    "output-available": "Dataset saved",
    "output-error": "Failed to create dataset",
  },
  charts_createOrUpdateChartTool: {
    "input-streaming": "Generating the chart, may take a minute...",
    "output-available": "Chart created successfully",
    "output-error": "Failed to create the chart",
  },
} as const;

export const toolLabels = {
  ...asanaToolLabels,
  ...artifactsToolLabels,
};

export type ToolLabels = Record<
  "input-streaming" | "output-available" | "output-error",
  string
>;

export type ExtractToolName<T extends string> = T extends `tool-${infer U}`
  ? U
  : never;

export type ExtractPackageName<T extends string> =
  T extends `tool-${infer Package}_${string}` ? Package : never;

export type RawArcanaUIToolType = ExtractToolName<ArcanaToolUIPart["type"]>;

export type RawArcanaUIToolPackage = ExtractPackageName<
  ArcanaToolUIPart["type"]
>;
