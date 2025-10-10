"use node";

import { createHash } from "node:crypto";
import { v } from "convex/values";
import { internalAction } from "../_generated/server";

export function generateDataHash(data: unknown): string {
  const jsonString = JSON.stringify(data, null, 0);
  return createHash("sha256").update(jsonString).digest("hex");
}

export const getDatasetHash = internalAction({
  args: {
    data: v.any(),
  },
  handler: async (_, args) => {
    return generateDataHash(args.data);
  },
});
