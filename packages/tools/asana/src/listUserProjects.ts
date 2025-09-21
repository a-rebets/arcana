import { tool } from "ai";
import {
  castArrayWithOptFields,
  type ProjectResponse,
  type TeamMembershipCompact,
} from "asana-sdk";
import type { z } from "zod";
import { type AsanaSdkClient, createAsanaClient } from "./http";
import { ListUserProjectsInput } from "./schemas";

async function getUserTeams(
  sdk: AsanaSdkClient,
  userGid: string,
  workspaceGid: string,
) {
  const teamMemberships = castArrayWithOptFields<TeamMembershipCompact, "team">(
    await sdk.teamMemberships.getTeamMembershipsForUser(userGid, workspaceGid, {
      limit: 500,
      fields: ["team", "team.name"],
    }),
  );

  return teamMemberships
    .map((membership) => membership.team?.gid)
    .filter((gid): gid is string => Boolean(gid));
}

async function getTeamProjects(
  sdk: AsanaSdkClient,
  teamId: string,
  includeArchived: boolean,
  limit?: number,
) {
  return castArrayWithOptFields<ProjectResponse, "team" | "workspace">(
    await sdk.projects.getProjectsForTeam(teamId, {
      includeArchived,
      limit,
      fields: ["name", "team", "team.name", "workspace", "workspace.name"],
    }),
  );
}

export async function listUserProjects(
  args: z.infer<typeof ListUserProjectsInput>,
  context: { token: string },
) {
  const { userGid, workspaceGid, teamGids, includeArchived, limit } =
    ListUserProjectsInput.parse(args);

  const sdk = createAsanaClient(context.token);

  let teams: string[] = teamGids ?? [];
  if (!teams.length) {
    teams = await getUserTeams(sdk, userGid, workspaceGid);
  }

  const projects = [];
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
