import type { ToolCtx } from "@convex-dev/agent";
import { internal } from "../../../_generated/api";
import type { Id } from "../../../_generated/dataModel";
import type { ResolvedChartData } from "./types";

export async function resolveChartData(
  ctx: ToolCtx,
  args: { datasetId?: Id<"datasets">; artifactId?: Id<"artifacts"> },
): Promise<ResolvedChartData> {
  if (!ctx.threadId || !ctx.userId) {
    throw new Error("Thread ID and user ID are required");
  }

  const existingArtifact = args.artifactId
    ? await ctx.runQuery(internal.artifacts.protected.getArtifact, {
        artifactId: args.artifactId,
      })
    : null;

  if (args.artifactId && !existingArtifact) {
    throw new Error(`Artifact not found: ${args.artifactId}`);
  }

  // Determine which dataset to use
  const datasetId = args.datasetId ?? existingArtifact?.datasetId;

  if (!datasetId) {
    throw new Error("No dataset provided");
  }

  const dataset = await ctx.runQuery(internal.artifacts.protected.getDataset, {
    datasetId,
  });

  if (!dataset) {
    throw new Error("Dataset not found");
  }

  const isUpdate = existingArtifact && !args.datasetId;

  return {
    dataset,
    existingArtifact,
    rootArtifactId: isUpdate
      ? (existingArtifact.rootArtifactId ?? existingArtifact._id)
      : undefined,
    version: isUpdate ? existingArtifact.version + 1 : 1,
  };
}
