import type { WithoutSystemFields } from "convex/server";
import { v } from "convex/values";
import type { Doc } from "../_generated/dataModel";
import { internalMutation, internalQuery } from "../_generated/server";

export const createDataset = internalMutation({
  handler: async (ctx, args: WithoutSystemFields<Doc<"datasets">>) => {
    const existing = await ctx.db
      .query("datasets")
      .withIndex("by_hash", (q) => q.eq("hash", args.hash))
      .filter((q) => q.eq(q.field("threadId"), args.threadId))
      .first();

    if (existing) {
      return existing._id;
    }

    const datasetId = await ctx.db.insert("datasets", {
      ...args,
    });

    return datasetId;
  },
});

export const getDataset = internalQuery({
  args: {
    datasetId: v.id("datasets"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.datasetId);
  },
});

export const listDatasetsByUser = internalQuery({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const datasets = await ctx.db
      .query("datasets")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    return datasets.map((dataset) => ({
      id: dataset._id,
      name: dataset.name,
      schema: dataset.schema,
    }));
  },
});

export const createArtifact = internalMutation({
  handler: async (ctx, args: WithoutSystemFields<Doc<"artifacts">>) => {
    return await ctx.db.insert("artifacts", args);
  },
});

export const getArtifact = internalQuery({
  args: {
    artifactId: v.id("artifacts"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.artifactId);
  },
});

export const getLatestArtifactVersion = internalQuery({
  args: {
    artifactId: v.id("artifacts"),
  },
  handler: async (ctx, args) => {
    const artifact = await ctx.db.get(args.artifactId);
    if (!artifact) return null;

    const rootId = artifact.rootArtifactId ?? artifact._id;
    const latest = await ctx.db
      .query("artifacts")
      .withIndex("by_root_and_version", (q) => q.eq("rootArtifactId", rootId))
      .order("desc")
      .first();

    return latest ?? artifact;
  },
});
