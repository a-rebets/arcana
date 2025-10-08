import { vThreadDoc } from "@convex-dev/agent";
import { query } from "../_generated/server";

export const listArtifactsByThread = query({
  args: {
    threadId: vThreadDoc.fields._id,
  },
  handler: async (ctx, args) => {
    const artifacts = await ctx.db
      .query("artifacts")
      .withIndex("by_thread", (q) => q.eq("threadId", args.threadId))
      .order("desc")
      .collect();

    return artifacts.map((artifact) => ({
      id: artifact._id,
      vlSpec: artifact.vlSpec,
      vegaSpec: artifact.vegaSpec,
      datasetId: artifact.datasetId,
      createdAt: artifact._creationTime,
      modelUsed: artifact.modelUsed,
    }));
  },
});
