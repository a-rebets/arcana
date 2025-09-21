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
export type {
	MembershipCompact,
	MembershipResponse,
} from "./src/resources/memberships";
export type { ProjectCompact, ProjectResponse } from "./src/resources/projects";
export type { SectionCompact, SectionResponse } from "./src/resources/sections";
export type { TagCompact, TagResponse } from "./src/resources/tags";
export type { TaskCompact, TaskResponse } from "./src/resources/tasks";
export type { TeamMembershipCompact } from "./src/resources/team-memberships";
export type { TeamCompact } from "./src/resources/teams";
export type { UserTaskListResponse } from "./src/resources/user-task-lists";
export type { UserCompact } from "./src/resources/users";
export type { WorkspaceMembershipCompact } from "./src/resources/workspace-memberships";
export type {
	WorkspaceCompact,
	WorkspaceResponse,
} from "./src/resources/workspaces";

// Import resource creators
import { createOpenAPIClient } from "./src/core/client";
import { createMemberships } from "./src/resources/memberships";
import { createProjects } from "./src/resources/projects";
import { createSections } from "./src/resources/sections";
import { createTags } from "./src/resources/tags";
import { createTasks } from "./src/resources/tasks";
import { createTeamMemberships } from "./src/resources/team-memberships";
import { createTeams } from "./src/resources/teams";
import { createUserTaskLists } from "./src/resources/user-task-lists";
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
		tasks: createTasks(client),
		userTaskLists: createUserTaskLists(client),
		sections: createSections(client),
		memberships: createMemberships(client),
		tags: createTags(client),
	} as const;
}
