import { v } from "convex/values";
import type { Doc } from "../_generated/dataModel";
import { mutation, query } from "../_generated/server";
import { requireUserId } from "../helpers";

export const updateUserInfo = mutation({
  args: { profileColors: v.array(v.string()), name: v.string() },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    await ctx.db.patch(userId, {
      profileColors: args.profileColors,
      name: args.name,
    });
  },
});

export const getUser = query({
  handler: async (ctx): Promise<Doc<"users"> | null> => {
    const userId = await requireUserId(ctx);
    return await ctx.db.get(userId);
  },
});
