import type { OpenAPIClient } from "../core/client";
import type { OptFields } from "../core/types";
import type { components } from "../lib/api";

export type UserCompact = components["schemas"]["UserCompact"];

export function createUsers(client: OpenAPIClient) {
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
			return data;
		},
	};
}
