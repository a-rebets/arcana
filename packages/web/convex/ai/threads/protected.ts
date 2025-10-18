import { createThread } from "@convex-dev/agent";
import { v } from "convex/values";
import z from "zod";
import { components } from "../../_generated/api";
import { internalAction, internalMutation } from "../../_generated/server";
import { threadTitlesAgent } from "../agent";

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
