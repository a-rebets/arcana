import { createTool } from "@convex-dev/agent";
import type { WorkspaceCompact } from "asana-sdk";
import { createAsanaClient } from "./http";
import { ListUserWorkspacesInput } from "./schemas";
import type { AsanaToolCtx } from "./types";

async function listUserWorkspaces({
  token,
  limit,
}: {
  limit?: number;
  token: string;
}) {
  const sdk = createAsanaClient(token);
  const workspaces: Array<WorkspaceCompact> =
    await sdk.workspaces.getWorkspaces({
      limit,
      fields: ["name"],
    });

  return {
    workspaces: workspaces.map((ws) => ({
      gid: ws.gid ?? "",
      name: ws.name ?? "",
    })),
  };
}

const listUserWorkspacesTool = createTool({
  description: "List workspaces the user has access to (id and name).",
  args: ListUserWorkspacesInput,
  handler: async (ctx: AsanaToolCtx, args) => {
    const token = ctx.asanaToken;
    if (!token) {
      throw new Error(
        "Missing Asana access token in experimental_context.asanaToken",
      );
    }
    return listUserWorkspaces({ token, ...args });
  },
});

const labels = {
  "input-streaming": "Listing workspaces for the user...",
  "output-available": "Listed workspaces",
} as const;

export default {
  tool: listUserWorkspacesTool,
  labels,
};
