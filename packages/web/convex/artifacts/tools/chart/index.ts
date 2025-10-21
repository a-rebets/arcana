import { createTool } from "@convex-dev/agent";
import z from "zod";
import type { Id } from "../../../_generated/dataModel";
import { type ChartToolResult, generateAndStoreChart } from "./generation";
import { buildChartPrompt } from "./prompt";
import { resolveChartData } from "./resolver";

const createOrUpdateChartSchema = z.object({
  task: z
    .string()
    .describe(
      "Description of the chart to create or how to modify it. Examples: 'create a bar chart showing projects by status', 'convert this to a line chart', 'add a tooltip showing project names'",
    ),
  datasetId: z
    .string()
    .optional()
    .describe(
      "Dataset ID to create a chart from. Use this for NEW charts. Get this from createDatasetTool or listDatasetsTool.",
    ),
  artifactId: z
    .string()
    .optional()
    .describe(
      "Artifact ID of an existing chart to modify. Use this to UPDATE existing charts.",
    ),
});

const chartToolDescription = `Create or update Vega-Lite v5 charts.

Usage: 'datasetId' for new | 'artifactId' for updates | both for new chart using old as reference.

Write detailed 'task' with:
- Chart type (bar, line, scatter, pie, etc.)
- Field encodings: x/y axes, color, size
- Interactions: tooltips, filters
- Sorting/aggregations
- Visual styling if needed

Example: "Bar chart showing project count by status. X-axis: status field, Y-axis: count aggregation. Color by priority field. Add tooltips with status and count. Sort descending by count."`;

export const createOrUpdateChartTool = createTool({
  description: chartToolDescription,
  args: createOrUpdateChartSchema,
  handler: async (ctx, args): Promise<ChartToolResult> => {
    if (!args.datasetId && !args.artifactId) {
      throw new Error(
        "Either datasetId (for new chart) or artifactId (for updating) must be provided",
      );
    }

    const data = await resolveChartData(ctx, {
      datasetId: args.datasetId as Id<"datasets">,
      artifactId: args.artifactId as Id<"artifacts">,
    });
    const prompt = buildChartPrompt(
      args.task,
      data.dataset,
      data.existingArtifact,
    );

    return await generateAndStoreChart(ctx, prompt, data);
  },
});
