import type { OpenAPIClient } from "../core/client";
import { paginate } from "../core/paginate";
import type { OptFields } from "../core/types";
import type { components } from "../lib/api";

export type WorkspaceMembershipCompact =
  components["schemas"]["WorkspaceMembershipCompact"];

export function createWorkspaceMemberships(client: OpenAPIClient) {
  return {
    async getWorkspaceMembershipsForUser(
      user_gid: string,
      opts?: {
        limit?: number;
        fields?: OptFields<"getWorkspaceMembershipsForUser">;
      },
    ) {
      const fetchPage = async (offset?: string | null) => {
        const { data } = await client.GET(
          "/users/{user_gid}/workspace_memberships",
          {
            params: {
              path: { user_gid },
              query: {
                limit: 50,
                offset: offset ?? undefined,
                opt_fields: opts?.fields ?? [
                  "user",
                  "user.name",
                  "workspace",
                  "workspace.name",
                ],
              },
            },
          },
        );
        return data;
      };

      return paginate(fetchPage, { limitTotal: opts?.limit });
    },

    async getWorkspaceMembershipsForWorkspace(
      workspace_gid: string,
      opts?: {
        limit?: number;
        user?: string;
        fields?: OptFields<"getWorkspaceMembershipsForWorkspace">;
      },
    ) {
      const fetchPage = async (offset?: string | null) => {
        const { data } = await client.GET(
          "/workspaces/{workspace_gid}/workspace_memberships",
          {
            params: {
              path: { workspace_gid },
              query: {
                user: opts?.user,
                limit: 50,
                offset: offset ?? undefined,
                opt_fields: opts?.fields ?? [
                  "user",
                  "user.name",
                  "workspace",
                  "workspace.name",
                ],
              },
            },
          },
        );
        return data;
      };

      return paginate(fetchPage, { limitTotal: opts?.limit });
    },

    async getWorkspaceMembership(
      workspace_membership_gid: string,
      opts?: { fields?: OptFields<"getWorkspaceMembership"> },
    ) {
      const { data } = await client.GET(
        "/workspace_memberships/{workspace_membership_gid}",
        {
          params: {
            path: { workspace_membership_gid },
            query: {
              opt_fields: opts?.fields ?? ["user", "workspace"],
            },
          },
        },
      );
      return data;
    },
  };
}
