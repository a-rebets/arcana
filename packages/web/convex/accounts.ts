import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import type { Doc } from "./_generated/dataModel";
import { internalMutation, mutation, query } from "./_generated/server";

export const updateUserInfo = mutation({
	args: { profileColors: v.array(v.string()), name: v.string() },
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) throw new Error("Unauthorized");
		await ctx.db.patch(userId, {
			profileColors: args.profileColors,
			name: args.name,
		});
	},
});

export const completeOnboarding = internalMutation({
	args: { id: v.id("users") },
	handler: async (ctx, args) => {
		await ctx.db.patch(args.id, {
			onboardingCompletedTime: Date.now(),
		});
	},
});

export const getUser = query({
	handler: async (ctx): Promise<Doc<"users"> | null> => {
		const userId = await getAuthUserId(ctx);
		if (!userId) return null;
		return await ctx.db.get(userId);
	},
});
