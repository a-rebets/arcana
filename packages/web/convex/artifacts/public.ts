import { vThreadDoc } from "@convex-dev/agent";
import type { Doc, Id } from "../_generated/dataModel";
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

type ArtifactChain = {
  rootId: Id<"artifacts">;
  versions: Array<Pick<Doc<"artifacts">, "_id" | "_creationTime" | "vegaSpec">>;
};

export const listArtifactChainsForThread = query({
  args: {
    threadId: vThreadDoc.fields._id,
  },
  handler: async (ctx, args): Promise<ArtifactChain[]> => {
    const artifacts = await ctx.db
      .query("artifacts")
      .withIndex("by_thread", (q) => q.eq("threadId", args.threadId))
      .order("asc")
      .collect();

    return buildChains(artifacts);
  },
});

function buildChains(artifacts: Array<Doc<"artifacts">>): ArtifactChain[] {
  const chains: ArtifactChain[] = [];
  const artifactToChainIndex = new Map<Id<"artifacts">, number>();

  for (const rawArtifact of artifacts) {
    const artifact = {
      _id: rawArtifact._id,
      _creationTime: rawArtifact._creationTime,
      vegaSpec: rawArtifact.vegaSpec,
    };

    if (rawArtifact.parentArtifactId === undefined) {
      const chainIndex = chains.length;
      chains.push({
        rootId: artifact._id,
        versions: [artifact],
      });
      artifactToChainIndex.set(artifact._id, chainIndex);
    } else {
      const chainIndex = artifactToChainIndex.get(rawArtifact.parentArtifactId);
      if (chainIndex !== undefined) {
        chains[chainIndex].versions.push(artifact);
        artifactToChainIndex.set(artifact._id, chainIndex);
      }
    }
  }

  // Sort by root artifact creation time (stable ordering)
  // Charts stay in the order they were created, even when new versions are added
  chains.sort((a, b) => {
    const aRoot = a.versions[0]._creationTime;
    const bRoot = b.versions[0]._creationTime;
    return bRoot - aRoot;
  });

  return chains;
}
