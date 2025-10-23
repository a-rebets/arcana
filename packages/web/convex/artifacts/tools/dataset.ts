import { createTool } from "@convex-dev/agent";
import { z } from "zod";
import { internal } from "../../_generated/api";
import type { Doc, Id } from "../../_generated/dataModel";

const createDatasetTool = createTool({
  description: `Create datasets for charting. Use only when you have actual data to save (from Asana, user input, or mock data).

Before calling:
- Construct the data array with all values filled in
- Define the matching TypeScript schema
- Provide all three parameters (name, data, schema)

CRITICAL: 
- You must provide ALL THREE fields: name, data, and schema. Empty or undefined values will fail.
- The data parameter must be an actual array of objects with values, not undefined or empty.
- After calling: Confirm save briefly without reciting the data (user sees it in UI).`,
  args: z.object({
    name: z
      .string()
      .describe("Dataset name (required). Example: 'Q4 Sales by Region'"),
    data: z
      .array(z.record(z.any(), z.any()))
      .min(1, "Dataset must contain at least one row of data")
      .describe(
        "REQUIRED: Array of data objects with actual values. Must be constructed before calling this tool. Each object must have properties matching the TS type schema. Example: [{region: 'North', sales: 1200}, {region: 'South', sales: 950}]. Cannot be undefined or empty.",
      ),
    schema: z
      .string()
      .describe(
        "REQUIRED: TypeScript type definition of your data, may be complex if needed. Example: 'interface Row { region: string; sales: number; }\\ntype DATA = Row[]'",
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

    return `Dataset saved successfully. ID: \`${result}\`. Do not recite the data - user can see it in the UI.`;
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
