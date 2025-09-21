import type { AsanaApiClient } from "../core/client";
import { paginate } from "../core/paginate";
import type { OptFields } from "../core/type-utilities";
import type { components } from "../lib/api";

export type TagCompact = components["schemas"]["TagCompact"];
export type TagResponse = components["schemas"]["TagResponse"];

export function createTags(client: AsanaApiClient) {
  return {
    async getTag(tag_gid: string, opts?: { fields?: OptFields<"getTag"> }) {
      const { data } = await client.GET("/tags/{tag_gid}", {
        params: {
          path: { tag_gid },
          query: {
            opt_fields: opts?.fields ?? ["name", "color", "workspace"],
          },
        },
      });
      return data?.data;
    },

    async getTags(opts?: {
      workspace?: string;
      limit?: number;
      fields?: OptFields<"getTags">;
    }) {
      const fetchPage = async (offset?: string | null) => {
        const { data } = await client.GET("/tags", {
          params: {
            query: {
              workspace: opts?.workspace,
              limit: 50,
              offset: offset ?? undefined,
              opt_fields: opts?.fields ?? ["name", "color", "workspace"],
            },
          },
        });
        return data;
      };

      return paginate(fetchPage, { limitTotal: opts?.limit });
    },

    async getTagsForTask(
      task_gid: string,
      opts?: { limit?: number; fields?: OptFields<"getTagsForTask"> },
    ) {
      const fetchPage = async (offset?: string | null) => {
        const { data } = await client.GET("/tasks/{task_gid}/tags", {
          params: {
            path: { task_gid },
            query: {
              limit: 50,
              offset: offset ?? undefined,
              opt_fields: opts?.fields ?? ["name", "color"],
            },
          },
        });
        return data;
      };

      return paginate(fetchPage, { limitTotal: opts?.limit });
    },

    async getTagsForWorkspace(
      workspace_gid: string,
      opts?: { limit?: number; fields?: OptFields<"getTagsForWorkspace"> },
    ) {
      const fetchPage = async (offset?: string | null) => {
        const { data } = await client.GET("/workspaces/{workspace_gid}/tags", {
          params: {
            path: { workspace_gid },
            query: {
              limit: 50,
              offset: offset ?? undefined,
              opt_fields: opts?.fields ?? ["name", "color"],
            },
          },
        });
        return data;
      };

      return paginate(fetchPage, { limitTotal: opts?.limit });
    },
  };
}
