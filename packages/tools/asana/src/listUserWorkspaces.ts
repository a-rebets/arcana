import { tool } from "ai";
import type { WorkspaceCompact } from "asana-sdk";
import { createAsanaClient } from "./http";
import { ListUserWorkspacesInput } from "./schemas";

type WorkspaceItem = {
	gid: string;
	name: string;
};

type ListUserWorkspacesOutput = {
	workspaces: Array<WorkspaceItem>;
};

export async function listUserWorkspaces(
	args: { limit?: number },
	context: { token: string },
): Promise<ListUserWorkspacesOutput> {
	const sdk = createAsanaClient(context.token);
	const workspaces: Array<WorkspaceCompact> =
		await sdk.workspaces.getWorkspaces({
			limit: args.limit,
			fields: ["name"],
		});

	return {
		workspaces: workspaces.map((ws) => ({
			gid: ws.gid ?? "",
			name: ws.name ?? "",
		})),
	};
}

export const listUserWorkspacesTool = tool({
	description: "List workspaces the user has access to (id and name).",
	inputSchema: ListUserWorkspacesInput,
	execute: async (input, opts) => {
		const ctx = opts.experimental_context as { asanaToken?: string };
		const token = ctx.asanaToken;
		if (!token) {
			throw new Error(
				"Missing Asana access token in experimental_context.asanaToken",
			);
		}
		return listUserWorkspaces(input, { token });
	},
});
