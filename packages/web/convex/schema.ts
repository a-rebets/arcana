import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { artifacts, datasets } from "./artifacts/schemas";
import { asanaConnections, oauthStates } from "./asana/oauth/schemas";

export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    profileColors: v.optional(v.array(v.string())),
    onboardingCompletedTime: v.optional(v.number()),
  }).index("email", ["email"]),
  asanaConnections,
  oauthStates,
  datasets,
  artifacts,
});
