import { createTool } from "@convex-dev/agent";
import z from "zod";
import type { Id } from "../../../_generated/dataModel";
import { type ChartToolResult, generateAndStoreChart } from "./generation";
import { resolveChartData } from "./resolver";

const createOrUpdateChartSchema = z.object({
  task: z.string().describe("Description of the chart to create or modify."),
  datasetId: z.string().optional().describe("Dataset ID to use for the chart."),
  artifactId: z
    .string()
    .optional()
    .describe("Existing chart ID to update or reference."),
});

const chartToolDescription = `Create or update Vega-Lite v5 charts.

Three scenarios of usage:
1. NEW chart with existing dataset: Pass datasetId only
2. UPDATE existing chart (same dataset): Pass artifactId only
3. UPDATE existing chart with different dataset: Pass datasetId + artifactId (to reference the old spec style)

DO NOT include datasetId, artifactId, or any internal metadata in the task.

Task instructions:
- Chart type (bar, line, scatter, pie, etc.)
- Field encodings: x/y axes, color, size
- Interactions: tooltips, filters
- Sorting/aggregations
- Visual styling if needed

Important: the tool can use only Vega Lite features, not full Vega.

Example: "Bar chart showing project count by status. X-axis: status field, Y-axis: count. Color by priority. Add tooltips with status and count. Sort descending by count."`;

export const createOrUpdateChartTool = createTool({
  description: chartToolDescription,
  args: createOrUpdateChartSchema,
  async *handler(ctx, args): AsyncGenerator<ChartToolResult> {
    if (!args.datasetId && !args.artifactId) {
      throw new Error(
        "Either datasetId (for new chart) or artifactId (for updating) must be provided",
      );
    }

    const data = await resolveChartData(ctx, {
      datasetId: args.datasetId as Id<"datasets">,
      artifactId: args.artifactId as Id<"artifacts">,
    });

    yield* generateAndStoreChart(ctx, args.task, data);
  },
});
