import { createTool } from "@convex-dev/agent";
import {
  castArrayWithOptFields,
  type ProjectResponse,
  type TeamMembershipCompact,
} from "asana-sdk";
import { type AsanaSdkClient, createAsanaClient } from "./http";
import { ListUserProjectsInput } from "./schemas";
import type { AsanaToolCtx } from "./types";

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
      fields: ["name"],
    }),
  );
}

type ListUserProjectsParams = {
  limit?: number;
  userGid: string;
  workspaceGid: string;
  teamGids?: string[];
  includeArchived: boolean;
  token: string;
};

async function listUserProjects({
  token,
  userGid,
  workspaceGid,
  teamGids,
  includeArchived,
  limit,
}: ListUserProjectsParams) {
  const sdk = createAsanaClient(token);

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

const listUserProjectsTool = createTool({
  description:
    "List projects a user is a member of within a workspace, optionally filtering by teams.",
  args: ListUserProjectsInput,
  handler: async (ctx: AsanaToolCtx, args) => {
    const token = ctx.asanaToken;
    if (!token) {
      throw new Error(
        "Missing Asana access token in experimental_context.asanaToken",
      );
    }
    return listUserProjects({ token, ...args });
  },
});

const labels = {
  "input-streaming": "Listing projects for the user...",
  "output-available": "Listed projects",
  "output-error": "Failed to list projects",
} as const;

export default {
  tool: listUserProjectsTool,
  labels,
};
