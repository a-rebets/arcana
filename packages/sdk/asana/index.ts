import { createOpenAPIClient } from "./src/core/client";
import * as resources from "./src/resources";

type CreateSdkOptions = {
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
    users: resources.users(client),
    teams: resources.teams(client),
    teamMemberships: resources.teamMemberships(client),
    projects: resources.projects(client),
    workspaceMemberships: resources.workspaceMemberships(client),
    workspaces: resources.workspaces(client),
    tasks: resources.tasks(client),
    userTaskLists: resources.userTaskLists(client),
    sections: resources.sections(client),
    memberships: resources.memberships(client),
    tags: resources.tags(client),
  };
}

export type {
  AsanaApiClient,
  AsanaComponents,
  AsanaPaths,
} from "./src/core/client";
export * from "./src/core/type-utilities";
export * from "./src/resources/types";
