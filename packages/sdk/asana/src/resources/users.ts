import type { AsanaApiClient } from "../core/client";
import { paginate } from "../core/paginate";
import type { OptFields } from "../core/type-utilities";
import type { components } from "../lib/api";

export type UserCompact = components["schemas"]["UserCompact"];
export type UserResponse = components["schemas"]["UserResponse"];

export function createUsers(client: AsanaApiClient) {
  return {
    async getUser(user_gid: string, opts?: { fields?: OptFields<"getUser"> }) {
      const { data } = await client.GET("/users/{user_gid}", {
        params: {
          path: { user_gid },
          query: {
            opt_fields: opts?.fields ?? ["name", "email"],
          },
        },
      });
      return data?.data;
    },

    async getUsers(opts?: {
      workspace?: string;
      team?: string;
      limit?: number;
      fields?: OptFields<"getUsers">;
    }) {
      const fetchPage = async (offset?: string | null) => {
        const { data } = await client.GET("/users", {
          params: {
            query: {
              workspace: opts?.workspace,
              team: opts?.team,
              limit: 50,
              offset: offset ?? undefined,
              opt_fields: opts?.fields ?? ["name", "email"],
            },
          },
        });
        return data;
      };

      return paginate(fetchPage, { limitTotal: opts?.limit });
    },

    async getUsersForTeam(
      team_gid: string,
      opts?: {
        limit?: number;
        fields?: OptFields<"getUsersForTeam">;
      },
    ) {
      const fetchPage = async (offset?: string | null) => {
        const { data } = await client.GET("/teams/{team_gid}/users", {
          params: {
            path: { team_gid },
            query: {
              limit: 50,
              offset: offset ?? undefined,
              opt_fields: opts?.fields ?? ["name", "email"],
            },
          },
        });
        return data;
      };

      return paginate(fetchPage, { limitTotal: opts?.limit });
    },

    async getUsersForWorkspace(
      workspace_gid: string,
      opts?: {
        limit?: number;
        fields?: OptFields<"getUsersForWorkspace">;
      },
    ) {
      const fetchPage = async (offset?: string | null) => {
        const { data } = await client.GET("/workspaces/{workspace_gid}/users", {
          params: {
            path: { workspace_gid },
            query: {
              limit: 50,
              offset: offset ?? undefined,
              opt_fields: opts?.fields ?? ["name", "email"],
            },
          },
        });
        return data;
      };

      return paginate(fetchPage, { limitTotal: opts?.limit });
    },

    async getFavoritesForUser(
      user_gid: string,
      resource_type:
        | "portfolio"
        | "project"
        | "tag"
        | "task"
        | "user"
        | "project_template",
      workspace: string,
      opts?: {
        limit?: number;
        fields?: OptFields<"getFavoritesForUser">;
      },
    ) {
      const fetchPage = async (offset?: string | null) => {
        const { data } = await client.GET("/users/{user_gid}/favorites", {
          params: {
            path: { user_gid },
            query: {
              resource_type,
              workspace,
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
  };
}
