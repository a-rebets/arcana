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
    const roots = await ctx.db
      .query("artifacts")
      .withIndex("by_thread", (q) => q.eq("threadId", args.threadId))
      .filter((q) => q.eq(q.field("rootArtifactId"), undefined))
      .collect();

    const chains: Array<ArtifactChain> = await Promise.all(
      roots.map(async (root) => {
        const versions = await ctx.db
          .query("artifacts")
          .withIndex("by_root_and_version", (q) =>
            q.eq("rootArtifactId", root._id),
          )
          .order("asc")
          .collect();

        return {
          rootId: root._id,
          title: root.title,
          versions: [root, ...versions].map((a) => ({
            id: a._id,
            creationTime: a._creationTime,
            vegaSpec: a.vegaSpec,
            threadId: a.threadId,
          })),
        };
      }),
    );

    return chains;
  },
});

export const listLatestArtifactsForUser = query({
  handler: async (ctx): Promise<ArtifactChainWithLatestVersion[]> => {
    const userId = await requireUserId(ctx);
    const roots = await ctx.db
      .query("artifacts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("rootArtifactId"), undefined))
      .collect();

    const chains: Array<ArtifactChainWithLatestVersion> = await Promise.all(
      roots.map(async (root) => {
        const latestVersion = await ctx.db
          .query("artifacts")
          .withIndex("by_root_and_version", (q) =>
            q.eq("rootArtifactId", root._id),
          )
          .order("desc")
          .first();

        const version = latestVersion ?? root;

        return {
          rootId: root._id,
          title: root.title,
          versions: [
            {
              id: version._id,
              creationTime: version._creationTime,
              vegaSpec: version.vegaSpec,
              threadId: version.threadId,
            },
          ],
          updatedAt: version._creationTime,
        };
      }),
    );

    return chains;
  },
});

export const getArtifactChainById = query({
  args: {
    artifactId: v.id("artifacts"),
  },
  handler: async (ctx, args): Promise<ArtifactChain | null> => {
    const artifact = await ctx.db.get(args.artifactId);
    if (!artifact) return null;

    const rootId = artifact.rootArtifactId ?? artifact._id;
    const root = artifact.rootArtifactId
      ? await ctx.db.get(artifact.rootArtifactId)
      : artifact;

    if (!root) return null;

    const versions = await ctx.db
      .query("artifacts")
      .withIndex("by_root_and_version", (q) => q.eq("rootArtifactId", rootId))
      .order("asc")
      .collect();

    return {
      rootId,
      title: root.title,
      versions: [root, ...versions].map((a) => ({
        id: a._id,
        creationTime: a._creationTime,
        vegaSpec: a.vegaSpec,
        threadId: a.threadId,
      })),
    };
  },
});
