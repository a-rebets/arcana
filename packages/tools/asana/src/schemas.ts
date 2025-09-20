import { z } from "zod";

export const ListUserProjectsInput = z.object({
	userGid: z.string().default("me"),
	workspaceGid: z.string(),
	teamGids: z.array(z.string()).optional(),
	includeArchived: z.boolean().default(false),
	limit: z.number().int().min(1).max(500).optional(),
});

export type ListUserProjectsInput = z.infer<typeof ListUserProjectsInput>;

export const ListUserWorkspacesInput = z.object({
	userGid: z.string().default("me"),
	limit: z.number().int().min(1).max(500).optional(),
});

export type ListUserWorkspacesInput = z.infer<typeof ListUserWorkspacesInput>;
