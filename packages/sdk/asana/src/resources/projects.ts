import type { OpenAPIClient } from "../core/client";
import { paginate } from "../core/paginate";
import type { OptFields } from "../core/types";
import type { components } from "../lib/api";

export type ProjectCompact = components["schemas"]["ProjectCompact"];

export function createProjects(client: OpenAPIClient) {
	return {
		async getProjectsForTeam(
			team_gid: string,
			opts?: {
				includeArchived?: boolean;
				limit?: number;
				fields?: OptFields<"getProjectsForTeam">;
			},
		) {
			const fetchPage = async (offset?: string | null) => {
				const { data } = await client.GET("/teams/{team_gid}/projects", {
					params: {
						path: { team_gid },
						query: {
							archived: opts?.includeArchived ?? false,
							limit: 50,
							offset: offset ?? undefined,
							opt_fields: opts?.fields ?? [
								"name",
								"members",
								"team",
								"team.name",
								"workspace",
								"workspace.name",
							],
						},
					},
				});
				return data;
			};

			return paginate(fetchPage, { limitTotal: opts?.limit });
		},

		async getProjectsForWorkspace(
			workspace_gid: string,
			opts?: {
				includeArchived?: boolean;
				limit?: number;
				fields?: OptFields<"getProjectsForWorkspace">;
			},
		) {
			const fetchPage = async (offset?: string | null) => {
				const { data } = await client.GET(
					"/workspaces/{workspace_gid}/projects",
					{
						params: {
							path: { workspace_gid },
							query: {
								archived: opts?.includeArchived ?? false,
								limit: 50,
								offset: offset ?? undefined,
								opt_fields: opts?.fields ?? ["name", "team", "workspace"],
							},
						},
					},
				);
				return data;
			};

			return paginate(fetchPage, { limitTotal: opts?.limit });
		},

		async getProject(
			project_gid: string,
			opts?: { fields?: OptFields<"getProject"> },
		) {
			const { data } = await client.GET("/projects/{project_gid}", {
				params: {
					path: { project_gid },
					query: {
						opt_fields: opts?.fields ?? [
							"name",
							"team",
							"workspace",
							"archived",
							"created_at",
							"modified_at",
						],
					},
				},
			});
			return data?.data;
		},

		async getProjects(opts?: {
			workspace?: string;
			team?: string;
			includeArchived?: boolean;
			limit?: number;
			fields?: OptFields<"getProjects">;
		}) {
			const fetchPage = async (offset?: string | null) => {
				const { data } = await client.GET("/projects", {
					params: {
						query: {
							workspace: opts?.workspace,
							team: opts?.team,
							archived: opts?.includeArchived ?? false,
							limit: 50,
							offset: offset ?? undefined,
							opt_fields: opts?.fields ?? [
								"name",
								"team",
								"workspace",
								"archived",
							],
						},
					},
				});
				return data;
			};

			return paginate(fetchPage, { limitTotal: opts?.limit });
		},
	};
}
