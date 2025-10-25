import { defineTable } from "convex/server";
import { v } from "convex/values";

export const exchangeTokenResponse = v.object({
  access_token: v.string(),
  refresh_token: v.string(),
  expires_in: v.number(),
  token_type: v.string(),
  scope: v.string(),
  data: v.object({
    gid: v.string(),
    id: v.number(),
    name: v.string(),
    email: v.string(),
  }),
});

export const asanaConnections = defineTable({
  userId: v.id("users"),
  asanaUserId: v.string(),
  asanaUserName: v.string(),
  asanaUserEmail: v.string(),
  accessToken: v.string(),
  refreshToken: v.string(),
  expiresAt: v.number(),
}).index("by_user", ["userId"]);

export const oauthStates = defineTable({
  state: v.string(),
  userId: v.id("users"),
  codeVerifier: v.string(),
  expiresAt: v.number(),
}).index("by_state", ["state"]);
