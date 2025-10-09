import type { InferUITools } from "ai";
import { createOrUpdateChartTool } from "./tools/chart";
import { createDatasetTool, listDatasetsTool } from "./tools/dataset";

export * from "./schemas";

export const artifactsTools = {
  datasets_createDatasetTool: createDatasetTool,
  datasets_listDatasetsTool: listDatasetsTool,
  charts_createOrUpdateChartTool: createOrUpdateChartTool,
};

export type ArtifactsTools = InferUITools<typeof artifactsTools>;
