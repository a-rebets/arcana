import type { OpenAPIClient } from "../core/client";
import { paginate } from "../core/paginate";
import type { OptFields } from "../core/types";
import type { components } from "../lib/api";

export type TaskCompact = components["schemas"]["TaskCompact"];
export type TaskResponse = components["schemas"]["TaskResponse"];

export function createTasks(client: OpenAPIClient) {
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
              opt_fields: opts?.fields ?? [
                "name",
                "assignee",
                "completed",
                "due_on",
              ],
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
              opt_fields: opts?.fields ?? [
                "name",
                "assignee",
                "completed",
                "due_on",
              ],
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
                opt_fields: opts?.fields ?? [
                  "name",
                  "assignee",
                  "completed",
                  "due_on",
                ],
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
