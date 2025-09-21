import type { OpenAPIClient } from "../core/client";
import { paginate } from "../core/paginate";
import type { OptFields } from "../core/types";
import type { components } from "../lib/api";

export type TeamCompact = components["schemas"]["TeamCompact"];

export function createTeams(client: OpenAPIClient) {
	return {
		async getTeam(team_gid: string, opts?: { fields?: OptFields<"getTeam"> }) {
			const { data } = await client.GET("/teams/{team_gid}", {
				params: {
					path: { team_gid },
					query: {
						opt_fields: opts?.fields ?? ["name", "organization"],
					},
				},
			});
			return data?.data;
		},

		async getTeamsForUser(
			user_gid: string,
			organization: string,
			opts?: { limit?: number; fields?: OptFields<"getTeamsForUser"> },
		) {
			const fetchPage = async (offset?: string | null) => {
				const { data } = await client.GET("/users/{user_gid}/teams", {
					params: {
						path: { user_gid },
						query: {
							organization,
							limit: 50,
							offset: offset ?? undefined,
							opt_fields: opts?.fields ?? ["name", "organization"],
						},
					},
				});
				return data;
			};

			return paginate(fetchPage, { limitTotal: opts?.limit });
		},

		async getTeamsForWorkspace(
			workspace_gid: string,
			opts?: { limit?: number; fields?: OptFields<"getTeamsForWorkspace"> },
		) {
			const fetchPage = async (offset?: string | null) => {
				const { data } = await client.GET("/workspaces/{workspace_gid}/teams", {
					params: {
						path: { workspace_gid },
						query: {
							limit: 50,
							offset: offset ?? undefined,
							opt_fields: opts?.fields ?? ["name", "organization"],
						},
					},
				});
				return data;
			};

			return paginate(fetchPage, { limitTotal: opts?.limit });
		},
	};
}
