import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { internal } from "$/_generated/api";
import type { Doc } from "$/_generated/dataModel";
import {
	internalAction,
	internalMutation,
	internalQuery,
} from "$/_generated/server";
import {
	asanaConnectionFields,
	exchangeTokenResponse,
	tokenFields,
} from "$/asana/oauth/schemas";
import { env } from "$/lib/env";

const oauthStateCreateArgs = {
	state: v.string(),
	codeVerifier: v.string(),
	expiresAt: v.number(),
} as const;

export const storeOAuthState = internalMutation({
	args: oauthStateCreateArgs,
	returns: v.null(),
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) throw new Error("Unauthorized");
		await ctx.db.insert("oauthStates", { ...args, userId });
		return null;
	},
});

export const getOAuthState = internalQuery({
	args: { state: v.string() },
	handler: async (ctx, { state }): Promise<Doc<"oauthStates"> | null> => {
		const oauthState = await ctx.db
			.query("oauthStates")
			.withIndex("by_state", (q) => q.eq("state", state))
			.first();

		if (!oauthState || oauthState.expiresAt < Date.now()) {
			return null;
		}

		return oauthState;
	},
});

export const getConnection = internalQuery({
	args: {},
	handler: async (ctx): Promise<Doc<"asanaConnections"> | null> => {
		const userId = await getAuthUserId(ctx);
		if (!userId) throw new Error("Unauthorized");

		return await ctx.db
			.query("asanaConnections")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.first();
	},
});

export const deleteOAuthState = internalMutation({
	args: { state: v.string() },
	returns: v.null(),
	handler: async (ctx, { state }) => {
		const oauthState = await ctx.db
			.query("oauthStates")
			.withIndex("by_state", (q) => q.eq("state", state))
			.first();

		if (oauthState) {
			await ctx.db.delete(oauthState._id);
		}
		return null;
	},
});

export const saveConnection = internalMutation({
	args: asanaConnectionFields,
	returns: v.null(),
	handler: async (ctx, args) => {
		const existing = await ctx.db
			.query("asanaConnections")
			.withIndex("by_user", (q) => q.eq("userId", args.userId))
			.first();

		if (existing) {
			await ctx.db.patch(existing._id, { ...args });
		} else {
			await ctx.db.insert("asanaConnections", { ...args });
		}
		return null;
	},
});

export const updateConnectionTokens = internalMutation({
	args: tokenFields,
	returns: v.null(),
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) throw new Error("Unauthorized");

		const connection = await ctx.db
			.query("asanaConnections")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.first();

		if (!connection) {
			throw new Error("No connection found to update");
		}

		await ctx.db.patch(connection._id, {
			accessToken: args.accessToken,
			refreshToken: args.refreshToken,
			expiresAt: args.expiresAt,
		});
		return null;
	},
});

export const deleteConnection = internalMutation({
	args: {},
	returns: v.null(),
	handler: async (ctx) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) throw new Error("Unauthorized");

		const connection = await ctx.db
			.query("asanaConnections")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.first();

		if (connection) {
			await ctx.db.delete(connection._id);
		}
		return null;
	},
});

export const exchangeCodeForTokens = internalAction({
	args: {
		request: v.union(
			v.object({
				grant_type: v.literal("authorization_code"),
				code: v.string(),
				code_verifier: v.string(),
			}),
			v.object({
				grant_type: v.literal("refresh_token"),
				refresh_token: v.string(),
			}),
		),
	},
	returns: exchangeTokenResponse,
	handler: async (_, { request }) => {
		const baseParams: Record<string, string> = {
			client_id: env.ASANA_CLIENT_ID,
			client_secret: env.ASANA_CLIENT_SECRET,
		};

		let params: URLSearchParams;
		if (request.grant_type === "authorization_code") {
			params = new URLSearchParams({
				...baseParams,
				grant_type: "authorization_code",
				redirect_uri: `${env.CONVEX_SITE_URL}/oauth/callback`,
				code: request.code,
				code_verifier: request.code_verifier,
			});
		} else {
			params = new URLSearchParams({
				...baseParams,
				grant_type: "refresh_token",
				refresh_token: request.refresh_token,
			});
		}

		const tokenResponse = await fetch("https://app.asana.com/-/oauth_token", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: params,
		});

		if (!tokenResponse.ok) {
			throw new Error("Token exchange failed");
		}

		return await tokenResponse.json();
	},
});

const completeOAuthFlowArgs = {
	state: v.string(),
	code: v.string(),
} as const;

export const completeOAuthFlow = internalAction({
	args: completeOAuthFlowArgs,
	returns: v.null(),
	handler: async (ctx, args) => {
		const oauthState = await ctx.runQuery(
			internal.asana.oauth.protected.getOAuthState,
			{ state: args.state },
		);
		if (!oauthState) {
			throw new Error("Invalid or expired OAuth state");
		}

		const tokens = await ctx.runAction(
			internal.asana.oauth.protected.exchangeCodeForTokens,
			{
				request: {
					grant_type: "authorization_code",
					code: args.code,
					code_verifier: oauthState.codeVerifier,
				},
			},
		);

		await ctx.runMutation(internal.asana.oauth.protected.saveConnection, {
			userId: oauthState.userId,
			accessToken: tokens.access_token,
			refreshToken: tokens.refresh_token,
			expiresAt: Date.now() + tokens.expires_in * 1000,
			asanaUserId: tokens.data.gid,
			asanaUserName: tokens.data.name,
			asanaUserEmail: tokens.data.email,
		});

		await ctx.runMutation(internal.accounts.completeOnboarding, {
			id: oauthState.userId,
		});

		await ctx.runMutation(internal.asana.oauth.protected.deleteOAuthState, {
			state: args.state,
		});

		return null;
	},
});
