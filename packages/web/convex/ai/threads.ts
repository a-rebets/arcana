import { createThread } from "@convex-dev/agent";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { z } from "zod";
import { components, internal } from "../_generated/api";
import {
  action,
  internalAction,
  internalMutation,
  query,
} from "../_generated/server";
import { requireUserId } from "../helpers";
import { arcanaAgent, threadTitlesAgent } from "./agent";

export const create = internalMutation({
  args: { title: v.optional(v.string()), userId: v.id("users") },
  handler: async (ctx, { title, userId }) => {
    const threadId = await createThread(ctx, components.agent, {
      userId,
      title: title ?? "New chat",
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
    await ctx.scheduler.runAfter(0, internal.ai.threads.generateTitle, {
      threadId,
      prompt,
    });
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

export const generateTitle = internalAction({
  args: { threadId: v.string(), prompt: v.string() },
  handler: async (ctx, { threadId, prompt }) => {
    try {
      const titleSchema = z.object({
        title: z
          .string()
          .min(15)
          .max(50)
          .describe("Informative, neutral thread title"),
      });

      const result = await threadTitlesAgent.generateObject(
        ctx,
        { threadId },
        {
          prompt: `User request: "${prompt}"`,
          schema: titleSchema,
          temperature: 0,
        },
      );

      await ctx.runMutation(components.agent.threads.updateThread, {
        threadId,
        patch: { title: result.object.title },
      });
    } catch (error) {
      console.error(`Failed to generate title for thread ${threadId}:`, error);
    }
  },
});
