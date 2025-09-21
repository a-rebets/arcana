import type { OpenAPIClient } from "../core/client";
import { paginate } from "../core/paginate";
import type { OptFields } from "../core/types";
import type { components } from "../lib/api";

export type MembershipCompact = components["schemas"]["MembershipCompact"];
export type MembershipResponse = components["schemas"]["MembershipResponse"];

export function createMemberships(client: OpenAPIClient) {
	return {
		async getMembership(
			membership_gid: string,
			opts?: { opt_pretty?: boolean },
		) {
			const { data } = await client.GET("/memberships/{membership_gid}", {
				params: {
					path: { membership_gid },
					query: {
						opt_pretty: opts?.opt_pretty,
					},
				},
			});
			return data?.data;
		},

		async getMemberships(opts?: {
			parent?: string;
			member?: string;
			limit?: number;
			fields?: OptFields<"getMemberships">;
		}) {
			const fetchPage = async (offset?: string | null) => {
				const { data } = await client.GET("/memberships", {
					params: {
						query: {
							parent: opts?.parent,
							member: opts?.member,
							limit: 50,
							offset: offset ?? undefined,
							opt_fields: opts?.fields,
						},
					},
				});
				return data;
			};

			return paginate(fetchPage, { limitTotal: opts?.limit });
		},
	};
}
