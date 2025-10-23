import type { ToolCtx } from "@convex-dev/agent";
import type { LanguageModelV2 } from "@openrouter/ai-sdk-provider";
import z from "zod";
import { internal } from "../../../_generated/api";
import type { Id } from "../../../_generated/dataModel";
import { chartsAgent } from "../../../ai/agent";
import { buildChartPrompt, buildChartRetryPrompt } from "./prompt";
import type { ResolvedChartData } from "./types";

const vegaLiteOutputSchema = z.object({
  title: z
    .string()
    .max(65, "Title is too long")
    .describe(
      "A concise, descriptive title for the chart (40-60 characters max). Examples: 'Projects by Status', 'Product Sales YoY 2023-2025'",
    ),
  spec: z.string().describe("The complete Vega-Lite v5 specification JSON"),
});

export type ChartToolResult =
  | {
      message: string;
    }
  | {
      artifactId: Id<"artifacts">;
      title: string;
      version: number;
      message: string;
    };

const MAX_RETRY_ATTEMPTS = 2;
const chartModel = (chartsAgent.options.languageModel as LanguageModelV2)
  .modelId;

export async function* generateAndStoreChart(
  ctx: ToolCtx,
  task: string,
  data: ResolvedChartData,
): AsyncGenerator<ChartToolResult> {
  if (!ctx.userId || !ctx.threadId) {
    throw new Error("User ID and thread ID are required");
  }

  const isUpdate = !!data.rootArtifactId;

  async function generateSpec(
    prompt: string,
    reasoningEffort: "low" | "medium",
  ) {
    const { object } = await chartsAgent.generateObject(
      ctx,
      { userId: ctx.userId },
      {
        prompt,
        schema: vegaLiteOutputSchema,
        providerOptions: {
          openrouter: { reasoning: { effort: reasoningEffort } },
        },
      },
    );
    return object;
  }

  async function tryValidateAndStore(generated: {
    title: string;
    spec: string;
  }): Promise<
    | { success: true; output: ChartToolResult }
    | { success: false; error: string }
  > {
    try {
      const vegaSpec = await validateAndCompileSpec(
        ctx,
        generated.spec,
        data.dataset.rows,
      );
      const artifactId = await ctx.runMutation(
        internal.artifacts.protected.createArtifact,
        {
          title: isUpdate ? "" : generated.title,
          vlSpec: generated.spec,
          vegaSpec,
          datasetId: data.dataset._id,
          threadId: ctx.threadId as string,
          userId: ctx.userId as Id<"users">,
          rootArtifactId: data.rootArtifactId,
          version: data.version,
          modelUsed: chartModel,
          type: "vega-lite" as const,
        },
      );

      return {
        success: true,
        output: {
          artifactId: data.rootArtifactId ?? artifactId,
          title: data.existingArtifact?.title ?? generated.title,
          version: data.version,
          message: `Chart ${isUpdate ? "updated" : "created"} successfully`,
        },
      };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  const initialPrompt = buildChartPrompt(
    task,
    data.dataset,
    data.existingArtifact,
  );

  yield { message: "Generating the chart, may take a minute..." };

  let generatedResult = await generateSpec(
    initialPrompt,
    isUpdate ? "low" : "medium",
  );
  let lastError: string | null = null;

  for (let attempt = 0; attempt < MAX_RETRY_ATTEMPTS; attempt++) {
    const result = await tryValidateAndStore(generatedResult);

    if (result.success) {
      yield result.output;
      return;
    }

    lastError = result.error;

    if (attempt < MAX_RETRY_ATTEMPTS - 1) {
      yield { message: "Fixing errors..." };
      const retryPrompt = buildChartRetryPrompt(
        task,
        data.dataset,
        generatedResult.spec,
        result.error,
      );
      generatedResult = await generateSpec(retryPrompt, "low");
    }
  }

  throw new Error(
    `Failed to generate valid chart after ${MAX_RETRY_ATTEMPTS} attempts: ${lastError}`,
  );
}

async function validateAndCompileSpec(
  ctx: ToolCtx,
  vlSpec: string,
  dataset: ResolvedChartData["dataset"]["rows"],
) {
  const validation = await ctx.runAction(
    internal.artifacts.vega.validateVLSpec,
    { vlSpec },
  );

  if (!validation.valid) {
    throw new Error(`Invalid Vega-Lite specification: ${validation.errors}`);
  }

  return await ctx.runAction(internal.artifacts.vega.compileVLSpec, {
    vlSpec,
    dataset,
  });
}
