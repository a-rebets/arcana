import type { OpenAPIClient } from "../core/client";
import type { OptFields } from "../core/types";
import type { components } from "../lib/api";

export type UserTaskListResponse =
	components["schemas"]["UserTaskListResponse"];

export function createUserTaskLists(client: OpenAPIClient) {
	return {
		async getUserTaskList(
			user_task_list_gid: string,
			opts?: { fields?: OptFields<"getUserTaskList"> },
		) {
			const { data } = await client.GET(
				"/user_task_lists/{user_task_list_gid}",
				{
					params: {
						path: { user_task_list_gid },
						query: {
							opt_fields: opts?.fields ?? ["name", "owner", "workspace"],
						},
					},
				},
			);
			return data?.data;
		},

		async getUserTaskListForUser(
			user_gid: string,
			workspace: string,
			opts?: { fields?: OptFields<"getUserTaskListForUser"> },
		) {
			const { data } = await client.GET("/users/{user_gid}/user_task_list", {
				params: {
					path: { user_gid },
					query: {
						workspace,
						opt_fields: opts?.fields ?? ["name", "owner", "workspace"],
					},
				},
			});
			return data?.data;
		},
	};
}
