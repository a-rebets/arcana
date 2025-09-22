import type { AsanaApiClient } from "../core/client";
import { paginate } from "../core/paginate";
import type { OptFields } from "../core/type-utilities";
import type { components, operations } from "../lib/api";

export type TaskCompact = components["schemas"]["TaskCompact"];
export type TaskResponse = components["schemas"]["TaskResponse"];

const DEFAULT_TASK_COMPACT_FIELDS = [
  "name",
  "assignee",
  "completed",
  "due_on",
] as const;

export function createTasks(client: AsanaApiClient) {
  return {
    async getTask(task_gid: string, opts?: { fields?: OptFields<"getTask"> }) {
      const { data } = await client.GET("/tasks/{task_gid}", {
        params: {
          path: { task_gid },
          query: {
            opt_fields: opts?.fields ?? [
              "name",
              "assignee",
              "assignee_status",
              "completed",
              "due_on",
              "projects",
              "workspace",
            ],
          },
        },
      });
      return data?.data;
    },

    async getTasks(opts?: {
      assignee?: string;
      project?: string;
      section?: string;
      workspace?: string;
      completedSince?: string;
      modifiedSince?: string;
      limit?: number;
      fields?: OptFields<"getTasks">;
    }) {
      const fetchPage = async (offset?: string | null) => {
        const { data } = await client.GET("/tasks", {
          params: {
            query: {
              assignee: opts?.assignee,
              project: opts?.project,
              section: opts?.section,
              workspace: opts?.workspace,
              completed_since: opts?.completedSince,
              modified_since: opts?.modifiedSince,
              limit: 50,
              offset: offset ?? undefined,
              opt_fields: opts?.fields ?? [
                "name",
                "assignee",
                "completed",
                "due_on",
                "workspace",
              ],
            },
          },
        });
        return data;
      };

      return paginate(fetchPage, { limitTotal: opts?.limit });
    },

    async getTasksForProject(
      project_gid: string,
      opts?: {
        completedSince?: string;
        limit?: number;
        fields?: OptFields<"getTasksForProject">;
      },
    ) {
      const fetchPage = async (offset?: string | null) => {
        const { data } = await client.GET("/projects/{project_gid}/tasks", {
          params: {
            path: { project_gid },
            query: {
              completed_since: opts?.completedSince,
              limit: 50,
              offset: offset ?? undefined,
              opt_fields: opts?.fields ?? DEFAULT_TASK_COMPACT_FIELDS,
            },
          },
        });
        return data;
      };

      return paginate(fetchPage, { limitTotal: opts?.limit });
    },

    async getTasksForSection(
      section_gid: string,
      opts?: {
        completedSince?: string;
        limit?: number;
        fields?: OptFields<"getTasksForSection">;
      },
    ) {
      const fetchPage = async (offset?: string | null) => {
        const { data } = await client.GET("/sections/{section_gid}/tasks", {
          params: {
            path: { section_gid },
            query: {
              completed_since: opts?.completedSince,
              limit: 50,
              offset: offset ?? undefined,
              opt_fields: opts?.fields ?? DEFAULT_TASK_COMPACT_FIELDS,
            },
          },
        });
        return data;
      };

      return paginate(fetchPage, { limitTotal: opts?.limit });
    },

    async getTasksForUserTaskList(
      user_task_list_gid: string,
      opts?: {
        completedSince?: string;
        limit?: number;
        fields?: OptFields<"getTasksForUserTaskList">;
      },
    ) {
      const fetchPage = async (offset?: string | null) => {
        const { data } = await client.GET(
          "/user_task_lists/{user_task_list_gid}/tasks",
          {
            params: {
              path: { user_task_list_gid },
              query: {
                completed_since: opts?.completedSince,
                limit: 50,
                offset: offset ?? undefined,
                opt_fields: opts?.fields ?? DEFAULT_TASK_COMPACT_FIELDS,
              },
            },
          },
        );
        return data;
      };

      return paginate(fetchPage, { limitTotal: opts?.limit });
    },

    async getDependenciesForTask(
      task_gid: string,
      opts?: {
        limit?: number;
        fields?: OptFields<"getDependenciesForTask">;
      },
    ) {
      const fetchPage = async (offset?: string | null) => {
        const { data } = await client.GET("/tasks/{task_gid}/dependencies", {
          params: {
            path: { task_gid },
            query: {
              limit: 50,
              offset: offset ?? undefined,
              opt_fields: opts?.fields ?? DEFAULT_TASK_COMPACT_FIELDS,
            },
          },
        });
        return data;
      };

      return paginate(fetchPage, { limitTotal: opts?.limit });
    },

    async getDependentsForTask(
      task_gid: string,
      opts?: {
        limit?: number;
        fields?: OptFields<"getDependentsForTask">;
      },
    ) {
      const fetchPage = async (offset?: string | null) => {
        const { data } = await client.GET("/tasks/{task_gid}/dependents", {
          params: {
            path: { task_gid },
            query: {
              limit: 50,
              offset: offset ?? undefined,
              opt_fields: opts?.fields ?? DEFAULT_TASK_COMPACT_FIELDS,
            },
          },
        });
        return data;
      };

      return paginate(fetchPage, { limitTotal: opts?.limit });
    },

    async getSubtasksForTask(
      task_gid: string,
      opts?: {
        limit?: number;
        fields?: OptFields<"getSubtasksForTask">;
      },
    ) {
      const fetchPage = async (offset?: string | null) => {
        const { data } = await client.GET("/tasks/{task_gid}/subtasks", {
          params: {
            path: { task_gid },
            query: {
              limit: 50,
              offset: offset ?? undefined,
              opt_fields: opts?.fields ?? DEFAULT_TASK_COMPACT_FIELDS,
            },
          },
        });
        return data;
      };

      return paginate(fetchPage, { limitTotal: opts?.limit });
    },

    async getTasksForTag(
      tag_gid: string,
      opts?: {
        limit?: number;
        fields?: OptFields<"getTasksForTag">;
      },
    ) {
      const fetchPage = async (offset?: string | null) => {
        const { data } = await client.GET("/tags/{tag_gid}/tasks", {
          params: {
            path: { tag_gid },
            query: {
              limit: 50,
              offset: offset ?? undefined,
              opt_fields: opts?.fields ?? DEFAULT_TASK_COMPACT_FIELDS,
            },
          },
        });
        return data;
      };

      return paginate(fetchPage, { limitTotal: opts?.limit });
    },

    /**
     * Search for tasks in a workspace.
     *
     * **Note:** The Asana API for searching tasks is paginated, but it does not use the standard offset-based pagination.
     * Instead, you can paginate manually by sorting the search results by their creation time and then modifying each subsequent query to exclude data you have already seen.
     * This method does not handle this pagination automatically.
     */
    async searchTasksForWorkspace(
      workspace_gid: string,
      opts: operations["searchTasksForWorkspace"]["parameters"]["query"] & {
        fields?: OptFields<"searchTasksForWorkspace">;
      },
    ) {
      const { fields, ...query } = opts;
      const { data } = await client.GET(
        "/workspaces/{workspace_gid}/tasks/search",
        {
          params: {
            path: { workspace_gid },
            query: {
              ...query,
              opt_fields: fields,
            },
          },
        },
      );
      return data;
    },

    async getTaskForCustomID(workspace_gid: string, custom_id: string) {
      const { data } = await client.GET(
        "/workspaces/{workspace_gid}/tasks/custom_id/{custom_id}",
        {
          params: {
            path: { workspace_gid, custom_id },
          },
        },
      );
      return data?.data;
    },
  };
}
