import { vThreadDoc } from "@convex-dev/agent";
import { v } from "convex/values";
import type { Doc, Id } from "../_generated/dataModel";
import { type QueryCtx, query } from "../_generated/server";
import { requireUserId } from "../helpers";

type RawArtifactVersion = Pick<
  Doc<"artifacts">,
  "_id" | "_creationTime" | "title" | "vegaSpec" | "threadId"
>;

type MappedArtifactVersion = Omit<
  RawArtifactVersion,
  "_id" | "_creationTime"
> & {
  creationTime: RawArtifactVersion["_creationTime"];
  id: RawArtifactVersion["_id"];
};

type ArtifactChain = {
  rootId: Id<"artifacts">;
  versions: Array<MappedArtifactVersion>;
};

type ArtifactChainWithLatestVersion = ArtifactChain & {
  updatedAt: number;
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

export const listLatestArtifactsForUser = query({
  handler: async (ctx): Promise<ArtifactChainWithLatestVersion[]> => {
    const userId = await requireUserId(ctx);
    const artifacts = await ctx.db
      .query("artifacts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("asc")
      .collect();

    const chains = buildChains(artifacts);

    return chains.map((chain) => {
      const latestVersion = chain.versions[chain.versions.length - 1];

      return {
        rootId: chain.rootId,
        versions: [latestVersion],
        updatedAt: latestVersion.creationTime,
      };
    });
  },
});

export const getArtifactChainById = query({
  args: {
    artifactId: v.id("artifacts"),
  },
  handler: async (ctx, args): Promise<ArtifactChain | null> => {
    const rootArtifact = await ctx.db.get(args.artifactId);
    if (!rootArtifact || rootArtifact.parentArtifactId !== undefined) {
      return null;
    }

    const chainArtifacts = await fetchChainVersions(ctx, rootArtifact);

    return {
      rootId: rootArtifact._id,
      versions: chainArtifacts.map((a) => ({
        id: a._id,
        creationTime: a._creationTime,
        title: a.title,
        vegaSpec: a.vegaSpec,
        threadId: a.threadId,
      })),
    };
  },
});

function buildChains(artifacts: Array<Doc<"artifacts">>): ArtifactChain[] {
  const chains: ArtifactChain[] = [];
  const artifactToChainIndex = new Map<Id<"artifacts">, number>();

  for (const rawArtifact of artifacts) {
    const artifact = {
      id: rawArtifact._id,
      creationTime: rawArtifact._creationTime,
      title: rawArtifact.title,
      vegaSpec: rawArtifact.vegaSpec,
      threadId: rawArtifact.threadId,
    };

    if (rawArtifact.parentArtifactId === undefined) {
      const chainIndex = chains.length;
      chains.push({
        rootId: artifact.id,
        versions: [artifact],
      });
      artifactToChainIndex.set(artifact.id, chainIndex);
    } else {
      const chainIndex = artifactToChainIndex.get(rawArtifact.parentArtifactId);
      if (chainIndex !== undefined) {
        chains[chainIndex].versions.push(artifact);
        artifactToChainIndex.set(artifact.id, chainIndex);
      }
    }
  }

  // Sort by root artifact creation time (stable ordering)
  // Charts stay in the order they were created, even when new versions are added
  chains.sort((a, b) => {
    const aRoot = a.versions[0].creationTime;
    const bRoot = b.versions[0].creationTime;
    return bRoot - aRoot;
  });

  return chains;
}

async function fetchChainVersions(
  ctx: QueryCtx,
  rootArtifact: Doc<"artifacts">,
): Promise<Array<Doc<"artifacts">>> {
  const versions = [rootArtifact];
  let currentId = rootArtifact._id;

  while (currentId) {
    const child = await ctx.db
      .query("artifacts")
      .withIndex("by_parent", (q) => q.eq("parentArtifactId", currentId))
      .first();

    if (!child) break;

    versions.push(child);
    currentId = child._id;
  }

  return versions;
}
