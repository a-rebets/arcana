import { createThread } from "@convex-dev/agent";
import { v } from "convex/values";
import { components, internal } from "../_generated/api";
import { action, internalMutation, query } from "../_generated/server";
import { requireUserId } from "../helpers";
import { arcanaAgent } from "./agent";

export const create = internalMutation({
  args: { title: v.optional(v.string()), userId: v.id("users") },
  handler: async (ctx, { title, userId }) => {
    const threadId = await createThread(ctx, components.agent, {
      userId,
      title: title ?? "New thread",
    });
    return threadId;
  },
});

export const startNewThread = action({
  args: {
    prompt: v.string(),
  },
  handler: async (ctx, { prompt }): Promise<string> => {
    const userId = await requireUserId(ctx);
    const threadId = await ctx.runMutation(internal.ai.threads.create, {
      userId,
    });
    await arcanaAgent.saveMessage(ctx, {
      threadId,
      prompt,
    });
    return threadId;
  },
});

export const listByUser = query({
  args: { cursor: v.optional(v.string()), numItems: v.optional(v.number()) },
  handler: async (ctx, { cursor = null, numItems = 20 }) => {
    const userId = await requireUserId(ctx);
    const res = await ctx.runQuery(
      components.agent.threads.listThreadsByUserId,
      { userId, paginationOpts: { cursor, numItems } },
    );
    return res.page;
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
