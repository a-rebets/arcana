import type { OpenAPIClient } from "../core/client";
import { paginate } from "../core/paginate";
import type { OptFields } from "../core/types";
import type { components } from "../lib/api";

export type WorkspaceCompact = components["schemas"]["WorkspaceCompact"];
export type WorkspaceResponse = components["schemas"]["WorkspaceResponse"];

export function createWorkspaces(client: OpenAPIClient) {
	return {
		async getWorkspaces(opts?: {
			limit?: number;
			fields?: OptFields<"getWorkspaces">;
		}) {
			const fetchPage = async (offset?: string | null) => {
				const { data } = await client.GET("/workspaces", {
					params: {
						query: {
							limit: 50,
							offset: offset ?? undefined,
							opt_fields: opts?.fields ?? ["name"],
						},
					},
				});
				return data;
			};
			return paginate(fetchPage, { limitTotal: opts?.limit });
		},

		async getWorkspace(
			workspace_gid: string,
			opts?: { fields?: OptFields<"getWorkspace"> },
		) {
			const { data } = await client.GET("/workspaces/{workspace_gid}", {
				params: {
					path: { workspace_gid },
					query: {
						opt_fields: opts?.fields ?? ["name"],
					},
				},
			});
			return data?.data;
		},

		async getWorkspaceEvents(workspace_gid: string, opts?: { sync?: string }) {
			const { data } = await client.GET("/workspaces/{workspace_gid}/events", {
				params: {
					path: { workspace_gid },
					query: {
						sync: opts?.sync ?? undefined,
					},
				},
			});
			return data;
		},
	};
}
