import { createTool } from "@convex-dev/agent";
import type { LanguageModelV2 } from "@openrouter/ai-sdk-provider";
import { z } from "zod";
import { internal } from "../../_generated/api";
import type { Doc, Id } from "../../_generated/dataModel";
import { chartsAgent } from "../../ai/agent";

const vegaLiteOutputSchema = z.object({
  spec: z.string().describe("The complete Vega-Lite v5 specification JSON"),
});

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

function generateNewChartPrompt(
  task: string,
  schema: string,
  datasetName: string,
): string {
  return `${task}

Dataset Title: "${datasetName}"

Dataset Schema:
\`\`\`
${schema}
\`\`\``;
}

function generateModifyChartPrompt(
  task: string,
  existingArtifact: Doc<"artifacts">,
  schema: string,
  datasetName: string,
): string {
  return `${task}

Current Vega-Lite Spec:
\`\`\`json
${JSON.stringify(existingArtifact.vlSpec, null, 2)}
\`\`\`

Dataset Title: "${datasetName}"

Dataset Schema:
\`\`\`
${schema}
\`\`\``;
}

const chartModel = (chartsAgent.options.languageModel as LanguageModelV2)
  .modelId;

const createOrUpdateChartTool = createTool({
  description:
    "Create a new chart from a dataset OR modify an existing chart. The task parameter describes what visualization the user wants.",
  args: createOrUpdateChartSchema,
  handler: async (ctx, args): Promise<string> => {
    if (!args.datasetId && !args.artifactId) {
      throw new Error(
        "Either datasetId (for new chart) or artifactId (for updating) must be provided",
      );
    }

    if (!ctx.threadId || !ctx.userId) {
      throw new Error("Thread ID and user ID are required");
    }

    let dataset: Doc<"datasets"> | null = null;
    let existingArtifact: Doc<"artifacts"> | null = null;
    let parentArtifactId: Id<"artifacts"> | undefined;

    if (args.datasetId) {
      dataset = await ctx.runQuery(internal.artifacts.protected.getDataset, {
        datasetId: args.datasetId as Id<"datasets">,
      });

      if (!dataset) {
        throw new Error(`Dataset not found: ${args.datasetId}`);
      }
    }

    if (args.artifactId) {
      existingArtifact = await ctx.runQuery(
        internal.artifacts.protected.getArtifact,
        {
          artifactId: args.artifactId as Id<"artifacts">,
        },
      );

      if (!existingArtifact) {
        throw new Error(`Artifact not found: ${args.artifactId}`);
      }

      dataset = await ctx.runQuery(internal.artifacts.protected.getDataset, {
        datasetId: existingArtifact.datasetId,
      });

      parentArtifactId = existingArtifact._id;
    }

    if (!dataset) {
      throw new Error("Unable to find dataset for chart generation");
    }

    const prompt = existingArtifact
      ? generateModifyChartPrompt(
          args.task,
          existingArtifact,
          dataset.schema ?? "",
          dataset.name,
        )
      : generateNewChartPrompt(args.task, dataset.schema ?? "", dataset.name);

    const result = await chartsAgent.generateObject(
      ctx,
      { userId: ctx.userId },
      {
        prompt,
        schema: vegaLiteOutputSchema,
        providerOptions: {
          openrouter: {
            reasoning: {
              enabled: true,
              effort: args.artifactId ? "low" : "medium",
            },
          },
        },
      },
    );

    const artifactId = await ctx.runAction(
      internal.artifacts.vega.processAndStoreChart,
      {
        spec: result.object.spec,
        dataset: dataset.rows,
        datasetId: dataset._id,
        threadId: ctx.threadId,
        userId: ctx.userId as Id<"users">,
        parentArtifactId: parentArtifactId,
        modelUsed: chartModel,
      },
    );

    return `Chart created with ID: \`${artifactId}\``;
  },
});

export { createOrUpdateChartTool };
