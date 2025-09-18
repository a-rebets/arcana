import { type Infer, v } from "convex/values";
import { internal } from "$/_generated/api";
import { action } from "$/_generated/server";
import { env } from "$/lib/env";
import type { exchangeTokenResponse } from "./schemas";
import { allowedScopes } from "./scopes";

export const startAsanaAuth = action({
	args: {},
	returns: v.string(),
	handler: async (ctx): Promise<string> => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error("Unauthorized");
		}

		const { codeVerifier, codeChallenge, state } = await ctx.runAction(
			internal.asana.oauth.pkce.generatePkceAndState,
			{},
		);

		await ctx.runMutation(internal.asana.oauth.protected.storeOAuthState, {
			state,
			codeVerifier,
			expiresAt: Date.now() + 10 * 60 * 1000, // 10 min
		});

		const params: URLSearchParams = new URLSearchParams({
			client_id: env.ASANA_CLIENT_ID,
			redirect_uri: `${env.CONVEX_SITE_URL}/oauth/callback`,
			response_type: "code",
			state,
			code_challenge_method: "S256",
			code_challenge: codeChallenge,
			scope: allowedScopes.join(" "),
		});

		const authUrl: string = `https://app.asana.com/-/oauth_authorize?${params.toString()}`;
		return authUrl;
	},
});

export const refreshTokens = action({
	args: {},
	returns: v.string(),
	handler: async (ctx): Promise<string> => {
		const connection = await ctx.runQuery(
			internal.asana.oauth.protected.getConnection,
			{},
		);
		if (!connection) throw new Error("No connection found");

		const tokens: Infer<typeof exchangeTokenResponse> = await ctx.runAction(
			internal.asana.oauth.protected.exchangeCodeForTokens,
			{
				request: {
					grant_type: "refresh_token",
					refresh_token: connection.refreshToken,
				},
			},
		);

		await ctx.runMutation(
			internal.asana.oauth.protected.updateConnectionTokens,
			{
				accessToken: tokens.access_token,
				refreshToken: tokens.refresh_token,
				expiresAt: Date.now() + tokens.expires_in * 1000,
			},
		);

		return tokens.access_token;
	},
});

export const disconnect = action({
	args: {},
	returns: v.null(),
	handler: async (ctx): Promise<null> => {
		const connection = await ctx.runQuery(
			internal.asana.oauth.protected.getConnection,
			{},
		);
		if (!connection) return null;

		try {
			await fetch("https://app.asana.com/-/oauth_revoke", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					client_id: env.ASANA_CLIENT_ID,
					client_secret: env.ASANA_CLIENT_SECRET,
					token: connection.refreshToken,
				}),
			});
		} catch (err) {
			console.error("Failed to revoke at Asana:", err);
		}

		await ctx.runMutation(internal.asana.oauth.protected.deleteConnection, {});
		return null;
	},
});
