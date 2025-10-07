import type { WithoutSystemFields } from "convex/server";
import { type Infer, v } from "convex/values";
import { internal } from "../../_generated/api";
import type { Doc, Id } from "../../_generated/dataModel";
import {
  internalAction,
  internalMutation,
  internalQuery,
} from "../../_generated/server";
import type { exchangeTokenResponse } from "../../asana/oauth/schemas";
import { requireUserId } from "../../helpers";
import { env } from "../../lib/env";

export const storeOAuthState = internalMutation({
  args: {
    state: v.string(),
    codeVerifier: v.string(),
    expiresAt: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
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
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, { userId }): Promise<Doc<"asanaConnections"> | null> => {
    return await ctx.db
      .query("asanaConnections")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
  },
});

export const deleteOAuthState = internalMutation({
  args: { state: v.string() },
  handler: async (ctx, { state }) => {
    const oauthState = await ctx.db
      .query("oauthStates")
      .withIndex("by_state", (q) => q.eq("state", state))
      .first();
    if (oauthState) {
      await ctx.db.delete(oauthState._id);
    }
  },
});

export const updateConnectionTokensById = internalMutation({
  handler: async (
    ctx,
    args: Pick<
      Doc<"asanaConnections">,
      "_id" | "accessToken" | "refreshToken" | "expiresAt"
    >,
  ) => {
    await ctx.db.patch(args._id, {
      accessToken: args.accessToken,
      refreshToken: args.refreshToken,
      expiresAt: args.expiresAt,
    });
  },
});

export const deleteConnectionById = internalMutation({
  args: { connectionId: v.id("asanaConnections") },
  returns: v.null(),
  handler: async (ctx, { connectionId }) => {
    await ctx.db.delete(connectionId);
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
  handler: async (
    _,
    { request },
  ): Promise<Infer<typeof exchangeTokenResponse>> => {
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

export const completeOAuthFlow = internalAction({
  args: {
    state: v.string(),
    code: v.string(),
  },
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

    await ctx.runMutation(internal.asana.oauth.protected.saveNewTokens, {
      userId: oauthState.userId,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: Date.now() + tokens.expires_in * 1000,
      asanaUserId: tokens.data.gid,
      asanaUserName: tokens.data.name,
      asanaUserEmail: tokens.data.email,
      oauthStateId: oauthState._id,
    });
  },
});

export const saveNewTokens = internalMutation({
  handler: async (
    ctx,
    args: WithoutSystemFields<Doc<"asanaConnections">> & {
      oauthStateId: Id<"oauthStates">;
    },
  ) => {
    const connection = await ctx.db
      .query("asanaConnections")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (connection) {
      await ctx.db.patch(connection._id, { ...args });
    } else {
      await ctx.db.insert("asanaConnections", { ...args });
    }

    await ctx.db.patch(args.userId, {
      onboardingCompletedTime: Date.now(),
    });

    await ctx.db.delete(args.oauthStateId);
  },
});
