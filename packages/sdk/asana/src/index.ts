export type { AsanaHttpClient } from "./core/client";
export { createOpenAPIClient } from "./core/client";
export { paginate } from "./core/paginate";
export {
	castExpandedArray,
	type ProjectExpandedShape,
	type TeamMembershipExpandedShape,
} from "./core/types";
export type { components, paths } from "./lib/api";

// Re-export resource types
export type { ProjectCompact } from "./resources/projects";
export type { TeamCompact, TeamMembershipCompact } from "./resources/teams";
export type { UserCompact } from "./resources/users";
export type { WorkspaceMembershipCompact } from "./resources/workspace-memberships";

// Import resource creators
import { createOpenAPIClient } from "./core/client";
import { createProjects } from "./resources/projects";
import { createTeams } from "./resources/teams";
import { createUsers } from "./resources/users";
import { createWorkspaceMemberships } from "./resources/workspace-memberships";

export type CreateSdkOptions = {
	baseUrl?: string;
	token?: string;
};

export function createAsanaSdk(options?: CreateSdkOptions) {
	const { client, setToken, getToken } = createOpenAPIClient({
		baseUrl: options?.baseUrl,
		token: options?.token,
	});

	return {
		setToken,
		getToken,
		users: createUsers(client),
		teams: createTeams(client),
		projects: createProjects(client),
		workspaceMemberships: createWorkspaceMemberships(client),
	} as const;
}
