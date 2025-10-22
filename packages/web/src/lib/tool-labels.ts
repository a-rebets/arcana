import { asanaToolLabels } from "asana-tools";
import type { ArcanaToolUIPart } from "@/lib/convex-agent/types";

export type DynamicToolOutput = Extract<
  ArcanaToolUIPart["output"],
  { message: string }
>;

export type ToolLabels<T = string> = {
  "input-streaming": string;
  "output-available": T;
  "output-error": string;
};

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
    "input-streaming": "Processing the chart request...",
    "output-available": { field: "message" } as const,
    "output-error": "Failed to create the chart",
  },
};

export const toolLabels: Record<
  string,
  ToolLabels<string | { field: keyof DynamicToolOutput }>
> = {
  ...asanaToolLabels,
  ...artifactsToolLabels,
};

export type ExtractToolName<T extends string> = T extends `tool-${infer U}`
  ? U
  : never;

export type ExtractPackageName<T extends string> =
  T extends `tool-${infer Package}_${string}` ? Package : never;

export type RawArcanaUIToolType = ExtractToolName<ArcanaToolUIPart["type"]>;

export type RawArcanaUIToolPackage = ExtractPackageName<
  ArcanaToolUIPart["type"]
>;
