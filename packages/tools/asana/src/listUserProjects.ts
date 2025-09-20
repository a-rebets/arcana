import { tool } from "ai";
import {
	castExpandedArray,
	type ProjectCompact,
	type ProjectExpandedShape,
	type TeamMembershipCompact,
	type TeamMembershipExpandedShape,
} from "asana-sdk";
import type { z } from "zod";
import { createAsanaClient } from "./http";
import { ListUserProjectsInput } from "./schemas";

type ListUserProjectsOutput = {
	projects: Array<ProjectCompact & ProjectExpandedShape>;
};

async function getUserTeams(
	sdk: ReturnType<typeof createAsanaClient>,
	userGid: string,
	workspaceGid: string,
): Promise<string[]> {
	const teamMemberships = castExpandedArray<
		TeamMembershipCompact,
		TeamMembershipExpandedShape
	>(
		await sdk.teams.getTeamMembershipsForUser(userGid, workspaceGid, {
			limit: 500,
			fields: ["team", "team.name"],
		}),
	);

	return teamMemberships
		.map((membership) => membership.team?.gid)
		.filter((gid): gid is string => Boolean(gid));
}

async function getTeamProjects(
	sdk: ReturnType<typeof createAsanaClient>,
	teamId: string,
	includeArchived: boolean,
	limit?: number,
): Promise<Array<ProjectCompact & ProjectExpandedShape>> {
	return castExpandedArray<ProjectCompact, ProjectExpandedShape>(
		await sdk.projects.getProjectsForTeam(teamId, {
			includeArchived,
			limit,
		}),
	);
}

export async function listUserProjects(
	args: z.infer<typeof ListUserProjectsInput>,
	context: { token: string },
): Promise<ListUserProjectsOutput> {
	const { userGid, workspaceGid, teamGids, includeArchived, limit } =
		ListUserProjectsInput.parse(args);

	const sdk = createAsanaClient(context.token);

	let teams: string[] = teamGids ?? [];
	if (!teams.length) {
		teams = await getUserTeams(sdk, userGid, workspaceGid);
	}

	const projects: Array<ProjectCompact & ProjectExpandedShape> = [];
	for (const teamId of teams) {
		const teamProjects = await getTeamProjects(
			sdk,
			teamId,
			includeArchived,
			limit,
		);
		projects.push(...teamProjects);

		if (limit && projects.length >= limit) {
			break;
		}
	}

	const limitedProjects = limit ? projects.slice(0, limit) : projects;

	return { projects: limitedProjects };
}

export const listUserProjectsTool = tool({
	description:
		"List projects a user is a member of within a workspace, optionally filtering by teams.",
	inputSchema: ListUserProjectsInput,
	execute: async (input, opts) => {
		const ctx = opts.experimental_context as { asanaToken?: string };
		const token = ctx.asanaToken;
		if (!token) {
			throw new Error(
				"Missing Asana access token in experimental_context.asanaToken",
			);
		}
		return listUserProjects(input, { token });
	},
});
