import { vThreadDoc } from "@convex-dev/agent";
import { v } from "convex/values";
import type { Doc, Id } from "../_generated/dataModel";
import { query } from "../_generated/server";
import { requireUserId } from "../helpers";

type RawArtifactVersion = Pick<
  Doc<"artifacts">,
  "_id" | "_creationTime" | "vegaSpec" | "threadId"
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
  title: string;
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
        title: chain.title,
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
    const root = await ctx.db.get(args.artifactId);
    if (!root || root.rootArtifactId !== undefined) return null;

    const childVersions = await ctx.db
      .query("artifacts")
      .withIndex("by_root_and_version", (q) =>
        q.eq("rootArtifactId", args.artifactId),
      )
      .order("asc")
      .collect();

    return {
      rootId: root._id,
      title: root.title,
      versions: [root, ...childVersions].map((a) => ({
        id: a._id,
        creationTime: a._creationTime,
        vegaSpec: a.vegaSpec,
        threadId: a.threadId,
      })),
    };
  },
});

function buildChains(artifacts: Array<Doc<"artifacts">>): ArtifactChain[] {
  const chains: Array<ArtifactChain> = [];
  const rootToChainIndex = new Map<Id<"artifacts">, number>();

  for (const artifact of artifacts) {
    const rootId = artifact.rootArtifactId ?? artifact._id;
    const version: MappedArtifactVersion = {
      id: artifact._id,
      creationTime: artifact._creationTime,
      vegaSpec: artifact.vegaSpec,
      threadId: artifact.threadId,
    };

    let chainIndex = rootToChainIndex.get(rootId);

    if (chainIndex === undefined) {
      chainIndex = chains.length;
      chains.push({
        rootId,
        title: artifact.title,
        versions: [version],
      });
      rootToChainIndex.set(rootId, chainIndex);
    } else {
      chains[chainIndex].versions.push(version);
    }
  }

  chains.reverse();

  return chains;
}
