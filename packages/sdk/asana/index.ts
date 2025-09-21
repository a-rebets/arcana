export type { AsanaHttpClient } from "./src/core/client";
export { createOpenAPIClient } from "./src/core/client";
export { paginate } from "./src/core/paginate";

export type { WithRequired } from "./src/core/types";
export { castArrayWithOptFields, castWithOptFields } from "./src/core/types";

export type {
	components as AsanaComponents,
	paths as AsanaPaths,
} from "./src/lib/api";

// Re-export resource types
export type { ProjectCompact, ProjectResponse } from "./src/resources/projects";
export type { TeamMembershipCompact } from "./src/resources/team-memberships";
export type { TeamCompact } from "./src/resources/teams";
export type { UserCompact } from "./src/resources/users";
export type { WorkspaceMembershipCompact } from "./src/resources/workspace-memberships";
export type {
	WorkspaceCompact,
	WorkspaceResponse,
} from "./src/resources/workspaces";

// Import resource creators
import { createOpenAPIClient } from "./src/core/client";
import { createProjects } from "./src/resources/projects";
import { createTeamMemberships } from "./src/resources/team-memberships";
import { createTeams } from "./src/resources/teams";
import { createUsers } from "./src/resources/users";
import { createWorkspaceMemberships } from "./src/resources/workspace-memberships";
import { createWorkspaces } from "./src/resources/workspaces";

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
		teamMemberships: createTeamMemberships(client),
		projects: createProjects(client),
		workspaceMemberships: createWorkspaceMemberships(client),
		workspaces: createWorkspaces(client),
	} as const;
}
