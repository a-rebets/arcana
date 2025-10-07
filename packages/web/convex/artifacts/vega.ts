"use node";

import { vThreadDoc } from "@convex-dev/agent";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { v } from "convex/values";
import { compile, type TopLevelSpec } from "vega-lite";
import vlSchema from "vega-lite/build/vega-lite-schema.json";
import { internal } from "../_generated/api";
import type { Id } from "../_generated/dataModel";
import { internalAction } from "../_generated/server";

const ajv = new Ajv({
  allowUnionTypes: true,
  strictTypes: false,
  strictTuples: false,
});

addFormats(ajv);
ajv.addFormat("color-hex", () => true);

const validateVegaLite = ajv.compile(vlSchema);

function isVegaLiteSpec(spec: unknown): spec is TopLevelSpec {
  return validateVegaLite(spec);
}

export const processAndStoreChart = internalAction({
  args: {
    spec: v.optional(v.string()),
    dataset: v.array(v.any()),
    datasetId: v.id("datasets"),
    threadId: vThreadDoc.fields._id,
    userId: v.id("users"),
    parentArtifactId: v.optional(v.id("artifacts")),
    modelUsed: v.string(),
  },
  handler: async (ctx, args): Promise<Id<"artifacts">> => {
    const vlSpec = args.spec ? JSON.parse(args.spec) : null;

    if (!vlSpec || !isVegaLiteSpec(vlSpec)) {
      throw new Error(
        `Invalid Vega-Lite specification: ${
          validateVegaLite.errors
            ?.map((err) => `${err.instancePath || "root"}: ${err.message}`)
            .join(", ") || "Unknown validation error"
        }`,
      );
    }

    vlSpec.datasets = {
      current: args.dataset,
    };
    const vegaSpec = compile(vlSpec).spec;

    if (!vegaSpec) {
      throw new Error("Failed to compile Vega-Lite spec");
    }

    // Store specs as JSON strings to avoid Convex type validation issues
    // (Vega specs contain signal references and other non-Convex types)
    // Store vlSpec without datasets (just the structure)
    const artifactId = await ctx.runMutation(
      internal.artifacts.protected.createArtifact,
      {
        threadId: args.threadId,
        userId: args.userId,
        vlSpec: args.spec ?? "",
        vegaSpec: JSON.stringify(vegaSpec),
        datasetId: args.datasetId,
        parentArtifactId: args.parentArtifactId,
        modelUsed: args.modelUsed,
      },
    );

    return artifactId;
  },
});
