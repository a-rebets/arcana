import type { InferUITools } from "ai";
import listUserProjectsTool from "./src/listUserProjects";
import listUserWorkspacesTool from "./src/listUserWorkspaces";
import type { ToolLabels } from "./src/types";

export type {
  ListUserProjectsInput,
  ListUserWorkspacesInput,
} from "./src/schemas";
export * from "./src/types";

export const asanaTools = {
  asana_listUserProjectsTool: listUserProjectsTool.tool,
  asana_listUserWorkspacesTool: listUserWorkspacesTool.tool,
};

export type AsanaTools = InferUITools<typeof asanaTools>;

export const asanaToolLabels: Record<keyof AsanaTools, ToolLabels> = {
  asana_listUserProjectsTool: listUserProjectsTool.labels,
  asana_listUserWorkspacesTool: listUserWorkspacesTool.labels,
};
