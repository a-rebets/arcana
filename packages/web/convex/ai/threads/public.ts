import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { components, internal } from "../../_generated/api";
import { action, query } from "../../_generated/server";
import { requireUserId } from "../../helpers";
import { arcanaAgent } from "../agent";

export const startNewThread = action({
  args: {
    prompt: v.string(),
  },
  handler: async (ctx, { prompt }): Promise<string> => {
    const userId = await requireUserId(ctx);
    const threadId = await ctx.runMutation(
      internal.ai.threads.protected.create,
      {
        userId,
      },
    );
    await arcanaAgent.saveMessage(ctx, {
      threadId,
      prompt,
    });
    await ctx.scheduler.runAfter(
      0,
      internal.ai.threads.protected.generateTitle,
      {
        threadId,
        prompt,
      },
    );
    return threadId;
  },
});

export const listByUser = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, { paginationOpts }) => {
    const userId = await requireUserId(ctx);
    const res = await ctx.runQuery(
      components.agent.threads.listThreadsByUserId,
      { userId, paginationOpts },
    );
    return res;
  },
});

export const searchByTitle = query({
  args: {
    searchTerm: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { searchTerm, limit = 50 }) => {
    const userId = await requireUserId(ctx);
    const threads = await ctx.runQuery(
      components.agent.threads.searchThreadTitles,
      {
        query: searchTerm,
        userId,
        limit,
      },
    );
    return threads;
  },
});

export const checkIfThreadExists = query({
  args: { threadId: v.string() },
  handler: async (ctx, { threadId }) => {
    const thread = await ctx.runQuery(components.agent.threads.getThread, {
      threadId,
    });
    return thread !== null;
  },
});

export const getThreadMetadata = query({
  args: { threadId: v.string() },
  handler: async (ctx, { threadId }) => {
    const thread = await ctx.runQuery(components.agent.threads.getThread, {
      threadId,
    });
    if (!thread) return null;
    return {
      title: thread.title,
      creationTime: thread._creationTime,
    };
  },
});
