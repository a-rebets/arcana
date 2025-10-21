import type { ToolCtx } from "@convex-dev/agent";
import type { LanguageModelV2 } from "@openrouter/ai-sdk-provider";
import z from "zod";
import { internal } from "../../../_generated/api";
import type { Id } from "../../../_generated/dataModel";
import { chartsAgent } from "../../../ai/agent";
import type { ResolvedChartData } from "./types";

const vegaLiteOutputSchema = z.object({
  title: z
    .string()
    .describe(
      "A concise, descriptive title for the chart (e.g., 'Projects by Status', 'Task Completion Over Time')",
    ),
  spec: z.string().describe("The complete Vega-Lite v5 specification JSON"),
});

export type ChartToolResult = {
  artifactId: Id<"artifacts">;
  title: string;
  version: number;
  message: string;
};

const chartModel = (chartsAgent.options.languageModel as LanguageModelV2)
  .modelId;

export async function generateAndStoreChart(
  ctx: ToolCtx,
  prompt: string,
  data: ResolvedChartData,
): Promise<ChartToolResult> {
  if (!ctx.userId || !ctx.threadId) {
    throw new Error("User ID and thread ID are required");
  }

  const isUpdate = !!data.rootArtifactId;

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
            effort: isUpdate ? "low" : "medium",
          },
        },
      },
    },
  );

  let artifactId: Id<"artifacts">;
  try {
    artifactId = await ctx.runAction(
      internal.artifacts.vega.processAndStoreChart,
      {
        title: isUpdate ? "" : result.object.title,
        vlSpec: result.object.spec,
        dataset: data.dataset.rows,
        datasetId: data.dataset._id,
        threadId: ctx.threadId,
        userId: ctx.userId as Id<"users">,
        rootArtifactId: data.rootArtifactId,
        version: data.version,
        modelUsed: chartModel,
      },
    );
  } catch (error) {
    // Convex serializes action errors as strings with "Uncaught X:" prefix
    // Re-throw as Error so AI SDK treats it as a tool execution error
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(errorMessage.replace(/^Uncaught\s+\w+:\s*/, ""));
  }

  return {
    artifactId,
    title: data.existingArtifact?.title ?? result.object.title,
    version: data.version,
    message: `Chart ${isUpdate ? "updated" : "created"} successfully`,
  };
}
