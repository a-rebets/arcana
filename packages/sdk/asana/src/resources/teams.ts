import type { OpenAPIClient } from "../core/client";
import { paginate } from "../core/paginate";
import type { OptFields } from "../core/types";
import type { components } from "../lib/api";

export type TeamMembershipCompact =
	components["schemas"]["TeamMembershipCompact"];
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

		async getTeamMembershipsForUser(
			user_gid: string,
			workspace_gid: string,
			opts?: {
				limit?: number;
				fields?: OptFields<"getTeamMembershipsForUser">;
			},
		) {
			const fetchPage = async (offset?: string | null) => {
				const { data } = await client.GET(
					"/users/{user_gid}/team_memberships",
					{
						params: {
							path: { user_gid },
							query: {
								workspace: workspace_gid,
								limit: 50,
								offset: offset ?? undefined,
								opt_fields: opts?.fields ?? ["team", "team.name"],
							},
						},
					},
				);
				return data;
			};

			return paginate(fetchPage, { limitTotal: opts?.limit });
		},
	};
}
