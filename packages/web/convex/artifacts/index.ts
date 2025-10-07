import type { InferUITools } from "ai";
import { createOrUpdateChartTool } from "./tools/chart";
import { createDatasetTool, listDatasetsTool } from "./tools/dataset";

export * from "./schemas";

export const artifactsTools = {
  artifacts_createDatasetTool: createDatasetTool,
  artifacts_listDatasetsTool: listDatasetsTool,
  artifacts_createOrUpdateChartTool: createOrUpdateChartTool,
};

export type ArtifactsTools = InferUITools<typeof artifactsTools>;
