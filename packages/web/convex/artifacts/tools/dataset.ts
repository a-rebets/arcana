import { createTool } from "@convex-dev/agent";
import { z } from "zod";
import { internal } from "../../_generated/api";
import type { Doc, Id } from "../../_generated/dataModel";

const createDatasetTool = createTool({
  description: `Create and save datasets for use in charts. Use this tool whenever the user asks for a dataset, whether mock/synthetic data or extracted from external sources.

WHEN TO USE:
- User explicitly asks to "create a dataset", "make a dataset", "generate data", etc.
- User requests mock/synthetic/sample data for visualization
- Data is extracted from Asana or other tools and needs to be saved for charting
- User wants to explore data through visualizations

IMPORTANT: Before creating a new dataset, check if a similar one exists using the list tool (once per conversation).

Examples of requests that require this tool:
- "Create a mock dataset for restaurant satisfaction scores"
- "Make a dataset of weekly sales data"
- "Save this project data as a dataset"
- "Generate sample data for customer churn"`,
  args: z.object({
    name: z
      .string()
      .describe(
        "Human-readable name for the dataset (e.g., 'Projects by Artem')",
      ),
    data: z
      .array(z.record(z.any(), z.any()))
      .describe("Array of JSON objects containing the actual data"),
    schema: z
      .string()
      .describe(
        'TypeScript types describing the data structure. Example: \'interface Project { id: string; name: string; status: "active" | "archived"; }\\ntype DATA = Project[]\'',
      ),
  }),
  handler: async (ctx, args): Promise<string> => {
    if (!ctx.threadId || !ctx.userId) {
      throw new Error("Thread ID and user ID are required");
    }
    const hash = await ctx.runAction(
      internal.artifacts.hashing.getDatasetHash,
      {
        data: args.data,
      },
    );
    const result = await ctx.runMutation(
      internal.artifacts.protected.createDataset,
      {
        name: args.name,
        rows: args.data,
        schema: args.schema,
        threadId: ctx.threadId,
        userId: ctx.userId as Id<"users">,
        hash,
      },
    );

    return `Dataset created with ID: \`${result}\``;
  },
});

type Dataset = Doc<"datasets">;
type DatasetEntry = Pick<Dataset, "name" | "schema"> & { id: Id<"datasets"> };

const listDatasetsTool = createTool({
  description:
    "List all available datasets. Returns dataset IDs, names, and schemas. Use this to see what data is available for creating charts.",
  args: z.object({}),
  handler: async (ctx): Promise<DatasetEntry[]> => {
    if (!ctx.threadId) {
      throw new Error("Thread ID is required");
    }
    return await ctx.runQuery(internal.artifacts.protected.listDatasetsByUser, {
      userId: ctx.userId as Id<"users">,
    });
  },
});

export { createDatasetTool, listDatasetsTool };
