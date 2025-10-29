import { query } from "../_generated/server";
import { requireUserId } from "../helpers";

export const getUserConnections = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    const connections = await ctx.db
      .query("asanaConnections")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return connections.map((connection) => ({
      asanaUserId: connection.asanaUserId,
      asanaUserEmail: connection.asanaUserEmail,
    }));
  },
});
