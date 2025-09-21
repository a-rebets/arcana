import type { AsanaApiClient } from "../core/client";
import { paginate } from "../core/paginate";
import type { OptFields } from "../core/type-utilities";
import type { components } from "../lib/api";

export type TeamMembershipCompact =
  components["schemas"]["TeamMembershipCompact"];

export function createTeamMemberships(client: AsanaApiClient) {
  return {
    async getTeamMembership(
      team_membership_gid: string,
      opts?: { fields?: OptFields<"getTeamMembership"> },
    ) {
      const { data } = await client.GET(
        "/team_memberships/{team_membership_gid}",
        {
          params: {
            path: { team_membership_gid },
            query: {
              opt_fields: opts?.fields ?? [
                "team",
                "team.name",
                "user",
                "user.name",
              ],
            },
          },
        },
      );
      return data?.data;
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
                opt_fields: opts?.fields ?? [
                  "team",
                  "team.name",
                  "user",
                  "user.name",
                ],
              },
            },
          },
        );
        return data;
      };

      return paginate(fetchPage, { limitTotal: opts?.limit });
    },

    async getTeamMembershipsForTeam(
      team_gid: string,
      opts?: {
        limit?: number;
        fields?: OptFields<"getTeamMembershipsForTeam">;
      },
    ) {
      const fetchPage = async (offset?: string | null) => {
        const { data } = await client.GET(
          "/teams/{team_gid}/team_memberships",
          {
            params: {
              path: { team_gid },
              query: {
                limit: 50,
                offset: offset ?? undefined,
                opt_fields: opts?.fields ?? [
                  "team",
                  "team.name",
                  "user",
                  "user.name",
                ],
              },
            },
          },
        );
        return data;
      };

      return paginate(fetchPage, { limitTotal: opts?.limit });
    },

    async getTeamMemberships(opts?: {
      team?: string;
      user?: string;
      workspace?: string;
      limit?: number;
      fields?: OptFields<"getTeamMemberships">;
    }) {
      if (opts?.user && !opts.workspace) {
        throw new Error(
          "getTeamMemberships: when 'user' is provided, 'workspace' is required",
        );
      }

      const fetchPage = async (offset?: string | null) => {
        const { data } = await client.GET("/team_memberships", {
          params: {
            query: {
              team: opts?.team,
              user: opts?.user,
              workspace: opts?.workspace,
              limit: 50,
              offset: offset ?? undefined,
              opt_fields: opts?.fields ?? [
                "team",
                "team.name",
                "user",
                "user.name",
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
