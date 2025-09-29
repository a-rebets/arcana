import { getAuthUserId } from "@convex-dev/auth/server";
import type { GenericCtx } from "./_generated/server";

export async function requireUserId(ctx: GenericCtx) {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    throw new Error("Client is not authenticated!");
  }
  return userId;
}
